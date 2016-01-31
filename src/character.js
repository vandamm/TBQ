'use strict';

function checkRegEx(text, pattern) {
  const regExp = new RegExp(pattern, 'i');
  const result = regExp.exec(text.toLowerCase().trim());

  if (result) {
    return result[1] ? result[1] : true; // supporting the "no-capture" actions
  } else {
    return null;
  }
}


function findMatchingAction(command, allowedActions) {
  return allowedActions.reduce((prevAction, action) => {
    const objectName = checkRegEx(command, action);
    if (objectName) {
      return {action, objectName};
    } else {
      return prevAction;
    }
  }, null);
}


const character = {
  $use: "use (.+)",
  $approach: "approach (.+)",
  $examine: "examine (.+)",
  $return: "(?:return|back).*",
  $anything: ".*",

  actionByInput (text, allowedActions) {
    const matchedAction = findMatchingAction(text, allowedActions);

    if (matchedAction) {

      // Return command does not require a target
      if (matchedAction.action === character.$return) {
        return {
          action: matchedAction.action
        }
      }

      // Match returns true if the command doesn't capture any objects
      if (matchedAction.objectName === true) {
        if (allowedActions[matchedAction].length == 1) {
          return {
            action: matchedAction.action,
            object: allowedActions[matchedAction][0]
          }
        }
      }

      allowedActions[matchedAction].forEach(object => {
        object.names.forEach(name => {
          if (name === matchedAction.objectName) {
            matchedAction.object = object;
          }
        })
      });

      if (matchedAction.action && matchedAction.object) {
        return matchedAction
      }
    }

    return undefined;
  }
};

module.exports = character;
