'use strict';

import test from 'tape';
import {readFileSync} from 'fs';
import {resolve} from 'path';

import getLocaleData from '../src/locale';

function loadLocale(locale) {
  const localeText = readFileSync(resolve(__dirname + '/../locale/' + locale + '.json'));
  try {
    return JSON.parse(localeText)
  } catch (e) {
    return undefined;
  }
}

test('Default locale', t => {
  t.plan(3);

  const en_US = loadLocale('en_US');

  t.notEqual(en_US, undefined, 'should exist');
  t.deepEquals(getLocaleData(), en_US, 'should be used if no locale is specified');
  t.deepEquals(getLocaleData('oh_MY'), en_US, 'should be used if non-existent locale specified');
})

test('Custom locale', t => {
  t.plan(2);

  const ru_RU = loadLocale('ru_RU');

  t.notEqual(ru_RU, undefined, 'should exist');
  t.deepEquals(getLocaleData('ru_RU'), ru_RU, 'data should be correctly returned');
})
