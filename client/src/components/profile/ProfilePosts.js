import React from 'react';

const ProfilePosts = ({ myPosts }) => {
  return (
    <>
      <div className='grid grid-cols-12 gap-8 mb-5'>
        {myPosts?.map((post, index) => (
          <div
            key={index}
            className='col-span-6 md:col-span-4 mr-3 cursor-pointer profile-post-image-container'
          >
            <img
              src={post.imageUrl}
              alt='post'
              className='profile-post-image'
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfilePosts;
