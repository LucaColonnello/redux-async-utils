import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createAsyncActionsStateChecker } from 'redux-async-utils';

class GlobalLoader extends Component {
  render() {
    const { loading } = this.props;

    return (
      <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
        {loading && <p>Loading...</p>}
      </div>
    );
  }
}

GlobalLoader.propTypes = {
  loading: PropTypes.bool,
};

function mapStateToProps(state = {}) {
  const asyncChecker = createAsyncActionsStateChecker(
    state
  );

  return {
    loading: !asyncChecker.hasDone(),
  };
}

export default connect(mapStateToProps)(GlobalLoader);
