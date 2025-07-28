import Candidate from "../models/Candidate.js";
import Employee from "../models/Employee.js";


export const createCandidate = async (req, res) => {
  try {
    const resume = req.file?.path || null;
    const candidate = new Candidate({
      ...req.body,
      resume,
    });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error creating candidate", error: e.message });
  }
};

export const getAllCandidates = async (req, res) => {
  try {
    const { search, status, position } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { position: new RegExp(search, "i") }
      ];
    }

    if (status) query.status = status;
    if (position) query.position = position;

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    
    // Transform data to match frontend format
    const transformedCandidates = candidates.map(candidate => ({
      id: candidate._id,
      profile: "https://i.pravatar.cc/40?img=70", // Default avatar
      name: candidate.fullName || candidate.name,
      email: candidate.emailAddress || candidate.email,
      phone: candidate.phoneNumber || candidate.phone,
      position: candidate.position,
      experience: candidate.experience,
      status: candidate.status || "New"
    }));
    
    res.json(transformedCandidates);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error fetching candidates", error: e.message });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const updated = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error updating candidate", error: e.message });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "Candidate deleted successfully" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error deleting candidate", error: e.message });
  }
};

export const moveToEmployee = async (req, res) => {
  try {
   
   const{name,email,phone,position,profile} = req.body;
    const newEmp = new Employee({
      employeeId:"EMP" + Date.now(),
      name: name,
      email: email,
      phone: phone,
      position: position,
      department:position,
      joinDate: new Date(),
     
      profileImage:profile
    });
    await newEmp.save();
   
    

    res.json({
      message: "Candidate moved to employee successfully",
      employee: newEmp,
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error moving candidate", error: e.message });
  }
};
