# Dot Canvas Notes

Dot Canvas Notes is a browser-based note canvas for jotting down ideas and asking AI providers for answers. Create and arrange notes on a dotted workspace, switch between light and dark themes, and use Ollama locally or connect a supported hosted AI provider.

## Features

- Freeform, editable notes on a dotted canvas
- AI answers from Ollama, Gemini, OpenAI, xAI (Grok), and Groq
- Automatic provider selection from configured providers
- Light and dark themes
- Notes and preferences saved in the browser

## Getting started

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build, run `npm run build`; the generated files are placed in `dist/`.

## AI provider setup

Choose a provider from the app menu and open AI settings to add its API key. Ollama can be used locally without a hosted provider key; run Ollama separately and make sure its API is reachable at `http://localhost:11434`.

API keys entered in AI settings are saved in your browser's local storage. They are not included in this repository, but browser local storage is not a secure secrets vault. Use keys with appropriate limits and remove them from AI settings or clear the site's local storage when finished. Never commit personal API keys or `.env` files.

## Tech stack

React, Vite, Tailwind CSS, and lucide-react.
