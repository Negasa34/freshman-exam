
const express = require("express");

const {
  getUniversities,
  getUniversityById,
} = require("../controllers/universityController");

const router = express.Router();

router.get("/", getUniversities);
router.get("/:id", getUniversityById);

module.exports = router;
