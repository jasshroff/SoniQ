import React from 'react';
import logo from './logo.svg';
import './App.css';

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

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <SearchBar />
          <MusicPlayer />
          <Dashboard />
          <div className="dashboard-widgets">
            <ListeningStats />
            <TopGenres />
            <UserHistory />
          </div>
          <Recommended />
        </main>
      </div>
    </div>
  );
}

export default App;
