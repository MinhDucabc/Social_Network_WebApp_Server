import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Content Schema
const contentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    type: {
      type: String,
      enum: ["post", "question"],
      required: true,
    },
    groupid: { type: String, ref: 'Group' },
    tags: [{ type: String, ref: 'Tag' }],
    title: String,
    date: { type: Date, default: Date.now },

    // Optional fields
    content: String, // chỉ dùng cho post
    description: String, // chỉ dùng cho question
    image: String, // optional

    comments: [{ type: String, ref: "Comment" }], // post
    commentsCount: Number,

    replies: [{ type: String, ref: "Reply" }], // question
    repliesCount: Number,

    upvotedBy: [{ type: String, ref: "User" }],
    upvotesCount: Number,
    downvotedBy: [{ type: String, ref: "User" }],
    downvotesCount: Number,

    savedBy: [{ type: String, ref: "User" }],
    savedCount: Number,

    userid: { type: String, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Content", contentSchema);
