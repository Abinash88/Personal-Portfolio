require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
require("../maincode/auth");
const ejs = require("ejs");
const path = require("path");
const  SendMail = require("./Email");

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


app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);


app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect:'/',
  failureRedirect:'/auth/google/failure',
}))

app.get("/", (req, res) => {
  if (!req.user) {
    res.redirect("/auth/google");
  } else {
    res.render("Portfolio", { user:req.user });
  }
});

app.get("/auth/google/failure", (req, res) => {
  res.render("Failure.ejs");
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle any error that occurred during logout
      console.error(err);
    }
    // Redirect the user to the home page or any other desired location
    res.redirect('/');
  });
});


app.get('/PortfolioShow', (req, res) => {
  if (!req.user) {
    res.redirect("/auth/google");
  } else {
    res.render("PortfolioShow", { user:req.user });
  }
})


app.post('/SendMessage', (req, res) => {
  if(req.method !== 'POST') return res.status(400).send({success:false, message:' Post method only allowed'})
  const {firstName, lastName, email, number, subject, message} = req.body;
  
  console.log(firstName + ' ' + lastName + ' ' + email + ' ' + subject + ' ' + message);
  if(!firstName || !lastName || !email || !subject || !message || !number) return res.status(401).send({success:false, message:'Please fill in all fields'});
  console.log(firstName, email)
  try{
      SendMail(firstName, lastName, email, subject, message, number);
  }catch(err) {
      console.log(err.message)
  }

  res.status(200).redirect('/');
})

