import express from "express";
import {
  createLeave,
  getLeaves,
  getApprovedLeaves,
  updateLeave,
} from "../../controllers/leaveController.js";
import { authenticateToken } from "../../middlewares/auth.js";
import upload from "../../middlewares/upload.js";

const router = express.Router();

router.post("/", authenticateToken, upload.single("documents"), createLeave);
router.get("/", authenticateToken, getLeaves);
router.get("/approved", authenticateToken, getApprovedLeaves);
router.put("/:id", authenticateToken, updateLeave);

export default router;
