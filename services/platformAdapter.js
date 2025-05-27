const axios = require('axios');

async function updateViberBotInfo(realToken, updateData) {
  const url = 'https://chatapi.viber.com/pa/set_account_info';
  const payload = {};

  if (updateData.name) payload.name = updateData.name;
  if (updateData.avatar) payload.avatar = updateData.avatar;

  // Make sure there is something to update
  if (Object.keys(payload).length === 0) {
    throw new Error('No valid fields to update');
  }

  const headers = {
    'X-Viber-Auth-Token': realToken,
    'Content-Type': 'application/json',
  };

  const response = await axios.post(url, payload, { headers });

  if (response.data.status !== 0) {
    throw new Error(`Viber API error: ${response.data.status_message || 'Unknown error'}`);
  }

  return response.data;
}

module.exports = {
  updateViberBotInfo,
};
