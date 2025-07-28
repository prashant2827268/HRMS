import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


import Candidate from "../models/Candidate.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import Attendance from "../models/Attendance.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadFile = (req, res) => {
  const file = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", file);

  if (fs.existsSync(filePath)) res.download(filePath);
  else res.status(404).json({ message: "File not found" });
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const totalEmployees = await Employee.countDocuments({ status: "Active" });
    const pendingLeaves = await Leave.countDocuments({ status: "Pending" });

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: start, $lt: end },
    });

    res.json({
      totalCandidates,
      totalEmployees,
      pendingLeaves,
      todayAttendance,
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error fetching dashboard stats", error: e.message });
  }
};
