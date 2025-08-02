import express from "express";
import {
  registerUser,
  loginUser,
  GoogleSignIn,
} from "../controllers/user.controller.js";
import authcheck from "../middlewares/authcheck.js";

const userRouter = express.Router();

// Register with OTP
userRouter.post("/register", registerUser);

userRouter.get("/", authcheck, async (req, res) => {
  return req.user;
});
// Verify OTP

// Login (using email or username)
userRouter.post("/login", loginUser);

// Google Sign-In
userRouter.post("/google-signin", GoogleSignIn);

// router.get('/all' , getAllUsers)

export default userRouter;
