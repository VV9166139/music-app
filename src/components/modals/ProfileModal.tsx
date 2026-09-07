import React, { useState, useEffect } from 'react';
import { X, User, Image, Shield, Save, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, switchDemoRole, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setUsername(user.username);
      setAvatarUrl(user.avatar_url);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: fullName.trim(),
      username: username.trim(),
      avatar_url: avatarUrl.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#101422] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-black text-white mb-1">Your Account</h3>
        <p className="text-xs text-slate-400 mb-6">Manage your identity and creator roles</p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={avatarUrl || user.avatar_url}
              alt="Avatar preview"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
              }}
            />
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-300 mb-1">Avatar Image URL</label>
              <div className="relative">
                <Image className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-[#161B2E] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#161B2E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Role selector */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Active Role</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300">
                {user.role}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => switchDemoRole('admin')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  user.role === 'admin'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-[#161B2E] text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                Admin (Full CMS)
              </button>
              <button
                type="button"
                onClick={() => switchDemoRole('user')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  user.role === 'user'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-[#161B2E] text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                Standard Member
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                signOut();
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-neon-purple transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
