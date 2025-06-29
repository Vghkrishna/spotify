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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black via-spotify-black-dark to-spotify-black-light relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-spotify-green/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow animate-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-spotify-green/5 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="loading-spinner mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold gradient-text mb-2">
            Loading your music...
          </h2>
          <p className="text-spotify-gray">
            Preparing your personalized experience
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-black-dark to-spotify-black-light relative">
      {/* Background noise texture */}
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-spotify-green/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse-slow animate-delay-1000"></div>
        <div className="absolute top-1/2 right-0 w-32 h-32 bg-spotify-green/3 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="container-responsive py-8 relative z-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl mb-8 animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-r from-spotify-green/20 via-green-500/10 to-spotify-green/20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-spotify-black/20 to-transparent"></div>
          <div className="relative p-8 md:p-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-spotify rounded-full flex items-center justify-center mx-auto mb-6 shadow-spotify animate-float">
                <span className="text-4xl">🎵</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow">
                Welcome back,{" "}
                <span className="gradient-text">{user?.username}</span>!
              </h1>
              <p className="text-spotify-gray text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Ready to discover amazing music? Your personal music library is
                waiting for you.
              </p>

              {/* Quick Stats */}
              <div className="flex justify-center items-center gap-8 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {songs.length}
                  </div>
                  <div className="text-spotify-gray text-sm">Songs</div>
                </div>
                <div className="w-px h-8 bg-gray-700/50"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {playlists.length}
                  </div>
                  <div className="text-spotify-gray text-sm">Playlists</div>
                </div>
                <div className="w-px h-8 bg-gray-700/50"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {songs.length > 0
                      ? Math.floor(
                          songs.reduce((acc, song) => acc + song.duration, 0) /
                            60
                        )
                      : 0}
                  </div>
                  <div className="text-spotify-gray text-sm">Minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card p-2 mb-8 animate-fade-in-up animate-delay-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                activeTab === "dashboard"
                  ? "bg-gradient-spotify text-white shadow-spotify transform scale-105"
                  : "text-spotify-gray hover:text-white hover:bg-spotify-black-lighter/50"
              }`}
            >
              <span className="text-xl">🏠</span>
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("playlists")}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                activeTab === "playlists"
                  ? "bg-gradient-spotify text-white shadow-spotify transform scale-105"
                  : "text-spotify-gray hover:text-white hover:bg-spotify-black-lighter/50"
              }`}
            >
              <span className="text-xl">📚</span>
              <span className="hidden sm:inline">My Playlists</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up animate-delay-300">
              <div className="card p-6 hover-lift group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {songs.length}
                    </div>
                    <div className="text-spotify-gray">Total Songs</div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-spotify rounded-xl flex items-center justify-center shadow-spotify group-hover:shadow-spotify-hover transition-all duration-300">
                    <span className="text-2xl">🎵</span>
                  </div>
                </div>
              </div>

              <div className="card p-6 hover-lift group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {playlists.length}
                    </div>
                    <div className="text-spotify-gray">Playlists</div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-spotify rounded-xl flex items-center justify-center shadow-spotify group-hover:shadow-spotify-hover transition-all duration-300">
                    <span className="text-2xl">📚</span>
                  </div>
                </div>
              </div>

              <div className="card p-6 hover-lift group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {songs.length > 0
                        ? Math.floor(
                            songs.reduce(
                              (acc, song) => acc + song.duration,
                              0
                            ) / 60
                          )
                        : 0}
                    </div>
                    <div className="text-spotify-gray">Minutes</div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-spotify rounded-xl flex items-center justify-center shadow-spotify group-hover:shadow-spotify-hover transition-all duration-300">
                    <span className="text-2xl">⏱️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Songs Section */}
            <div className="mb-12 animate-fade-in-up animate-delay-400">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 text-shadow">
                    Recent Songs
                  </h2>
                  <p className="text-spotify-gray">
                    Your latest music discoveries
                  </p>
                </div>
                <Link
                  to="/songs"
                  className="btn btn-primary px-6 py-3 flex items-center gap-2 hover-lift"
                >
                  <span>🎵</span>
                  View All Songs
                </Link>
              </div>

              {songs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-spotify rounded-full flex items-center justify-center mx-auto mb-6 shadow-spotify animate-float">
                    <span className="text-4xl">🎵</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-shadow">
                    No Songs Available
                  </h3>
                  <p className="text-spotify-gray mb-8 max-w-md mx-auto">
                    It looks like there are no songs in the library yet. Check
                    back later for new music!
                  </p>
                </div>
              ) : (
                <div className="grid-auto-fit">
                  {songs.slice(0, 6).map((song) => (
                    <div
                      key={song._id}
                      className="song-card p-6 group cursor-pointer"
                      onClick={() => handlePlaySong(song)}
                    >
                      <div className="song-card-overlay"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-spotify rounded-xl flex items-center justify-center shadow-spotify group-hover:shadow-spotify-hover transition-all duration-300 group-hover:scale-110">
                            <span className="text-2xl font-bold text-white">
                              🎵
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate text-lg text-shadow">
                              {song.title}
                            </h3>
                            <p className="text-spotify-gray truncate">
                              {song.artist}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-spotify-gray mb-4">
                          <span>Duration: {song.formattedDuration}</span>
                          <span>Plays: {song.playCount || 0}</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaySong(song);
                            }}
                            className="btn btn-primary flex-1 py-2 px-4"
                          >
                            Play
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToQueue(song);
                            }}
                            className="btn btn-secondary flex-1 py-2 px-4"
                          >
                            +Queue
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card p-8 animate-fade-in-up animate-delay-500">
              <h3 className="text-2xl font-bold text-white mb-6 text-shadow">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/songs"
                  className="card p-6 hover-lift text-center group"
                >
                  <div className="w-12 h-12 bg-gradient-spotify rounded-xl flex items-center justify-center mx-auto mb-4 shadow-spotify group-hover:shadow-spotify-hover transition-all duration-300 group-hover:scale-110">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">
                    Browse Songs
                  </h4>
                  <p className="text-spotify-gray text-sm">
                    Discover new music
                  </p>
                </Link>

                <button
                  onClick={() => setShowCreatePlaylist(true)}
                  className="card p-6 hover-lift text-center group"
                >
                  <div className="w-12 h-12 bg-gradient-spotify rounded-xl flex items-center justify-center mx-auto mb-4 shadow-spotify group-hover:shadow-spotify-hover transition-all duration-300 group-hover:scale-110">
                    <span className="text-2xl">➕</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">
                    Create Playlist
                  </h4>
                  <p className="text-spotify-gray text-sm">
                    Organize your music
                  </p>
                </button>

                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-spotify rounded-xl flex items-center justify-center mx-auto mb-4 shadow-spotify">
                    <span className="text-2xl">🎧</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Now Playing</h4>
                  <p className="text-spotify-gray text-sm">
                    Control your music
                  </p>
                </div>

                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-spotify rounded-xl flex items-center justify-center mx-auto mb-4 shadow-spotify">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Your Stats</h4>
                  <p className="text-spotify-gray text-sm">
                    Track your listening
                  </p>
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
