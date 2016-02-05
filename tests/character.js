'use strict';

import test from 'tape';
import createCharacter, {actions} from '../src/character';

const character = createCharacter();

const customAction = 'make a photo';
const simpleTarget = {
  names: ['button']
};
const advancedTarget = {
  names: ['toggle', 'switch']
}

const actionsData = {
  [actions.use]: [
    simpleTarget,
    advancedTarget
  ],
  [actions.examine]: [
    advancedTarget
  ],
  [customAction]: [
    advancedTarget
  ],
  [actions.back]: null
}

test('Empty allowed actions list', t => {
  const expectedResult = undefined;
  const actualResult = character.matchAllowedAction('back', []);

  t.plan(1);
  t.equal(actualResult, expectedResult, 'should return undefined.');
});


test('Back action', t => {
  const expectedResult = {
    action: actions.back
  };

  t.plan(2);
  t.deepEqual(character.matchAllowedAction('return', actionsData), expectedResult, 'should return actions.back if called as "return"');
  t.deepEqual(character.matchAllowedAction('back', actionsData), expectedResult, 'should return actions.back if called as "back"');
});


test('Action that captures object', t => {
  const expectedResult = {
    action: actions.use,
    object: simpleTarget
  };
  const actualResult = character.matchAllowedAction('use button', actionsData);

  t.plan(1);
  t.deepEqual(actualResult, expectedResult, 'should return appropriate command and target');
});


test('Action on object with multiple names', t => {
  const expectedResult = {
    action: actions.use,
    object: advancedTarget
  };

  t.plan(2);
  t.deepEqual(character.matchAllowedAction('use toggle', actionsData), expectedResult, 'should return appropriate command and target using name 1');
  t.deepEqual(character.matchAllowedAction('use switch', actionsData), expectedResult, 'should return appropriate command and target using name 2');
})


test('Custom action', t => {
  const expectedResult = {
    action: customAction,
    object: advancedTarget
  };
  const actualResult = character.matchAllowedAction(customAction, actionsData);

  t.plan(1);
  t.deepEqual(actualResult, expectedResult, 'should return appropriate command and target');
});


test('Localized action', t => {
  const character = createCharacter('ru_RU');

  const actionTarget = {
    names: ['кнопку']
  };

  const expectedResult = {
    action: actions.use,
    object: actionTarget
  };

  const actualResult = character.matchAllowedAction('использовать кнопку', {
    [actions.use]: [actionTarget]
  });

  t.plan(1);
  t.deepEqual(actualResult, expectedResult, 'should return appropriate command and target');
})

