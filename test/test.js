const assert = require('node:assert/strict')
const  { setTimeout } = require('timers/promises')

const ratelimiterModule = require('../index')

const FakeRedis = require('./fakeRedis')
const redis = new FakeRedis()

const req = {
  options: {
    controller: 'user',
    action: 'find',
  },
  determinedIP: '1.2.3.4'
}


const initOptions = {
  routes: [
    { route: 'user/find', throttleLimit: 1, limit: 2, expires: 3, delay: 250 },
  ]
}
const options = {}

const ratelimiter = new ratelimiterModule(initOptions)
let ratelimiterRedis


describe('Use NodeCache', () => {

  describe('Test section #1', function () {
    describe('RATE LIMITER TEST', function() {
      this.timeout(5000)

      it('Reset Limiter', async() => {
        await ratelimiter.resetLimiter()
      })

      it('should not trigger - req #1', async() => {
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })
      it('should throttle - req #2 - Normal Throttling throws 900', async() => {
        await assert.rejects(() => ratelimiter.limiter(req, options), { message: 'throttlingActive_requestsIsDelayed', code: 900 })
      })
      it('should trigger the limiter - req #3 - counter exceeds limit', async() => {
        await assert.rejects(() => ratelimiter.limiter(req, options), { message: 'tooManyRequestsFromThisIP', code: 429 })
      })
    })
  })


  describe('Test section #2 - immediate limiter', function () {
    describe('RATE LIMITER TEST', function() {
      this.timeout(5000)

      it('Reset Limiter', async() => {
        await ratelimiter.resetLimiter()
      })

      it('Update settings', async() => {
        await ratelimiter.updateLimiter({
          routes: [
            { route: 'user/find', limit: 0, expires: 3, delay: 250 },
          ]
        })
      })

      it('should trigger immediately', async()  => {
        req.determinedIP = '4.1.4.1'
        await assert.rejects(() => ratelimiter.limiter(req, options), { message: 'tooManyRequestsFromThisIP', code: 429 })
      })
    })
  })


  describe('Test section #3 - no throttling', function () {
    describe('RATE LIMITER TEST', function() {
      this.timeout(5000)
      it('Reset Limiter', async() => {
        await ratelimiter.resetLimiter()
      })

      it('Update settings', async() => {
        await ratelimiter.updateLimiter({
          routes: [
            { route: 'user/find', throttleLimit: 0, limit: 2, expires: 3, delay: 0 },
          ]
        })
      })

      it('should not trigger req #1', async() => {
        req.determinedIP = '2.3.4.1'
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })
      it('should not trigger req #2 - throttleLimit is 0 so no throttling fires', async() => {
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })
      it('should trigger the limiter req #3 - counter exceeds limit', async() => {
        await assert.rejects(() => ratelimiter.limiter(req, options), { message: 'tooManyRequestsFromThisIP', code: 429 })
      })
    })
  })

  describe('Test section #4 - routes with clientId', function() {
    describe('RATE LIMITER TEST', function() {
      this.timeout(5000)
      const req = {
        options: {
          controller: 'customer',
          action: 'find'
        },
        determinedIP: '1.2.3.4'
      }
      let options = {
        clientId: 'abc',
        routes: [
          { route: 'customer/find', clientId: 'abc', throttleLimit: 1, limit: 2, expires: 3, delay: 250 },
          { route: 'customer/find', throttleLimit: 3, limit: 10, expires: 3, delay: 250 },
        ]
      }

      it('Reset Limiter and update routes', async() => {
        await ratelimiter.resetLimiter()
        await ratelimiter.updateLimiter({ routes: options.routes })
      })

      it('should not trigger - req #1', async() => {
        const result = await ratelimiter.limiter(req, { clientId: options.clientId })
        assert.equal(result, undefined)
      })
      it('should throttle - req #2 - Normal Throttling throws 900', async() => {
        await assert.rejects(() => ratelimiter.limiter(req, { clientId: options.clientId }), { message: 'throttlingActive_requestsIsDelayed', code: 900 })
      })
      it('should trigger the limiter - req #3 - counter exceeds limit', async() => {
        await assert.rejects(() => ratelimiter.limiter(req, { clientId: options.clientId }), { message: 'tooManyRequestsFromThisIP', code: 429 })
      })

      it('Now make request without clientId - should throttle after 3 requests', async() => {
        options = {}
      })

      it('should not trigger #1', async() => {
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })

      it('should not trigger #2', async() => {
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })

      it('should not trigger #3', async() => {
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })

      it('should delay request #4', async() => {
        await assert.rejects(() => ratelimiter.limiter(req, options), { message: 'throttlingActive_requestsIsDelayed', code: 900 })
      })
    })
  })

  describe('Test section #5 - no limiting', function () {
    describe('RATE LIMITER TEST', function() {
      this.timeout(5000)
      const req = {
        options: {
          controller: 'search',
          action: 'search'
        },
        determinedIP: '1.2.3.4'
      }

      it('Reset Limiter', async() => {
        await ratelimiter.resetLimiter()
      })

      it('should not trigger #1', async() => {
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })

      it('should not trigger #2', async() => {
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })

      it('should not trigger #3', async() => {
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })

      it('should not trigger #4', async() => {
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })

      it('should not trigger #5', async() => {
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })
    })
  })

  describe('Test section #6 - ignore ignorePrivateIps', function () {
    describe('RATE LIMITER TEST - ignorePrivateIps', function() {
      this.timeout(5000)

      const req = {
        options: {
          controller: 'user',
          action: 'find'
        },
        determinedIP: '4.1.4.1'
      }

      it('Reset Limiter', async() => {
        await ratelimiter.resetLimiter()
      })

      it('Update settings', async() => {
        await ratelimiter.updateLimiter({
          routes: [
            { route: 'user/find', limit: 0, expires: 3, delay: 250 }
          ],
          ignorePrivateIps: true
        })
      })

      it('should trigger immediately', async() => {
        await assert.rejects(() => ratelimiter.limiter(req, options), { message: 'tooManyRequestsFromThisIP', code: 429 })
      })

      it('should not trigger', async() => {
        req.determinedIP = '127.0.0.1'
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })

      it('should not trigger - private IPv6', async() => {
        req.determinedIP = 'FD8A:4C5D:3E1F:0001:ABCD:1234:5678:9ABC'
        const result = await ratelimiter.limiter(req, options)
        assert.equal(result, undefined)
      })

      after(async() => {
        // don't leak the flag into later sections
        await ratelimiter.updateLimiter({ ignorePrivateIps: false })
      })
    })
  })

  describe('Test section #7 - send rateLimitCounter with request', function() {
    describe('RATE LIMITER TEST - send rateLimitCounter', function() {
      this.timeout(5000)

      it('Reset Limiter', async() => {
        await ratelimiter.resetLimiter()
      })

      it('Update settings', async() => {
        await ratelimiter.updateLimiter({
          routes: [
            { route: 'user/find', limit: 2, expires: 3, delay: 250 }
          ]
        })
      })

      it('should not trigger', async() => {
        const result = await ratelimiter.limiter(req, { rateLimitCounter: 0 })
        assert.equal(result, undefined)
      })

      it('should trigger immediately', async() => {
        await assert.rejects(() => ratelimiter.limiter(req, { rateLimitCounter: 100 }), { message: 'tooManyRequestsFromThisIP', code: 429 })
      })


    })
  })

})

