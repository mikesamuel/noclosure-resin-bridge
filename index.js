/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env browser */
/* eslint-disable no-var, prefer-destructuring, strict */

/**
 * @fileoverview
 * A polymer-resin bridge that does not depend on closure library.
 */

var noclosureBridge = (function () { // eslint-disable-line func-names
  // This file can't be globally strict because the code that export globally
  // below fails in strict mode, but this makes the code that matters strict.
  'use strict';

  /**
   * @typedef {function (string, *): ?}
   */
  var tfilter; // eslint-disable-line no-unused-vars, init-declarations

  /**
   * @type {!tfilter}
   * @private
   * @const
   */
  function disallow(value, fallback) {
    return fallback;
  }

  var AMP_RE = /&/g;
  var LT_RE = /</g;
  var GT_RE = />/g;
  var QUOT_RE = /"/g;
  var SINGLE_QUOTE_RE = /'/g;
  var NULL_RE = /\0/g;

  /**
   * @type {!tfilter}
   * @private
   * @const
   */
  function htmlEscape(value) {
    var str = String(value);
    str = str.replace(AMP_RE, '&amp;')
      .replace(LT_RE, '&lt;')
      .replace(GT_RE, '&gt;')
      .replace(QUOT_RE, '&quot;')
      .replace(SINGLE_QUOTE_RE, '&#39;')
      .replace(NULL_RE, '&#0;');
    return str;
  }

  // Whitespace followed by a scheme, followed by a scheme specific part, followed by trailing whitespace.
  var SCHEME_AND_REST_RE = /^[\t\n\f\r ]*([^/:?#]+:)?([\s\S]*?)[\t\n\f\r ]*$/;

  // URL schemes that we allow in arbitrary strings.
  // This list is kept intentionally short.
  // There may be URL schemes with well-understood security properties that are not on this list.
  // Use a minter if you need a TrustedURL that is not on this list.
  var SAFE_SCHEME = {
    __proto__: null,
  };
  SAFE_SCHEME['http:'] = SAFE_SCHEME;
  SAFE_SCHEME['https:'] = SAFE_SCHEME;
  SAFE_SCHEME['mailto:'] = SAFE_SCHEME;
  SAFE_SCHEME['tel:'] = SAFE_SCHEME;

  /**
   * @type {!tfilter}
   * @private
   * @const
   */
  function sanitizeUrl(value, fallback) {
    var str = String(value);
    var match = SCHEME_AND_REST_RE.exec(str);
    var scheme = match[1];
    var schemeSpecificPart = match[2];
    if (!scheme) {
      return schemeSpecificPart;
    }
    var canonScheme = scheme.toLowerCase();
    if (SAFE_SCHEME[canonScheme] === SAFE_SCHEME) {
      return canonScheme + schemeSpecificPart;
    }
    return fallback;
  }

  /**
   * @type {!Object<string, !tfilter>}
   * @private
   * @const
   */
  var FILTERS = {
    /* Just returns the safe replacement value because we have no
     * way of knowing that a raw string is a compile-time constant.
     */
    'CONSTANT': disallow,
    /* Just returns the safe replacement value because we have no
     * way of knowing that a raw string is safe JavaScript so rely
     * on RTTI in all cases.
     */
    'JAVASCRIPT': disallow,
    /* Converts plain text to HTML that parses to a text node with
     * equivalent content.
     */
    'HTML': htmlEscape,
    /* Just returns the safe replacement value because we have no
     * way of declaring that a raw string is a trusted resource so
     * rely on RTTI in all cases.
     */
    'RESOURCE_URL': disallow,
    'STRING': String,
    /* Just returns the safe replacement value because we have no
     * way of knowing that a raw string is safe CSS so rely on RTTI
     * in all cases.
     */
    'STYLE': disallow,
    'URL': sanitizeUrl,
  };

  /**
   * A security.polymer_resin.SafeTypeBridge.
   *
   * @param {*} value the value whose trustedness is being check.
   * @param {string} type a security.polymer_resin.SafeType value
   * @param {*} fallback the value to return if value is not trusted as a value of type.
   * @return {?}
   */
  return function bridge(value, type, fallback) {
    /** @type {!tfilter} */
    var filter = FILTERS[type] || disallow;
    return filter(
      String(value),
      fallback);
  };
}());

/* eslint-disable no-undef, camelcase */
/* istanbul ignore else */
if (typeof module !== 'undefined' && typeof require === 'function' && typeof __filename === 'string') {
  module.exports = noclosureBridge;
} else {
  // Provide security.polymer_resin.noclosure_bridge if not loaded in a CommonJS module context.
  if (typeof security === 'undefined') {
    security = {}; // eslint-disable-line no-implicit-globals
  }
  if (typeof security.polymer_resin === 'undefined') {
    security.polymer_resin = {};
  }
  security.polymer_resin.noclosure_bridge = noclosureBridge;
}
/* eslint-enable no-undef, camelcase */
