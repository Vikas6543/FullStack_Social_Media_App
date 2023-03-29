import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthHeader } from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { LOGGED_IN_USER_PROFILE_DETAILS } from '../../redux/types';

const ProfileSettings = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.auth?.user?.token);
  const dispatch = useDispatch();

  // get profile details
  const getProfileDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        'https://mern-stack-app-api-pc1h.onrender.com/user/profile'
      );
      setIsLoading(false);
      if (response?.data?.user?.name) {
        setName(response.data.user.name);
      }
      if (response?.data?.user?.email) {
        setEmail(response.data.user.email);
      }
      // if (response?.data?.user?.profilePicUrl) {
      //   setProfilePicUrl(response.data.user.profilePicUrl);
      // }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // update profile details
  const updateProfile = async (e) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        'https://mern-stack-app-api-pc1h.onrender.com/user/profileUpdate',
        {
          name,
          email,
        }
      );
      setIsLoading(false);
      toast.success('Profile updated successfully');
      if (response?.data?.user?.name) {
        setName(response.data.user.name);
      }
      if (response?.data?.user?.email) {
        setEmail(response.data.user.email);
      }
      dispatch({
        type: LOGGED_IN_USER_PROFILE_DETAILS,
        payload: response?.data.user,
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // update profile handler
  const updateProfileHandler = () => {
    updateProfile();
  };

  // update profile pic handler
  const updateProfilePicHandler = () => {};

  useEffect(() => {
    setAuthHeader(token);
    getProfileDetails();
  }, [token]);

  return (
    <div className='mx-auto'>
      <div className='mb-4'>
        <p variant='h5' className='lg:pl-44 pl-16 py-2 text-md lg:text-2xl'>
          <i className='fa fa-user lg:text-2xl pr-4'></i>
          Update Your Profile
        </p>
      </div>

      <main className='flex'>
        {/* profile picture */}
        {/* <section className='profileUpdate'>
            <div className='w-32 h-32 relative'>
              <img
                src={profilePicUrl}
                alt='profile'
                className='w-32 h-32 rounded-full'
              />
            </div>

            <div className='mt-4 text-center'>
              <button
                onClick={updateProfilePicHandler}
                className='border-4 rounded-lg py-2 px-8'
              >
                Update
              </button>
            </div>
          </section> */}

        {/* name and email */}
        <section className='-mt-2 lg:ml-24'>
          <input
            type='text'
            value={name || ''}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className='border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent mb-4'
          />

          <input
            type='text'
            value={email || ''}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className='border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent '
          />

          <div className='mb-3 mt-6'>
            <button
              style={{ padding: '14px 0' }}
              className='custom-button'
              onClick={updateProfileHandler}
            >
              {isLoading ? (
                <div className='flex items-center justify-center '>
                  <div className='w-7 h-7 border-b-2 border-gray-100 rounded-full animate-spin'></div>
                </div>
              ) : (
                <span>Update</span>
              )}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfileSettings;
