import React from 'react';
import { X, Play, Trash2, ListMusic, ChevronUp, ChevronDown } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDuration } from '../../utils/formatters';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const { currentSong, queue, queueIndex, playSong, removeFromQueue, clearQueue, reorderQueue } = useAudioPlayer();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-[#0E121E]/95 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <ListMusic className="w-5 h-5 text-indigo-400" />
          <h2 className="font-bold text-white text-base">Play Queue</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-400">
            {queue.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearQueue}
            className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded hover:bg-white/5 transition-colors"
            title="Clear Queue"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Now Playing section */}
      {currentSong && (
        <div className="p-4 border-b border-white/5 bg-indigo-600/10">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-400 block mb-2">
            Now Playing
          </span>
          <div className="flex items-center gap-3">
            <img
              src={currentSong.cover_url}
              alt={currentSong.title}
              className="w-12 h-12 rounded-lg object-cover shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{currentSong.title}</h4>
              <p className="text-xs text-slate-400 truncate">{currentSong.artist_name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Queue items list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-2 block my-2">
          Up Next
        </span>
        {queue.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Queue is empty. Add songs to play next!
          </div>
        ) : (
          queue.map((song, idx) => {
            const isCurrent = currentSong?.id === song.id && idx === queueIndex;
            return (
              <div
                key={`${song.id}-${idx}`}
                className={`group flex items-center justify-between p-2 rounded-xl transition-colors ${
                  isCurrent ? 'bg-indigo-500/15 text-indigo-300' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <img
                    src={song.cover_url}
                    alt={song.title}
                    className="w-9 h-9 rounded object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h5
                      onClick={() => playSong(song)}
                      className="text-xs font-semibold text-white truncate cursor-pointer hover:text-indigo-400"
                    >
                      {song.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 truncate">{song.artist_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {idx > 0 && (
                    <button
                      onClick={() => reorderQueue(idx, idx - 1)}
                      className="p-1 hover:text-white text-slate-400"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {idx < queue.length - 1 && (
                    <button
                      onClick={() => reorderQueue(idx, idx + 1)}
                      className="p-1 hover:text-white text-slate-400"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => removeFromQueue(idx)}
                    className="p-1 hover:text-rose-400 text-slate-400"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-[11px] font-mono text-slate-500 ml-2 group-hover:hidden">
                  {formatDuration(song.duration)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
