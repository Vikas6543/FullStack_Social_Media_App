import {
  CLEAR_PROFILE,
  GET_USER_PROFILE_DETAILS,
  RECENT_POSTS,
} from '../types';

const initialState = {
  recentPosts: [],
  userProfileDetails: {},
};

export const postReducers = (state = initialState, action) => {
  switch (action.type) {
    case RECENT_POSTS:
      return { ...state, recentPosts: action.payload };

    case GET_USER_PROFILE_DETAILS:
      return { ...state, userProfileDetails: action.payload };

    case CLEAR_PROFILE:
      return { ...state, userProfileDetails: {}, recentPosts: [] };

    default:
      return state;
  }
};
