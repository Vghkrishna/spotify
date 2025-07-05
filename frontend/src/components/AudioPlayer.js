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
import { incrementPlayCount } from "../store/slices/songSlice";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      dispatch(setAudioElement(audioRef.current));
    }
  }, [dispatch]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      const newSrc = currentSong.filePath;
      if (audioRef.current.src !== newSrc) {
        audioRef.current.src = newSrc;
        audioRef.current.load();
        setCurrentSongId(currentSong._id);
      }
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
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
    if (repeat === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      dispatch(nextSong());
      dispatch(setIsPlaying(true));
    }
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
    dispatch(setIsPlaying(true));
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

  const handlePlay = () => {
    dispatch(setIsPlaying(true));
    // Increment play count when song actually starts playing
    if (currentSong && currentSong._id) {
      dispatch(incrementPlayCount(currentSong._id));
    }
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
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-spotify-black/95 via-spotify-black-light/90 to-spotify-black/95 backdrop-blur-xl border-t border-gray-700/30 p-3 sm:p-4 z-50 shadow-2xl">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={handlePlay}
        onPause={() => dispatch(setIsPaused(true))}
        onError={() => dispatch(setIsPaused(true))}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        {/* Song Info - Always visible */}
        <div className="flex items-center w-full sm:w-auto sm:flex-1 min-w-0 order-1 sm:order-none">
          <div className="relative group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-spotify-green via-green-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-spotify-hover transition-all duration-300 group-hover:scale-105">
              <span className="text-2xl sm:text-3xl drop-shadow-lg">🎧</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-spotify-green to-green-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
          </div>
          <div className="ml-3 sm:ml-4 min-w-0 flex-1">
            <div className="text-white font-bold truncate text-sm sm:text-base drop-shadow-sm">
              {currentSong.title}
            </div>
            <div className="text-spotify-gray text-xs sm:text-sm truncate font-medium">
              {currentSong.artist}
            </div>
          </div>
        </div>

        {/* Player Controls - Main section */}
        <div className="w-full sm:flex-1 max-w-2xl order-3 sm:order-none">
          <div className="flex flex-col items-center">
            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-3 sm:space-x-6 md:space-x-8 mb-2 sm:mb-3">
              {!isMobile && (
                <button
                  onClick={handleShuffleToggle}
                  className={`text-2xl sm:text-3xl transition-all duration-300 hover:scale-110 ${
                    shuffle
                      ? "text-spotify-green drop-shadow-lg"
                      : "text-spotify-gray hover:text-white"
                  }`}
                >
                  🔀
                </button>
              )}

              <button
                onClick={handleSkipPrevious}
                className="text-2xl sm:text-3xl text-spotify-gray hover:text-white transition-all duration-300 hover:scale-110"
              >
                ⏮️
              </button>

              <button
                onClick={handlePlayPause}
                className="relative mx-3 text-3xl sm:text-4xl text-white bg-gradient-to-br from-spotify-green via-green-500 to-emerald-400 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-2xl hover:shadow-spotify-hover transition-all duration-300 hover:scale-110 group"
              >
                <span className="relative z-10 drop-shadow-lg">
                  {isPlaying ? "⏸️" : "▶️"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-spotify-green via-green-500 to-emerald-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
              </button>

              <button
                onClick={handleSkipNext}
                className="text-2xl sm:text-3xl text-spotify-gray hover:text-white transition-all duration-300 hover:scale-110"
              >
                ⏭️
              </button>

              {!isMobile && (
                <button
                  onClick={handleRepeatToggle}
                  className={`text-2xl sm:text-3xl transition-all duration-300 hover:scale-110 ${
                    repeat !== "none"
                      ? "text-spotify-green drop-shadow-lg"
                      : "text-spotify-gray hover:text-white"
                  }`}
                >
                  {getRepeatIcon()}
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center space-x-3 sm:space-x-4">
              <span className="text-spotify-gray text-xs w-10 sm:w-12 text-right font-medium">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative h-3 group">
                <div
                  className="absolute inset-0 bg-gray-700/50 rounded-full cursor-pointer backdrop-blur-sm"
                  onClick={handleSeek}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-spotify-green via-green-500 to-emerald-400 rounded-full shadow-lg"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg group-hover:scale-125"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span className="text-spotify-gray text-xs w-10 sm:w-12 text-left font-medium">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center justify-end space-x-2 sm:space-x-4 w-full sm:w-auto sm:flex-1 order-2 sm:order-none">
          {/* Mobile controls */}
          {isMobile && (
            <>
              <button
                onClick={handleRepeatToggle}
                className={`text-xl ${
                  repeat !== "none" ? "text-spotify-green" : "text-spotify-gray"
                }`}
              >
                {getRepeatIcon()}
              </button>
              <button
                onClick={handleShuffleToggle}
                className={`text-xl ${
                  shuffle ? "text-spotify-green" : "text-spotify-gray"
                }`}
              >
                🔀
              </button>
            </>
          )}

          {/* Queue Button */}
          <button
            onClick={() => setShowQueue(!showQueue)}
            className="text-xl text-spotify-gray hover:text-white"
          >
            📋
          </button>

          {/* Volume Control */}
          {!isMobile ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleVolumeMute}
                className="text-xl text-spotify-gray hover:text-white"
              >
                {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 sm:w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${
                    volume * 100
                  }%, #4D4D4D ${volume * 100}%, #4D4D4D 100%)`,
                }}
              />
            </div>
          ) : (
            <button
              onClick={handleVolumeMute}
              className="text-xl text-spotify-gray hover:text-white"
            >
              {volume === 0 ? "🔇" : "🔊"}
            </button>
          )}
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && (
        <div className="absolute bottom-full left-0 right-0 bg-gradient-to-b from-spotify-black/95 to-spotify-black-light/95 backdrop-blur-xl border-t border-gray-700/30 p-4 max-h-60 sm:max-h-80 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-lg">Queue</h3>
            <button
              onClick={() => setShowQueue(false)}
              className="text-spotify-gray hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {queue.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">🎧</div>
              <p className="text-spotify-gray">No songs in queue</p>
            </div>
          ) : (
            <div className="space-y-2">
              {queue.map((song, index) => (
                <div
                  key={`${song._id}-${index}`}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    index === currentIndex
                      ? "bg-gradient-to-r from-spotify-green/20 to-green-400/20"
                      : "hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-gradient-spotify rounded flex items-center justify-center">
                      <span className="text-white text-xs">
                        {index === currentIndex ? "▶️" : index + 1}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {song.title}
                      </div>
                      <div className="text-spotify-gray text-xs truncate">
                        {song.artist}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-spotify-gray text-xs">
                      {song.formattedDuration}
                    </span>
                    {index !== currentIndex && (
                      <button
                        onClick={() => handleRemoveFromQueue(index)}
                        className="text-spotify-gray hover:text-red-400 text-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
