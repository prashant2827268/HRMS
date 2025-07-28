import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  employeeName: String,
  position: String,
  department: String,
  task: String,
  date: Date,
  checkIn: String,
  checkOut: String,
  status: {
    type: String,
    default: "Present",
    enum: ["Present", "Absent", "Late", "Half Day"],
  },
  workingHours: String,
  notes: String,
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
