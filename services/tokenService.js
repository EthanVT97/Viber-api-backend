// services/tokenService.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

/**
 * Generates a random session ID string
 * @returns {string} Random session ID
 */
function generateSessionId() {
  // Generate a 10-character random alphanumeric string
  return Math.random().toString(36).substring(2, 12);
}

/**
 * Creates a JWT token with given client info, scopes, and allowed platforms.
 * Token expires in 1 hour by default.
 * 
 * @param {string} clientId - Client identifier
 * @param {string[]} scopes - Array of scopes/permissions
 * @param {string[]} allowedPlatforms - Allowed platforms for client
 * @returns {string} Signed JWT token
 */
function generateFakeToken(clientId, scopes = [], allowedPlatforms = []) {
  const payload = {
    clientId,
    scopes,
    allowedPlatforms,
    sessionId: generateSessionId(),
  };

  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verifies and decodes a JWT token.
 * Throws error if invalid or expired.
 * 
 * @param {string} token - JWT token string
 * @returns {Object} Decoded token payload
 */
function verifyFakeToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateFakeToken, verifyFakeToken };
