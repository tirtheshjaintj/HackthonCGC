// import { uploadToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
// import sendEmail from '../service/sendMail.js';
import asynchandler from "express-async-handler";
import User from "../models/user.model.js";

const getToken = (user, exp = null) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: exp ? exp : "1d",
    }
  );
};

// ============================== GOOGLE SIGNIN =====================================
// Verify Google token function
const client = new OAuth2Client(process.env.G_CLIENT_ID);

const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.G_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error("Error verifying token", error);
    throw new Error("Invalid token");
  }
};

export const GoogleSignIn = asynchandler(async (req, res) => {
  const { tokenId } = req.body;

  try {
    const googleUser = await verifyGoogleToken(tokenId);
    const { email, name, picture, sub } = googleUser;

    if (!email || !name || !sub)
      return res.status(400).json({ message: "All fields are required" });

    const getUser = await User.findOne({ email }).select("-password");

    if (getUser) {
      if (!getUser.gid) {
        getUser.gid = sub;
        await getUser.save();
      }
      const token = getToken(getUser);

      return res.status(200).json({
        message: "Account already exists, logged in successfully",
        user: getUser,
        token: token,
      });
    }

    const newUser = new User({
      email,
      name: name,
      avatar: picture,
      gid: sub,
      username: username,
    });
    await newUser.save();

    const token = getToken(newUser);

    const userObject = newUser.toObject();
    delete userObject.password;
    res.status(201).json({
      message: "Account created successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    res.status(500).json({ message: "Something went wrong while registering" });
  }
});

// ===================================================================
const generateUniqueUsername = (name) => {
  const firstName = name.split(" ")[0];

  const base = `${firstName}`;

  // Replace all non-alphanumeric or underscore characters
  const sanitizedBase = base.replace(/[^a-zA-Z0-9_]/g, "");

  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${sanitizedBase}_${randomSuffix}`.toLowerCase();
};

// Manual Register
export const registerUser = asynchandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name)
    return res.status(400).json({ message: "All Fields are required" });
  const getUser = await User.findOne({ email: email });
  if (getUser)
    return res
      .status(400)
      .json({ message: "Account already exists, Kindly login" });

  const username = generateUniqueUsername(email, name);

  const newUser = new User({
    email,
    password,
    name,
    username: username,
  });
  await newUser.save();

  if (!newUser) return res.status(500).json({ message: "Invalid User Data" });

  const token = getToken(newUser);

  const userObject = newUser.toObject();
  delete userObject.password;
  res
    .status(201)
    .json({ message: "Account created ", token: token, user: newUser });
});

// Login
export const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All Fields are required" });
  const finduser = await User.findOne({ email: email });
  if (!finduser)
    return res.status(400).json({ message: "Account does not exist" });

  const match = await finduser.isPasswordCorrect(password);

  if (!match) return res.status(401).json({ message: "Invalid credentials" });
  const token = getToken(finduser);

  const userObject = finduser.toObject();
  delete userObject.password;

  res
    .status(200)
    .json({ message: "Welcome Back 🎉", token: token, user: userObject });
});

// export const updateAvatar = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const avatarPath = req.file.path;

//     const avatar = await uploadToCloudinary(avatarPath);

//     if (!avatar) {
//       return res.status(500).json({ message: "Avatar upload failed" });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { avatar: avatar.secure_url },
//       { new: true }
//     ).select("-password");

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: "Avatar updated successfully",
//       user: updatedUser,
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

// export const updateUser = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { name, skills, bio, achievements, links, address } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { name, skills, bio, achievements, links, address },
//       { new: true }
//     ).select("-password");

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: "User updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

export const verifyUserToken = asynchandler(async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Unauthorized request" });
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: "Your Session has been expired",
        expiredSession: true,
      });
    }
    if (!decodedToken) {
      return res.status(401).json({
        message: "Your Session has been expired",
        expiredSession: true,
      });
    }

    const user = await User.findById(decodedToken._id).select("-password");

    if (!user) {
      res.status(401).json({ message: "Invalid token" });
    }

    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: "Invalid access token" });
  }
});
