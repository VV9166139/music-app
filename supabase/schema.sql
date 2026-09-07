-- ==============================================================================
-- AURA STREAM - FULL SUPABASE POSTGRESQL SCHEMA, RLS & SEED DATA
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM / CHECKS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. GENRES TABLE
CREATE TABLE IF NOT EXISTS public.genres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#6366F1',
    cover_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ARTISTS TABLE
CREATE TABLE IF NOT EXISTS public.artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    monthly_listeners BIGINT NOT NULL DEFAULT 0,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ALBUMS TABLE
CREATE TABLE IF NOT EXISTS public.albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
    release_year INT,
    cover_url TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'unpublished')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SONGS TABLE
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
    album_id UUID REFERENCES public.albums(id) ON DELETE SET NULL,
    genre_id UUID REFERENCES public.genres(id) ON DELETE SET NULL,
    duration INT NOT NULL DEFAULT 0, -- In seconds
    audio_url TEXT NOT NULL,
    cover_url TEXT,
    plays_count BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'unpublished')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PLAYLISTS TABLE
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    is_public BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'unpublished')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PLAYLIST SONGS JUNCTION
CREATE TABLE IF NOT EXISTS public.playlist_songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    order_index INT NOT NULL DEFAULT 0,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(playlist_id, song_id)
);

-- 9. FAVORITES / LIKED SONGS
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, song_id)
);

-- 10. RECENTLY PLAYED
CREATE TABLE IF NOT EXISTS public.recently_played (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. PLAY HISTORY / ANALYTICS
CREATE TABLE IF NOT EXISTS public.play_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR FAST QUERIES
CREATE INDEX IF NOT EXISTS idx_songs_artist ON public.songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_album ON public.songs(album_id);
CREATE INDEX IF NOT EXISTS idx_songs_genre ON public.songs(genre_id);
CREATE INDEX IF NOT EXISTS idx_songs_status ON public.songs(status);
CREATE INDEX IF NOT EXISTS idx_albums_artist ON public.albums(artist_id);
CREATE INDEX IF NOT EXISTS idx_playlists_user ON public.playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist ON public.playlist_songs(playlist_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_played_user ON public.recently_played(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_played ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_history ENABLE ROW LEVEL SECURITY;

-- HELPER FUNCTIONS FOR ROLE CHECKING
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin') AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (public.is_admin());

-- GENRES POLICIES
CREATE POLICY "Genres viewable by everyone" ON public.genres
    FOR SELECT USING (true);

CREATE POLICY "Admins manage genres" ON public.genres
    FOR ALL USING (public.is_admin());

-- ARTISTS POLICIES
CREATE POLICY "Artists viewable by everyone" ON public.artists
    FOR SELECT USING (true);

CREATE POLICY "Admins manage artists" ON public.artists
    FOR ALL USING (public.is_admin());

-- ALBUMS POLICIES
CREATE POLICY "Published albums viewable by everyone" ON public.albums
    FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins manage albums" ON public.albums
    FOR ALL USING (public.is_admin());

-- SONGS POLICIES
CREATE POLICY "Published songs viewable by everyone" ON public.songs
    FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins manage songs" ON public.songs
    FOR ALL USING (public.is_admin());

-- PLAYLISTS POLICIES
CREATE POLICY "Public playlists viewable by everyone" ON public.playlists
    FOR SELECT USING (is_public = true OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create playlists" ON public.playlists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own playlists" ON public.playlists
    FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete own playlists" ON public.playlists
    FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- PLAYLIST SONGS POLICIES
CREATE POLICY "Playlist songs viewable if playlist is viewable" ON public.playlist_songs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.playlists p 
            WHERE p.id = playlist_id AND (p.is_public = true OR p.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Users can modify own playlist songs" ON public.playlist_songs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.playlists p 
            WHERE p.id = playlist_id AND (p.user_id = auth.uid() OR public.is_admin())
        )
    );

-- FAVORITES POLICIES
CREATE POLICY "Users can view own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- RECENTLY PLAYED POLICIES
CREATE POLICY "Users can view own recently played" ON public.recently_played
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recently played" ON public.recently_played
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- PLAY HISTORY POLICIES
CREATE POLICY "Play history viewable by admins" ON public.play_history
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Anyone can log play history" ON public.play_history
    FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('songs', 'songs', true),
       ('covers', 'covers', true),
       ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public storage read" ON storage.objects
    FOR SELECT USING (bucket_id IN ('songs', 'covers', 'avatars'));

CREATE POLICY "Authenticated users can upload covers/avatars" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id IN ('covers', 'avatars') AND auth.role() = 'authenticated');

CREATE POLICY "Admins can upload to any bucket" ON storage.objects
    FOR ALL USING (public.is_admin());
