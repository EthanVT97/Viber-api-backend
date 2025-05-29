// routes/logs.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const LOG_FILE = path.join(__dirname, '../logs/webhook.log');

router.get('/logs', (req, res) => {
  try {
    const raw = fs.readFileSync(LOG_FILE, 'utf-8');
    const entries = raw
      .split('\n\n')
      .filter(Boolean)
      .map(block => {
        const match = block.match(/\(.*?)\ Token: (.*?)\\n([\\s\\S]*)/);
        if (!match) return null;
        return {
          timestamp: match[1],
          token: match[2],
          payload: JSON.parse(match[3]),
        };
      })
      .filter(Boolean)
      .reverse(); // Most recent first
    res.json({ logs: entries });
  } catch (err) {
    console.error('Log read error:', err);
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

module.exports = router;
