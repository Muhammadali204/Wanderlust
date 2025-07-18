const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, // ✅ Corrected Type
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
