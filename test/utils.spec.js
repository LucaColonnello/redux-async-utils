import test from 'ava';
import 'babel-core/register';
import {
  hasDone,
  createActionCreatorFromPromise,
} from '../src/utils';
import {
  ASYNC_UTILS_MARKER,
  ASYNC_UTILS_STATE,
  ASYNC_UTILS_STATE_FOR,
  ASYNC_UTILS_STATE_GROUP,
  PENDING,
  DONE,
  FAILURE,
} from '../src/constants';

const SOMETHING_TO_DO_ASYNCHRONOUSLY = 'SOMETHING_TO_DO_ASYNCHRONOUSLY';
const SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY = 'SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY';
const group = 'group';

test('should check if one, a group or all the actions state has done', t => {
  // check has done for all action states
  t.same(hasDone({
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
        [group]: [
          0,
        ],
      },
      errorsCount: 0,
      successCount: 2,
      failedActionsIndexes: [],
      digested: 2,
    },
  }), true);

  // check for a single action state
  t.same(hasDone({
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
        [group]: [
          0,
        ],
      },
      errorsCount: 0,
      successCount: 2,
      failedActionsIndexes: [],
      digested: 2,
    },
  }, SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY), true);

  // check for a single action state in failure
  t.same(hasDone({
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
          error: null,
        },
      ],
      indexes: {
        [SOMETHING_TO_DO_ASYNCHRONOUSLY]: 0,
        [SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]: 1,
      },
      groups: {
        [group]: [
          0,
        ],
      },
      errorsCount: 0,
      successCount: 0,
      failedActionsIndexes: [1],
      digested: 2,
    },
  }, SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY), true);

  // check for a group
  t.same(hasDone({
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
      groups: {
        [group]: [
          0,
        ],
      },
      errorsCount: 0,
      successCount: 1,
      failedActionsIndexes: [],
      digested: 1,
    },
  }, { group }), true);
});

test(
  `should throw an error if requirements are missing${
  ' '}when creating an action creator from the promise`,
  t => {
    t.throws(
      createActionCreatorFromPromise.bind(null),
      Error,
      `createActionCreatorFromPromise: manageAsyncStateFor is required,${
      ''}it can be a function or a string`
    );

    t.throws(
      createActionCreatorFromPromise.bind(null, SOMETHING_TO_DO_ASYNCHRONOUSLY),
      Error,
      'createActionCreatorFromPromise: getPromise is required'
    );
  }
);

test('should create an action creator from the promise', t => {
  const dispatchedAction = [];
  const error = new Error('error');
  const dispatch = (action) => {
    dispatchedAction.push(action);
  };
  const getState = () => ({
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
        [group]: [
          0,
        ],
      },
      errorsCount: 0,
      successCount: 0,
      failedActionsIndexes: [],
      digested: 0,
    },
  });

  createActionCreatorFromPromise(
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
    (num) => new Promise((resolve) => {
      resolve(num + 1);
    }),
    (num, resolved) => ({ type: 'ADD', resolved })
  )(5)(dispatch, getState);

  createActionCreatorFromPromise(
    SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
    () => new Promise((resolve, reject) => {
      reject(error);
    }),
    (num, resolved) => ({ type: 'ADD', resolved })
  )(5)(dispatch, getState);

  return new Promise(resolve => setTimeout(resolve, 200)).then(() => {
    t.same(dispatchedAction, [
      {
        type: PENDING,
        [ASYNC_UTILS_MARKER]: true,
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        [ASYNC_UTILS_STATE]: PENDING,
        [ASYNC_UTILS_STATE_GROUP]: undefined,
      },
      {
        type: PENDING,
        [ASYNC_UTILS_MARKER]: true,
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
        [ASYNC_UTILS_STATE]: PENDING,
        [ASYNC_UTILS_STATE_GROUP]: undefined,
      },
      {
        type: 'ADD',
        resolved: 6,
        [ASYNC_UTILS_MARKER]: true,
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        [ASYNC_UTILS_STATE]: DONE,
      },
      {
        type: FAILURE,
        error,
        [ASYNC_UTILS_MARKER]: true,
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
        [ASYNC_UTILS_STATE]: FAILURE,
      },
    ]);
  });
});

