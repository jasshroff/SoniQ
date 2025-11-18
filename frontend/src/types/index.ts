// src/types/index.ts
export interface Song {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  duration: number; // in seconds
}

export interface User {
  name: string;
  profileImageUrl: string;
}

export interface ListeningStats {
  today: number; // minutes
  thisWeek: number; // hours
  thisMonth: number; // hours
}

export interface TopGenre {
  name: string;
  percentage: number;
}

export interface HistoryItem {
  song: Song;
  playedAt: string; // ISO string for time
}