// src/components/Music/MusicPlayer.tsx
import React from 'react';
import styles from './MusicPlayer.module.css';
import {
  Shuffle,
  SkipBack,
  PlayCircle,
  SkipForward,
  Repeat,
  Volume2,
  List,
} from 'react-feather';

// MOCK DATA (Current Song)
const currentSong = {
  id: '1',
  title: 'Sunset Lover',
  artist: 'Petit Biscuit',
  imageUrl: 'https://i.scdn.co/image/ab67616d0000b27386a6b6f3c64c7f3b3e3b5b1c',
  duration: 230
};

const MusicPlayer: React.FC = () => {
  return (
    <footer className={styles.musicPlayer}>
      {/* Current Song Info */}
      <div className={styles.songDetails}>
        <img src={currentSong.imageUrl} alt={currentSong.title} />
        <div className={styles.songInfo}>
          <span className={styles.title}>{currentSong.title}</span>
          <span className={styles.artist}>{currentSong.artist}</span>
        </div>
      </div>

      {/* Player Controls */}
      <div className={styles.playerControls}>
        <div className={styles.controlButtons}>
          <button><Shuffle size={18} /></button>
          <button><SkipBack size={20} /></button>
          <button className={styles.playButton}><PlayCircle size={36} /></button>
          <button><SkipForward size={20} /></button>
          <button><Repeat size={18} /></button>
        </div>
        <div className={styles.progressBarContainer}>
          <span className={styles.time}>1:24</span>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: '40%' }}></div>
          </div>
          <span className={styles.time}>3:50</span>
        </div>
      </div>

      {/* Volume & Queue */}
      <div className={styles.extraControls}>
        <Volume2 size={20} />
        <div className={styles.volumeBar}>
          <div className={styles.volume} style={{ width: '70%' }}></div>
        </div>
        <List size={20} />
      </div>
    </footer>
  );
};

export default MusicPlayer;