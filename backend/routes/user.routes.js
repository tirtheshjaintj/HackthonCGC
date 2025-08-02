import express from "express";
import {
  initiateRegister,
  verifyOtp,
  login,
  googleSignIn,
  getAllUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

// Register with OTP
router.post("/register", initiateRegister);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Login (using email or username)
router.post("/login", login);

// Google Sign-In
router.post("/google-signin", googleSignIn);

router.get('/all' , getAllUsers)

export default router;
