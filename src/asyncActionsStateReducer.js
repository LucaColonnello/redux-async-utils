import {
  ASYNC_UTILS_MARKER,
  ASYNC_STATE,
  ASYNC_STATE_FOR,
} from './constants';

const initialState = { };

export default function asyncActionsState(state = initialState, action = {}) {
  let newState = state;

  if (action[ASYNC_UTILS_MARKER]) {
    const asyncState = action[ASYNC_STATE];
    const error = action.error;
    const asyncStateFor = action[ASYNC_STATE_FOR];

    // build state
    newState = {
      ...state,
      [asyncStateFor]: {
        state: asyncState,
        error,
      },
    };
  }

  return newState;
}
