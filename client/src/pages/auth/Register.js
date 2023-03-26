import * as React from 'react';
import { Typography, TextField, Paper, Box, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { REGISTER_SUCCESS } from '../../redux/types';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState('');
  const [profilePicUrl, setProfilePicUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // upload image to cloudinary
  const uploadImage = async (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'test_app');
    data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_NAME);
    setIsLoading(true);
    await axios
      .post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
        data
      )
      .then((res) => {
        setProfilePicUrl(res.data.secure_url);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  // handle form submit
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Please enter all the fields');
    }
    setIsLoading(true);
    const data = { name, email, password, profilePicUrl };
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    fetch('/user/register', requestOptions)
      .then((data) => {
        if (data) {
          setIsLoading(false);
          dispatch({ type: REGISTER_SUCCESS, payload: data });
          navigate('/login');
        } else {
          setIsLoading(false);
          toast.error(data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
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

        {/* register form */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 15,
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
              <div className='font-bold text-gray-600 text-3xl'>Register</div>
            </Typography>

            <Box component='form' onSubmit={handleFormSubmit} sx={{ mt: 1 }}>
              <TextField
                margin='normal'
                fullWidth
                id='name'
                label='Name'
                name='name'
                autoComplete='name'
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />

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

              <TextField
                margin='normal'
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              {/* image picker */}
              <div className='flex items-center gap-2 my-5'>
                <input
                  type='file'
                  accept='image/*'
                  name='profilePic'
                  onChange={uploadImage}
                />
              </div>

              <div className='mb-3 mt-6'>
                <button className='custom-button'>
                  {isLoading ? (
                    <div className='flex items-center justify-center '>
                      <div className='w-6 h-6 border-b-2 border-gray-100 rounded-full animate-spin'></div>
                    </div>
                  ) : (
                    <span>Register</span>
                  )}
                </button>
              </div>

              <Grid container className='pt-2 cursor-pointer'>
                <Grid item>
                  <Link to='/login' variant='body2'>
                    {'Already have an account? Login'}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Register;
