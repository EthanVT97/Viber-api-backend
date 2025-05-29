const fs = require('fs');
const path = require('path');

const VALID_TOKENS = [
  '4defd4e40527e289-669a0d93997add7f-9885a2be33bb8579',
  // Add more if needed
];

const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'webhook.log');

// ✅ Auto-create logs folder if not exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

exports.handleWebhook = (req, res) => {
  const token = req.params.token;
  const event = req.body;

  // 🔐 Validate token
  if (!VALID_TOKENS.includes(token)) {
    console.warn(`[Webhook] Rejected: Invalid token "${token}"`);
    return res.status(403).json({ status: 'error', message: 'Invalid token' });
  }

  // 📝 Format log
  const logEntry = `[${new Date().toISOString()}] Token: ${token}\n${JSON.stringify(event, null, 2)}\n\n`;

  // 💾 Append to log file
  fs.appendFile(LOG_FILE, logEntry, err => {
    if (err) console.error('[Webhook] Logging error:', err);
  });

  // 📥 Basic console output
  console.log(`[Webhook] Event from ${token}:`, event?.event);

  // ✉️ Auto-reply logic placeholder (can integrate here)

  res.status(200).json({ status: 'ok', received: true });
};
