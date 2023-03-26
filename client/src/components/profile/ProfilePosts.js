import React from 'react';

const friendsList = [
  {
    name: 'Nisha Patil',
    mutualFriends: 12,
    profilePic:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGNoaWxkfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Pallavi Patil',
    mutualFriends: 4,
    profilePic:
      'https://images.unsplash.com/photo-1484399172022-72a90b12e3c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGdpcmx8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Shravan Kumar',
    mutualFriends: 2,
    profilePic:
      'https://images.unsplash.com/photo-1481608726045-7407244fb7b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fHN1aXR8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Virat Kohli',
    mutualFriends: 6,
    profilePic:
      'https://images.news18.com/ibnlive/uploads/2023/02/virat-kohli-instagram-16772115023x2.jpg?impolicy=website&width=510&height=356',
  },
];

const ProfilePosts = ({ profileDetails }) => {
  return (
    <>
      <div className='grid grid-cols-3 gap-8'>
        {friendsList?.map((post, index) => (
          <div key={index} className='hover:shadow-lg cursor-pointer'>
            <img
              src={post.profilePic}
              alt='post'
              className='w-full h-40 object-cover rounded-lg'
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfilePosts;
