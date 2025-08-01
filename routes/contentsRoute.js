import express from "express";
import {addContent} from "../controllers/contents/addContents.js"
import {updateFollow} from "../controllers/contents/updateFollow.js"
import {getRandomContents} from "../controllers/contents/getRandomContents.js"
import {getContentsByIds} from "../controllers/contents/getContentsByIds.js"
import {updateVote} from "../controllers/contents/updateVote.js"
import {updateContent} from "../controllers/contents/updateContent.js"
import {deleteContent} from "../controllers/contents/deleteContent.js"
import {saveContent} from "../controllers/contents/saveContent.js"
import {fetchSavedContentsUsers} from "../controllers/contents/fetchSavedContentUser.js"
import {getContentById} from "../controllers/contents/getContentById.js"
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
router.post("/random", getRandomContents);
router.post("/update-follow", verifyToken, updateFollow);
router.post("/add-content", verifyToken, addContent)
router.post("/get-by-ids", getContentsByIds);
router.post("/update-vote", verifyToken, updateVote);
router.post("/fetch-saved-content-users", fetchSavedContentsUsers);
router.get("/get-content-by-id/:id", getContentById);
router.put("/update-content", verifyToken, updateContent);
router.delete("/delete-content", verifyToken, deleteContent);
router.post("/save-content", verifyToken, saveContent);

export default router;