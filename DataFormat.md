# TBQ data format specification

Sample quest data file while I work on full specification:

```js
const actions = require('tbq').actions;
module.exports = {
  start: "room1",
  rooms: {
    room1: {
      isRoom: true,
      entryText: 'Hello!',
      objects: {
        names: ['door'],
        actions: [actions.approach, actions.examine],
        description: '',
        details: ''
      }
    }
  }
}
```

