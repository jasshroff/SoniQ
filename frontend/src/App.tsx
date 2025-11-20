import React, { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { 
  Home, 
  Compass, 
  Heart, 
  Radio, 
  Mic2, 
  Clock, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  Volume1, 
  VolumeX, 
  Menu, 
  X, 
  TrendingUp, 
  Music, 
  History, 
  Settings, 
  LogOut, 
  User, 
  CreditCard, 
  Sparkles, 
  MoreHorizontal, 
  ListMusic, 
  Maximize2, 
  Headphones, 
  RadioReceiver, 
  Signal, 
  ChevronDown, 
  Share2, 
  Mic, 
  Check, 
  Trash2, 
  Disc, 
  Plus, 
  ListPlus, 
  FolderPlus,
  BarChart2,
  Calendar,
  PieChart,
  Activity
} from 'lucide-react';

// --- Types & Mock Data ---

type Theme = 'light' | 'dark';
type Tab = 'home' | 'explore' | 'radio' | 'podcasts' | 'history' | 'liked' | 'recommended' | 'stats' | string;

interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  genre: string;
  album?: string;
}

interface Playlist {
  id: string;
  name: string;
  cover: string;
  songs: Song[];
  createdAt: Date;
}

interface Podcast {
    id: number;
    title: string;
    host: string;
    cover: string;
    date: string;
    duration: string;
}

interface RadioStation {
    id: number;
    name: string;
    frequency: string;
    genre: string;
    cover: string;
    live: boolean;
}

interface PlayHistoryItem {
    song: Song;
    timestamp: Date;
}

const MOCK_USER = {
  name: "Jordan Lee",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  email: "jordan@example.com"
};

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "New Release", text: "The Weeknd dropped a new single", time: "2m ago", unread: true, type: 'release' },
  { id: 2, title: "System Update", text: "Your weekly mix is ready", time: "1h ago", unread: true, type: 'system' },
  { id: 3, title: "Social", text: "Alex shared a playlist with you", time: "4h ago", unread: false, type: 'social' },
  { id: 4, title: "Concert Alert", text: "Dua Lipa is playing near you soon!", time: "1d ago", unread: false, type: 'event' },
];

