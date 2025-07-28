import express from "express";
import {
  downloadFile,
  getDashboardStats,
} from "../controllers/miscController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/download/:filename", authenticateToken, downloadFile);
router.get("/dashboard/stats", authenticateToken, getDashboardStats);

export default router;
