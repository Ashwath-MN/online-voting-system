const express = require("express");
const router = express.Router();

const User = require("../models/User");

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Check empty fields
    if (!name || !password) {
      return res.json({ success: false, message: "All fields required" });
    }

    // Check user exists
    const exists = await User.findOne({ name });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Create user
    await User.create({ name, password });

    res.json({ success: true, message: "User registered successfully" });

  } catch (error) {
    res.json({ success: false, message: "Error registering user" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Check empty fields
    if (!name || !password) {
      return res.json({ success: false, message: "All fields required" });
    }

    // Find user
    const user = await User.findOne({ name });

    // If no user found
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check password
    if (user.password !== password) {
      return res.json({ success: false, message: "Wrong password" });
    }

    // Success
    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        hasVoted: user.hasVoted
      }
    });

  } catch (error) {
    res.json({ success: false, message: "Error logging in" });
  }
});

module.exports = router;
