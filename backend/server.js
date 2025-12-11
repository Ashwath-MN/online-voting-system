const express = require("express");
const cors = require("cors");

// DB
const connectDB = require("./db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const votingRoutes = require("./routes/votingRoutes");

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/vote", votingRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Online Voting System Backend Running");
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
