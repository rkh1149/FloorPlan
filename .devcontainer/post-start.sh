#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if pgrep -f "node server.js" >/dev/null 2>&1; then
  exit 0
fi

echo "[$(date)] starting FloorCraft on port ${PORT:-3002}" >> /tmp/floorcraft-server.log
nohup npm start >> /tmp/floorcraft-server.log 2>&1 &
