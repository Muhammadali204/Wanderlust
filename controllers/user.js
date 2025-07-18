const User = require("../models/user");

// Signup Form
module.exports.signupForm = (req, res) => {
  res.render("user/signup.ejs");
};

// Signup User Route
module.exports.signupRoute = async (req, res, next) => {
  try {
    let { email, username, password } = req.body;
    let newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password); // Fixed await
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// Login Form
module.exports.loginForm = (req, res) => {
  res.render("user/login.ejs");
};

// Login Route
module.exports.loginRoute = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings"; // Fixed double redirect
  res.redirect(redirectUrl);
};

//   Logout Route
module.exports.logoutRoute = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.redirectUrl = null; // Clear session redirect
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
