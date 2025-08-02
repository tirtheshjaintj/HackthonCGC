import { AppError } from "../helpers/error.helper.js";
import { getUser } from "../helpers/jwt.helper.js";
import UserModel from "../models/user.model.js";

export const authcheck = async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  // Check Bearer token
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.substring(7);
  }

    // Check cookie token
    if (req.cookies && req.cookies.authToken) {
        token = req.cookies.authToken;
        console.log(token);
    }

    console.log("cookies", req.cookies);

  if (!token) throw new AppError("Not Authorized", 401);

    const user = getUser(token);
    if (!user) throw new AppError("Not Authorized", 401);
    const verified_user = await UserModel.findOne({ _id: user._id, isActive: true }).lean();
    console.log(verified_user);
    if (!verified_user) throw new AppError("Not Authorized", 401);
    verified_user.password = "HIDDEN"; // Hide password
    req.user = verified_user;

  next();
};

export const authcheckAdmin = async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  // Check Bearer token
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.substring(7);
  }

  // Check cookie token
  //   if (req.cookies && req.cookies.authToken) {
  //     token = req.cookies.authToken;
  //     console.log(token);
  //   }

  if (!token) throw new AppError("Token not found", 401);

  console.log({ adad: token });
  const user = getUser(token);
  if (!user) throw new AppError("Not Authorized", 401);

  const verified_user = await UserModel.findOne({
    _id: user._id,
    isActive: true,
    // isAdmin: true,
  });
  console.log(verified_user);
  if (!verified_user) throw new AppError("Not Authorized", 401);

  verified_user.password = "HIDDEN"; // Hide password
  req.user = verified_user;

  next();
};

export default authcheck;
