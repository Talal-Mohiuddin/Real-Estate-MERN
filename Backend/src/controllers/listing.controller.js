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

const getIndividualListing = catchAsyncErrors(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(new ErrorHandler("Listing not found", 400));
  }
  res.status(200).json({
    success: true,
    message: "Listing found successfully",
    listing,
  });
});

const editListing = catchAsyncErrors(async (req, res, next) => {
  const list = req.params.id;
  const findListing = await Listing.findById(list);
  if (!findListing) {
    return next(new ErrorHandler("Listing Not Found", 403));
  }
  if (req.user._id.toString() !== findListing.userRef.toString()) {
    return next(
      new ErrorHandler("You are not authorized to edit this listing", 403)
    );
  }
  const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!listing) {
    return next(new ErrorHandler("Listing not updated", 400));
  }
  res.status(200).json({
    success: true,
    message: "Listing updated successfully",
    listing,
  });
});

const getListing = catchAsyncErrors(async (req, res, next) => {
  let limit = parseInt(req.query.limit) || 6;
  let startIndex = parseInt(req.query.startIndex) || 0;
  let offer = req.query.offer;

  if (offer === undefined || offer === "null") {
    offer = { $in: [false, true] };
  }

  let furnished = req.query.furnished;
  if (furnished === undefined || furnished === "null") {
    furnished = { $in: [false, true] };
  }

  let parking = req.query.parking;
  if (parking === undefined || parking === "null") {
    parking = { $in: [false, true] };
  }
  let type = req.query.type;
  if (type === undefined || type === "all") {
    type = { $in: ["sale", "rent"] };
  }
  const searchTerm = req.query.searchTerm || "";
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "desc";

  const listings = await Listing.find({
    name: { $regex: searchTerm, $options: "i" },
    offer,
    furnished,
    parking,
    type,
  })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

  res.status(200).json({
    success: true,
    message: "Listing found successfully",
    listings,
  });
});

export { createListing, getIndividualListing, editListing, getListing };
