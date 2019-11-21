import * as actionTypes from './actions';

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    firebaseAuthID: ''
  },
  userLoggedIn: false,
  todaysWeight: '',
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_LOGGED_IN:
      return {
        ...state,
        user: {
          ...state.user,
          firstName: action.firstName,
          lastname: action.lastName,
          email: action.email,
          password: action.password,
          firebaseAuthID: action.firebaseAuthID
        },
        userLoggedIn: true
      };
    case actionTypes.SET_USER_LOGGED_OUT:
      return {
        user: {
          firstName: '',
          lastName: '',
          email: '',
          todaysWeight: '',
          password: '',
          firebaseAuthID: ''
        },
        userLoggedIn: false,
        todaysWeight: '',
    };
    case actionTypes.SET_TODAYS_WEIGHT:
      return {
        ...state,
        user: {
          ...state.user
        },
        todaysWeight: action.todaysWeight
      };
    default:
      return state;
  }
};

export default reducer;
