// src/components/Dashboard/TopGenres.tsx
import React from 'react';
import { TopGenre } from '../../types';
import styles from './Widget.module.css';
import localStyles from './TopGenres.module.css';

// MOCK DATA
const mockGenres: TopGenre[] = [
  { name: 'Indie Pop', percentage: 40 },
  { name: 'Electronic', percentage: 25 },
  { name: 'Lo-fi', percentage: 20 },
  { name: 'Classical', percentage: 10 },
  { name: 'Other', percentage: 5 },
];

const TopGenres: React.FC = () => {
  const genres = mockGenres;

  return (
    <div className={styles.widget}>
      <h3 className={styles.widgetTitle}>Your Top Genres</h3>
      <div className={localStyles.genreList}>
        {genres.map((genre) => (
          <div key={genre.name} className={localStyles.genreItem}>
            <span className={localStyles.genreName}>{genre.name}</span>
            <div className={localStyles.progressBar}>
              <div
                className={localStyles.progressFill}
                style={{ width: `${genre.percentage}%` }}
              ></div>
            </div>
            <span className={localStyles.genrePercentage}>{genre.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopGenres;