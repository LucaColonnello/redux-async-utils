import test from 'ava';
import 'babel-core/register';

import createAsyncActionsStateChecker from '../src/createAsyncActionsStateChecker';
import {
  ASYNC_UTILS_STATE_FOR,
  PENDING,
  DONE,
  FAILURE,
} from '../src/constants';


const SOMETHING_TO_DO_ASYNCHRONOUSLY = 'SOMETHING_TO_DO_ASYNCHRONOUSLY';
const SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY = 'SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY';

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
      failedActionsIndexs: [],
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
      failedActionsIndexs: [],
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
      failedActionsIndexs: [1],
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
      failedActionsIndexs: [0, 1],
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
      failedActionsIndexs: [],
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
      failedActionsIndexs: [],
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
      failedActionsIndexs: [],
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
      failedActionsIndexs: [],
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
      failedActionsIndexs: [],
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
      failedActionsIndexs: [1],
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
      failedActionsIndexs: [0, 1],
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

test('should throw an error when there\'s no asyncActionsState in the store', t => {
  const store = {};
  t.throws(
    createAsyncActionsStateChecker.bind(null, store),
    Error,
    `redux-async-utils: createAsyncActionsStateChecker${
    ' '}requires asyncActionsState reducer to be in the store`
  );
});
