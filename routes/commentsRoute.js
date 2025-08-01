import express from "express";
import {getCommentsByPostIds} from "../controllers/comments/getCommentsByPostIds.js"
import {addComment} from "../controllers/comments/addComment.js"

const router = express.Router();

router.post("/get-comments-by-post-ids", getCommentsByPostIds);
router.post("/add-comment", addComment);

export default router;
