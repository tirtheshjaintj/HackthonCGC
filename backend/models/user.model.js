import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => /^[a-zA-Z0-9_]+$/.test(v),
        message: "Username can only contain letters, numbers, and underscores.",
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: "Phone number must be exactly 10 digits.",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
        message: "Not a valid email!",
      },
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      validate: {
        validator: function (val) {
          return !val || val.length === 6;
        },
        message: "OTP must be 6 digits",
      },
    },
    google_id: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^\d{21}$/.test(v);
        },
        message: () => `Not a valid Google ID`,
      },
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: "https://imgs.search.brave.com/8COzZiqruIekL2ihFd4kJK1wDWAQSgIrdmENvJLpNjM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC8w/Ni8zMi9zb2NpYWwt/bmV0d29yay1kZWZh/dWx0LXByb2ZpbGUt/cGljdHVyZS1hdmF0/YXItaWNvbi12ZWN0/b3ItNTcxMjA2MzIu/anBn"
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRATION ?? '7d' }
  );
};

const userModel = model("User", userSchema);
export default userModel;
