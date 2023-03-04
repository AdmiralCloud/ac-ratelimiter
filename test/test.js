const { expect } = require('chai')
const  { setTimeout } = require('timers/promises')

const ratelimiterModule = require('../index')

const Redis = require('ioredis')
const redis = new Redis()

let req = {
  options: {
    controller: 'user',
    action: 'find',
  },
  determinedIP: '1.2.3.4'
}


let initOptions = {
  routes: [
    { route: 'user/find', throttleLimit: 1, limit: 2, expires: 3, delay: 250 },
  ]
}
let options = {}

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
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })
      it('should still not trigger - req #2 - but throw 900', async() => {
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.have.property('message', 'finalThrottlingActive_requestsIsDelayed')
          expect(e).to.have.property('status', 900)
        }
      })
      it('should not trigger - req #3 - rate limiter is reset', async() => {
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
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
          expect(e).to.have.property('status', 429)
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
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })
      it('should still not trigger - delayed req #2', async() => {
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.have.property('message', 'finalThrottlingActive_requestsIsDelayed')
          expect(e).to.have.property('status', 900)
        }
      })
      it('should trigger the limiter', async() => {
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.have.property('message', 'tooManyRequestsFromThisIP')
          expect(e).to.have.property('status', 429)
        }
      })
    })
  })

  describe('Test section #4 - routes with clientId', function() {
    describe('RATE LIMITER TEST', function() {
      this.timeout(5000)
      let req = {
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
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })
      it('should still not trigger but delay - req #2', async() => {
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.have.property('message', 'finalThrottlingActive_requestsIsDelayed')
          expect(e).to.have.property('status', 900)
        }
      })
      it('should still not trigger as ratelimiter is reset', async() => {
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
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
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger #2', async() => {
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger #3', async() => {
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should delay request #4', async() => {
        try {
          await ratelimiter.limiter(req, options)
        }
        catch(e) {
          expect(e).to.have.property('message', 'throttlingActive_requestsIsDelayed')
          expect(e).to.have.property('status', 900)
        }
      })
    })
  })

  describe('Test section #5 - no limiting', function () {
    describe('RATE LIMITER TEST', function() {
      this.timeout(5000)
      let req = {
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
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger #2', async() => {
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger #3', async() => {
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger #4', async() => {
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger #5', async() => {
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })
    })
  })

  describe('Test section #6 - ignore ignorePrivateIps', function () {
    describe('RATE LIMITER TEST - ignorePrivateIps', function() {
      this.timeout(5000)

      let req = {
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
          expect(e).to.have.property('status', 429)
        }
      })

      it('should not trigger', async() => {
        req.determinedIP = '127.0.0.1'
        let result = await ratelimiter.limiter(req, options)
        expect(result).eql(undefined)
      })

      it('should not trigger - IPv6', async() => {
        req.determinedIP = '::ffff:127.0.0.1'
        let result = await ratelimiter.limiter(req, options)
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
        let result = await ratelimiter.limiter(req, { rateLimitCounter: 0 })
        expect(result).eql(undefined)
      })

      it('should trigger immediately', async() => {
        try {
          await ratelimiter.limiter(req, { rateLimitCounter: 100 })
        }
        catch(e) {
          expect(e).to.have.property('message', 'tooManyRequestsFromThisIP')
          expect(e).to.have.property('status', 429)
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
        let x = await ratelimiterRedis.limiter(req, options)
        console.log(304, x)
      }
      catch(e) {
        expect(e).to.be.an('error')
        expect(e).to.have.property('message', 'tooManyRequestsFromThisIP')
        expect(e).to.have.property('status', 429)
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
      let result = await ratelimiterRedis.limiter(req, options)
      expect(result).eql(undefined)
    })

    it('req #2 should not trigger throttle warning', async()  => {

      try {
        await ratelimiterRedis.limiter(req, options)
      }
      catch(e) {
        expect(e).to.be.an('error')
        expect(e).to.have.property('message', 'finalThrottlingActive_requestsIsDelayed')
        expect(e).to.have.property('status', 900)
        expect(e.additionalInfo).to.have.property('counter', 2)
      }
    })

    it('req #3 should not trigger the limiter - the throttling has reset the limiter', async()  => {
      let result = await ratelimiterRedis.limiter(req, options)
      expect(result).eql(undefined)
    })

  })

})