import React from 'react';
import { 
  Play, 
  Pause, 
  Edit3, 
  Trash2, 
  Clock, 
  Music, 
  Plus, 
  Disc,
  ArrowLeft 
} from 'lucide-react';
import { useMusicData } from '../../context/MusicDataContext';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { CurrentView, Song, Playlist } from '../../types';
import { SongRow } from '../common/SongRow';
import { formatDuration } from '../../utils/formatters';

interface PlaylistDetailViewProps {
  playlistId: string;
  onNavigate: (view: CurrentView) => void;
  onOpenEditPlaylist: (playlist: Playlist) => void;
  onOpenAddToPlaylist: (song: Song) => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlistId,
  onNavigate,
  onOpenEditPlaylist,
  onOpenAddToPlaylist,
}) => {
  const { playlists, songs: allCatalogSongs, deletePlaylist, removeSongFromPlaylist, addSongToPlaylist } = useMusicData();
  const { currentSong, isPlaying, playSong, togglePlay } = useAudioPlayer();

  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="text-xl font-bold text-white">Playlist not found</h2>
        <button
          onClick={() => onNavigate({ type: 'library', tab: 'playlists' })}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-semibold text-white"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const playlistSongs = playlist.songs || [];
  const totalDurationSeconds = playlistSongs.reduce((sum, s) => sum + s.duration, 0);

  const isCurrentPlaylistPlaying =
    playlistSongs.some((s) => s.id === currentSong?.id) && isPlaying;

  const handlePlayAll = () => {
    if (playlistSongs.length === 0) return;
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${playlist.title}"?`)) {
      deletePlaylist(playlist.id);
      onNavigate({ type: 'library', tab: 'playlists' });
    }
  };

  // Recommended tracks not already in this playlist
  const suggestions = allCatalogSongs
    .filter((s) => !playlistSongs.some((ps) => ps.id === s.id))
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Back button */}
      <button
        onClick={() => onNavigate({ type: 'library', tab: 'playlists' })}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Playlists</span>
      </button>

      {/* Playlist Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#121626] via-[#1A2035] to-[#0E121E] border border-white/10 p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 shadow-2xl">
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-white/10 group">
          <img
            src={playlist.cover_url}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-3 text-center sm:text-left min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Curated Playlist
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight truncate">
            {playlist.title}
          </h1>

          {playlist.description && (
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {playlist.description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 pt-1">
            <span className="font-semibold text-white">{playlist.creator_name || 'You'}</span>
            <span>•</span>
            <span>{playlistSongs.length} tracks</span>
            <span>•</span>
            <span>{Math.floor(totalDurationSeconds / 60)} mins</span>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayAll}
            disabled={playlistSongs.length === 0}
            className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-neon-purple transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isCurrentPlaylistPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play All</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOpenEditPlaylist(playlist)}
            className="flex items-center gap-1.5 p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            title="Edit Details"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit Details</span>
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-colors"
            title="Delete Playlist"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Songs Table */}
      {playlistSongs.length === 0 ? (
        <div className="text-center py-16 bg-[#121624]/40 rounded-2xl border border-white/5 p-8">
          <Disc className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-200">This playlist is empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Discover tracks from our catalog or pick from the recommended additions below.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-2 sm:p-4 divide-y divide-white/[0.04]">
          {playlistSongs.map((song, idx) => (
            <SongRow
              key={`${song.id}-${idx}`}
              song={song}
              index={idx}
              playlistContext={playlistSongs}
              onNavigateArtist={(id) => onNavigate({ type: 'artist', id })}
              onNavigateAlbum={(id) => onNavigate({ type: 'album', id })}
              onOpenAddToPlaylist={onOpenAddToPlaylist}
              onRemoveFromPlaylist={(songId) => removeSongFromPlaylist(playlist.id, songId)}
            />
          ))}
        </div>
      )}

      {/* Suggested Songs to Add */}
      {suggestions.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Recommended Additions</h3>
              <p className="text-xs text-slate-400">Based on genres and vibes in this playlist</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-2 sm:p-3 divide-y divide-white/[0.04]">
            {suggestions.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={song.cover_url}
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-white truncate">{song.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{song.artist_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">
                    {formatDuration(song.duration)}
                  </span>
                  <button
                    onClick={() => addSongToPlaylist(playlist.id, song)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all hover:scale-105"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
