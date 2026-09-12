const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const User = require('../models/User');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// 1. Generate Auth URL (passing userId in state)
router.get('/auth', (req, res) => {
  const userId = req.query.userId;
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
    state: userId // User ID ko Google ke pass bhej rahe hain taaki callback me mil jaye
  });
  res.json({ url });
});

// 2. OAuth Callback & Save Tokens to User Schema
router.get('/callback', async (req, res) => {
  const { code, state: userId } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    if (userId) {
      await User.findByIdAndUpdate(userId, { googleTokens: tokens });
    }

    res.redirect(`https://tasker-tech-zephyr.vercel.app/dashboard?calendar=connected`);
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// 3. Fetch Events using User's Saved Tokens
router.get('/sync/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.googleTokens) {
      return res.status(400).json({ error: 'Google Calendar not connected' });
    }

    oauth2Client.setCredentials(user.googleTokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    res.json({ message: 'Sync successful', count: events.length, events });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: 'Sync failed' });
  }
});

module.exports = router;