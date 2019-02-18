import Autosuggest from 'react-autosuggest';

import React, { Component } from 'react';
import './style.css';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class Autosuggest_Venue extends React.Component {
  constructor(prop) {
    super(prop);

    this.state = {
      value: '',
      suggestions: []
    };    
  }

  getSuggestions = value => {
    const escapedValue = escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') {
      return [];
    }
  
    const regex = new RegExp(escapedValue, 'i');
    let venues = this.props.venues;
    if (venues == null || venues == undefined) {
      return [];
    }
    console.log("error of venues.filter, venues -> \n", + JSON.stringify(venues));
    return venues.filter(venue => regex.test(venue.venue));;
  }
  
  getSuggestionValue = suggestion => {
    return suggestion.venue;
  }
  
  renderSuggestion = suggestion => {
    return (
      <span>{suggestion.venue}</span>
    );
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type a venue",
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest 
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps} 
        onSuggestionSelected={this.props.handleSuggestSelected}/>
    );
  }
}

export default Autosuggest_Venue;