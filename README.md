# FloorCraft Deployment Guide

FloorCraft can now be deployed in 2 ways:

1. Vercel
   Best for a stable public app URL with no GitHub sign-in for users.

2. GitHub Codespaces
   Good for internal demos and editing, but less stable for public sharing.

## Recommended: Vercel

This repo is now Vercel-ready.

### What you need to do in Vercel

1. Connect this GitHub repository to your Vercel account.
2. Create a new Vercel project from the repo.
3. Add an environment variable named `OPENAI_API_KEY`.
4. Deploy the project.

### What Vercel will serve

- `/` -> the main FloorCraft app
- `/floorplan-builder.html` -> the main FloorCraft app
- `/api/config` -> checks whether the OpenAI key is configured
- `/api/generate-floorplan` -> generates the floor plan layout
- `/api/render-view` -> renders the AI image view

### Files added for Vercel

- `vercel.json`: Vercel routing and function settings
- `api/config.js`: server-side config status route
- `api/generate-floorplan.js`: floor plan generation route
- `api/render-view.js`: rendered view route
- `api/_lib/floorcraft-backend.js`: shared OpenAI backend logic for Vercel

### What users do

1. Open your Vercel URL.
2. Use FloorCraft directly in the browser.

They do not need GitHub, Codespaces, or their own OpenAI key.

## Optional: GitHub Codespaces

The repo still supports Codespaces for local editing and demo use.

### What the repo owner needs to do

1. Push this folder to a GitHub repository.
2. In GitHub, add a Codespaces secret named `OPENAI_API_KEY`.
3. Create a Codespace for the repo.
4. Wait for the Codespace to start. It will auto-run the local Node server on port `3002`.
5. Open the forwarded Codespaces preview URL. The app is served at `/` and also at `/floorplan-builder.html`.

### Codespaces structure

- `floorplan-builder.html`: the UI
- `server.js`: local/Codespaces Node server
- `.devcontainer/devcontainer.json`: Codespaces setup
- `.devcontainer/post-start.sh`: auto-start script in Codespaces

## Security note

The OpenAI key should stay on the server side as an environment variable.

- In Vercel, store it as a Vercel environment variable.
- In Codespaces, store it as a Codespaces secret.

Do not put the OpenAI key directly in the HTML or client-side JavaScript.

Anyone who can access your deployed app can use the app through your server and consume your OpenAI usage, so only share the public URL with people you trust.
