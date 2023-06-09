import React, { useEffect } from 'react';
import { setAuthHeader } from '../../api/axiosInstance';
import { useSelector } from 'react-redux';
import RecentPosts from '../../components/home/RecentPosts';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { RECENT_POSTS, SEARCH_INPUT_SHOW } from '../../redux/types';

const Home = () => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth?.user?.token);

  // get recent posts
  const getRecentPosts = async () => {
    try {
      const response = await axios.get(
        'https://mern-stack-app-api-pc1h.onrender.com/post'
      );
      if (response) {
        dispatch({ type: RECENT_POSTS, payload: response?.data.posts });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch({ type: SEARCH_INPUT_SHOW, payload: true });
    setAuthHeader(token);
    getRecentPosts();
  }, [token]);

  return (
    <div>
      <section style={{ maxWidth: '550px' }}>
        <RecentPosts getRecentPosts={getRecentPosts} />
      </section>
    </div>
  );
};

export default Home;
