#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PORT_TO_PUBLISH="${PORT:-3002}"
LOG_FILE="/tmp/floorcraft-server.log"

set_port_public() {
  if ! command -v gh >/dev/null 2>&1; then
    echo "[$(date)] gh CLI not found; skipping public port update" >> "$LOG_FILE"
    return
  fi

  local args=("${PORT_TO_PUBLISH}:public")
  if [[ -n "${CODESPACE_NAME:-}" ]]; then
    args+=("-c" "${CODESPACE_NAME}")
  fi

  if gh codespace ports visibility "${args[@]}" >> "$LOG_FILE" 2>&1; then
    echo "[$(date)] set port ${PORT_TO_PUBLISH} visibility to public" >> "$LOG_FILE"
  else
    echo "[$(date)] failed to set port ${PORT_TO_PUBLISH} visibility to public" >> "$LOG_FILE"
  fi
}

if pgrep -f "node server.js" >/dev/null 2>&1; then
  set_port_public
  exit 0
fi

echo "[$(date)] starting FloorCraft on port ${PORT_TO_PUBLISH}" >> "$LOG_FILE"
nohup npm start >> "$LOG_FILE" 2>&1 &

# Give the server and forwarded port a moment to come up before flipping visibility.
(
  sleep 8
  set_port_public
) >/dev/null 2>&1 &
