'use strict';

import {statSync} from 'fs';
import {resolve} from 'path';
import _ from 'lodash';

function checkRegEx(text, pattern) {
  const regExp = new RegExp(pattern, 'i');
  const result = regExp.exec(text.toLowerCase().trim());

  if (result) {
    return result[1] ? result[1] : ''; // supporting the "no-capture" actions
  } else {
    return null;
  }
}


function findMatchingAction(command, allowedActions) {
  for (let action in allowedActions) {
    const objectName = checkRegEx(command, action);
    if (objectName !== null) {
      return {action, objectName};
    }
  }
  return null;
}


const character = {
  $use: 'использовать (.+)',
  $approach: 'по(?:до)?йти (?:к|ко|в) (.+)',
  $examine: 'осмотреть (.+)',
  $return: 'вернуться.*',
  $anything: '.*',

  /**
   * Sample structure of allowedActions param:
   * {
   *  [character.$use]:     [ object1, object2 ]
   *  [character.$examine]: [ object1, object2 ],
   *  [character.$return]:  true
   * }
   */
  actionFromText (text, allowedActions) {
    const matchedAction = findMatchingAction(text, allowedActions);

    if (matchedAction) {
      // $return command doesn't require a target
      if (matchedAction.action === character.$return) {
        delete matchedAction.objectName;
        return matchedAction;
      }

      // Match returns empty string if command doesn't capture any objects
      if (matchedAction.objectName === '') {
        if (allowedActions[matchedAction.action].length == 1) {
          matchedAction.object = allowedActions[matchedAction.action][0];
        }
      } else {
        allowedActions[matchedAction.action].forEach(object => {
          object.names.forEach(name => {
            if (name === matchedAction.objectName) {
              matchedAction.object = object;
            }
          })
        });
      }

      if (matchedAction.action && matchedAction.object) {
        delete matchedAction.objectName;
        return matchedAction;
      }
    }

    return undefined;
  }
};


function getLocalePath(locale) {
  return '../locale/' + locale + '/commands.json';
}

function localeFileExists(locale) {
  const path = resolve(getLocalePath(locale));
  const stats = statSync(path);
  return stats.isFile();
}

function getCommandsForLocale(locale) {
  if (localeFileExists(locale)) {
    return require(getLocalePath(locale))
  } else {
    return 
  }
}

function createCharacter(locale = 'en_US') {
  const stats = statSync(resolve('../locale/' + locale));
  if (stats)
  const commands = require('../locale/' + locale)
}

module.exports = character;