test('should create an action creator from the promise using a function as key', t => {
  const dispatchedAction = [];
  const dispatch = (action) => {
    dispatchedAction.push(action);
  };
  const getState = () => ({
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
        [group]: [
          0,
        ],
      },
      errorsCount: 0,
      successCount: 0,
      failedActionsIndexes: [],
      digested: 0,
    },
  });

  createActionCreatorFromPromise(
    () => SOMETHING_TO_DO_ASYNCHRONOUSLY,
    (num) => new Promise((resolve) => {
      resolve(num + 1);
    }),
    (num, resolved) => ({ type: 'ADD', resolved })
  )(5)(dispatch, getState);

  return new Promise(resolve => setTimeout(resolve, 200)).then(() => {
    t.same(dispatchedAction, [
      {
        type: PENDING,
        [ASYNC_UTILS_MARKER]: true,
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        [ASYNC_UTILS_STATE]: PENDING,
        [ASYNC_UTILS_STATE_GROUP]: undefined,
      },
      {
        type: 'ADD',
        resolved: 6,
        [ASYNC_UTILS_MARKER]: true,
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        [ASYNC_UTILS_STATE]: DONE,
      },
    ]);
  });
});

test('should create an action creator from the promise using an object with key and group', t => {
  const dispatchedAction = [];
  const dispatch = (action) => {
    dispatchedAction.push(action);
  };
  const getState = () => ({
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
        [group]: [
          0,
        ],
      },
      errorsCount: 0,
      successCount: 0,
      failedActionsIndexes: [],
      digested: 0,
    },
  });

  createActionCreatorFromPromise(
    { key: SOMETHING_TO_DO_ASYNCHRONOUSLY, group: 'test' },
    (num) => new Promise((resolve) => {
      resolve(num + 1);
    }),
    (num, resolved) => ({ type: 'ADD', resolved })
  )(5)(dispatch, getState);

  return new Promise(resolve => setTimeout(resolve, 200)).then(() => {
    t.same(dispatchedAction, [
      {
        type: PENDING,
        [ASYNC_UTILS_MARKER]: true,
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        [ASYNC_UTILS_STATE]: PENDING,
        [ASYNC_UTILS_STATE_GROUP]: 'test',
      },
      {
        type: 'ADD',
        resolved: 6,
        [ASYNC_UTILS_MARKER]: true,
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        [ASYNC_UTILS_STATE]: DONE,
      },
    ]);
  });
});

