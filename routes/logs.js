// routes/logs.js
const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const router = express.Router();

const LOG_FILE = path.join(__dirname, '../logs/webhook.log');

router.get('/logs', async (req, res) => {
  try {
    const raw = await fs.readFile(LOG_FILE, 'utf-8');

    // Split log entries by double newline (each entry ends with \n\n)
    const entries = raw
      .split('\n\n')
      .filter(Boolean)
      .map(block => {
        // Your webhookController logs have format:
        // [timestamp] Token: token\n{json payload}\n\n
        // Example:
        // [2025-05-29T12:00:00.000Z] Token: abc123
        // { ...json... }

        const firstLineEnd = block.indexOf('\n');
        if (firstLineEnd === -1) return null;

        const header = block.slice(0, firstLineEnd).trim();
        const payloadRaw = block.slice(firstLineEnd + 1).trim();

        // Parse timestamp and token from header
        // header example: "[2025-05-29T12:00:00.000Z] Token: abc123"
        const headerMatch = header.match(/^(.+?) Token: (.+)$/);
        if (!headerMatch) return null;

        const timestamp = headerMatch[1];
        const token = headerMatch[2];

        // Parse JSON payload safely
        let payload = null;
        try {
          payload = JSON.parse(payloadRaw);
        } catch {
          // Could not parse JSON payload, skip this entry or mark invalid
          return null;
        }

        return { timestamp, token, payload };
      })
      .filter(Boolean)
      .reverse(); // newest first

    res.json({ logs: entries });
  } catch (err) {
    console.error('Log read error:', err);
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

module.exports = router;
