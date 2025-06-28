const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

// @desc    Get user playlists
// @route   GET /api/playlists
// @access  Private
const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ createdBy: req.user._id })
      .populate("songs.song")
      .sort({ updatedAt: -1 });

    res.json(playlists);
  } catch (error) {
    console.error("Get playlists error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get playlist by ID
// @route   GET /api/playlists/:id
// @access  Private
const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate("songs.song")
      .populate("createdBy", "username");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Check if user can access this playlist
    if (
      !playlist.isPublic &&
      playlist.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(playlist);
  } catch (error) {
    console.error("Get playlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const playlist = new Playlist({
      name,
      description,
      isPublic: isPublic !== undefined ? isPublic : true,
      createdBy: req.user._id,
    });

    const savedPlaylist = await playlist.save();
    const populatedPlaylist = await Playlist.findById(savedPlaylist._id)
      .populate("songs.song")
      .populate("createdBy", "username");

    res.status(201).json(populatedPlaylist);
  } catch (error) {
    console.error("Create playlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Private
const updatePlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Check if user owns this playlist
    if (playlist.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    playlist.name = name || playlist.name;
    playlist.description =
      description !== undefined ? description : playlist.description;
    playlist.isPublic = isPublic !== undefined ? isPublic : playlist.isPublic;

    const updatedPlaylist = await playlist.save();
    const populatedPlaylist = await Playlist.findById(updatedPlaylist._id)
      .populate("songs.song")
      .populate("createdBy", "username");

    res.json(populatedPlaylist);
  } catch (error) {
    console.error("Update playlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private
const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Check if user owns this playlist
    if (playlist.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Delete playlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add song to playlist
// @route   POST /api/playlists/:id/songs
// @access  Private
const addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Check if user owns this playlist
    if (playlist.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Check if song is already in playlist
    const songExists = playlist.songs.find((s) => s.song.toString() === songId);
    if (songExists) {
      return res.status(400).json({ message: "Song already in playlist" });
    }

    playlist.songs.push({ song: songId });
    const updatedPlaylist = await playlist.save();
    const populatedPlaylist = await Playlist.findById(updatedPlaylist._id)
      .populate("songs.song")
      .populate("createdBy", "username");

    res.json(populatedPlaylist);
  } catch (error) {
    console.error("Add song to playlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private
const removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Check if user owns this playlist
    if (playlist.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    playlist.songs = playlist.songs.filter(
      (s) => s.song.toString() !== req.params.songId
    );
    const updatedPlaylist = await playlist.save();
    const populatedPlaylist = await Playlist.findById(updatedPlaylist._id)
      .populate("songs.song")
      .populate("createdBy", "username");

    res.json(populatedPlaylist);
  } catch (error) {
    console.error("Remove song from playlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
};
