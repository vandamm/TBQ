'use strict';

import _ from 'lodash';
import {actions} from './character';


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
      registerAction(action, object);
    });
  }
}

const gameObject = {

  getAllowedActions(entity) {
    let allowedActions = Object.create(null);
    const registerAction = initActionsRegistration(allowedActions);

    // Register actions on child objects
    if (typeof entity.objects === 'object') {
      _.each(entity.objects, childObject => {
        if (childObject.enabled === false) return;

        registerActionsForObject(registerAction, childObject);

        if ('details' in childObject && childObject.actions.indexOf(actions.examine) === -1) {
          registerAction(actions.examine, childObject)
        }
      })
    }

    // Self-activation
    registerActionsForObject(registerAction, entity);

    // If it's an object, add return and examine actions
    if (!entity.isRoom) {
      allowedActions[actions.back] = true;

      if ((entity.details || entity.description) && (!allowedActions[actions.examine] || allowedActions[actions.examine].indexOf(entity) === -1)) {
        registerAction(actions.examine, entity);
      }
    }

    return allowedActions;
  }
};

export default gameObject;
