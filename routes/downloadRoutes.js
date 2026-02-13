const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");

// ===================
// SECURITY CHECK
// ===================
function isSafe(filename) {
  return !filename.includes("..");
}

// ===================
// VIEW NOTES (PDF in browser)
// ===================
router.get("/view/notes/:semester/:filename", isAuthenticated, (req, res) => {
  const { semester, filename } = req.params;
  if (!isSafe(filename)) return res.status(400).send("Invalid file");

  const filePath = path.join(
    __dirname,
    "../uploads/notes",
    semester,
    filename
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("PDF not found");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline");

  fs.createReadStream(filePath).pipe(res);
});

// ===================
// VIEW ASSIGNMENTS
// ===================
router.get("/view/assignments/:semester/:filename", isAuthenticated, (req, res) => {
  const { semester, filename } = req.params;
  if (!isSafe(filename)) return res.status(400).send("Invalid file");

  const filePath = path.join(
    __dirname,
    "../uploads/assignments",
    semester,
    filename
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("PDF not found");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline");

  fs.createReadStream(filePath).pipe(res);
});

// ===================
// DOWNLOAD NOTES
// ===================
router.get("/download/notes/:semester/:filename", isAuthenticated, (req, res) => {
  const { semester, filename } = req.params;
  if (!isSafe(filename)) return res.status(400).send("Invalid file");

  const filePath = path.join(
    __dirname,
    "../uploads/notes",
    semester,
    filename
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.download(filePath);
});

// ===================
// DOWNLOAD ASSIGNMENTS
// ===================
router.get("/download/assignments/:semester/:filename", isAuthenticated, (req, res) => {
  const { semester, filename } = req.params;
  if (!isSafe(filename)) return res.status(400).send("Invalid file");

  const filePath = path.join(
    __dirname,
    "../uploads/assignments",
    semester,
    filename
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.download(filePath);
});

module.exports = router;
