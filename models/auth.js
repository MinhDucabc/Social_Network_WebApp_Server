// models/Auth.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const authSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true, // sẽ lưu bản hash
  },
}, {
  timestamps: true,
});

export default mongoose.model('Auth', authSchema);
