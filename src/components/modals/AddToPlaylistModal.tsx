import React from 'react';
import { X, Plus, Disc, Check } from 'lucide-react';
import { Song, Playlist } from '../../types';
import { useMusicData } from '../../context/MusicDataContext';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
  onOpenCreatePlaylist: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  song,
  onOpenCreatePlaylist,
}) => {
  const { playlists, addSongToPlaylist } = useMusicData();

  if (!isOpen || !song) return null;

  const handleSelectPlaylist = (playlistId: string) => {
    addSongToPlaylist(playlistId, song);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#101422] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1">Add Track to Playlist</h3>
        <p className="text-xs text-slate-400 mb-4 truncate">
          Select where to add <span className="text-indigo-300 font-medium">"{song.title}"</span>
        </p>

        {/* New playlist shortcut */}
        <button
          onClick={() => {
            onClose();
            onOpenCreatePlaylist();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 hover:bg-indigo-600/25 text-indigo-300 text-xs font-bold transition-all mb-4"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Plus className="w-4 h-4" />
          </div>
          <span>Create New Playlist</span>
        </button>

        {/* Existing Playlists list */}
        <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
          {playlists.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No playlists found yet.</p>
          ) : (
            playlists.map((pl: Playlist) => {
              const alreadyHas = pl.songs?.some((s) => s.id === song.id);
              return (
                <button
                  key={pl.id}
                  onClick={() => handleSelectPlaylist(pl.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={pl.cover_url}
                      alt={pl.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-white truncate">{pl.title}</h4>
                      <p className="text-[11px] text-slate-400">{pl.songs?.length || 0} tracks</p>
                    </div>
                  </div>
                  {alreadyHas && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium ml-2 flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
