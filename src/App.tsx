import React, { useState } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { CurrentView, Song, Playlist, Artist, Album } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MusicPlayer } from './components/player/MusicPlayer';
import { useAudioPlayer } from './context/AudioPlayerContext';

// Views
import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { LibraryView } from './components/views/LibraryView';
import { PlaylistDetailView } from './components/views/PlaylistDetailView';
import { AlbumDetailView } from './components/views/AlbumDetailView';
import { ArtistDetailView } from './components/views/ArtistDetailView';
import { AdminDashboard } from './components/views/admin/AdminDashboard';

// Modals
import { AuthModal } from './components/modals/AuthModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { EditPlaylistModal } from './components/modals/EditPlaylistModal';
import { AddToPlaylistModal } from './components/modals/AddToPlaylistModal';
import { SongFormModal } from './components/modals/SongFormModal';
import { ArtistFormModal } from './components/modals/ArtistFormModal';
import { AlbumFormModal } from './components/modals/AlbumFormModal';

export const App: React.FC = () => {
  const { currentSong } = useAudioPlayer();

  // Navigation State
  const [currentView, setCurrentView] = useState<CurrentView>({ type: 'home' });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [songToAddToPlaylist, setSongToAddToPlaylist] = useState<Song | null>(null);

  // Admin Modals State
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  const handleOpenAddToPlaylist = (song: Song) => {
    setSongToAddToPlaylist(song);
    setIsAddToPlaylistOpen(true);
  };

  const handleOpenCreatePlaylist = () => {
    setEditingPlaylist(null);
    setIsPlaylistModalOpen(true);
  };

  const handleOpenEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setIsPlaylistModalOpen(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07090E] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsMobileNavOpen(false);
        }}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onCreatePlaylist={handleOpenCreatePlaylist}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Navbar */}
        <div className="flex items-center">
          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden p-3 text-slate-400 hover:text-white"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 min-w-0">
            <Navbar
              currentView={currentView}
              onNavigate={setCurrentView}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />
          </div>
        </div>

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-32">
          <div className="max-w-7xl mx-auto">
            {currentView.type === 'home' && (
              <HomeView
                onNavigate={setCurrentView}
                onOpenAddToPlaylist={handleOpenAddToPlaylist}
              />
            )}

            {currentView.type === 'search' && (
              <SearchView
                currentView={currentView}
                onNavigate={setCurrentView}
                onOpenAddToPlaylist={handleOpenAddToPlaylist}
              />
            )}

            {currentView.type === 'library' && (
              <LibraryView
                currentView={currentView}
                onNavigate={setCurrentView}
                onOpenCreatePlaylist={handleOpenCreatePlaylist}
                onOpenAddToPlaylist={handleOpenAddToPlaylist}
              />
            )}

            {currentView.type === 'playlist' && (
              <PlaylistDetailView
                playlistId={currentView.id}
                onNavigate={setCurrentView}
                onOpenEditPlaylist={handleOpenEditPlaylist}
                onOpenAddToPlaylist={handleOpenAddToPlaylist}
              />
            )}

            {currentView.type === 'album' && (
              <AlbumDetailView
                albumId={currentView.id}
                onNavigate={setCurrentView}
                onOpenAddToPlaylist={handleOpenAddToPlaylist}
              />
            )}

            {currentView.type === 'artist' && (
              <ArtistDetailView
                artistId={currentView.id}
                onNavigate={setCurrentView}
                onOpenAddToPlaylist={handleOpenAddToPlaylist}
              />
            )}

            {currentView.type === 'admin' && (
              <AdminDashboard
                initialTab={currentView.tab || 'overview'}
                onOpenSongModal={(song) => {
                  setEditingSong(song || null);
                  setIsSongModalOpen(true);
                }}
                onOpenArtistModal={(artist) => {
                  setEditingArtist(artist || null);
                  setIsArtistModalOpen(true);
                }}
                onOpenAlbumModal={(album) => {
                  setEditingAlbum(album || null);
                  setIsAlbumModalOpen(true);
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Persistent Audio Player Footer Bar */}
      <MusicPlayer
        onOpenAddToPlaylist={() => {
          if (currentSong) handleOpenAddToPlaylist(currentSong);
        }}
        onNavigateArtist={(artistId) => setCurrentView({ type: 'artist', id: artistId })}
      />

      {/* GLOBAL MODALS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <EditPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        playlist={editingPlaylist}
      />

      <AddToPlaylistModal
        isOpen={isAddToPlaylistOpen}
        onClose={() => setIsAddToPlaylistOpen(false)}
        song={songToAddToPlaylist}
        onOpenCreatePlaylist={handleOpenCreatePlaylist}
      />

      {/* ADMIN CMS MODALS */}
      <SongFormModal
        isOpen={isSongModalOpen}
        onClose={() => setIsSongModalOpen(false)}
        song={editingSong}
      />

      <ArtistFormModal
        isOpen={isArtistModalOpen}
        onClose={() => setIsArtistModalOpen(false)}
        artist={editingArtist}
      />

      <AlbumFormModal
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        album={editingAlbum}
      />
    </div>
  );
};

export default App;
