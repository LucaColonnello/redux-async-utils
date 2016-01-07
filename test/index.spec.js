import test from 'ava';
import 'babel-core/register';
import { reduxAsyncUtils } from '../src';

test('should return the library name', t => {
  t.is(reduxAsyncUtils(), 'redux-async-utils');
});
