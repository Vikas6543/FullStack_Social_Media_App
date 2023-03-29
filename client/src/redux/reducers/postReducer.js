import {
  CLEAR_PROFILE,
  GET_USER_PROFILE_DETAILS,
  PROFILE_POSTS,
  RECENT_POSTS,
  SEARCH_INPUT_SHOW,
} from '../types';

const initialState = {
  recentPosts: [],
  userProfileDetails: {},
  isSearchInputShow: true,
  profilePosts: {},
};

export const postReducers = (state = initialState, action) => {
  switch (action.type) {
    case RECENT_POSTS:
      return { ...state, recentPosts: action.payload };

    case GET_USER_PROFILE_DETAILS:
      return { ...state, userProfileDetails: action.payload };

    case CLEAR_PROFILE:
      return { ...state, userProfileDetails: {}, recentPosts: [] };

    case SEARCH_INPUT_SHOW:
      return { ...state, isSearchInputShow: action.payload };

    case PROFILE_POSTS:
      return { ...state, profilePosts: action.payload };

    default:
      return state;
  }
};
