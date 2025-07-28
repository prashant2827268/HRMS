import express from "express";
import {
  createAttendance,
  getAttendance,
  getActiveEmployees,
  updateAttendance,
} from "../../controllers/attendanceController.js";
import { authenticateToken } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/", authenticateToken, createAttendance);
router.get("/", authenticateToken, getAttendance);
router.get("/active-employees", authenticateToken, getActiveEmployees);
router.put("/:id", authenticateToken, updateAttendance);

export default router;
