'use strict';

const _ = require('lodash');
const jpp = require('json-path-processor');
const config = require('config');
const deepCopy = require('./deepCopy');

const character = require('./character');
const gameObject = require('./gameObject');

var Game = {

  init: function init(data) {
    this.startingRoom = data.start;
    this.endText = data.endText;
    this.rooms = deepCopy(data.rooms);
    this.jpp = jpp(this.rooms);
    this.started = false;
    this.end = false;
  },


  getDescription: function getDescription() {
    return this.currentObject !== null
      ? this.currentObject.description
      : this.rooms[this.currentRoom].description;
  },


  changeRoom: function changeRoom(roomName) {
    const room = this.rooms[roomName];
    var description = '';

    if (this.currentRoom !== roomName && room.entryText !== null) {
      description = room.entryText;
    } else {
      description = room.description;
    }

    this.currentRoom = roomName;
    this.currentObject = null;
    this.allowedActions = gameObject.getAllowedActions(room);

    return description;
  },


  returnToRoomCenter: function returnToRoomCenter() {
    return this.changeRoom(this.currentRoom);
  },


  useObject: function useObject(object, action, text) {

    // If command activates the object, make it current
    if (object.actions.indexOf(action) > -1) {

      // Some objects cannot become current
      if (object.canBeCurrent !== false) {
        this.currentObject = object;
        this.allowedActions = gameObject.getAllowedActions(object);
      }

      var activationMessage;
      if (object.onActivate && typeof(object.onActivate) === 'function') {
        activationMessage = object.onActivate(this, text, object);
      }

      if (activationMessage) {
        return activationMessage;
      }
    }

    var result;
    if (action == character.$examine && object.details) {
      result = object.details;
    } else {
      result = object.description;
    }
    return result;
  },


  getActionResult: function getActionResult(text) {
    if (this.end) {
      text += this.endText;
    }
    return {
      end: this.end,
      text: text
    }
  },


  processPlayerInput: function processPlayerInput(text) {
    const actionResult = character.actionByInput(text, this.allowedActions);

    if (actionResult === undefined) {
      return this.getActionResult(config.get('text.commandInvalid'));
    }

    var description;
    if (actionResult.action == character.$return) { // Return to room
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
  exec: function exec(text) {
    if (!this.started) {
      this.started = true;
      return this.getActionResult(this.changeRoom(this.startingRoom));
    } else if (text === 'GAMELOADED') {
      return this.getActionResult(this.getDescription());
    } else {
      return this.processPlayerInput(text);
    }
  },


  endGame: function endGame() {
    this.end = true;
  },


  setProperties: function setProperties(data) {
    const game = this;
    _.each(data, function (value, path) {
      game.jpp.set(path, value);
    })
  }

};


module.exports = function createGame(questData, locale='en_US') {
  const game = Object.create(Game);
  game.init(questData);
  return game;
};
