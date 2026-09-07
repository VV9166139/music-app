import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { MusicDataProvider } from './context/MusicDataContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <MusicDataProvider>
          <AudioPlayerProvider>
            <App />
          </AudioPlayerProvider>
        </MusicDataProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
