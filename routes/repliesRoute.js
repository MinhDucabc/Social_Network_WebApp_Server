import express from "express";
import {getRepliesByQuestionIds} from "../controllers/replies/getRepliesByQuestionIds.js"
import {addReply} from "../controllers/replies/addReplies.js"
import {getRepliesByReplyIds} from "../controllers/replies/getRepliesbyReplyId.js"

const router = express.Router();

router.post("/get-replies-by-question-ids", getRepliesByQuestionIds);
router.post("/get-replies-by-reply-ids", getRepliesByReplyIds);
router.post("/add-reply", addReply);

export default router;

