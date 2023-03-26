import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { LOGGED_IN_USER_PROFILE_DETAILS } from '../redux/types';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  const [profileDetails, setProfileDetails] = useState({});

  const dispatch = useDispatch();

  // get profile details
  const getProfileDetails = async () => {
    try {
      const response = await axios.get('/user/profile');
      setProfileDetails(response?.data.user);
      dispatch({
        type: LOGGED_IN_USER_PROFILE_DETAILS,
        payload: response?.data.user,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfileDetails();
  }, []);

  return (
    <main>
      <div className='flex flex-row h-screen overflow-hidden relative'>
        {/* sidebar */}
        <div className='shadow-lg w-3/12 fixed h-screen bg-white mt-20 hidden lg:block'>
          <Sidebar />
        </div>

        <div
          className='flex-1 overflow-y-scroll h-screen w-8/12'
          style={{ backgroundColor: '#f7f5f5' }}
        >
          {/* top bar */}
          <div
            className='bg-white fixed top-0 w-full shadow-lg'
            style={{ height: '5.4rem' }}
          >
            <Header profileDetails={profileDetails} />
          </div>

          {/* main content */}
          <div className='mt-32 outlet'>
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Layout;
