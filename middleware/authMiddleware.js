const { verifyFakeToken } = require('../services/tokenService');

function authMiddleware(requiredScopes = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check Authorization Header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyFakeToken(token);

      // Scope validation
      const hasScopes = requiredScopes.every(scope => decoded.scopes.includes(scope));
      if (!hasScopes) {
        return res.status(403).json({ error: 'Forbidden: insufficient scope' });
      }

      // Construct client info and attach to request
      req.client = {
        clientId: decoded.clientId,
        sessionId: decoded.sessionId,
        allowedPlatforms: decoded.allowedPlatforms || [],
        scopes: decoded.scopes || [],
      };

      next();
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ error: 'Unauthorized: ' + err.message });
    }
  };
}

module.exports = authMiddleware;
