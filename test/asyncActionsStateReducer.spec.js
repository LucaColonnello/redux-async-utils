import test from 'ava';
import 'babel-core/register';
import asyncActionsState, { initialState } from '../src/asyncActionsStateReducer';
import {
  pendingActionCreator,
  doneActionCreator,
  failureActionCreator,
  invalidateActionCreator,
} from '../src/actionCreators';

import {
  ASYNC_UTILS_STATE_FOR,
  PENDING,
  DONE,
  FAILURE,
  INVALIDATED,
} from '../src/constants';

const SOMETHING_TO_DO_ASYNCHRONOUSLY = 'SOMETHING_TO_DO_ASYNCHRONOUSLY';
const SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY = 'SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY';
const SOMETHING_TO_DO_ASYNCHRONOUSLY_SAME_GROUP = 'SOMETHING_TO_DO_ASYNCHRONOUSLY_SAME_GROUP';
const SOMETHING_TO_DO_ASYNCHRONOUSLY_NEW_GROUP = 'SOMETHING_TO_DO_ASYNCHRONOUSLY_NEW_GROUP';
let asyncActionsStateStore = initialState;
const err = new Error('ops!');
const group = 'test';
const newGroup = 'test2';

test('should return a new object with pending action', t => {
  const actualState = asyncActionsState(
    asyncActionsStateStore,
    pendingActionCreator(SOMETHING_TO_DO_ASYNCHRONOUSLY)
  );

  t.same(actualState, {
    asyncActionsStates: [
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        state: PENDING,
        error: null,
      },
    ],
    indexes: {
      [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
    },
    groups: {},
    errorsCount: 0,
    successCount: 0,
    failedActionsIndexes: [],
    digested: 0,
  });
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});

test('should return a new object with new pending action and update groups index', t => {
  const actualState = asyncActionsState(
    asyncActionsStateStore,
    pendingActionCreator(SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY, group)
  );

  t.same(actualState, {
    asyncActionsStates: [
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        state: PENDING,
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
        state: PENDING,
        error: null,
      },
    ],
    indexes: {
      [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
      [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
    },
    groups: {
      [group]: [
        1,
      ],
    },
    errorsCount: 0,
    successCount: 0,
    failedActionsIndexes: [],
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
        state: DONE,
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
        state: PENDING,
        error: null,
      },
    ],
    indexes: {
      [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
      [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
    },
    groups: {
      [group]: [
        1,
      ],
    },
    errorsCount: 0,
    successCount: 1,
    failedActionsIndexes: [],
    digested: 1,
  });
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});

test('should manage error when fail an async action and create indexes if there\'s not', t => {
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
        state: DONE,
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
        state: FAILURE,
        error: err,
      },
    ],
    indexes: {
      [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
      [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
    },
    groups: {
      [group]: [
        1,
      ],
    },
    errorsCount: 1,
    successCount: 1,
    failedActionsIndexes: [1],
    digested: 2,
  });
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});

test('should reset all the indexes and counters when perform a previous performed action', t => {
  const actualState = asyncActionsState(
    asyncActionsStateStore,
    pendingActionCreator(SOMETHING_TO_DO_ASYNCHRONOUSLY)
  );

  t.same(actualState, {
    asyncActionsStates: [
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        state: PENDING,
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
        state: FAILURE,
        error: err,
      },
    ],
    indexes: {
      [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
      [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
    },
    groups: {
      [group]: [
        1,
      ],
    },
    errorsCount: 1,
    successCount: 0,
    failedActionsIndexes: [1],
    digested: 1,
  });
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});

test('should reset failed actions index when perform a previous performed action', t => {
  const actualState = asyncActionsState(
    asyncActionsStateStore,
    pendingActionCreator(SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY)
  );

  t.same(actualState, {
    asyncActionsStates: [
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        state: PENDING,
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
        state: PENDING,
        error: null,
      },
    ],
    indexes: {
      [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
      [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
    },
    groups: {
      [group]: [
        1,
      ],
    },
    errorsCount: 0,
    successCount: 0,
    failedActionsIndexes: [],
    digested: 0,
  });
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});

test('should manage new pending action wth existing group and a new one', t => {
  const actualState = asyncActionsState(
    asyncActionsState(
      asyncActionsStateStore,
      pendingActionCreator(SOMETHING_TO_DO_ASYNCHRONOUSLY_SAME_GROUP, group)
    ),
    pendingActionCreator(SOMETHING_TO_DO_ASYNCHRONOUSLY_NEW_GROUP, newGroup)
  );

  t.same(actualState, {
    asyncActionsStates: [
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        state: PENDING,
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
        state: PENDING,
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY_SAME_GROUP,
        state: PENDING,
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY_NEW_GROUP,
        state: PENDING,
        error: null,
      },
    ],
    indexes: {
      [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
      [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      [SOMETHING_TO_DO_ASYNCHRONOUSLY_SAME_GROUP]: 2,
      [SOMETHING_TO_DO_ASYNCHRONOUSLY_NEW_GROUP]: 3,
    },
    groups: {
      [group]: [
        1,
        2,
      ],
      [newGroup]: [
        3,
      ],
    },
    errorsCount: 0,
    successCount: 0,
    failedActionsIndexes: [],
    digested: 0,
  });
  t.not(actualState, asyncActionsStateStore);

  asyncActionsStateStore = actualState;
});

test('should invalidate existing actions', t => {
  let actualState = asyncActionsState(
    {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: FAILURE,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY_SAME_GROUP,
          state: PENDING,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY_NEW_GROUP,
          state: PENDING,
          error: null,
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
        [SOMETHING_TO_DO_ASYNCHRONOUSLY_SAME_GROUP]: 2,
        [SOMETHING_TO_DO_ASYNCHRONOUSLY_NEW_GROUP]: 3,
      },
      groups: {
        [group]: [
          1,
          2,
        ],
        [newGroup]: [
          3,
        ],
      },
      errorsCount: 1,
      successCount: 1,
      failedActionsIndexes: [1],
      digested: 2,
    },
    invalidateActionCreator(SOMETHING_TO_DO_ASYNCHRONOUSLY)
  );

  actualState = asyncActionsState(
    actualState,
    invalidateActionCreator(SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY)
  );

  t.same(actualState, {
    asyncActionsStates: [
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        state: INVALIDATED,
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
        state: INVALIDATED,
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY_SAME_GROUP,
        state: PENDING,
        error: null,
      },
      {
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY_NEW_GROUP,
        state: PENDING,
        error: null,
      },
    ],
    indexes: {
      [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
      [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      [SOMETHING_TO_DO_ASYNCHRONOUSLY_SAME_GROUP]: 2,
      [SOMETHING_TO_DO_ASYNCHRONOUSLY_NEW_GROUP]: 3,
    },
    groups: {
      [group]: [
        1,
        2,
      ],
      [newGroup]: [
        3,
      ],
    },
    errorsCount: 0,
    successCount: 0,
    failedActionsIndexes: [],
    digested: 2,
  });
});
