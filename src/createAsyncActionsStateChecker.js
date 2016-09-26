import {
  PENDING,
  FAILURE,
  INVALIDATED,
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

    let done = false;
    if (checkFor) {
      if (this.asyncActionsState[checkFor]) {
        const asyncState = this.asyncActionsState[checkFor].state;
        done = asyncState !== PENDING;
      }
    } else {
      const keys = Object.keys(this.asyncActionsState);
      done = (keys.length > 0 && keys
        .filter((k) => {
          return (
            this.asyncActionsState[k] &&
            this.asyncActionsState[k].state !== PENDING &&
            this.asyncActionsState[k].state !== INVALIDATED
          );
        })
        .length === keys.length)
      ;
    }


    return done;
  }

  isPending(checkFor) {
    if (!this.asyncActionsState) {
      return !this.allDone;
    }

    let pending = false;
    if (checkFor) {
      if (this.asyncActionsState[checkFor]) {
        const asyncState = this.asyncActionsState[checkFor].state;
        pending = asyncState === PENDING;
      }
    } else {
      const keys = Object.keys(this.asyncActionsState);
      pending = (keys.length > 0 && keys
        .filter((k) => {
          return (
            this.asyncActionsState[k] &&
            this.asyncActionsState[k].state === PENDING
          );
        })
        .length > 0)
      ;
    }


    return pending;
  }

  getErrors() {
    if (!this.asyncActionsState) {
      return this.errors;
    }

    return Object.keys(this.asyncActionsState)
      .filter((k) => {
        return this.asyncActionsState[k] && this.asyncActionsState[k].state === FAILURE;
      })
      .map(k => this.asyncActionsState[k].error);
  }
}

export default function createAsyncActionsStateChecker(state = {}, ...checkFor) {
  let asyncActionsStateChecker;
  if (state.asyncActionsState) {
    if (!checkFor.length) {
      asyncActionsStateChecker = new AsyncActionsStateChecker({
        allDone: (
          state.asyncActionsState.digested === state.asyncActionsState.asyncActionsStates.length
        ),
        errors: state
          .asyncActionsState
          .failedActionsIndexes.map(i => {
            return state
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
          const value = state
          .asyncActionsState
          .groups[k.group];

          if (value && value.length) {
            value.forEach((v) => {
              const action = state
              .asyncActionsState
              .asyncActionsStates[v];
              asyncActionsState[action[ASYNC_UTILS_STATE_FOR]] = action;
            });
          }
        } else if (typeof k === 'string') {
          const value = state
          .asyncActionsState
          .asyncActionsStates[state.asyncActionsState.indexes[k]];

          asyncActionsState[k] = value;
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
