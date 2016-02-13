import test from 'ava';
import 'babel-core/register';

import createAsyncActionsStateChecker from '../src/createAsyncActionsStateChecker';
import {
  ASYNC_UTILS_STATE_FOR,
  ASYNC_UTILS_STATE_GROUP,
  PENDING,
  DONE,
  FAILURE,
} from '../src/constants';


const SOMETHING_TO_DO_ASYNCHRONOUSLY = 'SOMETHING_TO_DO_ASYNCHRONOUSLY';
const SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY = 'SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY';
const NOTHING = 'NOTHING';
const group1 = 'group1';
const group2 = 'group2';

test('should give "hasn\'t done" without any filter', t => {
  const store = {
    asyncActionsState: {
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
      errorsCount: 0,
      successCount: 1,
      failedActionsIndexes: [],
      digested: 1,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store
  );

  t.is(testObj.hasDone(), false);
  t.is(testObj.getErrors().length, 0);
});

test('should give "has done" without any filter', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      errorsCount: 0,
      successCount: 2,
      failedActionsIndexes: [],
      digested: 2,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store
  );

  t.is(testObj.hasDone(), true);
  t.is(testObj.getErrors().length, 0);
});

test('should give some errors without any filter', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: FAILURE,
          error: new Error('Some error'),
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      errorsCount: 1,
      successCount: 1,
      failedActionsIndexes: [1],
      digested: 2,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store
  );

  t.is(testObj.hasDone(), true);
  t.is(testObj.getErrors().length, 1);
});

test('should give errors when are all in error without any filter', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: FAILURE,
          error: new Error('Some error 1'),
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: FAILURE,
          error: new Error('Some error 2'),
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      errorsCount: 2,
      successCount: 0,
      failedActionsIndexes: [0, 1],
      digested: 2,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store
  );

  t.is(testObj.hasDone(), true);
  t.is(testObj.getErrors().length, 2);
});

test('should give "hasn\'t done" with filter', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: PENDING,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      errorsCount: 0,
      successCount: 0,
      failedActionsIndexes: [],
      digested: 1,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store,
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
  );

  t.is(testObj.hasDone(), false);
  t.is(testObj.getErrors().length, 0);
});

test('should check group and single filter', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: PENDING,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      errorsCount: 0,
      successCount: 0,
      failedActionsIndexes: [],
      digested: 1,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store,
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
  );

  t.is(testObj.hasDone(), false);
  t.is(testObj.getErrors().length, 0);
});

test('should give "has done" with filter', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: PENDING,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      errorsCount: 0,
      successCount: 0,
      failedActionsIndexes: [],
      digested: 1,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store,
    SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
  );

  t.is(testObj.hasDone(), true);
  t.is(testObj.getErrors().length, 0);
});

test('should give "hasn\'t done" with multiple filter', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: PENDING,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      errorsCount: 0,
      successCount: 0,
      failedActionsIndexes: [],
      digested: 1,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store,
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
    SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
  );

  t.is(testObj.hasDone(), false);
  t.is(testObj.getErrors().length, 0);
});

test('should give "has done" with multiple filter', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      errorsCount: 0,
      successCount: 2,
      failedActionsIndexes: [],
      digested: 2,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store,
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
    SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
  );

  t.is(testObj.hasDone(), true);
  t.is(testObj.getErrors().length, 0);
});

test('should give "has done" when check for one key with multiple filter', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: PENDING,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      errorsCount: 0,
      successCount: 1,
      failedActionsIndexes: [],
      digested: 1,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store,
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
    SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
  );

  t.is(testObj.hasDone(SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY), true);
  t.is(testObj.getErrors().length, 0);
});

test('should give some errors with multiple filter', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: FAILURE,
          error: new Error('Some error'),
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      errorsCount: 1,
      successCount: 1,
      failedActionsIndexes: [1],
      digested: 2,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store,
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
    SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
  );

  t.is(testObj.hasDone(), true);
  t.is(testObj.getErrors().length, 1);
});

test('should give errors when are all in error with multiple filter', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: FAILURE,
          error: new Error('Some error'),
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: FAILURE,
          error: new Error('Some error'),
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      errorsCount: 2,
      successCount: 0,
      failedActionsIndexes: [0, 1],
      digested: 2,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store,
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
    SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
  );

  t.is(testObj.hasDone(), true);
  t.is(testObj.getErrors().length, 2);
});

test('should ignore non existing filter', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: FAILURE,
          error: new Error('Some error'),
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: FAILURE,
          error: new Error('Some error'),
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      errorsCount: 2,
      successCount: 0,
      failedActionsIndexes: [0, 1],
      digested: 2,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store,
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
    SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
    NOTHING,
  );

  t.is(testObj.hasDone(), true);
  t.is(testObj.getErrors().length, 2);
});

test('should manage also groups without any filters', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      groups: {
        [group1]: [
          0,
        ],
        [group2]: [
          1,
        ],
      },
      errorsCount: 0,
      successCount: 2,
      failedActionsIndexes: [],
      digested: 2,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store
  );

  t.is(testObj.hasDone(), true);
  t.is(testObj.getErrors().length, 0);
});

test('should manage also groups with any filters', t => {
  const store = {
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          state: DONE,
          error: null,
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      groups: {
        [group1]: [
          0,
        ],
        [group2]: [
          1,
        ],
      },
      errorsCount: 0,
      successCount: 2,
      failedActionsIndexes: [],
      digested: 2,
    },
  };

  const testObj = createAsyncActionsStateChecker(
    store,
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
    { group: group2 }
  );

  t.is(testObj.hasDone(), true);
  t.is(testObj.getErrors().length, 0);
});


test('should throw an error when there\'s no asyncActionsState in the store', t => {
  const store = {};
  t.throws(
    createAsyncActionsStateChecker.bind(null, store),
    Error,
    `redux-async-utils: createAsyncActionsStateChecker${
    ' '}requires asyncActionsState reducer to be in the store`
  );
});
