const RESPONSES_API_URL = 'https://api.openai.com/v1/responses';
const IMAGES_API_URL = 'https://api.openai.com/v1/images/generations';
const IMAGES_EDITS_API_URL = 'https://api.openai.com/v1/images/edits';
const FLOORPLAN_MODEL = 'gpt-4o-mini';
const RENDER_MODEL = 'gpt-image-1-mini';

const FLOORPLAN_TYPE_IDS = [
  'wall-h', 'wall-v', 'ext-wall-h', 'ext-wall-v', 'door', 'window', 'sliding', 'stairs',
  'sofa', 'armchair', 'coffee-tbl', 'tv-unit', 'bookshelf', 'fireplace',
  'queen-bed', 'king-bed', 'twin-bed', 'dresser', 'nightstand', 'wardrobe', 'desk',
  'counter', 'island', 'stove', 'fridge', 'd-table',
  'toilet', 'sink', 'shower', 'bathtub', 'dbl-sink',
  'room', 'closet', 'laundry', 'plant',
  'loft', 'hallway', 'foyer', 'pantry', 'mudroom', 'office', 'garage', 'balcony', 'patio', 'utility-room',
  'sectional-sofa', 'loveseat', 'ottoman', 'accent-chair', 'console-table',
  'bunk-bed', 'bedroom-bench', 'vanity-table', 'crib',
  'bar-stools', 'kitchen-sink', 'dishwasher', 'microwave', 'washer', 'dryer',
  'linen-cabinet', 'towel-rack', 'outdoor-table', 'outdoor-chair', 'closet-island'
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
            roomGroup: { type: 'string' },
            z: { type: 'integer', minimum: 1, maximum: 10 }
          },
          required: ['type', 'name', 'desc', 'x', 'y', 'w', 'h', 'color', 'roomGroup', 'z']
        }
      }
    },
    required: ['items']
  }
};

function sendJson(res, statusCode, payload) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode).json(payload);
    return;
  }
  if (typeof res.writeHead === 'function') {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
    return;
  }
  throw new Error('Unsupported response object.');
}

async function readBody(req) {
  return await new Promise((resolve, reject) => {
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
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch (_err) {
      throw new Error('Invalid JSON body.');
    }
  }

  const body = await readBody(req);
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch (_err) {
    throw new Error('Invalid JSON body.');
  }
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

function dataUrlToBlob(dataUrl) {
  const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return new Blob([Buffer.from(match[2], 'base64')], { type: match[1] });
}

function floorplanSystemPrompt(gridWidth, gridHeight) {
  return `You are an expert floor plan generator. The user describes a space and you output a JSON object with an "items" array to place on a grid-based floor plan.

CATALOG of valid type IDs: ${FLOORPLAN_TYPE_IDS.join(', ')}

Each item: { "type": "<id>", "name": "<label>", "desc": "<short description>", "x": <grid units>, "y": <grid units>, "w": <width in ft>, "h": <depth in ft>, "color": "<hex color>", "roomGroup": "<shared room id or empty string>", "z": <z-index 1-10> }

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
- Always include roomGroup on every item.
- When a space is enclosed by generated walls and should move as one room, assign the same non-empty roomGroup string to every wall that defines that room and every artifact located inside that room.
- Use distinct roomGroup values for different enclosed rooms, for example "room-1", "room-2", "ensuite-1", or "closet-1".
- For items not belonging to a movable generated room group, use an empty string for roomGroup.
- Leave realistic spacing: 3-4 ft clearance around beds, 2 ft around toilets.
- Do not overlap item footprints. Every item must occupy its own clear position on the grid.
- Snap all x/y to multiples of 1.
- Return ONLY the JSON object matching the schema, with no extra text and no markdown.`;
}

function requireApiKey(res) {
  const apiKey = process.env.OPENAI_API_KEY || '';
  if (apiKey) return apiKey;
  sendJson(res, 503, {
    error: 'OPENAI_API_KEY is not configured on the deployment server.'
  });
  return '';
}

async function generateFloorplan(payload, apiKey) {
  const { prompt, gridWidth = 60, gridHeight = 40 } = payload;
  if (!prompt || !String(prompt).trim()) {
    return { statusCode: 400, payload: { error: 'A floorplan prompt is required.' } };
  }

  const openaiRes = await fetch(RESPONSES_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
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
    return {
      statusCode: openaiRes.status,
      payload: {
        error: openaiData.error?.message || `OpenAI request failed with status ${openaiRes.status}.`
      }
    };
  }

  const text = extractResponseText(openaiData);
  if (!text) {
    return { statusCode: 502, payload: { error: 'OpenAI returned an empty floorplan response.' } };
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (_err) {
    return { statusCode: 502, payload: { error: 'OpenAI returned invalid JSON for the floorplan.' } };
  }

  if (!Array.isArray(parsed?.items)) {
    return { statusCode: 502, payload: { error: 'OpenAI returned an invalid floorplan payload.' } };
  }

  return { statusCode: 200, payload: { items: parsed.items } };
}

async function renderView(payload, apiKey) {
  const { prompt, viewId, referenceImageDataUrl } = payload;
  if (!prompt || !String(prompt).trim()) {
    return { statusCode: 400, payload: { error: 'A render prompt is required.' } };
  }

  let openaiRes;
  if (referenceImageDataUrl) {
    const referenceBlob = dataUrlToBlob(referenceImageDataUrl);
    if (!referenceBlob) {
      return { statusCode: 400, payload: { error: 'The render reference image was invalid.', viewId } };
    }

    const form = new FormData();
    form.append('model', RENDER_MODEL);
    form.append('prompt', String(prompt).trim());
    form.append('size', '1536x1024');
    form.append('quality', 'medium');
    form.append('background', 'opaque');
    form.append('output_format', 'png');
    form.append('image[]', referenceBlob, 'floorplan-reference.png');

    openaiRes = await fetch(IMAGES_EDITS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: form
    });
  } else {
    openaiRes = await fetch(IMAGES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
  }

  const openaiData = await openaiRes.json();
  if (!openaiRes.ok) {
    return {
      statusCode: openaiRes.status,
      payload: {
        error: openaiData.error?.message || `OpenAI image request failed with status ${openaiRes.status}.`,
        viewId
      }
    };
  }

  const imageBase64 = openaiData?.data?.[0]?.b64_json;
  if (!imageBase64) {
    return { statusCode: 502, payload: { error: 'OpenAI did not return an image for this view.', viewId } };
  }

  return { statusCode: 200, payload: { imageBase64, viewId } };
}

module.exports = {
  sendJson,
  readJson,
  requireApiKey,
  generateFloorplan,
  renderView
};
