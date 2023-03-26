import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { store } from '../redux/store';
import { CLEAR_AUTH } from '../redux/types';

const Sidebar = () => {
  const loggedInUserDetails = useSelector(
    (state) => state.auth.loggedInUserDetails
  );

  const logoutHandler = () => {
    store.dispatch({ type: CLEAR_AUTH });
    window.location.reload();
  };

  return (
    <div>
      {/* profile details */}
      <section className='border-b pb-8'>
        {/* profile image */}
        <img
          src={loggedInUserDetails?.profilePicUrl}
          alt='profile'
          className='rounded-full w-24 h-24 cursor-pointer mx-auto mt-12'
        />

        {/* profile name */}
        <p className='text-center pt-5 text-2xl font-medium'>
          {loggedInUserDetails?.name}
        </p>

        {/* post, following, followers */}
        <div className='flex items-center justify-between px-8 mt-3'>
          <div>
            <p className='text-center pt-5 text-lg font-bold'>Posts</p>
            <p className='text-center font-medium text-gray-600 pt-1 text-lg'>
              {loggedInUserDetails?.post?.length}
            </p>
          </div>

          <div>
            <p className='text-center pt-5 text-lg font-bold'>Following</p>
            <p className='text-center font-medium text-gray-600 pt-1 text-lg'>
              {loggedInUserDetails?.following?.length}
            </p>
          </div>

          <div>
            <p className='text-center pt-5 text-lg font-bold'>Followers</p>
            <p className='text-center font-medium text-gray-600 pt-1 text-lg'>
              {loggedInUserDetails?.followers?.length}
            </p>
          </div>
        </div>
      </section>

      {/* menu links */}
      <div className='overflow'>
        <section className='flex flex-col my-8' style={{ marginLeft: '33%' }}>
          {/* home */}
          <NavLink
            to='/'
            className={(path) =>
              path.isActive ? 'main-color' : 'text-gray-500'
            }
            style={{ textDecoration: 'none' }}
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
          >
            <i className='fas fa-envelope text-xl'></i>
            <span className='text-xl font-medium pl-4'>Chats</span>
          </NavLink>

          {/* profile */}
          <NavLink
            to='/profile'
            className={(path) =>
              path.isActive ? 'main-color my-8' : 'text-gray-500 my-8'
            }
            style={{ textDecoration: 'none' }}
          >
            <i className='fas fa-user text-xl'></i>
            <span className='text-xl font-medium pl-4'>Profile</span>
          </NavLink>

          {/* settings */}
          <NavLink
            to='/settings'
            className={(path) =>
              path.isActive ? 'main-color' : 'text-gray-500'
            }
            style={{ textDecoration: 'none' }}
          >
            <i className='fas fa-cog text-xl'></i>
            <span className='text-xl font-medium pl-4'>Settings</span>
          </NavLink>
        </section>

        {/* logout link */}
        <section className='border-t py-5'>
          <NavLink
            to='/login'
            onClick={logoutHandler}
            className={(path) =>
              path.isActive ? 'main-color' : 'text-gray-500'
            }
            style={{ textDecoration: 'none', marginLeft: '33%' }}
          >
            <i className='fas fa-sign-out-alt text-xl'></i>
            <span className='text-xl font-medium pl-4'>Logout</span>
          </NavLink>
        </section>
      </div>

      {/* fotter */}
      <section className='cursor-pointer fixed bottom-0 w-3/12'>
        <p
          className='text-center text-white bg-gray-800 py-6 tracking-wide'
          style={{ fontSize: '16.5px' }}
        >
          Developed By <span>Vikas Shambhu</span>
        </p>
      </section>
    </div>
  );
};

export default Sidebar;
