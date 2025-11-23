import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Global Styles
// import './styles/global.css'; // Removed

// Components - Layout
// import Navbar from './components/Layout/Navbar'; // Removed
// import Sidebar from './components/Layout/Sidebar'; // Removed

// Components - Dashboard
// import Dashboard from './components/Dashboard/Dashboard'; // Removed
// import ListeningStats from './components/Dashboard/ListeningStats'; // Removed
// import TopGenres from './components/Dashboard/TopGenres'; // Removed
// import UserHistory from './components/Dashboard/UserHistory'; // Removed

// Components - Music
// import MusicPlayer from './components/Music/MusicPlayer'; // Removed
// import Recommended from './components/Music/Recommended'; // Removed

// Components - Global
// import SearchBar from './components/global/SearchBar'; // Removed

// Types
// import * as Types from './types/index'; // Removed

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
