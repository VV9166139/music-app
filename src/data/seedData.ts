import { Artist, Album, Song, Genre, Playlist, UserProfile } from '../types';

export const SEED_GENRES: Genre[] = [
  { id: 'genre-1', name: 'Synthwave', slug: 'synthwave', color: '#8B5CF6', cover_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80' },
  { id: 'genre-2', name: 'Lofi & Chill', slug: 'lofi-chill', color: '#06B6D4', cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80' },
  { id: 'genre-3', name: 'Electronic', slug: 'electronic', color: '#EC4899', cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80' },
  { id: 'genre-4', name: 'Ambient Classical', slug: 'ambient-classical', color: '#10B981', cover_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&auto=format&fit=crop&q=80' },
  { id: 'genre-5', name: 'Indie Rock', slug: 'indie-rock', color: '#F59E0B', cover_url: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=500&auto=format&fit=crop&q=80' },
  { id: 'genre-6', name: 'Tamil Beats', slug: 'tamil-beats', color: '#EF4444', cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80' },
  { id: 'genre-7', name: 'Deep Techno', slug: 'deep-techno', color: '#6366F1', cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80' },
  { id: 'genre-8', name: 'Global Pop', slug: 'global-pop', color: '#3B82F6', cover_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80' },
];

export const SEED_ARTISTS: Artist[] = [
  {
    id: 'artist-1',
    name: 'Kavinsky Nebula',
    bio: 'Pioneer of cinematic retro-futuristic synthwave. Blending analog synthesizers with driving beats and neon melodies.',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    monthly_listeners: 1482000,
    verified: true,
    genres: ['Synthwave', 'Electronic']
  },
  {
    id: 'artist-2',
    name: 'Mira Solstice',
    bio: 'Ambient soundscape composer creating soothing downtempo and organic lofi beats for focus, sleep, and meditation.',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    monthly_listeners: 924500,
    verified: true,
    genres: ['Lofi & Chill', 'Ambient Classical']
  },
  {
    id: 'artist-3',
    name: 'Anirudh Pulse',
    bio: 'Modern fusion maestro blending high-energy Carnatic rhythms, thumping basslines, and electronic drops.',
    image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    monthly_listeners: 3240000,
    verified: true,
    genres: ['Tamil Beats', 'Global Pop']
  },
  {
    id: 'artist-4',
    name: 'CyberVibe & Eclipse',
    bio: 'Berlin-underground techno duo known for warehouse sets, hypnotic arpeggios, and visceral sub-bass energy.',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    monthly_listeners: 680200,
    verified: false,
    genres: ['Deep Techno', 'Electronic']
  },
  {
    id: 'artist-5',
    name: 'Aurora Horizon',
    bio: 'Nordic indie multi-instrumentalist crafting ethereal dream-pop with soaring vocals and acoustic textures.',
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    monthly_listeners: 1845000,
    verified: true,
    genres: ['Indie Rock', 'Global Pop']
  }
];

export const SEED_ALBUMS: Album[] = [
  {
    id: 'album-1',
    title: 'Neon Odyssey 2099',
    artist_id: 'artist-1',
    artist_name: 'Kavinsky Nebula',
    release_year: 2024,
    cover_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    description: 'A 10-track journey through chrome towers and rainy cyberpunk highways.',
    status: 'published',
    tracks_count: 4
  },
  {
    id: 'album-2',
    title: 'Midnight Rain Lofi',
    artist_id: 'artist-2',
    artist_name: 'Mira Solstice',
    release_year: 2024,
    cover_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    description: 'Gentle vinyl crackles, mellow Rhodes chords, and late-night tape warmth.',
    status: 'published',
    tracks_count: 3
  },
  {
    id: 'album-3',
    title: 'Dravidian Thunder',
    artist_id: 'artist-3',
    artist_name: 'Anirudh Pulse',
    release_year: 2024,
    cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    description: 'Explosive cross-genre energy loaded with viral hooks and orchestral crescendos.',
    status: 'published',
    tracks_count: 3
  },
  {
    id: 'album-4',
    title: 'Subterranean Pulse',
    artist_id: 'artist-4',
    artist_name: 'CyberVibe & Eclipse',
    release_year: 2023,
    cover_url: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=600&auto=format&fit=crop&q=80',
    description: 'Relentless driving basslines crafted for peak-hour dancefloors.',
    status: 'published',
    tracks_count: 2
  }
];

export const SEED_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Midnight Highway Cruise',
    artist_id: 'artist-1',
    artist_name: 'Kavinsky Nebula',
    album_id: 'album-1',
    album_title: 'Neon Odyssey 2099',
    genre_id: 'genre-1',
    genre_name: 'Synthwave',
    duration: 372,
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    plays_count: 284120,
    status: 'published',
    release_date: '2024-01-15'
  },
  {
    id: 'song-2',
    title: 'Echoes of Andromeda',
    artist_id: 'artist-1',
    artist_name: 'Kavinsky Nebula',
    album_id: 'album-1',
    album_title: 'Neon Odyssey 2099',
    genre_id: 'genre-1',
    genre_name: 'Synthwave',
    duration: 423,
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    plays_count: 198450,
    status: 'published',
    release_date: '2024-02-10'
  },
  {
    id: 'song-3',
    title: 'Coffee in Shibuya',
    artist_id: 'artist-2',
    artist_name: 'Mira Solstice',
    album_id: 'album-2',
    album_title: 'Midnight Rain Lofi',
    genre_id: 'genre-2',
    genre_name: 'Lofi & Chill',
    duration: 350,
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    plays_count: 452100,
    status: 'published',
    release_date: '2024-03-01'
  },
  {
    id: 'song-4',
    title: 'Rain on the Skylight',
    artist_id: 'artist-2',
    artist_name: 'Mira Solstice',
    album_id: 'album-2',
    album_title: 'Midnight Rain Lofi',
    genre_id: 'genre-2',
    genre_name: 'Lofi & Chill',
    duration: 312,
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    plays_count: 310890,
    status: 'published',
    release_date: '2024-03-12'
  },
  {
    id: 'song-5',
    title: 'Chennai Velocity',
    artist_id: 'artist-3',
    artist_name: 'Anirudh Pulse',
    album_id: 'album-3',
    album_title: 'Dravidian Thunder',
    genre_id: 'genre-6',
    genre_name: 'Tamil Beats',
    duration: 345,
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    plays_count: 891400,
    status: 'published',
    release_date: '2024-04-05'
  },
  {
    id: 'song-6',
    title: 'Marina Sunset Rhythm',
    artist_id: 'artist-3',
    artist_name: 'Anirudh Pulse',
    album_id: 'album-3',
    album_title: 'Dravidian Thunder',
    genre_id: 'genre-6',
    genre_name: 'Tamil Beats',
    duration: 290,
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    plays_count: 672300,
    status: 'published',
    release_date: '2024-04-18'
  },
  {
    id: 'song-7',
    title: 'Berghain Shadows',
    artist_id: 'artist-4',
    artist_name: 'CyberVibe & Eclipse',
    album_id: 'album-4',
    album_title: 'Subterranean Pulse',
    genre_id: 'genre-7',
    genre_name: 'Deep Techno',
    duration: 410,
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover_url: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=600&auto=format&fit=crop&q=80',
    plays_count: 142000,
    status: 'published',
    release_date: '2023-11-20'
  },
  {
    id: 'song-8',
    title: 'Starlight Luminescence',
    artist_id: 'artist-5',
    artist_name: 'Aurora Horizon',
    album_id: undefined,
    genre_id: 'genre-8',
    genre_name: 'Global Pop',
    duration: 260,
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    plays_count: 512900,
    status: 'published',
    release_date: '2024-05-02'
  }
];

export const SEED_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-1',
    title: 'Neon Cyber Drive',
    description: 'High-octane synthwave and retro electro for night driving under city lights.',
    user_id: 'user-admin',
    creator_name: 'Aura Curators',
    cover_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    is_public: true,
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    songs: [SEED_SONGS[0], SEED_SONGS[1], SEED_SONGS[6]]
  },
  {
    id: 'playlist-2',
    title: 'Deep Focus & Code',
    description: 'Lo-Fi beats and ambient textures that trigger flow state and deep productivity.',
    user_id: 'user-admin',
    creator_name: 'Aura Editorial',
    cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    is_public: true,
    status: 'published',
    created_at: '2024-01-05T00:00:00Z',
    songs: [SEED_SONGS[2], SEED_SONGS[3], SEED_SONGS[7]]
  },
  {
    id: 'playlist-3',
    title: 'South Indian Basswave',
    description: 'The finest Tamil beats, punchy folk rhythms, and modern dancefloor drops.',
    user_id: 'user-admin',
    creator_name: 'Aura Regional',
    cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    is_public: true,
    status: 'published',
    created_at: '2024-02-14T00:00:00Z',
    songs: [SEED_SONGS[4], SEED_SONGS[5]]
  }
];

export const DEMO_ADMIN_USER: UserProfile = {
  id: 'user-admin',
  username: 'antigravity_admin',
  full_name: 'Chief Admin',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  role: 'super_admin',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z'
};

export const DEMO_REGULAR_USER: UserProfile = {
  id: 'user-listener',
  username: 'music_enthusiast',
  full_name: 'Alex Rivera',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  role: 'user',
  is_active: true,
  created_at: '2024-02-15T00:00:00Z'
};
