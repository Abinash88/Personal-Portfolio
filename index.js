require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
require("../maincode/auth");
const ejs = require("ejs");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// setup session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// initialize passport
app.use(passport.initialize());

// use passport to deal with session
app.use(passport.session());

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("database connected"))
  .catch((err) => console.error(err));

app.listen(process.env.PORT, () =>
  console.log("Server listening on port:", process.env.PORT)
);

app.get("/", (req, res) => {
  const user = {
    user:null
  }
  res.render("Portfolio",{user});
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// app.get("/auth/google/callback", (req, res, next) => {
//   passport.authenticate("google", (err, user) => {
//     if (err) {
//       // Handle error if authentication fails
//       return next(err);
//     }

//     if (!user) {
//       return res.redirect("/auth/google/failure");
//     }
   
//     return res.redirect(req.session.returnTo || "/");
//   })(req, res, next);
// });

app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect:'/success',
  failureRedirect:'/auth/google/failure',
}))

app.get("/success", (req, res) => {
  console.log(req.user.picture,'users'); 
  const user = {
    picture:req.user.picture
  } 
  if (!req.user) {
    res.redirect("/auth/google");
  } else {
    res.render("Portfolio", { user });
  }
});

app.get("/auth/google/failure", (req, res) => {
  res.render("Failure.ejs");
});


app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});
