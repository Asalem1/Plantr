import React from 'react';
import { connect } from 'react-redux';
import { setWidth, setHeight, setGardenParameters, setGarden, getAllGardens, getAllPlants, setDropdown, getGardenFromDropdown, getPlantsFromDropdown} from '../Actions/GardenActions.js';
import axios from 'axios';
import GardenGrid from './GardenGrid.js';
import MySquare from './MySquare.js';
import {Layer, Rect, Circle, Stage, Group} from 'react-konva';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PlantGrid from './PlantGrid.js';
import Plant from './Plant.js';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'



const people = [
  {
    first: 'Charlie',
    last: 'Brown',
    twitter: 'dancounsell'
  },
  {
    first: 'Charlotte',
    last: 'White',
    twitter: 'mtnmissy'
  },
  {
    first: 'Chloe',
    last: 'Jones',
    twitter: 'ladylexy'
  },
  {
    first: 'Cooper',
    last: 'King',
    twitter: 'steveodom'
  }
];

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('\\b' + escapedValue, 'i');

  return people.filter(person => regex.test(getSuggestionValue(person)));
}

function getSuggestionValue(suggestion) {
  return `${suggestion.first} ${suggestion.last}`;
}

function renderSuggestion(suggestion, { query }) {
  const suggestionText = `${suggestion.first} ${suggestion.last}`;
  const matches = match(suggestionText, query);
  const parts = parse(suggestionText, matches);

  return (
    <span className={'suggestion-content ' + suggestion.twitter}>
      <span className="name">
        {
          parts.map((part, index) => {
            const className = part.highlight ? 'highlight' : null;

            return (
              <span className={className} key={index}>{part.text}</span>
            );
          })
        }
      </span>
    </span>
  );
}



class GardenSquareGridView extends React.Component{
 constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
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
      placeholder: "Type 'c'",
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps} />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    gardenDropdown: state.gardenReducer.gardenDropdown
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    dispatchSetGardenParameters(width, height, color) {
      dispatch(setGardenParameters(width, height, color));
    },
    dispatchSetDropdown(dbDropdownOptions) {
      dispatch(setDropdown(dbDropdownOptions));
    },
    dispatchSetGarden(dbGardenGrid) {
      dispatch(setGarden(dbGardenGrid));
    },
    dispatchGetAllGardens(dbGardenGrids) {
      dispatch(getAllGardens(dbGardenGrids));
    },
    dispatchGetAllPlants(dbPlantGrids) {
      dispatch(getAllPlants(dbPlantGrids));
    },
    dispatchGetGardenFromDropdown(gardenIndex) {
      dispatch(getGardenFromDropdown(gardenIndex));
    },
    dispatchGetPlantsFromDropdown(gardenIndex) {
      dispatch(getPlantsFromDropdown(gardenIndex));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(GardenSquareGridView);
