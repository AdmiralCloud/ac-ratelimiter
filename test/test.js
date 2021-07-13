const _ = require('lodash')
const expect = require('expect')
const ratelimiter = require('../index')

const redisStoreSimulator = {}

const init = {
  routes: [
    { route: 'user/find', throttleLimit: 1, limit: 2, expires: 3, delay: 250 },
  ],
  redis: {
    incr: (key, cb) => {
      redisStoreSimulator[key] = redisStoreSimulator[key] || 0
      redisStoreSimulator[key] += 1
      //console.log('Redis incr', key, redisStoreSimulator[key])
      return cb(null, redisStoreSimulator[key])
    },
    expire: (key, expires, cb) => {
      //console.log('Redis expires', key)
      setTimeout(() => {
        _.unset(redisStoreSimulator, key)
      }, expires * 1000)
      return cb()
    }
  },
  logger: {
    warn: () => {
      // just for simulation
    }
  }
}

let req = {
  options: {
    controller: 'user',
    action: 'find'
  },
  determinedIP: '1.2.3.4'
}

let options = {}

describe('Test section #1', function () {
  describe('RATE LIMITER TEST', function() {
    this.timeout(5000)
    it('init tests', done => {
      ratelimiter.init(init)
      return done()
    })

    it('should not trigger', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })
    it('should still not trigger', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toHaveProperty('status', 900)
        return done()
      })
    })
    it('should still not trigger as only throttling is active', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })
  })
})


describe('Test section #2 - immediate limiter', function () {
  describe('RATE LIMITER TEST', function() {
    this.timeout(5000)
    it('init tests', done => {
      req.determinedIP = '4.1.4.1'
      init.routes = [
        { route: 'user/find', limit: 0, expires: 3, delay: 250 },
      ]
      ratelimiter.init(init)
      return done()
    })

    it('should trigger immediately', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toHaveProperty('status', 429)
        return done()
      })
    })
  })
})


describe('Test section #3 - no throttling', function () {
  describe('RATE LIMITER TEST', function() {
    this.timeout(5000)
    it('init tests', done => {
      req.determinedIP = '2.3.4.1'
      init.routes = [
        { route: 'user/find', throttleLimit: 0, limit: 2, expires: 3, delay: 0 },
      ]
      ratelimiter.init(init)
      return done()
    })

    it('should not trigger', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })
    it('should still not trigger', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })
    it('should trigger the limiter', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toHaveProperty('status', 429)
        return done()
      })
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
      clientId: 'abc'
    }
    it('init tests', done => {
      init.routes = [
        { route: 'customer/find', clientId: 'abc', throttleLimit: 1, limit: 2, expires: 3, delay: 250 },
        { route: 'customer/find', throttleLimit: 3, limit: 10, expires: 3, delay: 250 },
      ]
      ratelimiter.init(init)
      return done()
    })

    it('should not trigger', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })
    it('should still not trigger', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toHaveProperty('status', 900)
        return done()
      })
    })
    it('should still not trigger as only throttling is active', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })

    it('Now make request without clientId - should throttler after 3 requests', done => {
      options = {}
      return done()
    })

    it('should not trigger #1', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })

    it('should not trigger #2', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })

    it('should not trigger #3', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })

    it('should still not trigger', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toHaveProperty('status', 900)
        return done()
      })
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

    it('init tests', done => {
      ratelimiter.init(init)
      return done()
    })

    it('should not trigger #1', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })

    it('should not trigger #2', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })

    it('should not trigger #3', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })

    it('should not trigger #4', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })

    it('should not trigger #5', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })
  })
})


describe('Test section #6 - ignore local ips', function () {
  describe('RATE LIMITER TEST - LOCAL IPS', function() {
    this.timeout(5000)
    it('init tests', done => {
      req.determinedIP = '4.1.4.1'
      init.routes = [
        { route: 'user/find', limit: 0, expires: 3, delay: 250 },
      ]
      ratelimiter.init(init)
      return done()
    })

    it('should trigger immediately', done => {
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toHaveProperty('status', 429)
        return done()
      })
    })

    it('should not trigger', done => {
      req.determinedIP = '127.0.0.1'
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })

    it('should not trigger - IPv6', done => {
      req.determinedIP = '::ffff:127.0.0.1'
      ratelimiter.limiter(req, options, (err) => {
        expect(err).toEqual(null)
        return done()
      })
    })
  })
})