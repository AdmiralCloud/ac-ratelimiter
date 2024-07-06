const  { setTimeout } = require('timers/promises')

const NodeCache = require('node-cache')
const acts = require('ac-ip')
const { ACError } = require('ac-custom-error') 

class RateLimiter {
  constructor({ redisInstance, logger = console, routes = [], knownIPs = [], ignorePrivateIps } = {}) {
    // make sure only one instance exists!
    if (RateLimiter._instance) {
      return RateLimiter._instance
    }
    RateLimiter._instance = this;

    this.environment = process.env.NODE_ENV || 'development'
    if(redisInstance) {
      this.redisInstance = redisInstance
    }
    else {
      this.cache = new NodeCache()
    }

    this.limits = {
      expires: 3,
      limit: 150,
      throttleLimit: 50,
      delay: 250
    }

    this.logger = logger
    this.routes = routes
    this.knownIPs = knownIPs
    this.ignorePrivateIps = ignorePrivateIps
  }

  whichStorage() {
    if (this.redisInstance) return 'Redis'
    else return 'NodeCache'
  }

  // private 
  prepareRedisKey({ ip, controller = 'controller', action = 'action', clientId = 'clientId', identifier = 'identifier', redisKey }) {
    let rateLimiterKey = redisKey || (this.environment + ':rateLimiter:' + clientId + ':' + ip + ':' + controller + ':' + action)
    if (identifier) rateLimiterKey += ':' + identifier
    return rateLimiterKey
  }

  async limiter(req, { 
    ip = req?.determinedIP || acts.determineIP(req),
    clientId = 'clientId', 
    identifier = 'identifier', 
    redisKey,
    expires,
    limit,
    throttleLimit,
    delay,
    fallbackRoute = 'default',
    name,
    debugMode,
    rateLimitCounter
  }) {

    if (this.ignorePrivateIps && acts.isPrivateIP(ip)) return

    const logIdentifier = typeof identifier === 'string' && identifier.replace(/(\w{1,4})-(\w{1,4})/g, 'xxxx')
    const knownIP = this.knownIPs.find(({ knownIP }) => knownIP === ip)

    const controller = req?.options?.controller || 'controller'
    const action = req?.options?.action || 'action'
    const currentRoute = name || `${controller}/${action}`


    const rateLimiterKey = this.prepareRedisKey({
      ip,
      controller,
      action,
      clientId,
      identifier,
      redisKey
    })

    const rateLogger = ({ type, rateLimitCounter, currentLimit }) => {
      this.logger.warn('-'.repeat(80))
      if (debugMode) this.logger.warn('DEBUG MODE - DEBUG MODE - DEBUG MODE')
      this.logger.warn('%s | %s | %s | %s | Counter %s/%s', 'ACRateLimiter'.padEnd(15), type.padEnd(12), currentRoute.padEnd(32), (ip + ' ' + (knownIP?.name || '')).padEnd(16), rateLimitCounter, currentLimit)
      if (logIdentifier) this.logger.warn('%s | Identifier: %s', ' '.padEnd(15), logIdentifier)
    }

    let settings = this.routes.find(item => {
      if (ip && clientId && currentRoute && item.ip === ip && item.clientId === clientId && item.route === currentRoute ) return item
      else if (ip && currentRoute && item.ip === ip && item.route === currentRoute && !item.clientId ) return item
      else if (clientId && currentRoute && item.clientId === clientId && item.route === currentRoute && !item.ip) return item
      else if (currentRoute && item.route === currentRoute && !item.clientId && !item.ip) return item
    })
    if (!settings) {
      // check fallback route
      settings = this.routes.find(item => {
        if (item.route === fallbackRoute && !item.clientId && !item.ip) return item
      })
    }
    
    const current = {
      expires,
      limit,
      throttleLimit,
      delay
    }

    const props = ['expires', 'limit', 'throttleLimit', 'delay']
    props.forEach(prop => {
      if (!Number.isFinite(current[prop])) {
        // use from setting
        if (Number.isFinite(settings?.[prop])) current[prop] = settings[prop]
        else current[prop] = this.limits[prop]
      }
    })

    if (rateLimitCounter) {
      // if rateLimitCounter is sent with the request, then don't fetch it again
    }
    else if (this.redisInstance) {
      // use Redis instance for rate limiting
      rateLimitCounter = await this.redisInstance.incr(rateLimiterKey)
      if (rateLimitCounter === 1 && rateLimitCounter < current.limit) {
        // key has never been set before - set expire time and return
        await this.redisInstance.expire(redisKey, expires)
      }
    }
    else {
      // use Node cache (memory) for rate limiting - please see README before using in production!
      rateLimitCounter = this.cache.get(rateLimiterKey)
      const ts = this.cache.getTtl(rateLimiterKey) // ts in ms when the key will expire
      rateLimitCounter = rateLimitCounter + 1 || 1
      if (ts === undefined || ts === 0) {
        // first entry - set expiration
        this.cache.set(rateLimiterKey, rateLimitCounter, current?.expires )
      }
      else {
        // update but use the existing timestamp
        const newTTL = ts - new Date().getTime()
        this.cache.set(rateLimiterKey, rateLimitCounter, Math.ceil(newTTL/1000))
      }
    }

    if (debugMode) {
      console.log('Route %s | Current Counter %s | Throttle %s | Limit %s | Delay %s | Expires %s', currentRoute, rateLimitCounter, current.throttleLimit, current.limit, current.delay, current.expires) 
    }

    if (rateLimitCounter > current.limit) {
      // only log every 10th entry
      if (rateLimitCounter === current.limit || rateLimitCounter % 10 === 0) {
        rateLogger({ type: 'Blocking', rateLimitCounter, currentLimit: current.limit })
      }
      throw new ACError('tooManyRequestsFromThisIP', 429, { logging: false, counter: rateLimitCounter, expires: current.expires })
      
    }
    else if (current.throttleLimit && rateLimitCounter > current.limit * 0.9) {
      // at 90 percent delay with expire time, to avoid limit kicking in
      rateLogger({ type: 'Final Throttling', rateLimitCounter, currentLimit: current.limit })
      await setTimeout(current.expires * 1000)
      // do not "taint" process time when deliberately throttline
      if (req._startTime) req._startTime += current.expires * 1000
      throw new ACError('finalThrottlingActive_requestsIsDelayed', 900, { counter: rateLimitCounter, expires: current.expires })
    }
    else if (current.throttleLimit && rateLimitCounter > current.throttleLimit) {
      // log the first throttling and every 50th entry
      if (rateLimitCounter === (throttleLimit + 1) || rateLimitCounter % 50 === 0) {
        rateLogger({ type: 'Throttling', rateLimitCounter, currentLimit: current.limit })
      }
      await setTimeout(current.delay)
      // do not "taint" process time when deliberately throttline
      if (req._startTime) req._startTime += current.delay
      throw new ACError('throttlingActive_requestsIsDelayed', 900, { counter: rateLimitCounter, expires: current.expires })
    }
  }

  async updateLimiter({ routes, knownIPs, ignorePrivateIps }) {
    if (Array.isArray(routes)) this.routes = routes
    if (Array.isArray(knownIPs)) this.knownIPs = knownIPs
    if (typeof ignorePrivateIps === 'boolean') this.ignorePrivateIps = ignorePrivateIps
  }

  async resetLimiter() {
    // reset completely
    this.cache.flushAll()
  }


}

module.exports = RateLimiter