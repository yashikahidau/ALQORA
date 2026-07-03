const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ======================================
// UPLOAD PRODUCT IMAGE
// ======================================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      res.status(200).json({
        success: true,
        imageUrl: req.file.path,
      });
    } catch (error) {
      console.error("UPLOAD IMAGE ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Image upload failed",
      });
    }
  }
);

module.exports = router;