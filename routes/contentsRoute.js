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

const router = express.Router();
router.post("/random", getRandomContents);
router.post("/update-follow", updateFollow);
router.post("/add-content", addContent)
router.post("/get-by-ids", getContentsByIds);
router.post("/update-vote", updateVote);
router.post("/fetch-saved-content-users", fetchSavedContentsUsers);
router.get("/get-content-by-id/:id", getContentById);
router.put("/update-content", updateContent);
router.delete("/delete-content", deleteContent);
router.post("/save-content", saveContent);

export default router;