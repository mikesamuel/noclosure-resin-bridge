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

'use strict';

const { describe, it } = require('mocha');
const { expect } = require('chai');
const bridge = require('../index.js');

describe('bridge fn', () => {
  const fallbackSentinelValue = {};
  describe('CONSTANT', () => {
    it('string', () => {
      expect(bridge('foo', 'CONSTANT', fallbackSentinelValue)).to.equal(fallbackSentinelValue);
    });
  });
  describe('JAVASCRIPT', () => {
    it('string', () => {
      expect(bridge('foo()', 'JAVASCRIPT', fallbackSentinelValue)).to.equal(fallbackSentinelValue);
    });
  });
  describe('HTML', () => {
    it('simple string', () => {
      expect(bridge('foo', 'HTML', fallbackSentinelValue)).to.equal('foo');
    });
    it('string with metachars', () => {
      expect(
        bridge('<foo>&&<bar \u0000 baz="\'a\'"/>', 'HTML', fallbackSentinelValue))
        .to.equal('&lt;foo&gt;&amp;&amp;&lt;bar &#0; baz=&quot;&#39;a&#39;&quot;/&gt;');
    });
  });
  describe('RESOURCE_URL', () => {
    it('string', () => {
      expect(bridge('foo', 'RESOURCE_URL', fallbackSentinelValue)).to.equal(fallbackSentinelValue);
    });
  });
  describe('STRING', () => {
    it('string', () => {
      expect(bridge('foo', 'STRING', fallbackSentinelValue)).to.equal('foo');
    });
    it('number', () => {
      // eslint-disable-next-line no-magic-numbers
      expect(bridge(123, 'STRING', fallbackSentinelValue)).to.equal('123');
    });
    it('metachars', () => {
      expect(bridge('"foo"', 'STRING', fallbackSentinelValue)).to.equal('"foo"');
    });
    it('obj', () => {
      const obj = {
        i: 0,
        toString() {
          return String(++this.i);
        },
      };
      expect(bridge(obj, 'STRING', fallbackSentinelValue)).to.equal('1');
    });
  });
  describe('STYLE', () => {
    it('string', () => {
      expect(bridge('foo', 'STYLE', fallbackSentinelValue)).to.equal(fallbackSentinelValue);
    });
  });
  describe('URL', () => {
    it('path', () => {
      expect(bridge('foo', 'URL', fallbackSentinelValue)).to.equal('foo');
    });
    it('abspath', () => {
      expect(bridge('/foo', 'URL', fallbackSentinelValue)).to.equal('/foo');
    });
    it('protocol rel', () => {
      expect(bridge('//foo/', 'URL', fallbackSentinelValue)).to.equal('//foo/');
    });
    it('query', () => {
      expect(bridge('?foo=bar', 'URL', fallbackSentinelValue)).to.equal('?foo=bar');
    });
    it('frag', () => {
      expect(bridge('#foo=bar', 'URL', fallbackSentinelValue)).to.equal('#foo=bar');
    });
    it('http', () => {
      expect(bridge('http://foo.example.com/', 'URL', fallbackSentinelValue)).to.equal('http://foo.example.com/');
    });
    it('Http', () => {
      expect(bridge('Http://foo.example.com/', 'URL', fallbackSentinelValue)).to.equal('http://foo.example.com/');
    });
    it('https', () => {
      expect(bridge('https://foo.example.com/%0af%28%29', 'URL', fallbackSentinelValue))
        .to.equal('https://foo.example.com/%0af%28%29');
    });
    it('javascript', () => {
      // eslint-disable-next-line no-script-url
      expect(bridge('javascript://foo.example.com/%0af%28%29', 'URL', fallbackSentinelValue))
        .to.equal(fallbackSentinelValue);
    });
    it('scoobyscript', () => {
      expect(bridge('scoobyscript://foo.example.com/%0af%28%29', 'URL', fallbackSentinelValue))
        .to.equal(fallbackSentinelValue);
    });
  });
  describe('BOGUS', () => {
    it('string', () => {
      expect(bridge('foo', 'BOGUS', fallbackSentinelValue)).to.equal(fallbackSentinelValue);
    });
  });
});
