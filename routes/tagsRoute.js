import express from "express";
import {
  createTag,
  getAllTags,
  updateTag,
  deleteTag
} from "../controllers/tags/tag-controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTag);
router.get("/", getAllTags);
router.put("/:id", verifyToken, updateTag);
router.delete("/:id", verifyToken, deleteTag);

export default router;
