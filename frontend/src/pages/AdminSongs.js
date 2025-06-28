import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getSongs,
  addSong,
  updateSong,
  deleteSong,
} from "../store/slices/songSlice";

const AdminSongs = () => {
  const dispatch = useDispatch();
  const { songs, isLoading, isLoaded } = useSelector((state) => state.songs);
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
    if (!isLoaded) {
      dispatch(getSongs());
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
      formDataToSend.append("audioFile", formData.audioFile);
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
        <h1 className="text-3xl font-bold text-white mb-2">Song Management</h1>
        <p className="text-spotify-gray">Manage songs in the library</p>
      </div>

      {/* Add Song Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-spotify-green text-white px-6 py-3 rounded-lg font-medium hover:bg-spotify-green-hover transition-colors"
        >
          Add New Song
        </button>
      </div>

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
                className="bg-spotify-green text-white px-6 py-2 rounded-lg font-medium hover:bg-spotify-green-hover transition-colors"
              >
                {editingSong ? "Update Song" : "Add Song"}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="bg-spotify-black-light text-white px-6 py-2 rounded-lg font-medium hover:bg-spotify-black-lighter transition-colors"
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
                <th className="text-left p-4 text-white font-medium">Title</th>
                <th className="text-left p-4 text-white font-medium">Artist</th>
                <th className="text-left p-4 text-white font-medium">Album</th>
                <th className="text-left p-4 text-white font-medium">Genre</th>
                <th className="text-left p-4 text-white font-medium">
                  Duration
                </th>
                <th className="text-left p-4 text-white font-medium">Plays</th>
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
  );
};

export default AdminSongs;
