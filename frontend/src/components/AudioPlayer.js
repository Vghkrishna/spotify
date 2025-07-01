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
      console.log("Setting audio source:", currentSong.filePath);
      console.log("Current song:", currentSong);

      // Only set new source if it's a different song
      const newSrc = currentSong.filePath;
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

  const handleVolumeReset = () => {
    const normalVolume = 0.4; // Reset to normal volume
    dispatch(setVolume(normalVolume));
    if (audioRef.current) {
      audioRef.current.volume = normalVolume;
    }
  };

  const handleVolumeMute = () => {
    if (volume > 0) {
      // Store current volume and mute
      dispatch(setVolume(0));
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    } else {
      // Restore to previous volume or default
      const restoreVolume = 0.4;
      dispatch(setVolume(restoreVolume));
      if (audioRef.current) {
        audioRef.current.volume = restoreVolume;
      }
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
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-spotify-black/95 to-spotify-black-light/95 backdrop-blur-xl border-t border-gray-700/30 p-4 z-50 shadow-lg">
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

      <div className="container-responsive flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-16 h-16 bg-gradient-spotify rounded-xl flex items-center justify-center shadow-spotify animate-float">
            <span className="text-2xl font-bold text-white">🎵</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold truncate text-shadow">
              {currentSong.title}
            </div>
            <div className="text-spotify-gray text-sm truncate">
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
              className={`player-control text-2xl transition-all duration-300 hover:scale-110 ${
                shuffle
                  ? "text-spotify-green bg-spotify-green/20 border-spotify-green/30"
                  : "text-spotify-gray hover:text-white"
              }`}
            >
              🔀
            </button>
            <button
              onClick={handleSkipPrevious}
              className="player-control text-2xl text-spotify-gray hover:text-white transition-all duration-300 hover:scale-110"
            >
              ⏮️
            </button>
            <button
              onClick={handlePlayPause}
              className="player-control-primary text-2xl text-white hover:scale-110 transition-all duration-300 shadow-spotify hover:shadow-spotify-hover"
            >
              <span className="text-2xl">{isPlaying ? "⏸️" : "▶️"}</span>
            </button>
            <button
              onClick={handleSkipNext}
              className="player-control text-2xl text-spotify-gray hover:text-white transition-all duration-300 hover:scale-110"
            >
              ⏭️
            </button>
            <button
              onClick={handleRepeatToggle}
              className={`player-control text-2xl transition-all duration-300 hover:scale-110 ${
                repeat !== "none"
                  ? "text-spotify-green bg-spotify-green/20 border-spotify-green/30"
                  : "text-spotify-gray hover:text-white"
              }`}
            >
              {getRepeatIcon()}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-3 w-full">
            <span className="text-spotify-gray text-xs w-12 text-right font-medium">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative">
              <div className="progress-bar" onClick={handleSeek}>
                <div
                  className="progress-fill"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div
                  className="progress-handle"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-spotify-gray text-xs w-12 text-left font-medium">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          {/* Queue Button */}
          <button
            onClick={() => setShowQueue(!showQueue)}
            className="player-control text-xl text-spotify-gray hover:text-white transition-all duration-300 hover:scale-110"
          >
            📋
          </button>

          {/* Volume Control */}
          <div className="relative group">
            <button
              onClick={handleVolumeMute}
              className="player-control text-xl text-spotify-gray hover:text-white transition-all duration-300 hover:scale-110"
            >
              {volume === 0
                ? "🔇"
                : volume < 0.3
                ? "🔉"
                : volume < 0.6
                ? "🔊"
                : "🔊"}
            </button>
            <div className="absolute bottom-full right-0 mb-3 card p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
              <div className="flex flex-col items-center space-y-3">
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
                <div className="text-center text-white text-xs font-medium">
                  {Math.round(volume * 100)}%
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleVolumeReset}
                    className="text-xs bg-spotify-green/20 text-spotify-green px-2 py-1 rounded hover:bg-spotify-green/30 transition-colors"
                    title="Reset to normal volume"
                  >
                    Normal
                  </button>
                  <button
                    onClick={handleVolumeMute}
                    className="text-xs bg-gray-700/50 text-spotify-gray px-2 py-1 rounded hover:bg-gray-600/50 transition-colors"
                    title={volume > 0 ? "Mute" : "Unmute"}
                  >
                    {volume > 0 ? "Mute" : "Unmute"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && (
        <div className="absolute bottom-full left-0 right-0 bg-gradient-to-b from-spotify-black/95 to-spotify-black-light/95 backdrop-blur-xl border-t border-gray-700/30 p-6 max-h-80 overflow-y-auto animate-slide-up">
          <div className="container-responsive">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg gradient-text">
                Queue
              </h3>
              <button
                onClick={() => setShowQueue(false)}
                className="text-spotify-gray hover:text-white transition-colors hover-lift"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>

            {queue.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4 animate-float">🎵</div>
                <p className="text-spotify-gray">No songs in queue</p>
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((song, index) => (
                  <div
                    key={`${song._id}-${index}`}
                    className={`song-card ${
                      index === currentIndex
                        ? "bg-gradient-to-r from-spotify-green/20 to-green-400/20 border-spotify-green/30"
                        : ""
                    }`}
                  >
                    <div className="song-card-overlay"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-spotify rounded-lg flex items-center justify-center shadow-spotify">
                          <span className="text-white font-bold text-sm">
                            {index === currentIndex ? "▶️" : index + 1}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-white font-medium truncate">
                            {song.title}
                          </div>
                          <div className="text-spotify-gray text-sm truncate">
                            {song.artist}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-spotify-gray text-sm font-medium">
                          {song.formattedDuration}
                        </span>
                        {index !== currentIndex && (
                          <button
                            onClick={() => handleRemoveFromQueue(index)}
                            className="text-spotify-gray hover:text-red-400 transition-colors hover:scale-110"
                          >
                            <span className="text-lg">✕</span>
                          </button>
                        )}
                      </div>
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
