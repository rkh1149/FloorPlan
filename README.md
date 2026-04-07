# FloorCraft for GitHub Codespaces

This version is set up so users can open the Codespace URL and use the app without entering their own OpenAI API key in the browser.

## What the repo owner needs to do

1. Push this folder to a GitHub repository.
2. In GitHub, add a Codespaces secret named `OPENAI_API_KEY`.
3. Create a Codespace for the repo.
4. Wait for the Codespace to start. It will auto-run the local Node server on port `3000`.
5. Open the forwarded Codespaces preview URL. The app is served at `/` and also at `/floorplan-builder.html`.

## What other users do

1. Open the shared Codespaces app URL.
2. Use the floorplan app directly in the browser.

They do not need to run `python`, `npm`, or enter an API key.

## Important security note

The OpenAI key now lives on the server side through the Codespaces secret, which is much safer than storing it in browser `localStorage`.

However, anyone who can access your shared Codespaces app URL can use the app through your server and consume your OpenAI usage. Only share the URL with people you trust.

## Local app structure

- `floorplan-builder.html`: the UI
- `server.js`: serves the UI and proxies secure OpenAI requests
- `.devcontainer/devcontainer.json`: Codespaces setup
- `.devcontainer/post-start.sh`: auto-starts the server in Codespaces
