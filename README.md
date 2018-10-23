# No Closure Polymer Resin Bridge

[![Build Status](https://travis-ci.org/mikesamuel/noclosure-resin-bridge.svg?branch=master)](https://travis-ci.org/mikesamuel/noclosure-resin-bridge)
[![Dependencies Status](https://david-dm.org/mikesamuel/noclosure-resin-bridge/status.svg)](https://david-dm.org/mikesamuel/noclosure-resin-bridge)
[![npm](https://img.shields.io/npm/v/noclosure-resin-bridge.svg)](https://www.npmjs.com/package/noclosure-resin-bridge)
[![Coverage Status](https://coveralls.io/repos/github/mikesamuel/noclosure-resin-bridge/badge.svg?branch=master)](https://coveralls.io/github/mikesamuel/noclosure-resin-bridge?branch=master)
[![Install Size](https://packagephobia.now.sh/badge?p=noclosure-resin-bridge)](https://packagephobia.now.sh/result?p=noclosure-resin-bridge)
[![Known Vulnerabilities](https://snyk.io/test/github/mikesamuel/noclosure-resin-bridge/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mikesamuel/noclosure-resin-bridge?targetFile=package.json)

A bridge for [Polymer Resin](https://www.npmjs.com/package/polymer-resin) that does not depend on
Closure Library.

See [configuring Polymer Resin][configuring-resin] for information about bridge functions.

> The bridge function defines what values are safe. It allows a
> framework to interoperate with different kinds of "safe values" like
> Google Closure's goog.html package, the Trusted Types polyfill, or
> node-sec-patterns.

If `index.js` has loaded into the browser, then you can configure
Polymer Resin with this bridge thus:

```js
security.polymer_resin.install({
  'safeTypesBridge': security.polymer_resin.noclosure_bridge,
  ...
})
```

[configuring-resin]: https://github.com/Polymer/polymer-resin/blob/master/getting-started.md#-safetypesbridge-mybridgefn-