const MOCK_SONGS: Song[] = [
  { id: 1, title: "Midnight City", artist: "M83", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop", duration: "4:03", genre: "Techno" },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd", cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop", duration: "3:20", genre: "Pop" },
  { id: 3, title: "Kesariya", artist: "Arijit Singh", cover: "https://images.unsplash.com/photo-1514525253440-b393452e2729?w=300&h=300&fit=crop", duration: "4:28", genre: "Bollywood" },
  { id: 4, title: "Summer", artist: "Calvin Harris", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop", duration: "3:42", genre: "EDM" },
  { id: 5, title: "Levitating", artist: "Dua Lipa", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop", duration: "3:23", genre: "Pop" },
  { id: 6, title: "Lose Yourself", artist: "Eminem", cover: "https://images.unsplash.com/photo-1619983081593-e2ba5b543e60?w=300&h=300&fit=crop", duration: "5:26", genre: "Hip Hop" },
  { id: 7, title: "One Kiss", artist: "Dua Lipa, Calvin Harris", cover: "https://images.unsplash.com/photo-1546528377-7592299e0b5d?w=300&h=300&fit=crop", duration: "3:34", genre: "House" },
  { id: 8, title: "Apna Bana Le", artist: "Arijit Singh", cover: "https://images.unsplash.com/photo-1459749411177-520994397ee4?w=300&h=300&fit=crop", duration: "4:12", genre: "Bollywood" },
  { id: 9, title: "Animals", artist: "Martin Garrix", cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=300&fit=crop", duration: "2:56", genre: "EDM" },
  { id: 10, title: "On The Floor", artist: "Jennifer Lopez", cover: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=300&h=300&fit=crop", duration: "4:45", genre: "House" },
  { id: 11, title: "Clarity", artist: "Zedd", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop", duration: "4:31", genre: "EDM" },
  { id: 12, title: "Chaiyya Chaiyya", artist: "A.R. Rahman", cover: "https://images.unsplash.com/photo-1605020420620-20c943cc4669?w=300&h=300&fit=crop", duration: "6:54", genre: "Bollywood" },
];

const MOCK_PODCASTS: Podcast[] = [
    { id: 1, title: "Tech Talk Daily", host: "Sarah Lane", cover: "https://images.unsplash.com/photo-1589903308904-7bc1852127b6?w=300&h=300&fit=crop", date: "Today", duration: "45m" },
    { id: 2, title: "The Daily", host: "Michael Barbaro", cover: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&h=300&fit=crop", date: "Yesterday", duration: "25m" },
    { id: 3, title: "Design Matters", host: "Debbie Millman", cover: "https://images.unsplash.com/photo-1567593810070-e9089051e9f7?w=300&h=300&fit=crop", date: "2 days ago", duration: "52m" },
    { id: 4, title: "Indie Hackers", host: "Courtland Allen", cover: "https://images.unsplash.com/photo-1478737270239-2f02b77ac618?w=300&h=300&fit=crop", date: "1 week ago", duration: "1h 5m" },
];

const MOCK_RADIO: RadioStation[] = [
    { id: 1, name: "Chill Lo-Fi", frequency: "96.4 FM", genre: "Lo-Fi", cover: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=300&h=300&fit=crop", live: true },
    { id: 2, name: "Retro Hits", frequency: "102.5 FM", genre: "Pop", cover: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=300&h=300&fit=crop", live: true },
    { id: 3, name: "Deep House", frequency: "89.2 FM", genre: "House", cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop", live: false },
    { id: 4, name: "Desi Beats", frequency: "98.3 FM", genre: "Bollywood", cover: "https://images.unsplash.com/photo-1536330089824-900dd5d58701?w=300&h=300&fit=crop", live: true },
];

const GENRES = ["All", "Bollywood", "House", "Techno", "EDM", "Pop", "Rock", "Hip Hop", "Indie", "R&B", "Jazz", "Lo-Fi", "Classical", "Metal"];

// Helper to generate some random history so the stats aren't empty
const generateInitialHistory = (): PlayHistoryItem[] => {
  const history: PlayHistoryItem[] = [];
  const now = new Date();
  // Generate 50 plays over the last 7 days
  for (let i = 0; i < 50; i++) {
    const randomSong = MOCK_SONGS[Math.floor(Math.random() * MOCK_SONGS.length)];
    const randomDaysAgo = Math.floor(Math.random() * 7);
    const playDate = new Date(now);
    playDate.setDate(playDate.getDate() - randomDaysAgo);
    // Random time during the day
    playDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    history.push({ song: randomSong, timestamp: playDate });
  }
  // Sort by date descending
  return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const parseDurationToMinutes = (duration: string) => {
  const [min, sec] = duration.split(':').map(Number);
  return min + sec / 60;
};

// --- Context ---

const PlayerContext = createContext<{
  currentSong: Song | null;
  isPlaying: boolean;
  likedSongs: number[];
  playlists: Playlist[];
  history: PlayHistoryItem[];
  playSong: (song: Song) => void;
  togglePlay: () => void;
  toggleLike: (songId: number) => void;
  createPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: string, song: Song) => void;
  addToHistory: (song: Song) => void;
  openAddToPlaylistModal: (song: Song) => void;
}>({
  currentSong: null,
  isPlaying: false,
  likedSongs: [],
  playlists: [],
  history: [],
  playSong: () => {},
  togglePlay: () => {},
  toggleLike: () => {},
  createPlaylist: () => {},
  addToPlaylist: () => {},
  addToHistory: () => {},
  openAddToPlaylistModal: () => {},
});

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, onCreatePlaylist }: any) => {
  const { playlists } = useContext(PlayerContext);
  
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'radio', icon: Radio, label: 'Radio' },
    { id: 'podcasts', icon: Mic2, label: 'Podcasts' },
    { id: 'stats', icon: BarChart2, label: 'Stats' },
    { id: 'history', icon: History, label: 'History' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`fixed md:relative z-30 h-full w-64 bg-white dark:bg-[#1a1a1a] border-r border-gray-100 dark:border-gray-800 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#e88d50] p-2 rounded-xl">
            <Music className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#e88d50] to-[#cc6c77] bg-clip-text text-transparent">SoniQ</span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="px-4 py-2">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-4">Menu</p>
            <nav className="space-y-2">
                {menuItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => {
                        setActiveTab(item.id);
                        if(window.innerWidth < 768) setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id 
                        ? 'bg-[#e88d50] text-white shadow-md shadow-[#e88d50]/20' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                    <item.icon size={20} />
                    {item.label}
                </button>
                ))}
            </nav>
            </div>

            <div className="px-4 py-6 mt-4">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-4">Library</p>
            <nav className="space-y-2">
                <button 
                    onClick={() => {
                        setActiveTab('liked');
                        if(window.innerWidth < 768) setIsOpen(false);
                    }} 
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'liked' ? 'bg-[#e88d50] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                <Heart size={20} /> Liked Songs
                </button>
                <button 
                    onClick={() => {
                        setActiveTab('recommended');
                        if(window.innerWidth < 768) setIsOpen(false);
                    }} 
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'recommended' ? 'bg-[#e88d50] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                <Sparkles size={20} /> Recommended
                </button>
                <button 
                    onClick={() => {
                        setActiveTab('history');
                        if(window.innerWidth < 768) setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'history' ? 'bg-[#e88d50] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                <Clock size={20} /> Recent
                </button>
            </nav>
            </div>

            <div className="px-4 py-2 mt-2">
                <div className="flex items-center justify-between px-4 mb-4">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Playlists</p>
                    <button onClick={onCreatePlaylist} className="text-gray-400 hover:text-[#e88d50] transition-colors">
                        <Plus size={18} />
                    </button>
                </div>
                <nav className="space-y-2">
                    {playlists.map((pl: Playlist) => (
                        <button
                            key={pl.id}
                            onClick={() => {
                                setActiveTab(`playlist-${pl.id}`);
                                if(window.innerWidth < 768) setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                activeTab === `playlist-${pl.id}`
                                    ? 'bg-gray-100 dark:bg-gray-800 text-[#e88d50]' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#e88d50] to-[#cc6c77] flex items-center justify-center text-[10px] text-white font-bold">
                                {pl.name[0]}
                            </div>
                            <span className="truncate">{pl.name}</span>
                        </button>
                    ))}
                    {playlists.length === 0 && (
                        <div className="px-4 text-xs text-gray-400 italic">No playlists yet</div>
                    )}
                </nav>
            </div>
        </div>
      </aside>
    </>
  );
};

const SongCard = ({ song }: { song: Song }) => {
  const { currentSong, isPlaying, playSong, toggleLike, likedSongs, openAddToPlaylistModal } = useContext(PlayerContext);
  const isCurrent = currentSong?.id === song.id;
  const isLiked = likedSongs.includes(song.id);

  return (
    <div 
      className="group relative p-3 bg-white dark:bg-[#1e1e1e] rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => playSong(song)}
    >
      <div className="relative overflow-hidden rounded-xl aspect-square mb-4">
        <img 
          src={song.cover} 
          alt={song.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isCurrent ? 'opacity-100 bg-black/60' : ''}`}>
          <div className="bg-[#e88d50] text-white p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
            {isCurrent && isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </div>
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
                onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
                className="bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-[#e88d50] transition-colors"
            >
                <Heart size={14} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-[#e88d50]" : "text-white"} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); openAddToPlaylistModal(song); }}
                className="bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-[#e88d50] transition-colors"
            >
                <ListPlus size={14} />
            </button>
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">{song.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{song.artist}</p>
    </div>
  );
};

const MusicPlayer = () => {
  const { currentSong, isPlaying, togglePlay, likedSongs, toggleLike, addToHistory } = useContext(PlayerContext);
  const [volume, setVolume] = useState(80);
  const [prevVolume, setPrevVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    if (currentSong) {
      const [min, sec] = currentSong.duration.split(':').map(Number);
      setDuration(min * 60 + sec);
      setCurrentTime(0);
    }
  }, [currentSong]);

  useEffect(() => {
    let interval: any;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    } else if (currentTime >= duration && isPlaying) {
      togglePlay();
      // Add to history when song finishes
      if (currentSong) addToHistory(currentSong);
      setCurrentTime(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, togglePlay, currentSong, addToHistory]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume);
    }
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} />;
    if (volume < 50) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  if (!currentSong) return null;

  const isLiked = likedSongs.includes(currentSong.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* --- Full Screen Player Overlay --- */}
      {isExpanded && (
        <div className="fixed inset-0 z-[60] bg-white/95 dark:bg-[#050505]/95 backdrop-blur-3xl flex flex-col animate-in slide-in-from-bottom duration-300">
          
          {/* Full Screen Header */}
          <div className="flex items-center justify-between p-6 md:p-10">
            <button 
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
            >
              <ChevronDown size={32} />
            </button>
            <div className="text-center">
              <span className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Now Playing</span>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{currentSong.genre} Radio</h3>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300">
              <MoreHorizontal size={28} />
            </button>
          </div>

          {/* Full Screen Content */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 px-8 pb-12">
            
            {/* Big Album Art */}
            <div className="w-full max-w-md aspect-square relative group">
               <div className="absolute inset-4 bg-[#e88d50]/30 blur-3xl rounded-full animate-pulse-slow"></div>
               <img 
                  src={currentSong.cover} 
                  alt={currentSong.title} 
                  className={`w-full h-full object-cover rounded-3xl shadow-2xl relative z-10 transition-transform duration-700 ${isPlaying ? 'scale-100' : 'scale-95 opacity-90'}`}
               />
            </div>

            {/* Big Controls */}
            <div className="w-full max-w-md flex flex-col justify-center">
              
              <div className="flex justify-between items-start mb-8">
                <div>
                   <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{currentSong.title}</h1>
                   <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">{currentSong.artist}</p>
                </div>
                <button 
                    onClick={() => toggleLike(currentSong.id)}
                    className={`p-3 rounded-full ${isLiked ? 'bg-[#e88d50] text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500'} transition-colors`}
                >
                   <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Scrubber */}
              <div className="mb-8">
                <div className="relative w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full mb-2 group">
                  <div 
                    className="absolute h-full bg-[#e88d50] rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                   <span>{formatTime(currentTime)}</span>
                   <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="flex items-center justify-between mb-10">
                 <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Shuffle size={24} /></button>
                 <div className="flex items-center gap-8">
                    <button className="text-gray-900 dark:text-white hover:text-[#e88d50] transition-colors"><SkipBack size={36} fill="currentColor" /></button>
                    <button 
                      onClick={togglePlay}
                      className="w-20 h-20 bg-[#e88d50] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#e88d50]/40 hover:scale-105 hover:bg-[#cc6c77] transition-all"
                    >
                       {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
                    </button>
                    <button className="text-gray-900 dark:text-white hover:text-[#e88d50] transition-colors"><SkipForward size={36} fill="currentColor" /></button>
                 </div>
                 <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Repeat size={24} /></button>
              </div>

              {/* Extra Actions */}
              <div className="flex items-center justify-between px-4">
                 <button className="flex flex-col items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <Share2 size={20} /> Share
                 </button>
                 <button className="flex flex-col items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ListMusic size={20} /> Lyrics
                 </button>
                 <button className="flex flex-col items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <Mic size={20} /> Karaoke
                 </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- Mini Player Bar --- */}
      <div className="h-24 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 px-4 md:px-8 flex items-center justify-between z-40 relative shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
        
        {/* Song Info */}
        <div className="flex items-center gap-4 w-full md:w-1/3 min-w-0">
          <div 
            className="relative group cursor-pointer"
            onClick={() => setIsExpanded(true)}
          >
            <img 
              src={currentSong.cover} 
              alt={currentSong.title} 
              className={`w-14 h-14 rounded-xl shadow-md object-cover transition-transform duration-700 ${isPlaying ? 'animate-pulse-slow' : ''}`} 
            />
            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <Maximize2 size={20} className="text-white drop-shadow-lg" />
            </div>
          </div>
          <div className="hidden md:block overflow-hidden">
            <h4 
              className="font-bold text-sm text-gray-900 dark:text-white truncate hover:underline cursor-pointer"
              onClick={() => setIsExpanded(true)}
            >
              {currentSong.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate hover:text-[#e88d50] cursor-pointer transition-colors">{currentSong.artist}</p>
          </div>
          <button 
            onClick={() => toggleLike(currentSong.id)}
            className={`ml-2 transition-colors ${isLiked ? 'text-[#e88d50]' : 'text-gray-400 hover:text-[#e88d50]'}`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Controls & Scrubber */}
        <div className="flex flex-col items-center w-full md:w-1/3 px-4">
          <div className="flex items-center gap-6 mb-1.5">
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"><Shuffle size={16} /></button>
            <button className="text-gray-700 dark:text-gray-300 hover:text-[#e88d50] transition-colors"><SkipBack size={20} fill="currentColor" /></button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center bg-[#e88d50] text-white rounded-full hover:bg-[#cc6c77] hover:scale-105 transition-all shadow-lg shadow-[#e88d50]/30 active:scale-95"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-gray-700 dark:text-gray-300 hover:text-[#e88d50] transition-colors"><SkipForward size={20} fill="currentColor" /></button>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"><Repeat size={16} /></button>
          </div>
          
          <div className="w-full flex items-center gap-3 text-xs text-gray-400 font-medium font-mono">
            <span className="w-9 text-right">{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-4 flex items-center group">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="absolute w-full h-1 bg-transparent appearance-none z-20 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100"
              />
              <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden pointer-events-none absolute top-1/2 -translate-y-1/2">
                <div 
                  className="h-full bg-[#e88d50] rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <span className="w-9">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Extras */}
        <div className="flex items-center justify-end gap-2 w-full md:w-1/3 min-w-0 hidden md:flex">
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-2">
            <ListMusic size={18} />
          </button>
          
          <div className="flex items-center gap-2 group w-32">
            <button onClick={toggleMute} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors min-w-[24px]">
              <VolumeIcon />
            </button>
            
            <div className="relative flex-1 h-4 flex items-center">
               <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute w-full h-1 bg-transparent appearance-none z-20 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100"
                />
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden pointer-events-none absolute top-1/2 -translate-y-1/2">
                  <div 
                    className="h-full bg-gray-500 dark:bg-gray-400 rounded-full transition-all duration-75"
                    style={{ width: `${volume}%` }}
                  />
                </div>
            </div>
          </div>

          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-2">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

// --- Page Views ---

const HomePage = ({ activeGenre, setActiveGenre, searchQuery }: { activeGenre: string, setActiveGenre: (g: string) => void, searchQuery: string }) => {
  const filteredSongs = MOCK_SONGS.filter(s => {
    const matchesGenre = activeGenre === "All" || s.genre === activeGenre;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="animate-in fade-in duration-500">
      {/* Featured Banner */}
      {!searchQuery && (
        <div className="mb-8 p-8 rounded-3xl bg-gradient-to-r from-[#6366f1] to-[#e88d50] text-white relative overflow-hidden shadow-2xl shadow-[#6366f1]/20 z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10 max-w-lg">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-sm border border-white/10">NEW RELEASE</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-2">The Weeknd</h2>
            <p className="text-lg text-white/90 mb-6 line-clamp-2">Experience the new retro-futuristic vibes in his latest album. Immerse yourself in the sound of tomorrow.</p>
            <div className="flex gap-4">
              <button className="bg-white text-[#6366f1] px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg">
                <Play size={20} fill="currentColor" /> Listen Now
              </button>
              <button className="bg-transparent border border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
                Add to Library
              </button>
            </div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&h=400&fit=crop" 
            alt="Featured Artist"
            className="absolute right-10 bottom-0 w-64 h-64 object-cover drop-shadow-2xl transform rotate-3 hidden lg:block mask-image-linear-gradient" 
          />
        </div>
      )}

      {/* Categories */}
      <div className="mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {GENRES.map((genre) => (
          <button 
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeGenre === genre 
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Trending Section */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Now'}
          </h3>
          {!searchQuery && <button className="text-sm font-semibold text-[#e88d50] hover:text-[#cc6c77]">See All</button>}
        </div>
        
        {filteredSongs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No songs found matching "{searchQuery}"</p>
            <button onClick={() => setActiveGenre("All")} className="text-[#e88d50] hover:underline mt-2 text-sm">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

const RecommendedPage = () => {
    const { playSong } = useContext(PlayerContext);
    const recommendedSongs = MOCK_SONGS.slice(0, 8);

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-end gap-6 mb-8">
                <div className="w-48 h-48 bg-gradient-to-br from-[#e88d50] to-[#cc6c77] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#e88d50]/20">
                    <Sparkles size={64} className="text-white" fill="currentColor" />
                </div>
                <div>
                    <h5 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2">Made For You</h5>
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Recommended</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Songs we think you'll love based on your listening history.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                 {recommendedSongs.map((song, idx) => (
                    <div
                        key={song.id}
                        onClick={() => playSong(song)}
                        className="flex items-center gap-4 p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group last:border-0"
                    >
                        <span className="text-gray-400 w-6 text-center font-medium">{idx + 1}</span>
                        <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{song.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">{song.duration}</span>
                    </div>
                 ))}
            </div>
        </div>
    );
};

const StatsPage = () => {
    const { history } = useContext(PlayerContext);
    const [timeRange, setTimeRange] = useState<'hours' | 'count'>('hours');
    
    const stats = useMemo(() => {
        const totalMinutes = history.reduce((acc, item) => acc + parseDurationToMinutes(item.song.duration), 0);
        const totalSongs = history.length;
        
        // Calculate top artist
        const artistCounts: Record<string, number> = {};
        history.forEach(item => {
            artistCounts[item.song.artist] = (artistCounts[item.song.artist] || 0) + 1;
        });
        let topArtist = "N/A";
        let maxPlays = 0;
        Object.entries(artistCounts).forEach(([artist, count]) => {
            if (count > maxPlays) {
                maxPlays = count;
                topArtist = artist;
            }
        });

        // Calculate weekly activity
        const weeklyActivity = Array(7).fill(0);
        const now = new Date();
        // Normalize 'now' to end of day to ensure correct 7 day window
        now.setHours(23, 59, 59, 999);
        
        history.forEach(item => {
            const daysDiff = Math.floor((now.getTime() - item.timestamp.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff >= 0 && daysDiff < 7) {
                // If timeRange is hours, add duration, else add 1 for count
                const valueToAdd = timeRange === 'hours' ? parseDurationToMinutes(item.song.duration) / 60 : 1;
                 // Map to appropriate day index (0 is today/latest, 6 is oldest) -> Reverse for display (0 is oldest)
                weeklyActivity[6 - daysDiff] += valueToAdd;
            }
        });

        // Genre Distribution
        const genreCounts: Record<string, number> = {};
        history.forEach(item => {
             genreCounts[item.song.genre] = (genreCounts[item.song.genre] || 0) + 1;
        });
        const genreDistribution = Object.entries(genreCounts)
            .map(([genre, count]) => ({
                genre,
                percentage: Math.round((count / totalSongs) * 100),
                color: getGenreColor(genre)
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5); // Top 5

        return { totalMinutes, totalSongs, topArtist, weeklyActivity, genreDistribution };
    }, [history, timeRange]);

    function getGenreColor(genre: string) {
        const colors: Record<string, string> = {
            'Pop': '#e88d50',
            'Techno': '#cc6c77',
            'Lo-Fi': '#6366f1',
            'Bollywood': '#10b981',
            'EDM': '#f59e0b',
            'House': '#3b82f6',
            'Hip Hop': '#8b5cf6'
        };
        return colors[genre] || '#64748b';
    }

    // Generate days labels for last 7 days
    const dayLabels = Array(7).fill(0).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { weekday: 'narrow' });
    });
    
    // Find max value for scaling graph
    const maxActivity = Math.max(...stats.weeklyActivity, 1);

    return (
        <div className="animate-in fade-in duration-500">
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Stats</h1>
            
             {/* Summary Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400">
                        <Clock size={20} />
                        <span className="text-sm font-medium uppercase tracking-wide">Total Playtime</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {Math.floor(stats.totalMinutes / 60)}h {Math.round(stats.totalMinutes % 60)}m
                    </p>
                </div>
                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                     <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400">
                        <Disc size={20} />
                        <span className="text-sm font-medium uppercase tracking-wide">Total Songs</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSongs}</p>
                </div>
                 <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                     <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400">
                        <User size={20} />
                        <span className="text-sm font-medium uppercase tracking-wide">Top Artist</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white truncate">{stats.topArtist}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Weekly Activity Graph */}
                 <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity size={20} className="text-[#e88d50]" />
                            Weekly Activity
                        </h3>
                         <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button 
                                onClick={() => setTimeRange('hours')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === 'hours' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                Hours
                            </button>
                             <button 
                                onClick={() => setTimeRange('count')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === 'count' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                Songs
                            </button>
                        </div>
                    </div>
                    <div className="h-48 flex items-end justify-between gap-2">
                        {stats.weeklyActivity.map((val, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                <div className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-t-lg relative h-32 flex items-end overflow-hidden">
                                    <div 
                                        className="w-full bg-[#e88d50] rounded-t-lg transition-all duration-500 group-hover:bg-[#cc6c77]" 
                                        style={{ height: `${(val / maxActivity) * 100}%` }} 
                                    />
                                </div>
                                <span className="text-xs text-gray-400 font-medium">{dayLabels[idx]}</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* Genre Distribution */}
                 <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                     <div className="flex items-center gap-2 mb-6">
                        <PieChart size={20} className="text-[#cc6c77]" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Genres</h3>
                     </div>
                     <div className="space-y-4">
                        {stats.genreDistribution.length > 0 ? stats.genreDistribution.map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700 dark:text-gray-200">{item.genre}</span>
                                    <span className="text-gray-500">{item.percentage}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full transition-all duration-1000 ease-out" 
                                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-gray-400 text-sm">
                                Start listening to music to see your top genres!
                            </div>
                        )}
                     </div>
                 </div>
             </div>
        </div>
    );
};

// ... existing ExplorePage, RadioPage, PodcastsPage, HistoryPage ...
const ExplorePage = ({ searchQuery }: { searchQuery: string }) => {
  const filteredCharts = MOCK_SONGS.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGenres = GENRES.slice(1).filter(g => 
    g.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
        {!searchQuery && (
          <>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Explore Genres</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {GENRES.slice(1).map((genre, idx) => (
                    <div key={genre} className={`h-40 rounded-2xl p-6 flex items-end relative overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] bg-gradient-to-br ${
                        ['from-purple-500 to-blue-500', 'from-[#e88d50] to-[#cc6c77]', 'from-green-500 to-teal-500', 'from-pink-500 to-rose-500'][idx % 4]
                    }`}>
                        <h3 className="text-2xl font-bold text-white relative z-10">{genre}</h3>
                        <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                        <Music className="absolute -bottom-4 -right-4 text-white/20 rotate-12" size={100} />
                    </div>
                ))}
            </div>
          </>
        )}
        
        {(searchQuery && filteredGenres.length > 0) && (
           <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Matching Genres</h2>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGenres.map((genre, idx) => (
                    <div key={genre} className={`h-24 rounded-2xl p-6 flex items-center justify-center relative overflow-hidden cursor-pointer bg-gray-100 dark:bg-gray-800`}>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white relative z-10">{genre}</h3>
                    </div>
                ))}
            </div>
           </div>
        )}
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-6">
           {searchQuery ? 'Matching Songs' : 'Top Charts'}
        </h2>
         <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-2 border border-gray-100 dark:border-gray-800">
          {filteredCharts.length > 0 ? filteredCharts.slice(0, searchQuery ? undefined : 5).map((song, i) => (
            <div key={song.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors group">
              <span className="text-gray-400 font-bold w-6 text-center">{i + 1}</span>
              <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{song.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
              </div>
              <span className="text-xs text-gray-400">{song.duration}</span>
            </div>
          )) : (
             <p className="p-4 text-center text-gray-500">No charts found matching "{searchQuery}"</p>
          )}
        </div>
    </div>
  );
};

const RadioPage = ({ searchQuery }: { searchQuery: string }) => {
  const filteredStations = MOCK_RADIO.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-8">
            <div className="bg-red-500 p-3 rounded-xl text-white shadow-lg shadow-red-500/30">
                <Signal size={24} />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Live Radio</h2>
                <p className="text-gray-500 dark:text-gray-400">Tune in to stations worldwide</p>
            </div>
        </div>

        {filteredStations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredStations.map((station) => (
                  <div key={station.id} className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#e88d50] dark:hover:border-[#e88d50] transition-all group cursor-pointer">
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                          <img src={station.cover} alt={station.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          {station.live && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                                  <span className="w-1.5 h-1.5 bg-white rounded-full" /> LIVE
                              </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play size={32} className="text-white" fill="currentColor" />
                          </div>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{station.name}</h3>
                      <p className="text-[#e88d50] font-medium text-sm">{station.frequency}</p>
                      <p className="text-gray-400 text-xs mt-1">{station.genre}</p>
                  </div>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">No radio stations found.</p>
        )}
    </div>
  );
};

const PodcastsPage = ({ searchQuery }: { searchQuery: string }) => {
  const filteredPodcasts = MOCK_PODCASTS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-8">
            <div className="bg-purple-500 p-3 rounded-xl text-white shadow-lg shadow-purple-500/30">
                <Mic2 size={24} />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Podcasts</h2>
                <p className="text-gray-500 dark:text-gray-400">Episodes for you</p>
            </div>
        </div>

        {filteredPodcasts.length > 0 ? (
          <div className="space-y-4">
              {filteredPodcasts.map((pod) => (
                  <div key={pod.id} className="flex items-center gap-4 p-4 bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all cursor-pointer group">
                      <div className="relative w-24 h-24 flex-shrink-0">
                          <img src={pod.cover} alt={pod.title} className="w-full h-full object-cover rounded-xl" />
                          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play size={24} className="text-white" fill="currentColor" />
                          </div>
                      </div>
                      <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{pod.title}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Hosted by {pod.host}</p>
                          <div className="flex items-center gap-3 text-xs font-medium">
                              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">{pod.date}</span>
                              <span className="text-[#e88d50]">{pod.duration}</span>
                          </div>
                      </div>
                      <button className="p-3 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-[#e88d50] hover:text-white hover:border-[#e88d50] transition-colors text-gray-400 hidden sm:block">
                          <Play size={20} fill="currentColor" />
                      </button>
                  </div>
              ))}
          </div>
        ) : (
           <p className="text-center text-gray-500 py-10">No podcasts found.</p>
        )}
    </div>
  );
};

const HistoryPage = () => {
    const { history, playSong } = useContext(PlayerContext);

    return (
         <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Listening History</h2>
            {history.length > 0 ? (
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {history.slice(0, 50).map((item, idx) => ( // Show recent 50
                        <div key={`${item.song.id}-${idx}`} onClick={() => playSong(item.song)} className="flex items-center gap-4 p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group last:border-0">
                            <img src={item.song.cover} alt={item.song.title} className="w-12 h-12 rounded-lg object-cover opacity-75 group-hover:opacity-100 transition-opacity" />
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">{item.song.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.song.artist}</p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-gray-400 mb-1">Played</p>
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                    {item.timestamp.toLocaleDateString() === new Date().toLocaleDateString() ? 
                                        item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                                        item.timestamp.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-20 text-gray-400">
                    <p>No listening history yet. Start playing some tunes!</p>
                 </div>
            )}
        </div>
    );
};

// ... existing LikedSongsPage, PlaylistPage ...
const LikedSongsPage = () => {
    const { likedSongs, playSong } = useContext(PlayerContext);
    const songs = MOCK_SONGS.filter(s => likedSongs.includes(s.id));

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-end gap-6 mb-8">
                <div className="w-48 h-48 bg-gradient-to-br from-[#e88d50] to-[#cc6c77] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#e88d50]/20">
                    <Heart size={64} className="text-white" fill="currentColor" />
                </div>
                <div>
                    <h5 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2">Playlist</h5>
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Liked Songs</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{songs.length} songs</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                {songs.length > 0 ? songs.map((song, idx) => (
                    <div 
                        key={song.id} 
                        onClick={() => playSong(song)}
                        className="flex items-center gap-4 p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group last:border-0"
                    >
                        <span className="text-gray-400 w-6 text-center font-medium">{idx + 1}</span>
                        <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{song.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">{song.duration}</span>
                    </div>
                )) : (
                    <div className="p-10 text-center text-gray-500">
                        <p className="mb-2">You haven't liked any songs yet.</p>
                        <p className="text-sm">Hit the heart icon on any song to add it here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PlaylistPage = ({ playlistId }: { playlistId: string }) => {
    const { playlists, playSong } = useContext(PlayerContext);
    const playlist = playlists.find(p => p.id === playlistId);

    if (!playlist) return <div>Playlist not found</div>;

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-end gap-6 mb-8">
                <div className="w-48 h-48 bg-gradient-to-br from-[#e88d50] to-[#cc6c77] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#e88d50]/20 text-white text-6xl font-bold">
                    {playlist.name[0]}
                </div>
                <div>
                    <h5 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2">Playlist</h5>
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">{playlist.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{playlist.songs.length} songs • Created {playlist.createdAt.toLocaleDateString()}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                {playlist.songs.length > 0 ? playlist.songs.map((song, idx) => (
                    <div 
                        key={`${playlist.id}-${song.id}-${idx}`}
                        onClick={() => playSong(song)}
                        className="flex items-center gap-4 p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group last:border-0"
                    >
                        <span className="text-gray-400 w-6 text-center font-medium">{idx + 1}</span>
                        <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{song.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">{song.duration}</span>
                    </div>
                )) : (
                    <div className="p-10 text-center text-gray-500">
                        <p className="mb-2">This playlist is empty.</p>
                        <p className="text-sm">Add songs by clicking the + icon on any song card!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main App ---

const App = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeGenre, setActiveGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  
  // Data State
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [history, setHistory] = useState<PlayHistoryItem[]>(generateInitialHistory());

  // Modal States
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [songToAdd, setSongToAdd] = useState<Song | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  // Dropdown States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [currentSong, setCurrentSong] = useState<Song | null>(MOCK_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const playSong = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const toggleLike = (songId: number) => {
    setLikedSongs(prev => 
        prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    );
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: newPlaylistName,
        cover: '',
        songs: [],
        createdAt: new Date()
    };
    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName("");
    setIsCreatePlaylistOpen(false);
  };

  const openAddToPlaylistModal = (song: Song) => {
    setSongToAdd(song);
    setIsAddToPlaylistOpen(true);
  };

  const addToPlaylist = (playlistId: string) => {
    if (!songToAdd) return;
    setPlaylists(playlists.map(pl => {
        if (pl.id === playlistId) {
            return { ...pl, songs: [...pl.songs, songToAdd] };
        }
        return pl;
    }));
    setIsAddToPlaylistOpen(false);
    setSongToAdd(null);
  };
  
  const addToHistory = (song: Song) => {
      setHistory(prev => [{ song, timestamp: new Date() }, ...prev]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // Helper for notification icon
  const NotificationIcon = ({ type }: { type: string }) => {
      const bgColors = {
          release: 'bg-purple-100 dark:bg-purple-900/30',
          system: 'bg-blue-100 dark:bg-blue-900/30',
          social: 'bg-green-100 dark:bg-green-900/30',
          event: 'bg-orange-100 dark:bg-orange-900/30'
      } as any;

      const textColors = {
        release: 'text-purple-600 dark:text-purple-400',
        system: 'text-blue-600 dark:text-blue-400',
        social: 'text-green-600 dark:text-green-400',
        event: 'text-orange-600 dark:text-orange-400'
      } as any;

      const Icon = () => {
          switch(type) {
              case 'release': return <Music size={16} />;
              case 'system': return <Settings size={16} />;
              case 'social': return <User size={16} />;
              case 'event': return <Sparkles size={16} />;
              default: return <Bell size={16} />;
          }
      }

      return (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColors[type] || 'bg-gray-100'} ${textColors[type] || 'text-gray-500'} flex-shrink-0`}>
              <Icon />
          </div>
      )
  }
  
  const renderContent = () => {
      if (activeTab.startsWith('playlist-')) {
          const playlistId = activeTab.replace('playlist-', '');
          return <PlaylistPage playlistId={playlistId} />;
      }

      switch(activeTab) {
          case 'home': return <HomePage activeGenre={activeGenre} setActiveGenre={setActiveGenre} searchQuery={searchQuery} />;
          case 'explore': return <ExplorePage searchQuery={searchQuery} />;
          case 'radio': return <RadioPage searchQuery={searchQuery} />;
          case 'podcasts': return <PodcastsPage searchQuery={searchQuery} />;
          case 'stats': return <StatsPage />;
          case 'history': return <HistoryPage />;
          case 'liked': return <LikedSongsPage />;
          case 'recommended': return <RecommendedPage />;
          default: return <HomePage activeGenre={activeGenre} setActiveGenre={setActiveGenre} searchQuery={searchQuery} />;
      }
  };

  return (
    <PlayerContext.Provider value={{ 
      currentSong, 
      isPlaying, 
      likedSongs,
      playlists,
      history,
      playSong, 
      togglePlay: () => setIsPlaying(!isPlaying),
      toggleLike,
      createPlaylist,
      addToPlaylist: (id, song) => {}, 
      addToHistory,
      openAddToPlaylistModal
    }}>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="min-h-screen bg-[#f8f5f2] dark:bg-[#121212] text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans flex overflow-hidden">
          
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isOpen={isSidebarOpen}
            setIsOpen={setSidebarOpen}
            onCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
          />

          {/* Main Content */}
          <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
            
            {/* Navbar */}
            <header className="h-20 px-6 md:px-10 flex items-center justify-between bg-transparent z-50 shrink-0 relative">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
                >
                  <Menu size={24} />
                </button>
                
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-white dark:bg-gray-800 shadow-sm px-4 py-2.5 rounded-full w-96 border border-gray-200 dark:border-gray-700 focus-within:border-orange-500 dark:focus-within:border-orange-500 transition-colors">
                  <Search size={18} className="text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search for artists, songs, or moods..." 
                    className="bg-transparent border-none outline-none ml-3 text-sm w-full text-gray-900 dark:text-white placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-5">
                <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-all shadow-sm hover:text-orange-500 dark:hover:text-orange-400">
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsProfileOpen(false);
                    }}
                    className={`p-2 rounded-full transition-all duration-200 ${isNotificationsOpen ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f8f5f2] dark:border-[#121212]"></span>
                    )}
                  </button>
                  
                   {isNotificationsOpen && (
                    <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#1e1e1e]">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">{unreadCount}</span>}
                        </div>
                        <button onClick={markAllRead} className="text-xs text-gray-500 dark:text-gray-400 font-medium hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center gap-1">
                            <Check size={14} /> Mark all read
                        </button>
                      </div>
                      <div className="max-h-[24rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 bg-white dark:bg-[#1e1e1e]">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                            <div key={notif.id} className={`p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex gap-3 group transition-colors relative ${notif.unread ? 'bg-orange-50/40 dark:bg-orange-500/5' : ''}`}>
                                {notif.unread && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                                )}
                                
                                <NotificationIcon type={notif.type} />
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <p className={`text-sm ${notif.unread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                            {notif.title}
                                        </p>
                                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">{notif.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{notif.text}</p>
                                </div>
                                
                                {notif.unread && (
                                    <div className="self-center">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full shadow-sm shadow-orange-500/50" />
                                    </div>
                                )}
                            </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-xs">
                                <p>No notifications right now.</p>
                            </div>
                        )}
                        <div className="p-8 text-center text-gray-400 text-xs">
                            <p>That's all your notifications for now.</p>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-gray-800 text-center">
                          <button className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                              View All History
                          </button>
                      </div>
                    </div>
                    </>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative pl-4 border-l border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsNotificationsOpen(false);
                    }}
                    className="flex items-center gap-3 group focus:outline-none"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold leading-tight group-hover:text-orange-500 transition-colors">{MOCK_USER.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Free Plan</p>
                    </div>
                    <div className={`relative rounded-full p-0.5 transition-all duration-200 ${isProfileOpen ? 'bg-orange-500' : 'bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}`}>
                      <img src={MOCK_USER.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm" />
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2">
                        <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">
                          <User size={16} /> Profile
                        </button>
                        <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">
                          <Settings size={16} /> Settings
                        </button>
                        <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">
                          <CreditCard size={16} /> Billing
                        </button>
                      </div>
                      <div className="h-px bg-gray-100 dark:bg-gray-700 mx-2" />
                      <div className="p-2">
                        <button className="w-full text-left px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-md flex items-center gap-3 text-sm font-semibold transition-all">
                          <Sparkles size={16} /> Upgrade Plan
                        </button>
                      </div>
                      <div className="h-px bg-gray-100 dark:bg-gray-700 mx-2" />
                      <div className="p-2">
                        <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                          <LogOut size={16} /> Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>
            
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-32 scrollbar-hide" onClick={() => {
              setIsProfileOpen(false);
              setIsNotificationsOpen(false);
            }}>
                {renderContent()}
            </div>
            
            <MusicPlayer />

            {/* Create Playlist Modal */}
            {isCreatePlaylistOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Playlist</h3>
                            <button onClick={() => setIsCreatePlaylistOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <input 
                            type="text"
                            placeholder="Playlist Name"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white mb-4 focus:ring-2 focus:ring-[#e88d50]" 
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                             <button 
                                onClick={() => setIsCreatePlaylistOpen(false)}
                                className="px-4 py-2 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={createPlaylist}
                                disabled={!newPlaylistName.trim()}
                                className="px-4 py-2 rounded-xl font-medium bg-[#e88d50] text-white hover:bg-[#cc6c77] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add To Playlist Modal */}
            {isAddToPlaylistOpen && songToAdd && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                     <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add to Playlist</h3>
                             <button onClick={() => setIsAddToPlaylistOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                             <img src={songToAdd.cover} alt={songToAdd.title} className="w-10 h-10 rounded-lg" />
                             <div className="overflow-hidden">
                                 <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{songToAdd.title}</p>
                                 <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{songToAdd.artist}</p>
                             </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
                            {playlists.map(pl => (
                                <button
                                    key={pl.id}
                                    onClick={() => addToPlaylist(pl.id)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e88d50] to-[#cc6c77] flex items-center justify-center text-white font-bold">
                                        {pl.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{pl.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{pl.songs.length} songs</p>
                                    </div>
                                </button>
                            ))}
                            {playlists.length === 0 && (
                                <p className="text-center text-gray-500 py-4">No playlists yet. Create one first!</p>
                            )}
                        </div>
                        <div className="flex justify-end">
                             <button 
                                onClick={() => {
                                    setIsAddToPlaylistOpen(false);
                                    setIsCreatePlaylistOpen(true);
                                }}
                                className="text-sm text-[#e88d50] font-medium hover:underline"
                            >
                                + Create New Playlist
                            </button>
                        </div>
                     </div>
                </div>
            )}

          </main>
        </div>
      </div>
    </PlayerContext.Provider>
  );
};

export default App;