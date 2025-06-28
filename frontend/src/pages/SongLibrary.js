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
      <div className="flex flex-col items-center justify-center h-screen bg-spotify-black">
        <div className="w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full animate-spin-slow mb-5"></div>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Song Library</h1>
        <p className="text-spotify-gray">
          Discover and play your favorite songs
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search songs by title or artist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-spotify-black-lighter border border-spotify-gray rounded-lg text-white placeholder-spotify-gray focus:outline-none focus:border-spotify-green"
        />
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSongs.map((song) => (
          <div
            key={song._id}
            className="bg-spotify-black-lighter p-4 rounded-lg hover:bg-spotify-black-light transition-colors"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-spotify-green rounded flex items-center justify-center text-white font-bold">
                🎵
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{song.title}</div>
                <div className="text-spotify-gray text-sm">{song.artist}</div>
              </div>
            </div>

            <div className="text-spotify-gray text-sm mb-3">
              Duration: {song.formattedDuration}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePlaySong(song)}
                className="bg-spotify-green text-white px-3 py-2 rounded text-sm hover:bg-spotify-green-hover transition-colors"
              >
                Play
              </button>
              <button
                onClick={() => handleAddToQueue(song)}
                className="bg-spotify-black-light text-white px-3 py-2 rounded text-sm hover:bg-spotify-black-lighter transition-colors"
              >
                +Queue
              </button>
              <button
                onClick={() => {
                  setSelectedPlaylist(song);
                  setShowAddToPlaylistModal(true);
                }}
                className="bg-spotify-black-light text-white px-3 py-2 rounded text-sm hover:bg-spotify-black-lighter transition-colors"
              >
                +Playlist
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-spotify-gray text-lg">
            {searchTerm
              ? "No songs found matching your search."
              : "No songs available."}
          </p>
        </div>
      )}

      {/* Add to Playlist Modal */}
      {showAddToPlaylistModal && selectedPlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-spotify-black-lighter p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Add "{selectedPlaylist.title}" to Playlist
              </h2>
              <button
                onClick={() => {
                  setShowAddToPlaylistModal(false);
                  setSelectedPlaylist(null);
                }}
                className="text-spotify-gray hover:text-white"
              >
                ✕
              </button>
            </div>

            {playlists.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-spotify-gray mb-4">
                  No playlists available.
                </p>
                <p className="text-spotify-gray text-sm">
                  Create a playlist first to add songs to it.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {playlists.map((playlist) => {
                  const isInPlaylist = playlist.songs?.some(
                    (item) => item.song._id === selectedPlaylist._id
                  );

                  return (
                    <div
                      key={playlist._id}
                      className="flex items-center justify-between p-3 bg-spotify-black rounded"
                    >
                      <div>
                        <div className="text-white font-medium">
                          {playlist.name}
                        </div>
                        <div className="text-spotify-gray text-sm">
                          {playlist.songCount} songs
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddSongToPlaylist(playlist._id)}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SongLibrary;
