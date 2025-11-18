// src/components/Dashboard/ListeningStats.tsx
import React from 'react';
import { ListeningStats as StatsType } from '../../types';
import styles from './Widget.module.css';
import localStyles from './ListeningStats.module.css'; // Specific styles

// MOCK DATA (replace with API call)
const mockStats: StatsType = {
  today: 45,
  thisWeek: 12.5,
  thisMonth: 50.2,
};

const ListeningStats: React.FC = () => {
  const stats = mockStats;

  return (
    <div className={styles.widget}>
      <h3 className={styles.widgetTitle}>Listening Time</h3>
      <div className={localStyles.statsContainer}>
        <div className={localStyles.statItem}>
          <span className={localStyles.statValue}>{stats.today}</span>
          <span className={localStyles.statLabel}>Mins Today</span>
        </div>
        <div className={localStyles.statItem}>
          <span className={localStyles.statValue}>{stats.thisWeek.toFixed(1)}</span>
          <span className={localStyles.statLabel}>Hours This Week</span>
        </div>
        <div className={localStyles.statItem}>
          <span className={localStyles.statValue}>{stats.thisMonth.toFixed(1)}</span>
          <span className={localStyles.statLabel}>Hours This Month</span>
        </div>
      </div>
      {/* You could add a simple bar chart here */}
    </div>
  );
};

export default ListeningStats;