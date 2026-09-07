# Aura Stream - Modern Music Streaming Web Application

A sleek, responsive, and full-featured music streaming web application built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Supabase**.

![Aura Stream](https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Features

- 🎧 **Rich Audio Player**: Continuous playback, play/pause, seek slider, volume control, mute toggle, shuffle, and repeat modes.
- 📜 **Queue Management**: Dynamic playback queue drawer with reordering and skip capability.
- 🔍 **Search & Discovery**: Real-time filtering across songs, artists, albums, and genres.
- 📚 **Personal Library & Playlists**: Create, edit, and organize custom playlists, liked songs, and saved albums.
- 🎤 **Artist & Album Views**: Detailed discography, top tracks, artist bios, and album listings.
- ⚡ **Admin Dashboard**: Full CRUD management for songs, artists, and albums with analytics charts powered by Recharts.
- 🔐 **Authentication & Profiles**: User sign-in/sign-up and profile management integrated with Supabase Auth (with offline seed-data fallback).
- 🎨 **Modern Aesthetics**: Glassmorphic dark UI, micro-animations, confetti effects, and responsive mobile-ready layout.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **Charts & Visuals**: [Recharts](https://recharts.org/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/VV9166139/music-app.git
cd music-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials (optional for offline seed mode):

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup (Optional)

If using Supabase, run the SQL schema located in `supabase/schema.sql` inside your Supabase SQL Editor to provision tables and policies.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
music-app/
├── src/
│   ├── components/
│   │   ├── common/       # MusicCard, SongRow
│   │   ├── layout/       # Navbar, Sidebar
│   │   ├── modals/       # Auth, Playlist, Profile, CRUD Modals
│   │   ├── player/       # MusicPlayer, QueueDrawer
│   │   └── views/        # Home, Search, Library, Details, Admin
│   ├── context/          # AudioPlayer, Auth, MusicData, Toast Contexts
│   ├── data/             # Seed music data for offline demo
│   ├── lib/              # Supabase client configuration
│   ├── types/            # TypeScript interfaces and data models
│   ├── utils/            # Helper formatting functions
│   ├── App.tsx           # Main application view coordinator
│   └── main.tsx          # Application root entry
├── supabase/
│   └── schema.sql        # Database schema and RLS policies
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