describe('Use Redis', () => {

  before(() => {
    // RateLimiter is a singleton - drop the NodeCache instance to get a Redis based one
    ratelimiterModule._instance = undefined
    ratelimiterRedis = new ratelimiterModule({ redisInstance: redis, routes: initOptions.routes })
  })

  after(() => {
    ratelimiterModule._instance = ratelimiter
  })

  describe('Use Redis for ratelimiter', function() {
    this.timeout(5000)

    it('Update settings', async() => {
      await ratelimiterRedis.updateLimiter({
        routes: [
        { route: 'user/find', limit: 0, expires: 2, delay: 250 },
        ],
      })
    })

    it('should trigger immediately', async()  => {
      req.determinedIP = '4.1.4.1'
      await assert.rejects(() => ratelimiterRedis.limiter(req, options), { message: 'tooManyRequestsFromThisIP', code: 429 })
    })

    it('wait for rate limiter to reset', async() => {
      await setTimeout(3000)
    })

    it('Update settings', async() => {
      await ratelimiterRedis.updateLimiter({
        routes: [
          { route: 'user/find', throttleLimit: 1, limit: 2, expires: 3, delay: 250 },
        ],
      })
    })

    it('req #1 should not trigger', async()  => {
      const result = await ratelimiterRedis.limiter(req, options)
      assert.equal(result, undefined)
    })

    it('req #2 Normal Throttling - throws 900', async()  => {
      await assert.rejects(() => ratelimiterRedis.limiter(req, options), e => {
        assert.equal(e.message, 'throttlingActive_requestsIsDelayed')
        assert.equal(e.code, 900)
        assert.equal(e.additionalInfo.counter, 2)
        return true
      })
    })

    it('req #3 exceeds limit - throws 429', async()  => {
      await assert.rejects(() => ratelimiterRedis.limiter(req, options), { message: 'tooManyRequestsFromThisIP', code: 429 })
    })

  })

  describe('Redis - counter resets after TTL expires', function() {
    this.timeout(8000)

    const reqReset = {
      options: { controller: 'reset', action: 'verify' },
      determinedIP: '5.6.7.8'
    }

    it('Update settings - limit=2, expires=2', async() => {
      await ratelimiterRedis.updateLimiter({
        routes: [
          { route: 'reset/verify', throttleLimit: 0, limit: 2, expires: 2, delay: 0 },
        ],
      })
    })

    it('req #1 should not trigger', async() => {
      const result = await ratelimiterRedis.limiter(reqReset, options)
      assert.equal(result, undefined)
    })

    it('req #2 should not trigger', async() => {
      const result = await ratelimiterRedis.limiter(reqReset, options)
      assert.equal(result, undefined)
    })

    it('req #3 exceeds limit - throws 429', async() => {
      await assert.rejects(() => ratelimiterRedis.limiter(reqReset, options), { message: 'tooManyRequestsFromThisIP', code: 429 })
    })

    it('wait for TTL to expire (3s)', async() => {
      await setTimeout(3000)
    })

    it('req #4 after TTL reset - should not trigger (counter must have reset to 0)', async() => {
      const result = await ratelimiterRedis.limiter(reqReset, options)
      assert.equal(result, undefined)
    })

    it('req #5 after TTL reset - should not trigger', async() => {
      const result = await ratelimiterRedis.limiter(reqReset, options)
      assert.equal(result, undefined)
    })

  })

  describe('Redis - limit=1 must still set a TTL', function() {
    this.timeout(5000)

    const reqLimitOne = {
      options: { controller: 'limitOne', action: 'verify' },
      determinedIP: '5.6.7.9'
    }

    it('Update settings - limit=1, expires=1', async() => {
      await ratelimiterRedis.updateLimiter({
        routes: [
          { route: 'limitOne/verify', throttleLimit: 0, limit: 1, expires: 1, delay: 0 },
        ],
      })
    })

    it('req #1 should not trigger', async() => {
      assert.equal(await ratelimiterRedis.limiter(reqLimitOne, options), undefined)
    })

    it('req #2 exceeds limit - throws 429', async() => {
      await assert.rejects(() => ratelimiterRedis.limiter(reqLimitOne, options), { message: 'tooManyRequestsFromThisIP', code: 429 })
    })

    it('wait for TTL to expire (1.5s)', async() => {
      await setTimeout(1500)
    })

    it('req #3 after TTL reset - should not trigger', async() => {
      assert.equal(await ratelimiterRedis.limiter(reqLimitOne, options), undefined)
    })

  })

})


