require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const authMiddleware = require('./middleware/authMiddleware');
const { updateBotInfo } = require('./controllers/botController');
const { issueFakeToken } = require('./controllers/authController');

const app = express();
app.use(bodyParser.json());

app.post('/api/v1/token', issueFakeToken);
app.post('/api/v1/bot/update', authMiddleware(['update_bot_info']), updateBotInfo);
app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));