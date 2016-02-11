import {
  ASYNC_UTILS_MARKER,
  ASYNC_UTILS_STATE,
  ASYNC_UTILS_STATE_FOR,
  PENDING,
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
    let previousState;

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
      previousState = Object.assign({}, newState.asyncActionsStates[index]);
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
          previousState = Object.assign({}, newState.asyncActionsStates[index]);
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
    if (typeof index === 'undefined') {
      newState.asyncActionsStates.push({
        [ASYNC_UTILS_STATE_FOR]: asyncStateFor,
        state: asyncState,
        error,
      });

      // save index
      newState.indexes[asyncStateFor] = newState.asyncActionsStates.length - 1;
      index = newState.asyncActionsStates.length - 1;
    }

    // if an async action was digested and a new pending action is requested,
    // reset digested, successCount and errorsCount as the action was never requested before
    if (
      previousState &&

      // prevent variables reset in case of simple passage from PENDING to other state
      // in that case the action has to be digested yet
      previousState.state !== PENDING &&

      // prevent pending action dispatched twice
      previousState.state !== asyncState
    ) {
      newState.digested--;
      if (previousState.state === DONE) {
        newState.successCount--;
      }

      if (previousState.state === FAILURE) {
        newState.errorsCount--;
        newState.failedActionsIndexs.splice(newState.failedActionsIndexs.indexOf(index), 1);
      }
    }

    // update vars
    if (asyncState === DONE && (!previousState || previousState.state !== DONE)) {
      newState.digested++;
      newState.successCount++;
    }

    if (asyncState === FAILURE && (!previousState || previousState.state !== FAILURE)) {
      newState.digested++;
      newState.errorsCount++;
      newState.failedActionsIndexs.push(index);
    }
  }

  return newState;
}
