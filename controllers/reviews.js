const Listing = require("../models/Listing");
const Review = require("../models/review");
const mongoose=require("mongoose")
// Create New Review
module.exports.createReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found!");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    await newReview.save();

    listing.reviews.push(newReview._id); // ✅ Corrected field name
    await listing.save();

    req.flash("success", "New Review Added.");
    res.redirect(`/listings/${listing._id}`);
  }


// Delete a review
module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;

    if (!reviewId) {
      return res.status(400).send("Review ID is missing");
    }

    reviewId = reviewId.trim(); // ✅ Trim spaces

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).send("Invalid Review ID format");
    }

    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // ✅ Corrected field name

    req.flash("success", "Review Got Deleted.");
    res.redirect(`/listings/${id}`);
  }

