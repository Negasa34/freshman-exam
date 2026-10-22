
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadRoot = path.join(__dirname, "../../uploads");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let folder;

    if (req.baseUrl === "/api/modules") {
      folder = "modules";
    } else if (req.baseUrl === "/api/notes") {
      folder = "notes";
    } else if (req.baseUrl === "/api/exams") {
      folder =
        req.body.type === "FINAL" ? "exams/final" : "exams/mid";
    } else {
      return callback(new Error("Unsupported upload route"));
    }

    const destination = path.join(uploadRoot, folder);

    fs.mkdir(destination, { recursive: true }, (error) => {
      if (error) {
        return callback(error);
      }

      callback(null, destination);
    });
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    callback(null, safeName);
  },
});

function pdfOnly(req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension !== ".pdf" || file.mimetype !== "application/pdf") {
    return callback(new Error("Only PDF files are allowed"));
  }

  callback(null, true);
}

const uploadPdf = multer({
  storage,
  fileFilter: pdfOnly,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 1,
  },
});

module.exports = uploadPdf;
