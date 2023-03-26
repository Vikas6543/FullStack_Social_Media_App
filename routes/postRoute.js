const router = require('express').Router();
const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');
const isAuthenticated = require('../middlewares/auth');

// create a post
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Please provide an image url' });
    }

    const newPost = new PostModel({
      postOwner: req.user.id,
      imageUrl,
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      message: 'Post Created Successfully',
      post: savedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// get all posts
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('postOwner', '_id name profilePicUrl')
      .populate('comments.user', '_id name')
      .sort('-createdOn');

    res.status(200).json({
      message: 'Posts fetched successfully',
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// like & unlike a post
router.put('/like/:postId', isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;

    // check if the post exists
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // check if the post is already liked by the user
    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      // unlike the post
      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== req.user.id
      );
      post.likes = updatedLikes;
      await post.save();
      res.status(200).json({
        message: 'Post unliked successfully',
        likes: updatedLikes,
      });
    } else {
      // like the post
      post.likes.push(req.user.id);
      await post.save();
      res.status(200).json({
        message: 'Post liked successfully',
        likes: post.likes,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// comment on a post
router.put('/comment/:postId', isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!text) {
      return res.status(400).json({ error: 'Please provide a comment' });
    }

    post.comments.push({
      user: req.user.id,
      text,
    });

    await post.save();

    res.status(200).json({
      message: 'Comment added successfully',
      comments: post.comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// delete a post
router.delete('/:postId', isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;

    // check if the post exists
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // delete the post
    await post.remove();

    res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
