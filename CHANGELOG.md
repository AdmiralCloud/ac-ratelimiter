<a name="1.0.5"></a>

## [1.0.5](https://github.com/mmpro/ac-ratelimiter/compare/v1.0.4..v1.0.5) (2020-12-05 20:14:28)


### Bug Fix

* **Limiter:** For more flexibility it is now possible to bind rate limits to clientId | MP | [d55a1c6dd14473be5c257cc37305da142f684b80](https://github.com/mmpro/ac-ratelimiter/commit/d55a1c6dd14473be5c257cc37305da142f684b80)    
For more flexibility it is now possible to bind rate limits to clientId
<a name="1.0.4"></a>

## [1.0.4](https://github.com/mmpro/ac-ratelimiter/compare/v1.0.3..v1.0.4) (2020-11-23 11:51:25)


### Bug Fix

* **Limiter:** Do not crash if identifier is no string | MP | [64ac4fb525ea2e82c673d20d82f6c97cf3bafa34](https://github.com/mmpro/ac-ratelimiter/commit/64ac4fb525ea2e82c673d20d82f6c97cf3bafa34)    
We now check if identifier is a string before replace operation.
<a name="1.0.3"></a>

## [1.0.3](https://github.com/mmpro/ac-ratelimiter/compare/v1.0.2..v1.0.3) (2020-11-21 20:10:52)


### Bug Fix

* **Limiter:** Do not use rateLimitCounter from request object | MP | [5fa94a5d4baa97882b3fc730a98b74ebd7643f27](https://github.com/mmpro/ac-ratelimiter/commit/5fa94a5d4baa97882b3fc730a98b74ebd7643f27)    
In order to avoid a bug where expire time is not set, we do not use any other increment mechanism. Only ac-ratelimiter should handle rate limiting.
### Chores

* **Limiter:** Updated packages | MP | [7bf0e4037a07403c98cbabfbf041fb1f39ae07b5](https://github.com/mmpro/ac-ratelimiter/commit/7bf0e4037a07403c98cbabfbf041fb1f39ae07b5)    
Updated packages
<a name="1.0.2"></a>

## [1.0.2](https://github.com/mmpro/ac-ratelimiter/compare/v1.0.1..v1.0.2) (2020-11-19 20:10:24)


### Bug Fix

* **Limiter:** Add function to reset rate limiter | MP | [dc8cd18b6c506837f285df103f924131c9ae68b6](https://github.com/mmpro/ac-ratelimiter/commit/dc8cd18b6c506837f285df103f924131c9ae68b6)    
Add function to reset rate limiter
### Documentation

* **Limiter:** Fixed typo in README | MP | [66edb71a0e8fa9ecdb6c6729aa695c0d06f062eb](https://github.com/mmpro/ac-ratelimiter/commit/66edb71a0e8fa9ecdb6c6729aa695c0d06f062eb)    
Fixed typo in README
### Chores

* **Limiter:** Use ac-semantic-release | MP | [f112eda15c8f2c3bc8fe21bd5acc17fe487d3894](https://github.com/mmpro/ac-ratelimiter/commit/f112eda15c8f2c3bc8fe21bd5acc17fe487d3894)    
Use ac-semantic-release
<a name="1.0.1"></a>
## [1.0.1](https://github.com/mmpro/ac-ratelimiter/compare/v1.0.0...v1.0.1) (2019-12-18 18:57)


### Bug Fixes

* **App:** Use generic identifier instead of token/link | MP ([befbb4c2f025352e81178e77eafb109d11540ea4](https://github.com/mmpro/ac-ratelimiter/commit/befbb4c2f025352e81178e77eafb109d11540ea4))    
  Use generic identifier instead of token/link



<a name="1.0.0"></a>
# 1.0.0 (2019-12-18 18:24)


### Bug Fixes

* **App:** Return loginfo with callback | MP ([1ba2eb6a7b7160c1c4ebfab3b57e356dcbcdb20d](https://github.com/mmpro/ac-ratelimiter/commit/1ba2eb6a7b7160c1c4ebfab3b57e356dcbcdb20d))    
  Every Rate limiter call returns a log object which can be used by your app


### Features

* **App:** Initial version | MP ([0bd66b67374c7b3fca7ea414d59e13103c8915f5](https://github.com/mmpro/ac-ratelimiter/commit/0bd66b67374c7b3fca7ea414d59e13103c8915f5))    
  Initial version



