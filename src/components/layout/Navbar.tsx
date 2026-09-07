import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, Database, User, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CurrentView } from '../../types';

interface NavbarProps {
  currentView: CurrentView;
  onNavigate: (view: CurrentView) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenProfile,
}) => {
  const { user, role, isAdmin, isAuthenticated, signOut, switchDemoRole, isSupabaseLive } = useAuth();
  const [searchVal, setSearchVal] = useState(currentView.type === 'search' ? currentView.query || '' : '');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onNavigate({ type: 'search', query: searchVal.trim() });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 glass-dock border-b border-white/[0.06] px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search songs, artists, albums, or playlists..."
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            onNavigate({ type: 'search', query: e.target.value });
          }}
          className="w-full bg-[#121624]/90 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
        />
      </form>

      {/* Right controls: Supabase Status, Role Switcher, Profile */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Supabase Status Pill */}
        <div
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            isSupabaseLive
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
          }`}
          title={
            isSupabaseLive
              ? 'Connected to live Supabase backend'
              : 'Running in Local Sandbox Mode (Zero configuration needed)'
          }
        >
          <Database className="w-3 h-3" />
          <span>{isSupabaseLive ? 'Supabase Live' : 'Sandbox Demo DB'}</span>
        </div>

        {/* Quick Role Switcher for Test Reviewers */}
        <div className="hidden lg:flex items-center bg-[#131826] border border-white/10 rounded-full p-0.5">
          <button
            onClick={() => switchDemoRole('admin')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              isAdmin
                ? 'bg-indigo-600 text-white shadow-neon-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin View
          </button>
          <button
            onClick={() => switchDemoRole('user')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              !isAdmin
                ? 'bg-indigo-600 text-white shadow-neon-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            User View
          </button>
        </div>

        {/* User Profile Pill or Sign In Button */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-full bg-[#131826] hover:bg-[#1A2133] border border-white/10 transition-colors"
            >
              <div className="flex flex-col text-left hidden sm:block">
                <span className="text-xs font-bold text-white leading-tight">{user.full_name}</span>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase">{user.role}</span>
              </div>
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/50"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#131826] border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-white/5">
                  <p className="text-xs font-semibold text-white">{user.full_name}</p>
                  <p className="text-[11px] text-slate-400">@{user.username}</p>
                </div>

                <button
                  onClick={() => {
                    onOpenProfile();
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors text-left"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>My Profile</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      onNavigate({ type: 'admin', tab: 'overview' });
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-indigo-300 hover:bg-indigo-600/20 transition-colors text-left"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                <div className="border-t border-white/5 my-1" />

                <button
                  onClick={() => {
                    signOut();
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-neon-purple transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
