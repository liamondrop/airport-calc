import Collection from 'ampersand-collection';

const MAX_RESULTS = 10;

// A searchable collection of airports
export default Collection.extend({

  // airport lookup public api
  lookup(query) {
    if (query) {

      // strip out non-alpha characters and spaces and force to
      // lower case in order to search on the special 'search'
      // property present on all the models
      const sanitized = query.replace(/[\s\W_]+/g, '').toLowerCase();
      if (sanitized.length) {

        // filters the models in the collection
        const results = this.filter(_matcher(sanitized));
        
        // sort filtered results by relevance score
        const sorted = results.sort((a, b) => {
          if (a.score < b.score) return 1;
          if (a.score > b.score) return -1;
          return 0;
        });
        
        // only return the top 10 results
        return sorted.slice(0, MAX_RESULTS);
      }
    }
    return []; // return empty result set if no query
  }
});

// `_matcher` (private)
// 
// Callback to Collection.filter
// -----------------------------
// Checks whether a model matches a given query string
// and, if so, assigns a rudimentary relevance score
function _matcher(query) {
  const regex = new RegExp(query, 'gi');
  
  // returns a closure back to Collection.filter
  // this is just to capture the query string
  return function _matcherFilter(model) {
    
    // model.search is a property computed to work with this
    // matching algo. See ../data/airports.json for details.
    // First, test that the query exists somewhere in the
    // model.search string
    if (regex.test(model.search)) {

      // Next, check the index of the first match
      // as well as the total number of matches
      let index = model.search.indexOf(query);
      const matches = model.search.match(regex);

      // this should never happen, but just in case
      if (index < 0) {
        index = 1000;
      }
      
      // if the query matches the first letter of the
      // airport code or airport name, assign it a high score
      if (model.code.toLowerCase().indexOf(query) === 0 ||
          model.name.toLowerCase().indexOf(query) === 0) {
        model.score = 1000;
      }

      // otherwise, divide the number of string matches by the
      // string position of the first match. E.g. if the query
      // matches 3 different parts of the model.search string
      // and the the first match happens at the second character,
      // (index 1) assign the match a score of 3 / (1 + 1) == 1.5 *
      // * (add 1 to the index to avoid dividing by 0)
      else {
        model.score = matches.length / (index + 1);
      }
      return true;
    }
  }
}
