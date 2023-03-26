import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setAuthHeader } from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProfilePosts from '../../components/profile/ProfilePosts';
import ProfileStats from '../../components/profile/ProfileStats';

const Profile = () => {
  const [profileDetails, setProfileDetails] = useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const token = useSelector((state) => state.auth?.user?.token);

  // get profile details
  const getProfileDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        'https://mern-stack-app-api-pc1h.onrender.com/user/profile'
      );
      setIsLoading(false);
      setProfileDetails(response?.data.user);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setAuthHeader(token);
    getProfileDetails();
  }, []);

  return (
    <div className='w-8/12 -mt-5'>
      {isLoading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* header top */}
          <div className='flex items-center justify-between'>
            {/* profile image */}
            <section>
              <img
                src={profileDetails?.profilePicUrl}
                alt='profile'
                className='w-36 h-36 rounded-full'
              />
            </section>

            {/* profile title */}
            <section className='pl-24'>
              <p className='text-4xl font-bold'>{profileDetails?.name}</p>
              {profileDetails?.role === 'admin' && (
                <p
                  className='text-md bg-green-500 ml-2 text-white rounded-lg text-sm p-2 mt-4 float-left flex items-center justify-center cursor-pointer'
                  style={{ fontWeight: '500' }}
                >
                  <i className='fas fa-user-shield pr-2'></i>
                  Admin
                </p>
              )}
            </section>
          </div>

          {/* profile stats */}
          <ProfileStats profileDetails={profileDetails} />

          {/* profile posts */}
          <div className='mt-8'>
            <ProfilePosts profileDetails={profileDetails} />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
