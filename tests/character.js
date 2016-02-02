import test from 'tape';
import character from '../src/character';


test('Empty allowed actions list', t => {
  t.plan(1);

  const actualResult = character.actionFromText('', []);
  const expectedResult = undefined;

  t.equal(actualResult, expectedResult, 'Empty allowed actions should return undefined.');
});


test('$return action', t => {
  t.plan(2);

  const expectedResult = {
    action: character.$return
  };
  const actualResult = character.actionFromText('return', {
    [character.$return]: null
  });

  t.notEqual(actualResult, undefined, 'Return action should be recognized.');
  t.deepEqual(actualResult, expectedResult, 'Return action should yield character.$return.');
});


test('Action that captures object', t => {
  t.plan(2);

  const actionTarget = {
    actions: [character.$use],
    names: ['button']
  };

  const expectedResult = {
    action: character.$use,
    object: actionTarget
  };

  const actualResult = character.actionFromText('use button', {
    [character.$use]: [actionTarget]
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

  const actualResult = character.actionFromText(customAction, {
    [customAction]: [actionTarget]
  });

  t.notEqual(actualResult, undefined, 'Applying custom command should work');
  t.deepEqual(actualResult, expectedResult, 'Should return appropriate command and target');
});

