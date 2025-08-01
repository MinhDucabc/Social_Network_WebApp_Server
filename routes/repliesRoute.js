import express from "express";
import {getRepliesByQuestionIds} from "../controllers/replies/getRepliesByQuestionIds.js"
import {addReply} from "../controllers/replies/addReplies.js"
import {getRepliesByReplyIds} from "../controllers/replies/getRepliesbyReplyId.js"
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/get-replies-by-question-ids", getRepliesByQuestionIds);
router.post("/get-replies-by-reply-ids", getRepliesByReplyIds);
router.post("/add-reply", verifyToken, addReply);

export default router;

