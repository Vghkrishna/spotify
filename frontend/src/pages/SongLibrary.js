import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSongs } from "../store/slices/songSlice";
import { getPlaylists, addSongToPlaylist } from "../store/slices/playlistSlice";
import { playSong, addToQueue } from "../store/slices/playerSlice";
import { useToast } from "../context/ToastContext";

const SongLibrary = () => {
  const dispatch = useDispatch();
  const { showSuccessToast } = useToast();
  const {
    songs,
    isLoading: songsLoading,
    isLoaded: songsLoaded,
  } = useSelector((state) => state.songs);
  const { playlists, isLoaded: playlistsLoaded } = useSelector(
    (state) => state.playlists
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);

  useEffect(() => {
    if (!songsLoaded) {
      dispatch(getSongs());
    }
    if (!playlistsLoaded) {
      dispatch(getPlaylists());
    }
  }, [dispatch, songsLoaded, playlistsLoaded]);

  const handlePlaySong = (song) => {
    dispatch(playSong(song));
    showSuccessToast(`Now playing "${song.title}"`);
  };

  const handleAddToQueue = (song) => {
    dispatch(addToQueue(song));
    showSuccessToast(`"${song.title}" added to queue`);
  };

  const handleAddToPlaylist = (song) => {
    setSelectedPlaylist(null);
    setShowAddToPlaylistModal(true);
  };

  const handleAddSongToPlaylist = async (playlistId) => {
    if (selectedPlaylist) {
      try {
        await dispatch(
          addSongToPlaylist({
            playlistId,
            songId: selectedPlaylist._id,
          })
        ).unwrap();
        setShowAddToPlaylistModal(false);
        setSelectedPlaylist(null);
        showSuccessToast("Song added to playlist");
      } catch (error) {
        console.error("Failed to add song to playlist:", error);
      }
    }
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (songsLoading) {
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
            Loading your music library...
          </h2>
          <p className="text-spotify-gray">Preparing your song collection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-8 relative">
      {/* Background noise texture */}
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-spotify-green/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse-slow animate-delay-1000"></div>
        <div className="absolute top-1/2 right-0 w-32 h-32 bg-spotify-green/3 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-white mb-2 text-shadow">
            Song Library
          </h1>
          <p className="text-spotify-gray text-lg">
            Discover and play your favorite songs
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in-up animate-delay-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-spotify-gray text-xl">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search songs by title or artist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-12 text-lg"
            />
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid-auto-fit animate-fade-in-up animate-delay-300">
          {filteredSongs.map((song, index) => (
            <div
              key={song._id}
              className="song-card p-6 group cursor-pointer"
              onClick={() => handlePlaySong(song)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="song-card-overlay"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-spotify rounded-xl flex items-center justify-center shadow-spotify group-hover:shadow-spotify-hover transition-all duration-300 group-hover:scale-110">
                    <span className="text-2xl font-bold text-white">🎧</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-lg truncate text-shadow">
                      {song.title}
                    </div>
                    <div className="text-spotify-gray text-sm truncate">
                      {song.artist}
                    </div>
                  </div>
                </div>

                <div className="text-spotify-gray text-sm mb-4 font-medium">
                  Duration: {song.formattedDuration}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySong(song);
                    }}
                    className="btn btn-primary flex-1 py-2 px-3 text-sm"
                  >
                    Play
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToQueue(song);
                    }}
                    className="btn btn-secondary flex-1 py-2 px-3 text-sm"
                  >
                    +Queue
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlaylist(song);
                      setShowAddToPlaylistModal(true);
                    }}
                    className="btn btn-outline flex-1 py-2 px-3 text-sm"
                  >
                    +Playlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSongs.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-spotify rounded-full flex items-center justify-center mx-auto mb-6 shadow-spotify animate-float">
              <span className="text-4xl">🎧</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 text-shadow">
              {searchTerm ? "No Songs Found" : "No Songs Available"}
            </h3>
            <p className="text-spotify-gray text-lg max-w-md mx-auto">
              {searchTerm
                ? "No songs found matching your search. Try different keywords."
                : "It looks like there are no songs in the library yet. Check back later for new music!"}
            </p>
          </div>
        )}

        {/* Add to Playlist Modal */}
        {showAddToPlaylistModal && selectedPlaylist && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
            <div className="card p-6 max-w-md w-full mx-4 animate-scale-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white text-shadow">
                  Add "{selectedPlaylist.title}" to Playlist
                </h2>
                <button
                  onClick={() => {
                    setShowAddToPlaylistModal(false);
                    setSelectedPlaylist(null);
                  }}
                  className="text-spotify-gray hover:text-white hover-lift"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>

              {playlists.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-spotify rounded-full flex items-center justify-center mx-auto mb-4 shadow-spotify">
                    <span className="text-2xl">📚</span>
                  </div>
                  <p className="text-spotify-gray mb-4">
                    No playlists available.
                  </p>
                  <p className="text-spotify-gray text-sm">
                    Create a playlist first to add songs to it.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {playlists.map((playlist) => {
                    const isInPlaylist = playlist.songs?.some(
                      (item) => item.song._id === selectedPlaylist._id
                    );

                    return (
                      <div
                        key={playlist._id}
                        className="card p-4 hover-lift cursor-pointer"
                        onClick={() => handleAddSongToPlaylist(playlist._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-spotify rounded-lg flex items-center justify-center shadow-spotify">
                              <span className="text-white font-bold text-sm">
                                📚
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {playlist.name}
                              </div>
                              <div className="text-spotify-gray text-sm">
                                {playlist.songs?.length || 0} songs
                              </div>
                            </div>
                          </div>
                          {isInPlaylist && (
                            <div className="badge badge-primary">Added</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongLibrary;
