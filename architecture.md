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

The first version deliberately uses plain JavaScript and CSS. A dependency-free
Node.js HTTP backend provides the API boundary and calls Gemini's GenerateContent API.
React and TypeScript remain possible later additions rather than current
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
- Implemented: clicking the trigger opens a persistent floating window using
  the saved text. The window can be closed with its button or the Escape key.
- Implemented: the window previews the selected text and provides summary and
  question controls, validation, and a chat-style response area.
- Implemented: events originating inside extension UI are ignored by the
  webpage-level selection listener so users can interact with the UI safely.
- Implemented: `backend/server.js` exposes `POST /api/explain`, parses JSON,
  validates and limits summary and question requests, calls Gemini's
  GenerateContent API, and returns the generated answer as JSON.
- Implemented: the local backend listens on port 3000 and permits development
  requests from the extension through CORS response headers.
- Implemented: the backend loads `GEMINI_API_KEY` and optional `GEMINI_MODEL`
  from a repository-root `.env` file. The default model is
  `gemini-3.5-flash`.
- Implemented: missing configuration, invalid input, provider failures, empty
  provider answers, and unexpected server failures return distinct safe errors.
- Implemented: the floating UI sends summary and question requests to the local
  backend with `fetch`, then displays returned answers or request errors.
- Implemented: action buttons are disabled while a request is running to prevent
  accidental duplicate submissions.
- Confirmed: the interface uses a restrained macOS/iPadOS-inspired visual system
  with translucent materials, system typography, subtle depth, and short motion.
- Implemented: both the trigger and lookup card position themselves near the
  selection, prefer available space above it, fall back below it, and remain
  inside the viewport.
- Implemented: the visual layer supports light and dark system appearance and
  respects reduced-motion preferences.
- Confirmed: the default visual theme is now `dark-utility`, inspired by quiet
  macOS utility panels: near-black material, compact type, integrated internal
  regions, minimal borders, and restrained translucency.
- Confirmed: UI1 and UI2 are separate interface directions, not light and dark
  modes of one design. The lookup-header switch changes between them.
- Implemented: UI1 (`soft-glass`) uses spatial medium-grey translucent material,
  light typography, softly layered controls, and ambient depth.
- Implemented: UI2 (`dark-utility`) retains its near-black compact technical
  interface with integrated regions and restrained borders.
- Confirmed: UI1 and UI2 share identical window and internal layout geometry;
  switching themes changes material and visual language without resizing the UI.
- Refined: UI1 uses darker grey translucent glass rather than pale white-grey,
  while preserving stronger blur and spatial depth than UI2.
- Refined: UI1 now favors environmental visibility over material opacity. A
  brightness-adjusted backdrop keeps light text readable while the page remains
  recognizable through the glass.
- Implemented: UI1 simulates optical edge refraction with a non-uniform masked
  rim, brighter upper corners, faint inner highlights, and opposing edge shade.
  This is a lightweight CSS illusion rather than shader-based distortion.
- Refined: UI1 uses only a 2% near-black material tint, making its base surface
  98% transparent. Its darker appearance comes from a 30% backdrop-brightness
  filter, not from an opaque overlay.
- Implemented: the lookup window remains fixed relative to the viewport while
  the webpage scrolls and can be dragged by its header with mouse, pen, or touch.
  Dragging is clamped to the viewport so the window cannot be lost off-screen.
- Refined: UI2's primary material is approximately 30% darker and 30% more
  transparent, with backdrop brightness maintaining its near-black character.
- Implemented: UI3 (`classic-glass`) restores the original balanced grey-glass
  direction with medium-light graphite material, stronger blur, dark text, and
  conventional translucent controls. The header switch cycles through all three
  independent UI designs.
- Implemented: the main question composer begins as a single line, grows with
  multiline content to a 112px maximum, and then scrolls internally. Enter sends
  while Shift+Enter inserts a newline; the circular arrow reflects whether text
  is ready to send.
- Implemented: the text Summarize control is replaced by a compact Sparkles icon
  with a tooltip.
- Implemented: the `+` control creates draggable, theme-aware follow-up glass
  surfaces that reuse the existing question request. Multiple surfaces use
  controlled offsets, remain inside the viewport, and preserve the original
  response behind them.
- Implemented: selected source text is collapsed into a `Selected text · 1`
  annotation that can be expanded when the user wants to review the source.
- Implemented: summary requests, questions, answers, loading states, and errors
  accumulate as a chat-style conversation instead of replacing one status line.
- Not yet decided: whether summarization starts automatically or requires an
  explicit click.
- Not yet decided: whether React is necessary for the first version.

## Data flow

Implemented MVP flow:

1. The content script observes the user's text selection.
2. It opens a floating window near the selection.
3. The user chooses **Summarize** or enters a question.
4. The extension sends the selected text and requested action to a backend.
5. The backend calls the AI service without exposing secret API keys.
6. The answer returns to the floating window.

The local boundary and error paths are implemented. A successful live model
response still requires a valid backend API key and network access.

## Confirmed MVP AI architecture

The MVP will use one application-owned Gemini API credential on the backend.
Bring Your Own Key may be added later, but it is explicitly outside the MVP.

- Users will authenticate with this application; that identity is separate from
  a Google or Gemini account.
- The extension sends authenticated requests to our backend and never calls an
  AI provider with a long-lived secret directly.
- The backend reads the single application API key from `GEMINI_API_KEY` in its
  environment. `.env` files are excluded from Git and only `.env.example` is
  committed.
- The backend will record usage by application user so limits and billing can be
  added without changing the extension-to-backend contract.
- The application owns conversation state as a tree of nodes. Each node stores a
  parent node ID, question, answer, selected source, and optional provider
  response ID.
- A follow-up surface creates a child node, not a separate provider-side chat.
- For each AI request, the backend constructs the single linear ancestor path
  from the root to that node. This allows the UI to branch while each model call
  still receives an ordinary linear conversation.
- Provider response chaining may be used as an optimization, but the application
  database remains the source of truth so branching is not coupled to one
  provider's conversation model.

### Deferred BYOK direction

If Bring Your Own Key is introduced later, provider credentials must be
encrypted on the backend and associated with the application user. The raw key
must never be stored by or returned to the Chrome extension.
