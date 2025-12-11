const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// ADMIN LOGIN
router.post("/admin-login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check empty
    if (!username || !password) {
      return res.json({ success: false, message: "All fields required" });
    }

    // Check default admin
    if (username === "admin" && password === "admin123") {
      return res.json({ success: true, message: "Admin login successful" });
    }

    // Optionally check DB admin records
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    if (admin.password !== password) {
      return res.json({ success: false, message: "Invalid password" });
    }

    // Success
    res.json({ success: true, message: "Admin login successful" });

  } catch (error) {
    res.json({ success: false, message: "Error logging in admin" });
  }
});

module.exports = router;
