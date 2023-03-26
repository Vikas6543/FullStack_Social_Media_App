import * as React from 'react';
import { Typography, TextField, Paper, Box, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [NewPassword, setNewPassword] = React.useState('');
  const [NewConfirmPassword, setConfirmNewPassword] = React.useState(false);
  const [isNewPasswordShown, setIsNewPasswordShown] = React.useState(false);
  const [isConfirmNewPasswordShown, setIsConfirmNewPasswordShown] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [id, setId] = React.useState('');

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const id = searchParams.get('id');
    setToken(token);
    setId(id);
  }, [location]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check for empty fields
    if (!NewPassword || !NewConfirmPassword) {
      toast.error('please enter all the fields');
      return;
    }

    // check if password and confirm password are same
    if (NewPassword !== NewConfirmPassword) {
      toast.error('password & confirm password must be same');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('/user/resetPassword', {
        resetPassword: NewPassword,
        token,
        id,
      });
      setIsLoading(false);
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Grid container component='main' sx={{ height: '100vh' }}>
        {/* random image */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              'url(https://source.unsplash.com/random/?nature,water,mountains)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* login form */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 22,
            }}
          >
            <Typography
              component='h1'
              variant='h5'
              className='flex items-center gap-3 pb-2'
            >
              {/* font awesome icon login */}
              <div>
                <i className='fas fa-user-circle text-3xl'></i>
              </div>
              <div className='font-bold text-gray-600 text-3xl'>
                Reset Password
              </div>
            </Typography>

            <Box
              component='form'
              onSubmit={handleFormSubmit}
              sx={{ mt: 1, position: 'relative' }}
              className='w-full px-6'
            >
              {/* New Password */}
              <div>
                <TextField
                  margin='normal'
                  fullWidth
                  name='new-password'
                  label='New Password'
                  type={isNewPasswordShown ? 'text' : 'password'}
                  id='password'
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 34,
                    right: 50,
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
              </div>

              {/* Confirm New Password */}
              <div>
                <TextField
                  margin='normal'
                  fullWidth
                  name='confirm-new-password'
                  label='Confirm New Password'
                  type={isConfirmNewPasswordShown ? 'text' : 'password'}
                  id='confirm-new-password'
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 115,
                    right: 50,
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
              </div>

              <div className='my-3'>
                <button className='custom-button'>
                  {isLoading ? (
                    <div className='flex items-center justify-center '>
                      <div className='w-6 h-6 border-b-2 border-gray-100 rounded-full animate-spin'></div>
                    </div>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResetPassword;
