import Employee from "../models/Employee.js";
import { parseCustomDate } from "../utils/dateParser.js";

export const createEmployee = async (req, res) => {
  try {
    const employee = new Employee({
      ...req.body,
      employeeId: "EMP" + Date.now(),
    });
    await employee.save();
    res.status(201).json(employee);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error creating employee", error: e.message });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const { search, position, department } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { position: new RegExp(search, "i") },
        { department: new RegExp(search, "i") }
      ];
    }

    if (position) query.position = position;
    if (department) query.department = department;

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    
    // Transform data to match frontend format
    const transformedEmployees = employees.map(employee => ({
      id: employee._id,
      profile: employee.profileImage || "https://i.pravatar.cc/40?img=70",
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      joinDate: employee.joinDate ? `${employee.joinDate.getDate()}/${String(employee.joinDate.getMonth() + 1).padStart(2, '0')}/${String(employee.joinDate.getFullYear()).slice(-2)}` : ""
    }));
    
    res.json(transformedEmployees);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error fetching employees", error: e.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    
    const joinDate = parseCustomDate(req.body.joinDate);
    const updated = await Employee.findByIdAndUpdate(req.params.id, {...req.body,joinDate}, {
      new: true,
    });
    res.json(updated);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error updating employee:", error: e.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error deleting employee", error: e.message });
  }
};
