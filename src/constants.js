export const ASYNC_UTILS_MARKER = 'ASYNC_UTILS_MARKER';
export const ASYNC_UTILS_STATE = 'ASYNC_STATE';
export const ASYNC_UTILS_STATE_FOR = 'ASYNC_STATE_FOR';
export const PENDING = Symbol('PENDING');
export const DONE = Symbol('DONE');
export const FAILURE = Symbol('FAILURE');
export const STATE_TO_STRING = {
  [PENDING]: 'PENDING',
  [DONE]: 'DONE',
  [FAILURE]: 'FAILURE',
};
