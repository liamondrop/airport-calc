import React from 'react';
import app from 'ampersand-app';
import SearchForm from './search-form';
import Autocomplete from './autocomplete';
import UnitControls from './unit-controls';
import MapComponent from './map';


export default React.createClass({
  getInitialState() {
    return {
      origin: null,
      destination: null
    };
  },

  render() {
    return (
      <div className="root">
        <SearchForm>
          <Autocomplete name="origin"
            onPlaceChange={this._onPlaceChange}/>
          <Autocomplete name="destination"
            onPlaceChange={this._onPlaceChange}/>
          <UnitControls {...this.state}/>
        </SearchForm>
        <MapComponent google={this.props.google} {...this.state}/>
      </div>
    );
  },

  _onPlaceChange(name, latLng) {
    let stateObj = {};
    stateObj[name] = latLng;
    this.setState(stateObj);
  }
});
