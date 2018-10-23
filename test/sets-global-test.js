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
// eslint-disable-next-line id-length
const fs = require('fs');

describe('sets global', () => {
  // eslint-disable-next-line no-new-func, no-sync
  const fun = new Function(fs.readFileSync(require.resolve('../index.js'), { encoding: 'utf8' }));

  it('load-globally', () => {
    const globalStringNamesBefore = Object.getOwnPropertyNames(global);
    try {
      fun();
      const globalStringNamesAfter = Object.getOwnPropertyNames(global);

      expect(globalStringNamesAfter.sort())
        .to.deep.equal(
          [ ...globalStringNamesBefore, 'security' ].sort());

      expect(typeof global.security.polymer_resin.noclosure_bridge).to.equal('function');
    } finally {
      delete global.security;
    }
  });
  it('modifies global.security', () => {
    global.security = {};
    const globalStringNamesBefore = Object.getOwnPropertyNames(global);
    try {
      fun();
      const globalStringNamesAfter = Object.getOwnPropertyNames(global);

      expect(globalStringNamesAfter.sort())
        .to.deep.equal(globalStringNamesBefore.sort());

      expect(typeof global.security.polymer_resin.noclosure_bridge).to.equal('function');
    } finally {
      delete global.security;
    }
  });
});
