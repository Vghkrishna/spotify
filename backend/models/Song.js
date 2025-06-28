const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    album: {
      type: String,
      trim: true,
      default: "Unknown Album",
    },
    genre: {
      type: String,
      trim: true,
      default: "Unknown Genre",
    },
    duration: {
      type: Number,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    releaseYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    playCount: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
songSchema.index({ title: "text", artist: "text", album: "text" });

// Virtual for formatted duration
songSchema.virtual("formattedDuration").get(function () {
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

// Ensure virtual fields are serialized
songSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Song", songSchema);
