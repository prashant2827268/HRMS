import mongoose from "mongoose";
import dotenv from "dotenv";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import User from "../models/User.js";
import Candidate from "../models/Candidate.js";
import bcrypt from "bcryptjs";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting MongoDB: ${err.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Employee.deleteMany({});
    await Attendance.deleteMany({});
    await Leave.deleteMany({});
    await User.deleteMany({});
    await Candidate.deleteMany({});

    console.log("Cleared existing data");

    // Create sample candidates
    const candidates = [
      {
        fullName: "Jacob William",
        emailAddress: "jacob.william@example.com",
        phoneNumber: "(252) 555-0111",
        position: "Senior Developer",
        status: "New",
        experience: "1+",
      },
      {
        fullName: "Guy Hawkins",
        emailAddress: "kenzi.lawson@example.com",
        phoneNumber: "(907) 555-0101",
        position: "Human Resource Intern",
        status: "New",
        experience: "0",
      },
      {
        fullName: "Arlene McCoy",
        emailAddress: "arlene.mccoy@example.com",
        phoneNumber: "(302) 555-0107",
        position: "Full Time Designer",
        status: "Selected",
        experience: "2+",
      },
      {
        fullName: "Leslie Alexander",
        emailAddress: "willie.jennings@example.com",
        phoneNumber: "(207) 555-0119",
        position: "Full Time Developer",
        status: "Rejected",
        experience: "0",
      },
    ];

    await Candidate.insertMany(candidates);
    console.log("Created candidates:", candidates.length);

    // Create sample employees
    const employees = [
      {
        employeeId: "EMP001",
        name: "Jane Copper",
        email: "jane.copper@example.com",
        phone: "(704) 555-0127",
        position: "Full Time",
        department: "Designer",
        joinDate: new Date("2013-06-10"),
        status: "Active",
        profileImage: "https://i.pravatar.cc/40?img=68"
      },
      {
        employeeId: "EMP002",
        name: "Arlene McCoy",
        email: "arlene.mccoy@example.com",
        phone: "(302) 555-0107",
        position: "Full Time",
        department: "Designer",
        joinDate: new Date("2016-07-11"),
        status: "Active",
        profileImage: "https://i.pravatar.cc/40?img=69"
      },
      {
        employeeId: "EMP003",
        name: "Cody Fisher",
        email: "cody.fisher@example.com",
        phone: "(252) 555-0126",
        position: "Senior",
        department: "Backend Development",
        joinDate: new Date("2017-08-15"),
        status: "Active",
        profileImage: "https://i.pravatar.cc/40?img=70"
      },
      {
        employeeId: "EMP004",
        name: "Janney Wilson",
        email: "janney.wilson@example.com",
        phone: "(252) 555-0126",
        position: "Junior",
        department: "Backend Development",
        joinDate: new Date("2017-12-04"),
        status: "Active",
        profileImage: "https://i.pravatar.cc/40?img=71"
      },
      {
        employeeId: "EMP005",
        name: "Leslie Alexander",
        email: "leslie.alexander@example.com",
        phone: "(207) 555-0119",
        position: "Team Lead",
        department: "Human Resource",
        joinDate: new Date("2014-05-30"),
        status: "Active",
        profileImage: "https://i.pravatar.cc/40?img=72"
      }
    ];

    const createdEmployees = await Employee.insertMany(employees);
    console.log("Created employees:", createdEmployees.length);

    // Create sample attendance records
    const attendanceRecords = [
      {
        employeeId: createdEmployees[0]._id,
        employeeName: "Jane Copper",
        position: "Full Time",
        department: "Designer",
        task: "Dashboard Home page Alignment",
        date: new Date(),
        status: "Present"
      },
      {
        employeeId: createdEmployees[1]._id,
        employeeName: "Arlene McCoy",
        position: "Full Time",
        department: "Designer",
        task: "Dashboard Login page design, Dashboard Home page design",
        date: new Date(),
        status: "Present"
      },
      {
        employeeId: createdEmployees[2]._id,
        employeeName: "Cody Fisher",
        position: "Senior",
        department: "Backend Development",
        task: "--",
        date: new Date(),
        status: "Absent"
      },
      {
        employeeId: createdEmployees[3]._id,
        employeeName: "Janney Wilson",
        position: "Junior",
        department: "Backend Development",
        task: "Dashboard login page integration",
        date: new Date(),
        status: "Present"
      },
      {
        employeeId: createdEmployees[4]._id,
        employeeName: "Leslie Alexander",
        position: "Team Lead",
        department: "Human Resource",
        task: "4 scheduled interview, Sorting of resumes",
        date: new Date(),
        status: "Present"
      }
    ];

    await Attendance.insertMany(attendanceRecords);
    console.log("Created attendance records:", attendanceRecords.length);

    // Create sample leave records
    const leaveRecords = [
      {
        employeeName: "Cody Fisher",
        designation: "Senior Backend Developer",
        startDate: new Date("2024-09-08"),
        endDate: new Date("2024-09-08"),
        reason: "Visiting House",
        status: "Approved",
        documents: "📄"
      }
    ];

    await Leave.insertMany(leaveRecords);
    console.log("Created leave records:", leaveRecords.length);

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      username: "admin",
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "HR"
    });
    await adminUser.save();
    console.log("Created admin user");

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(() => {
  seedData();
}); 