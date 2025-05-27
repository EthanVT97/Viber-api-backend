const axios = require('axios');

async function updateViberBotInfo(token, data) {
  try {
    const response = await axios.post('https://chatapi.viber.com/pa/set_webhook', {
      auth_token: token,
      ...data,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.status !== 0) {
      throw new Error(`Viber API error: ${response.data.status_message}`);
    }

    return response.data;
  } catch (error) {
    console.error('Viber API Request Failed:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  updateViberBotInfo,
};
