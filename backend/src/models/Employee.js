import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true },
    name: String,
    email: String,
    phone: String,
    position: String,
    department: String,
    joinDate: Date,
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive", "Terminated"],
    },
    profileImage: String,
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
