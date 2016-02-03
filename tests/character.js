'use strict';

import test from 'tape';
import createCharacter, {actions} from '../src/character';

const character = createCharacter();

test('Empty allowed actions list', t => {
  t.plan(1);

  const actualResult = character.matchAllowedAction('', []);
  const expectedResult = undefined;

  t.equal(actualResult, expectedResult, 'Empty allowed actions should return undefined.');
});


test('Back action', t => {
  t.plan(2);

  const expectedResult = {
    action: character.actions.back
  };
  const actualResult = character.matchAllowedAction('return', {
    [character.actions.back]: null
  });

  t.notEqual(actualResult, undefined, 'Return action should be recognized.');
  t.deepEqual(actualResult, expectedResult, 'Return action should yield actions.back.');
});


test('Action that captures object', t => {
  t.plan(2);

  const actionTarget = {
    actions: [actions.use],
    names: ['button']
  };

  const expectedResult = {
    action: actions.use,
    object: actionTarget
  };

  const actualResult = character.matchAllowedAction('use button', {
    [actions.use]: [actionTarget]
  });

  t.notEqual(actualResult, undefined, 'Using object should return actual command');
  t.deepEqual(actualResult, expectedResult, 'Should return appropriate command and target');
});


test('Custom action', t => {
  t.plan(2);

  const customAction = 'make a photo';
  const actionTarget = {
    actions: [customAction]
  };

  const expectedResult = {
    action: customAction,
    object: actionTarget
  };

  const actualResult = character.matchAllowedAction(customAction, {
    [customAction]: [actionTarget]
  });

  t.notEqual(actualResult, undefined, 'Applying custom action should work');
  t.deepEqual(actualResult, expectedResult, 'Should return appropriate command and target');
});