test('should create an action creator from the promise locking same action call', t => {
  const dispatchedAction = [];
  const dispatch = (action) => {
    dispatchedAction.push(action);
  };
  const getState = (twice) => () => ({
    asyncActionsState: {
      asyncActionsStates: [
        {
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          state: (!twice) ? DONE : PENDING,
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
        [group]: [
          0,
        ],
      },
      errorsCount: 0,
      successCount: 0,
      failedActionsIndexes: [],
      digested: 0,
    },
  });

  createActionCreatorFromPromise(
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
    (num) => new Promise((resolve) => {
      resolve(num + 1);
    }),
    (num, resolved) => ({ type: 'ADD', resolved })
  )(5)(dispatch, getState());

  createActionCreatorFromPromise(
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
    (num) => new Promise((resolve) => {
      resolve(num + 1);
    }),
    (num, resolved) => ({ type: 'ADD', resolved })
  )(7)(dispatch, getState(true));

  createActionCreatorFromPromise(
    SOMETHING_TO_DO_ASYNCHRONOUSLY,
    (num) => new Promise((resolve) => {
      resolve(num + 1);
    }),
    (num, resolved) => ({ type: 'ADD', resolved })
  )(8)(dispatch, getState(true));

  return new Promise(resolve => setTimeout(resolve, 200)).then(() => {
    t.same(dispatchedAction, [
      {
        type: PENDING,
        [ASYNC_UTILS_MARKER]: true,
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        [ASYNC_UTILS_STATE]: PENDING,
        [ASYNC_UTILS_STATE_GROUP]: undefined,
      },
      {
        type: 'ADD',
        resolved: 6,
        [ASYNC_UTILS_MARKER]: true,
        [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
        [ASYNC_UTILS_STATE]: DONE,
      },
    ]);
  });
});

test(
  'should create an action creator from the promise locking when other action is in pending',
  t => {
    const dispatchedAction = [];
    const dispatch = (action) => {
      dispatchedAction.push(action);
    };
    const getState = (twice) => () => ({
      asyncActionsState: {
        asyncActionsStates: [
          {
            [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
            state: (!twice) ? DONE : PENDING,
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
            0,
          ],
        },
        errorsCount: 0,
        successCount: 0,
        failedActionsIndexes: [],
        digested: 0,
      },
    });

    createActionCreatorFromPromise(
      SOMETHING_TO_DO_ASYNCHRONOUSLY,
      (num) => new Promise((resolve) => {
        resolve(num + 1);
      }),
      (num, resolved) => ({ type: 'ADD', resolved })
    )(5)(dispatch, getState());

    createActionCreatorFromPromise(
      SOMETHING_TO_DO_ASYNCHRONOUSLY,
      (num) => new Promise((resolve) => {
        resolve(num + 1);
      }),
      (num, resolved) => ({ type: 'ADD', resolved }),

      SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY
    )(7)(dispatch, getState());

    createActionCreatorFromPromise(
      SOMETHING_TO_DO_ASYNCHRONOUSLY,
      (num) => new Promise((resolve) => {
        resolve(num + 1);
      }),
      (num, resolved) => ({ type: 'ADD', resolved }),

      [SOMETHING_TO_DO_ASYNCHRONOUSLY, SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY]
    )(7)(dispatch, getState(true));

    createActionCreatorFromPromise(
      SOMETHING_TO_DO_ASYNCHRONOUSLY,
      (num) => new Promise((resolve) => {
        resolve(num + 1);
      }),
      (num, resolved) => ({ type: 'ADD', resolved }),

      [SOMETHING_TO_DO_ASYNCHRONOUSLY, SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY, { group }]
    )(7)(dispatch, getState(true));

    createActionCreatorFromPromise(
      SOMETHING_TO_DO_ASYNCHRONOUSLY,
      (num) => new Promise((resolve) => {
        resolve(num + 1);
      }),
      (num, resolved) => ({ type: 'ADD', resolved }),

      { group }
    )(7)(dispatch, getState(true));

    return new Promise(resolve => setTimeout(resolve, 200)).then(() => {
      t.same(dispatchedAction, [
        {
          type: PENDING,
          [ASYNC_UTILS_MARKER]: true,
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          [ASYNC_UTILS_STATE]: PENDING,
          [ASYNC_UTILS_STATE_GROUP]: undefined,
        },
        {
          type: 'ADD',
          resolved: 6,
          [ASYNC_UTILS_MARKER]: true,
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          [ASYNC_UTILS_STATE]: DONE,
        },
      ]);
    });
  }
);

test(
  'should create an action creator from the promise debouncing the calls',
  t => {
    const dispatchedAction = [];
    const dispatch = (action) => {
      dispatchedAction.push(action);
    };
    const getState = () => ({
      asyncActionsState: {
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
            0,
          ],
        },
        errorsCount: 0,
        successCount: 0,
        failedActionsIndexes: [],
        digested: 0,
      },
    });
    const getPromise = (num) => new Promise((resolve, reject) => {
      setTimeout(() => {
        if (num < 8) {
          resolve(num + 1);
        } else {
          reject(num);
        }
      }, 50);
    });

    const ac = createActionCreatorFromPromise(
      SOMETHING_TO_DO_ASYNCHRONOUSLY,
      getPromise,
      (num, resolved) => ({ type: 'ADD', resolved }),
      false,
      true
    );

    const acFailure = createActionCreatorFromPromise(
      SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
      getPromise,
      (num, resolved) => ({ type: 'ADD', resolved }),
      false,
      true
    );

    ac(5)(dispatch, getState);
    ac(6)(dispatch, getState);
    ac(7)(dispatch, getState);

    acFailure(8)(dispatch, getState);
    acFailure(9)(dispatch, getState);

    return new Promise(resolve => setTimeout(resolve, 400)).then(() => {
      t.same(dispatchedAction, [
        {
          type: PENDING,
          [ASYNC_UTILS_MARKER]: true,
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          [ASYNC_UTILS_STATE]: PENDING,
          [ASYNC_UTILS_STATE_GROUP]: undefined,
        },
        {
          type: PENDING,
          [ASYNC_UTILS_MARKER]: true,
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          [ASYNC_UTILS_STATE]: PENDING,
          [ASYNC_UTILS_STATE_GROUP]: undefined,
        },
        {
          type: PENDING,
          [ASYNC_UTILS_MARKER]: true,
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          [ASYNC_UTILS_STATE]: PENDING,
          [ASYNC_UTILS_STATE_GROUP]: undefined,
        },
        {
          type: PENDING,
          [ASYNC_UTILS_MARKER]: true,
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          [ASYNC_UTILS_STATE]: PENDING,
          [ASYNC_UTILS_STATE_GROUP]: undefined,
        },
        {
          type: PENDING,
          [ASYNC_UTILS_MARKER]: true,
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          [ASYNC_UTILS_STATE]: PENDING,
          [ASYNC_UTILS_STATE_GROUP]: undefined,
        },
        {
          type: 'ADD',
          resolved: 8,
          [ASYNC_UTILS_MARKER]: true,
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_TO_DO_ASYNCHRONOUSLY,
          [ASYNC_UTILS_STATE]: DONE,
        },
        {
          type: FAILURE,
          error: 9,
          [ASYNC_UTILS_MARKER]: true,
          [ASYNC_UTILS_STATE_FOR]: SOMETHING_ELSE_TO_DO_ASYNCHRONOUSLY,
          [ASYNC_UTILS_STATE]: FAILURE,
        },
      ]);
    });
  }
);
