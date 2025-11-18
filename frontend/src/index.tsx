import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Global Styles
import './styles/global.css';

// Components - Layout
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';

// Components - Dashboard
import Dashboard from './components/Dashboard/Dashboard';
import ListeningStats from './components/Dashboard/ListeningStats';
import TopGenres from './components/Dashboard/TopGenres';
import UserHistory from './components/Dashboard/UserHistory';

// Components - Music
import MusicPlayer from './components/Music/MusicPlayer';
import Recommended from './components/Music/Recommended';

// Components - Global
import SearchBar from './components/global/SearchBar';

// Types
import * as Types from './types/index';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
