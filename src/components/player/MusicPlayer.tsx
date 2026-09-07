import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Heart, 
  ListMusic, 
  Plus, 
  Maximize2, 
  Minimize2,
  Music2
} from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useMusicData } from '../../context/MusicDataContext';
import { formatDuration } from '../../utils/formatters';
import { QueueDrawer } from './QueueDrawer';

interface MusicPlayerProps {
  onOpenAddToPlaylist?: () => void;
  onNavigateArtist?: (artistId: string) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  onOpenAddToPlaylist,
  onNavigateArtist,
}) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffle,
    isLoadingAudio,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  } = useAudioPlayer();

  const { isFavorite, toggleFavorite } = useMusicData();
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentSong) return null;

  const liked = isFavorite(currentSong.id);
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Persistent Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass-dock px-3 sm:px-6 py-2.5 shadow-2xl transition-all">
        {/* Mobile Scrubber on top border */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-indigo-500 shadow-neon-purple transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Track Info & Artwork */}
          <div className="flex items-center gap-3 min-w-0 w-1/4 sm:w-1/3">
            <div 
              onClick={() => setIsExpanded(true)}
              className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg flex-shrink-0 cursor-pointer group bg-black/50"
            >
              <img
                src={currentSong.cover_url}
                alt={currentSong.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h4 
                onClick={() => setIsExpanded(true)}
                className="font-bold text-sm text-white truncate hover:text-indigo-400 cursor-pointer transition-colors"
              >
                {currentSong.title}
              </h4>
              <p
                onClick={() => onNavigateArtist && onNavigateArtist(currentSong.artist_id)}
                className="text-xs text-slate-400 truncate hover:text-white cursor-pointer transition-colors"
              >
                {currentSong.artist_name}
              </p>
            </div>

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(currentSong.id)}
              className={`p-1.5 rounded-full transition-transform active:scale-90 hidden sm:block ${
                liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
              }`}
              title={liked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </button>

            {/* Add to Playlist button */}
            {onOpenAddToPlaylist && (
              <button
                onClick={onOpenAddToPlaylist}
                className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors hidden sm:block"
                title="Add to Playlist"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Center: Controls & Scrubber */}
          <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl">
            {/* Playback Buttons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleShuffle}
                className={`p-1.5 rounded-full transition-colors hidden sm:block ${
                  isShuffle ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={prevTrack}
                className="p-1.5 text-slate-300 hover:text-white transition-transform active:scale-95"
                title="Previous track"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                disabled={isLoadingAudio}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-neon-purple transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isLoadingAudio ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-1.5 text-slate-300 hover:text-white transition-transform active:scale-95"
                title="Next track"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={cycleRepeat}
                className={`p-1.5 rounded-full transition-colors hidden sm:block ${
                  repeatMode !== 'off' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Desktop Scrubber Bar */}
            <div className="w-full hidden md:flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400 w-9 text-right">
                {formatDuration(currentTime)}
              </span>

              <div className="relative flex-1 flex items-center group">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none bg-slate-800 cursor-pointer accent-indigo-500 hover:h-2 transition-all"
                />
              </div>

              <span className="text-[11px] font-mono text-slate-400 w-9">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Right: Volume & Extra Utilities */}
          <div className="flex items-center justify-end gap-2.5 w-1/4 sm:w-1/3">
            {/* Equalizer Wave Indicator */}
            {isPlaying && (
              <div className="hidden lg:flex items-end gap-0.5 h-4 px-2">
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
              </div>
            )}

            {/* Volume controls */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-slate-400 hover:text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 h-1.5 bg-slate-800 rounded-lg cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Queue drawer toggle */}
            <button
              onClick={() => setIsQueueOpen(!isQueueOpen)}
              className={`p-2 rounded-xl transition-colors ${
                isQueueOpen ? 'bg-indigo-600/30 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Queue"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Up Next Queue Drawer */}
      <QueueDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />

      {/* Expanded Full-Screen Visual Experience Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-[#07090E]/95 backdrop-blur-2xl flex flex-col p-6 sm:p-12 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-indigo-400">
              <Music2 className="w-6 h-6" />
              <span className="font-bold text-sm tracking-wider uppercase">Now Streaming</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-5xl mx-auto w-full">
            {/* Big Artwork with Ambient Glow */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={currentSong.cover_url}
                alt={currentSong.title}
                className="w-full h-full object-cover shadow-2xl"
              />
              <div
                className="absolute inset-0 -z-10 blur-3xl opacity-40 scale-110"
                style={{ backgroundImage: `url(${currentSong.cover_url})` }}
              />
            </div>

            {/* Track Info & Massive Scrubber */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 max-w-lg">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 mb-3">
                {currentSong.genre_name || 'Stream Track'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
                {currentSong.title}
              </h2>
              <p className="text-base sm:text-lg text-slate-400 mb-8 font-medium">
                {currentSong.artist_name}
              </p>

              {/* Scrubber */}
              <div className="w-full mb-6">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none bg-white/10 cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-xs font-mono text-slate-400 mt-2">
                  <span>{formatDuration(currentTime)}</span>
                  <span>{formatDuration(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 transition-colors ${isShuffle ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <Shuffle className="w-5 h-5" />
                </button>
                <button onClick={prevTrack} className="text-white hover:text-indigo-400 p-2">
                  <SkipBack className="w-7 h-7 fill-current" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-neon-purple transition-transform hover:scale-110 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ml-1" />
                  )}
                </button>
                <button onClick={nextTrack} className="text-white hover:text-indigo-400 p-2">
                  <SkipForward className="w-7 h-7 fill-current" />
                </button>
                <button
                  onClick={cycleRepeat}
                  className={`p-2 transition-colors ${repeatMode !== 'off' ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <Repeat className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
