require("dotenv").config();
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const app = express();

// Set Template Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Database Connection
const { connectMongoose } = require("./app/database/db");
connectMongoose();

// Google Authentication Connection
app.use(
  session({
    secret: "Abhay",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
  })
);

// Passport Config
const passportInit = require("./app/passport/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Assets
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
require("./routes/web")(app);

// Port Start
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
