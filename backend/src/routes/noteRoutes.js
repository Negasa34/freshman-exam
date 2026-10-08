const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getNotesByCourse,
  getNoteById,
  createNote,
} = require("../controllers/noteController");

const router = express.Router();

router.get("/course/:courseId", getNotesByCourse);
router.get("/:id", getNoteById);
router.post(
  "/course/:courseId",
  authMiddleware,
  adminMiddleware,
  createNote
);

module.exports = router;