import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllSongsForAdmin,
  addSong,
  updateSong,
  deleteSong,
} from "../store/slices/songSlice";

const AdminSongManagement = () => {
  const dispatch = useDispatch();
  const { songs, isLoading, isLoaded } = useSelector((state) => state.songs);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    duration: "",
    audioFile: null,
  });

  useEffect(() => {
    if (!isLoaded) {
      dispatch(getAllSongsForAdmin());
    }
  }, [dispatch, isLoaded]);

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      audioFile: e.target.files[0],
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("artist", formData.artist);
    formDataToSend.append("album", formData.album);
    formDataToSend.append("genre", formData.genre);
    formDataToSend.append("duration", formData.duration);
    if (formData.audioFile) {
      formDataToSend.append("audio", formData.audioFile);
    }

    if (editingSong) {
      await dispatch(
        updateSong({ id: editingSong._id, songData: formDataToSend })
      );
      setEditingSong(null);
    } else {
      await dispatch(addSong(formDataToSend));
    }

    setFormData({
      title: "",
      artist: "",
      album: "",
      genre: "",
      duration: "",
      audioFile: null,
    });
    setShowAddForm(false);
  };

  const handleEdit = (song) => {
    setEditingSong(song);
    setFormData({
      title: song.title,
      artist: song.artist,
      album: song.album,
      genre: song.genre,
      duration: song.duration,
      audioFile: null,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (songId) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      await dispatch(deleteSong(songId));
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingSong(null);
    setFormData({
      title: "",
      artist: "",
      album: "",
      genre: "",
      duration: "",
      audioFile: null,
    });
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.album.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPlays = songs.reduce(
    (acc, song) => acc + (song.playCount || 0),
    0
  );
  const totalMinutes =
    songs.length > 0
      ? Math.floor(songs.reduce((acc, song) => acc + song.duration, 0) / 60)
      : 0;
  const uniqueGenres = new Set(songs.map((song) => song.genre).filter(Boolean))
    .size;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-spotify-green border-t-transparent rounded-full animate-spin-slow mb-6"></div>
          <p className="text-white text-lg">Loading your music library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 w-full">
        {/* Enhanced Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-spotify-green to-green-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl animate-float">
              <span className="text-2xl sm:text-3xl">🎧</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-spotify-green to-green-400 bg-clip-text text-transparent mb-2">
                Song Management
              </h1>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
                Manage and organize your music library
              </p>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                    {songs.length}
                  </div>
                  <div className="text-blue-300 text-xs sm:text-sm font-medium">
                    Total Songs
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <span className="text-sm sm:text-lg lg:text-2xl">🎧</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                    {totalPlays}
                  </div>
                  <div className="text-purple-300 text-xs sm:text-sm font-medium">
                    Total Plays
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <span className="text-sm sm:text-lg lg:text-2xl">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                    {totalMinutes}
                  </div>
                  <div className="text-green-300 text-xs sm:text-sm font-medium">
                    Minutes
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <span className="text-sm sm:text-lg lg:text-2xl">⏱️</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                    {uniqueGenres}
                  </div>
                  <div className="text-orange-300 text-xs sm:text-sm font-medium">
                    Genres
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <span className="text-sm sm:text-lg lg:text-2xl">🎼</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Controls */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-base sm:text-lg">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search songs by title, artist, album, or genre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base lg:text-lg"
                />
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-800/50 rounded-lg sm:rounded-xl p-1 border border-gray-700/50">
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-md sm:rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                    viewMode === "table"
                      ? "bg-spotify-green text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  📋 Table
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-md sm:rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                    viewMode === "grid"
                      ? "bg-spotify-green text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  🎴 Grid
                </button>
              </div>

              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-spotify-green to-green-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:from-green-500 hover:to-spotify-green hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span className="text-lg sm:text-xl">➕</span>
                <span className="hidden sm:inline">Add New Song</span>
                <span className="sm:hidden">Add Song</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Add/Edit Song Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-spotify-green to-green-400 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <span className="text-xl sm:text-2xl">🎧</span>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                        {editingSong ? "Edit Song" : "Add New Song"}
                      </h3>
                      <p className="text-gray-400 text-sm sm:text-base">
                        {editingSong
                          ? "Update song information"
                          : "Add a new song to your library"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={cancelForm}
                    className="text-gray-400 hover:text-white text-2xl sm:text-3xl transition-colors ml-2"
                  >
                    ×
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 sm:space-y-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-white font-semibold text-sm sm:text-base lg:text-lg">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base lg:text-lg"
                        placeholder="Enter song title"
                        required
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-white font-semibold text-sm sm:text-base lg:text-lg">
                        Artist *
                      </label>
                      <input
                        type="text"
                        name="artist"
                        value={formData.artist}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base lg:text-lg"
                        placeholder="Enter artist name"
                        required
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-white font-semibold text-sm sm:text-base lg:text-lg">
                        Album
                      </label>
                      <input
                        type="text"
                        name="album"
                        value={formData.album}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base lg:text-lg"
                        placeholder="Enter album name"
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-white font-semibold text-sm sm:text-base lg:text-lg">
                        Genre
                      </label>
                      <input
                        type="text"
                        name="genre"
                        value={formData.genre}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base lg:text-lg"
                        placeholder="Enter genre"
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-white font-semibold text-sm sm:text-base lg:text-lg">
                        Duration (seconds) *
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base lg:text-lg"
                        placeholder="Enter duration in seconds"
                        required
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-white font-semibold text-sm sm:text-base lg:text-lg">
                        Audio File {!editingSong && "*"}
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleFileChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 backdrop-blur-sm transition-all duration-300 file:mr-2 sm:file:mr-4 file:py-2 sm:file:py-3 file:px-4 sm:file:px-6 file:rounded-md sm:file:rounded-lg file:border-0 file:text-xs sm:file:text-sm lg:file:text-base file:font-semibold file:bg-spotify-green file:text-white hover:file:bg-green-500 file:transition-all file:duration-300"
                          required={!editingSong}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="flex-1 py-3 sm:py-4 px-4 sm:px-6 bg-gray-700 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base lg:text-lg hover:bg-gray-600 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-spotify-green to-green-500 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base lg:text-lg hover:from-green-500 hover:to-spotify-green transition-all duration-300"
                    >
                      {editingSong ? "Update Song" : "Add Song"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Songs Display */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden w-full">
          <div className="p-4 sm:p-6 border-b border-gray-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Music Library
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  {filteredSongs.length} song
                  {filteredSongs.length !== 1 ? "s" : ""} found
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-xs sm:text-sm">View:</span>
                <span className="text-spotify-green font-medium capitalize text-sm sm:text-base">
                  {viewMode}
                </span>
              </div>
            </div>
          </div>

          {filteredSongs.length === 0 ? (
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <span className="text-3xl sm:text-4xl lg:text-6xl">🎧</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                {searchTerm ? "No Songs Found" : "Your Library is Empty"}
              </h3>
              <p className="text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base lg:text-lg px-4">
                {searchTerm
                  ? "Try adjusting your search terms or add new songs to the library."
                  : "Start building your music library by adding some amazing songs."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-spotify-green to-green-500 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base lg:text-lg hover:from-green-500 hover:to-spotify-green hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Add Your First Song
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="p-2 sm:p-3 lg:p-6">
              <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-6">
                {filteredSongs.map((song) => (
                  <div
                    key={song._id}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group min-w-0"
                  >
                    <div className="w-full h-16 sm:h-20 lg:h-32 bg-gradient-to-br from-spotify-green/20 to-green-500/20 rounded-md sm:rounded-lg lg:rounded-xl mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                      <span className="text-xl sm:text-2xl lg:text-4xl">
                        🎧
                      </span>
                    </div>

                    <h3 className="text-white font-semibold text-xs sm:text-sm lg:text-lg mb-1 sm:mb-2 truncate">
                      {song.title}
                    </h3>

                    <p className="text-gray-400 mb-1 sm:mb-2 lg:mb-3 text-xs sm:text-sm lg:text-base truncate">
                      {song.artist}
                    </p>

                    {song.album && (
                      <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2 lg:mb-3 truncate">
                        Album: {song.album}
                      </p>
                    )}

                    {song.genre && (
                      <div className="mb-1 sm:mb-2 lg:mb-3">
                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-spotify-green/20 text-spotify-green border border-spotify-green/30">
                          {song.genre}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 lg:mb-4">
                      <span className="truncate">{song.formattedDuration}</span>
                      <span className="truncate">
                        {song.playCount || 0} plays
                      </span>
                    </div>

                    <div className="flex gap-1 sm:gap-2">
                      <button
                        onClick={() => handleEdit(song)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-1 sm:py-1.5 lg:py-2 px-1.5 sm:px-2 lg:px-3 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 min-w-0"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(song._id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-1 sm:py-1.5 lg:py-2 px-1.5 sm:px-2 lg:px-3 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 min-w-0"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="text-left p-3 sm:p-4 lg:p-6 text-white font-semibold text-sm sm:text-base lg:text-lg">
                      Song
                    </th>
                    <th className="text-left p-3 sm:p-4 lg:p-6 text-white font-semibold text-sm sm:text-base lg:text-lg hidden sm:table-cell">
                      Artist
                    </th>
                    <th className="text-left p-3 sm:p-4 lg:p-6 text-white font-semibold text-sm sm:text-base lg:text-lg hidden lg:table-cell">
                      Album
                    </th>
                    <th className="text-left p-3 sm:p-4 lg:p-6 text-white font-semibold text-sm sm:text-base lg:text-lg hidden md:table-cell">
                      Genre
                    </th>
                    <th className="text-left p-3 sm:p-4 lg:p-6 text-white font-semibold text-sm sm:text-base lg:text-lg">
                      Duration
                    </th>
                    <th className="text-left p-3 sm:p-4 lg:p-6 text-white font-semibold text-sm sm:text-base lg:text-lg hidden sm:table-cell">
                      Plays
                    </th>
                    <th className="text-left p-3 sm:p-4 lg:p-6 text-white font-semibold text-sm sm:text-base lg:text-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSongs.map((song, index) => (
                    <tr
                      key={song._id}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-all duration-300"
                    >
                      <td className="p-3 sm:p-4 lg:p-6">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-spotify-green to-green-400 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <span className="text-sm sm:text-base lg:text-lg font-bold text-white">
                              🎧
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                              {song.title}
                            </div>
                            <div className="text-gray-400 text-xs sm:text-sm">
                              {song.artist}
                            </div>
                            <div className="text-gray-500 text-xs sm:text-sm hidden sm:block">
                              ID: {song._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 lg:p-6 text-gray-300 text-sm sm:text-base lg:text-lg hidden sm:table-cell">
                        {song.artist}
                      </td>
                      <td className="p-3 sm:p-4 lg:p-6 text-gray-400 text-sm sm:text-base lg:text-lg hidden lg:table-cell">
                        {song.album || "—"}
                      </td>
                      <td className="p-3 sm:p-4 lg:p-6 hidden md:table-cell">
                        {song.genre ? (
                          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-spotify-green/20 text-spotify-green border border-spotify-green/30">
                            {song.genre}
                          </span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 lg:p-6 text-gray-300 text-sm sm:text-base lg:text-lg">
                        {song.formattedDuration}
                      </td>
                      <td className="p-3 sm:p-4 lg:p-6 hidden sm:table-cell">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="text-gray-300 text-sm sm:text-base lg:text-lg">
                            {song.playCount || 0}
                          </span>
                          <span className="text-gray-500 text-xs sm:text-sm">
                            plays
                          </span>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 lg:p-6">
                        <div className="flex gap-2 sm:gap-3">
                          <button
                            onClick={() => handleEdit(song)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(song._id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSongManagement;
