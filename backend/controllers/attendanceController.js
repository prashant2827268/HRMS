import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";


export const createAttendance = async (req, res) => {
  try {
    const entry = new Attendance(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error creating attendance", error: e.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { employeeName: new RegExp(search, "i") },
        { position: new RegExp(search, "i") },
        { department: new RegExp(search, "i") },
        { task: new RegExp(search, "i") }
      ];
    }

    if (status) query.status = status;

    const result = await Attendance.find(query).sort({ date: -1 });
    
    // Transform data to match frontend format
    const transformedAttendance = result.map(attendance => ({
      id: attendance._id,
      profile: "https://i.pravatar.cc/40?img=70", // Default avatar
      name: attendance.employeeName,
      position: attendance.position,
      department: attendance.department,
      task: attendance.task || "--",
      status: attendance.status
    }));
    
    res.json(transformedAttendance);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error fetching attendance", error: e.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error updating attendance", error: e.message });
  }
};

export const getActiveEmployees = async (req, res) => {
  try {
    const list = await Employee.find({ status: "Active" }).select(
      "employeeId name department position"
    );
    res.json(list);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error fetching employees", error: e.message });
  }
};
