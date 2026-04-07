const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const RESPONSES_API_URL = 'https://api.openai.com/v1/responses';
const IMAGES_API_URL = 'https://api.openai.com/v1/images/generations';
const FLOORPLAN_MODEL = 'gpt-4o-mini';
const RENDER_MODEL = 'gpt-image-1-mini';
const FLOORPLAN_HTML_PATH = path.join(__dirname, 'floorplan-builder.html');

const FLOORPLAN_TYPE_IDS = [
  'wall-h', 'wall-v', 'ext-wall-h', 'ext-wall-v', 'door', 'window', 'sliding', 'stairs',
  'sofa', 'armchair', 'coffee-tbl', 'tv-unit', 'bookshelf', 'fireplace',
  'queen-bed', 'king-bed', 'twin-bed', 'dresser', 'nightstand', 'wardrobe', 'desk',
  'counter', 'island', 'stove', 'fridge', 'd-table',
  'toilet', 'sink', 'shower', 'bathtub', 'dbl-sink',
  'room', 'closet', 'laundry', 'plant'
];

const FLOORPLAN_RESPONSE_FORMAT = {
  type: 'json_schema',
  name: 'floorplan_items',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            type: { type: 'string', enum: FLOORPLAN_TYPE_IDS },
            name: { type: 'string' },
            desc: { type: 'string' },
            x: { type: 'integer', minimum: 0, maximum: 300 },
            y: { type: 'integer', minimum: 0, maximum: 300 },
            w: { type: 'integer', minimum: 1, maximum: 300 },
            h: { type: 'integer', minimum: 1, maximum: 300 },
            color: { type: 'string' },
            z: { type: 'integer', minimum: 1, maximum: 10 }
          },
          required: ['type', 'name', 'desc', 'x', 'y', 'w', 'h', 'color', 'z']
        }
      }
    },
    required: ['items']
  }
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error('Request body too large.'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function readJson(req) {
  const body = await readBody(req);
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch (_err) {
    throw new Error('Invalid JSON body.');
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function sendHtml(res) {
  fs.readFile(FLOORPLAN_HTML_PATH, (err, html) => {
    if (err) {
      sendJson(res, 500, { error: 'Unable to load floorplan-builder.html.' });
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  });
}

function requireApiKey(res) {
  if (OPENAI_API_KEY) return true;
  sendJson(res, 503, {
    error: 'OPENAI_API_KEY is not configured on the Codespaces server.'
  });
  return false;
}

function extractResponseText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const parts = [];
  for (const output of data.output || []) {
    for (const content of output.content || []) {
      if (content.type === 'output_text' && content.text) {
        parts.push(content.text);
      }
    }
  }
  return parts.join('').trim();
}

function floorplanSystemPrompt(gridWidth, gridHeight) {
  return `You are an expert floor plan generator. The user describes a space and you output a JSON array of items to place on a grid-based floor plan.

CATALOG of valid type IDs: ${FLOORPLAN_TYPE_IDS.join(', ')}

Each item: { "type": "<id>", "name": "<label>", "desc": "<short description>", "x": <grid units>, "y": <grid units>, "w": <width in ft>, "h": <depth in ft>, "color": "<hex color>", "z": <z-index 1-10> }

COLORS by type:
- walls/ext-walls: #5a5650 or #3a3830
- doors/windows: #7a6a50 or #4a6a7a
- bedroom furniture: #4a4858
- living furniture: #4a5060
- kitchen: #3a5048
- bathroom: #3a4848
- room outlines: #2a2826

Rules:
- Grid units = feet. Canvas is ~${gridWidth} ft wide x ${gridHeight} ft tall (origin top-left).
- Place ext-walls FIRST around the perimeter. Use z:1 for walls, z:2 for furniture.
- Rooms inside: use room-type items for room labels if needed, or just fill with furniture.
- Leave realistic spacing: 3-4 ft clearance around beds, 2 ft around toilets.
- Do not overlap item footprints. Every item must occupy its own clear position on the grid.
- Snap all x/y to multiples of 1.
- Return ONLY the JSON array, no extra text, no markdown.`;
}

async function handleGenerateFloorplan(req, res) {
  if (!requireApiKey(res)) return;

  const { prompt, gridWidth = 60, gridHeight = 40 } = await readJson(req);
  if (!prompt || !String(prompt).trim()) {
    sendJson(res, 400, { error: 'A floorplan prompt is required.' });
    return;
  }

  const openaiRes = await fetch(RESPONSES_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: FLOORPLAN_MODEL,
      max_output_tokens: 1400,
      input: [
        { role: 'system', content: floorplanSystemPrompt(gridWidth, gridHeight) },
        { role: 'user', content: `Generate a floor plan for: ${String(prompt).trim()}` }
      ],
      text: { format: FLOORPLAN_RESPONSE_FORMAT }
    })
  });

  const openaiData = await openaiRes.json();
  if (!openaiRes.ok) {
    sendJson(res, openaiRes.status, {
      error: openaiData.error?.message || `OpenAI request failed with status ${openaiRes.status}.`
    });
    return;
  }

  const text = extractResponseText(openaiData);
  if (!text) {
    sendJson(res, 502, { error: 'OpenAI returned an empty floorplan response.' });
    return;
  }

  let payload;
  try {
    payload = JSON.parse(text);
  } catch (_err) {
    sendJson(res, 502, { error: 'OpenAI returned invalid JSON for the floorplan.' });
    return;
  }

  if (!Array.isArray(payload?.items)) {
    sendJson(res, 502, { error: 'OpenAI returned an invalid floorplan payload.' });
    return;
  }

  sendJson(res, 200, { items: payload.items });
}

async function handleRenderView(req, res) {
  if (!requireApiKey(res)) return;

  const { prompt, viewId } = await readJson(req);
  if (!prompt || !String(prompt).trim()) {
    sendJson(res, 400, { error: 'A render prompt is required.' });
    return;
  }

  const openaiRes = await fetch(IMAGES_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: RENDER_MODEL,
      prompt: String(prompt).trim(),
      size: '1536x1024',
      quality: 'medium',
      background: 'opaque',
      output_format: 'png'
    })
  });

  const openaiData = await openaiRes.json();
  if (!openaiRes.ok) {
    sendJson(res, openaiRes.status, {
      error: openaiData.error?.message || `OpenAI image request failed with status ${openaiRes.status}.`,
      viewId
    });
    return;
  }

  const imageBase64 = openaiData?.data?.[0]?.b64_json;
  if (!imageBase64) {
    sendJson(res, 502, { error: 'OpenAI did not return an image for this view.', viewId });
    return;
  }

  sendJson(res, 200, { imageBase64, viewId });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/floorplan-builder.html')) {
      sendHtml(res);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/config') {
      sendJson(res, 200, { configured: !!OPENAI_API_KEY });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/generate-floorplan') {
      await handleGenerateFloorplan(req, res);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/render-view') {
      await handleRenderView(req, res);
      return;
    }

    sendJson(res, 404, { error: 'Not found.' });
  } catch (err) {
    sendJson(res, 500, { error: err.message || 'Unexpected server error.' });
  }
});

server.listen(PORT, () => {
  console.log(`FloorCraft server listening on http://localhost:${PORT}`);
});
