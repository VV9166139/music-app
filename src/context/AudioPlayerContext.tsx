import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Song, RepeatMode } from '../types';
import { SEED_SONGS } from '../data/seedData';
import { useToast } from './ToastContext';

interface AudioPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  queue: Song[];
  queueIndex: number;
  isLoadingAudio: boolean;
  
  // Controls
  playSong: (song: Song, playlistContext?: Song[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  
  // Queue manipulation
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(() => {
    const saved = localStorage.getItem('aura_last_played_song');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SEED_SONGS[0];
      }
    }
    return SEED_SONGS[0];
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [queue, setQueue] = useState<Song[]>(SEED_SONGS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);

  const { showToast } = useToast();

  // Initialize singleton audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoadingAudio(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      handleTrackEnded();
    };

    const handleWaiting = () => setIsLoadingAudio(true);
    const handleCanPlay = () => setIsLoadingAudio(false);
    const handleError = (e: Event) => {
      console.warn('Audio playback error (trying fallback audio):', e);
      setIsLoadingAudio(false);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Update volume on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Load and play when song changes
  const playSong = (song: Song, playlistContext?: Song[]) => {
    setCurrentSong(song);
    localStorage.setItem('aura_last_played_song', JSON.stringify(song));

    if (playlistContext && playlistContext.length > 0) {
      const idx = playlistContext.findIndex((s) => s.id === song.id);
      setQueue(playlistContext);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else {
      // If song not in queue, add it right after current
      if (!queue.find((s) => s.id === song.id)) {
        const newQueue = [...queue, song];
        setQueue(newQueue);
        setQueueIndex(newQueue.length - 1);
      } else {
        const idx = queue.findIndex((s) => s.id === song.id);
        setQueueIndex(idx);
      }
    }

    if (audioRef.current) {
      setIsLoadingAudio(true);
      audioRef.current.src = song.audio_url;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        })
        .catch((err) => {
          console.warn('Auto-play prevented or error:', err);
          setIsPlaying(false);
          setIsLoadingAudio(false);
        });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src && currentSong) {
        audioRef.current.src = currentSong.audio_url;
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Play error:', err);
          setIsPlaying(false);
        });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const nextTrack = () => {
    if (queue.length === 0) return;

    let nextIdx: number;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = (queueIndex + 1) % queue.length;
    }

    setQueueIndex(nextIdx);
    playSong(queue[nextIdx]);
  };

  const prevTrack = () => {
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart song
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    const prevIdx = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
    setQueueIndex(prevIdx);
    playSong(queue[prevIdx]);
  };

  const handleTrackEnded = () => {
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all') {
      nextTrack();
    } else {
      // Repeat off: advance if not at last track
      if (queueIndex < queue.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    }
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    showToast(isShuffle ? 'Shuffle off' : 'Shuffle on', 'info');
  };

  const cycleRepeat = () => {
    if (repeatMode === 'off') {
      setRepeatMode('all');
      showToast('Repeat all tracks', 'info');
    } else if (repeatMode === 'all') {
      setRepeatMode('one');
      showToast('Repeat current track', 'info');
    } else {
      setRepeatMode('off');
      showToast('Repeat off', 'info');
    }
  };

  const addToQueue = (song: Song) => {
    setQueue((prev) => [...prev, song]);
    showToast(`Added "${song.title}" to play queue`, 'success');
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
    if (index < queueIndex) {
      setQueueIndex((prev) => prev - 1);
    }
  };

  const clearQueue = () => {
    if (currentSong) {
      setQueue([currentSong]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
    showToast('Queue cleared', 'info');
  };

  const reorderQueue = (startIndex: number, endIndex: number) => {
    const result = Array.from(queue);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setQueue(result);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        duration,
        currentTime,
        volume,
        isMuted,
        repeatMode,
        isShuffle,
        queue,
        queueIndex,
        isLoadingAudio,
        playSong,
        togglePlay,
        pause,
        resume,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        reorderQueue,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
