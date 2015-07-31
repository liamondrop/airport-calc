import React from 'react';
import styles from './styles';
import GoogleMapsLoader from 'google-maps';
import app from 'ampersand-app';
import config from './config.json';
import airportsData from './data/airports.json';
import AirportsCollection from './collections/airports';
import Main from './components/main';

app.extend({
  init() {
    this.google = null;
    this.map = null;
    this.places = null;
    this.config = config;
    this.airports = new AirportsCollection();
    this.airports.reset(airportsData);
    this.render();
    return this;
  },

  // pass Google as a prop to <Main/> to
  // force an update on the map component
  // once Google has loaded
  render() {
    React.render(
      <Main google={this.google}/>,
      document.body
      );
  }
});

// load Google maps api. Triggers callback when api is loaded
GoogleMapsLoader.LIBRARIES = ['places', 'geometry'];
GoogleMapsLoader.load(function (google) {
  app.google = google;
  app.render(); // re-render once google has loaded

  // initiate new PlacesService if map instance exists
  if (app.map.state.instance) {
    const {PlacesService} = google.maps.places;
    app.places = new PlacesService(app.map.state.instance);
  }
});

// start the app!
window.app = app.init();
