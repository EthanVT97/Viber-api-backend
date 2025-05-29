// middleware/authMiddleware.js
const { verifyFakeToken } = require('../services/tokenService');

/**
 * Express middleware to authenticate and authorize requests
 * based on a Bearer token and required scopes.
 * 
 * @param {string[]} requiredScopes - Array of scopes required for this route
 * @returns middleware function
 */
function authMiddleware(requiredScopes = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check for Authorization header presence and correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token and decode payload
      const decoded = verifyFakeToken(token);

      // Check if decoded token has all required scopes
      const hasScopes = requiredScopes.every(scope => decoded.scopes?.includes(scope));

      if (!hasScopes) {
        return res.status(403).json({ error: 'Forbidden: Insufficient scope' });
      }

      // Attach useful client info to request for downstream handlers
      req.client = {
        clientId: decoded.clientId,
        sessionId: decoded.sessionId,
        allowedPlatforms: decoded.allowedPlatforms || [],
        scopes: decoded.scopes || [],
      };

      next();
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ error: `Unauthorized: ${err.message}` });
    }
  };
}

module.exports = authMiddleware;
