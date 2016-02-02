import test from 'ava';
import 'babel-core/register';
import asyncActionsState, { initialState } from '../src/asyncActionsStateReducer';
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
  STATE_TO_STRING,
} from '../src/constants';

const SOMETHING_TO_DO_ASYNCHRONOUSLY = 'SOMETHING_TO_DO_ASYNCHRONOUSLY';
const SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY = 'SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY';
let asyncActionsStateStore = initialState;

test('should return a new object with pending action', t => {
  const actualState = asyncActionsState(
    asyncActionsStateStore,
    pendingActionCreator(SOMETHING_TO_DO_ASYNCHRONOUSLY)
  );

  t.same(actualState, {
    asyncActionsStates: [
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        state: STATE_TO_STRING[PENDING],
        error: null,
      },
    ],
    indexes: {
      [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
    },
    errorsCount: 0,
    successCount: 0,
    failedActionsIndexs: [],
    digested: 0,
  });
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});

test('should return a new object with updated async state', t => {
  const actualState = asyncActionsState(
    asyncActionsStateStore,
    doneActionCreator(SOMETHING_TO_DO_ASYNCHRONOUSLY)
  );

  t.same(actualState, {
    asyncActionsStates: [
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        state: STATE_TO_STRING[DONE],
        error: null,
      },
    ],
    indexes: {
      [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
    },
    errorsCount: 0,
    successCount: 1,
    failedActionsIndexs: [],
    digested: 1,
  });
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});

test('should manage a new pending action maintaining previous one', t => {
  const actualState = asyncActionsState(
    asyncActionsStateStore,
    pendingActionCreator(SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY)
  );

  t.same(actualState, {
    asyncActionsStates: [
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        state: STATE_TO_STRING[DONE],
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
        state: STATE_TO_STRING[PENDING],
        error: null,
      },
    ],
    indexes: {
      [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
      [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
    },
    errorsCount: 0,
    successCount: 1,
    failedActionsIndexs: [],
    digested: 1,
  });
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});

test('should manage error when fail an async action and create indexes if there\'s not', t => {
  const err = new Error('ops!');

  // overwrite indexes so it has to generate new
  asyncActionsStateStore.indexes = {};

  const actualState = asyncActionsState(
    asyncActionsStateStore,
    failureActionCreator(SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY, err)
  );

  t.same(actualState, {
    asyncActionsStates: [
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        state: STATE_TO_STRING[DONE],
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
        state: STATE_TO_STRING[FAILURE],
        error: err,
      },
    ],
    indexes: {
      [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
      [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
    },
    errorsCount: 1,
    successCount: 1,
    failedActionsIndexs: [1],
    digested: 2,
  });
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});
