import React from 'react';

const ProfileStats = ({
  profilePosts,
  myPosts,
  openPostsTab,
  openFollowersTab,
  openFollowingTab,
  postsTab,
  followersTab,
  followingTab,
}) => {
  return (
    <div className='flex mt-8 border-t border-b py-3 justify-between lg:px-12 px-4'>
      {/* Posts */}
      <section className='cursor-pointer' onClick={openPostsTab}>
        <p className={postsTab ? 'lg:text-lg font-bold' : 'lg:text-lg'}>
          Posts
        </p>
        <p
          className='text-center font-medium text-gray-600 pt-1 text-lg'
          style={{ fontWeight: '500' }}
        >
          {myPosts?.length}
        </p>
      </section>

      {/* Followers */}
      <section className='cursor-pointer' onClick={openFollowersTab}>
        <p className={followersTab ? 'lg:text-lg font-bold' : 'lg:text-lg'}>
          Followers
        </p>
        <p
          className='text-center font-medium text-gray-600 pt-1 text-lg'
          style={{ fontWeight: '500' }}
        >
          {profilePosts?.followers?.length}
        </p>
      </section>

      {/* Following */}
      <section className='cursor-pointer' onClick={openFollowingTab}>
        <p className={followingTab ? 'lg:text-lg font-bold' : 'lg:text-lg'}>
          Following
        </p>
        <p
          className='text-center font-medium text-gray-600 pt-1 text-lg'
          style={{ fontWeight: '500' }}
        >
          {profilePosts?.following?.length}
        </p>
      </section>
    </div>
  );
};

export default ProfileStats;
