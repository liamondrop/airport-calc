# Airport Distance Calculator

Here's a demo app to calculate the distance between two airports. Distances can be toggled between nautical miles, miles and kilometers. Airport locations are plotted on Google maps. After growing increasingly disappointed in the shortcomings of several airport location APIs, as well as Google maps' Places Autocomplete service, which mysteriously doesn't support filtering by location types like 'airport', I decided to compile the data from freely available sources and write my own little relevance score algorithm (found in `./src/collections/airports.js`). It's not flawless, but it works pretty darn well for a demo app, if I may be so bold.

## Running the app

The demo webserver has been tested on Node.js v0.10.29.

* First, `cd` to this directory and `npm install` to get all your dependencies.
* Then, `npm start` will start up a webpack dev server. This is responsible for parsing the JSX and ES6 and Stylus, bundling up the CommonJS modules, watching for changes, live reloading the browser.
* After all the stuff is compiled, the app should be running at http://localhost:3000
