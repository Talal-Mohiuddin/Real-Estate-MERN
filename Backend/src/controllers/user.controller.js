import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/error.middileware.js";
import { Listing } from "../models/listing.model.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

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

const oauth = catchAsyncErrors(async (req, res, next) => {
  const { name, email, photo } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    generateToken(user, "Login successfully", 200, res);
  } else {
    const generatepassword = Math.random().toString(36).slice(-8);
    const userName =
      email.split(" ").join("").toLowerCase() +
      Math.floor(Math.random() * 1000);
    const user = await User.create({
      name: userName,
      email,
      password: generatepassword,
      avatar: photo,
    });
    if (!user) {
      return next(new ErrorHandler("User not created", 400));
    }
    await user.save();
    generateToken(user, "Login successfully", 200, res);
  }
});

const updateUser = catchAsyncErrors(async (req, res, next) => {
  if (req.user._id?.toString() !== req?.params.id?.toString()) {
    return next(
      new ErrorHandler("You are not authorized to update this user", 403)
    );
  }
  const user = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar,
    },
  });
  if (!user) {
    return next(new ErrorHandler("User not updated", 400));
  }
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});

const deleteUser = catchAsyncErrors(async (req, res, next) => {
  if (req.user._id?.toString() !== req?.params.id?.toString()) {
    return next(
      new ErrorHandler("You are not authorized to delete this user", 403)
    );
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not deleted", 400));
  }
  res.clearCookie("user").status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

const signOut = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("user").status(200).json({
    success: true,
    message: "User signout successfully",
  });
});

const getListing = catchAsyncErrors(async (req, res, next) => {
  const listing = await Listing.find({ userRef: req.user._id });
  if (listing.length === 0) {
    return next(new ErrorHandler("Listing not found", 400));
  }
  res.status(200).json({
    success: true,
    message: "Listing found successfully",
    listing,
  });
});

const deleteListing = catchAsyncErrors(async (req, res, next) => {
  const list = req.params.id;
  const listing = await Listing.findByIdAndDelete(list);
  if (!listing) {
    return next(new ErrorHandler("Listing not found", 400));
  }
  if (req.user._id.toString() !== listing.userRef.toString()) {
    return next(
      new ErrorHandler("You are not authorized to delete this listing", 403)
    );
  }
  res.status(200).json({
    success: true,
    message: "Listing deleted successfully",
  });
});

export {
  signUp,
  signIn,
  oauth,
  updateUser,
  deleteUser,
  signOut,
  getListing,
  deleteListing,
};
