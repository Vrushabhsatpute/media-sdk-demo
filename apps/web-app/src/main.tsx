import React from 'react';
import ReactDOM from 'react-dom/client';
import { MediaProvider } from 'media-react';
import { App } from './App';
import './styles.css';

const apiKey = import.meta.env.VITE_PEXELS_API_KEY as string;

if (!apiKey) {
  console.warn('VITE_PEXELS_API_KEY is not set. Copy .env.example to .env and add your Pexels API key.');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MediaProvider config={{ apiKey }}>
      <App />
    </MediaProvider>
  </React.StrictMode>,
);
