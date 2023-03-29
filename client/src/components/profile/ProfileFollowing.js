import React from 'react';

const ProfileFollowing = ({
  followingList,
  unFollowHandler,
  isFollowersLoading,
}) => {
  return (
    <div>
      {followingList?.length > 0 ? (
        <>
          {followingList?.map((follower) => (
            <div
              key={follower._id}
              className='flex items-center justify-center mb-6 mx-auto shadow-md p-4 rounded-md lg:w-4/6'
            >
              <img
                className='lg:h-10 lg:w-10 h-10 w-10 cursor-pointer rounded-full object-cover mr-4'
                src={follower?.profilePicUrl}
                alt='profile'
              />
              <p
                className='lg:text-lg cursor-pointer'
                style={{ fontWeight: '500' }}
              >
                {follower?.name}
              </p>
              <button
                style={{ fontWeight: '500' }}
                className={
                  isFollowersLoading
                    ? 'g:ml-24 ml-14 text-sm border bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-400'
                    : 'g:ml-24 ml-14 text-sm border bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-500'
                }
                onClick={() => unFollowHandler(follower._id)}
              >
                Unfollow
              </button>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className='flex items-center justify-center mb-6 mx-auto p-4 rounded-md lg:w-4/6'>
            <p
              className='lg:text-lg cursor-pointer'
              style={{ fontWeight: '500' }}
            >
              you are not following anyone
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileFollowing;
