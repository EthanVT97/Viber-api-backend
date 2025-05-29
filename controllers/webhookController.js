const fs = require('fs');
const path = require('path');

// Load valid tokens from environment variable, comma-separated
const VALID_TOKENS = (process.env.VALID_TOKENS || '')
  .split(',')
  .map(t => t.trim())
  .filter(Boolean);

const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'webhook.log');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

exports.handleWebhook = async (req, res) => {
  try {
    const token = req.params.token;
    const event = req.body;

    // Token validation
    if (!VALID_TOKENS.includes(token)) {
      console.warn(`[Webhook] Rejected: Invalid token "${token}"`);
      return res.status(403).json({ status: 'error', message: 'Invalid token' });
    }

    // Prepare log entry with timestamp and formatted event
    const logEntry = `[${new Date().toISOString()}] Token: ${token}\n${JSON.stringify(event, null, 2)}\n\n`;

    // Append to log file asynchronously
    await fs.promises.appendFile(LOG_FILE, logEntry);

    // Console output for quick debugging
    console.log(`[Webhook] Event from token ${token}:`, event?.event);

    // Respond with success JSON
    return res.status(200).json({ status: 'ok', received: true });
  } catch (err) {
    console.error('[Webhook] Unexpected error:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
