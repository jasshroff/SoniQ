import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase'; 
import { 
  LayoutGrid, History as HistoryIcon, User as UserIcon, 
  Sparkles, Play, Heart, LogOut, Disc, 
  Activity, Headphones, Twitter, Instagram, Github, Mail, Globe, 
  ArrowRight, ExternalLink, ShieldCheck, Music, Lock, ChevronLeft, Save, Chrome, CheckCircle
} from 'lucide-react';

// --- TYPES ---
interface Song {
  id: string;
  uri: string; // Needed for Spotify export
  title: string;
  artist: string;
  cover: string;
  duration: string;
}

interface HistoryEntry {
  _id: string; // MongoDB ID
  mood: string;
  date: string;
  songs: Song[];
}

interface UserData {
  id: string; // Needed for backend calls
  name: string;
  email: string;
  spotifyConnected?: boolean;
}

// --- MAIN COMPONENT ---
export default function App() {
  const [page, setPage] = useState<'home' | 'dashboard' | 'history' | 'user'>('home');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [exporting, setExporting] = useState(false); // State for Spotify export loading
  const [mood, setMood] = useState('');
  const [playlist, setPlaylist] = useState<Song[]>([]);
  
  // --- REAL HISTORY STATE ---
  const [history, setHistory] = useState<HistoryEntry[]>([]); 

  // --- AUTH STATE ---
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<UserData | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  
  // --- USER SETTINGS STATE ---
  const [viewMode, setViewMode] = useState<'profile' | 'settings'>('profile');
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
  const [settingsMsg, setSettingsMsg] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Check URL for Spotify Success (redirected from backend)
    const params = new URLSearchParams(window.location.search);
    if (params.get('spotify') === 'connected' && storedUser) {
       const u = JSON.parse(storedUser);
       u.spotifyConnected = true; // Update local state
       localStorage.setItem('user', JSON.stringify(u));
       setUser(u);
       // Clean URL without refreshing the page
       window.history.replaceState({}, document.title, "/");
       setPage('dashboard');
    }
  }, [token]);

  // --- FETCH HISTORY WHEN PAGE CHANGES ---
  useEffect(() => {
    if (page === 'history' && user?.id) {
      axios.get(`http://localhost:5000/api/history/${user.id}`)
        .then(res => setHistory(res.data))
        .catch(err => console.error("Failed to fetch history", err));
    }
  }, [page, user]);

  // --- HANDLERS ---

  const handleAuth = async () => {
    try {
      setAuthError('');
      // Basic validation
      if (!authData.email || !authData.password) {
        setAuthError("Please fill in all fields");
        return;
      }
      if (authMode === 'register' && !authData.name) {
        setAuthError("Name is required");
        return;
      }

      const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
      const url = `http://localhost:5000${endpoint}`;
      const res = await axios.post(url, authData);
      const { token: newToken, user: newUser } = res.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      setPage('home'); 
    } catch (err: any) {
      setAuthError(err.response?.data?.msg || 'Connection failed. Is backend running?');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      const res = await axios.post('http://localhost:5000/api/google-login', {
        name: googleUser.displayName,
        email: googleUser.email,
        googleId: googleUser.uid 
      });
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      setPage('home');
    } catch (error) {
      setAuthError("Google Sign-In failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setPage('home');
  };

  const handleChangePassword = async () => {
    if(!passData.newPassword || !passData.oldPassword) {
      setSettingsMsg("Please fill all fields");
      return;
    }
    setSettingsMsg("Password update request sent... (Mock)");
  };

  const handleGenerate = async () => {
    if (!mood) return;
    setLoading(true);
    setGenerated(false);
    try {
      // Calls backend to search Spotify and save history
      const res = await axios.post('http://localhost:5000/api/generate-playlist', { 
        mood,
        userId: user?.id
      });
      setPlaylist(res.data);
      setGenerated(true);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch music from backend.");
    } finally {
      setLoading(false);
    }
  };

  // --- REAL SPOTIFY EXPORT ---
  const handleExportToSpotify = async () => {
    if (!user) return;

    // 1. Check if connected
    if (!user.spotifyConnected) {
      // Redirect to Backend Auth Route to start OAuth flow
      // NOTE: Ensure your backend is running on port 5000
      window.location.href = `http://localhost:5000/api/spotify/login?userId=${user.id}`;
      return;
    }

    // 2. Create Playlist
    setExporting(true);
    try {
      const trackUris = playlist.map(s => s.uri).filter(uri => uri); // Ensure valid URIs
      
      if(trackUris.length === 0) {
         alert("No valid tracks to export.");
         setExporting(false);
         return;
      }

      const res = await axios.post('http://localhost:5000/api/create-spotify-playlist', {
        userId: user.id,
        mood: mood,
        tracks: trackUris
      });

      if (res.data.playlistUrl) {
        // 3. Open the new playlist
        window.open(res.data.playlistUrl, '_blank'); 
      }
    } catch (error) {
      console.error(error);
      alert("Export failed. Your Spotify token might have expired. Please reconnect in Profile.");
    } finally {
      setExporting(false);
    }
  };

  // --- RENDER HELPER FUNCTIONS ---
  
  const renderNavButton = ({ target, icon: Icon, label }: { target: typeof page, icon: any, label: string }) => (
    <button onClick={() => setPage(target)} className={`relative px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${page === target ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/25' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      <Icon size={18} /><span className="font-medium">{label}</span>
      {page === target && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"></span>
      )}
    </button>
  );

  const renderFooter = () => (
    <footer className="mt-auto border-t border-white/10 bg-black/20 backdrop-blur-xl pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            {/* LOGO: FONT UPDATED TO LEAGUE SPARTAN */}
            <div className="flex items-center gap-2 mb-6 text-2xl font-bold font-['League_Spartan']">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Music className="text-white" size={20} />
              </div>
              SoniQ
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">The world's most advanced AI music curator. We turn your deepest emotions into the perfect audio frequency.</p>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-blue-400 transition-colors"><Twitter size={18} /></button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-pink-500 transition-colors"><Instagram size={18} /></button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"><Github size={18} /></button>
            </div>
          </div>
          <div><h4 className="font-bold mb-6 text-lg">Explore</h4><ul className="space-y-4 text-gray-400"><li className="hover:text-white cursor-pointer" onClick={() => setPage('home')}>Home</li><li className="hover:text-white cursor-pointer" onClick={() => setPage('dashboard')}>Create Playlist</li></ul></div>
          <div><h4 className="font-bold mb-6 text-lg">Company</h4><ul className="space-y-4 text-gray-400"><li className="hover:text-white cursor-pointer">About SoniQ</li><li className="hover:text-white cursor-pointer">Privacy Policy</li></ul></div>
          <div><h4 className="font-bold mb-6 text-lg">Contact</h4><div className="space-y-4 text-gray-400"><div className="flex items-center gap-3"><Mail size={16} /><span>hello@soniq.ai</span></div><div className="flex items-center gap-3"><Globe size={16} /><span>www.soniq.ai</span></div></div></div>
        </div>
        <div className="border-t border-white/5 pt-8 text-sm text-gray-500 text-center"><p>&copy; 2024 SoniQ Systems Inc. All rights reserved.</p></div>
      </div>
    </footer>
  );

  const renderAuthPage = () => (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
       <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
       </div>
       <div className="glass-card p-8 rounded-3xl max-w-md w-full animate-[fadeIn_0.5s_ease-out]">
          <div className="text-center mb-8">
             {/* LOGO: FONT UPDATED TO LEAGUE SPARTAN */}
             <div className="inline-flex items-center gap-3 mb-2">
               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg"><Music className="text-white" size={24} /></div>
               <span className="text-3xl font-bold font-['League_Spartan']">SoniQ</span>
             </div>
             <h2 className="text-2xl font-bold">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          </div>
          {authError && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">{authError}</div>}
          <div className="space-y-4">
            {authMode === 'register' && <input type="text" placeholder="Full Name" value={authData.name} onChange={e => setAuthData({...authData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-violet-500 transition-colors" />}
            <input type="email" placeholder="Email" value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-violet-500 transition-colors" />
            <input type="password" placeholder="Password" value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-violet-500 transition-colors" />
            <button onClick={handleAuth} className="w-full bg-violet-600 py-3 rounded-xl font-bold hover:bg-violet-700 transition">{authMode === 'login' ? 'Sign In' : 'Sign Up'}</button>
            
            <div className="relative my-4">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
               <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#0a0a16] text-gray-500">Or continue with</span></div>
            </div>

            <button onClick={handleGoogleAuth} className="w-full bg-white text-black py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-200 transition"><Chrome size={18}/> Google</button>
            <p className="text-center mt-4 text-gray-400 cursor-pointer hover:text-white" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>{authMode === 'login' ? "New here? Create account" : "Already have account? Login"}</p>
          </div>
       </div>
    </div>
  );

  const renderHome = () => (
    <div className="flex flex-col items-center min-h-[80vh] justify-center text-center">
      <div className="glass-card inline-block px-4 py-1 rounded-full border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest mb-6 animate-float">Authenticated Session</div>
      <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter">Welcome, <span className="text-gradient">{user?.name?.split(' ')[0]}</span></h1>
      <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">Ready to discover your next favorite track? Head to the dashboard to start generating.</p>
      <button onClick={() => setPage('dashboard')} className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg">Create Playlist</button>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-4xl mx-auto py-10 min-h-[60vh]">
      <div className="glass-card p-8 rounded-3xl mb-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><Sparkles className="text-yellow-400" /> Generate Playlist</h2>
        <div className="relative">
          <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} placeholder="Describe your vibe (e.g., 'Cyberpunk rain city')..." className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-lg focus:outline-none focus:border-purple-500 transition-all text-white placeholder:text-gray-600" />
          <button onClick={handleGenerate} disabled={loading || !mood} className="absolute right-3 top-3 bottom-3 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg">{loading ? 'Analyzing...' : 'Generate'}</button>
        </div>
      </div>
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-purple-300 animate-pulse">Scanning audio frequencies...</p>
        </div>
      )}
      {!loading && generated && (
        <div className="animate-[slideUp_0.5s_ease-out]">
          <div className="flex justify-between items-end mb-6">
            <div><p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Curated For</p><h3 className="text-2xl font-bold text-gradient">"{mood}"</h3></div>
            <button onClick={handleExportToSpotify} disabled={exporting} className={`font-bold px-6 py-2 rounded-full flex items-center gap-2 transition-transform hover:scale-105 inline-flex shadow-lg ${user?.spotifyConnected ? 'bg-[#1DB954] text-black hover:bg-[#1ed760]' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
              {exporting ? <Activity className="animate-spin" size={20}/> : <Disc size={20} />}
              {user?.spotifyConnected ? (exporting ? 'Creating...' : 'Open in Spotify') : 'Connect Spotify'}
            </button>
          </div>
          <div className="grid gap-4">
            {playlist.map((song, i) => (
              <div key={song.id} className="glass-card p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-5">
                  <span className="text-gray-500 font-mono w-6 text-center">{i + 1}</span>
                  <img src={song.cover} alt={song.title} className="w-14 h-14 rounded-lg shadow-lg group-hover:scale-105 transition-transform" />
                  <div><h4 className="font-bold text-lg">{song.title}</h4><p className="text-gray-400 text-sm">{song.artist}</p></div>
                </div>
                <div className="flex items-center gap-6"><button className="text-gray-500 hover:text-pink-500 transition-colors"><Heart size={20} /></button><span className="text-gray-500 font-mono text-sm">{song.duration}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderHistoryPage = () => (
    <div className="max-w-5xl mx-auto py-8 min-h-[60vh]">
      <h2 className="text-4xl font-bold mb-10">Sonic History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-20 bg-white/5 rounded-3xl border border-white/5">
            <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-xl mb-2">No history yet.</p>
            <p className="text-sm">Go generate some vibes!</p>
          </div>
        ) : (
          history.map((item, idx) => (
            <div key={item._id || idx} className="glass-card p-6 rounded-3xl hover:border-purple-500/50 transition-all duration-300 group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-purple-500/20 transition-colors"><Music className="text-purple-400" size={24} /></div>
                <span className="text-xs font-mono text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 truncate">"{item.mood}"</h3>
              <p className="text-gray-400 text-sm mb-6">{item.songs.length} Songs Generated</p>
              
              {/* Visual Bars for song count */}
              <div className="flex gap-1 mb-6 overflow-hidden rounded-full h-2 bg-gray-800">
                 {[...Array(Math.min(item.songs.length, 5))].map((_, i) => (
                    <div key={i} className={`flex-1 ${['bg-blue-500','bg-purple-500','bg-pink-500','bg-orange-500'][i%4]}`}></div>
                 ))}
              </div>
              
              <button onClick={() => { setMood(item.mood); setPlaylist(item.songs); setGenerated(true); setPage('dashboard'); }} className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-bold">Replay Session</button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderUserPage = () => (
    <div className="max-w-3xl mx-auto py-12 min-h-[60vh]">
        <div className="glass-card rounded-[40px] p-10 relative overflow-hidden">
          <div className="relative flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-violet-500 to-pink-500 shadow-xl">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-5xl font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold">{user?.name}</h2>
              <p className="text-gray-400">{user?.email}</p>
              <div className="flex gap-3 mt-4 justify-center md:justify-start">
                {user?.spotifyConnected ? 
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/20 flex items-center gap-1"><CheckCircle size={12}/> Connected</span>
                  : <button onClick={() => window.location.href = `http://localhost:5000/api/spotify/login?userId=${user?.id}`} className="px-3 py-1 rounded-full bg-gray-500/20 text-white text-xs font-bold border border-gray-500/20 hover:bg-gray-500/40 transition flex items-center gap-2"><Disc size={12}/> Connect Spotify</button>
                }
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/20">Free Plan</span>
              </div>
            </div>
          </div>
          {viewMode === 'profile' ? (
            <div className="space-y-4">
              <div onClick={() => setViewMode('settings')} className="p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex justify-between items-center group">
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors flex items-center gap-3"><Lock size={18}/> Account Settings & Password</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all"><span className="text-xl leading-none">&rsaquo;</span></div>
              </div>
              <div className="p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex justify-between items-center group opacity-75">
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors flex items-center gap-3"><Music size={18}/> Playback Preferences</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all"><span className="text-xl leading-none">&rsaquo;</span></div>
              </div>
              <button onClick={handleLogout} className="w-full mt-6 py-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 font-bold"><LogOut size={18} /> Sign Out</button>
            </div>
          ) : (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
               <button onClick={() => {setViewMode('profile'); setSettingsMsg('');}} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"><ChevronLeft size={20} /> Back to Profile</button>
               <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><Lock className="text-purple-400"/> Change Password</h2>
               {settingsMsg && <div className={`p-3 rounded-lg mb-6 text-sm text-center ${settingsMsg.includes('sent') ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30'}`}>{settingsMsg}</div>}
               <div><label className="block text-sm text-gray-400 mb-2 ml-1">Current Password</label><input type="password" value={passData.oldPassword} onChange={(e) => setPassData({...passData, oldPassword: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors" /></div>
               <div><label className="block text-sm text-gray-400 mb-2 ml-1">New Password</label><input type="password" value={passData.newPassword} onChange={(e) => setPassData({...passData, newPassword: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors" /></div>
               <button onClick={handleChangePassword} className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-4"><Save size={18}/> Update Password</button>
            </div>
          )}
        </div>
    </div>
  );

  if (!token) return renderAuthPage();

  return (
    <div className="min-h-screen text-white flex flex-col">
      <nav className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('home')}>
            {/* LOGO: FONT UPDATED TO LEAGUE SPARTAN */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Music className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight font-['League_Spartan']">SoniQ</span>
          </div>
          <div className="hidden md:flex gap-4">
            {renderNavButton({ target: 'home', icon: LayoutGrid, label: 'Home' })}
            {renderNavButton({ target: 'dashboard', icon: Sparkles, label: 'Create' })}
            {renderNavButton({ target: 'history', icon: HistoryIcon, label: 'History' })}
            {renderNavButton({ target: 'user', icon: UserIcon, label: user?.name?.split(' ')[0] || 'Profile' })}
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-6 pt-10 flex-grow">
        {page === 'home' && renderHome()}
        {page === 'dashboard' && renderDashboard()}
        {page === 'history' && renderHistoryPage()}
        {page === 'user' && renderUserPage()}
      </main>
      {renderFooter()}
    </div>
  );
}