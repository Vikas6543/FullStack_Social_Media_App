import { Tooltip } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { setAuthHeader } from '../../api/axiosInstance';
import LoadingSpinner from '../LoadingSpinner';
import ProfilePosts from '../profile/ProfilePosts';
import ProfileStats from '../profile/ProfileStats';
import {
  GET_USER_PROFILE_DETAILS,
  LOGGED_IN_USER_PROFILE_DETAILS,
  LOGIN_SUCCESS,
} from '../../redux/types';

const ProfileDetails = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [followLoading, setFollowLoading] = React.useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth?.user?.token);
  const loggedInUserId = useSelector((state) => state.auth?.user?.user._id);
  const profileDetails = useSelector((state) => state.post?.userProfileDetails);

  // get user profile by id
  const getUserProfileById = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://mern-stack-app-api-pc1h.onrender.com/user/profile/${id}`
      );
      if (response) {
        setIsLoading(false);
        dispatch({
          type: GET_USER_PROFILE_DETAILS,
          payload: response?.data.user,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // update the user's followers list after following
  const updateFollowersList = async (id) => {
    try {
      const response = await axios.get(
        `https://mern-stack-app-api-pc1h.onrender.com/user/profile/${id}`
      );
      if (response) {
        setIsLoading(false);
        dispatch({
          type: GET_USER_PROFILE_DETAILS,
          payload: response?.data.user,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // update the logged in user's details in the redux store
  const updateLoggedInUserDetails = async () => {
    try {
      const response = await axios.get(
        'https://mern-stack-app-api-pc1h.onrender.com/user/profile'
      );
      dispatch({
        type: LOGGED_IN_USER_PROFILE_DETAILS,
        payload: response?.data.user,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // follow a user
  const followHandler = (id) => async () => {
    try {
      setFollowLoading(true);
      const response = await axios.put(
        `https://mern-stack-app-api-pc1h.onrender.com/user/follow/${id}`
      );
      if (response) {
        setFollowLoading(false);
        updateFollowersList(id);
        updateLoggedInUserDetails();
      }
    } catch (error) {
      setFollowLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setAuthHeader(token);
    getUserProfileById();
  }, []);

  return (
    <div className='lg:w-8/12 -mt-4'>
      {isLoading ? (
        <div style={{ marginTop: '-30%', marginLeft: '-40%' }}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* go to home icon */}
          <div className='relative'>
            <Link to='/'>
              <Tooltip title='Back to home'>
                <i className='fas fa-arrow-left text-2xl cursor-pointer absolute -left-16 text-gray-600 hover:bg-gray-300 rounded-full p-2 hover:transition-all duration-200'></i>
              </Tooltip>
            </Link>
          </div>

          <div className='flex items-center lg:justify-between pt-6'>
            {/* profile image */}
            <section>
              <img
                src={profileDetails?.profilePicUrl}
                alt='profile'
                className='lg:w-36 lg:h-36 w-20 h-20 rounded-full'
              />
            </section>

            {/* profile title */}
            <section className='lg:pl-24 pl-8 lg:relative'>
              <p className='lg:text-4xl text-2xl font-bold'>
                {profileDetails?.name}
              </p>

              {/* admin */}
              {profileDetails?.role === 'admin' && (
                <Tooltip title='Admin'>
                  <p
                    className='text-md bg-green-500 ml-2 text-white rounded-lg text-sm py-2 px-4 mt-5 float-left flex items-center justify-center cursor-pointer hidden lg:block'
                    style={{ fontWeight: '500' }}
                  >
                    <i className='fas fa-user-shield text-lg'></i>
                  </p>
                </Tooltip>
              )}

              {/* follow, unFollow & message */}
              <div className='lg:mt-4 mt-2'>
                {profileDetails?.followers?.includes(loggedInUserId) ? (
                  <>
                    <button
                      className={
                        followLoading
                          ? 'bg-blue-300 text-white rounded-lg text-sm py-2 px-2 lg:mx-3 mx-1'
                          : 'bg-blue-500 text-white rounded-lg text-sm py-2 px-3 lg:mx-3 mx-1'
                      }
                      style={{ fontWeight: '500' }}
                      onClick={followHandler(profileDetails?._id)}
                    >
                      Unfollow
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={
                        followLoading
                          ? 'bg-blue-300 text-white rounded-lg text-sm py-2 px-3 lg:mx-3 mx-1'
                          : 'bg-blue-500 text-white rounded-lg text-sm py-2 px-3 lg:mx-3 mx-1'
                      }
                      style={{ fontWeight: '500' }}
                      onClick={followHandler(profileDetails?._id)}
                    >
                      Follow
                    </button>
                  </>
                )}

                <button
                  className='bg-white rounded-lg text-sm py-2 px-3 border border-gray-300'
                  style={{ fontWeight: '500' }}
                >
                  Message
                </button>
              </div>
            </section>
          </div>

          {/* profile stats */}
          <ProfileStats profileDetails={profileDetails} />

          {/* profile posts */}
          <div className='mt-8'>
            <ProfilePosts profileDetails={profileDetails} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDetails;
