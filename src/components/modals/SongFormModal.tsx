import React, { useState, useEffect } from 'react';
import { X, Music, Image, Radio, Disc, Save } from 'lucide-react';
import { Song, Artist, Album, Genre } from '../../types';
import { useMusicData } from '../../context/MusicDataContext';

interface SongFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  song?: Song | null;
}

export const SongFormModal: React.FC<SongFormModalProps> = ({
  isOpen,
  onClose,
  song,
}) => {
  const { artists, albums, genres, addSong, updateSong } = useMusicData();

  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [genreId, setGenreId] = useState('');
  const [duration, setDuration] = useState('240');
  const [audioUrl, setAudioUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'unpublished'>('published');

  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setArtistId(song.artist_id);
      setAlbumId(song.album_id || '');
      setGenreId(song.genre_id || '');
      setDuration(String(song.duration));
      setAudioUrl(song.audio_url);
      setCoverUrl(song.cover_url);
      setStatus(song.status);
    } else {
      setTitle('');
      setArtistId(artists[0]?.id || '');
      setAlbumId(albums[0]?.id || '');
      setGenreId(genres[0]?.id || '');
      setDuration('245');
      setAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      setCoverUrl('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80');
      setStatus('published');
    }
  }, [song, isOpen, artists, albums, genres]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artistId) return;

    const selectedArtist = artists.find((a) => a.id === artistId);
    const selectedAlbum = albums.find((a) => a.id === albumId);
    const selectedGenre = genres.find((g) => g.id === genreId);

    const songData = {
      title: title.trim(),
      artist_id: artistId,
      artist_name: selectedArtist?.name || 'Unknown Artist',
      album_id: albumId || undefined,
      album_title: selectedAlbum?.title || undefined,
      genre_id: genreId || undefined,
      genre_name: selectedGenre?.name || undefined,
      duration: Number(duration) || 180,
      audio_url: audioUrl.trim(),
      cover_url: coverUrl.trim() || (selectedAlbum?.cover_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'),
      status,
    };

    if (song) {
      updateSong(song.id, songData);
    } else {
      addSong(songData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#101422] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
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
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {song ? 'Edit Song Track' : 'Add New Track to Catalog'}
            </h3>
            <p className="text-xs text-slate-400">Audio file metadata, playback stream & status</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Track Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Midnight Cyber Run"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Primary Artist *</label>
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
              <label className="block text-xs font-medium text-slate-300 mb-1">Album (Optional)</label>
              <select
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
                className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Standalone Single --</option>
                {albums.map((al) => (
                  <option key={al.id} value={al.id}>
                    {al.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Genre</label>
              <select
                value={genreId}
                onChange={(e) => setGenreId(e.target.value)}
                className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Duration (seconds)</label>
              <input
                type="number"
                min="10"
                max="3600"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Audio Stream URL (MP3/OGG/AAC)</label>
              <input
                type="url"
                required
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">Direct streamable URL from Supabase Storage or online CDN</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Cover Artwork URL</label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Catalog Status</label>
              <div className="flex gap-3">
                {(['published', 'draft', 'unpublished'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      status === s
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                        : 'bg-[#161B2E] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
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
              <span>{song ? 'Update Song' : 'Add to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
