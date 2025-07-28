import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";


export const createLeave = async (req, res) => {
  try {
    const { employeeName, designation, leaveDate, reason, documents } = req.body;

    let startDate;
    if (leaveDate.includes('-')) {
      // Handle "YYYY-MM-DD" from input type="date"
      startDate = new Date(leaveDate);
    } else if (leaveDate.includes('/')) {
      // Handle "d/mm/yy"
      const [day, month, year] = leaveDate.split('/');
      startDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      return res.status(400).json({ message: "Invalid leaveDate format" });
    }
    const endDate = new Date(startDate); // Same day for single day leave

    const totalDays = 1; // Single day leave

    const leaveData = {
      employeeName,
      designation,
      startDate,
      endDate,
      reason,
      documents: req.file?.path || documents || null,
      totalDays,
      status: "Pending"
    };

    const leave = new Leave(leaveData);
    await leave.save();
    res.status(201).json(leave);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error applying for leave", error: e.message });
  }
};


export const getLeaves = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { employeeName: new RegExp(search, "i") },
        { designation: new RegExp(search, "i") },
        { reason: new RegExp(search, "i") }
      ];
    }

    if (status) query.status = status;

    const leaves = await Leave.find(query).sort({ appliedDate: -1 });
    
    const transformedLeaves = leaves.map((leave) => ({
      id: leave._id,
      profile: "https://i.pravatar.cc/40?img=70", // Default avatar
      name: leave.employeeName,
      position: leave.designation,
      date: `${leave.startDate.getDate()}/${String(
        leave.startDate.getMonth() + 1
      ).padStart(2, "0")}/${String(leave.startDate.getFullYear()).slice(-2)}`,
      reason: leave.reason,
      status: leave.status,
      docs: leave.documents || null,
    }));
    
    res.json(transformedLeaves);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error fetching leaves", error: e.message });
  }
};

export const getApprovedLeaves = async (req, res) => {
  try {
    const approved = await Leave.find({ status: "Approved" }).sort({
      startDate: 1,
    });
    
    const transformedLeaves = approved.map(leave => ({
      id: leave._id,
      profile: "https://i.pravatar.cc/40?img=70", // Default avatar
      name: leave.employeeName,
      position: leave.designation,
      date: `${leave.startDate.getDate()}/${String(leave.startDate.getMonth() + 1).padStart(2, '0')}/${String(leave.startDate.getFullYear()).slice(-2)}`
    }));
    
    res.json(transformedLeaves);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error fetching approved leaves", error: e.message });
  }
};

export const updateLeave = async (req, res) => {
  try {
    const updated = await Leave.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Error updating leave", error: e.message });
  }
};

