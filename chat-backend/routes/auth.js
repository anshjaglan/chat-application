// backend/routes/auth.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json("User already exists");

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPass });

    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json("Registration failed");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json("User not found");

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json("Wrong password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json("Login failed");
  }
});

module.exports = router;
