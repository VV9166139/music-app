import React, { useState, useEffect } from 'react';
import { X, User, Image, CheckCircle, Save } from 'lucide-react';
import { Artist } from '../../types';
import { useMusicData } from '../../context/MusicDataContext';

interface ArtistFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist?: Artist | null;
}

export const ArtistFormModal: React.FC<ArtistFormModalProps> = ({
  isOpen,
  onClose,
  artist,
}) => {
  const { addArtist, updateArtist } = useMusicData();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [listeners, setListeners] = useState('100000');
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    if (artist) {
      setName(artist.name);
      setBio(artist.bio);
      setImageUrl(artist.image_url);
      setListeners(String(artist.monthly_listeners));
      setVerified(artist.verified);
    } else {
      setName('');
      setBio('');
      setImageUrl('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80');
      setListeners('250000');
      setVerified(true);
    }
  }, [artist, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      name: name.trim(),
      bio: bio.trim(),
      image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
      monthly_listeners: Number(listeners) || 0,
      verified,
    };

    if (artist) {
      updateArtist(artist.id, data);
    } else {
      addArtist(data);
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
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {artist ? 'Edit Artist Profile' : 'Add New Artist'}
            </h3>
            <p className="text-xs text-slate-400">Manage creator information and verified status</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={imageUrl || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80'}
              alt="Artist"
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50"
            />
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-300 mb-1">Artist Profile Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Artist Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kavinsky Nebula"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Listeners</label>
            <input
              type="number"
              value={listeners}
              onChange={(e) => setListeners(e.target.value)}
              className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Biography</label>
            <textarea
              rows={3}
              placeholder="Artist description, genre influences, background..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="verifiedCheck"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-white/20 bg-slate-800"
            />
            <label htmlFor="verifiedCheck" className="text-xs text-slate-300 cursor-pointer flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Verified Artist Badge</span>
            </label>
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
              <span>{artist ? 'Update Artist' : 'Create Artist'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
