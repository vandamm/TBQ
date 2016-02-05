# TBQ: Text Based Quest games engine

[![Build Status](https://travis-ci.org/vandamm/TBQ.svg?branch=master)](https://travis-ci.org/vandamm/TBQ)
[![Dependency Status](https://gemnasium.com/vandamm/TBQ.svg)](https://gemnasium.com/vandamm/TBQ)

TBQ is a tool to run simple text-based adventures in node.js. Currently it has structure based on rooms containing
objects that can be interacted with. 

## Usage

Create a data file (e.g. `data.json`), you can find format explanations in [corresponding file](DataFormat.md). Then use the engine:

```js
const TBQ = require('tbq');
const game = TBQ.createGame(require('data.json'));

do {
  var playerInput = /* Somehow get command entered by player */
  var actionResult = game.exec(playerInput);
  if (actionResult.text !== null) {
    /* Output actionResult.text to player */
  } else {
    /* Output some help */
  }
} while (!actionResult.end)
```

Each `game.exec(playerInput)` call returns `{ text, end }` object (`text` property is `null` if command is invalid in given circumstances).

## License

MIT
