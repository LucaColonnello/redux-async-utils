import {
  ASYNC_UTILS_MARKER,
  ASYNC_UTILS_STATE,
  ASYNC_UTILS_STATE_FOR,
  DONE,
  FAILURE,
} from './constants';

export const initialState = {
  asyncActionsStates: [],
  indexes: {},
  errorsCount: 0,
  successCount: 0,
  failedActionsIndexs: [],
  digested: 0,
};

export default function asyncActionsState(state = initialState, action = {}) {
  let newState = state;

  if (action[ASYNC_UTILS_MARKER]) {
    const asyncState = action[ASYNC_UTILS_STATE];
    const error = action.error || null;
    const asyncStateFor = action[ASYNC_UTILS_STATE_FOR];

    let index;

    newState = {
      asyncActionsStates: state.asyncActionsStates.slice(0),
      indexes: state.indexes,
      errorsCount: state.errorsCount,
      failedActionsIndexs: state.failedActionsIndexs,
      successCount: state.successCount,
      digested: state.digested,
    };

    // look for asyncState in indexes
    if (typeof newState.indexes[asyncStateFor] !== 'undefined') {
      index = newState.indexes[asyncStateFor];
      newState.asyncActionsStates[index] = {
        [ASYNC_UTILS_STATE_FOR]: asyncStateFor,
        state: asyncState,
        error,
      };
    } else {
      // search in the array and create indexes
      newState.asyncActionsStates.forEach((v, i) => {
        if (v[ASYNC_UTILS_STATE_FOR] === asyncStateFor) {
          index = i;
          newState.asyncActionsStates[i] = {
            [ASYNC_UTILS_STATE_FOR]: asyncStateFor,
            state: asyncState,
            error,
          };
        }

        newState.indexes[v[ASYNC_UTILS_STATE_FOR]] = i;
      });
    }

    // create new
    if (typeof index !== 'undefined') {
      // update vars
      if (asyncState === DONE) {
        newState.digested++;
        newState.successCount++;
      }

      if (asyncState === FAILURE) {
        newState.digested++;
        newState.errorsCount++;
        newState.failedActionsIndexs.push(index);
      }
    } else {
      newState.asyncActionsStates.push({
        [ASYNC_UTILS_STATE_FOR]: asyncStateFor,
        state: asyncState,
        error,
      });

      // save index
      newState.indexes[asyncStateFor] = newState.asyncActionsStates.length - 1;
    }
  }

  return newState;
}
