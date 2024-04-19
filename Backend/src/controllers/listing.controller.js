import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/error.middileware.js";
import { Listing } from "../models/listing.model.js";

const createListing = catchAsyncErrors(async (req, res, next) => {
  const listing = await Listing.create(req.body);
  if (!listing) {
    return next(new ErrorHandler("Listing not created", 400));
  }
  res.status(201).json({
    success: true,
    message: "Listing created successfully",
    listing,
  });
});

export { createListing };
