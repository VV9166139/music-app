import React from 'react';
import { Play, Pause, CheckCircle2 } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { Song, Album, Playlist, Artist } from '../../types';

type CardItem = 
  | { type: 'song'; data: Song }
  | { type: 'album'; data: Album }
  | { type: 'playlist'; data: Playlist }
  | { type: 'artist'; data: Artist };

interface MusicCardProps {
  item: CardItem;
  onClick?: () => void;
  onPlayOverride?: () => void;
}

export const MusicCard: React.FC<MusicCardProps> = ({ item, onClick, onPlayOverride }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = useAudioPlayer();

  let title = '';
  let subtitle = '';
  let imageUrl = '';
  let isRound = false;
  let isPlayingThis = false;

  switch (item.type) {
    case 'song': {
      const s = item.data;
      title = s.title;
      subtitle = s.artist_name;
      imageUrl = s.cover_url;
      isPlayingThis = currentSong?.id === s.id && isPlaying;
      break;
    }
    case 'album': {
      const a = item.data;
      title = a.title;
      subtitle = `${a.artist_name || 'Artist'} • ${a.release_year}`;
      imageUrl = a.cover_url;
      break;
    }
    case 'playlist': {
      const p = item.data;
      title = p.title;
      subtitle = p.description || `${p.songs?.length || 0} tracks`;
      imageUrl = p.cover_url;
      break;
    }
    case 'artist': {
      const art = item.data;
      title = art.name;
      subtitle = `${(art.monthly_listeners / 1000).toFixed(0)}K monthly listeners`;
      imageUrl = art.image_url;
      isRound = true;
      break;
    }
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayOverride) {
      onPlayOverride();
      return;
    }
    if (item.type === 'song') {
      if (currentSong?.id === item.data.id) {
        togglePlay();
      } else {
        playSong(item.data);
      }
    } else if (item.type === 'playlist' && item.data.songs && item.data.songs.length > 0) {
      playSong(item.data.songs[0], item.data.songs);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col p-3.5 rounded-2xl bg-[#131826]/70 hover:bg-[#1A2133] border border-white/[0.05] hover:border-indigo-500/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1.5"
    >
      {/* Artwork container */}
      <div className={`relative w-full aspect-square overflow-hidden mb-3.5 ${isRound ? 'rounded-full' : 'rounded-xl'} bg-black/40 shadow-inner`}>
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isRound ? 'rounded-full' : ''}`}
          loading="lazy"
        />

        {/* Hover play button */}
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center ${
            isPlayingThis ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-neon-purple transform transition-transform duration-200 hover:scale-110 active:scale-95"
            title={isPlayingThis ? 'Pause' : 'Play'}
          >
            {isPlayingThis ? (
              <Pause className="w-5 h-5 fill-current text-white" />
            ) : (
              <Play className="w-5 h-5 fill-current text-white ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-bold text-sm text-white truncate group-hover:text-indigo-300 transition-colors">
            {title}
          </h3>
          {item.type === 'artist' && item.data.verified && (
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-slate-400 truncate mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
