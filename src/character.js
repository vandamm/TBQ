'use strict';

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
  $use: "use (.+)",
  $approach: "approach (.+)",
  $examine: "examine (.+)",
  $return: "(?:return|back).*",
  $anything: ".*",

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

module.exports = character;
