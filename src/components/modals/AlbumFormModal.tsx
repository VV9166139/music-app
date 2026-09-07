import React, { useState, useEffect } from 'react';
import { X, Disc, Image, Save } from 'lucide-react';
import { Album, Artist } from '../../types';
import { useMusicData } from '../../context/MusicDataContext';

interface AlbumFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  album?: Album | null;
}

export const AlbumFormModal: React.FC<AlbumFormModalProps> = ({
  isOpen,
  onClose,
  album,
}) => {
  const { artists, addAlbum, updateAlbum } = useMusicData();
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState('');
  const [year, setYear] = useState('2024');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'unpublished'>('published');

  useEffect(() => {
    if (album) {
      setTitle(album.title);
      setArtistId(album.artist_id);
      setYear(String(album.release_year));
      setCoverUrl(album.cover_url);
      setDescription(album.description || '');
      setStatus(album.status);
    } else {
      setTitle('');
      setArtistId(artists[0]?.id || '');
      setYear('2024');
      setCoverUrl('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80');
      setDescription('');
      setStatus('published');
    }
  }, [album, isOpen, artists]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artistId) return;

    const selectedArtist = artists.find((a) => a.id === artistId);
    const data = {
      title: title.trim(),
      artist_id: artistId,
      artist_name: selectedArtist?.name || 'Artist',
      release_year: Number(year) || 2024,
      cover_url: coverUrl.trim() || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      description: description.trim(),
      status,
    };

    if (album) {
      updateAlbum(album.id, data);
    } else {
      addAlbum(data);
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
              {album ? 'Edit Album' : 'Create New Album'}
            </h3>
            <p className="text-xs text-slate-400">Manage release year, cover artwork & discography info</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={coverUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80'}
              alt="Album"
              className="w-16 h-16 rounded-xl object-cover border border-white/10"
            />
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-300 mb-1">Album Cover Artwork URL</label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Album Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Neon Odyssey 2099"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Artist *</label>
              <select
                value={artistId}
                onChange={(e) => setArtistId(e.target.value)}
                className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {artists.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Release Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Concept and album notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-neon-purple transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{album ? 'Update Album' : 'Create Album'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
