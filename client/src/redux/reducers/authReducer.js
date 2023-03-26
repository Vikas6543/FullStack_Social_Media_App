import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_AUTH,
  LOGGED_IN_USER_PROFILE_DETAILS,
} from '../types';

const initialState = {
  user: null,
  loggedInUserDetails: null,
};

export const authReducers = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return { ...state, user: action.payload };

    case LOGOUT:
      return { ...state, user: null };

    case CLEAR_AUTH:
      return { ...state, user: null, loggedInUserDetails: null };

    case LOGGED_IN_USER_PROFILE_DETAILS:
      return { ...state, loggedInUserDetails: action.payload };

    default:
      return state;
  }
};
