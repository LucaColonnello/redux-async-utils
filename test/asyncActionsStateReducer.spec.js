import test from 'ava';
import 'babel-core/register';
import asyncActionsState from '../src/asyncActionsStateReducer';
import {
  pendingActionCreator,
  doneActionCreator,
  failureActionCreator,
} from '../src/actionCreators';

import {
  ASYNC_UTILS_STATE_FOR,
  PENDING,
  DONE,
  FAILURE,
} from '../src/constants';

const SOMETHING_TO_DO_ASYNCHRONOUSLY = 'SOMETHING_TO_DO_ASYNCHRONOUSLY';
const SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY = 'SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY';
let asyncActionsStateStore = [];

test('should return a new array with pending action', t => {
  const actualState = asyncActionsState(
    asyncActionsStateStore,
    pendingActionCreator(SOMETHING_TO_DO_ASYNCHRONOUSLY)
  );

  t.same(actualState, [
    {
      [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
      state: PENDING,
      error: null,
    },
  ]);
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});

test('should return a new array with updated async state', t => {
  const actualState = asyncActionsState(
    asyncActionsStateStore,
    doneActionCreator(SOMETHING_TO_DO_ASYNCHRONOUSLY)
  );

  t.same(actualState, [
    {
      [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
      state: DONE,
      error: null,
    },
  ]);
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});

test('should manage a new pending action maintaining previous one', t => {
  const actualState = asyncActionsState(
    asyncActionsStateStore,
    pendingActionCreator(SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY)
  );

  t.same(actualState, [
    {
      [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
      state: DONE,
      error: null,
    },
    {
      [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
      state: PENDING,
      error: null,
    },
  ]);
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});

test('should manage error when fail an async action', t => {
  const err = new Error('ops!');
  const actualState = asyncActionsState(
    asyncActionsStateStore,
    failureActionCreator(SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY, err)
  );

  t.same(actualState, [
    {
      [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
      state: DONE,
      error: null,
    },
    {
      [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
      state: FAILURE,
      error: err,
    },
  ]);
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});
