# TBQ: Text Based Quest games engine

[![Build Status](https://travis-ci.org/vandamm/TBQ.svg?branch=master)](https://travis-ci.org/vandamm/TBQ) 
[![Dependency Status](https://gemnasium.com/vandamm/TBQ.svg)](https://gemnasium.com/vandamm/TBQ)

Current version only supports Russian commands.

Create a data file `data.json`:

```js
const char = require('tbq').character;
module.exports = {
  start: "room1",
  rooms: {
    room1: {
      isRoom: true,
      entryText: 'Hello!',
      objects: {
        names: ['door'],
        actions: [char.$approach, char.$examine],
        description: '',
        details: ''
      }
    }
  }
}
```

Then use the engine:

```js
const TBQ = require('tbq');
const game = TBQ.createGame(require('data.json'));

do {
  var command = /* Somehow get player input */
  var actionResult = game.exec(command);
  /* Output actionResult.text to player */
} while (!actionResult.end)
```

Each `game.exec(command)` call returns `{ text, end }` object or `false` if command is invalid in given circumstances.
