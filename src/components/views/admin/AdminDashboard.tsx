import React, { useState } from 'react';
import { 
  BarChart3, 
  Music, 
  User, 
  Disc, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  TrendingUp, 
  Radio, 
  Sparkles,
  Activity,
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useMusicData } from '../../../context/MusicDataContext';
import { useAuth } from '../../../context/AuthContext';
import { Song, Artist, Album, UserProfile } from '../../../types';
import { formatDuration } from '../../../utils/formatters';

interface AdminDashboardProps {
  initialTab?: 'overview' | 'songs' | 'artists' | 'albums' | 'users' | 'genres' | 'playlists';
  onOpenSongModal: (song?: Song | null) => void;
  onOpenArtistModal: (artist?: Artist | null) => void;
  onOpenAlbumModal: (album?: Album | null) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialTab = 'overview',
  onOpenSongModal,
  onOpenArtistModal,
  onOpenAlbumModal,
}) => {
  const {
    songs,
    artists,
    albums,
    users,
    genres,
    deleteSong,
    updateSong,
    deleteArtist,
    deleteAlbum,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    getAnalytics,
  } = useMusicData();

  const { isAdmin, switchDemoRole } = useAuth();
  const safeTab = (initialTab === 'genres' || initialTab === 'playlists') ? 'overview' : initialTab;
  const [activeTab, setActiveTab] = useState<'overview' | 'songs' | 'artists' | 'albums' | 'users'>(
    safeTab
  );
  const [songSearch, setSongSearch] = useState('');

  const analytics = getAnalytics();

  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(songSearch.toLowerCase()) ||
      s.artist_name.toLowerCase().includes(songSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-300">
      {/* Top Banner & Mode Guard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#0B0F1C] border border-purple-500/20 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-neon-purple flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Aura Central CMS & Suite</h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-500/30">
                PRO ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live streaming telemetry, content catalog management & access control
            </p>
          </div>
        </div>

        {/* Quick Role Toggle Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchDemoRole('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isAdmin
                ? 'bg-purple-600 text-white shadow-neon-purple'
                : 'bg-[#121624] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Admin Privileges Active
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-neon-purple'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('songs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'songs'
              ? 'bg-purple-600 text-white shadow-neon-purple'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Tracks ({songs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'artists'
              ? 'bg-purple-600 text-white shadow-neon-purple'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Artists ({artists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('albums')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'albums'
              ? 'bg-purple-600 text-white shadow-neon-purple'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Disc className="w-4 h-4" />
          <span>Albums ({albums.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-neon-purple'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Profiles ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Plays</span>
                <Activity className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">
                {analytics.totalPlays.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+14.2% this week</span>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Catalog Tracks</span>
                <Music className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{analytics.totalSongs}</p>
              <span className="text-xs text-slate-400">Lossless Master Audio</span>
            </div>

            <div className="glass-card p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Creators</span>
                <User className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{analytics.totalArtists}</p>
              <span className="text-xs text-purple-300 font-medium">Verified Roster</span>
            </div>

            <div className="glass-card p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Community Listeners</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{analytics.totalUsers}</p>
              <span className="text-xs text-emerald-400 font-semibold">{analytics.activeNow} streaming live</span>
            </div>
          </div>

          {/* Charts Section: Stream Volume Over Time & Genre Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stream chart (2 cols) */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Stream Volume & Engagement</h3>
                  <p className="text-xs text-slate-400">Past 7 days stream telemetry</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Realtime Sync
                </span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.playsOverTime}>
                    <defs>
                      <linearGradient id="streamGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F1424',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="plays"
                      stroke="#818CF8"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#streamGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Genre Distribution (1 col) */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Genre Distribution</h3>
                <p className="text-xs text-slate-400">Breakdown of catalog categories</p>
              </div>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.genreDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                    >
                      {analytics.genreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F1424',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {analytics.genreDistribution.slice(0, 4).map((g) => (
                  <div key={g.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                    <span className="text-slate-300 truncate">{g.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Audit Activities */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white">Recent Admin Activity Audit Log</h3>
            <div className="divide-y divide-white/[0.05]">
              {analytics.recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <div>
                      <span className="font-semibold text-white">{act.user}</span>
                      <span className="text-slate-400 ml-2">{act.action}</span>
                    </div>
                  </div>
                  <span className="text-slate-500 font-mono">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SONGS MANAGEMENT */}
      {activeTab === 'songs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Search catalog tracks..."
              value={songSearch}
              onChange={(e) => setSongSearch(e.target.value)}
              className="bg-[#121624] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 max-w-sm"
            />
            <button
              onClick={() => onOpenSongModal(null)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-neon-purple transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Track</span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121624] text-slate-400 uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="py-3.5 px-4">Track</th>
                    <th className="py-3.5 px-4">Genre</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Streams</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-slate-300">
                  {filteredSongs.map((song) => (
                    <tr key={song.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={song.cover_url}
                            alt={song.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{song.title}</p>
                            <p className="text-slate-400">{song.artist_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{song.genre_name || '—'}</td>
                      <td className="py-3 px-4 font-mono">{formatDuration(song.duration)}</td>
                      <td className="py-3 px-4 font-mono">{(song.plays_count || 0).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            song.status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {song.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              updateSong(song.id, {
                                status: song.status === 'published' ? 'draft' : 'published',
                              })
                            }
                            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            title="Toggle Publish Status"
                          >
                            {song.status === 'published' ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => onOpenSongModal(song)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-indigo-400 hover:text-indigo-300 transition-colors"
                            title="Edit Track"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete song "${song.title}"?`)) {
                                deleteSong(song.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors"
                            title="Delete Track"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ARTISTS MANAGEMENT */}
      {activeTab === 'artists' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => onOpenArtistModal(null)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-neon-purple transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Artist</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4 border border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={artist.image_url}
                    alt={artist.name}
                    className="w-12 h-12 rounded-full object-cover border border-purple-500/30 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate">{artist.name}</h4>
                    <p className="text-xs text-slate-400">
                      {artist.monthly_listeners.toLocaleString()} listeners
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenArtistModal(artist)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-indigo-400"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete artist "${artist.name}"?`)) {
                        deleteArtist(artist.id);
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALBUMS MANAGEMENT */}
      {activeTab === 'albums' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => onOpenAlbumModal(null)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-neon-purple transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Album</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {albums.map((album) => (
              <div
                key={album.id}
                className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4 border border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={album.cover_url}
                    alt={album.title}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate">{album.title}</h4>
                    <p className="text-xs text-slate-400">
                      {album.artist_name} • {album.release_year}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenAlbumModal(album)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-indigo-400"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete album "${album.title}"?`)) {
                        deleteAlbum(album.id);
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121624] text-slate-400 uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="py-3.5 px-4">Member</th>
                    <th className="py-3.5 px-4">Role Access</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-slate-300">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar_url}
                            alt={u.full_name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                          />
                          <div>
                            <p className="font-bold text-white">{u.full_name}</p>
                            <p className="text-slate-400">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            updateUserRole(u.id, e.target.value as UserProfile['role'])
                          }
                          className="bg-[#121624] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="user">Standard User</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                            u.is_active
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {u.is_active ? 'Active' : 'Suspended'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete user "${u.full_name}"?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
