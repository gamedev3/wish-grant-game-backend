const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cors({
  origin: "https://wonderful-jalebi-bb7636.netlify.app"  // Replace with your actual Netlify URL
}));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Create a schema for storing wishes
const wishSchema = new mongoose.Schema({
  yourName: String,
  loverName: String,
  message: String
});

const Wish = mongoose.model("Wish", wishSchema);

// POST route to save wish
app.post("/api/save-wish", async (req, res) => {
  const { yourName, loverName, message } = req.body;

  console.log("Received data:", req.body);  // Debug log

  if (!yourName || !loverName || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newWish = new Wish({ yourName, loverName, message });
    await newWish.save();
    res.status(201).json({ message: "Wish granted!" });
  } catch (error) {
    console.error("Save error:", error); // Log the error if any
    res.status(500).json({ error: "Failed to save wish." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
