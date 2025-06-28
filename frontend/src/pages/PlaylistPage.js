import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPlaylistById,
  removeSongFromPlaylist,
  addSongToPlaylist,
} from "../store/slices/playlistSlice";
import { getSongs } from "../store/slices/songSlice";
import {
  playSong,
  addToQueue,
  playPlaylist,
} from "../store/slices/playerSlice";
import { useToast } from "../context/ToastContext";

const PlaylistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();
  const { id } = useParams();

  const {
    currentPlaylist,
    isLoading: playlistLoading,
    error: playlistError,
  } = useSelector((state) => state.playlists);
  const { songs, isLoaded: songsLoaded } = useSelector((state) => state.songs);
  const { queue } = useSelector((state) => state.player);

  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getPlaylistById(id));
    }
    if (!songsLoaded) {
      dispatch(getSongs());
    }
  }, [dispatch, id, songsLoaded]);

  const handlePlayPlaylist = () => {
    if (currentPlaylist?.songs && currentPlaylist.songs.length > 0) {
      const songs = currentPlaylist.songs.map((item) => item.song);
      dispatch(playPlaylist({ songs }));
      showSuccessToast(`Playing "${currentPlaylist.name}" playlist`);
    }
  };

  const handleAddPlaylistToQueue = () => {
    if (currentPlaylist?.songs && currentPlaylist.songs.length > 0) {
      const songs = currentPlaylist.songs.map((item) => item.song);
      songs.forEach((song) => dispatch(addToQueue(song)));
      showSuccessToast(`${currentPlaylist.songs.length} songs added to queue`);
    }
  };

  const handlePlaySong = (song) => {
    dispatch(playSong(song));
    showSuccessToast(`Now playing "${song.title}"`);
  };

  const handleAddSongToQueue = (song) => {
    dispatch(addToQueue(song));
    showSuccessToast(`"${song.title}" added to queue`);
  };

  const handleRemoveSongFromPlaylist = async (songId) => {
    if (currentPlaylist) {
      try {
        await dispatch(
          removeSongFromPlaylist({
            playlistId: currentPlaylist._id,
            songId,
          })
        ).unwrap();
        showSuccessToast("Song removed from playlist");
      } catch (error) {
        console.error("Failed to remove song from playlist:", error);
        showErrorToast("Failed to remove song from playlist");
      }
    }
  };

  const handleAddSongToPlaylist = async (songId) => {
    if (currentPlaylist) {
      try {
        await dispatch(
          addSongToPlaylist({
            playlistId: currentPlaylist._id,
            songId,
          })
        ).unwrap();
        setShowAddSongModal(false);
        showSuccessToast("Song added to playlist");
      } catch (error) {
        console.error("Failed to add song to playlist:", error);
        showErrorToast("Failed to add song to playlist");
      }
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (playlistLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-spotify-black">
        <div className="w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full animate-spin-slow mb-5"></div>
        <p className="text-white">Loading playlist...</p>
      </div>
    );
  }

  if (playlistError || !currentPlaylist) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-white mb-4">
            Playlist Not Found
          </h1>
          <p className="text-spotify-gray mb-6">
            The playlist you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-spotify-green text-white px-6 py-3 rounded-lg font-medium hover:bg-spotify-green-hover transition-colors"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Playlist Header */}
      <div className="bg-gradient-to-b from-spotify-green to-spotify-black-lighter p-8 rounded-lg mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 bg-spotify-black rounded-lg flex items-center justify-center text-6xl">
            🎵
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              {currentPlaylist.name}
            </h1>
            {currentPlaylist.description && (
              <p className="text-spotify-gray text-lg mb-4">
                {currentPlaylist.description}
              </p>
            )}
            <div className="text-spotify-gray">
              {currentPlaylist.songCount || 0} songs •{" "}
              {currentPlaylist.formattedTotalDuration || "0:00"}
            </div>
          </div>
        </div>

        {/* Playlist Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handlePlayPlaylist}
            disabled={
              !currentPlaylist.songs || currentPlaylist.songs.length === 0
            }
            className="bg-spotify-green text-white px-8 py-3 rounded-full font-medium hover:bg-spotify-green-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ▶️ Play
          </button>
          <button
            onClick={handleAddPlaylistToQueue}
            disabled={
              !currentPlaylist.songs || currentPlaylist.songs.length === 0
            }
            className="bg-spotify-black-light text-white px-8 py-3 rounded-full font-medium hover:bg-spotify-black-lighter transition-colors disabled:opacity-50"
          >
            📋 Add to Queue
          </button>
          <button
            onClick={() => setShowAddSongModal(true)}
            className="bg-spotify-black-light text-white px-8 py-3 rounded-full font-medium hover:bg-spotify-black-lighter transition-colors"
          >
            ➕ Add Songs
          </button>
        </div>
      </div>

      {/* Songs List */}
      <div className="bg-spotify-black-lighter rounded-lg overflow-hidden">
        <div className="p-6 border-b border-spotify-gray">
          <h2 className="text-2xl font-bold text-white">Songs</h2>
        </div>

        {!currentPlaylist.songs || currentPlaylist.songs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-spotify-gray text-lg mb-4">
              No songs in this playlist yet.
            </p>
            <button
              onClick={() => setShowAddSongModal(true)}
              className="bg-spotify-green text-white px-6 py-3 rounded-lg font-medium hover:bg-spotify-green-hover transition-colors"
            >
              Add Your First Song
            </button>
          </div>
        ) : (
          <div className="divide-y divide-spotify-gray">
            {currentPlaylist.songs.map((item, index) => (
              <div
                key={`${item.song._id}-${index}`}
                className="flex items-center justify-between p-4 hover:bg-spotify-black-light transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-spotify-gray text-sm w-8">
                    {index + 1}
                  </span>
                  <div className="w-12 h-12 bg-spotify-green rounded flex items-center justify-center text-white font-bold">
                    🎵
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {item.song.title}
                    </div>
                    <div className="text-spotify-gray text-sm">
                      {item.song.artist}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-spotify-gray text-sm">
                    {item.song.formattedDuration}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePlaySong(item.song)}
                      className="bg-spotify-green text-white px-3 py-1 rounded text-sm hover:bg-spotify-green-hover transition-colors"
                    >
                      ▶️
                    </button>
                    <button
                      onClick={() => handleAddSongToQueue(item.song)}
                      className="bg-spotify-black-light text-white px-3 py-1 rounded text-sm hover:bg-spotify-black-lighter transition-colors"
                    >
                      📋
                    </button>
                    <button
                      onClick={() =>
                        handleRemoveSongFromPlaylist(item.song._id)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Song Modal */}
      {showAddSongModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-spotify-black-lighter p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Add Songs to "{currentPlaylist.name}"
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
                const isInPlaylist = currentPlaylist.songs?.some(
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
    </div>
  );
};

export default PlaylistPage;
