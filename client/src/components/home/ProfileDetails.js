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
  const profileDetails = useSelector((state) => state.post.userProfileDetails);

  // get user profile by id
  const getUserProfileById = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/user/profile/${id}`);
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
      const response = await axios.get(`/user/profile/${id}`);
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
      const response = await axios.get('/user/profile');
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
      const response = await axios.put(`/user/follow/${id}`);
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
    <div className='w-8/12 -mt-4'>
      {isLoading ? (
        <div>
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

          <div className='flex items-center justify-between pt-6'>
            {/* profile image */}
            <section>
              <img
                src={profileDetails?.profilePicUrl}
                alt='profile'
                className='w-36 h-36 rounded-full'
              />
            </section>

            {/* profile title */}
            <section className='pl-24 relative'>
              <p className='text-4xl font-bold'>{profileDetails?.name}</p>

              {/* admin */}
              {profileDetails?.role === 'admin' && (
                <Tooltip title='Admin'>
                  <p
                    className='text-md bg-green-500 ml-2 text-white rounded-lg text-sm py-2 px-4 mt-5 float-left flex items-center justify-center cursor-pointer'
                    style={{ fontWeight: '500' }}
                  >
                    <i className='fas fa-user-shield text-lg'></i>
                  </p>
                </Tooltip>
              )}

              {/* follow, unFollow & message */}
              <div className='mt-4'>
                {profileDetails?.followers?.includes(loggedInUserId) ? (
                  <>
                    <button
                      className={
                        followLoading
                          ? 'bg-blue-300 text-white rounded-lg text-sm py-2 px-2 mx-3'
                          : 'bg-blue-500 text-white rounded-lg text-sm py-2 px-3 mx-3'
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
                          ? 'bg-blue-300 text-white rounded-lg text-sm py-2 px-3 mx-3'
                          : 'bg-blue-500 text-white rounded-lg text-sm py-2 px-3 mx-3'
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
