const { sendJson } = require('./_lib/floorcraft-backend');

module.exports = async function handler(_req, res) {
  sendJson(res, 200, {
    configured: !!(process.env.OPENAI_API_KEY || '')
  });
};
