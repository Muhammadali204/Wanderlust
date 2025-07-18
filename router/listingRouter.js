const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListings } = require("../middleware");
const listingController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const Listing = require("../models/Listing");

const upload = multer({ storage });

// All listings & Create listing
router.route("/")
  .get(wrapAsync(async (req, res) => {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const allListings = await Listing.find(filter);
    res.render("listing/index", { allListings, selectedCategory: category || null });
  }))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

// Search
router.get("/search", wrapAsync(async (req, res) => {
  const query = req.query.q;
  if (!query) return res.redirect("/listings");

  const regex = new RegExp(query, "i");
  const allListings = await Listing.find({
    $or: [
      { title: regex },
      { description: regex },
      { location: regex },
    ],
  });

  res.render("listing/index", { allListings, selectedCategory: null });
}));

// New listing form
router.get("/new", isLoggedIn, listingController.newListingForm);

// Single listing view/update/delete
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isOwner,
    upload.single("listing[image]"),
    validateListings,
    wrapAsync(listingController.updateListing)
  )
  .delete(isOwner, wrapAsync(listingController.deleteListing));

// Edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListingForm));

module.exports = router;
