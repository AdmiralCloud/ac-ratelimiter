const { expect } = require('chai')
const  { setTimeout } = require('timers/promises')

const ratelimiterModule = require('../index')

const Redis = require('ioredis')
const redis = new Redis()

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
const ratelimiterRedis = new ratelimiterModule({ redisInstance: redis, routes: initOptions.routes })


describe('Use NodeCache', () => {

  describe('Test section #1', function () {
    describe('RATE LIMITER TEST', function() {
      this.timeout(5000)

      it('Reset Limiter', async() => {
        await ratelimiter.resetLimiter()
      })

      it('should not trigger - req #1', async() => {
        const result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })
      it('should throttle - req #2 - Normal Throttling throws 900', async() => {
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.have.property('message', 'throttlingActive_requestsIsDelayed')
          expect(e).to.have.property('code', 900)
        }
      })
      it('should trigger the limiter - req #3 - counter exceeds limit', async() => {
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.have.property('message', 'tooManyRequestsFromThisIP')
          expect(e).to.have.property('code', 429)
        }
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
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.be.an('error')
          expect(e).to.have.property('message', 'tooManyRequestsFromThisIP')
          expect(e).to.have.property('code', 429)
        }
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
        expect(result).eql(undefined)
      })
      it('should not trigger req #2 - throttleLimit is 0 so no throttling fires', async() => {
        const result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })
      it('should trigger the limiter req #3 - counter exceeds limit', async() => {
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.have.property('message', 'tooManyRequestsFromThisIP')
          expect(e).to.have.property('code', 429)
        }
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

      it('Reset Limiter', async() => {
        await ratelimiter.resetLimiter()
      })

      it('should not trigger - req #1', async() => {
        const result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })
      it('should throttle - req #2 - Normal Throttling throws 900', async() => {
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.have.property('message', 'throttlingActive_requestsIsDelayed')
          expect(e).to.have.property('code', 900)
        }
      })
      it('should trigger the limiter - req #3 - counter exceeds limit', async() => {
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.have.property('message', 'tooManyRequestsFromThisIP')
          expect(e).to.have.property('code', 429)
        }
      })

      it('Now make request without clientId - should throttler after 3 requests', async() => {
        options = {
          routes: [
            { route: 'customer/find', clientId: 'abc', throttleLimit: 1, limit: 2, expires: 3, delay: 250 },
            { route: 'customer/find', throttleLimit: 3, limit: 10, expires: 3, delay: 250 },
          ]
        }
      })

      it('should not trigger #1', async() => {
        const result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger #2', async() => {
        const result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger #3', async() => {
        const result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should delay request #4', async() => {
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.have.property('message', 'throttlingActive_requestsIsDelayed')
          expect(e).to.have.property('code', 900)
        }
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
        expect(result).eql(undefined)
      })

      it('should not trigger #2', async() => {
        const result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger #3', async() => {
        const result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger #4', async() => {
        const result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger #5', async() => {
        const result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
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
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.have.property('message', 'tooManyRequestsFromThisIP')
          expect(e).to.have.property('code', 429)
        }
      })

      it('should not trigger', async() => {
        req.determinedIP = '127.0.0.1'
        const result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger - private IPv6', async() => {
        req.determinedIP = 'FD8A:4C5D:3E1F:0001:ABCD:1234:5678:9ABC'
        const result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
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
        expect(result).eql(undefined)
      })

      it('should trigger immediately', async() => {
        try {
          await ratelimiter.limiter(req, { rateLimitCounter: 100 })
        }
        catch(e) {
          expect(e).to.have.property('message', 'tooManyRequestsFromThisIP')
          expect(e).to.have.property('code', 429)
        }
      })


    })
  })

})

describe('Use Redis', () => {

  after(() => {
    redis.quit()
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
      try {
        await ratelimiterRedis.limiter(req, options)
      }
      catch(e) {
        expect(e).to.be.an('error')
        expect(e).to.have.property('message', 'tooManyRequestsFromThisIP')
        expect(e).to.have.property('code', 429)
      }
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
      expect(result).eql(undefined)
    })

    it('req #2 Normal Throttling - throws 900', async()  => {
      try {
        await ratelimiterRedis.limiter(req, options)
      }
      catch(e) {
        expect(e).to.be.an('error')
        expect(e).to.have.property('message', 'throttlingActive_requestsIsDelayed')
        expect(e).to.have.property('code', 900)
        expect(e.additionalInfo).to.have.property('counter', 2)
      }
    })

    it('req #3 exceeds limit - throws 429', async()  => {
      try {
        await ratelimiterRedis.limiter(req, options)
      }
      catch(e) {
        expect(e).to.be.an('error')
        expect(e).to.have.property('message', 'tooManyRequestsFromThisIP')
        expect(e).to.have.property('code', 429)
      }
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
        expect(result).eql(undefined)
      }
    })

    it('request at 90% of limit (counter=9) uses Normal Throttling - throws 900', async() => {
      try {
        await ratelimiter.limiter(reqRange, options)
      }
      catch(e) {
        expect(e).to.have.property('message', 'throttlingActive_requestsIsDelayed')
        expect(e).to.have.property('code', 900)
      }
    })

    it('request exceeding limit (counter=11) returns 429 immediately', async() => {
      try {
        await ratelimiter.limiter(reqRange, options)
      }
      catch(e) {
        expect(e).to.have.property('message', 'tooManyRequestsFromThisIP')
        expect(e).to.have.property('code', 429)
      }
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
      const immediate429 = errors.filter(e => e.code === 429 && e.message === 'tooManyRequestsFromThisIP')
      expect(immediate429.length).to.be.at.least(1)
    })

    it('waiting counter is 0 after all concurrent requests complete', async() => {
      expect(getWaitingCount()).to.equal(0)
    })

    it('waiting counter is decremented via finally even when throttle error is thrown', async() => {
      await ratelimiter.resetLimiter()
      // req #1 passes
      await ratelimiter.limiter(reqWaiting, options)
      // req #2 triggers Normal Throttling - increments waiting, delays, throws 900
      let thrownError = null
      try {
        await ratelimiter.limiter(reqWaiting, options)
      }
      catch(e) {
        thrownError = e
      }
      expect(thrownError).to.be.an('error')
      expect(thrownError).to.have.property('code', 900)
      // finally must have run and decremented the counter back to 0
      expect(getWaitingCount()).to.equal(0)
    })

  })

})
