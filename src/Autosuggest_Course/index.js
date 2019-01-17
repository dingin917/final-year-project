import Autosuggest from 'react-autosuggest';

import React, { Component } from 'react';
import './style.css';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class Autosuggest_Course extends React.Component {
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
    let courses = this.props.courses;
    if (courses == null) {
      return [];
    }
    return courses.filter(course => regex.test(course.code));
  }
  
  getSuggestionValue = suggestion => {
    return suggestion.code;
  }
  
  renderSuggestion = suggestion => {
    return (
      <span>{suggestion.code}</span>
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
      placeholder: "Type course code",
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

export default Autosuggest_Course;