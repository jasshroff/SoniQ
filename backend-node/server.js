require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const axios = require('axios'); 
const querystring = require('querystring'); 

// Import Model
const User = require('./models/UserTemp');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// --- CONFIG ---
const PORT = process.env.PORT || 5000;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/api/spotify/callback`; 
const FRONTEND_URI = 'http://localhost:5173'; 

// --- EMAIL CONFIG ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: '"SoniQ Team" <no-reply@soniq.ai>',
      to: email,
      subject: 'Welcome to SoniQ! 🎧',
      html: `<h1>Welcome to SoniQ, ${name}!</h1><p>Get ready to discover music that matches your soul.</p>`
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email error:', error);
  }
};

// --- HELPER: GENERIC TOKEN ---
const getClientCredsToken = async () => {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await axios.post('https://accounts.spotify.com/api/token', 
    new URLSearchParams({ grant_type: 'client_credentials' }),
    { headers: { 'Authorization': `Basic ${auth}` } }
  );
  return response.data.access_token;
};

// --- DATABASE ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ==========================================
//  CORE ROUTES (UPDATED FOR HISTORY)
// ==========================================

// 1. GENERATE PLAYLIST (Search + Save History)
app.post('/api/generate-playlist', async (req, res) => {
  try {
    const { mood, userId } = req.body; // Get userId to save history
    if (!mood) return res.status(400).json({ msg: 'Mood is required' });

    const token = await getClientCredsToken();
    const searchQuery = `${mood} mood`; 
    
    const spotifyRes = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: searchQuery, type: 'track', limit: 12 }
    });

    const tracks = spotifyRes.data.tracks.items.map(track => ({
      id: track.id,
      uri: track.uri,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      cover: track.album.images[0]?.url || '',
      duration: '3:00' 
    }));

    // --- SAVE TO HISTORY (If user logged in) ---
    if (userId) {
      const historyItem = {
        mood: mood,
        date: new Date(),
        songs: tracks // Saving the simplified track list
      };
      await User.findByIdAndUpdate(userId, { $push: { history: { $each: [historyItem], $position: 0 } } });
    }
    // -------------------------------------------

    res.json(tracks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to fetch music' });
  }
});

// 2. GET HISTORY (NEW)
app.get('/api/history/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.history);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ==========================================
//  SPOTIFY AUTH & PLAYLIST CREATION
// ==========================================

app.get('/api/spotify/login', (req, res) => {
  const userId = req.query.userId; 
  const scope = 'playlist-modify-public playlist-modify-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: userId 
    }));
});

app.get('/api/spotify/callback', async (req, res) => {
  const code = req.query.code || null;
  const userId = req.query.state || null;
  if (!code || !userId) return res.redirect(`${FRONTEND_URI}/user?error=spotify_failed`);

  try {
    const authOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({ code, redirect_uri: REDIRECT_URI, grant_type: 'authorization_code' }),
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    const tokenRes = await axios(authOptions);
    await User.findByIdAndUpdate(userId, {
      spotifyConnected: true,
      spotifyAccessToken: tokenRes.data.access_token,
      spotifyRefreshToken: tokenRes.data.refresh_token
    });
    res.redirect(`${FRONTEND_URI}/dashboard?spotify=connected`);
  } catch (error) {
    res.redirect(`${FRONTEND_URI}/user?error=token_error`);
  }
});

app.post('/api/create-spotify-playlist', async (req, res) => {
  const { userId, mood, tracks } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || !user.spotifyAccessToken) return res.status(401).json({ msg: 'User not connected to Spotify' });

    const token = user.spotifyAccessToken;
    const meRes = await axios.get('https://api.spotify.com/v1/me', { headers: { 'Authorization': `Bearer ${token}` } });
    
    const playlistRes = await axios.post(`https://api.spotify.com/v1/users/${meRes.data.id}/playlists`, 
      { name: `SoniQ Mix: ${mood}`, description: `Generated by SoniQ AI`, public: false },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (tracks?.length > 0) {
      await axios.post(`https://api.spotify.com/v1/playlists/${playlistRes.data.id}/tracks`,
        { uris: tracks },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
    }
    res.json({ msg: 'Success', playlistUrl: playlistRes.data.external_urls.spotify });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to create playlist' });
  }
});

// ==========================================
//  USER AUTH ROUTES
// ==========================================

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    sendWelcomeEmail(email, name);
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
  } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, spotifyConnected: user.spotifyConnected } });
    });
  } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/google-login', async (req, res) => {
  try {
    const { email, name } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, spotifyConnected: user.spotifyConnected } });
      });
    } else {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      user = new User({ name, email, password: hashedPassword });
      await user.save();
      sendWelcomeEmail(email, name);
      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      });
    }
  } catch (err) { res.status(500).send('Server Error'); }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));