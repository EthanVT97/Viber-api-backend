const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function generateSessionId() {
  return Math.random().toString(36).substring(2, 12);
}

function generateFakeToken(clientId, scopes = [], allowedPlatforms = []) {
  const payload = {
    clientId,
    scopes,
    allowedPlatforms,
    sessionId: generateSessionId(),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  return jwt.sign(payload, JWT_SECRET);
}

function verifyFakeToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateFakeToken, verifyFakeToken };
