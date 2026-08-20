# Project Architecture

## Product definition

This project will be a Chrome extension that helps users understand selected
text without leaving the webpage.

The intended experience is:

1. The user highlights text or a paragraph on a webpage.
2. A small floating window appears near the selection.
3. The user can read a summary of the selected text or ask a specific question
   about it.
4. The answer appears in the floating window.

The floating window should provide the useful parts of an AI sidebar while
remaining attached to the context the user selected.

## Current status

The first working prototype is a dependency-free Manifest V3 Chrome extension.
It uses a content script to detect selected text and inject a styled floating
element into the current webpage.

## Tentative technology direction

The supplied learning plan suggests a possible Chrome extension built with:

- TypeScript
- React
- Vite
- Chrome Extension Manifest V3
- a backend API
- an LLM API

The first version deliberately uses plain JavaScript and CSS. React, TypeScript,
a backend, and an LLM API remain possible later additions rather than current
dependencies.

## Possible components

Likely components include:

- **Content script:** detects selected text and places the floating window into
  the current webpage.
- **Floating extension UI:** displays summaries, accepts questions, and shows
  answers near the selected text.
- **Service worker:** handles extension events, communication, and privileged
  browser APIs.
- **Backend:** calls external services while keeping secrets out of browser code.

## Architecture decisions

Record confirmed decisions here as the project develops, including the reason
for each choice and meaningful alternatives considered.

- Confirmed: the primary interface is a contextual floating window, not a
  separate browser sidebar.
- Confirmed: users can request a summary or ask a question about selected text.
- Implemented: `manifest.json` loads `content.js` and `content.css` on webpages.
- Implemented: a `mouseup` listener reads and saves selected text, then places an
  **Ask AI** trigger beside the selection.
- Implemented: clicking the trigger opens a persistent placeholder window using
  the saved text. The window can be closed with its button or the Escape key.
- Implemented: the window previews the selected text and provides a Summarize
  button, a question form, validation, and a response area. The actions currently
  produce local placeholder responses; no AI or backend request is made yet.
- Implemented: events originating inside extension UI are ignored by the
  webpage-level selection listener so users can interact with the UI safely.
- Not yet decided: whether summarization starts automatically or requires an
  explicit click.
- Not yet decided: whether React is necessary for the first version.

## Data flow

Proposed initial flow:

1. The content script observes the user's text selection.
2. It opens a floating window near the selection.
3. The user chooses **Summarize** or enters a question.
4. The extension sends the selected text and requested action to a backend.
5. The backend calls the AI service without exposing secret API keys.
6. The answer returns to the floating window.

This flow is a design proposal until implemented and tested.
