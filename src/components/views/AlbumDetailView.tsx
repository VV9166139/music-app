import React from 'react';
import { 
  Play, 
  Pause, 
  Disc, 
  ArrowLeft, 
  Calendar, 
  Music, 
  User 
} from 'lucide-react';
import { useMusicData } from '../../context/MusicDataContext';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { CurrentView, Song } from '../../types';
import { SongRow } from '../common/SongRow';
import { MusicCard } from '../common/MusicCard';

interface AlbumDetailViewProps {
  albumId: string;
  onNavigate: (view: CurrentView) => void;
  onOpenAddToPlaylist: (song: Song) => void;
}

export const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({
  albumId,
  onNavigate,
  onOpenAddToPlaylist,
}) => {
  const { albums, songs, artists } = useMusicData();
  const { currentSong, isPlaying, playSong, togglePlay } = useAudioPlayer();

  const album = albums.find((a) => a.id === albumId);

  if (!album) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="text-xl font-bold text-white">Album not found</h2>
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-semibold text-white"
        >
          Return to Discover
        </button>
      </div>
    );
  }

  const albumSongs = songs.filter((s) => s.album_id === album.id);
  const artist = artists.find((a) => a.id === album.artist_id);
  const otherAlbums = albums.filter((a) => a.artist_id === album.artist_id && a.id !== album.id);

  const isCurrentAlbumPlaying =
    albumSongs.some((s) => s.id === currentSong?.id) && isPlaying;

  const handlePlayAlbum = () => {
    if (albumSongs.length === 0) return;
    if (isCurrentAlbumPlaying) {
      togglePlay();
    } else {
      playSong(albumSongs[0], albumSongs);
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

      {/* Album Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#121626] via-[#1E2338] to-[#0E121E] border border-white/10 p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 shadow-2xl">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-white/10">
          <img
            src={album.cover_url}
            alt={album.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-3 text-center sm:text-left min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Studio Album
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight truncate">
            {album.title}
          </h1>

          <p
            onClick={() => onNavigate({ type: 'artist', id: album.artist_id })}
            className="text-sm sm:text-base font-semibold text-indigo-400 hover:underline cursor-pointer inline-block"
          >
            {album.artist_name}
          </p>

          {album.description && (
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              {album.description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{album.release_year}</span>
            </span>
            <span>•</span>
            <span>{albumSongs.length} songs</span>
          </div>
        </div>
      </div>

      {/* Play Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePlayAlbum}
          disabled={albumSongs.length === 0}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-neon-purple transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isCurrentAlbumPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Album</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play Album</span>
            </>
          )}
        </button>
      </div>

      {/* Album Tracks Table */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Tracklist</h3>

        {albumSongs.length === 0 ? (
          <div className="text-center py-12 bg-[#121624]/40 rounded-2xl border border-white/5 p-6">
            <p className="text-xs text-slate-400">No tracks registered to this album yet.</p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-2 sm:p-4 divide-y divide-white/[0.04]">
            {albumSongs.map((song, idx) => (
              <SongRow
                key={song.id}
                song={song}
                index={idx}
                playlistContext={albumSongs}
                showAlbum={false}
                onNavigateArtist={(id) => onNavigate({ type: 'artist', id })}
                onOpenAddToPlaylist={onOpenAddToPlaylist}
              />
            ))}
          </div>
        )}
      </div>

      {/* More by Artist */}
      {otherAlbums.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/10">
          <h3 className="text-lg font-bold text-white">More by {album.artist_name}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {otherAlbums.map((other) => (
              <MusicCard
                key={other.id}
                item={{ type: 'album', data: other }}
                onClick={() => onNavigate({ type: 'album', id: other.id })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
