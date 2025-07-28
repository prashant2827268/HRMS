import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  employeeName: String,
  designation: String,
  leaveType: {
    type: String,
    enum: ["Sick", "Casual", "Annual", "Maternity", "Emergency"],
  },
  startDate: Date,
  endDate: Date,
  reason: String,
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Approved", "Rejected"],
  },
  appliedDate: { type: Date, default: Date.now },
  approvedBy: String,
  documents: String,
  totalDays: Number,
});

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
