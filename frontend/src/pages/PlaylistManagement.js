import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../store/slices/playlistSlice";
import { getSongs } from "../store/slices/songSlice";
import { playPlaylist, addToQueue } from "../store/slices/playerSlice";

const PlaylistManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    playlists,
    isLoading: playlistsLoading,
    isLoaded: playlistsLoaded,
    error: playlistsError,
  } = useSelector((state) => state.playlists);
  const { songs, isLoaded: songsLoaded } = useSelector((state) => state.songs);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!playlistsLoaded) {
      dispatch(getPlaylists());
    }
    if (!songsLoaded) {
      dispatch(getSongs());
    }
  }, [dispatch, playlistsLoaded, songsLoaded]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingPlaylist) {
        await dispatch(
          updatePlaylist({
            id: editingPlaylist._id,
            playlistData: formData,
          })
        ).unwrap();
        setEditingPlaylist(null);
      } else {
        await dispatch(createPlaylist(formData)).unwrap();
      }

      setFormData({
        name: "",
        description: "",
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Playlist operation failed:", error);
    }
  };

  const handleEdit = (playlist) => {
    setEditingPlaylist(playlist);
    setFormData({
      name: playlist.name,
      description: playlist.description || "",
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (playlistId) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      await dispatch(deletePlaylist(playlistId));
    }
  };

  const handlePlayPlaylist = (playlist) => {
    if (playlist.songs && playlist.songs.length > 0) {
      const songs = playlist.songs.map((item) => item.song);
      dispatch(playPlaylist({ songs }));
    }
  };

  const handleAddToQueue = (playlist) => {
    if (playlist.songs && playlist.songs.length > 0) {
      const songs = playlist.songs.map((item) => item.song);
      songs.forEach((song) => dispatch(addToQueue(song)));
    }
  };

  const handleAddSongToPlaylist = async (songId) => {
    if (selectedPlaylist) {
      try {
        await dispatch(
          addSongToPlaylist({
            playlistId: selectedPlaylist._id,
            songId,
          })
        ).unwrap();
        setShowAddSongModal(false);
      } catch (error) {
        console.error("Failed to add song to playlist:", error);
      }
    }
  };

  const handleRemoveSongFromPlaylist = async (songId) => {
    if (selectedPlaylist) {
      try {
        await dispatch(
          removeSongFromPlaylist({
            playlistId: selectedPlaylist._id,
            songId,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to remove song from playlist:", error);
      }
    }
  };

  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingPlaylist(null);
    setFormData({
      name: "",
      description: "",
    });
  };

  if (playlistsLoading) {
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
        <h1 className="text-3xl font-bold text-white mb-2">My Playlists</h1>
        <p className="text-spotify-gray">Create and manage your playlists</p>
      </div>

      {/* Error Message */}
      {playlistsError && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          <p className="font-medium">Error:</p>
          <p>{playlistsError}</p>
        </div>
      )}

      {/* Create Playlist Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-spotify-green text-white px-6 py-3 rounded-lg font-medium hover:bg-spotify-green-hover transition-colors"
        >
          Create New Playlist
        </button>
      </div>

      {/* Create/Edit Playlist Form */}
      {showCreateForm && (
        <div className="bg-spotify-black-lighter p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingPlaylist ? "Edit Playlist" : "Create New Playlist"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Playlist Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-spotify-black border border-spotify-gray rounded-lg text-white focus:outline-none focus:border-spotify-green"
                required
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 bg-spotify-black border border-spotify-gray rounded-lg text-white focus:outline-none focus:border-spotify-green"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-spotify-green text-white px-6 py-2 rounded-lg font-medium hover:bg-spotify-green-hover transition-colors"
              >
                {editingPlaylist ? "Update Playlist" : "Create Playlist"}
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

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="bg-spotify-black-lighter p-6 rounded-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{playlist.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(playlist)}
                  className="bg-spotify-green text-white px-2 py-1 rounded text-sm hover:bg-spotify-green-hover transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(playlist._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            {playlist.description && (
              <p className="text-spotify-gray text-sm mb-4">
                {playlist.description}
              </p>
            )}

            <div className="text-spotify-gray text-sm mb-4">
              {playlist.songCount || 0} songs •{" "}
              {playlist.formattedTotalDuration || "0:00"}
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handlePlayPlaylist(playlist)}
                disabled={!playlist.songs || playlist.songs.length === 0}
                className="bg-spotify-green text-white px-3 py-2 rounded text-sm hover:bg-spotify-green-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Play
              </button>
              <button
                onClick={() => handleAddToQueue(playlist)}
                disabled={!playlist.songs || playlist.songs.length === 0}
                className="bg-spotify-black-light text-white px-3 py-2 rounded text-sm hover:bg-spotify-black-lighter transition-colors disabled:opacity-50"
              >
                Add to Queue
              </button>
              <button
                onClick={() => {
                  setSelectedPlaylist(playlist);
                  setShowAddSongModal(true);
                }}
                className="bg-spotify-black-light text-white px-3 py-2 rounded text-sm hover:bg-spotify-black-lighter transition-colors"
              >
                Add Songs
              </button>
            </div>

            <button
              onClick={() => setSelectedPlaylist(playlist)}
              className="text-spotify-green hover:text-spotify-green-hover text-sm"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Add Song Modal */}
      {showAddSongModal && selectedPlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-spotify-black-lighter p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Add Songs to "{selectedPlaylist.name}"
              </h2>
              <button
                onClick={() => setShowAddSongModal(false)}
                className="text-spotify-gray hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {songs.map((song) => {
                const isInPlaylist = selectedPlaylist.songs?.some(
                  (item) => item.song._id === song._id
                );

                return (
                  <div
                    key={song._id}
                    className="flex items-center justify-between p-3 bg-spotify-black rounded"
                  >
                    <div>
                      <div className="text-white font-medium">{song.title}</div>
                      <div className="text-spotify-gray text-sm">
                        {song.artist}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddSongToPlaylist(song._id)}
                      disabled={isInPlaylist}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        isInPlaylist
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-spotify-green text-white hover:bg-spotify-green-hover"
                      }`}
                    >
                      {isInPlaylist ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Playlist Details Modal */}
      {selectedPlaylist && !showAddSongModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-spotify-black-lighter p-6 rounded-lg max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {selectedPlaylist.name}
              </h2>
              <button
                onClick={() => setSelectedPlaylist(null)}
                className="text-spotify-gray hover:text-white"
              >
                ✕
              </button>
            </div>

            {selectedPlaylist.description && (
              <p className="text-spotify-gray mb-4">
                {selectedPlaylist.description}
              </p>
            )}

            <div className="space-y-2">
              {selectedPlaylist.songs?.map((item, index) => (
                <div
                  key={item.song._id}
                  className="flex items-center justify-between p-3 bg-spotify-black rounded"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-spotify-gray w-8">{index + 1}</span>
                    <div>
                      <div className="text-white font-medium">
                        {item.song.title}
                      </div>
                      <div className="text-spotify-gray text-sm">
                        {item.song.artist}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-spotify-gray text-sm">
                      {item.song.formattedDuration}
                    </span>
                    <button
                      onClick={() =>
                        handleRemoveSongFromPlaylist(item.song._id)
                      }
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {(!selectedPlaylist.songs ||
              selectedPlaylist.songs.length === 0) && (
              <p className="text-spotify-gray text-center py-8">
                No songs in this playlist yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistManagement;
