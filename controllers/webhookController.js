// controllers/webhookController.js
exports.handleWebhook = (req, res) => {
  const token = req.params.token;
  const event = req.body;

  console.log(`📩 Webhook Received [${token}]:`, event);

  // TODO: Validate token, respond to event if needed
  res.status(200).json({ status: 'ok', received: true });
};
