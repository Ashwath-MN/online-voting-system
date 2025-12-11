const express = require("express");
const router = express.Router();
const Voting = require("../models/Voting");

// ============================
// 1. ADD NEW VOTING TITLE
// ============================

router.post("/add-voting-title", async (req, res) => {
  try {
    let { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    title = title.trim();

    const exists = await Voting.findOne({ title });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "This voting title already exists"
      });
    }

    await Voting.create({ title });

    res.status(201).json({
      success: true,
      message: "Voting title added successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while adding voting title"
    });
  }
});

// ============================
// 2. GET ALL VOTING TITLES
// ============================

router.get("/voting-titles", async (req, res) => {
  try {
    const titles = await Voting.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: titles.length,
      data: titles
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching titles"
    });
  }
});

// ============================
// 3. DELETE VOTING TITLE
// ============================

router.delete("/delete-voting-title/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Voting.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Title not found"
      });
    }

    res.json({
      success: true,
      message: "Voting title deleted successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting title"
    });
  }
});

// ============================
// 4. START VOTING
// ============================

router.put("/start-voting/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // stop all existing voting first
    await Voting.updateMany({}, { isActive: false });

    const updated = await Voting.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Title not found"
      });
    }

    res.json({
      success: true,
      message: "Voting started successfully",
      data: updated
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while starting voting"
    });
  }
});

// ============================
// 5. END VOTING
// ============================

router.put("/end-voting/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Voting.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Title not found"
      });
    }

    res.json({
      success: true,
      message: "Voting ended successfully",
      data: updated
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while ending voting"
    });
  }
});

module.exports = router;
