import express from "express";
import {
  initiateRegister,
  verifyOtp,
  login,
  googleSignIn,
  getAllUsers,
} from "../controllers/user.controller.js";
import authcheck from "../middlewares/authcheck.js";

const userRouter = express.Router();

// Register with OTP
userRouter.post("/register", initiateRegister);

userRouter.get("/", authcheck, async (req, res) => {
  return req.user;
});
// Verify OTP
userRouter.post("/verify-otp", verifyOtp);

// Login (using email or username)
userRouter.post("/login", login);

// Google Sign-In
userRouter.post("/google-signin", googleSignIn);

router.get('/all' , getAllUsers)

export default userRouter;
