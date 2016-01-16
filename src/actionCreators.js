import {
  ASYNC_UTILS_MARKER,
  ASYNC_STATE,
  ASYNC_STATE_FOR,
  PENDING,
  DONE,
  FAILURE,
} from './constants';

export function pendingActionCreator(manageAsyncStateFor = '') {
  return {
    type: PENDING,
    ASYNC_UTILS_MARKER,
    [ASYNC_STATE_FOR]: manageAsyncStateFor,
    [ASYNC_STATE]: PENDING,
  };
}

export function doneActionCreator(manageAsyncStateFor = '', actionToDispatch = { }) {
  return {
    type: DONE,
    ...actionToDispatch,
    ASYNC_UTILS_MARKER,
    [ASYNC_STATE_FOR]: manageAsyncStateFor,
    [ASYNC_STATE]: DONE,
  };
}

export function failureActionCreator(manageAsyncStateFor = '', error = false) {
  return {
    type: FAILURE,
    error,
    ASYNC_UTILS_MARKER,
    [ASYNC_STATE_FOR]: manageAsyncStateFor,
    [ASYNC_STATE]: FAILURE,
  };
}
