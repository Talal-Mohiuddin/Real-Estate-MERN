import { catchAsyncErrors } from "./catchAsyncErrors.js";
import { ErrorHandler } from "./error.middileware.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyuser = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.user;
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});

export { verifyuser };
