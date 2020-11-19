# ac-ratelimiter

This tool provides rate-limiter based on Redis and ExpressJs.


## Usage

```
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

```

## Prerequisites

### Init
The ac-ratelimiter uses Redis as storage for the rate-limiter keys. You can also write your own, memory-based, backend. See the test for an example.

Additionally, for logging purposes, we use Winston. But you can also use any other logger that provides logging for "warn" and "error".

Last but not least, provide an array of objects with rate limiter instructions. Each object has the following properties:
Property | Type | Example | Remarks
---|---|---|---|
route | string | user/find | A combination of controller and action (express) or any other identifier you can provide
throttleLimit | integer | 20 | Number of calls before throttling starts
delay | integer | 250 | Number of milliseconds a throttle request is delayed (on purpose)
limit | integer | 100 | Number of calls before the limiter kicks in
expires | integer | 3 | Number of seconds before the rate-limiter resets


The init function can take additional parameters like 
+ environment
+ debugMode

### RateLimiter
The actual rateLimiter function takes two arguments, the Express request object (req) and an options object with the following optional properties:

Property | Type | Example | Remarks
---|---|---|---|
knownIP | Object | { name: 'AdmiralCloud' } | Display known IPs with their name when limiter is active
link | String | myLink | Display and locks the limiter to a given link (as identifier)
token | String | myToken | Locks the limiter to a given token/user session
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
- [Twitter (@admiralcloud)](https://twitter.com/admiralcloud)
- [Facebook](https://www.facebook.com/MediaAssetManagement/)

# Run tests
Call yarn run test

## License

[MIT License](https://opensource.org/licenses/MIT) Copyright © 2009-present, AdmiralCloud, Mark Poepping