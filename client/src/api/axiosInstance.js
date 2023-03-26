import axios from 'axios';
import { store } from '../redux/store';
import { CLEAR_AUTH, CLEAR_PROFILE } from '../redux/types';

export const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// if response status is 400, 401 than it means that the token has expired and we need to redirect the user to the login page
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 404 || error.response.status === 401) {
      window.location.href = '/login';
      store.dispatch({ type: CLEAR_AUTH });
      store.dispatch({ type: CLEAR_PROFILE });
    }

    return Promise.reject(error);
  }
);
