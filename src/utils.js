import {
  pendingActionCreator,
  doneActionCreator,
  failureActionCreator,
} from './actionCreators';
import createAsyncActionsStateChecker from './createAsyncActionsStateChecker';

export const hasDone = (state, ...checkFor) =>
createAsyncActionsStateChecker(state, ...checkFor).hasDone();

export function createActionCreatorFromPromise(
  manageAsyncStateFor,
  getPromise,
  actionCreator,
  lockIfAlreadyInPending = true,
  debounce = false
) {
  if (!manageAsyncStateFor) {
    throw new Error(`createActionCreatorFromPromise: manageAsyncStateFor is required,${
    ''}it can be a function or a string`);
  }

  if (!getPromise) {
    throw new Error('createActionCreatorFromPromise: getPromise is required');
  }

  let lastRequestKey;

  return (...args) => (dispatch, getState) => {
    let key;
    let group;
    let asyncStateFor;

    if (typeof manageAsyncStateFor === 'function') {
      const manageAsyncStateForArgs = args.slice(0);
      manageAsyncStateForArgs.push(getState);
      asyncStateFor = manageAsyncStateFor(...manageAsyncStateForArgs);
    } else {
      asyncStateFor = manageAsyncStateFor;
    }

    if (typeof asyncStateFor === 'object') {
      key = asyncStateFor.key;
      group = asyncStateFor.group;
    } else if (typeof asyncStateFor === 'string') {
      key = asyncStateFor;
    }

    // use a bool or a string property
    if (lockIfAlreadyInPending !== false) {
      if (
        typeof lockIfAlreadyInPending === 'boolean' &&
        !hasDone(getState(), key)
      ) {
        return Promise.resolve();
      }

      if (
        typeof lockIfAlreadyInPending === 'string' &&
        !hasDone(getState(), lockIfAlreadyInPending)
      ) {
        return Promise.resolve();
      }

      if (
        typeof lockIfAlreadyInPending === 'object' &&
        lockIfAlreadyInPending.length &&
        !hasDone(getState(), ...lockIfAlreadyInPending)
      ) {
        return Promise.resolve();
      }

      if (
        typeof lockIfAlreadyInPending === 'object' &&
        typeof lockIfAlreadyInPending.length === 'undefined' &&
        !hasDone(getState(), lockIfAlreadyInPending)
      ) {
        return Promise.resolve();
      }
    }

    const _lastRequestKey = (new Date()).getTime() + (Math.random() + 1000);
    lastRequestKey = _lastRequestKey;

    dispatch(pendingActionCreator(key, group));

    const promiseArgs = args.slice(0);
    promiseArgs.push(dispatch, getState);

    return getPromise(...promiseArgs)
      .then((d) => {
        if (debounce) {
          if (lastRequestKey !== _lastRequestKey) {
            return void 0;
          }
        }

        const doneActionCreatorArgs = args.slice(0);
        doneActionCreatorArgs.push(d, getState);

        dispatch(doneActionCreator(
          key,
          actionCreator(...doneActionCreatorArgs)
        ));

        return d;
      })
      .catch((e) => {
        if (debounce) {
          if (lastRequestKey !== _lastRequestKey) {
            return void 0;
          }
        }

        dispatch(failureActionCreator(key, e));

        return e;
      })
    ;
  };
}
