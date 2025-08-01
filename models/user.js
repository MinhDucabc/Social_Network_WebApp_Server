// models/User.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  name: { type: String, required: true, trim: true },

  avatar: {
    type: String,
    default: '',
  },

  date: { type: Date, default: Date.now },

  personalLink: [{ type: String, default: '' }],

  bio: { type: String, default: '', maxlength: 160 },

  // Người dùng theo dõi và được theo dõi
  followers: [{ type: String, ref: 'User' }],
  following: [{ type: String, ref: 'User' }],

  // he thong tinh diem
  score: { type: Number, default: 0 },
  level: { type: Number, default: 1 },

  // Nội dung đã tạo (posts, questions)
  contents: [
    {
      contentId: { type: String, required: true },
      contentType: { type: String, enum: ['post', 'question'], required: true }
    }
  ],
  
  // Mục yêu thích (post, question, v.v.)
  savedContents: [{
    contentId: { type: String, required: true },
    contentType: { type: String, enum: ['post', 'question'], required: true }
  }],

  // Liên kết đến tài khoản đăng nhập
  authId: {
    type: String,
    ref: 'Auth',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);
