const mongoose = require("mongoose");

const VotingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isActive: { type: Boolean, default: false }
});

module.exports = mongoose.model("Voting", VotingSchema);
