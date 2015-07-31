import React from 'react';
import app from 'ampersand-app';

const unitsMap = {
  km: { // 1 meter = 0.001 kilometers 
    name: 'kilometer',
    value: 0.001
  },
  mi: { // 1 meter = 0.000621371 miles
    name: 'mile',
    value: 0.000621371
  },
  nm: { // 1 meter = 0.000539957 nautical miles
    name: 'nautical mile',
    value: 0.000539957
  }
};

export default React.createClass({
  getInitialState() {
    return {units: 'nm'};
  },

  // Gets the distance between 2 (lat, lng) points from maps api,
  // converts to appropriate metric, and renders friendly output
  getDistance() {
    const {origin, destination} = this.props;
    if (app.google && origin && destination) {
      const geometry = app.google.maps.geometry.spherical;
      const meters = geometry.computeDistanceBetween(origin, destination);
      const units = unitsMap[this.state.units];
      const distance = meters * units.value;
      const s = distance === 1 ? '' : 's';
      return `${distance.toFixed(3)} ${units.name}${s}`;
    }
  },

  render() {
    return (
      <div className="placard">
        <div>
          <span className="distance">Distance in</span>
          <ul className="units">
            <li><a id="km" className={this._getClass('km')} href="#" onClick={this._onClick}>km</a></li>
            <li>&middot;</li>
            <li><a id="mi" className={this._getClass('mi')} href="#" onClick={this._onClick}>mi</a></li>
            <li>&middot;</li>
            <li><a id="nm" className={this._getClass('nm')} href="#" onClick={this._onClick}>nm</a></li>
          </ul>
        </div>
        <div className="metric">{this.getDistance() || 'Choose an origin and destination'}</div>
      </div>
      );
  },

  _getClass(unit) {
    return unit === this.state.units ?
      'active' : null;
  },

  _onClick(e) {
    e.preventDefault();
    const {units} = this.state;
    const newUnits = e.currentTarget.id;
    if (newUnits !== units) {
      this.setState({units: newUnits});
    }
  }
});
