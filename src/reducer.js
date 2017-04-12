const initialState = {
  //garden state
  searchTerm: '',
  todos: [],
  location: [0, 2],
  isDragging: false,

  gardenGrid: [
      {
        'x':0,
        'y':0,
        'color': 'brown'
      }
  ],
  plantGrid: [
      {
        'x':20,
        'y':20,
        'color': 'blue'
      }
  ],

  plantShelf: [
    {
      'x':230,
      'y':300,
      'color': 'yellow'
    },
    {
      'x':230,
      'y':360,
      'color': 'black'
    },
    {
      'x':230,
      'y':420,
      'color': 'green'
    },
    {
      'x':230,
      'y':480,
      'color': 'green'
    }
  ],
  //user profile state
  username: '',
  gardens: [],
  plants: [],

  gardenDropdown: [],
  gardenIndex: 0,
  isFetching: false,
  isAuthenticated: localStorage.getItem('id_token') ? true : false

};

const toggleSquare = (state, action) => {
  var squareToToggle;
  var squareToToggleIndex;

  for (var i = 0; i<state.gardenGrid.length; i++){
    var individualSquare = state.gardenGrid[i];
    if (individualSquare.x === action.x && individualSquare.y === action.y) {
      squareToToggle = individualSquare;
      squareToToggleIndex = i;
    }
  }

  var squareToToggleColor = squareToToggle.color;
  var colorToToggleTo = "green";
  if (squareToToggleColor === "green") {
    colorToToggleTo = "brown";
  }

  var gardenCopy = state.gardenGrid.slice();
  gardenCopy[squareToToggleIndex].color = colorToToggleTo;

  const {gardenGrid} = state;
  const newState = {};

  Object.assign(newState, state, {gardenGrid: gardenCopy})

  console.log('(before) state: ', state);
  console.log('(after) state: ', newState);
  return newState;
}

const setGardenParameters = (state, action) => {
  const newState = {};

  const {gardenGrid} = state;
  var idCounter = 0;

  var gardenGridArray = [];
  for (var i = 1; i < action.height + 1; i++ ) {
    for (var j =1; j < action.width + 1; j++) {
      var squareCounter = "square" + idCounter;
      gardenGridArray.push({'x': i * 50, 'y': j * 50, 'color': action.color});
      idCounter++;
    }
  }
  Object.assign(newState, state, {gardenGrid: gardenGridArray});
  console.log('(before) state: ', state);
  console.log('(after) state: ', newState);
  return newState;
}


const setGarden = (state, action) => {

  const newState = {};
  const {gardenGrid} = state;

  Object.assign(newState, state, {gardenGrid: action.dbGardenGrid});
  console.log('(before) state: ', state);
  console.log('(after) state: ', newState);

  return newState;
}


const getAllGardens = (state, action) => {
  console.log('(before) state: ', state);

  const newState = {};
  const {gardens} = state;

  Object.assign(newState, state, {gardens: action.dbGardenGrids});
  console.log('(before) state: ', state);
  console.log('(after) state: ', newState);
  return newState;
}

const getAllPlants = (state, action) => {
  const newState = {};
  const {plants} = state;

  Object.assign(newState, state, {plants: action.dbPlantGrids});
  console.log('(before) state: ', state);
  console.log('(after) state: ', newState);

  return newState;
}


const getGardenFromDropdown = (state, action) => {
  console.log('(before) state: ', state);
  const newState = {};
  const { gardens } = state

  var newGardenGrid = gardens[action.gardenIndex];
  const {gardenGrid} = state;

  Object.assign(newState, state, {gardenGrid: newGardenGrid});
  console.log('(before) state: ', state);
  console.log('(after) state: ', newState);

  return newState;
};


const getPlantsFromDropdown = (state, action) => {
  console.log('(before) state: ', state);
  const newState = {};
  const { plants } = state

  var newPlantGrid = plants[action.gardenIndex]; //NOTE: THIS STAYS THE SAME "GRADEN.INDEX(?)
  const {plantGrid} = state;

  Object.assign(newState, state, {plantGrid: newPlantGrid});
  console.log('(before) state: ', state);
  console.log('(after) state: ', newState);

  return newState;
};


const setDropdown = (state, action) => {

  const newState = {};
  const {gardenDropdown} = state;

  var newGardenDropdown = action.dbDropdownOptions
  Object.assign(newState, state, {gardenDropdown: newGardenDropdown});

  console.log('(before) state: ', state);
  console.log('(after) state: ', newState);

  return newState;
}

const userProfile = (state, action) => {
  console.log('(before) state: ', state);
  const newState = {};
  const {username, gardens} = state;
  Object.assign(newState, state, {username: action.username, gardens: action.gardens});
  console.log('(before) state: ', state);
  console.log('(after) state: ', newState);

  return newState
}

const addPlantToPlantGrid = (state, action) => {

  const newState = {};
  const {plantGrid} = state;

  var newPlantGrid = plantGrid.slice();
  newPlantGrid.push(action.plant);

  Object.assign(newState, state, {plantGrid: newPlantGrid});
  console.log('(before) state: ', state);
  console.log('(after) state: ', newState);

  return newState
}

function reducer(state = initialState, action) {
  console.log('reducer.js - Reducer called');
  console.log('current action: ', action);
  switch (action.type) {
  case 'TOGGLE_SQUARE':
    return toggleSquare(state, action);
  case 'SET_GARDEN_PARAMETERS':
    return setGardenParameters(state, action);
  case 'SET_GARDEN':
    return setGarden(state, action);
  case 'SET_DROPDOWN_OPTIONS':
    return setDropdown(state, action);
  case 'GET_ALL_GARDENS':
    return getAllGardens(state, action);
  case 'GET_GARDEN_FROM_DROPDOWN':
    return getGardenFromDropdown(state, action);
  case 'GET_PLANTS_FROM_DROPDOWN':
    return getPlantsFromDropdown(state, action);
  case 'GET_ALL_PLANTS':
    return getAllPlants(state, action);
  case 'ADD_PLANT_TO_PLANT_GRID':
    return addPlantToPlantGrid(state, action);
  case 'SET_USER_PARAMETERS':
    return userProfile(state, action);
  case 'LOGIN_REQUEST':
    return Object.assign({}, state, {
      isFetching: true,
      isAuthenticated: false,
      user: action.creds
    });
  case 'LOGIN_SUCCESS':
    return Object.assign({}, state, {
      isFetching: false,
      isAuthenticated: true,
      errorMessage: ''
    });
  case 'LOGIN_FAILURE':
    return Object.assign({}, state, {
      isFetching: false,
      isAuthenticated: false,
      errorMessage: action.message
    });
  case 'LOGOUT_SUCCESS':
    return Object.assign({}, state, {
      isFetching: true,
      isAuthenticated: false
    });
  default:
    return state;
  }
}

export default reducer;