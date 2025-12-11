const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/voting");
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("DB Connection Failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
