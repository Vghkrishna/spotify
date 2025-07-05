import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAdminStats } from "../store/slices/adminSlice";
import {
  getAllSongsForAdmin,
  addSong,
  updateSong,
  deleteSong,
} from "../store/slices/songSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    stats,
    isLoading: statsLoading,
    isLoaded: statsLoaded,
  } = useSelector((state) => state.admin);
  const {
    songs,
    isLoading: songsLoading,
    isLoaded: songsLoaded,
    error: songsError,
    isSuccess: songsSuccess,
  } = useSelector((state) => state.songs);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    duration: "",
    audioFile: null,
  });

  useEffect(() => {
    if (!statsLoaded) {
      dispatch(getAdminStats());
    }
    if (!songsLoaded) {
      dispatch(getAllSongsForAdmin());
    }
  }, [dispatch, statsLoaded, songsLoaded]);

  // Clear success message after a few seconds
  useEffect(() => {
    if (songsSuccess) {
      const timer = setTimeout(() => {
        // You could dispatch a reset action here if needed
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [songsSuccess]);

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

    console.log("Form submitted with data:", formData);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("artist", formData.artist);
    formDataToSend.append("album", formData.album);
    formDataToSend.append("genre", formData.genre);
    formDataToSend.append("duration", formData.duration);
    if (formData.audioFile) {
      formDataToSend.append("audio", formData.audioFile);
      console.log("Audio file added:", formData.audioFile.name);
    }

    console.log("FormData entries:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

    try {
      if (editingSong) {
        console.log("Updating song:", editingSong._id);
        await dispatch(
          updateSong({ id: editingSong._id, songData: formDataToSend })
        ).unwrap();
        setEditingSong(null);
      } else {
        console.log("Adding new song");
        await dispatch(addSong(formDataToSend)).unwrap();
      }

      console.log("Song operation successful");
      setFormData({
        title: "",
        artist: "",
        album: "",
        genre: "",
        duration: "",
        audioFile: null,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Song operation failed:", error);
      // Error is already handled by the slice
    }
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

  const isLoading = statsLoading || songsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-spotify-black">
        <div className="w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full animate-spin-slow mb-5"></div>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-spotify-gray">Welcome, {user?.username}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-spotify-black-lighter rounded-lg p-1">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "dashboard"
              ? "bg-spotify-green text-white"
              : "text-spotify-gray hover:text-white"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("songs")}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "songs"
              ? "bg-spotify-green text-white"
              : "text-spotify-gray hover:text-white"
          }`}
        >
          Song Management
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <>
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-spotify-black-lighter p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Total Users
                </h3>
                <p className="text-3xl font-bold text-spotify-green">
                  {stats.stats?.totalUsers || 0}
                </p>
              </div>
              <div className="bg-spotify-black-lighter p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Total Songs
                </h3>
                <p className="text-3xl font-bold text-spotify-green">
                  {stats.stats?.totalSongs || 0}
                </p>
              </div>
              <div className="bg-spotify-black-lighter p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Total Playlists
                </h3>
                <p className="text-3xl font-bold text-spotify-green">
                  {stats.stats?.totalPlaylists || 0}
                </p>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <div className="bg-spotify-black-lighter p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">
                Recent Users
              </h2>
              {stats?.recentUsers?.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between py-2 border-b border-spotify-black-light last:border-b-0"
                >
                  <div>
                    <p className="text-white font-medium">{user.username}</p>
                    <p className="text-spotify-gray text-sm">{user.email}</p>
                  </div>
                  <span className="text-spotify-gray text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Recent Songs */}
            <div className="bg-spotify-black-lighter p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">
                Recent Songs
              </h2>
              {stats?.recentSongs?.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between py-2 border-b border-spotify-black-light last:border-b-0"
                >
                  <div>
                    <p className="text-white font-medium">{song.title}</p>
                    <p className="text-spotify-gray text-sm">{song.artist}</p>
                  </div>
                  <span className="text-spotify-gray text-sm">
                    {new Date(song.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Songs */}
          {stats?.topSongs && stats.topSongs.length > 0 && (
            <div className="bg-spotify-black-lighter p-6 rounded-lg mt-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Most Played Songs
              </h2>
              <div className="space-y-2">
                {stats.topSongs.map((song, index) => (
                  <div
                    key={song._id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-spotify-gray font-medium w-8">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-white font-medium">{song.title}</p>
                        <p className="text-spotify-gray text-sm">
                          {song.artist}
                        </p>
                      </div>
                    </div>
                    <span className="text-spotify-gray text-sm">
                      {song.playCount} plays
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Songs Management Tab */}
      {activeTab === "songs" && (
        <div>
          {/* Add Song Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-spotify-green text-white px-6 py-3 rounded-lg font-medium hover:bg-spotify-green-hover transition-colors"
            >
              Add New Song
            </button>
          </div>

          {/* Error and Success Messages */}
          {songsError && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
              <p className="font-medium">Error:</p>
              <p>{songsError}</p>
            </div>
          )}

          {/* Add/Edit Song Form */}
          {showAddForm && (
            <div className="bg-spotify-black-lighter p-6 rounded-lg mb-8">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingSong ? "Edit Song" : "Add New Song"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-spotify-black border border-spotify-gray rounded-lg text-white focus:outline-none focus:border-spotify-green"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Artist *
                    </label>
                    <input
                      type="text"
                      name="artist"
                      value={formData.artist}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-spotify-black border border-spotify-gray rounded-lg text-white focus:outline-none focus:border-spotify-green"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Album
                    </label>
                    <input
                      type="text"
                      name="album"
                      value={formData.album}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-spotify-black border border-spotify-gray rounded-lg text-white focus:outline-none focus:border-spotify-green"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Genre
                    </label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-spotify-black border border-spotify-gray rounded-lg text-white focus:outline-none focus:border-spotify-green"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Duration (seconds) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-spotify-black border border-spotify-gray rounded-lg text-white focus:outline-none focus:border-spotify-green"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Audio File {!editingSong && "*"}
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 bg-spotify-black border border-spotify-gray rounded-lg text-white focus:outline-none focus:border-spotify-green"
                      required={!editingSong}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={songsLoading}
                    className="bg-spotify-green text-white px-6 py-2 rounded-lg font-medium hover:bg-spotify-green-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {songsLoading
                      ? editingSong
                        ? "Updating..."
                        : "Adding..."
                      : editingSong
                      ? "Update Song"
                      : "Add Song"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    disabled={songsLoading}
                    className="bg-spotify-black-light text-white px-6 py-2 rounded-lg font-medium hover:bg-spotify-black-lighter transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Songs List */}
          <div className="bg-spotify-black-lighter rounded-lg overflow-hidden">
            <div className="p-6 border-b border-spotify-black-light">
              <h2 className="text-xl font-bold text-white">
                All Songs ({songs.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-spotify-black-light">
                  <tr>
                    <th className="text-left p-4 text-white font-medium">
                      Title
                    </th>
                    <th className="text-left p-4 text-white font-medium">
                      Artist
                    </th>
                    <th className="text-left p-4 text-white font-medium">
                      Album
                    </th>
                    <th className="text-left p-4 text-white font-medium">
                      Genre
                    </th>
                    <th className="text-left p-4 text-white font-medium">
                      Duration
                    </th>
                    <th className="text-left p-4 text-white font-medium">
                      Plays
                    </th>
                    <th className="text-left p-4 text-white font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song) => (
                    <tr
                      key={song._id}
                      className="border-b border-spotify-black-light hover:bg-spotify-black-light"
                    >
                      <td className="p-4 text-white">{song.title}</td>
                      <td className="p-4 text-spotify-gray">{song.artist}</td>
                      <td className="p-4 text-spotify-gray">{song.album}</td>
                      <td className="p-4 text-spotify-gray">{song.genre}</td>
                      <td className="p-4 text-spotify-gray">
                        {song.formattedDuration}
                      </td>
                      <td className="p-4 text-spotify-gray">
                        {song.playCount || 0}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(song)}
                            className="bg-spotify-green text-white px-3 py-1 rounded text-sm hover:bg-spotify-green-hover transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(song._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
