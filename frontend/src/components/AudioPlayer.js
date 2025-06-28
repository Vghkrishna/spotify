import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setAudioElement,
  setCurrentTime,
  setDuration,
  setIsPlaying,
  setIsPaused,
  nextSong,
  previousSong,
  setVolume,
  setRepeat,
  setShuffle,
  removeFromQueue,
} from "../store/slices/playerSlice";
import { useToast } from "../context/ToastContext";

const AudioPlayer = () => {
  const dispatch = useDispatch();
  const { showSuccessToast } = useToast();
  const audioRef = useRef(null);
  const {
    currentSong,
    queue,
    currentIndex,
    isPlaying,
    volume,
    currentTime,
    duration,
    repeat,
    shuffle,
  } = useSelector((state) => state.player);

  const [showQueue, setShowQueue] = useState(false);
  const [currentSongId, setCurrentSongId] = useState(null);

  useEffect(() => {
    if (audioRef.current) {
      console.log("Setting audio element in Redux");
      dispatch(setAudioElement(audioRef.current));
    }
  }, [dispatch]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      console.log(
        "Setting audio source:",
        `http://localhost:5000/uploads/${currentSong.filePath}`
      );
      console.log("Current song:", currentSong);

      // Only set new source if it's a different song
      const newSrc = `http://localhost:5000/uploads/${currentSong.filePath}`;
      if (audioRef.current.src !== newSrc) {
        console.log("Loading new song, resetting audio");
        audioRef.current.src = newSrc;
        audioRef.current.load();
        setCurrentSongId(currentSong._id);
      }
    }
  }, [currentSong]);

  // Separate effect for play state management
  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    }
  }, [isPlaying, currentSong]);

  const handlePlayPause = async () => {
    console.log("handlePlayPause called, isPlaying:", isPlaying);
    console.log("audioRef.current:", audioRef.current);
    console.log("currentSong:", currentSong);
    console.log("Current time:", audioRef.current?.currentTime);

    if (audioRef.current) {
      try {
        if (isPlaying) {
          console.log("Pausing audio at time:", audioRef.current.currentTime);
          audioRef.current.pause();
          // Don't dispatch setIsPaused here, let the onPause event handle it
        } else {
          console.log(
            "Attempting to resume/play audio from time:",
            audioRef.current.currentTime
          );

          // If we have a current time and the audio is ready, just resume
          if (audioRef.current.readyState >= 2) {
            console.log("Audio is ready, resuming playback");
            await audioRef.current.play();
            // Don't dispatch setIsPlaying here, let the onPlay event handle it
          } else {
            console.log("Audio not ready, loading first");
            // If audio isn't loaded, load it first
            audioRef.current.load();
            audioRef.current.addEventListener(
              "canplay",
              async () => {
                try {
                  console.log("Audio loaded, now playing");
                  await audioRef.current.play();
                  // Don't dispatch setIsPlaying here, let the onPlay event handle it
                } catch (error) {
                  console.error("Error playing audio after load:", error);
                  dispatch(setIsPaused(true));
                }
              },
              { once: true }
            );
          }
        }
      } catch (error) {
        console.error("Error in handlePlayPause:", error);
        // Reset the playing state if there's an error
        dispatch(setIsPaused(true));
      }
    } else {
      console.error("audioRef.current is null");
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      dispatch(setCurrentTime(audioRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      dispatch(setDuration(audioRef.current.duration));
    }
  };

  const handleEnded = () => {
    dispatch(nextSong());
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      dispatch(setCurrentTime(seekTime));
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSkipNext = () => {
    dispatch(nextSong());
  };

  const handleSkipPrevious = () => {
    dispatch(previousSong());
  };

  const handleRepeatToggle = () => {
    const repeatModes = ["none", "one", "all"];
    const currentIndex = repeatModes.indexOf(repeat);
    const nextIndex = (currentIndex + 1) % repeatModes.length;
    dispatch(setRepeat(repeatModes[nextIndex]));
  };

  const handleShuffleToggle = () => {
    dispatch(setShuffle(!shuffle));
  };

  const handleRemoveFromQueue = (index) => {
    const songToRemove = queue[index];
    dispatch(removeFromQueue(index));
    showSuccessToast(`"${songToRemove.title}" removed from queue`);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getRepeatIcon = () => {
    switch (repeat) {
      case "one":
        return "🔂";
      case "all":
        return "🔁";
      default:
        return "🔁";
    }
  };

  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border-t border-gray-700/50 p-4 z-50">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => {
          console.log("Audio play event fired");
          dispatch(setIsPlaying(true));
        }}
        onPause={() => {
          console.log("Audio pause event fired");
          dispatch(setIsPaused(true));
        }}
        onError={(e) => {
          console.error("Audio error:", e);
          dispatch(setIsPaused(true));
        }}
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-16 h-16 bg-gradient-to-br from-spotify-green to-green-400 rounded-xl flex items-center justify-center shadow-lg animate-float">
            <span className="text-2xl font-bold text-white">🎵</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold truncate">
              {currentSong.title}
            </div>
            <div className="text-gray-400 text-sm truncate">
              {currentSong.artist}
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center flex-1 max-w-2xl">
          {/* Control Buttons */}
          <div className="flex items-center space-x-6 mb-3">
            <button
              onClick={handleShuffleToggle}
              className={`text-2xl transition-all duration-300 hover:scale-110 ${
                shuffle
                  ? "text-spotify-green"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🔀
            </button>
            <button
              onClick={handleSkipPrevious}
              className="text-2xl text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
            >
              ⏮️
            </button>
            <button
              onClick={handlePlayPause}
              className="w-14 h-14 bg-gradient-to-br from-spotify-green to-green-400 text-white rounded-full flex items-center justify-center hover:from-green-400 hover:to-spotify-green hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="text-2xl">{isPlaying ? "⏸️" : "▶️"}</span>
            </button>
            <button
              onClick={handleSkipNext}
              className="text-2xl text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
            >
              ⏭️
            </button>
            <button
              onClick={handleRepeatToggle}
              className={`text-2xl transition-all duration-300 hover:scale-110 ${
                repeat !== "none"
                  ? "text-spotify-green"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {getRepeatIcon()}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-3 w-full">
            <span className="text-gray-400 text-xs w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative">
              <div
                className="w-full h-2 bg-gray-700 rounded-full cursor-pointer relative overflow-hidden"
                onClick={handleSeek}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-spotify-green to-green-400 rounded-full transition-all duration-100 shadow-lg"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div
                  className="absolute top-1/2 left-0 w-3 h-3 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-gray-400 text-xs w-12 text-left">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          {/* Queue Button */}
          <button
            onClick={() => setShowQueue(!showQueue)}
            className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
          >
            <span className="text-xl">📋</span>
          </button>

          {/* Volume Control */}
          <div className="relative group">
            <button className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
              <span className="text-xl">
                {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
              </span>
            </button>
            <div className="absolute bottom-full right-0 mb-3 bg-gray-800/95 backdrop-blur-xl p-4 rounded-xl border border-gray-700/50 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${
                    volume * 100
                  }%, #4D4D4D ${volume * 100}%, #4D4D4D 100%)`,
                }}
              />
              <div className="text-center text-white text-xs mt-2 font-medium">
                {Math.round(volume * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && (
        <div className="absolute bottom-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 p-6 max-h-80 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">Queue</h3>
              <button
                onClick={() => setShowQueue(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>

            {queue.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎵</div>
                <p className="text-gray-400">No songs in queue</p>
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((song, index) => (
                  <div
                    key={`${song._id}-${index}`}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-gradient-to-r from-spotify-green/20 to-green-400/20 border border-spotify-green/30"
                        : "hover:bg-gray-800/50 border border-transparent hover:border-gray-600/30"
                    }`}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-spotify-green to-green-400 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {index === currentIndex ? "▶️" : index + 1}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-white font-medium truncate">
                          {song.title}
                        </div>
                        <div className="text-gray-400 text-sm truncate">
                          {song.artist}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 text-sm">
                        {song.formattedDuration}
                      </span>
                      {index !== currentIndex && (
                        <button
                          onClick={() => handleRemoveFromQueue(index)}
                          className="text-gray-400 hover:text-red-400 transition-colors hover:scale-110"
                        >
                          <span className="text-lg">✕</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
