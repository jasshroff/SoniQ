// src/components/Layout/Navbar.tsx
import React from 'react';
import styles from './Navbar.module.css';
import { Search, Bell, Mic, User } from 'react-feather';

const Navbar: React.FC = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.searchBar}>
        <Search size={18} className={styles.searchIcon} />
        <input type="text" placeholder="Search for artists, songs, or podcasts..." />
        <Mic size={18} className={styles.micIcon} />
      </div>
      <div className={styles.userControls}>
        <button className={styles.iconButton}>
          <Bell size={20} />
        </button>
        <div className={styles.userProfile}>
          <img src="https://i.pravatar.cc/150?img=12" alt="User" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;