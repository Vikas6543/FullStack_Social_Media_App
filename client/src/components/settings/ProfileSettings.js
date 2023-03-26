import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setAuthHeader } from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const ProfileSettings = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.auth?.user?.token);

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
      if (response?.data?.user?.profilePicUrl) {
        setProfilePicUrl(response.data.user.profilePicUrl);
      }
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
    <div>
      <div className='mb-4'>
        <Typography variant='h5' className='text-center py-2'>
          <i className='fa fa-user text-2xl pr-4'></i>
          Update Your Profile
        </Typography>
      </div>

      {isLoading ? (
        <div class='animate-pulse space-y-4 mt-4'>
          <div class='bg-gray-200 h-6 rounded w-1/2'></div>
          <div class='bg-gray-200 h-6 rounded w-full'></div>
          <div class='bg-gray-200 h-10 mt-6 rounded w-full flex justify-center items-center'>
            <div class='w-6 h-6 border-b-2 border-gray-100 rounded-full animate-spin'></div>
          </div>
        </div>
      ) : (
        <main className='flex'>
          {/* profile picture */}
          <section className='profileUpdate'>
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
          </section>

          {/* name and email */}
          <section className='flex flex-col w-7/12 -mt-2 m-auto'>
            <TextField
              value={name || ''}
              margin='normal'
              fullWidth
              id='name'
              autoComplete='name'
              onChange={(e) => {
                setName(e.target.value);
              }}
            />

            <TextField
              value={email || ''}
              margin='normal'
              fullWidth
              id='email'
              name='email'
              autoComplete='email'
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <div className='mb-3 mt-6'>
              <button className='custom-button' onClick={updateProfileHandler}>
                {isLoading ? (
                  <div className='flex items-center justify-center '>
                    <div className='w-6 h-6 border-b-2 border-gray-100 rounded-full animate-spin'></div>
                  </div>
                ) : (
                  <span>Update</span>
                )}
              </button>
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default ProfileSettings;
