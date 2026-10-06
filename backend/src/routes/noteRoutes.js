const express = require("express");

const {
  getNotesByCourse,
  getNoteById,
  createNote,
} = require("../controllers/noteController");

const router = express.Router();

router.get("/course/:courseId", getNotesByCourse);
router.get("/:id", getNoteById);
router.post("/course/:courseId", createNote);

module.exports = router;