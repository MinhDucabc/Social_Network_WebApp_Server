// models/Reply.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const replySchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  parentId: { type: String, ref: 'Reply'},
  questionId: { type: String, ref: 'Content', required: true },
  userId: { type: String, ref: 'User', required: true },
  text: { type: String, required: true },

  upvotedBy: [{ type: String, ref: 'User' }],
  downvotedBy: [{ type: String, ref: 'User' }],

  replies: [{ type: String, ref: 'Reply' }] // hỗ trợ reply lồng nhau
}, {
  timestamps: true
});

export default mongoose.model('Reply', replySchema);
