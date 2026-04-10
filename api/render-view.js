const {
  sendJson,
  readJson,
  requireApiKey,
  renderView
} = require('./_lib/floorcraft-backend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  const apiKey = requireApiKey(res);
  if (!apiKey) return;

  try {
    const payload = await readJson(req);
    const result = await renderView(payload, apiKey);
    sendJson(res, result.statusCode, result.payload);
  } catch (err) {
    sendJson(res, 500, { error: err.message || 'Unexpected server error.' });
  }
};
