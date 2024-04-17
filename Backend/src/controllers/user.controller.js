import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/error.middileware.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/jwtVerify.js";

const signUp = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorHandler("User already exist", 400));
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  await user.save();
  if (!user) {
    return next(new ErrorHandler("User not created", 400));
  }
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

const signIn = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User does not found", 401));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Wrong credientials", 401));
  }

  generateToken(user, "Login successfully", 200, res);
});

export { signUp, signIn };
