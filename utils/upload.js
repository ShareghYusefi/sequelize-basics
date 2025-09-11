const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, filePath(file));
  },
});

const upload = multer({ storage: storage });

function filePath(file) {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filePath =
    file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1];
  return filePath;
}

module.exports = { upload, filePath };
