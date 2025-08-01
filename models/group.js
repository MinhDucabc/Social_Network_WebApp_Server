// models/Group.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const groupSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  name: { type: String, required: true },
  groupImage: { type: String },
  groupDescription: { type: String },
  admin: { type: String, ref: 'User', required: true },
  members: [{ type: String, ref: 'User' }]
}, {
  timestamps: true
});

export default mongoose.model('Group', groupSchema);
