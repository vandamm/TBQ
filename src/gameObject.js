'use strict';

const _ = require('lodash');
const character = require('./character');


function initActionsRegistration(availableActions) {
  return function (command, item) {
    if (!availableActions[command]) {
      availableActions[command] = [];
    }
    availableActions[command].push(item);
  }
}

const gameObject = {
  /** Generate command -> objects pairs list */
  getAllowedActions: function getAllowedActions(entity) {
    let actions = Object.create(null);
    const registerAction = initActionsRegistration(actions);

    // Register actions on child objects
    if (typeof entity.objects === 'object') {
      _.each(entity.objects, function (object) {
        if (object.enabled === false) {
          return;
        }

        if (object.details) {
          registerAction(character.$examine, object)
        }
        if (object.actions) {
          _.each(object.actions, function (action) {
            registerAction(action, object)
          })
        }
      })
    }

    // Self-activation can be done too
    if (Array.isArray(entity.actions)) {
      entity.actions.forEach(function (action) {
        registerAction(action, entity);
      })
    }

    // If it's an object, add return and examine actions
    if (!entity.isRoom) {
      actions[character.$return] = true;

      if (entity.details || entity.description) {
        registerAction(character.$examine, entity);
      }
    }

    return actions;
  }
};

module.exports = gameObject;
