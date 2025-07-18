const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("listing/home"); // Ensure views/listing/home.ejs exists
});

module.exports = router;