import test from 'tape';
import character from '../src/character';

test('No allowed actions for character', t => {
  t.plan(1);

  const expectedResult = undefined;
  const actualResult = character.actionByInput('', []);

  t.equal(expectedResult, actualResult, 'Empty allowed actions should not allow any command');

});
