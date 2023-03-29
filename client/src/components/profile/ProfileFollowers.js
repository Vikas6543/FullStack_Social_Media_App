import React from 'react';

const ProfileFollowers = ({ followersList, removeFollower }) => {
  return (
    <div>
      {followersList?.length > 0 ? (
        <>
          {followersList?.map((follower) => (
            <div
              key={follower._id}
              className='flex items-center justify-center mb-6 mx-auto shadow-md p-4 rounded-md lg:w-4/6'
            >
              <img
                className='lg:h-10 lg:w-10 h-8 w-8 cursor-pointer rounded-full object-cover mr-4'
                src={follower?.profilePicUrl}
                alt='profile'
              />
              <p className='pointer lg:text-lg' style={{ fontWeight: '500' }}>
                {follower?.name}
              </p>
              <button
                style={{ fontWeight: '500' }}
                className='lg:ml-24 ml-14 text-sm border bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600'
                onClick={() => removeFollower(follower._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </>
      ) : (
        <div className='flex items-center justify-center mb-6 mx-auto p-4 rounded-md lg:w-4/6'>
          <p
            className='lg:text-lg cursor-pointer'
            style={{ fontWeight: '500' }}
          >
            you have no followers
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileFollowers;
