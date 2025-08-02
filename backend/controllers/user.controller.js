import userModel from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";
import { sendOtpEmail } from "../utils/utils.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    return ticket.getPayload(); // returns { email, name, picture, sub, ... }
  } catch (error) {
    console.error("Error verifying Google token:", error);
    throw new Error("Invalid Google token");
  }
};


export const googleSignIn = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({ message: "Token ID is required" });
    }

    const googleUser = await verifyGoogleToken(tokenId);
    const { email, name, sub, picture } = googleUser;

    if (!email || !name || !sub) {
      return res.status(400).json({ message: "Missing Google user info" });
    }

    let user = await userModel.findOne({ email });

    if (user) {
      if (!user.google_id) {
        user.google_id = sub;
        await user.save();
      }

      const token = user.generateJWT();
      return res.status(200).json({
        message: "User already exists. Logged in successfully.",
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        },
        token,
      });
    }


    const generatedUsername = email.split("@")[0] + Math.floor(Math.random() * 1000);
    const userPhone = "0000000000";

    user = await userModel.create({
      email,
      username: generatedUsername,
      phone: userPhone,
      google_id: sub,
      avatar: picture,
      password: sub,
    });

    const token = user.generateJWT();

    return res.status(201).json({
      message: "Account created via Google",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    res.status(500).json({ message: error.message || "Google Sign-In failed" });
  }
};


export const initiateRegister = async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;

    if (!username || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await userModel.create({
      username,
      phone,
      email,
      password,
      otp,
    });

    const emailSent = await sendOtpEmail(email, otp);

    if (!emailSent) {
      await userModel.findByIdAndDelete(user._id); // cleanup
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.status(200).json({ message: "OTP sent to email", email });
  } catch (error) {
    console.error("Initiate Register Error:", error);
    res.status(500).json({ message: "Error initiating registration" });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Optional: Check OTP expiry
    if (user.otpExpires && user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    user.isActive = true;
    user.otp = undefined; // Optional: remove OTP after verification
    user.otpExpires = undefined; // Optional
    await user.save();

    return res.status(200).json({ message: "OTP verified. User activated." });

  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const user = await userModel.findOne({
      $or: [{ username: username }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = user.generateJWT();

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};