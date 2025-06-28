const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songs: [
      {
        song: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Song",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalDuration: {
      type: Number,
      default: 0,
    },
    songCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Update song count and total duration when songs are added/removed
playlistSchema.pre("save", function (next) {
  this.songCount = this.songs.length;
  this.totalDuration = this.songs.reduce((total, songItem) => {
    return total + (songItem.song.duration || 0);
  }, 0);
  next();
});

// Virtual for formatted total duration
playlistSchema.virtual("formattedTotalDuration").get(function () {
  const minutes = Math.floor(this.totalDuration / 60);
  const seconds = this.totalDuration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

// Ensure virtual fields are serialized
playlistSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Playlist", playlistSchema);
