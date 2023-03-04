# ac-ratelimiter

This tool provides rate-limiter that can be used as middleware with ExpressJs.

For huge production load it is recommended that you use it with Redis. However, for smaller applications you can use the build in Node Cache.

[![Node.js CI](https://github.com/AdmiralCloud/ac-ratelimiter/actions/workflows/node.js.yml/badge.svg)](https://github.com/AdmiralCloud/ac-ratelimiter/actions/workflows/node.js.yml)

## Breaking changes for version 2
Version 2 is a complete re-write of this module. It is now a class and uses async/await.

```
// Migration example

// Version 1
const acrl = require('ac-ratelimiter')

const init = {
  routes: [
    { route: 'user/find', throttleLimit: 1, limit: 2, expires: 3, delay: 250 },
  ],
  redis: REDIS INSTANCE
  logger: winston.log INSTANCE
}

acrl.init(init)

// req.rateLimitCounter should have already the current count
acrl.limiter(req, {}, err => {
  // err.status === 900 => throttling is active
  // err.status === 429 => limiter is active
  return res.json({ status: _.get(err, 'status') })
})


// Version 2
const acrl = require('ac-ratelimiter')

const init = {
  routes: [
    { route: 'user/find', throttleLimit: 1, limit: 2, expires: 3, delay: 250 },
  ],
  redis: REDIS INSTANCE
  logger: winston.log INSTANCE
}

const rateLimiter = new acrl(init)

try {
  await rateLimiter.limiter(req)
}
catch(e) {
  // e.status === 900 => throttling is active
  // e.status === 429 => limiter is active
}

```

## Usage

### Without any dependencies
This example initiates the rate limiter with NodeCache (instead of Redis) and console.log (instead of Winston). Default limits are 150 requests within 3 seconds. Starting at 50 request, requests will be throttled by 250ms.

```
const acrl = require('ac-ratelimiter')

const rateLimiter = new acrl()

try {
  await rateLimiter.limiter(req)
}
catch(e) {
  // e.status === 900 => throttling is active
  // e.status === 429 => limiter is active
}

```

## Prerequisites

### Init
The ac-ratelimiter can use Redis as storage for the rate-limiter keys. By default and to run out-of-the-box it uses Node Cache.

Additionally, for logging purposes, we use Winston. But you can also use any other logger that provides logging for "warn" and "error".

Last but not least, provide an array of objects with rate limiter instructions. Each object has the following properties:
Property | Type | Defaults | Remarks
---|---|---|---|
routes | string |  | A combination of controller and action (express) or any other identifier you can provide
throttleLimit | 50 | 20 | Number of calls before throttling starts
delay | integer | 250 | Number of milliseconds a throttle request is delayed (on purpose)
limit | integer | 150 | Number of calls before the limiter kicks in
expires | integer | 3 | Number of seconds before the rate-limiter resets



### RateLimiter
The actual rateLimiter function takes two arguments, the Express request object (req) and an options object with the following optional properties:

Property | Type | Example | Remarks
---|---|---|---|
name | String | myName | Identifier for the route - falls back to controller/action
redisKey | String | myKey | Optional RedisKey to use for rate limiter
fallbackRoute | String | fbroute | Optional fallback route identifier
expires | Integer | 3 | Expire time for rate limiter - see above
throttleLimit | Integer | 20 | Throttle limit for rate limiter - see above
delay | Integer | 250 | Delay for throttled calls for rate limiter - see above

# Good practice
It is recommended to put the determined IP to the request object as req.determinedIP.

Additionally, you can put the rateLimitCounter to the request object as req.rateLimitCounter. This way, the rate limiter does not have to fetch that value.

Both values might be retrieved prior to the rate limiter so there is no need to retrieve it once again here.

# Links
- [Website](https://www.admiralcloud.com/)
- [Facebook](https://www.facebook.com/MediaAssetManagement/)

# Run tests
```
yarn run test
```

## License

[MIT License](https://opensource.org/licenses/MIT) Copyright © 2009-present, AdmiralCloud AG, Mark Poepping