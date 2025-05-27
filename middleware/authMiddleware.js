const { verifyFakeToken } = require('../services/tokenService');

function authMiddleware(requiredScopes = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyFakeToken(token);
      const hasScopes = requiredScopes.every(scope => decoded.scopes.includes(scope));
      if (!hasScopes) {
        return res.status(403).json({ error: 'Forbidden: insufficient scope' });
      }
      req.client = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }
  };
}

module.exports = authMiddleware;
