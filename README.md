# AIDictionary

A contextual Chrome extension for exploring selected text without leaving the
webpage. It combines a compact study-focused AI conversation with a translucent,
macOS-inspired interface.

## Live UI demo

[Open the interactive UI playground](https://jonsensa.github.io/AIDictionary/)

The public playground lets you switch between the three visual directions,
adjust opacity, frost, and refraction, and preview interface interactions. It is
a visual demonstration only: AI requests remain in the local extension because
the Gemini API credential must never be exposed in a public webpage.

## Run locally

```text
npm run preview
```

Then open `http://localhost:4173/`.

## Project structure

- `content.js` — selected-text behavior and contextual interface
- `content.css` — extension themes and glass materials
- `backend/server.js` — local Gemini API boundary
- `preview/` — interactive UI playground
- `scripts/build-pages.js` — allowlisted GitHub Pages build

Environment files and API credentials are excluded from Git.
