<a name="2.0.2"></a>

## [2.0.2](https://github.com/admiralcloud/ac-ratelimiter/compare/v2.0.1..v2.0.2) (2024-07-06 18:51:38)


### Bug Fix

* **Limiter:** Replaced isPrivateIP with isSpecialIP | MP | [d14140a22a00e5a18eb21d286712f21f8daea8f3](https://github.com/admiralcloud/ac-ratelimiter/commit/d14140a22a00e5a18eb21d286712f21f8daea8f3)    
Replaced isPrivateIP with isSpecialIP  
Related issues: [undefined/undefined#master](undefined/browse/master)
<a name="2.0.1"></a>

## [2.0.1](https://github.com/admiralcloud/ac-ratelimiter/compare/v2.0.0..v2.0.1) (2024-07-06 14:32:00)


### Bug Fix

* **Limiter:** Updated packages | MP | [6d31ce52d1b300021ba471c3a6261859604ceec5](https://github.com/admiralcloud/ac-ratelimiter/commit/6d31ce52d1b300021ba471c3a6261859604ceec5)    
Updated packages. Use ACError package. Fixed tests for updated packages  
Related issues: [undefined/undefined#develop](undefined/browse/develop)
<a name="2.0.0"></a>
 
# [2.0.0](https://github.com/admiralcloud/ac-ratelimiter/compare/v1.0.10..v2.0.0) (2024-02-26 07:51:24)


### Feature

* **Limiter:** Add function to return which storage is used | MP | [cad5a69e1265b8ed44f1146a2dddc65777ba94da](https://github.com/admiralcloud/ac-ratelimiter/commit/cad5a69e1265b8ed44f1146a2dddc65777ba94da)    
Add function to return which storage is used  
Related issues: [undefined/undefined#develop](undefined/browse/develop)
* **Limiter:** Complete re-write as class | MP | [951f21582833e06fccc90ee65edf6eadd30c4d24](https://github.com/admiralcloud/ac-ratelimiter/commit/951f21582833e06fccc90ee65edf6eadd30c4d24)    
Ratelimiter is now a class and works out-of-the-box without Redis  
Related issues: [undefined/undefined#develop](undefined/browse/develop)
### Bug Fix

* **Limiter:** Package updates | MP | [05828c26cdd56dde87258267d014c0019532647e](https://github.com/admiralcloud/ac-ratelimiter/commit/05828c26cdd56dde87258267d014c0019532647e)    
Package updates  
Related issues: [undefined/undefined#develop](undefined/browse/develop)
### Chores

* **Limiter:** Make this version 2.0.0-beta.1 | MP | [8b1361c91332180ad3f2c6b14bf33f3330048400](https://github.com/admiralcloud/ac-ratelimiter/commit/8b1361c91332180ad3f2c6b14bf33f3330048400)    
Make this version 2.0.0-beta.1  
Related issues: [undefined/undefined#develop](undefined/browse/develop)
## BREAKING CHANGES
* **Limiter:** Complete re-write as class
<a name="1.0.10"></a>

## [1.0.10](https://github.com/admiralcloud/ac-ratelimiter/compare/v1.0.9..v1.0.10) (2023-01-02 19:44:47)


### Bug Fix

* **Limiter:** Package updates | MP | [e98140d27fd8d7b01d26579a0a3e4c667e0d7765](https://github.com/admiralcloud/ac-ratelimiter/commit/e98140d27fd8d7b01d26579a0a3e4c667e0d7765)    
Package updates  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Tests

* **Limiter:** Replaced expect with chai/expect | MP | [b1edd733c9561c76e2c7c0543a5da8ad5e570511](https://github.com/admiralcloud/ac-ratelimiter/commit/b1edd733c9561c76e2c7c0543a5da8ad5e570511)    
Replaced expect with chai/expect  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Chores

* **Limiter:** Add Github workflows | MP | [ec07c17da774449b535b8b0a34a98adb5735bbe2](https://github.com/admiralcloud/ac-ratelimiter/commit/ec07c17da774449b535b8b0a34a98adb5735bbe2)    
Add Github workflows  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Chores

* **Limiter:** Updated packages | MP | [995e427b7dc291a391ef7be1c6a6593849234000](https://github.com/admiralcloud/ac-ratelimiter/commit/995e427b7dc291a391ef7be1c6a6593849234000)    
Updated packages  
Related issues: [undefined/undefined#master](undefined/browse/master)
<a name="1.0.9"></a>

## [1.0.9](https://github.com/admiralcloud/ac-ratelimiter/compare/v1.0.8..v1.0.9) (2021-10-09 10:32:36)


### Bug Fix

* **Limiter:** Package updates | MP | [8f25561c31f8618d45affac87baa862ca1764c42](https://github.com/admiralcloud/ac-ratelimiter/commit/8f25561c31f8618d45affac87baa862ca1764c42)    
Package updates
### Tests

* **Limiter:** Added test for local IPs | MP | [27c58ecd874d692481594d82cfde91f65909ec91](https://github.com/admiralcloud/ac-ratelimiter/commit/27c58ecd874d692481594d82cfde91f65909ec91)    
Added test for local IPs
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



