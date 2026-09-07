import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, MoreVertical, Plus, ListPlus, Disc, User, Radio } from 'lucide-react';
import { Song } from '../../types';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useMusicData } from '../../context/MusicDataContext';
import { formatDuration } from '../../utils/formatters';

interface SongRowProps {
  song: Song;
  index: number;
  playlistContext?: Song[];
  showAlbum?: boolean;
  onNavigateArtist?: (artistId: string) => void;
  onNavigateAlbum?: (albumId: string) => void;
  onOpenAddToPlaylist?: (song: Song) => void;
  onRemoveFromPlaylist?: (songId: string) => void;
}

export const SongRow: React.FC<SongRowProps> = ({
  song,
  index,
  playlistContext,
  showAlbum = true,
  onNavigateArtist,
  onNavigateAlbum,
  onOpenAddToPlaylist,
  onRemoveFromPlaylist,
}) => {
  const { currentSong, isPlaying, playSong, togglePlay, addToQueue } = useAudioPlayer();
  const { isFavorite, toggleFavorite } = useMusicData();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isCurrentSong = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;
  const liked = isFavorite(song.id);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handlePlayClick = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song, playlistContext);
    }
  };

  return (
    <div
      className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/[0.06] ${
        isCurrentSong ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-300'
      }`}
    >
      {/* Left: Index & Artwork & Titles */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Play/Index Button */}
        <div className="w-7 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-slate-400">
          {isCurrentlyPlaying ? (
            <div className="flex items-end gap-0.5 h-3.5">
              <span className="equalizer-bar" />
              <span className="equalizer-bar" />
              <span className="equalizer-bar" />
              <span className="equalizer-bar" />
            </div>
          ) : (
            <>
              <span className="group-hover:hidden">{index + 1}</span>
              <button
                onClick={handlePlayClick}
                className="hidden group-hover:flex items-center justify-center text-white hover:text-indigo-400 transition-colors"
                title="Play track"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            </>
          )}
        </div>

        {/* Artwork */}
        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
          <img
            src={song.cover_url}
            alt={song.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {isCurrentlyPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Pause
                onClick={handlePlayClick}
                className="w-4 h-4 text-indigo-400 fill-indigo-400 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Title & Artist */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4
              onClick={handlePlayClick}
              className={`font-semibold text-sm truncate cursor-pointer transition-colors ${
                isCurrentSong ? 'text-indigo-400 font-bold' : 'text-white group-hover:text-indigo-300'
              }`}
            >
              {song.title}
            </h4>
            {song.status === 'draft' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Draft
              </span>
            )}
          </div>
          <p
            onClick={() => onNavigateArtist && onNavigateArtist(song.artist_id)}
            className="text-xs text-slate-400 truncate hover:text-white cursor-pointer transition-colors"
          >
            {song.artist_name}
          </p>
        </div>
      </div>

      {/* Center: Album (hidden on mobile) */}
      {showAlbum && (
        <div className="hidden md:block flex-1 px-4 min-w-0">
          <p
            onClick={() => song.album_id && onNavigateAlbum && onNavigateAlbum(song.album_id)}
            className="text-xs text-slate-400 hover:text-white truncate cursor-pointer transition-colors"
          >
            {song.album_title || 'Single'}
          </p>
        </div>
      )}

      {/* Right: Like, Duration & Options */}
      <div className="flex items-center gap-3.5 flex-shrink-0">
        <button
          onClick={() => toggleFavorite(song.id)}
          className={`transition-all duration-200 ${
            liked
              ? 'text-rose-500 scale-110'
              : 'text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100'
          }`}
          title={liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>

        <span className="text-xs font-mono text-slate-400 w-10 text-right">
          {formatDuration(song.duration)}
        </span>

        {/* Context dropdown menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-[#131826] border border-white/10 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  addToQueue(song);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors"
              >
                <ListPlus className="w-4 h-4 text-indigo-400" />
                <span>Add to queue</span>
              </button>

              {onOpenAddToPlaylist && (
                <button
                  onClick={() => {
                    onOpenAddToPlaylist(song);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <span>Add to playlist</span>
                </button>
              )}

              {song.album_id && onNavigateAlbum && (
                <button
                  onClick={() => {
                    onNavigateAlbum(song.album_id!);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors"
                >
                  <Disc className="w-4 h-4 text-indigo-400" />
                  <span>Go to album</span>
                </button>
              )}

              {onNavigateArtist && (
                <button
                  onClick={() => {
                    onNavigateArtist(song.artist_id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Go to artist</span>
                </button>
              )}

              {onRemoveFromPlaylist && (
                <button
                  onClick={() => {
                    onRemoveFromPlaylist(song.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-white/5"
                >
                  <span>Remove from playlist</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
