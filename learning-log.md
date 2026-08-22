# Learning Log

Record meaningful learning sessions in reverse chronological order. Each entry
should describe what the user demonstrated or practiced, not just what the AI
explained.

## Entry template

<!--
## YYYY-MM-DD — Topic

### Practiced or demonstrated

- Concrete concepts or tasks

### Evidence

- What the user implemented, explained, or debugged

### Still unclear

- Remaining questions

### Next exercise

- One small, practical follow-up
-->

## 2026-08-22 — Backend connection checkpoint

### Project status

- The extension displays an **Ask AI** trigger beside selected text.
- The context window supports summary and question actions.
- Both actions send JSON requests to the local Node.js backend.
- Loading, validation, success, and network-error messages appear in the window.
- The user tested and confirmed that the browser-to-backend connection works.

### Resume here

The backend currently returns placeholder answers. The next milestone is to
connect the backend to an LLM provider without exposing the API key inside the
Chrome extension.

Before implementing that milestone:

1. Review the `fetch()` request in `content.js`.
2. Review request parsing and validation in `backend/server.js`.
3. Choose the LLM provider and model.
4. Store its API key in a backend-only environment variable.

### Still to learn

- How `async`, `await`, promises, and network failures work.
- Why API secrets must remain on the backend.
- How the backend will call an external LLM API.

## 2026-08-17 — Reading selected webpage text

### Practiced or demonstrated

- Distinguished a browser `Selection` object from its string representation.
- Retrieved selected text with `window.getSelection().toString()`.
- Used `.trim()` and an empty-string check to reject unusable selections.
- Explained why selection processing belongs inside a `mouseup` event callback.
- Used `if`/`else` to handle empty and non-empty selections.

### Evidence

- Wrote and corrected a working `mouseup` event listener in the browser console.
- Correctly explained when the event fires and why the empty-string check is needed.

### Still unclear

- The general syntax and mechanics of `document.addEventListener` and arrow functions
  need more practice.
- Positioning a floating interface beside a selection has not been explored yet.

### Next exercise

- Create a temporary element on the webpage when useful text is selected.
