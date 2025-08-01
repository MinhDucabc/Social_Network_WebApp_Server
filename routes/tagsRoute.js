import express from "express";
import {
  createTag,
  getAllTags,
  updateTag,
  deleteTag
} from "../controllers/tags/tag-controller.js";

const router = express.Router();

router.post("/", createTag);
router.get("/", getAllTags);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

export default router;
