// src/components/Dashboard/UserHistory.tsx
import React from 'react';
import { HistoryItem } from '../../types';
import styles from './Widget.module.css';
import localStyles from './UserHistory.module.css';
import { Play } from 'react-feather';

// MOCK DATA
const mockHistory: HistoryItem[] = [
  { song: { id: '1', title: 'Sunset Lover', artist: 'Petit Biscuit', imageUrl: 'https://i.scdn.co/image/ab67616d0000b27386a6b6f3c64c7f3b3e3b5b1c', duration: 230 }, playedAt: '2025-11-16T15:00:00Z' },
  { song: { id: '2', title: 'Tadow', artist: 'Masego & FKJ', imageUrl: 'https://i.scdn.co/image/ab67616d0000b2738a7c2f0f4e9a4f4b4b4b4b4b', duration: 301 }, playedAt: '2025-11-16T14:45:00Z' },
  { song: { id: '3', title: 'Bloom', artist: 'ODESZA', imageUrl: 'https://i.scdn.co/image/ab67616d0000b2734f9a62f3c6c7f3b3e3b5b1c', duration: 186 }, playedAt: '2025-11-16T14:30:00Z' },
  // Add more...
];

const UserHistory: React.FC = () => {
  const history = mockHistory;

  return (
    <div className={styles.widget}>
      <h3 className={styles.widgetTitle}>Recently Played</h3>
      <ul className={localStyles.historyList}>
        {history.map((item) => (
          <li key={item.song.id} className={localStyles.historyItem}>
            <img src={item.song.imageUrl} alt={item.song.title} className={localStyles.songImage} />
            <div className={localStyles.songInfo}>
              <span className={localStyles.songTitle}>{item.song.title}</span>
              <span className={localStyles.songArtist}>{item.song.artist}</span>
            </div>
            <button className={localStyles.playButton}>
              <Play size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserHistory;