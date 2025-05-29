// controllers/webhookController.js

const fs = require('fs');
const path = require('path');

// Load valid tokens from environment variable (comma-separated)
const VALID_TOKENS = (process.env.VALID_TOKENS || '')
  .split(',')
  .map(token => token.trim())
  .filter(Boolean);

const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'webhook.log');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Webhook handler for incoming Viber events
 * Validates token, logs event, and responds accordingly
 */
exports.handleWebhook = async (req, res) => {
  try {
    const token = req.params.token;
    const event = req.body;

    // Validate token
    if (!VALID_TOKENS.includes(token)) {
      console.warn(`[Webhook] Rejected: Invalid token "${token}"`);
      return res.status(403).json({ status: 'error', message: 'Invalid token' });
    }

    // Format log entry
    const logEntry = `[${new Date().toISOString()}] Token: ${token}\n${JSON.stringify(event, null, 2)}\n\n`;

    // Append log entry asynchronously
    await fs.promises.appendFile(LOG_FILE, logEntry);

    // Log event to console for debugging
    console.log(`[Webhook] Event received from token "${token}":`, event.event || event);

    // Respond with success status
    return res.status(200).json({ status: 'ok', received: true });
  } catch (error) {
    console.error('[Webhook] Error handling event:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
