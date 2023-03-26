import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Backdrop, Box, Fade, Modal, Tooltip } from '@mui/material';
import UploadPost from './home/UploadPost';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_AUTH, RECENT_POSTS } from '../redux/types';
import axios from 'axios';
import { setAuthHeader } from '../api/axiosInstance';
import { store } from '../redux/store';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 480,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Header = ({ profileDetails }) => {
  const [searchInput, setSearchInput] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();
  const recentPosts = useSelector((state) => state.post?.recentPosts);
  const token = useSelector((state) => state.auth?.user?.token);
  const loggedInUserDetails = useSelector(
    (state) => state.auth.loggedInUserDetails
  );

  // get recent posts
  const getRecentPosts = async () => {
    try {
      const response = await axios.get('/post');
      if (response) {
        return dispatch({ type: RECENT_POSTS, payload: response?.data.posts });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // search handler
  const searchInputHandler = (e) => {
    e.preventDefault();
    if (searchInput.length > 1) {
      const filteredPosts = recentPosts.find((post) => {
        return post.postOwner.name
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });

      // if the filteredPosts is only one then return in the array
      if (filteredPosts) {
        dispatch({ type: RECENT_POSTS, payload: [filteredPosts] });
      } else {
        getRecentPosts();
      }
    }
  };

  // menu handler
  const menuHandler = (e) => {
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
  };

  // logout handler
  const logoutHandler = () => {
    setIsMenuOpen(false);
    store.dispatch({ type: CLEAR_AUTH });
    window.location.reload();
  };

  useEffect(() => {
    if (token) {
      setAuthHeader(token);
    }
    if (searchInput < 2) {
      getRecentPosts();
    }
  }, [token, searchInput]);

  return (
    <div className='flex justify-between items-center pt-5'>
      {/* brand name */}
      <p className='brand-font text-2xl lg:text-4xl lg:ml-28 ml-6 cursor-pointer text-black'>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <i className='fa fa-camera pr-3' aria-hidden='true'></i>
          <span>Vikspic</span>
        </Link>
      </p>

      {/* search input */}
      <div className='flex items-center hidden md:block'>
        <form className='flex items-center'>
          <div className='relative w-full'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <svg
                aria-hidden='true'
                className='w-5 h-5 text-gray-500 dark:text-gray-400'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                  clipRule='evenodd'
                ></path>
              </svg>
            </div>
            <input
              type='text'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:border-gray-500 block w-full pl-10 p-2.5 duration-500 hover:transition-all'
              placeholder='Search'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button
            type='submit'
            className='inline-flex items-center py-2.5 px-3 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            onClick={searchInputHandler}
          >
            <svg
              aria-hidden='true'
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              ></path>
            </svg>
          </button>
        </form>
      </div>

      {/* upload, message, notification, profile & menu drawer */}
      <div className='flex items-center lg:mr-16 mr-6'>
        {/* upload button */}
        <section>
          <button
            className='bg-color text-white px-4 py-2 rounded-lg cursor-pointer text-lg flex items-center hover:shadow-lg
         lg:mr-10 mr-6'
            onClick={handleOpen}
          >
            <i className='fas fa-cloud-upload-alt lg:text-2xl text-md lg:pr-3'></i>{' '}
            <span className='hidden lg:block'>Upload</span>
          </button>

          <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={open}>
              <Box sx={style}>
                <UploadPost handleClose={handleClose} />
              </Box>
            </Fade>
          </Modal>
        </section>

        {/* admin icon */}
        <section>
          {profileDetails?.role === 'admin' && (
            <Tooltip title='Admin' arrow>
              <i className='fas fa-user-shield lg:text-2xl text-xl mr-6 lg:mr-10 cursor-pointer'></i>
            </Tooltip>
          )}
        </section>

        {/* message icon */}
        <section className='relative hidden lg:block'>
          <Tooltip title='Notifications' arrow>
            <i className='fas fa-bell text-2xl cursor-pointer pt-1'></i>
          </Tooltip>
          <span
            className='absolute -top-2 left-3 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold'
            style={{ paddingTop: '1px' }}
          >
            5
          </span>
        </section>

        {/* menu drawer for mobile device */}
        <section className='lg:hidden'>
          {/* close button */}
          <div>
            <Tooltip title='Menu' arrow>
              <i
                className='fas fa-bars lg:text-2xl text-xl cursor-pointer'
                onClick={menuHandler}
              ></i>
            </Tooltip>
          </div>

          {/* menu drawer */}
          {isMenuOpen && (
            <div className='fixed inset-0 z-40 flex lg:hidden w-4/6'>
              <div className='fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity'></div>
              <div className='relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transition-all transform'>
                {/* close button */}
                <section className='absolute top-0 right-4 pt-3'>
                  <button>
                    <i
                      className='fas fa-times text-3xl cursor-pointer'
                      onClick={() => setIsMenuOpen(false)}
                    ></i>
                  </button>
                </section>

                <section>
                  <div className='border-b pb-6'>
                    {/* profile image */}
                    <img
                      src={loggedInUserDetails?.profilePicUrl}
                      alt='profile'
                      className='rounded-full w-20 h-20 cursor-pointer mx-auto mt-12'
                    />

                    {/* profile name */}
                    <p className='text-center pt-5 text-xl font-medium'>
                      {loggedInUserDetails?.name}
                    </p>

                    {/* post, following, followers */}
                    <div className='flex items-center justify-between mt-2 px-3'>
                      <div>
                        <p className='text-center pt-5 font-bold'>Posts</p>
                        <p className='text-center font-medium text-gray-600 pt-1'>
                          {loggedInUserDetails?.post?.length}
                        </p>
                      </div>

                      <div>
                        <p className='text-center pt-5 font-bold'>Following</p>
                        <p className='text-center font-medium text-gray-600 pt-1'>
                          {loggedInUserDetails?.following?.length}
                        </p>
                      </div>

                      <div>
                        <p className='text-center pt-5 font-bold'>Followers</p>
                        <p className='text-center font-medium text-gray-600 pt-1'>
                          {loggedInUserDetails?.followers?.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* menu links */}
                  <div className='overflow'>
                    <section
                      className='flex flex-col mt-8'
                      style={{ marginLeft: '33%' }}
                    >
                      {/* home */}
                      <NavLink
                        to='/'
                        className={(path) =>
                          path.isActive ? 'main-color' : 'text-gray-500'
                        }
                        style={{ textDecoration: 'none' }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className='fas fa-home text-xl'></i>
                        <span className='text-xl font-medium pl-4'>Home</span>
                      </NavLink>

                      {/* message */}
                      <NavLink
                        to='/chats'
                        className={(path) =>
                          path.isActive
                            ? 'main-color mt-8 relative'
                            : 'text-gray-500 mt-8 relative'
                        }
                        style={{ textDecoration: 'none' }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className='fas fa-envelope text-xl'></i>
                        <span className='text-xl font-medium pl-4'>Chats</span>
                      </NavLink>

                      {/* profile */}
                      <NavLink
                        to='/profile'
                        className={(path) =>
                          path.isActive
                            ? 'main-color my-8'
                            : 'text-gray-500 my-8'
                        }
                        style={{ textDecoration: 'none' }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className='fas fa-user text-xl'></i>
                        <span className='text-xl font-medium pl-4'>
                          Profile
                        </span>
                      </NavLink>

                      {/* settings */}
                      <NavLink
                        to='/settings'
                        className={(path) =>
                          path.isActive ? 'main-color' : 'text-gray-500'
                        }
                        style={{ textDecoration: 'none' }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className='fas fa-cog text-xl'></i>
                        <span className='text-xl font-medium pl-4'>
                          Settings
                        </span>
                      </NavLink>
                    </section>

                    {/* logout link */}
                    <section className='pt-7'>
                      <NavLink
                        to='/login'
                        onClick={logoutHandler}
                        className={(path) =>
                          path.isActive ? 'main-color' : 'text-gray-500'
                        }
                        style={{
                          textDecoration: 'none',
                          marginLeft: '33%',
                        }}
                      >
                        <i className='fas fa-sign-out-alt text-xl'></i>
                        <span className='text-xl font-medium pl-4'>Logout</span>
                      </NavLink>
                    </section>

                    {/* fotter */}
                    <section className='cursor-pointer fixed bottom-0 w-full'>
                      <p
                        className='text-center text-white bg-gray-800 py-5 tracking-wide'
                        style={{ fontSize: '15px' }}
                      >
                        Developed By <span>Vikas Shambhu</span>
                      </p>
                    </section>
                  </div>
                </section>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Header;
