// models/Tag.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const tagSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  name: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },

  // Mảng các nội dung có tag này
  contents: [
    {
      contentId: { type: String, required: true },
      contentType: { type: String, enum: ['post', 'question'], required: true },
    }
  ],
  contentsCount: { type: Number, default: 0 },
}, {
  timestamps: true
});

export default mongoose.model('Tag', tagSchema);
