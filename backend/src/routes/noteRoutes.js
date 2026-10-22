
const express = require("express");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const uploadPdf = require("../middleware/uploadMiddleware");

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
  uploadPdf.single("pdf"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file",
      });
    }

    req.body.fileUrl = `/uploads/notes/${path.basename(req.file.path)}`;
    next();
  },
  createNote
);

module.exports = router;
