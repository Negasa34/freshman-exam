
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

console.log(
  "JWT_SECRET loaded:",
  Boolean(process.env.JWT_SECRET)
);

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const noteRoutes = require("./routes/noteRoutes");
const examRoutes = require("./routes/examRoutes");
const universityRoutes = require("./routes/universityRoutes");
const moduleMaterialRoutes = require("./routes/moduleMaterialRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve free PDF files
app.use(
  "/uploads/modules",
  express.static(path.join(__dirname, "../uploads/modules"))
);

app.use(
  "/uploads/notes",
  express.static(path.join(__dirname, "../uploads/notes"))
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/modules", moduleMaterialRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Freshman API is running",
  });
});

// Protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route!",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
