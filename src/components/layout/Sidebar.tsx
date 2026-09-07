import React from 'react';
import { 
  Home, 
  Search, 
  Library, 
  Heart, 
  PlusSquare, 
  ShieldCheck, 
  Disc, 
  Sparkles,
  Radio,
  X,
  Music4
} from 'lucide-react';
import { CurrentView, Playlist } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useMusicData } from '../../context/MusicDataContext';

interface SidebarProps {
  currentView: CurrentView;
  onNavigate: (view: CurrentView) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onCreatePlaylist: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
  onCreatePlaylist,
}) => {
  const { isAdmin } = useAuth();
  const { playlists, favorites } = useMusicData();

  const isNavActive = (type: CurrentView['type'], subTab?: string) => {
    if (currentView.type !== type) return false;
    if (type === 'library' && subTab) {
      return (currentView as { type: 'library'; tab?: string }).tab === subTab;
    }
    return true;
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#090C14] border-r border-white/[0.06] select-none">
      {/* Brand Logo Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-5">
        <div 
          onClick={() => {
            onNavigate({ type: 'home' });
            if (onCloseMobile) onCloseMobile();
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-neon-purple group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#090C14] rounded-[14px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-lg text-white group-hover:text-indigo-300 transition-colors">
                AURA
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider font-medium">HI-FI AUDIO ENGINE</p>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button 
            onClick={onCloseMobile} 
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="px-3 py-2 space-y-1">
        <button
          onClick={() => {
            onNavigate({ type: 'home' });
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
            isNavActive('home')
              ? 'bg-gradient-to-r from-indigo-600/30 to-indigo-600/10 text-white border-l-4 border-indigo-500 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Home className={`w-5 h-5 ${isNavActive('home') ? 'text-indigo-400' : ''}`} />
          <span>Discover</span>
        </button>

        <button
          onClick={() => {
            onNavigate({ type: 'search' });
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
            isNavActive('search')
              ? 'bg-gradient-to-r from-indigo-600/30 to-indigo-600/10 text-white border-l-4 border-indigo-500 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Search className={`w-5 h-5 ${isNavActive('search') ? 'text-indigo-400' : ''}`} />
          <span>Search & Genres</span>
        </button>

        <button
          onClick={() => {
            onNavigate({ type: 'library', tab: 'playlists' });
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
            isNavActive('library', 'playlists')
              ? 'bg-gradient-to-r from-indigo-600/30 to-indigo-600/10 text-white border-l-4 border-indigo-500 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Library className={`w-5 h-5 ${isNavActive('library', 'playlists') ? 'text-indigo-400' : ''}`} />
          <span>Your Library</span>
        </button>
      </div>

      {/* Quick shortcuts */}
      <div className="px-3 pt-4 pb-2 space-y-1">
        <button
          onClick={() => {
            onNavigate({ type: 'library', tab: 'liked' });
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
            isNavActive('library', 'liked')
              ? 'bg-rose-500/15 text-rose-300 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
            <span>Liked Tracks</span>
          </div>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
            {favorites.length}
          </span>
        </button>

        <button
          onClick={onCreatePlaylist}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
            <PlusSquare className="w-4 h-4" />
          </div>
          <span>Create Playlist</span>
        </button>
      </div>

      <div className="mx-5 my-2 border-t border-white/[0.06]" />

      {/* Admin Suite Link (Conditional or prominent) */}
      {isAdmin && (
        <div className="px-3 pb-2">
          <button
            onClick={() => {
              onNavigate({ type: 'admin', tab: 'overview' });
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 ${
              currentView.type === 'admin'
                ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-purple-300 border border-purple-500/40 shadow-neon-purple'
                : 'bg-purple-950/20 border border-purple-500/20 text-purple-300 hover:bg-purple-900/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin Management</span>
            </div>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200 font-black">
              LIVE
            </span>
          </button>
        </div>
      )}

      {/* Playlists scroll list */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
          Your Playlists
        </p>
        {playlists.map((pl: Playlist) => {
          const isSelected = currentView.type === 'playlist' && currentView.id === pl.id;
          return (
            <button
              key={pl.id}
              onClick={() => {
                onNavigate({ type: 'playlist', id: pl.id });
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs truncate text-left transition-colors ${
                isSelected
                  ? 'text-indigo-400 font-semibold bg-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <Disc className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className="truncate">{pl.title}</span>
            </button>
          );
        })}
      </div>

      {/* Footer info & audio engine badge */}
      <div className="p-4 border-t border-white/[0.06] bg-[#07090E]/60">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span className="truncate">Lossless 24-bit Flac Ready</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 h-full flex-shrink-0">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={onCloseMobile} 
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 shadow-2xl animate-in slide-in-from-left duration-300">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
