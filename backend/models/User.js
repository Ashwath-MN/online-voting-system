const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  hasVoted: {
    type: Boolean,
    default: false
  },

  votedFor: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("User", userSchema);
