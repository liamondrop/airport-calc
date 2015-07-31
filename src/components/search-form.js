import React from 'react';

export default React.createClass({
  getInitialState() {
    return {active: false}
  },

  render() {
    const className = this.state.active ?
      'search-form active' : 'search-form';
    return (
      <form className={className}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}>
        <fieldset>{this.props.children}</fieldset>
      </form>
    );
  },

  // adds 'active' className to component.
  // clears mouseLeave handler if the
  // TIMEOUT_LENGTH hasn't yet expired
  _onMouseEnter(e) {
    clearTimeout(this.timeoutID);
    this.setState({active: true});
  },

  // delay mouseLeave handler to minimize
  // spastic UI perturbations
  _onMouseLeave(e) {
    this.timeoutID = setTimeout(() => {
      this.setState({active: false})
    }, app.config.searchForm.TIMEOUT_LENGTH);
  },
});
