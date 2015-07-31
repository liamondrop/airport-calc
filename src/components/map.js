import React from 'react';
import app from 'ampersand-app';
import {GoogleMaps, Polyline, Marker} from 'react-google-maps';

// Custom pin icon so we can match the colors
function pinIcon(color) {
  return {
    path: 3,
    fillColor: color,
    fillOpacity: 0.65,
    strokeColor: color,
    strokeOpacity: 0.90,
    strokeWeight: 2,
    scale: 7,
    animation: 2
  };
}

export default React.createClass({
  getInitialState() {
    return app.config.map;
  },

  // pass the map instance to the app
  // for easy app-wide access
  componentDidMount() {
    app.map = this.refs.map;
  },

  componentDidUpdate() {
    this.updateMapBounds();
  },

  updateMapBounds() {
    const {origin, destination} = this.props;
    const {map} = this.refs;
    if (origin || destination) {
      const bounds = new app.google.maps.LatLngBounds();
      if (origin) bounds.extend(origin);
      if (destination) bounds.extend(destination);
      map.fitBounds(bounds);
    }
  },

  // If both origin and destination are defined, return
  // them in an array, otherwise, return an empty array
  // returns [<LatLng>, <LatLng>] suitable for Polyline path
  getPolylinePath() {
    const {origin, destination} = this.props;
    return origin && destination ?
      [origin, destination] : [];
  },

  render() {
    const {google, origin, destination} = this.props;
    return (
      <GoogleMaps {...this.state} ref="map"
        containerProps={{style: {height: '100%'}}}
        googleMapsApi={google ? google.maps : null}>
        <Polyline {...app.config.polyline} path={this.getPolylinePath()}/>
        <Marker position={origin} icon={app.config.circleIcon}/>
        <Marker position={destination} icon={app.config.circleIcon}/>
        <Marker position={origin} icon={pinIcon(app.config.ORIG_COLOR)}/>
        <Marker position={destination} icon={pinIcon(app.config.DEST_COLOR)}/>
      </GoogleMaps>
      );
  }
});
