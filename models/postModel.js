const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  postOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  imageUrl: {
    type: String,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
      },
      createdOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
