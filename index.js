/**
 * Copyright mmpro film- und medienproduktion GmbH and other Node contributors
 *
 */

const async = require('async');
const _ = require('lodash');

const acts = require('ac-ip')

const ratelimiter = () => {

  let environment = process.env.NODE_ENV || 'development'
  let routes = []
  let redis
  let logger
  let debugMode

  const init = (options) => {
    if (_.get(options, 'environment')) environment = _.get(options, 'environment')
    if (_.get(options, 'routes')) routes = _.get(options, 'routes')
    if (_.get(options, 'debugMode')) debugMode = _.get(options, 'debugMode')

    if (!_.get(options, 'redis')) {
      throw new Error('Redis instance is required')
    }
    redis = _.get(options, 'redis')
    if (!_.get(options, 'logger')) {
      throw new Error('Logger instance is required')
    }
    logger = _.get(options, 'logger')
  }

  const prepareRedisKey = (params) => {
    const ip = _.get(params, 'ip')
    const controller = _.get(params, 'controller', 'controller')
    const action = _.get(params, 'action', 'action')
    const token = _.get(params, 'token')
    const link = _.get(params, 'link')
  
    let redisKey = _.get(params, 'redisKey', (environment + ':rateLimiter:' + ip + ':' + controller + ':' + action))
    if (token) redisKey += ':' + token
    if (link) redisKey += ':' + link
    return redisKey
  }

  const limiter = (req, options, cb) => {
    const ip = _.get(req, 'determinedIP') || acts.determineIP(req)
    const knownIP = _.get(options, 'knownIP')
    const controller = _.get(req, 'options.controller')
    const action = _.get(req, 'options.action')
    const link = _.get(options, 'link')
    const name = _.get(options, 'name') || controller + '/' + action

    const redisKey = prepareRedisKey({
      ip,
      controller,
      action,
      token: _.get(options, 'token'),
      link,
      redisKey: _.get(options, 'redisKey')
    })

    const fallbackRoute = _.get(options, 'fallbackRoute', 'default')
    const settings = _.find(routes, { ip, route: name }) || _.find(routes, { route: name }) || _.find(routes, { route: fallbackRoute })
    const expires = _.get(options, 'expires', _.get(settings, 'expires', 3))
    const limit = _.get(options, 'limit', _.get(settings, 'limit', 150))
    const throttleLimit = _.get(options, 'throttleLimit', _.get(settings, 'throttleLimit', 50)) // optional
    const delay = _.get(options, 'delay', _.get(settings, 'delay', 250)) // delay in ms which kicks in if throttle if active

    let rateLimitCounter = !_.get(options, 'redisKey') && _.get(req, 'rateLimitCounter') && parseInt(_.get(req, 'rateLimitCounter'))

    const rateLogger = (params) => {
      const type = _.get(params, 'type')
      logger.warn(_.repeat('-', 80))
      if (debugMode) logger.warn('DEBUG MODE - DEBUG MODE - DEBUG MODE')
      logger.warn('%s | %s | %s | %s | Counter %s/%s', _.padEnd('ACRateLimiter', 15), _.padEnd(type, 12), _.padEnd(name, 32), _.padEnd((ip + ' ' + _.get(knownIP, 'name', '')), 16), rateLimitCounter, limit)
      if (link) logger.warn('%s | Link: %s', _.padEnd(' ', 15), link)
    }
  

    async.series({
      checKRedis: (done) => {
        if (rateLimitCounter) return done()
        redis.incr(redisKey, (err, result) => {
          if (err) {
            logger.error('ACRateLimiter | Redis failed %j', err)
            // silently ignore
            return done()
          }
          rateLimitCounter = result
          return done()
        })
      },
      processLimits: (done) => {
        if (rateLimitCounter === 1 && rateLimitCounter < limit) {
          // key has never been set before - set expire time and return
          redis.expire(redisKey, expires, done)
        }
        else if (rateLimitCounter > limit) {
          // only log every 10th entry
          if (rateLimitCounter === limit || rateLimitCounter % 10 === 0) {
            rateLogger({ type: 'Blocking' })
          }
          // debug mode shows the rate limiting but does not limit
          if (debugMode) return done()
          return done({ message: 'tooManyRequestsFromThisIP', status: 429, logging: false, counter: rateLimitCounter, additionalInfo: { expires } })
        }
        else if (throttleLimit && rateLimitCounter > limit * 0.9) {
          // at 90 percent delay with expire time, to avoid limit kicking in
          rateLogger({ type: 'Final Throttling' })
          _.delay(() => {
            // do not "taint" process time when deliberately throttline
            if (req._startTime) req._startTime += expires * 1000

            return done({ message: 'finalThrottlingActive_requestsIsDelayed', status: 900, additionalInfo: { expires } })
          }, expires * 1000)
        }
        else if (throttleLimit && rateLimitCounter > throttleLimit) {
          // log the first throttling and every 50th entry
          if (rateLimitCounter === (throttleLimit + 1) || rateLimitCounter % 50 === 0) {
            rateLogger({ type: 'Throttling' })
          }
          _.delay(() => {
            // do not "taint" process time when deliberately throttline
            if (req._startTime) req._startTime += delay

            return done({ message: 'throttlingActive_requestsIsDelayed', status: 900, additionalInfo: { expires } })
          }, delay)
        }
        else {
          return done()
        }
      }
    }, cb)
  }

  /**
   * Returns the current rate limit counter key or the result (with callback)
   * @param {} params.keyOnly If true, only the redis key is returned
   * @param {*} cb OPTIONAL callback with (err, counter)
   */
  const getCurrentCounter = (params, cb) => {
    const redisKey = prepareRedisKey(params)
    if (!_.get(params, 'keyOnly')) return redisKey
    redis.incr(redisKey, cb)
  }

  return {
    init,
    limiter,
    getCurrentCounter
  }

}
module.exports = ratelimiter()
