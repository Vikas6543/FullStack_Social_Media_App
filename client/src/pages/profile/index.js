import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthHeader } from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProfilePosts from '../../components/profile/ProfilePosts';
import ProfileStats from '../../components/profile/ProfileStats';
import ProfileFollowers from '../../components/profile/ProfileFollowers';
import ProfileFollowing from '../../components/profile/ProfileFollowing';
import {
  LOGGED_IN_USER_PROFILE_DETAILS,
  PROFILE_POSTS,
  SEARCH_INPUT_SHOW,
} from '../../redux/types';

const Profile = () => {
  const [profileDetails, setProfileDetails] = useState({});
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFollowersLoading, setIsFollowersLoading] = React.useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = React.useState(false);
  const [myPosts, setMyPosts] = React.useState([]);
  const [postsTab, setPostsTab] = React.useState(true);
  const [followersTab, setFollowersTab] = React.useState(false);
  const [followingTab, setFollowingTab] = React.useState(false);

  const token = useSelector((state) => state.auth?.user?.token);
  const loggedInUserId = useSelector((state) => state.auth?.user?.user._id);
  const recentPosts = useSelector((state) => state.post?.recentPosts);
  const profilePosts = useSelector((state) => state.post?.profilePosts);

  const dispatch = useDispatch();

  const openPostsTab = () => {
    setPostsTab(true);
    setFollowersTab(false);
    setFollowingTab(false);
  };

  const openFollowersTab = () => {
    setFollowersTab(true);
    setPostsTab(false);
    setFollowingTab(false);
  };

  const openFollowingTab = () => {
    setFollowingTab(true);
    setPostsTab(false);
    setFollowersTab(false);
  };

  // get my profile details
  const getProfileDetails = async () => {
    try {
      const response = await axios.get(
        'https://mern-stack-app-api-pc1h.onrender.com/user/profile'
      );
      dispatch({ type: PROFILE_POSTS, payload: response?.data.user });
      dispatch({
        type: LOGGED_IN_USER_PROFILE_DETAILS,
        payload: response?.data?.user,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // get followers list
  const getFollowersList = async () => {
    try {
      const response = await axios.get(
        'https://mern-stack-app-api-pc1h.onrender.com/user/followers'
      );
      setFollowersList(response?.data.followers);
    } catch (error) {
      console.log(error);
    }
  };

  // get following list
  const getFollowingList = async () => {
    try {
      const response = await axios.get(
        'https://mern-stack-app-api-pc1h.onrender.com/user/following'
      );
      setFollowingList(response?.data.followers);
    } catch (error) {
      console.log(error);
    }
  };

  const unFollowHandler = async (id) => {
    try {
      setIsFollowersLoading(true);
      await axios.put(
        `https://mern-stack-app-api-pc1h.onrender.com/user/follow/${id}`
      );
      setIsFollowersLoading(false);
      getProfileDetails();
      getFollowersList();
      getFollowingList();
    } catch (error) {
      setIsFollowersLoading(false);
      console.log(error);
    }
  };

  const removeFollower = async (id) => {
    try {
      await axios.put(
        `https://mern-stack-app-api-pc1h.onrender.com/user/removeFollower/${id}`
      );
      getProfileDetails();
      getFollowersList();
      getFollowingList();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch({ type: SEARCH_INPUT_SHOW, payload: false });
    const filteredPosts = recentPosts.filter((post) => {
      return post.postOwner._id === loggedInUserId;
    });
    setMyPosts(filteredPosts);
  }, []);

  useEffect(() => {
    setAuthHeader(token);
    getProfileDetails();
    getFollowersList();
    getFollowingList();
  }, []);

  return (
    <div className='lg:w-8/12 -mt-5'>
      {isLoading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* header top */}
          <div className='flex items-center lg:justify-between'>
            {/* profile image */}
            <section>
              <img
                src={profilePosts?.profilePicUrl}
                alt='profile'
                className='lg:w-36 lg:h-36 w-20 h-20 rounded-full'
              />
            </section>

            {/* profile title */}
            <section className='lg:pl-24 pl-8'>
              <p className='lg:text-4xl text-2xl font-bold'>
                {profilePosts?.name}
              </p>
              {profilePosts?.role === 'admin' && (
                <p
                  className='text-md bg-green-500 lg:ml-2 text-white rounded-lg text-sm lg:p-2 p-2 lg:mt-4 mt-2 float-left flex items-center justify-center cursor-pointer'
                  style={{ fontWeight: '500' }}
                >
                  <i className='fas fa-user-shield pr-2'></i>
                  Admin
                </p>
              )}
            </section>
          </div>

          {/* profile stats */}
          <ProfileStats
            profilePosts={profilePosts}
            myPosts={myPosts}
            followersTab={followersTab}
            postsTab={postsTab}
            followingTab={followingTab}
            openPostsTab={openPostsTab}
            openFollowingTab={openFollowingTab}
            openFollowersTab={openFollowersTab}
          />

          {/* all tabs */}
          <div className='mt-8'>
            {postsTab && <ProfilePosts myPosts={myPosts} />}
            {followersTab && (
              <div>
                <ProfileFollowers
                  followersList={followersList}
                  removeFollower={removeFollower}
                />
              </div>
            )}
            {followingTab && (
              <div>
                <ProfileFollowing
                  followingList={followingList}
                  unFollowHandler={unFollowHandler}
                  isFollowersLoading={isFollowersLoading}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
