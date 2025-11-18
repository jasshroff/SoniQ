// src/components/Dashboard/Dashboard.tsx
import React from 'react';
import ListeningStats from './ListeningStats';
import TopGenres from './TopGenres';
import UserHistory from './UserHistory';
// Import other components like Recommended
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      {/* You would add your Recommended and New Releases components here */}
      
      <div className={styles.statsGrid}>
        <UserHistory />
        <ListeningStats />
        <TopGenres />
      </div>
    </div>
  );
};

export default Dashboard;