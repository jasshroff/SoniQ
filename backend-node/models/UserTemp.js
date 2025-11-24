const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  // --- NEW FIELDS FOR SPOTIFY ---
  spotifyConnected: {
    type: Boolean,
    default: false
  },
  spotifyAccessToken: String,
  spotifyRefreshToken: String,
  // ------------------------------
  history: [
    {
      mood: String,
      date: { type: Date, default: Date.now },
      songs: Array
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);