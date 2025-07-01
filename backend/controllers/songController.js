const Song = require("../models/Song");
const fs = require("fs");
const path = require("path");

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
const getAllSongs = async (req, res) => {
  try {
    const { search, genre, artist, page = 1, limit = 20 } = req.query;

    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by genre
    if (genre) {
      query.genre = { $regex: genre, $options: "i" };
    }

    // Filter by artist
    if (artist) {
      query.artist = { $regex: artist, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const songs = await Song.find(query)
      .populate("uploadedBy", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Song.countDocuments(query);

    res.json({
      songs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error("Get songs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get song by ID
// @route   GET /api/songs/:id
// @access  Public
const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate(
      "uploadedBy",
      "username"
    );

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.json(song);
  } catch (error) {
    console.error("Get song error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add new song
// @route   POST /api/songs
// @access  Private (Admin)
const addSong = async (req, res) => {
  try {
    console.log("addSong called");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const { title, artist, album, genre, duration, releaseYear } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    const song = new Song({
      title,
      artist,
      album,
      genre,
      duration: parseInt(duration),
      releaseYear: releaseYear
        ? parseInt(releaseYear)
        : new Date().getFullYear(),
      filePath: req.file.path,
      uploadedBy: req.user._id,
    });

    const savedSong = await song.save();
    const populatedSong = await Song.findById(savedSong._id).populate(
      "uploadedBy",
      "username"
    );

    res.status(201).json(populatedSong);
  } catch (error) {
    console.error("Add song error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update song
// @route   PUT /api/songs/:id
// @access  Private (Admin)
const updateSong = async (req, res) => {
  try {
    const { title, artist, album, genre, duration, releaseYear } = req.body;

    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    song.title = title || song.title;
    song.artist = artist || song.artist;
    song.album = album || song.album;
    song.genre = genre || song.genre;
    song.duration = duration ? parseInt(duration) : song.duration;
    song.releaseYear = releaseYear ? parseInt(releaseYear) : song.releaseYear;

    const updatedSong = await song.save();
    const populatedSong = await Song.findById(updatedSong._id).populate(
      "uploadedBy",
      "username"
    );

    res.json(populatedSong);
  } catch (error) {
    console.error("Update song error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete song
// @route   DELETE /api/songs/:id
// @access  Private (Admin)
const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // No need to delete the audio file from local storage since it's on Cloudinary
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error("Delete song error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Increment play count
// @route   POST /api/songs/:id/play
// @access  Public
const incrementPlayCount = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    song.playCount += 1;
    await song.save();

    res.json({ playCount: song.playCount });
  } catch (error) {
    console.error("Increment play count error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllSongs,
  getSongById,
  addSong,
  updateSong,
  deleteSong,
  incrementPlayCount,
};
