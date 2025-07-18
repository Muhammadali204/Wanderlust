const mongoose = require("mongoose");
const Review = require("./review");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String, // User-provided location (e.g., "New York")
  country: String,
  category: {
    type: String,
    enum: ["Home", "Beach", "City", "Mountains", "Forest", "Winter", "Hotel"],
  },
  latitude: Number, // 🌍 Stores latitude
  longitude: Number, // 🌍 Stores longitude
  image: {
    filename: String,
    url: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// 🗑️ Middleware: Delete reviews when listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
