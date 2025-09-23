const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const convertRouter = require("./routes/convert");

const app = express();

// Enable CORS so frontend can call backend
app.use(cors());

// Ensure uploads/ and converted/ directories exist
const uploadDir = path.join(__dirname, "uploads");
const convertedDir = path.join(__dirname, "converted");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(convertedDir)) fs.mkdirSync(convertedDir);

// Use multer middleware for file uploads on /api/convert
app.use("/api/convert", convertRouter);

// Serve converted files statically
app.use("/converted", express.static(convertedDir));

// Optional JSON parser for other API endpoints
app.use(express.json());

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access API at http://localhost:${PORT}/api/convert`);
});
