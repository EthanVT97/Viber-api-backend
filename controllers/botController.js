const platformAdapter = require('../services/platformAdapter');
const logger = require('../utils/logger');

async function updateBotInfo(req, res) {
  const { client } = req;
  const updateData = req.body;

  // Validate input
  if (!updateData.name && !updateData.avatar) {
    return res.status(400).json({ error: 'No update fields provided' });
  }

  // Check platform access
  if (!client.allowedPlatforms.includes('viber')) {
    return res.status(403).json({ error: 'No access to Viber platform' });
  }

  try {
    // Update Viber bot info via platformAdapter
    const result = await platformAdapter.updateViberBotInfo(
      process.env.REAL_VIBER_BOT_TOKEN,
      {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.avatar && { avatar: updateData.avatar }),
      }
    );

    // Log success
    console.log("Update Data From Client:", req.body);
    logger.info('Bot info updated', {
      clientId: client.clientId,
      sessionId: client.sessionId,
      updateData,
    });

    // Respond success
    res.json({ success: true, result });
  } catch (err) {
    // Log failure
    logger.error('Failed to update bot info', {
      clientId: client.clientId,
      sessionId: client.sessionId,
      error: err.message,
    });

    // Respond failure
    res.status(500).json({ error: 'Failed to update bot info' });
  }
}

module.exports = {
  updateBotInfo,
};
