const express = require("express");
const router = express.Router();
const {
  getAllSongs,
  getSongById,
  addSong,
  updateSong,
  deleteSong,
  incrementPlayCount,
} = require("../controllers/songController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { uploadAudio } = require("../middleware/upload");

// Public routes
router.get("/", getAllSongs);
router.get("/:id", getSongById);
router.post("/:id/play", incrementPlayCount);

// Admin routes
router.post("/", auth, admin, uploadAudio.single("audio"), addSong);
router.put("/:id", auth, admin, updateSong);
router.delete("/:id", auth, admin, deleteSong);

module.exports = router;
