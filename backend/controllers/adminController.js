const User = require("../models/User");
const Song = require("../models/Song");
const Playlist = require("../models/Playlist");

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    // Delete user's playlists
    await Playlist.deleteMany({ createdBy: user._id });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Toggle user admin status (admin only)
// @route   PUT /api/admin/users/:id/toggle-admin
// @access  Private (Admin)
const toggleUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from removing their own admin status
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot modify your own admin status" });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({
      message: `User ${
        user.isAdmin ? "promoted to" : "removed from"
      } admin successfully`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Toggle admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSongs = await Song.countDocuments();
    const totalPlaylists = await Playlist.countDocuments();

    // Get recent users
    const recentUsers = await User.find()
      .select("username email createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent songs
    const recentSongs = await Song.find()
      .populate("uploadedBy", "username")
      .select("title artist uploadedBy createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get most played songs
    const topSongs = await Song.find()
      .select("title artist playCount")
      .sort({ playCount: -1 })
      .limit(10);

    res.json({
      stats: {
        totalUsers,
        totalSongs,
        totalPlaylists,
      },
      recentUsers,
      recentSongs,
      topSongs,
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  toggleUserAdmin,
  getAdminStats,
};
