'use strict';

import _ from 'lodash';
import character from './character';


function initActionsRegistration(availableActionsList) {
  return (action, target) => {
    if (!availableActionsList[action]) {
      availableActionsList[action] = [];
    }
    availableActionsList[action].push(target);
  }
}

function registerActionsForObject(registerAction, object) {
  if ('actions' in object) {
    object.actions.forEach(action => {
      registerAction(action, object)
    })
  }
}

export default {
  getAllowedActions(entity) {
    let allowedActions = Object.create(null);
    const registerAction = initActionsRegistration(allowedActions);

    // Register actions on child objects
    if (typeof entity.objects === 'object') {
      _.each(entity.objects, childObject => {
        if (childObject.enabled === false) return;

        registerActionsForObject(registerAction, childObject);

        if ('details' in childObject && childObject.actions.indexOf(character.$examine) === -1) {
          registerAction(character.$examine, childObject)
        }
      })
    }

    // Self-activation
    registerActionsForObject(registerAction, entity);

    // If it's an object, add return and examine actions
    if (!entity.isRoom) {
      allowedActions[character.$return] = true;

      if (entity.actions.indexOf(character.$examine) === -1 && (entity.details || entity.description)) {
        registerAction(character.$examine, entity);
      }
    }

    return allowedActions;
  }
};
