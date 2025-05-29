require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Middleware & Controllers
const authMiddleware = require('./middleware/authMiddleware');
const { updateBotInfo } = require('./controllers/botController');
const { issueFakeToken } = require('./controllers/authController');
const { handleWebhook } = require('./controllers/webhookController');

// Log API
const logsRoute = require('./routes/logs');

const app = express();
app.use(bodyParser.json());

// Routes
app.post('/api/v1/token', issueFakeToken);
app.post('/api/v1/bot/update', authMiddleware(['update_bot_info']), updateBotInfo);
app.post('/api/v1/webhook/:token', handleWebhook); // ✅ Webhook listener
app.use('/api', logsRoute);                         // ✅ Log viewer route
app.get('/health', (req, res) => res.send('OK'));

// Serve static frontend (if using)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
