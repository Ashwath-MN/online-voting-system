const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "secretkey"; // change later if needed

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check user exists
    const exist = await User.findOne({ username });
    if (exist) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    await User.create({ username, password: hashed });

    return res.json({ success: true, message: "User Registered Successfully" });

  } catch (err) {
    console.log("Register Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // find user
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid Username" });

    // check password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ success: false, message: "Invalid Password" });

    // create token
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      data: {
        username: user.username,
        hasVoted: user.hasVoted
      }
    });

  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
