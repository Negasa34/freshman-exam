const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getCourses,
  getCourseById,
  createCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCourse
);

module.exports = router;