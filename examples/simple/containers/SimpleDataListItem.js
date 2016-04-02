import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  updateActionCreator,
  createAsyncUpdateKey,
} from '../actions';
import { createAsyncActionsStateChecker } from 'redux-async-utils';

class SimpleDataListItem extends Component {

  cachedValue;

  updateItem(text) {
    if (text) {
      this.cachedValue = text;
    } else {
      text = this.cachedValue;
    }

    this.props.updateActionCreator(this.props.index, text);
  }

  handleRetry() {
    this.updateItem();
  }

  handleKeyPress(e) {
    const value = e.target.value;
    if (e.which === 13) {
      this.updateItem(value);
    }
  }

  render() {
    const {
      loading,
      errors,
      item,
    } = this.props;

    return (
      <li>
        {loading && !errors.length && <span>Loading...</span>}

        {!loading && !!errors.length &&
          <span>
            {errors[0].toString()} <button onClick={::this.handleRetry}>Retry!</button>
          </span>
        }

        {!loading && !errors.length &&
          <input type="text" defaultValue={item} onKeyPress={::this.handleKeyPress} />
        }
      </li>
    );
  }
}

SimpleDataListItem.propTypes = {
  updateActionCreator: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.array,
  item: PropTypes.any.isRequired,
};

function mapStateToProps(state = {}, props) {
  const asyncChecker = createAsyncActionsStateChecker(
    state,
    createAsyncUpdateKey(props.index).key
  );

  return {
    loading: asyncChecker.isPending(),
    errors: asyncChecker.getErrors(),
    item: state.simpleDataList[props.index],
  };
}

export default connect(mapStateToProps, {
  updateActionCreator,
})(SimpleDataListItem);
