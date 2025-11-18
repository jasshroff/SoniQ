// src/components/Layout/Sidebar.tsx
import React from 'react';
import styles from './Sidebar.module.css';
import { Home, Compass, Heart, Radio, Mic, Clock } from 'react-feather';
// Assuming you have an SVG logo
// import { ReactComponent as Logo } from '../../assets/soniq-logo.svg';

const Sidebar: React.FC = () => {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>
        {/* <Logo /> */}
        <h3>soniQ</h3>
      </div>
      <ul className={styles.navList}>
        <li className={`${styles.navItem} ${styles.active}`}>
          <Home size={20} /> <span>Home</span>
        </li>
        <li className={styles.navItem}>
          <Compass size={20} /> <span>Discover</span>
        </li>
        <li className={styles.navItem}>
          <Heart size={20} /> <span>Favorites</span>
        </li>
        <li className={styles.navItem}>
          <Radio size={20} /> <span>Radio</span>
        </li>
        <li className={styles.navItem}>
          <Mic size={20} /> <span>Artists</span>
        </li>
        <li className={styles.navItem}>
          <Clock size={20} /> <span>History</span>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;