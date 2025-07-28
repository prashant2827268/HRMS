import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;


export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate token for the new user
    const token = jwt.sign({ userId: newUser._id, email }, JWT_SECRET, {
      expiresIn: "2h",
    });
  
    res.status(201).json({ 
      message: "User registered successfully",
      token,
      user: { 
        id: newUser._id, 
        username: newUser.username, 
        name: newUser.username, // Use username as name for display
        email, 
        role: newUser.role 
      },
    });
  } catch (e) {
    console.log("Error registering user");
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });
  

    const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, {
      expiresIn: "2h",
    });


    res.json({
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        name: user.username, // Use username as name for display
        email, 
        role: user.role 
      },
    });
  } catch (e) {
    console.log("Error loging user");

    res.status(500).json({ message: "Server error", error: e.message });
  }
};
