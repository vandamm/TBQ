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
    return null;
  }
}

test('Default locale', t => {
  t.plan(2);

  const en_US = loadLocale('en_US');

  t.deepEquals(getLocaleData(), en_US, 'No locale specified');
  t.deepEquals(getLocaleData('oh_MY'), en_US, 'Non-existent locale specified');
})

test('Custom locale', t => {
  t.plan(1);

  const ru_RU = loadLocale('ru_RU');

  t.deepEquals(getLocaleData('ru_RU'), ru_RU, '');
})
