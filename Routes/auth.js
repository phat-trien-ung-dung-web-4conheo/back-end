const router = require("express").Router();
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { registerValidation, loginValidation } = require("../validation");

//REGISTER ROUTE
router.post("/register", async (req, res) => {
  // LETS VALIDATE THE DATA BEFORE WE A USER
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //Checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //HASH PASSWORDS
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    age: req.body.age,
    address: req.body.address,
    phoneNumb: req.body.phoneNumb,
  });
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

//LOGIN ROUTE
router.post("/login", async (req, res) => {
  // LETS VALIDATE THE DATA BEFORE WE A USER
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //Checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send("Email is not found");
  //PASSWORD IS CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(401).send("Invalid password");

  //CREATE AND ASSIGN A TOKEN
  try {
    const accessToken = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.TOKEN_SECRET,
      { expiresIn: "6h" }
    );
    const { password, ...others } = user._doc;
    res
      .status(200)
      .header("auth-token", accessToken)
      .send({ ...others, accessToken });
  } catch (error) {
    res.status(500).send(error);
  }
});

//LOGOUT ROUTE
router.post("/logout", async (req, res) => {
  const accessToken = req.headers.token;
  console.log(accessToken);
  // res.status(200).send("Logged out", accessToken);
});

module.exports = router;
