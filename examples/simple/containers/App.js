import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  addActionCreator,
  removeActionCreator,
  setActionCreator,
  ADD_ASYNC,
  REMOVE_ASYNC,
  SET_ASYNC,
} from '../actions';
import GlobalLoader from '../containers/GlobalLoader';
import SimpleDataListItem from '../containers/SimpleDataListItem';
import {
  invalidateActionCreator,
  createAsyncActionsStateChecker,
} from 'redux-async-utils';

class App extends Component {

  render() {
    const {
      loading,
      errors,
      list,
    } = this.props;

    const _addActionCreator = () => {
      this.props.addActionCreator().then((d) => {
        if (d instanceof Error) return;
        this.props.invalidateActionCreator(ADD_ASYNC);
      });
    };

    const _removeActionCreator = () => {
      this.props.removeActionCreator().then((d) => {
        if (d instanceof Error) return;
        this.props.invalidateActionCreator(REMOVE_ASYNC);
      });
    };

    const _setActionCreator = () => {
      this.props.setActionCreator().then((d) => {
        if (d instanceof Error) return;
        this.props.invalidateActionCreator(SET_ASYNC);
      });
    };

    return (
      <div>
        <button onClick={_addActionCreator}>Add</button>
        <button onClick={_removeActionCreator}>Remove</button>
        <button onClick={_setActionCreator}>Set</button>


        {loading && !errors.length && <p>Loading...</p>}

        {!loading && !!errors.length &&
          <div>
            <p>Errors:</p>

            <ul>
              {errors.map((v, i) => <li key={i}>{v.toString()}</li>)}
            </ul>
          </div>
        }

        {!loading && !errors.length &&
          <div>
            <p>List:</p>

            <ul>
              {list.map((v, i) => <SimpleDataListItem key={`${i}#${v}`} index={i} />)}
            </ul>
          </div>
        }

        <GlobalLoader />
      </div>
    );
  }
}

App.propTypes = {
  invalidateActionCreator: PropTypes.func.isRequired,
  addActionCreator: PropTypes.func.isRequired,
  removeActionCreator: PropTypes.func.isRequired,
  setActionCreator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.array,
  list: PropTypes.array,
};

function mapStateToProps(state = {}) {
  const asyncChecker = createAsyncActionsStateChecker(
    state,
    ADD_ASYNC,
    REMOVE_ASYNC,
    SET_ASYNC,
  );

  return {
    loading: asyncChecker.isPending(),
    errors: asyncChecker.getErrors(),
    list: state.simpleDataList || [],
  };
}

export default connect(mapStateToProps, {
  invalidateActionCreator,
  addActionCreator,
  removeActionCreator,
  setActionCreator,
})(App);
