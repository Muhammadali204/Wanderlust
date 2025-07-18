const Listing = require("../models/Listing");
const axios = require("axios");

// Index Route
module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find();
    res.render("listing/index", { allListings });
  } catch (error) {
    console.error("Error loading listings:", error);
    req.flash("error", "Something went wrong while loading listings.");
    res.redirect("/");
  }
};

// New Listing Form Route
module.exports.newListingForm = (req, res) => {
  res.render("listing/new");
};

// Show Listing Route
module.exports.showListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author", select: "username" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }

    res.render("listing/show", { listing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    req.flash("error", "Something went wrong while loading the listing.");
    res.redirect("/listings");
  }
};

// Create New Listing Route
module.exports.createListing = async (req, res) => {
  try {
    if (!req.file) {
      req.flash("error", "No image uploaded!");
      return res.redirect("/listings/new");
    }

    const { path: url, filename } = req.file;
    const newListing = new Listing({
      ...req.body.listing,
      image: { filename, url },
      owner: req.user._id,
    });

    // Geocoding with User-Agent header
    if (req.body.listing.location) {
      const geoURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`;
      const response = await axios.get(geoURL, {
        headers: {
          "User-Agent": "wanderlust-app/1.0 (https://wanderlust-homestay.vercel.app/)",
        },
      });

      if (response.data?.length > 0) {
        newListing.latitude = parseFloat(response.data[0].lat);
        newListing.longitude = parseFloat(response.data[0].lon);
      }
    }

    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings/new");
  }
};

// Edit Listing Form
module.exports.editListingForm = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }

    const originalImageUrl = listing.image?.url || "/images/default.jpg";

    if (listing.location && (!listing.latitude || !listing.longitude)) {
      const geoURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(listing.location)}`;
      const response = await axios.get(geoURL, {
        headers: {
          "User-Agent": "wanderlust-app/1.0 (https://wanderlust-homestay.vercel.app/)",
        },
      });

      if (response.data?.length > 0) {
        listing.latitude = parseFloat(response.data[0].lat);
        listing.longitude = parseFloat(response.data[0].lon);
        await listing.save();
      }
    }

    res.render("listing/edit", { listing, originalImageUrl });
  } catch (error) {
    console.error("Error loading edit form:", error);
    req.flash("error", "Failed to load edit form.");
    res.redirect("/listings");
  }
};

// Update Listing
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      new: true,
    });

    if (req.file) {
      listing.image = { filename: req.file.filename, url: req.file.path };
    }

    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (error) {
    console.error("Error updating listing:", error);
    req.flash("error", "Failed to update listing.");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

// Delete Listing
module.exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error deleting listing:", error);
    req.flash("error", "Failed to delete listing.");
    res.redirect("/listings");
  }
};
