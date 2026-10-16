# ac-ratelimiter

This tool provides rate-limiter that can be used as middleware with ExpressJs.

For huge production load it is recommended that you use it with Redis. However, for smaller applications you can use the build in Node Cache.

[![Node.js CI](https://github.com/AdmiralCloud/ac-ratelimiter/actions/workflows/node.js.yml/badge.svg)](https://github.com/AdmiralCloud/ac-ratelimiter/actions/workflows/node.js.yml) [![CodeQL](https://github.com/AdmiralCloud/ac-ratelimiter/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/AdmiralCloud/ac-ratelimiter/actions/workflows/github-code-scanning/codeql)

## Breaking changes for version 3
### New error `tooManyConcurrentRequests`
Throttled requests wait for `delay` milliseconds. If too many requests are waiting at the same time, the limiter now throws `tooManyConcurrentRequests` (429). Before, it threw `tooManyRequestsFromThisIP`, which is now only thrown when `limit` is exceeded.

You can set the maximum number of waiting requests with `maxWaiting`, per route or per call. The default is `max(10, ceil(limit / expires * delay / 1000))`.

### No default throttling for configured routes
A route config without `throttleLimit` is no longer throttled. Before, it used the global default of 50. Routes without a config and the fallback route still use the global default.

To keep the old behavior, set `throttleLimit` > 0 explicitly.

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
  // e.message === 'tooManyRequestsFromThisIP' => limit exceeded
  // e.message === 'tooManyConcurrentRequests' => too many throttled requests waiting at the same time (maxWaiting)
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
  // e.message === 'tooManyRequestsFromThisIP' => limit exceeded
  // e.message === 'tooManyConcurrentRequests' => too many throttled requests waiting at the same time (maxWaiting)
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
throttleLimit | integer | 50 | Number of calls before throttling starts. A route-specific config without throttleLimit does not throttle (0). Only routes without any config (and the fallback route) use the global default
delay | integer | 250 | Number of milliseconds a throttle request is delayed (on purpose)
limit | integer | 150 | Number of calls before the limiter kicks in
expires | integer | 3 | Number of seconds before the rate-limiter resets
maxWaiting | integer | max(10, ceil(limit / expires * delay / 1000)) | Max. number of throttled requests waiting at the same time. Further requests are rejected with 429 `tooManyConcurrentRequests`



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
maxWaiting | Integer | 20 | Max. concurrent throttled requests for rate limiter - see above

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