<a name="1.0.8"></a>

## [1.0.8](https://github.com/mmpro/ac-ratelimiter/compare/v1.0.7..v1.0.8) (2021-07-13 14:13:17)


### Bug Fix

* **Limiter:** Ignore private IPs per default | MP | [ef2222a12bc5a3da23d1a14c87d2be7dc3f76d3f](https://github.com/mmpro/ac-ratelimiter/commit/ef2222a12bc5a3da23d1a14c87d2be7dc3f76d3f)    
Ignore private IPs per default
### Style

* **Limiter:** Remove console.log | MP | [4c9879e0cf8dba4b761000a077d284c4759c4458](https://github.com/mmpro/ac-ratelimiter/commit/4c9879e0cf8dba4b761000a077d284c4759c4458)    
Remove console.log
### Chores

* **Limiter:** Use yarn 1 | MP | [841574e53c02f9bc996a3c1ec19cbf0651ad94ec](https://github.com/mmpro/ac-ratelimiter/commit/841574e53c02f9bc996a3c1ec19cbf0651ad94ec)    
Use yarn 1
* **Limiter:** Go back to yarn 1 | MP | [f7581c4197b9493468d273b664ed88f81b11e2c4](https://github.com/mmpro/ac-ratelimiter/commit/f7581c4197b9493468d273b664ed88f81b11e2c4)    
Go back to yarn 1
* **Misc:** Prepare repo for yarn2 | MP | [4aa6c6846b41548b6fab897af943ca82b9e71f28](https://github.com/mmpro/ac-ratelimiter/commit/4aa6c6846b41548b6fab897af943ca82b9e71f28)    
Prepare repo for yarn2
<a name="1.0.7"></a>

## [1.0.7](https://github.com/mmpro/ac-ratelimiter/compare/v1.0.6..v1.0.7) (2020-12-07 08:10:58)


### Bug Fix

* **Limiter:** Only use fallback route if not setting is available | MP | [a634585fc263ab2f2829d2bda3a1a27ae98a1d41](https://github.com/mmpro/ac-ratelimiter/commit/a634585fc263ab2f2829d2bda3a1a27ae98a1d41)    
Limiter should check for real routes before using the fallback route.
<a name="1.0.6"></a>

## [1.0.6](https://github.com/mmpro/ac-ratelimiter/compare/v1.0.5..v1.0.6) (2020-12-07 07:13:12)


### Bug Fix

* **Limiter:** Fixed order of rules | MP | [354e1a00e5f90cba767ae7ca62050e6b9f205d73](https://github.com/mmpro/ac-ratelimiter/commit/354e1a00e5f90cba767ae7ca62050e6b9f205d73)    
Make sure to use the proper route/rule if no clientId (or IP) is set.
### Chores

* **Limiter:** Updated packages | MP | [8bd00af42be75976412d3cb4cff1b130ecd85aaa](https://github.com/mmpro/ac-ratelimiter/commit/8bd00af42be75976412d3cb4cff1b130ecd85aaa)    
Updated packages
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



