import * as React from 'react';
import { Typography, TextField, Paper, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post('/user/forgotPassword', {
        email,
      });
      setIsLoading(false);
      toast.success(response.data.message);
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
                Forgot Password
              </div>
            </Typography>

            <Box
              component='form'
              onSubmit={handleFormSubmit}
              sx={{ mt: 1, position: 'relative' }}
              className='w-full px-6'
            >
              <TextField
                margin='normal'
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <div className='py-3 pl-1'>
                <Link to='/login' variant='body2'>
                  {'Back to Login'}
                </Link>
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

export default ForgotPassword;
