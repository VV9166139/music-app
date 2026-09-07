import React, { useState } from 'react';
import { 
  Heart, 
  Disc, 
  Clock, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  ListMusic 
} from 'lucide-react';
import { useMusicData } from '../../context/MusicDataContext';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { CurrentView, Song } from '../../types';
import { SongRow } from '../common/SongRow';
import { MusicCard } from '../common/MusicCard';

interface LibraryViewProps {
  currentView: CurrentView;
  onNavigate: (view: CurrentView) => void;
  onOpenCreatePlaylist: () => void;
  onOpenAddToPlaylist: (song: Song) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  currentView,
  onNavigate,
  onOpenCreatePlaylist,
  onOpenAddToPlaylist,
}) => {
  const { songs, playlists, albums, favorites, recentlyPlayed } = useMusicData();
  const { currentSong, isPlaying, playSong, togglePlay } = useAudioPlayer();

  const initialTab = currentView.type === 'library' ? currentView.tab || 'playlists' : 'playlists';
  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'albums' | 'recent'>(initialTab);

  // Liked songs list
  const likedSongs = songs.filter((s) => favorites.includes(s.id));

  const isLikedPlaying = likedSongs.some((s) => s.id === currentSong?.id) && isPlaying;

  const handlePlayLiked = () => {
    if (likedSongs.length === 0) return;
    if (isLikedPlaying) {
      togglePlay();
    } else {
      playSong(likedSongs[0], likedSongs);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Library Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('playlists')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'playlists'
                ? 'bg-indigo-600 text-white shadow-neon-purple'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Playlists ({playlists.length})
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'liked'
                ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Liked Tracks ({likedSongs.length})
          </button>

          <button
            onClick={() => setActiveTab('albums')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'albums'
                ? 'bg-indigo-600 text-white shadow-neon-purple'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Saved Albums ({albums.length})
          </button>

          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'recent'
                ? 'bg-indigo-600 text-white shadow-neon-purple'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            History ({recentlyPlayed.length})
          </button>
        </div>

        {activeTab === 'playlists' && (
          <button
            onClick={onOpenCreatePlaylist}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-neon-purple transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Playlist</span>
          </button>
        )}
      </div>

      {/* TAB 1: PLAYLISTS */}
      {activeTab === 'playlists' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Create New Playlist Action Card */}
          <div
            onClick={onOpenCreatePlaylist}
            className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer min-h-[220px] text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              Create Playlist
            </h4>
            <p className="text-xs text-slate-400 mt-1">Add tracks & curate custom vibes</p>
          </div>

          {playlists.map((pl) => (
            <MusicCard
              key={pl.id}
              item={{ type: 'playlist', data: pl }}
              onClick={() => onNavigate({ type: 'playlist', id: pl.id })}
            />
          ))}
        </div>
      )}

      {/* TAB 2: LIKED SONGS */}
      {activeTab === 'liked' && (
        <div className="space-y-6">
          {/* Hero Banner for Liked Songs */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-rose-900/40 via-indigo-950/50 to-[#07090E] border border-rose-500/20 p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-indigo-600 to-rose-500 flex items-center justify-center text-white shadow-neon-purple flex-shrink-0">
              <Heart className="w-16 h-16 fill-current drop-shadow" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Auto Playlist
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white">Liked Songs</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {likedSongs.length} favorite {likedSongs.length === 1 ? 'track' : 'tracks'} stored in high quality
              </p>

              {likedSongs.length > 0 && (
                <div className="pt-3">
                  <button
                    onClick={handlePlayLiked}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    {isLikedPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Pause Liked</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                        <span>Play Liked Songs</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Song list */}
          {likedSongs.length === 0 ? (
            <div className="text-center py-16 bg-[#121624]/40 rounded-2xl border border-white/5 p-8">
              <Heart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No liked tracks yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Click the heart icon on any song to save it here for fast playback.
              </p>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-2 sm:p-4 divide-y divide-white/[0.04]">
              {likedSongs.map((song, idx) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={idx}
                  playlistContext={likedSongs}
                  onNavigateArtist={(id) => onNavigate({ type: 'artist', id })}
                  onNavigateAlbum={(id) => onNavigate({ type: 'album', id })}
                  onOpenAddToPlaylist={onOpenAddToPlaylist}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALBUMS */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {albums.map((album) => (
            <MusicCard
              key={album.id}
              item={{ type: 'album', data: album }}
              onClick={() => onNavigate({ type: 'album', id: album.id })}
            />
          ))}
        </div>
      )}

      {/* TAB 4: RECENT HISTORY */}
      {activeTab === 'recent' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Recently Streamed Tracks</h3>
          </div>

          {recentlyPlayed.length === 0 ? (
            <div className="text-center py-16 bg-[#121624]/40 rounded-2xl border border-white/5 p-8">
              <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">Playback history is empty</p>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-2 sm:p-4 divide-y divide-white/[0.04]">
              {recentlyPlayed.map((song, idx) => (
                <SongRow
                  key={`${song.id}-${idx}`}
                  song={song}
                  index={idx}
                  playlistContext={recentlyPlayed}
                  onNavigateArtist={(id) => onNavigate({ type: 'artist', id })}
                  onNavigateAlbum={(id) => onNavigate({ type: 'album', id })}
                  onOpenAddToPlaylist={onOpenAddToPlaylist}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
