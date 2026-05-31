const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../../middlewares/auth.middleware");
const {
  getProfileController,
  updateProfileController,
  updatePhotoController,
} = require("./profile.controller");

// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/:id", authMiddleware, getProfileController);
router.put("/:id", authMiddleware, updateProfileController);
router.post(
  "/:id/photo",
  authMiddleware,
  upload.single("photo"),
  updatePhotoController,
);

module.exports = router;
