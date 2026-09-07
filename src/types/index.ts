export type UserRole = 'user' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  color: string;
  cover_url?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  image_url: string;
  monthly_listeners: number;
  verified: boolean;
  genres?: string[];
  created_at?: string;
}

export interface Album {
  id: string;
  title: string;
  artist_id: string;
  artist_name?: string;
  release_year: number;
  cover_url: string;
  description: string;
  status: 'published' | 'draft' | 'unpublished';
  created_at?: string;
  tracks_count?: number;
}

export interface Song {
  id: string;
  title: string;
  artist_id: string;
  artist_name: string;
  album_id?: string;
  album_title?: string;
  genre_id?: string;
  genre_name?: string;
  duration: number; // in seconds
  audio_url: string;
  cover_url: string;
  plays_count: number;
  status: 'published' | 'draft' | 'unpublished';
  release_date?: string;
  created_at?: string;
  lyrics?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  user_id: string;
  creator_name?: string;
  cover_url: string;
  is_public: boolean;
  status: 'published' | 'draft' | 'unpublished';
  created_at: string;
  songs?: Song[];
}

export interface PlaylistSong {
  id: string;
  playlist_id: string;
  song_id: string;
  order_index: number;
  added_at: string;
  song?: Song;
}

export interface PlayHistoryItem {
  id: string;
  song_id: string;
  user_id?: string;
  played_at: string;
  song?: Song;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalPlaylists: number;
  totalPlays: number;
  playsToday: number;
  activeNow: number;
  playsOverTime: { date: string; plays: number }[];
  genreDistribution: { name: string; count: number; color: string }[];
  recentActivities: { id: string; user: string; action: string; time: string; type: 'song' | 'user' | 'playlist' }[];
}

export type RepeatMode = 'off' | 'all' | 'one';

export type CurrentView = 
  | { type: 'home' }
  | { type: 'search'; query?: string; category?: string }
  | { type: 'library'; tab?: 'liked' | 'playlists' | 'albums' | 'recent' }
  | { type: 'playlist'; id: string }
  | { type: 'album'; id: string }
  | { type: 'artist'; id: string }
  | { type: 'admin'; tab?: 'overview' | 'songs' | 'artists' | 'albums' | 'genres' | 'users' | 'playlists' };
