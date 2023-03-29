import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setAuthHeader } from '../../api/axiosInstance';

const PasswordSettings = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isOldPasswordShown, setIsOldPasswordShown] = useState(false);
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false);
  const [isConfirmNewPasswordShown, setIsConfirmNewPasswordShown] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.auth?.user?.token);

  const updatePassword = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        'https://mern-stack-app-api-pc1h.onrender.com/user/updatePassword',
        {
          oldPassword,
          newPassword,
          confirmNewPassword,
        }
      );
      setIsLoading(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      toast.success(response.data.message);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const passwordUpdateHandler = () => {
    updatePassword();
  };

  useEffect(() => {
    setAuthHeader(token);
  }, []);

  return (
    <div>
      <section className='mb-4'>
        <p variant='h5' className='lg:pl-44 pl-16 py-2 text-md lg:text-2xl'>
          <i className='fa fa-user lg:text-2xl pr-4'></i>
          Update Your Password
        </p>
      </section>

      <main className='lg:w-6/12 lg:ml-24'>
        {/* old password */}
        <section>
          <input
            placeholder='Old Password'
            type={isOldPasswordShown ? 'text' : 'password'}
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
            value={oldPassword}
            className='border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent mb-4'
          />
        </section>

        {/* new password */}
        <section>
          <input
            placeholder='New Password'
            type={isNewPasswordShown ? 'text' : 'password'}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            value={newPassword}
            className='border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent mb-4'
          />
        </section>

        {/* confirm new password */}
        <section>
          <input
            placeholder='Confirm New Password'
            type={isConfirmNewPasswordShown ? 'text' : 'password'}
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
            }}
            value={confirmNewPassword}
            className='border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent mb-4'
          />
        </section>

        <div className='mb-3 mt-6'>
          <button
            style={{ padding: '14px 0' }}
            className='custom-button'
            onClick={passwordUpdateHandler}
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
      </main>
    </div>
  );
};

export default PasswordSettings;