describe('Normal Throttling - no more Final Throttling block', () => {

  describe('NodeCache - requests in 90%-100% range use Normal Throttling', function() {
    this.timeout(5000)

    const reqRange = {
      options: { controller: 'asset', action: 'get' },
      determinedIP: '10.0.0.1'
    }

    it('Reset Limiter', async() => {
      await ratelimiter.resetLimiter()
    })

    it('Update settings - throttleLimit=8, limit=10 (90% = counter 9)', async() => {
      await ratelimiter.updateLimiter({
        routes: [
          { route: 'asset/get', throttleLimit: 8, limit: 10, expires: 5, delay: 100 }
        ]
      })
    })

    it('requests below throttleLimit (1-8) pass through without delay', async() => {
      for (let i = 0; i < 8; i++) {
        const result = await ratelimiter.limiter(reqRange, options)
        assert.equal(result, undefined)
      }
    })

    it('request at 90% of limit (counter=9) uses Normal Throttling - throws 900', async() => {
      await assert.rejects(() => ratelimiter.limiter(reqRange, options), { message: 'throttlingActive_requestsIsDelayed', code: 900 })
    })

    it('request at limit (counter=10) still uses Normal Throttling - throws 900', async() => {
      await assert.rejects(() => ratelimiter.limiter(reqRange, options), { message: 'throttlingActive_requestsIsDelayed', code: 900 })
    })

    it('request exceeding limit (counter=11) returns 429 immediately', async() => {
      await assert.rejects(() => ratelimiter.limiter(reqRange, options), { message: 'tooManyRequestsFromThisIP', code: 429 })
    })

  })

})


