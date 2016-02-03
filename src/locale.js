'use strict';

import {statSync} from 'fs';
import {resolve} from 'path';

const defaultLocale = 'en_US';

function getLocaleFilePath(locale) {
  return resolve(__dirname + '/../locale/' + locale + '.json');
}


function loadLocaleData(localePath) {
  return require(localePath);
}


function getLocaleData(locale = defaultLocale) {
  let localePath = getLocaleFilePath(locale);

  try {
    if (!statSync(localePath).isFile()) {
      localePath = getLocaleFilePath(defaultLocale);
    }
  } catch (e) {
    localePath = getLocaleFilePath(defaultLocale);
  }
  return loadLocaleData(localePath);
}

export default getLocaleData;
