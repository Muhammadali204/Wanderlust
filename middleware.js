const Listing = require("./models/Listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schemaValidation");
const expressError = require("./utils/expressError");

// Middleware to check authentication
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

// Middleware to save redirected URL
module.exports.savedRedirectedUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // Fixed session key
  }
  next();
};

// isOwner Middleware
module.exports.isOwner = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }

  let { id } = req.params;
  let listing = await Listing.findById(id).populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  if (!listing.owner || !req.user || !listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};



// Middleware: Validating Listing
module.exports.validateListings = (req, res, next) => {
  if (!req.body.listing) {
    return next(new expressError(400, '"listing" is required'));
  }
  let { error } = listingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    let errorMessage = error.details.map((err) => err.message).join(", ");
    return next(new expressError(400, errorMessage));
  }
  next();
};

// Validating route of review
module.exports.validateReview = (req, res, next) => {
  if (!req.body.review) {
    return next(new expressError(400, '"review" is required'));
  }
  let { error } = reviewSchema.validate(req.body, { abortEarly: false });
  if (error) {
    let errorMessage = error.details.map((err) => err.message).join(", ");
    return next(new expressError(400, errorMessage));
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author || !res.locals.currentUser || !review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not the author of the Review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