describe('Normal Throttling - concurrent waiting counter cap', () => {

  const reqWaiting = {
    options: { controller: 'media', action: 'process' },
    determinedIP: '9.9.9.9'
  }

  // Helper to read waiting counter from NodeCache
  const getWaitingCount = () => {
    const ip = reqWaiting.determinedIP
    const controller = reqWaiting.options.controller
    const action = reqWaiting.options.action
    const rateLimiterKey = ratelimiter.environment + ':rateLimiter:clientId:' + ip + ':' + controller + ':' + action + ':identifier'
    return ratelimiter.cache.get(rateLimiterKey + ':waiting') || 0
  }

  describe('NodeCache - waiting counter', function() {
    this.timeout(10000)

    it('Reset Limiter', async() => {
      await ratelimiter.resetLimiter()
    })

    it('Update settings', async() => {
      await ratelimiter.updateLimiter({
        routes: [
          { route: 'media/process', throttleLimit: 1, limit: 100, expires: 5, delay: 300 }
        ]
      })
    })

    it('10 concurrent waiters allowed, 11th gets 429 immediately', async() => {
      // req #1 passes (counter=1 <= throttleLimit=1)
      // reqs #2-11 enter Normal Throttling, waiting counter reaches 10
      // req #12 finds waiting=11 > 10 → immediate 429 (tooManyRequestsFromThisIP)
      const promises = []
      for (let i = 0; i < 12; i++) {
        promises.push(ratelimiter.limiter(reqWaiting, options).catch(e => e))
      }
      const results = await Promise.all(promises)
      const errors = results.filter(r => r instanceof Error)
      // NodeCache is single-threaded: the 12th request sees exactly waiting=11 → exactly 1 cap-429
      const immediate429 = errors.filter(e => e.code === 429 && e.message === 'tooManyRequestsFromThisIP')
      assert.equal(immediate429.length, 1)
    })

    it('waiting counter is 0 after all concurrent requests complete', async() => {
      assert.equal(getWaitingCount(), 0)
    })

    it('waiting counter is decremented via finally even when throttle error is thrown', async() => {
      await ratelimiter.resetLimiter()
      // req #1 passes
      await ratelimiter.limiter(reqWaiting, options)
      // req #2 triggers Normal Throttling - increments waiting, delays, throws 900
      await assert.rejects(() => ratelimiter.limiter(reqWaiting, options), { code: 900 })
      // finally must have run and decremented the counter back to 0
      assert.equal(getWaitingCount(), 0)
    })

  })

})

describe('Bug: NodeCache window never expires under sustained low-rate traffic', () => {

  const reqSustained = {
    options: { controller: 'sustained', action: 'traffic' },
    determinedIP: '8.8.4.4'
  }

  // mirrors prepareRedisKey() for the default clientId/identifier used when neither is sent
  const rateLimiterKey = ratelimiter.environment + ':rateLimiter:clientId:' + reqSustained.determinedIP + ':sustained:traffic:identifier'

  describe('NodeCache - expires window should reset, but Math.ceil() re-arms the TTL on every hit', function() {
    this.timeout(10000)

    it('Reset Limiter', async() => {
      await ratelimiter.resetLimiter()
    })

    it('Update settings - expires=1s, no throttling/blocking so only the counter/TTL behaviour is observed', async() => {
      await ratelimiter.updateLimiter({
        routes: [
          { route: 'sustained/traffic', throttleLimit: 0, limit: 1000, expires: 1, delay: 0 }
        ]
      })
    })

    it('a low, steady rate (well under any burst limit) should let the 1s window expire and reset the counter, but it never does', async() => {
      // 3 requests/sec for 2.4s -> spans more than two 1s windows.
      // A correctly resetting fixed window would show the counter drop back down after ~1s.
      // The buggy Math.ceil(newTTL/1000) re-arm keeps the key alive indefinitely instead.
      for (let i = 0; i < 8; i++) {
        await ratelimiter.limiter(reqSustained, options)
        await setTimeout(300)
      }
      // one more hit right away, then read state immediately - avoids a race where the
      // window closed a moment earlier and the key briefly does not exist at all
      await ratelimiter.limiter(reqSustained, options)

      const counter = ratelimiter.cache.get(rateLimiterKey)
      const ttl = ratelimiter.cache.getTtl(rateLimiterKey)

      // expected: window has reset at least once in 2.4s at expires=1s, so the counter
      // should be small (a handful of hits since the last reset), not the full call count (9).
      assert.ok(counter <= 4)
      // expected: a window's TTL is never re-armed beyond its configured length (1s)
      assert.ok(ttl - new Date().getTime() <= 1000)
    })
  })
})

