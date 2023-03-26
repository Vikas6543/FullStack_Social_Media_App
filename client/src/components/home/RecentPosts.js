import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Box, Modal, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { RECENT_POSTS } from '../../redux/types';
import CommentsList from './CommentsList';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const commentsModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'rgb(255, 255, 255)',
  border: 'none',
  boxShadow: 24,
  paddingTop: '1.8rem',
  paddingBottom: '0',
  paddingLeft: '1.8rem',
  maxHeight: '55vh',
  overflowY: 'auto',
  overflowX: 'hidden',

  '@media (max-width: 700px)': {
    width: '94%',
    paddingTop: '1rem',
    paddingLeft: '1rem',
  },
};

const deleteModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'rgb(255, 255, 255)',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

const RecentPosts = ({ getRecentPosts }) => {
  const [open, setOpen] = React.useState(false);
  const [commentModal, setCommentModal] = React.useState(false);
  const [commentPostId, setCommentPostId] = React.useState('');
  const [deletePostId, setDeletePostId] = React.useState('');
  const [likeAnimate, setLikeAnimate] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedInUserId = useSelector((state) => state.auth.user.user._id);

  const recentPosts = useSelector((state) => state.post.recentPosts);

  // like & unlike a post
  const likeUnlikePostHandler = async (id) => {
    const postIndex = recentPosts.findIndex((post) => post._id === id);
    const post = recentPosts[postIndex];
    const likedByUser = post.likes.includes(loggedInUserId);

    // Update the post's like count optimistically
    const newPost = {
      ...post,
      likes: likedByUser
        ? post.likes.filter((id) => id !== loggedInUserId)
        : [...post.likes, loggedInUserId],
    };
    setLikeAnimate(true);
    setTimeout(() => {
      setLikeAnimate(false);
    }, 800);
    const newRecentPosts = [...recentPosts];
    newRecentPosts[postIndex] = newPost;
    dispatch({ type: RECENT_POSTS, payload: newRecentPosts });

    try {
      const response = await axios.put(`/post/like/${id}`);
      if (!response) {
        throw new Error('Failed to update like count');
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: RECENT_POSTS, payload: recentPosts });
    }
  };

  const deletePostHandler = async () => {
    try {
      const response = await axios.delete(`/post/${deletePostId}`);
      if (response) {
        getRecentPosts();
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // delete a post
  const openDeleteModalHandler = (id) => {
    setOpen(true);
    setDeletePostId(id);
  };

  // comment on a post
  const commentHandler = async (id) => {
    setCommentModal(true);
    setCommentPostId(id);
  };

  // get user profile by id
  const goToProfileDetailPage = (id) => {
    if (id === loggedInUserId) {
      return navigate('/profile');
    } else {
      navigate(`/profile/${id}`);
    }
  };

  return (
    <>
      {recentPosts?.length > 0 ? (
        recentPosts.map((post) => (
          <div className='md:mb-16 mb-10 shadow-lg' key={post._id}>
            {/* post header */}
            <section className='flex justify-between items-center md:px-5 px-3 py-4 bg-white'>
              {/* thumnail image & profile name */}
              <div
                className='flex items-center'
                onClick={() => goToProfileDetailPage(post.postOwner._id)}
              >
                <img
                  src={post.postOwner?.profilePicUrl}
                  alt='profile'
                  className='md:w-12 md:h-12 h-8 w-8 rounded-full cursor-pointer mr-2 md:mr-4'
                />
                <p
                  className='md:text-2xl text-lg cursor-pointer'
                  style={{ fontWeight: '500' }}
                >
                  {post.postOwner?.name}
                </p>
              </div>

              {/* delete post */}
              <div>
                {post.postOwner?._id === loggedInUserId ? (
                  <i
                    className='far fa-trash-alt md:text-2xl text-md cursor-pointer hover:text-red-500'
                    onClick={() => openDeleteModalHandler(post._id)}
                  ></i>
                ) : (
                  <i className='fas fa-ellipsis-h md:text-2xl text-md cursor-pointer'></i>
                )}
                <Modal
                  open={open}
                  onClose={() => setOpen(false)}
                  aria-labelledby='modal-modal-title'
                  aria-describedby='modal-modal-description'
                >
                  <Box sx={deleteModalStyle}>
                    <Typography
                      id='modal-modal-description'
                      sx={{ mt: 1, mb: 3 }}
                    >
                      <span className='text-lg'>
                        Are you sure you want to delete this post?
                      </span>
                    </Typography>
                    <section className='float-right'>
                      <button
                        className='bg-red-500 text-white px-4 py-2 rounded-lg'
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className='bg-green-500 text-white px-4 py-2 rounded-lg ml-4'
                        onClick={() => deletePostHandler(post._id)}
                      >
                        Delete
                      </button>
                    </section>
                  </Box>
                </Modal>
              </div>
            </section>

            {/* post image */}
            <section onDoubleClick={() => likeUnlikePostHandler(post._id)}>
              <img src={post.imageUrl} alt='post' className='postImage' />
            </section>

            {/* post footer */}
            <div>
              {/* like, comments & share */}
              <section className='flex justify-between md:px-6 px-3 py-4 bg-white'>
                <div className='flex'>
                  {/* like & unlike */}
                  <div className='flex items-center flex-col'>
                    <span onClick={() => likeUnlikePostHandler(post._id)}>
                      {post.likes?.includes(loggedInUserId) ? (
                        <i
                          className={`fa fa-heart text-red-500 md:text-2xl text-xl cursor-pointer pb-2 text-red-500 ${
                            likeAnimate && 'animate-ping'
                          }`}
                        ></i>
                      ) : (
                        <i className='far fa-heart md:text-2xl text-xl cursor-pointer pb-2'></i>
                      )}
                    </span>
                    <p style={{ fontSize: '15.6px' }}>
                      <span className='font-bold text-gray-700'>
                        {post.likes?.length}
                      </span>{' '}
                      likes
                    </p>
                  </div>

                  {/* comment */}
                  <div className='flex items-center flex-col ml-10'>
                    <i
                      onClick={() => commentHandler(post._id)}
                      className='far fa-comment md:text-2xl text-xl cursor-pointer pb-2'
                    ></i>
                    <p style={{ fontSize: '15.6px' }}>
                      <span className='font-bold text-gray-700'>
                        {post.comments?.length}
                      </span>{' '}
                      comments
                    </p>

                    <Modal
                      open={commentModal}
                      onClose={() => setCommentModal(false)}
                      aria-labelledby='modal-modal-title'
                      aria-describedby='modal-modal-description'
                    >
                      <Box sx={commentsModalStyle}>
                        <CommentsList
                          recentPosts={recentPosts}
                          commentPostId={commentPostId}
                          post={post}
                        />
                      </Box>
                    </Modal>
                  </div>
                </div>

                {/* share */}
                <div>
                  <i
                    className='fa fa-bookmark md:text-2xl text-xl cursor-pointer ml-4'
                    style={{ paddingTop: '1px' }}
                  ></i>
                </div>
              </section>

              {/* post created on */}
              <section className='md:px-6 px-3 bg-white pb-5'>
                <p className='text-gray-500 text-sm'>
                  {moment(post.createdOn).fromNow()}
                </p>
              </section>
            </div>
          </div>
        ))
      ) : (
        <div className='flex justify-center items-center h-96'>
          <p className='md:text-2xl text-xl font-medium'>No Posts Yet</p>
        </div>
      )}
    </>
  );
};

export default RecentPosts;
