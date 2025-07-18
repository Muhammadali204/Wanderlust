const express = require("express");
const router = express.Router();
const passport = require("passport");
const { savedRedirectedUrl } = require("../middleware");
const userController = require("../controllers/user");

// ===========================
// Signup Routes
// ===========================
router
  .route("/signup")
  // Show signup form
  .get(userController.signupForm)
  // Handle signup logic
  .post(userController.signupRoute);

// ===========================
// Login Routes
// ===========================
router
  .route("/login")
  // Show login form
  .get(userController.loginForm)
  // Handle login logic
  .post(
    savedRedirectedUrl, // Middleware to store where the user was going before login
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginRoute
  );

// ===========================
// Logout Route
// ===========================
router.get("/logout", userController.logoutRoute);

module.exports = router;
