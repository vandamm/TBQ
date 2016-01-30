# TBQ: Text Based Quest games engine
Current version only supports Russian commands.

Create a data file `data.json`:

```
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

```
const TBQ = require('tbq');
const game = TBQ.createGame(require('data.json'));

while (!game.isEnd()) {
  var command = /* Somehow get player input */
  var actionResult = game.exec(command);
}
```

Each `game.exec(command)` call returns `{ text, end }` object or `false` if command is invalid in given circumstances.
