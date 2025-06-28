const express = require("express");
const router = express.Router();
const {
  getUserPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} = require("../controllers/playlistController");
const auth = require("../middleware/auth");

// All playlist routes require authentication
router.use(auth);

router.get("/", getUserPlaylists);
router.get("/:id", getPlaylistById);
router.post("/", createPlaylist);
router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);
router.post("/:id/songs", addSongToPlaylist);
router.delete("/:id/songs/:songId", removeSongFromPlaylist);

module.exports = router;
