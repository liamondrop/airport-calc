import React from 'react';
import app from 'ampersand-app';
import SuggestionPanel from './suggestion-panel';

export default React.createClass({
  getInitialState() {
    return {
      query: '',
      activeIndex: 0,
      results: []
    };
  },

  // Because our lat,lng data is a little fuzzy at times,
  // use a google nearby search with a radius of 100km from the given
  // coords for all airports, ordered by distance. Return
  // the first result. If the places service is unhappy with
  // the request, or comes up empty fallback to mapping the latLng coords
  getPlace(model) {
    if (app.google) {
      const {name, onPlaceChange} = this.props;
      const latLng = new app.google.maps.LatLng(model.lat, model.lng);
      const request = {
        location: latLng,
        radius: 100000,
        rankby: 'distance',
        keyword: 'airport'
      };
      app.places.nearbySearch(request, (results, status) => {
        if (status == app.google.maps.places.PlacesServiceStatus.OK) {
          const {geometry} = results[0];
          const location = geometry ? geometry.location : null;
          onPlaceChange(name, location);
        } else {
          onPlaceChange(name, latLng);
        }
      });
    }
  },

  render() {
    const {name} = this.props;
    const {query, results, activeIndex} = this.state;
    return (
      <div className={`form-element input-group ${name}`}>
        <label htmlFor={name} className="input-group-addon">
          {name.slice(0, 4).toUpperCase()}
        </label>
        <input
          type="text"
          className="form-input"
          ref="input"
          name={name}
          value={query}
          onChange={this._onInputChange}
          onKeyDown={this._onKeyDown}
          onBlur={this._onInputBlur}
          placeholder={`Enter ${name}`}
        />
        <SuggestionPanel
          query={query}
          results={results}
          activeIndex={activeIndex}
          onClick={this._onSuggestionClick}
          onMouseEnter={this._onSuggestionMouseEnter}
        />
      </div>
    );
  },

  selectSuggestion(model) {
    this.setState({
      query: model.name || model.code,
      activeIndex: 0,
      results: []
    });
    this.getPlace(model);
  },

  clearSuggestions() {
    this.setState({
      activeIndex: 0,
      results: []
    })
  },

  prevSuggestion() {
    const {activeIndex} = this.state;
    if (activeIndex > 0) {
      this.setState({activeIndex: activeIndex - 1});
    }
  },

  nextSuggestion() {
    const {activeIndex, results} = this.state;
    if (activeIndex < results.length - 1) {
      this.setState({activeIndex: activeIndex + 1});
    }
  },

  _onKeyDown(e) {
    const {activeIndex, results} = this.state;
    if (results.length) {
      switch (e.key) {
        case 'ArrowUp':
          this.prevSuggestion();
          break;
        case 'ArrowDown':
          this.nextSuggestion();
          break;
        case 'Enter':
          this.selectSuggestion(results[activeIndex]);
          break;
        case 'Escape':
          this.clearSuggestions();
          break;
      }
    }
  },

  _onInputChange(e) {
    const {value} = e.target;
    this.setState({
      query: value,
      results: app.airports.lookup(value),
      activeIndex: 0
    });
  },

  // HACK: timeout to ensure correct order
  // of event firing. e.g. suggestion click handler
  // should precede blur handler, not vice versa
  _onInputBlur(e) {
    setTimeout(() => {
      this.clearSuggestions();
    }, 100);
  },

  _onSuggestionMouseEnter(index) {
    this.setState({activeIndex: index});
  },

  _onSuggestionClick(model) {
    this.selectSuggestion(model);
  }
});

