import {
  ADD,
  UPDATE,
  REMOVE,
  SET,
} from '../actions';

const actions = {
  [ADD]: (state, action) => { state.push(action.data); return state.slice(0); },
  [UPDATE]: (state, { index, data }) => { state[index] = data; return state.slice(0); },
  [SET]: (state, action) => action.data,
  [REMOVE]: (state, action) => { state.splice(action.index, 1); return state.slice(0); },
};

const simpleDataList = function simpleDataList(state = [], action) {
  return (actions[action.type]) ? actions[action.type](state, action) : state;
};
export default simpleDataList;
