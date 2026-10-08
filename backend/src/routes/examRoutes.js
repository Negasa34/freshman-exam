const adminMiddleware = require("../middleware/adminMiddleware");
const express = require("express");

const {
  getExamsByCourse,
  getExamById,
  createExam,
} = require("../controllers/examController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/course/:courseId", getExamsByCourse);

router.get("/:id", authMiddleware, getExamById);

router.post(
  "/course/:courseId",
  authMiddleware,
  adminMiddleware,
  createExam
);

module.exports = router;