import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Users, 
  Disc, 
  ArrowLeft,
  Sparkles,
  Heart
} from 'lucide-react';
import { useMusicData } from '../../context/MusicDataContext';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { CurrentView, Song } from '../../types';
import { SongRow } from '../common/SongRow';
import { MusicCard } from '../common/MusicCard';

interface ArtistDetailViewProps {
  artistId: string;
  onNavigate: (view: CurrentView) => void;
  onOpenAddToPlaylist: (song: Song) => void;
}

export const ArtistDetailView: React.FC<ArtistDetailViewProps> = ({
  artistId,
  onNavigate,
  onOpenAddToPlaylist,
}) => {
  const { artists, albums, songs } = useMusicData();
  const { currentSong, isPlaying, playSong, togglePlay } = useAudioPlayer();
  const [isFollowing, setIsFollowing] = useState(false);

  const artist = artists.find((a) => a.id === artistId);

  if (!artist) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="text-xl font-bold text-white">Artist not found</h2>
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-semibold text-white"
        >
          Return to Discover
        </button>
      </div>
    );
  }

  const artistSongs = songs.filter((s) => s.artist_id === artist.id);
  const artistAlbums = albums.filter((a) => a.artist_id === artist.id);

  const isCurrentArtistPlaying =
    artistSongs.some((s) => s.id === currentSong?.id) && isPlaying;

  const handlePlayArtist = () => {
    if (artistSongs.length === 0) return;
    if (isCurrentArtistPlaying) {
      togglePlay();
    } else {
      playSong(artistSongs[0], artistSongs);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Back button */}
      <button
        onClick={() => onNavigate({ type: 'home' })}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Artist Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#121626] via-[#1F1D36] to-[#0A0D18] border border-white/10 p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 shadow-2xl">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl flex-shrink-0 border-4 border-indigo-500/30">
          <img
            src={artist.image_url}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-3 text-center sm:text-left min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            {artist.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                <span>Verified Artist</span>
              </span>
            )}
            <span className="text-xs text-slate-400">
              {artist.monthly_listeners.toLocaleString()} monthly listeners
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {artist.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
            {artist.genres?.map((g) => (
              <span
                key={g}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePlayArtist}
          disabled={artistSongs.length === 0}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-neon-purple transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isCurrentArtistPlaying ? (
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
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-5 py-3 rounded-full text-xs font-bold border transition-all ${
            isFollowing
              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
              : 'border-white/20 text-white hover:border-white'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>

      {/* Top Tracks by Artist */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Popular Tracks</h3>

        {artistSongs.length === 0 ? (
          <div className="text-center py-10 bg-[#121624]/40 rounded-2xl border border-white/5 p-6">
            <p className="text-xs text-slate-400">No tracks available for this artist yet.</p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-2 sm:p-4 divide-y divide-white/[0.04]">
            {artistSongs.map((song, idx) => (
              <SongRow
                key={song.id}
                song={song}
                index={idx}
                playlistContext={artistSongs}
                onNavigateAlbum={(id) => onNavigate({ type: 'album', id })}
                onOpenAddToPlaylist={onOpenAddToPlaylist}
              />
            ))}
          </div>
        )}
      </div>

      {/* Discography / Albums */}
      {artistAlbums.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/10">
          <h3 className="text-lg font-bold text-white">Discography & Releases</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {artistAlbums.map((album) => (
              <MusicCard
                key={album.id}
                item={{ type: 'album', data: album }}
                onClick={() => onNavigate({ type: 'album', id: album.id })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Artist Bio & Info Card */}
      <div className="glass-panel rounded-2xl p-6 space-y-2">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">
          About {artist.name}
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">{artist.bio}</p>
      </div>
    </div>
  );
};
