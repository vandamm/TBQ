# TBQ: Text Based Quest games engine

[![Build Status](https://travis-ci.org/vandamm/TBQ.svg?branch=master)](https://travis-ci.org/vandamm/TBQ)
[![Dependency Status](https://gemnasium.com/vandamm/TBQ.svg)](https://gemnasium.com/vandamm/TBQ)

Create a data file (e.g. `data.json`), you can find format explanations in [corresponding file](DataFormat.md). Then use the engine:

```js
const TBQ = require('tbq');
const game = TBQ.createGame(require('data.json'));

do {
  var playerInput = /* Somehow get player input */
  var actionResult = game.exec(playerInput);
  /* Output actionResult.text to player */
} while (!actionResult.end)
```

Each `game.exec(playerInput)` call returns `{ text, end }` object (`text` property is `null` if command is invalid in given circumstances).

## License

MIT
