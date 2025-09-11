const express = require("express");
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { upload, filePath } = require("../utils/upload");

const router = express.Router();

// Upload a file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { resource_id } = req.body;
    if (!req.file || !resource_id) {
      return res
        .status(400)
        .json({ error: "File and resource_id are required." });
    }

    const newFile = await File.create({
      resource_id,
      name: req.file.originalname,
      path: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    });

    res.status(201).json(newFile);
  } catch (err) {
    res.status(500).json({ error: "Failed to upload file." });
  }
});

// Get all files
router.get("/files", async (req, res) => {
  try {
    const files = await File.findAll();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve files." });
  }
});

// Get a file by id
router.get("/files/:id", async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve file." });
  }
});

module.exports = router;
