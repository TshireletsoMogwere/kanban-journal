require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // your React frontend
  credentials: true
}));

app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
