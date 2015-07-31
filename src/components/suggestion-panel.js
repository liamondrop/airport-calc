import React from 'react';

// A pretty list of suggested airports with their
// query matches highlighted
export default React.createClass({
  buildSuggestion(model) {
    const {code, name, city, state} = model;
    let suggestion = [`<span class="code">${this.embolden(code)}</span>`];
    if (name) {
      suggestion.push(`<span class="name">${this.embolden(name)}</span>`);
    }
    if (city && state) {
      const cityState = `${city}, ${state}`;
      suggestion.push(`<span class="city-state">${this.embolden(cityState)}</span>`);
    }
    return {__html: suggestion.join('')};
  },

  // Use a bit of regex magic to wrap all pattern matches
  // in a given suggestion in <strong/> tags
  embolden(str) {
    const pattern = /[\-\[\]<>{}()*+?.,\\\^$|#\s]/g;
    const query = this.props.query.replace(pattern, '\\$&');
    const regex = new RegExp(`(${query})`, 'ig');
    return str.replace(regex, ($1, match) => {
      return `<strong>${match}</strong>`;
    });
  },

  render() {
    const {results, activeIndex} = this.props;
    return (
      <ul className="list-unstyled dropdown suggestion-panel">
        {results.map((model, index) => {
          return (
            <li key={index}
              className={index === activeIndex ? 'active' : null}
              dangerouslySetInnerHTML={this.buildSuggestion(model)}
              onMouseEnter={this._onMouseEnter(index)}
              onClick={this._onClick(model)}
            />
            );
        })}
      </ul>
    );
  },

  _onMouseEnter(index) {
    const {onMouseEnter} = this.props;
    return function _onMouseEnterCallback() {
      onMouseEnter(index);
    };
  },

  _onClick(model) {
    const {onClick} = this.props;
    return function _onClickCallback() {
      onClick(model);
    };
  }
});
