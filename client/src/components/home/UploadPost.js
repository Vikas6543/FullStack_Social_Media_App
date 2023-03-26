import { Typography } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { RECENT_POSTS } from '../../redux/types';

const UploadPost = ({ handleClose }) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'test_app');
    data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_NAME);
    setIsLoading(true);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
      {
        method: 'POST',
        body: data,
      }
    );
    const res = await response.json();
    setImageUrl(res.secure_url);
    setIsLoading(false);
  };

  const uploadHandler = async () => {
    try {
      const response = await axios.post(
        'https://mern-stack-app-api-pc1h.onrender.com/post',
        {
          imageUrl,
        }
      );
      if (response) {
        handleClose();
        try {
          const response = await axios.get(
            'https://mern-stack-app-api-pc1h.onrender.com/post'
          );
          if (response) {
            dispatch({ type: RECENT_POSTS, payload: response?.data.posts });
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Typography variant='h5' className='pb-6 text-center'>
        Upload New Post
      </Typography>

      {/* upload form */}
      <form>
        <div className='mb-4'>
          <input
            type='file'
            id='image'
            name='image'
            onChange={handleImageChange}
            className='block w-full border-gray-300 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2'
          />
        </div>
        {selectedImage && (
          <div className='mt-4'>
            <img
              src={selectedImage}
              alt='Selected image'
              className='w-full'
              style={{ height: '450px' }}
            />
          </div>
        )}
      </form>
      {/* upload button */}
      <section className='mt-3'>
        <button className='custom-button' onClick={uploadHandler}>
          {isLoading ? (
            <div className='flex items-center justify-center '>
              <div className='w-6 h-6 border-b-2 border-gray-100 rounded-full animate-spin'></div>
            </div>
          ) : (
            <span>Upload</span>
          )}
        </button>
      </section>
    </>
  );
};

export default UploadPost;
