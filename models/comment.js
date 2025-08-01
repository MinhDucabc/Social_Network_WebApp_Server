// models/Comment.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const commentSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  postId: { type: String, ref: 'Content', required: true },
  userId: { type: String, ref: 'User', required: true },
  text: { type: String, required: true },

  upvotedBy: [{ type: String, ref: 'User' }],
  downvotedBy: [{ type: String, ref: 'User' }],
}, {
  timestamps: true
});

export default mongoose.model('Comment', commentSchema);
