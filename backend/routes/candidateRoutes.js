const express = require("express");
const router = express.Router();

const Candidate = require("../models/Candidate");
const User = require("../models/User");

// Add Candidate (Admin side)
router.post("/add-candidate", async (req, res) => {
  try {
    const { name, logo } = req.body;

    if (!name || !logo) {
      return res.json({ success: false, message: "All fields required" });
    }

    await Candidate.create({ name, logo });

    res.json({ success: true, message: "Candidate added successfully" });

  } catch (error) {
    res.json({ success: false, message: "Error adding candidate" });
  }
});

// Get all candidates (User side)
router.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json({ success: true, data: candidates });
  } catch (error) {
    res.json({ success: false, message: "Error fetching candidates" });
  }
});

// Cast Vote (User side)
router.post("/vote", async (req, res) => {
  try {
    const { userId, candidateId } = req.body;

    if (!userId || !candidateId) {
      return res.json({ success: false, message: "Missing fields" });
    }

    // Get user
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if already voted
    if (user.hasVoted) {
      return res.json({ success: false, message: "You already voted" });
    }

    // Check candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.json({ success: false, message: "Candidate not found" });
    }

    // Update candidate votes
    candidate.votes = candidate.votes + 1;
    await candidate.save();

    // Mark user as voted and store candidate
    user.hasVoted = true;
    user.votedCandidateId = candidateId;
    await user.save();

    res.json({ success: true, message: "Vote recorded successfully" });

  } catch (error) {
    res.json({ success: false, message: "Error casting vote" });
  }
});

// Check My Vote (User side)
router.post("/my-vote", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID required" });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // If user has not voted
    if (!user.hasVoted || !user.votedCandidateId) {
      return res.json({ success: false, message: "You have not voted yet" });
    }

    // Find the candidate the user voted for
    const candidate = await Candidate.findById(user.votedCandidateId);

    if (!candidate) {
      return res.json({ success: false, message: "Voted candidate not found" });
    }

    // Return candidate info
    res.json({
      success: true,
      message: "You have voted for this candidate",
      candidate: {
        id: candidate._id,
        name: candidate.name,
        logo: candidate.logo,
        votes: candidate.votes
      }
    });

  } catch (error) {
    res.json({ success: false, message: "Error checking your vote" });
  }
});

module.exports = router;
