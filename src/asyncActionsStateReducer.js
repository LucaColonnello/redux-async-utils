import {
  ASYNC_UTILS_MARKER,
  ASYNC_UTILS_STATE,
  ASYNC_UTILS_STATE_FOR,
} from './constants';

const initialState = [];

export default function asyncActionsState(state = initialState, action = {}) {
  let newState = state;

  if (action[ASYNC_UTILS_MARKER]) {
    const asyncState = action[ASYNC_UTILS_STATE];
    const error = action.error || null;
    const asyncStateFor = action[ASYNC_UTILS_STATE_FOR];

    let found = false;
    newState = newState.map(v => {
      if (v[ASYNC_UTILS_STATE_FOR] === asyncStateFor) {
        found = true;
        return {
          [ASYNC_UTILS_STATE_FOR]: asyncStateFor,
          state: asyncState,
          error,
        };
      }

      return v;
    });

    if (!found) {
      newState.push({
        [ASYNC_UTILS_STATE_FOR]: asyncStateFor,
        state: asyncState,
        error,
      });
    }
  }

  return newState;
}
