'use strict';

import getLocaleData from './locale';

function checkRegEx(text, pattern) {
  const regExp = new RegExp(pattern, 'i');
  const result = regExp.exec(text.toLowerCase().trim());

  if (result) {
    return result[1] ? result[1] : ''; // supporting the "no-capture" actions
  } else {
    return null;
  }
}


function matchAction(command, allowedActions, actionPatterns) {
  for (let action in allowedActions) {
    const objectName = checkRegEx(command, actionPatterns[action]);
    if (objectName !== null) {
      return {action, objectName};
    }
  }
  return null;
}

export const actions = {
  use: 'ACTION_USE',
  approach: 'ACTION_APPROACH',
  examine: 'ACTION_EXAMINE',
  back: 'ACTION_RETURN',
  anything: 'ACTION_ANY'
};


/**
 * Sample structure of allowedActions param:
 * {
   *  [character.use]:     [ object1, object2 ]
   *  [character.examine]: [ object1, object2 ],
   *  [character.back]:  true
   * }
 */
function matchAllowedLocalAction(text, allowedActions, actionPatterns) {
  const matched = matchAction(text, allowedActions, actionPatterns);

  if (matched) {
    // back command doesn't require a target
    if (matched.action === actions.back) {
      delete matched.objectName;
      return matched;
    }

    // Match returns empty string if command doesn't capture any objects
    if (matched.objectName === '') {
      if (allowedActions[matched.action].length == 1) {
        matched.object = allowedActions[matched.action][0];
      }
    } else {
      allowedActions[matched.action].forEach(object => {
        object.names.forEach(name => {
          if (name === matched.objectName) {
            matched.object = object;
          }
        })
      });
    }

    if (matched.action && matched.object) {
      delete matched.objectName;
      return matched;
    }
  }

  return undefined;
}

function createCharacter(locale) {
  const localeData = getLocaleData(locale);

  return {
    actions,
    matchAllowedAction (text, allowedActions) {
      return matchAllowedLocalAction(text, allowedActions, localeData.character.actions)
    }
  }
}

export default createCharacter;
