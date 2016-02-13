import {
  PENDING,
  FAILURE,
  ASYNC_UTILS_STATE_FOR,
} from './constants';

class AsyncActionsStateChecker {
  allDone = null;
  errors = null;
  asyncActionsState = null;

  constructor(opt = {}) {
    this.allDone = opt.allDone;
    this.errors = opt.errors;
    this.asyncActionsState = opt.asyncActionsState;
  }

  hasDone(checkFor) {
    if (!this.asyncActionsState) {
      return this.allDone;
    }

    if (checkFor) {
      const asyncState = this.asyncActionsState[checkFor].state;
      return asyncState !== PENDING;
    }

    const keys = Object.keys(this.asyncActionsState);
    return keys
      .filter((k) => {
        return this.asyncActionsState[k].state !== PENDING;
      })
      .length === keys.length
    ;
  }

  getErrors() {
    if (!this.asyncActionsState) {
      return this.errors;
    }

    return Object.keys(this.asyncActionsState)
      .filter((k) => {
        return this.asyncActionsState[k].state === FAILURE;
      })
      .map(k => this.asyncActionsState[k].error);
  }
}

export default function createAsyncActionsStateChecker(store = {}, ...checkFor) {
  let asyncActionsStateChecker;
  if (store.asyncActionsState) {
    if (!checkFor.length) {
      asyncActionsStateChecker = new AsyncActionsStateChecker({
        allDone: (
          store.asyncActionsState.digested === store.asyncActionsState.asyncActionsStates.length
        ),
        errors: store
          .asyncActionsState
          .failedActionsIndexes.map(i => {
            return store
              .asyncActionsState
              .asyncActionsStates[i].error;
          })
        ,
      });
    } else {
      const asyncActionsState = {};
      checkFor.forEach((k) => {
        if (typeof k === 'object' && k.group) {
          // manage groups
          const value = store
          .asyncActionsState
          .groups[k.group];

          if (value && value.length) {
            value.forEach((v) => {
              const action = store
              .asyncActionsState
              .asyncActionsStates[v];
              asyncActionsState[action[ASYNC_UTILS_STATE_FOR]] = action;
            });
          }
        } else if (typeof k === 'string') {
          const value = store
          .asyncActionsState
          .asyncActionsStates[store.asyncActionsState.indexes[k]];

          if (value) {
            asyncActionsState[k] = value;
          }
        }
      });

      asyncActionsStateChecker = new AsyncActionsStateChecker({
        asyncActionsState,
      });
    }
  } else {
    throw new Error(
      `redux-async-utils: createAsyncActionsStateChecker ` +
      `requires asyncActionsState reducer to be in the store`
    );
  }

  return asyncActionsStateChecker;
}
