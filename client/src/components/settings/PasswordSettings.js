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
      const response = await axios.put('/user/updatePassword', {
        oldPassword,
        newPassword,
        confirmNewPassword,
      });
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
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <div className='relative'>
      <section>
        <Typography variant='h5' className='text-center py-2'>
          <i className='fa fa-lock text-2xl pr-4'></i>
          Update Your Password
        </Typography>
      </section>

      {isLoading ? (
        <div class='animate-pulse space-y-4 mt-4'>
          <div class='bg-gray-200 h-6 rounded w-1/2'></div>
          <div class='bg-gray-200 h-6 rounded w-full'></div>
          <div class='bg-gray-200 h-6 rounded w-full'></div>
          <div class='bg-gray-200 h-10 mt-6 rounded w-full flex justify-center items-center'>
            <div class='w-6 h-6 border-b-2 border-gray-100 rounded-full animate-spin'></div>
          </div>
        </div>
      ) : (
        <main className='w-7/12 m-auto'>
          {/* old password */}
          <section>
            <TextField
              margin='normal'
              fullWidth
              name='old-password'
              label='Old Password'
              type={isOldPasswordShown ? 'text' : 'password'}
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
              value={oldPassword}
            />

            <div
              style={{
                position: 'absolute',
                top: 82,
                right: 165,
                cursor: 'pointer',
              }}
              onClick={() => setIsOldPasswordShown(!isOldPasswordShown)}
            >
              {isOldPasswordShown ? (
                <i className='fas fa-eye'></i>
              ) : (
                <i className='fas fa-eye-slash'></i>
              )}
            </div>
          </section>

          {/* new password */}
          <section>
            <TextField
              margin='normal'
              fullWidth
              name='new-password'
              label='New Password'
              type={isNewPasswordShown ? 'text' : 'password'}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              value={newPassword}
            />

            <div
              style={{
                position: 'absolute',
                top: 162,
                right: 165,
                cursor: 'pointer',
              }}
              onClick={() => setIsNewPasswordShown(!isNewPasswordShown)}
            >
              {isNewPasswordShown ? (
                <i className='fas fa-eye'></i>
              ) : (
                <i className='fas fa-eye-slash'></i>
              )}
            </div>
          </section>

          {/* confirm new password */}
          <section>
            <TextField
              margin='normal'
              fullWidth
              name='confirm-new-password'
              label='Confirm Password'
              type={isConfirmNewPasswordShown ? 'text' : 'password'}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
              }}
              value={confirmNewPassword}
            />

            <div
              style={{
                position: 'absolute',
                top: 242,
                right: 165,
                cursor: 'pointer',
              }}
              onClick={() =>
                setIsConfirmNewPasswordShown(!isConfirmNewPasswordShown)
              }
            >
              {isConfirmNewPasswordShown ? (
                <i className='fas fa-eye'></i>
              ) : (
                <i className='fas fa-eye-slash'></i>
              )}
            </div>
          </section>

          <div className='mb-3 mt-6'>
            <button className='custom-button' onClick={passwordUpdateHandler}>
              {isLoading ? (
                <div className='flex items-center justify-center '>
                  <div className='w-6 h-6 border-b-2 border-gray-100 rounded-full animate-spin'></div>
                </div>
              ) : (
                <span>Update</span>
              )}
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

export default PasswordSettings;
