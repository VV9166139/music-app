import React from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  TrendingUp, 
  Radio, 
  Disc, 
  Users, 
  ArrowRight,
  Flame,
  Volume2
} from 'lucide-react';
import { useMusicData } from '../../context/MusicDataContext';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { CurrentView, Song, Album, Artist, Genre } from '../../types';
import { MusicCard } from '../common/MusicCard';
import { SongRow } from '../common/SongRow';

interface HomeViewProps {
  onNavigate: (view: CurrentView) => void;
  onOpenAddToPlaylist: (song: Song) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenAddToPlaylist }) => {
  const { songs, artists, albums, genres, recentlyPlayed } = useMusicData();
  const { currentSong, isPlaying, playSong, togglePlay } = useAudioPlayer();

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const featuredSong = songs[0] || null;
  const isPlayingFeatured = currentSong?.id === featuredSong?.id && isPlaying;

  const handleFeaturedPlay = () => {
    if (!featuredSong) return;
    if (currentSong?.id === featuredSong.id) {
      togglePlay();
    } else {
      playSong(featuredSong, songs);
    }
  };

  const quickGridItems = songs.slice(0, 6);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-300">
      {/* Dynamic Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated For You</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {getGreeting()}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Lossless Studio Streaming</span>
          </span>
        </div>
      </div>

      {/* Featured Hero Banner */}
      {featuredSong && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#12162A] via-[#1B1B3A] to-[#0D182A] border border-white/10 shadow-2xl group">
          {/* Ambient background glow */}
          <div 
            className="absolute -right-16 -top-16 w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #6366F1 0%, transparent 70%)' }}
          />
          <div 
            className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 gap-8">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>HOT SPOTLIGHT • TRENDING #1</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {featuredSong.title}
                </h2>
                <p 
                  onClick={() => onNavigate({ type: 'artist', id: featuredSong.artist_id })}
                  className="text-base sm:text-xl text-slate-300 font-medium mt-1 cursor-pointer hover:text-indigo-400 transition-colors inline-block"
                >
                  {featuredSong.artist_name}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                Experience high-octane synth basslines and luminous dreamscapes mastered in ultra high fidelity. Listen now in full studio resolution.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <button
                  onClick={handleFeaturedPlay}
                  className="flex items-center gap-3 px-7 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-neon-purple transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {isPlayingFeatured ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>Pause Playback</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                      <span>Play Track</span>
                    </>
                  )}
                </button>

                {featuredSong.album_id && (
                  <button
                    onClick={() => onNavigate({ type: 'album', id: featuredSong.album_id! })}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/15 transition-all"
                  >
                    <Disc className="w-4 h-4 text-indigo-300" />
                    <span>View Album</span>
                  </button>
                )}
              </div>
            </div>

            {/* Artwork Card */}
            <div className="relative flex-shrink-0 w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/15 group-hover:scale-105 transition-transform duration-500">
              <img
                src={featuredSong.cover_url}
                alt={featuredSong.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                <span className="font-semibold">{featuredSong.genre_name || 'Synthwave'}</span>
                <span className="font-mono text-slate-300">{(featuredSong.plays_count || 1420).toLocaleString()} streams</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick 6-Pack Grid (Fast 1-click play) */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Quick Play</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickGridItems.map((song) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;
            return (
              <div
                key={song.id}
                onClick={() => {
                  if (currentSong?.id === song.id) {
                    togglePlay();
                  } else {
                    playSong(song, songs);
                  }
                }}
                className={`group flex items-center justify-between p-2 rounded-xl bg-[#121624]/60 hover:bg-[#1A2133] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer shadow-md ${
                  isThisPlaying ? 'bg-indigo-600/20 border-indigo-500/40' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={song.cover_url}
                    alt={song.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                      {song.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{song.artist_name}</p>
                  </div>
                </div>

                <button
                  className={`w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-neon-purple transition-all duration-200 transform mr-2 ${
                    isThisPlaying ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75'
                  }`}
                  title={isThisPlaying ? 'Pause' : 'Play'}
                >
                  {isThisPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Tracks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Trending Streams</h3>
          </div>
          <button
            onClick={() => onNavigate({ type: 'search' })}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-300 transition-colors"
          >
            <span>See all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="glass-panel rounded-2xl p-2 sm:p-4 divide-y divide-white/[0.04]">
          {songs.slice(0, 5).map((song, idx) => (
            <SongRow
              key={song.id}
              song={song}
              index={idx}
              playlistContext={songs}
              onNavigateArtist={(artistId) => onNavigate({ type: 'artist', id: artistId })}
              onNavigateAlbum={(albumId) => onNavigate({ type: 'album', id: albumId })}
              onOpenAddToPlaylist={onOpenAddToPlaylist}
            />
          ))}
        </div>
      </div>

      {/* Featured Artists (Round Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Top Artists</h3>
          </div>
          <button
            onClick={() => onNavigate({ type: 'search' })}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-300 transition-colors"
          >
            <span>Explore artists</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {artists.map((artist) => (
            <MusicCard
              key={artist.id}
              item={{ type: 'artist', data: artist }}
              onClick={() => onNavigate({ type: 'artist', id: artist.id })}
            />
          ))}
        </div>
      </div>

      {/* Popular Albums */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Popular Albums & EPs</h3>
          </div>
          <button
            onClick={() => onNavigate({ type: 'search' })}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-300 transition-colors"
          >
            <span>See more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {albums.map((album) => (
            <MusicCard
              key={album.id}
              item={{ type: 'album', data: album }}
              onClick={() => onNavigate({ type: 'album', id: album.id })}
            />
          ))}
        </div>
      </div>

      {/* Explore By Genre Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>Explore Soundscapes by Genre</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <div
              key={genre.id}
              onClick={() => onNavigate({ type: 'search', category: genre.name })}
              className="group relative h-28 rounded-2xl overflow-hidden p-4 cursor-pointer shadow-lg hover:shadow-indigo-500/20 transition-all hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${genre.color}99 0%, #0D121E 100%)`
              }}
            >
              {genre.cover_url && (
                <img
                  src={genre.cover_url}
                  alt={genre.name}
                  className="absolute right-0 bottom-0 w-20 h-20 object-cover rounded-tl-2xl shadow-xl transform rotate-12 translate-x-3 translate-y-3 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 opacity-80"
                />
              )}
              <h4 className="relative z-10 text-base font-black text-white drop-shadow">
                {genre.name}
              </h4>
              <span className="relative z-10 text-[10px] uppercase font-bold text-white/70 tracking-wider">
                Explore Tracks
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
