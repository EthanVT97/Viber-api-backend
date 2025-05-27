const { generateFakeToken } = require('../services/tokenService');

function issueFakeToken(req, res) {
  const { clientId, scopes, allowedPlatforms } = req.body;

  if (!clientId) {
    return res.status(400).json({ error: 'clientId is required' });
  }

  const token = generateFakeToken(clientId, scopes || [], allowedPlatforms || []);
  res.json({ token });
}

module.exports = { issueFakeToken };