describe('Redis - throttling and waiting counter', () => {
  const reqRedis = {
    options: { controller: 'media', action: 'redisThrottle' },
    determinedIP: '7.7.7.7'
  }
  const waitingKey = () => ratelimiterRedis.prepareRedisKey({
    ip: reqRedis.determinedIP,
    controller: reqRedis.options.controller,
    action: reqRedis.options.action
  }) + ':waiting'

  before(async () => {
    ratelimiterModule._instance = undefined
    ratelimiterRedis = new ratelimiterModule({
      redisInstance: redis,
      routes: [{ route: 'media/redisThrottle', throttleLimit: 1, limit: 100, expires: 5, delay: 50 }]
    })
    await redis.flushall()
  })

  after(() => {
    ratelimiterModule._instance = ratelimiter
  })

  it('whichStorage returns Redis', () => {
    assert.equal(ratelimiterRedis.whichStorage(), 'Redis')
  })

  it('whichStorage returns NodeCache', () => {
    assert.equal(ratelimiter.whichStorage(), 'NodeCache')
  })

  it('req #1 passes, req #2 is throttled (900) and waiting counter returns to 0', async () => {
    assert.equal(await ratelimiterRedis.limiter(reqRedis, { debugMode: true }), undefined)
    await assert.rejects(() => ratelimiterRedis.limiter(reqRedis, {}), { code: 900 })
    assert.equal(await redis.get(waitingKey()), 0)
  })

  it('11th concurrent waiter gets 429', async () => {
    await redis.flushall()
    const promises = []
    for (let i = 0; i < 12; i++) {
      promises.push(ratelimiterRedis.limiter(reqRedis, {}).catch(e => e))
    }
    const results = await Promise.all(promises)
    const capped = results.filter(r => r instanceof Error && r.code === 429)
    assert.equal(capped.length, 1)
    assert.equal(await redis.get(waitingKey()), 0)
  })
})

describe('NodeCache - debug mode and throttling log', () => {
  const reqLog = {
    options: { controller: 'log', action: 'throttle' },
    determinedIP: '6.6.6.6'
  }

  it('Reset and update settings', async () => {
    await ratelimiter.resetLimiter()
    await ratelimiter.updateLimiter({
      routes: [{ route: 'log/throttle', throttleLimit: 1, limit: 100, expires: 5, delay: 10 }]
    })
  })

  it('logs debug output and the first throttling', async () => {
    const warnings = []
    const originalWarn = console.warn
    const originalLogger = ratelimiter.logger
    console.warn = (...args) => warnings.push(args)
    ratelimiter.logger = { warn: (...args) => warnings.push(args) }
    try {
      await ratelimiter.limiter(reqLog, { throttleLimit: 1, debugMode: true })
      await ratelimiter.limiter(reqLog, { throttleLimit: 1, debugMode: true })
        .then(() => { throw new Error('should have thrown') }, e => assert.equal(e.code, 900))
    }
    finally {
      console.warn = originalWarn
      ratelimiter.logger = originalLogger
    }
    assert.equal(warnings.some(args => args[0].startsWith('Route')), true)
    assert.equal(warnings.some(args => args[0].includes('Counter') && args[2] === 'Throttling'.padEnd(12)), true)
  })
})
