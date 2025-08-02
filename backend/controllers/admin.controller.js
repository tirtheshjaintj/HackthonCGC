import adminModel from "../models/admin.model.js";
import userModel from "../models/user.model.js";

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const admin = await adminModel.findOne({ username });

    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.isPasswordCorrect(password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

    const token = admin.generateJWT();

    res.status(200).json({
      message: "Login successful",
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        avatar: admin.avatar,
      },
      token,
    });

  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const adminRegister = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone)
      return res.status(400).json({ message: "All fields are required" });

    const existingAdmin = await adminModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingAdmin)
      return res.status(409).json({ message: "Admin already exists" });

    const newAdmin = await adminModel.create({
      username,
      email,
      password,
      phone
    });

    const token = newAdmin.generateJWT();

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        _id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        avatar: newAdmin.avatar,
        phone: newAdmin.phone
      },
      token,
    });
  } catch (error) {
    console.error("Admin Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User banned successfully", user });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
