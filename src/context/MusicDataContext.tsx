import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Song, Artist, Album, Playlist, Genre, UserProfile, AdminAnalytics } from '../types';
import { 
  SEED_SONGS, 
  SEED_ARTISTS, 
  SEED_ALBUMS, 
  SEED_GENRES, 
  SEED_PLAYLISTS, 
  DEMO_ADMIN_USER, 
  DEMO_REGULAR_USER 
} from '../data/seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useToast } from './ToastContext';

interface MusicDataContextType {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  genres: Genre[];
  users: UserProfile[];
  favorites: string[]; // song ids
  recentlyPlayed: Song[];
  
  // User Actions
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  addRecentlyPlayed: (song: Song) => void;
  createPlaylist: (title: string, description?: string, coverUrl?: string) => Playlist;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  reorderPlaylistSongs: (playlistId: string, startIndex: number, endIndex: number) => void;
  
  // Admin Operations
  addSong: (song: Omit<Song, 'id' | 'plays_count'>) => Song;
  updateSong: (id: string, updates: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  addArtist: (artist: Omit<Artist, 'id'>) => Artist;
  updateArtist: (id: string, updates: Partial<Artist>) => void;
  deleteArtist: (id: string) => void;
  addAlbum: (album: Omit<Album, 'id'>) => Album;
  updateAlbum: (id: string, updates: Partial<Album>) => void;
  deleteAlbum: (id: string) => void;
  addGenre: (genre: Omit<Genre, 'id'>) => Genre;
  updateGenre: (id: string, updates: Partial<Genre>) => void;
  deleteGenre: (id: string) => void;
  updateUserRole: (userId: string, role: UserProfile['role']) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  
  // Analytics
  getAnalytics: () => AdminAnalytics;
}

const MusicDataContext = createContext<MusicDataContextType | undefined>(undefined);

export const MusicDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // Initialize state with local storage fallback
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('aura_songs');
    return saved ? JSON.parse(saved) : SEED_SONGS;
  });

  const [artists, setArtists] = useState<Artist[]>(() => {
    const saved = localStorage.getItem('aura_artists');
    return saved ? JSON.parse(saved) : SEED_ARTISTS;
  });

  const [albums, setAlbums] = useState<Album[]>(() => {
    const saved = localStorage.getItem('aura_albums');
    return saved ? JSON.parse(saved) : SEED_ALBUMS;
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('aura_playlists');
    return saved ? JSON.parse(saved) : SEED_PLAYLISTS;
  });

  const [genres, setGenres] = useState<Genre[]>(() => {
    const saved = localStorage.getItem('aura_genres');
    return saved ? JSON.parse(saved) : SEED_GENRES;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('aura_all_users');
    return saved ? JSON.parse(saved) : [
      DEMO_ADMIN_USER,
      DEMO_REGULAR_USER,
      {
        id: 'user-3',
        username: 'synth_coder',
        full_name: 'Devon Vance',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        role: 'user',
        is_active: true,
        created_at: '2024-03-01T10:00:00Z'
      },
      {
        id: 'user-4',
        username: 'elena_sound',
        full_name: 'Elena Rostova',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        role: 'admin',
        is_active: true,
        created_at: '2024-03-15T14:30:00Z'
      }
    ];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('aura_favorites');
    return saved ? JSON.parse(saved) : ['song-1', 'song-3', 'song-5'];
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(() => {
    const saved = localStorage.getItem('aura_recently_played');
    return saved ? JSON.parse(saved) : [SEED_SONGS[0], SEED_SONGS[2], SEED_SONGS[4]];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('aura_songs', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('aura_artists', JSON.stringify(artists));
  }, [artists]);

  useEffect(() => {
    localStorage.setItem('aura_albums', JSON.stringify(albums));
  }, [albums]);

  useEffect(() => {
    localStorage.setItem('aura_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('aura_genres', JSON.stringify(genres));
  }, [genres]);

  useEffect(() => {
    localStorage.setItem('aura_all_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('aura_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('aura_recently_played', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Fetch from Supabase if configured
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    const fetchSupabaseData = async () => {
      try {
        const [songsRes, artistsRes, albumsRes, genresRes] = await Promise.all([
          client.from('songs').select('*'),
          client.from('artists').select('*'),
          client.from('albums').select('*'),
          client.from('genres').select('*'),
        ]);

        if (songsRes.data && songsRes.data.length > 0) setSongs(songsRes.data as Song[]);
        if (artistsRes.data && artistsRes.data.length > 0) setArtists(artistsRes.data as Artist[]);
        if (albumsRes.data && albumsRes.data.length > 0) setAlbums(albumsRes.data as Album[]);
        if (genresRes.data && genresRes.data.length > 0) setGenres(genresRes.data as Genre[]);
      } catch (err) {
        console.warn('Supabase fetch fallback to local seed:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  // FAVORITES
  const toggleFavorite = (songId: string) => {
    const exists = favorites.includes(songId);
    let updated: string[];
    if (exists) {
      updated = favorites.filter((id) => id !== songId);
      showToast('Removed from Liked Songs', 'info');
    } else {
      updated = [...favorites, songId];
      showToast('Added to Liked Songs', 'success');
    }
    setFavorites(updated);

    if (isSupabaseConfigured && supabase) {
      if (exists) {
        supabase.from('favorites').delete().eq('song_id', songId);
      } else {
        supabase.from('favorites').insert({ song_id: songId });
      }
    }
  };

  const isFavorite = (songId: string) => favorites.includes(songId);

  // RECENTLY PLAYED
  const addRecentlyPlayed = (song: Song) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((s) => s.id !== song.id);
      return [song, ...filtered].slice(0, 20);
    });

    // Also increment plays_count locally
    setSongs((prev) =>
      prev.map((s) => (s.id === song.id ? { ...s, plays_count: s.plays_count + 1 } : s))
    );
  };

  // USER PLAYLISTS
  const createPlaylist = (title: string, description = '', coverUrl = ''): Playlist => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      title,
      description,
      user_id: 'user-admin',
      creator_name: 'You',
      cover_url:
        coverUrl ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      is_public: true,
      status: 'published',
      created_at: new Date().toISOString(),
      songs: [],
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    showToast(`Created playlist "${title}"`, 'success');
    return newPlaylist;
  };

  const updatePlaylist = (id: string, updates: Partial<Playlist>) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Playlist updated', 'success');
  };

  const deletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
    showToast('Playlist deleted', 'info');
  };

  const addSongToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;
        const currentList = p.songs || [];
        if (currentList.some((s) => s.id === song.id)) {
          showToast(`Song already in "${p.title}"`, 'info');
          return p;
        }
        showToast(`Added to "${p.title}"`, 'success');
        return { ...p, songs: [...currentList, song] };
      })
    );
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;
        return {
          ...p,
          songs: (p.songs || []).filter((s) => s.id !== songId),
        };
      })
    );
    showToast('Removed song from playlist', 'info');
  };

  const reorderPlaylistSongs = (playlistId: string, startIndex: number, endIndex: number) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId || !p.songs) return p;
        const newSongs = Array.from(p.songs);
        const [moved] = newSongs.splice(startIndex, 1);
        newSongs.splice(endIndex, 0, moved);
        return { ...p, songs: newSongs };
      })
    );
  };

  // ADMIN OPERATIONS: SONGS
  const addSong = (songData: Omit<Song, 'id' | 'plays_count'>): Song => {
    const newSong: Song = {
      ...songData,
      id: `song-${Date.now()}`,
      plays_count: 0,
      created_at: new Date().toISOString(),
    };
    setSongs((prev) => [newSong, ...prev]);
    showToast(`Song "${newSong.title}" added to catalog`, 'success');
    return newSong;
  };

  const updateSong = (id: string, updates: Partial<Song>) => {
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Song updated successfully', 'success');
  };

  const deleteSong = (id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
    showToast('Song deleted from catalog', 'info');
  };

  // ADMIN OPERATIONS: ARTISTS
  const addArtist = (artistData: Omit<Artist, 'id'>): Artist => {
    const newArtist: Artist = {
      ...artistData,
      id: `artist-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setArtists((prev) => [newArtist, ...prev]);
    showToast(`Artist "${newArtist.name}" created`, 'success');
    return newArtist;
  };

  const updateArtist = (id: string, updates: Partial<Artist>) => {
    setArtists((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Artist updated', 'success');
  };

  const deleteArtist = (id: string) => {
    setArtists((prev) => prev.filter((a) => a.id !== id));
    showToast('Artist deleted', 'info');
  };

  // ADMIN OPERATIONS: ALBUMS
  const addAlbum = (albumData: Omit<Album, 'id'>): Album => {
    const newAlbum: Album = {
      ...albumData,
      id: `album-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setAlbums((prev) => [newAlbum, ...prev]);
    showToast(`Album "${newAlbum.title}" created`, 'success');
    return newAlbum;
  };

  const updateAlbum = (id: string, updates: Partial<Album>) => {
    setAlbums((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Album updated', 'success');
  };

  const deleteAlbum = (id: string) => {
    setAlbums((prev) => prev.filter((a) => a.id !== id));
    showToast('Album deleted', 'info');
  };

  // ADMIN OPERATIONS: GENRES
  const addGenre = (genreData: Omit<Genre, 'id'>): Genre => {
    const newGenre: Genre = {
      ...genreData,
      id: `genre-${Date.now()}`,
    };
    setGenres((prev) => [...prev, newGenre]);
    showToast(`Genre "${newGenre.name}" added`, 'success');
    return newGenre;
  };

  const updateGenre = (id: string, updates: Partial<Genre>) => {
    setGenres((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    showToast('Genre updated', 'success');
  };

  const deleteGenre = (id: string) => {
    setGenres((prev) => prev.filter((g) => g.id !== id));
    showToast('Genre deleted', 'info');
  };

  // ADMIN OPERATIONS: USERS
  const updateUserRole = (userId: string, role: UserProfile['role']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    showToast(`User role changed to ${role}`, 'success');
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const next = !u.is_active;
          showToast(`User ${next ? 'activated' : 'deactivated'}`, 'info');
          return { ...u, is_active: next };
        }
        return u;
      })
    );
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('User deleted', 'info');
  };

  // ADMIN ANALYTICS GENERATOR
  const getAnalytics = (): AdminAnalytics => {
    const totalPlays = songs.reduce((sum, s) => sum + s.plays_count, 0);
    const genreMap: Record<string, number> = {};
    songs.forEach((s) => {
      const g = s.genre_name || 'Other';
      genreMap[g] = (genreMap[g] || 0) + 1;
    });

    const genreDistribution = Object.keys(genreMap).map((g, idx) => {
      const colors = ['#6366F1', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
      return {
        name: g,
        count: genreMap[g],
        color: colors[idx % colors.length],
      };
    });

    return {
      totalUsers: users.length,
      totalSongs: songs.length,
      totalArtists: artists.length,
      totalAlbums: albums.length,
      totalPlaylists: playlists.length,
      totalPlays,
      playsToday: Math.round(totalPlays * 0.042) + 120,
      activeNow: 48,
      playsOverTime: [
        { date: 'Mon', plays: 12400 },
        { date: 'Tue', plays: 15800 },
        { date: 'Wed', plays: 14200 },
        { date: 'Thu', plays: 19600 },
        { date: 'Fri', plays: 24500 },
        { date: 'Sat', plays: 31200 },
        { date: 'Sun', plays: 28400 },
      ],
      genreDistribution,
      recentActivities: [
        { id: 'act-1', user: 'Alex Rivera', action: 'Created playlist "Summer Vibes 2024"', time: '5m ago', type: 'playlist' },
        { id: 'act-2', user: 'Kavinsky Nebula', action: 'Uploaded new track "Midnight Highway Cruise"', time: '22m ago', type: 'song' },
        { id: 'act-3', user: 'Chief Admin', action: 'Verified artist profile "Anirudh Pulse"', time: '1h ago', type: 'user' },
        { id: 'act-4', user: 'Elena Rostova', action: 'Published album "Neon Odyssey 2099"', time: '3h ago', type: 'song' },
      ]
    };
  };

  return (
    <MusicDataContext.Provider
      value={{
        songs,
        artists,
        albums,
        playlists,
        genres,
        users,
        favorites,
        recentlyPlayed,
        toggleFavorite,
        isFavorite,
        addRecentlyPlayed,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        reorderPlaylistSongs,
        addSong,
        updateSong,
        deleteSong,
        addArtist,
        updateArtist,
        deleteArtist,
        addAlbum,
        updateAlbum,
        deleteAlbum,
        addGenre,
        updateGenre,
        deleteGenre,
        updateUserRole,
        toggleUserStatus,
        deleteUser,
        getAnalytics,
      }}
    >
      {children}
    </MusicDataContext.Provider>
  );
};

export const useMusicData = (): MusicDataContextType => {
  const context = useContext(MusicDataContext);
  if (!context) {
    throw new Error('useMusicData must be used within a MusicDataProvider');
  }
  return context;
};
