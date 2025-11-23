const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Path to the frontend build directory
const frontendBuildPath = path.join(__dirname, '../frontend/build');

// Serve static files from the frontend build directory
app.use(express.static(frontendBuildPath));

// Mock Firebase Config - REPLACE WITH YOUR ACTUAL CONFIG
// In a production environment, these should be loaded from environment variables
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-app.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "your-app",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-app.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Catch-all handler for any request that doesn't match an API route
app.get(/.*/, (req, res) => {
    const indexPath = path.join(frontendBuildPath, 'index.html');

    fs.readFile(indexPath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('Error reading index.html:', err);
            return res.status(500).send('Error loading application. Ensure the frontend is built.');
        }

        // Inject the Firebase config into the HTML
        // We inject it as a global variable window.__firebase_config
        const injectedHtml = htmlData.replace(
            '<head>',
            `<head><script>window.__firebase_config = '${JSON.stringify(firebaseConfig)}';</script>`
        );

        res.send(injectedHtml);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
