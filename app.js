require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const authMiddleware = require('./middleware/authMiddleware');
const { updateBotInfo } = require('./controllers/botController');
const { issueFakeToken } = require('./controllers/authController');
const { handleWebhook } = require('./controllers/webhookController');
const logsRoute = require('./routes/logs');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // change in prod
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(bodyParser.json());

// Routes
app.post('/api/v1/token', issueFakeToken);
app.post('/api/v1/bot/update', authMiddleware(['update_bot_info']), updateBotInfo);
app.post('/api/v1/webhook/:token', handleWebhook);
app.use('/api/logs', logsRoute);

app.get('/health', (req, res) => res.send('OK'));

// Serve frontend static files if any
app.use(express.static(path.join(__dirname, 'public')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
