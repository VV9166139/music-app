import React, { useState, useEffect } from 'react';
import { X, Image, Music, Disc } from 'lucide-react';
import { Playlist } from '../../types';
import { useMusicData } from '../../context/MusicDataContext';

interface EditPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist?: Playlist | null; // if provided, editing; if null, creating
}

export const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({
  isOpen,
  onClose,
  playlist,
}) => {
  const { createPlaylist, updatePlaylist } = useMusicData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title);
      setDescription(playlist.description || '');
      setCoverUrl(playlist.cover_url || '');
    } else {
      setTitle('');
      setDescription('');
      setCoverUrl('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80');
    }
  }, [playlist, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (playlist) {
      updatePlaylist(playlist.id, {
        title: title.trim(),
        description: description.trim(),
        cover_url: coverUrl.trim() || undefined,
      });
    } else {
      createPlaylist(title.trim(), description.trim(), coverUrl.trim());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#101422] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Disc className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {playlist ? 'Edit Playlist Details' : 'Create New Playlist'}
            </h3>
            <p className="text-xs text-slate-400">Curate and organize your favorite soundscapes</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-2">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10 shadow-lg">
              <img
                src={coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <div className="w-full">
              <label className="block text-xs font-medium text-slate-300 mb-1">Cover Artwork URL</label>
              <div className="relative">
                <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full bg-[#161B2E] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Paste any direct image link or Unsplash URL</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Playlist Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Midnight Cyber Drive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Description (optional)</label>
            <textarea
              rows={3}
              placeholder="Give your playlist a mood or backstory..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-neon-purple transition-all"
            >
              {playlist ? 'Save Changes' : 'Create Playlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
