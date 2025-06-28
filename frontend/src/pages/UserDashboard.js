import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSongs } from "../store/slices/songSlice";
import {
  getPlaylists,
  createPlaylist,
  addSongToPlaylist,
} from "../store/slices/playlistSlice";
import {
  playSong,
  addToQueue,
  playPlaylist,
} from "../store/slices/playerSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    songs,
    isLoading: songsLoading,
    isLoaded: songsLoaded,
  } = useSelector((state) => state.songs);
  const {
    playlists,
    isLoading: playlistsLoading,
    isLoaded: playlistsLoaded,
  } = useSelector((state) => state.playlists);
  const navigate = useNavigate();
  const { showSuccessToast } = useToast();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [playlistForm, setPlaylistForm] = useState({
    name: "",
    description: "",
  });
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    // Only fetch data if not already loaded
    if (!songsLoaded) {
      dispatch(getSongs());
    }
    if (!playlistsLoaded) {
      dispatch(getPlaylists());
    }
  }, [dispatch, songsLoaded, playlistsLoaded]);

  const handlePlaySong = (song) => {
    dispatch(playSong(song));
  };

  const handleAddToQueue = (song) => {
    dispatch(addToQueue(song));
    showSuccessToast(`"${song.title}" added to queue`);
  };

  const handlePlayPlaylist = (playlist) => {
    if (playlist.songs && playlist.songs.length > 0) {
      const songs = playlist.songs.map((item) => item.song);
      dispatch(playPlaylist({ songs }));
      showSuccessToast(`Playing "${playlist.name}" playlist`);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createPlaylist(playlistForm)).unwrap();
      setPlaylistForm({ name: "", description: "" });
      setShowCreatePlaylist(false);
      showSuccessToast(`Playlist "${playlistForm.name}" created successfully`);
    } catch (error) {
      console.error("Failed to create playlist:", error);
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
        setSelectedPlaylist(null);
        showSuccessToast("Song added to playlist");
      } catch (error) {
        console.error("Failed to add song to playlist:", error);
      }
    }
  };

  const isLoading = songsLoading || playlistsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-spotify-green border-t-transparent rounded-full animate-spin-slow mb-6"></div>
          <p className="text-white text-lg">Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-spotify-green/20 via-green-500/10 to-spotify-green/20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
          <div className="relative p-8 md:p-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-spotify-green to-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
                <span className="text-4xl">🎵</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-spotify-green to-green-400 bg-clip-text text-transparent">
                  {user?.username}
                </span>
                !
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Ready to discover amazing music? Your personal music library is
                waiting for you.
              </p>

              {/* Quick Stats */}
              <div className="flex justify-center items-center gap-8 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {songs.length}
                  </div>
                  <div className="text-gray-400 text-sm">Songs</div>
                </div>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {playlists.length}
                  </div>
                  <div className="text-gray-400 text-sm">Playlists</div>
                </div>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {songs.length > 0
                      ? Math.floor(
                          songs.reduce((acc, song) => acc + song.duration, 0) /
                            60
                        )
                      : 0}
                  </div>
                  <div className="text-gray-400 text-sm">Minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-gray-700/50 shadow-xl">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
              activeTab === "dashboard"
                ? "bg-gradient-to-r from-spotify-green to-green-500 text-white shadow-lg transform scale-105"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("playlists")}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
              activeTab === "playlists"
                ? "bg-gradient-to-r from-spotify-green to-green-500 text-white shadow-lg transform scale-105"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            <span className="text-xl">📚</span>
            <span className="hidden sm:inline">My Playlists</span>
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Total Songs
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {songs.length}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Available in library
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <span className="text-2xl">🎵</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Your Playlists
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {playlists.length}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Personal collections
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <span className="text-2xl">📚</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Music Library
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {songs.length > 0
                        ? Math.floor(
                            songs.reduce(
                              (acc, song) => acc + song.duration,
                              0
                            ) / 60
                          )
                        : 0}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">Total duration</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <span className="text-2xl">⏱️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Songs Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Recent Songs
                  </h2>
                  <p className="text-gray-400">Your latest music discoveries</p>
                </div>
                <Link
                  to="/songs"
                  className="bg-gradient-to-r from-spotify-green to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-500 hover:to-spotify-green hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
                >
                  <span>🎵</span>
                  View All Songs
                </Link>
              </div>

              {songs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🎵</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    No Songs Available
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    It looks like there are no songs in the library yet. Check
                    back later for new music!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {songs.slice(0, 6).map((song) => (
                    <div
                      key={song._id}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                      onClick={() => handlePlaySong(song)}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-spotify-green to-green-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                          <span className="text-2xl font-bold text-white">
                            🎵
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate text-lg">
                            {song.title}
                          </h3>
                          <p className="text-gray-400 truncate">
                            {song.artist}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>Duration: {song.formattedDuration}</span>
                        <span>Plays: {song.playCount || 0}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaySong(song);
                          }}
                          className="flex-1 bg-gradient-to-r from-spotify-green to-green-500 text-white py-2 px-4 rounded-lg font-medium hover:from-green-500 hover:to-spotify-green transition-all duration-300"
                        >
                          Play
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToQueue(song);
                          }}
                          className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-all duration-300"
                        >
                          +Queue
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/songs"
                  className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 text-center group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">
                    Browse Songs
                  </h4>
                  <p className="text-gray-400 text-sm">Discover new music</p>
                </Link>

                <button
                  onClick={() => setShowCreatePlaylist(true)}
                  className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 text-center group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                    <span className="text-2xl">➕</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">
                    Create Playlist
                  </h4>
                  <p className="text-gray-400 text-sm">Organize your music</p>
                </button>

                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 transition-all duration-300 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎧</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Now Playing</h4>
                  <p className="text-gray-400 text-sm">Control your music</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 transition-all duration-300 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Your Stats</h4>
                  <p className="text-gray-400 text-sm">Track your listening</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Playlists Tab */}
        {activeTab === "playlists" && (
          <div className="space-y-8">
            {/* Playlists Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  My Playlists
                </h2>
                <p className="text-gray-400">
                  Organize and enjoy your music collections
                </p>
              </div>
              <button
                onClick={() => setShowCreatePlaylist(true)}
                className="bg-gradient-to-r from-spotify-green to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-500 hover:to-spotify-green hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <span>➕</span>
                Create Playlist
              </button>
            </div>

            {/* Playlists Grid */}
            {playlists.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📚</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  No Playlists Yet
                </h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Create your first playlist to start organizing your favorite
                  songs and discover new music.
                </p>
                <button
                  onClick={() => setShowCreatePlaylist(true)}
                  className="bg-gradient-to-r from-spotify-green to-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-500 hover:to-spotify-green hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Create Your First Playlist
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {playlists.map((playlist) => (
                  <div
                    key={playlist._id}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                    onClick={() => navigate(`/playlist/${playlist._id}`)}
                  >
                    <div className="w-full h-32 bg-gradient-to-br from-spotify-green/20 to-green-500/20 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                      <span className="text-4xl">📚</span>
                    </div>

                    <h3 className="text-white font-semibold text-lg mb-2 truncate">
                      {playlist.name}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {playlist.description || "No description"}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{playlist.songs?.length || 0} songs</span>
                      <span>
                        {playlist.createdAt
                          ? new Date(playlist.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPlaylist(playlist);
                        }}
                        className="flex-1 bg-gradient-to-r from-spotify-green to-green-500 text-white py-2 px-4 rounded-lg font-medium hover:from-green-500 hover:to-spotify-green transition-all duration-300"
                      >
                        Play
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/playlist/${playlist._id}`);
                        }}
                        className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-all duration-300"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Playlist Modal */}
        {showCreatePlaylist && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    Create New Playlist
                  </h3>
                  <button
                    onClick={() => setShowCreatePlaylist(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleCreatePlaylist} className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Playlist Name
                    </label>
                    <input
                      type="text"
                      value={playlistForm.name}
                      onChange={(e) =>
                        setPlaylistForm({
                          ...playlistForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all duration-300"
                      placeholder="Enter playlist name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={playlistForm.description}
                      onChange={(e) =>
                        setPlaylistForm({
                          ...playlistForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all duration-300 resize-none"
                      placeholder="Enter playlist description"
                      rows="3"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreatePlaylist(false)}
                      className="flex-1 py-3 px-4 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-spotify-green to-green-500 text-white rounded-xl font-medium hover:from-green-500 hover:to-spotify-green transition-all duration-300"
                    >
                      Create Playlist
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
