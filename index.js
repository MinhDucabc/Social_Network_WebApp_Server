import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import contentsRoute from "./routes/contentsRoute.js"
import authRoute from "./routes/authRoute.js"
import profileRoute from "./routes/profileRoute.js"
import commentsRoute from "./routes/commentsRoute.js"
import repliesRoute from "./routes/repliesRoute.js"
import tagsRoute from "./routes/tagsRoute.js"

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Sample route
app.use("/api/contents", contentsRoute)
app.use("/api/auth", authRoute)
app.use("/api/profile", profileRoute)
app.use("/api/comments", commentsRoute)
app.use("/api/replies", repliesRoute)
app.use("/api/tags", tagsRoute)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
