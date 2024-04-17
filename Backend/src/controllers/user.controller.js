import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/error.middileware.js";
import { User } from "../models/user.model.js";

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

const signIn = catchAsyncErrors(async (req, res, next) => {});

export { signUp };
