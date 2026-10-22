
const express = require("express");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const uploadPdf = require("../middleware/uploadMiddleware");

const {
  getModulesByCourse,
  getModuleById,
  createModule,
} = require("../controllers/moduleMaterialController");

const router = express.Router();

router.get("/course/:courseId", getModulesByCourse);
router.get("/:id", getModuleById);

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

    req.body.fileUrl = `/uploads/modules/${path.basename(req.file.path)}`;
    next();
  },
  createModule
);

module.exports = router;
