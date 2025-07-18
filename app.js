const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const port = 8080;
const expressError = require("./utils/expressError");
const listingRouter = require("./router/listingRouter.js");
const reviewRouter = require("./router/reviewRouter.js");
const userRouter = require("./router/userRouter.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const homeRouter = require("./router/homeRouter.js");

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
  console.log(process.env);
}
// Set up EJS
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const sessionOption = {
  secret: "mySecretKey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
connectDB();

app.use(session(sessionOption));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;

  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

app.use("/", homeRouter);

// Listing
app.use("/listings", listingRouter);
// Reviews
app.use("/listings/:id/reviews", reviewRouter);
// User
app.use("/", userRouter);

// Catch-all route for undefined routes
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listing/error", { err });
});

module.exports=app;
