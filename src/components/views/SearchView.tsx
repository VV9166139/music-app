import React, { useState, useMemo } from 'react';
import { Search, X, Music, User, Disc, Radio, Filter, Sparkles } from 'lucide-react';
import { useMusicData } from '../../context/MusicDataContext';
import { CurrentView, Song } from '../../types';
import { SongRow } from '../common/SongRow';
import { MusicCard } from '../common/MusicCard';

interface SearchViewProps {
  currentView: CurrentView;
  onNavigate: (view: CurrentView) => void;
  onOpenAddToPlaylist: (song: Song) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  currentView,
  onNavigate,
  onOpenAddToPlaylist,
}) => {
  const { songs, artists, albums, playlists, genres } = useMusicData();

  const initialQuery = currentView.type === 'search' ? currentView.query || '' : '';
  const initialCategory = currentView.type === 'search' ? currentView.category || 'all' : 'all';

  const [query, setQuery] = useState(initialQuery);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'songs' | 'artists' | 'albums' | 'playlists'>(
    'all'
  );
  const [activeGenre, setActiveGenre] = useState<string | null>(
    currentView.type === 'search' && currentView.category && currentView.category !== 'all'
      ? currentView.category
      : null
  );

  const cleanQuery = query.trim().toLowerCase();

  // Filtered lists
  const filteredSongs = useMemo(() => {
    return songs.filter((s) => {
      const matchText = !cleanQuery || 
        s.title.toLowerCase().includes(cleanQuery) || 
        s.artist_name.toLowerCase().includes(cleanQuery) ||
        (s.album_title && s.album_title.toLowerCase().includes(cleanQuery));
      const matchGenre = !activeGenre || s.genre_name?.toLowerCase() === activeGenre.toLowerCase();
      return matchText && matchGenre;
    });
  }, [songs, cleanQuery, activeGenre]);

  const filteredArtists = useMemo(() => {
    if (activeGenre) return [];
    return artists.filter((a) => {
      return !cleanQuery || 
        a.name.toLowerCase().includes(cleanQuery) || 
        a.bio.toLowerCase().includes(cleanQuery);
    });
  }, [artists, cleanQuery, activeGenre]);

  const filteredAlbums = useMemo(() => {
    return albums.filter((al) => {
      const matchText = !cleanQuery || 
        al.title.toLowerCase().includes(cleanQuery) || 
        (al.artist_name && al.artist_name.toLowerCase().includes(cleanQuery));
      return matchText;
    });
  }, [albums, cleanQuery]);

  const filteredPlaylists = useMemo(() => {
    return playlists.filter((p) => {
      return !cleanQuery || 
        p.title.toLowerCase().includes(cleanQuery) || 
        p.description.toLowerCase().includes(cleanQuery);
    });
  }, [playlists, cleanQuery]);

  const hasSearch = Boolean(cleanQuery || activeGenre);
  const totalResults = filteredSongs.length + filteredArtists.length + filteredAlbums.length + filteredPlaylists.length;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Search Header Bar */}
      <div className="space-y-4">
        <h1 className="text-3xl font-black text-white">Search & Discover</h1>

        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tracks, artists, albums, or audio genres..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#121624] border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {(['all', 'songs', 'artists', 'albums', 'playlists'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                selectedFilter === filter
                  ? 'bg-indigo-600 text-white shadow-neon-purple'
                  : 'bg-[#121624] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {filter}
            </button>
          ))}

          {activeGenre && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
              <span>Genre: {activeGenre}</span>
              <button onClick={() => setActiveGenre(null)} className="hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results or Genre Grid */}
      {hasSearch ? (
        totalResults === 0 ? (
          <div className="text-center py-20 bg-[#121624]/40 rounded-3xl border border-white/5 p-8">
            <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No matches found for "{query}"</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
              Try searching with another keyword, artist name, or explore available genres below.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setActiveGenre(null);
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Song Result (if any) */}
            {(selectedFilter === 'all' || selectedFilter === 'songs') && filteredSongs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">Tracks ({filteredSongs.length})</h3>
                <div className="glass-panel rounded-2xl p-2 divide-y divide-white/[0.04]">
                  {filteredSongs.map((song, idx) => (
                    <SongRow
                      key={song.id}
                      song={song}
                      index={idx}
                      playlistContext={filteredSongs}
                      onNavigateArtist={(id) => onNavigate({ type: 'artist', id })}
                      onNavigateAlbum={(id) => onNavigate({ type: 'album', id })}
                      onOpenAddToPlaylist={onOpenAddToPlaylist}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Matching Artists */}
            {(selectedFilter === 'all' || selectedFilter === 'artists') && filteredArtists.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">Artists ({filteredArtists.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredArtists.map((artist) => (
                    <MusicCard
                      key={artist.id}
                      item={{ type: 'artist', data: artist }}
                      onClick={() => onNavigate({ type: 'artist', id: artist.id })}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Matching Albums */}
            {(selectedFilter === 'all' || selectedFilter === 'albums') && filteredAlbums.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">Albums ({filteredAlbums.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredAlbums.map((album) => (
                    <MusicCard
                      key={album.id}
                      item={{ type: 'album', data: album }}
                      onClick={() => onNavigate({ type: 'album', id: album.id })}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Matching Playlists */}
            {(selectedFilter === 'all' || selectedFilter === 'playlists') && filteredPlaylists.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">Playlists ({filteredPlaylists.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredPlaylists.map((pl) => (
                    <MusicCard
                      key={pl.id}
                      item={{ type: 'playlist', data: pl }}
                      onClick={() => onNavigate({ type: 'playlist', id: pl.id })}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        /* Empty State: Explore All Soundscapes & Genres */
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Browse All Categories & Genres</h2>
            <p className="text-xs text-slate-400 mt-0.5">Explore tailored sonic atmospheres and audio spectra</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {genres.map((genre) => (
              <div
                key={genre.id}
                onClick={() => setActiveGenre(genre.name)}
                className="group relative h-36 rounded-2xl overflow-hidden p-5 cursor-pointer shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  background: `linear-gradient(135deg, ${genre.color} 0%, #080C16 100%)`
                }}
              >
                {genre.cover_url && (
                  <img
                    src={genre.cover_url}
                    alt={genre.name}
                    className="absolute right-0 bottom-0 w-24 h-24 object-cover rounded-tl-2xl shadow-2xl transform rotate-12 translate-x-4 translate-y-4 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 opacity-80"
                  />
                )}
                <h3 className="relative z-10 text-lg font-black text-white drop-shadow">
                  {genre.name}
                </h3>
                <span className="relative z-10 text-[11px] font-semibold text-white/80 uppercase tracking-wider block mt-1">
                  Browse Tracks
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
