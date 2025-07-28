import express from "express";
import {
  createCandidate,
  getAllCandidates,
  updateCandidate,
  deleteCandidate,
  moveToEmployee,
} from "../../controllers/candidateController.js";
import { authenticateToken } from "../../middlewares/auth.js";
import upload from "../../middlewares/upload.js";

const router = express.Router();

router.post("/", authenticateToken, upload.single("resume"), createCandidate);
router.get("/", authenticateToken, getAllCandidates);
router.put("/:id", authenticateToken, updateCandidate);
router.delete("/:id", authenticateToken, deleteCandidate);
router.post("/move-to-employee/:id", authenticateToken, moveToEmployee);

export default router;
