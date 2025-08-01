// routes/profileRoute.js
import express from 'express';
import {getUserContentsByIds} from "../controllers/profile/getUserContent.js"
import { getFollowersByIds } from "../controllers/profile/getUserFollower.js";
import { getFollowingByIds} from "../controllers/profile/getUserFollowing.js";
import { getUserProfileByAuthId } from "../controllers/profile/getUserProfile.js";
import { getUserProfileById } from "../controllers/profile/getUserProfile.js";
import { verifyToken } from '../middlewares/verifyToken.js';
import { getUserSavedContent } from '../controllers/profile/getUserSavedContent.js';
import { updateUserProfile } from '../controllers/profile/updateProfile.js';
import { getUnfollowedUsers } from '../controllers/profile/getUnfollowedUser.js';
const router = express.Router();

router.get("/user/:id", getUserProfileById);
router.get("/:authId", getUserProfileByAuthId);
router.post("/contents", getUserContentsByIds);
router.post('/followers', getFollowersByIds);
router.post('/following', getFollowingByIds);
router.post('/unfollowed-users', getUnfollowedUsers);
router.post('/saved-contents', getUserSavedContent);
router.put('/update-profile/:userId', updateUserProfile);

export default router;
