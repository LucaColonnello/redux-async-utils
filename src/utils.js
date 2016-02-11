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
    throw new Error(`actionCretorFromPromise: manageAsyncStateFor is required,${
    ''}it can be a function or a string`);
  }

  if (!getPromise) {
    throw new Error('actionCretorFromPromise: getPromise is required');
  }

  let lastRequestKey;

  return (...args) => (dispatch, getState) => {
    let key = manageAsyncStateFor;
    if (typeof manageAsyncStateFor === 'function') {
      key = manageAsyncStateFor(...args);
    }

    // use a bool or a string property
    if (lockIfAlreadyInPending !== false) {
      if (
        typeof lockIfAlreadyInPending === 'boolean' &&
        !hasDone(getState(), key)
      ) {
        return;
      }

      if (
        typeof lockIfAlreadyInPending === 'string' &&
        !hasDone(getState(), lockIfAlreadyInPending)
      ) {
        return;
      }
    }

    const _lastRequestKey = (new Date()).getTime();
    lastRequestKey = _lastRequestKey;

    dispatch(pendingActionCreator(key));

    getPromise(...args)
      .then((d) => {
        if (debounce) {
          if (lastRequestKey !== _lastRequestKey) {
            return;
          }
        }

        if (d) {
          args.splice(0, 0, d);
        }

        dispatch(doneActionCreator(
          key,
          actionCreator(...args)
        ));
      })
      .catch((e) => {
        if (debounce) {
          if (lastRequestKey !== _lastRequestKey) {
            return;
          }
        }

        dispatch(failureActionCreator(key, e));
      })
    ;
  };
}
