import {
  ASYNC_UTILS_MARKER,
  ASYNC_UTILS_STATE,
  ASYNC_UTILS_STATE_FOR,
  ASYNC_UTILS_STATE_GROUP,
  PENDING,
  DONE,
  FAILURE,
  INVALIDATED,
} from './constants';

export function pendingActionCreator(manageAsyncStateFor, group) {
  return {
    type: PENDING,
    [ASYNC_UTILS_MARKER]: true,
    [ASYNC_UTILS_STATE_FOR]: manageAsyncStateFor,
    [ASYNC_UTILS_STATE_GROUP]: group,
    [ASYNC_UTILS_STATE]: PENDING,
  };
}

export function doneActionCreator(manageAsyncStateFor, actionToDispatch = false) {
  if (actionToDispatch) {
    actionToDispatch[ASYNC_UTILS_MARKER] = true;
    actionToDispatch[ASYNC_UTILS_STATE_FOR] = manageAsyncStateFor;
    actionToDispatch[ASYNC_UTILS_STATE] = DONE;
  } else {
    return {
      type: DONE,
      [ASYNC_UTILS_MARKER]: true,
      [ASYNC_UTILS_STATE_FOR]: manageAsyncStateFor,
      [ASYNC_UTILS_STATE]: DONE,
    };
  }

  return actionToDispatch;
}

export function failureActionCreator(manageAsyncStateFor, error = null) {
  return {
    type: FAILURE,
    error,
    [ASYNC_UTILS_MARKER]: true,
    [ASYNC_UTILS_STATE_FOR]: manageAsyncStateFor,
    [ASYNC_UTILS_STATE]: FAILURE,
  };
}

export function invalidateActionCreator(manageAsyncStateFor) {
  return {
    type: INVALIDATED,
    [ASYNC_UTILS_MARKER]: true,
    [ASYNC_UTILS_STATE_FOR]: manageAsyncStateFor,
    [ASYNC_UTILS_STATE]: INVALIDATED,
  };
}
