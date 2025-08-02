import express from "express";
import {
  initiateRegister,
  verifyOtp,
  login,
  googleSignIn,
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

export default router;
