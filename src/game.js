'use strict';

import _ from 'lodash';
import jpp from 'json-path-processor';

import deepCopy from './deepCopy';
import gameObject from './gameObject';
import createCharacter from './character';

const Game = {

  init (data, character) {
    this.character = character;
    this.startingRoom = data.start;
    this.endText = data.endText;
    this.rooms = deepCopy(data.rooms);
    this.jpp = jpp(this.rooms);
    this.started = false;
    this.end = false;
  },


  getDescription () {
    return this.currentObject !== null ?
      this.currentObject.description :
      this.rooms[this.currentRoom].description;
  },


  changeRoom (roomName) {
    const room = this.rooms[roomName];
    const description = (this.currentRoom !== roomName && room.entryText !== null) ?
      room.entryText :
      room.description;

    this.currentRoom = roomName;
    this.currentObject = null;
    this.allowedActions = gameObject.getAllowedActions(room);

    return description;
  },


  returnToRoomCenter () {
    return this.changeRoom(this.currentRoom);
  },


  useObject (object, action, text) {

    // If command activates the object, make it current
    if (object.actions.indexOf(action) > -1) {

      // Some objects cannot become current
      if (object.canBeCurrent !== false) {
        this.currentObject = object;
        this.allowedActions = gameObject.getAllowedActions(object);
      }

      if (object.onActivate && typeof(object.onActivate) === 'function') {
        const activationMessage = object.onActivate(this, text, object);

        if (activationMessage) {
          return activationMessage;
        }
      }

    }

    let result;
    if (action === this.character.actions.examine) {
      result = object.details ? object.details : object.description;
    } else {
      result = object.description;
    }
    return result;
  },


  getActionResult (text) {
    if (this.end) {
      text += this.endText;
    }
    return {
      end: this.end,
      text: text
    }
  },


  processPlayerInput (text) {
    const actionResult = this.character.matchAllowedAction(text, this.allowedActions);

    if (actionResult === undefined) {
      return this.getActionResult(null);
    }

    var description;
    if (actionResult.action === this.character.actions.back) { // Return to room
      description = this.returnToRoomCenter();
    } else {
      description = this.useObject(actionResult.object, actionResult.action, text);
    }

    return this.getActionResult(description);
  },


  /**
   * Main game loop
   * @returns {{end, text}}
   */
    exec (text) {
    if (!this.started) {
      this.started = true;
      return this.getActionResult(this.changeRoom(this.startingRoom));
    } else if (text === 'GAMELOADED') {
      return this.getActionResult(this.getDescription());
    } else {
      return this.processPlayerInput(text);
    }
  },


  endGame () {
    this.end = true;
  },


  setProperties (data) {
    const game = this;
    _.each(data, (value, path) => {
      game.jpp.set(path, value);
    })
  }

};


module.exports = function createGame(questData, locale) {
  const character = createCharacter(locale);
  const game = Object.create(Game);
  game.init(questData, character);
  return game;
};
