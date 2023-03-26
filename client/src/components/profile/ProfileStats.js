import React from 'react';

const ProfileStats = ({ profileDetails }) => {
  return (
    <div className='flex mt-8 border-t border-b py-3 justify-between px-12'>
      <section>
        <p className='text-lg font-bold'>Posts</p>
        <p
          className='text-center font-medium text-gray-600 pt-1 text-lg'
          style={{ fontWeight: '500' }}
        >
          {profileDetails?.post?.length}
        </p>
      </section>
      <section>
        <p className='text-lg font-bold'>Following</p>
        <p
          className='text-center font-medium text-gray-600 pt-1 text-lg'
          style={{ fontWeight: '500' }}
        >
          {profileDetails?.following?.length}
        </p>
      </section>
      <section>
        <p className='text-lg font-bold'>Followers</p>
        <p
          className='text-center font-medium text-gray-600 pt-1 text-lg'
          style={{ fontWeight: '500' }}
        >
          {profileDetails?.followers?.length}
        </p>
      </section>
    </div>
  );
};

export default ProfileStats;
