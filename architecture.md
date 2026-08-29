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

The first version deliberately uses plain JavaScript and CSS. A Node.js HTTP
backend provides the API boundary and calls Gemini's GenerateContent API. React
and TypeScript remain possible later additions rather than current dependencies.
The extension now has a small npm build step for its liquid-glass visual layer.

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
  streaming GenerateContent API, and forwards provider-neutral NDJSON events.
- Implemented: the local backend listens on port 3000 and permits development
  requests from the extension through CORS response headers.
- Implemented: the backend loads `GEMINI_API_KEY` and optional `GEMINI_MODEL`
  from a repository-root `.env` file. The default model is
  `gemini-3.5-flash`.
- Implemented: missing configuration, invalid input, provider failures, empty
  provider answers, and unexpected server failures return distinct safe errors.
- Implemented: each request accepts up to 100,000 selected-text characters and
  10,000 question characters. Gemini may generate up to 4,096 output tokens per
  answer; the overall JSON request body is capped at 500,000 characters.
- Implemented: the main popup keeps successful user/model turns in an in-memory
  `conversationHistory` array and sends that history with each new request. The
  backend validates at most 40 history messages, converts them to Gemini content
  entries, and places the newest question after the earlier turns.
- Current limitation: conversation history exists only while the popup remains
  open. It is not persisted to a database or shared with `+` follow-up surfaces.
- Implemented: selected text is optional starting context for questions rather
  than an information boundary. The study assistant may answer loosely related
  or unrelated questions with general model knowledge while still using the
  selection when relevant.
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
- Refined after visual testing: UI1 uses a 38% near-black surface, 22% frost,
  24px blur, and a restrained refraction scale of 42. Lower displacement alpha
  and lens strength prevent background text from appearing duplicated while
  retaining a visible liquid-glass rim.
- Refined: a 16px host backdrop blur sits beneath the library refraction layer
  so readable webpage text does not visually compete with the popup content.
- Implemented: the lookup window remains fixed relative to the viewport while
  the webpage scrolls and can be dragged by its header with mouse, pen, or touch.
  Dragging is clamped to the viewport so the window cannot be lost off-screen.
- Refined: UI2's primary material is approximately 30% darker and 30% more
  transparent, with backdrop brightness maintaining its near-black character.
- Implemented: UI3 (`transparent-utility`) reuses UI2's dark-utility typography,
  controls, borders, and layout but sets the outer trigger, popup, and follow-up
  surfaces to 0% opacity. The previous classic light-grey theme was removed.
- Installed: `simple-liquid-glass` supplies a framework-agnostic
  `<liquid-glass>` web component, and `esbuild` bundles that component locally
  into `vendor/liquid-glass.js`. The dependency is installed without React peer
  packages because this extension uses the vanilla web-component entry point.
- Confirmed: the library bundle is local rather than CDN-hosted so the extension
  does not depend on remotely executed JavaScript.
- Implemented: the manifest loads the local liquid-glass bundle before the
  content script, and the main popup is a namespaced
  `<context-explainer-liquid-glass>` web component. UI1 enables a rim lens with
  SVG displacement refraction; UI2 and UI3 reduce the library material to zero
  and continue using their existing CSS surfaces.
- Confirmed: UI1 has one visual pipeline. The liquid-glass web component owns
  optical rim refraction, while the UI1 CSS block owns only surface tint,
  backdrop softening, layout, typography, and controls. The previous CSS
  pseudo-element refraction simulation has been removed.
- Implemented: `npm run preview` starts a local UI playground on port 4173. It
  reuses the extension stylesheet and liquid-glass bundle, reloads when visual
  source files change, and exposes opacity, frost, and refraction controls for
  quick visual tuning outside the extension interaction flow.
- Implemented on the saved-insights feature branch: `npm run build:pages`
  creates an allowlisted static playground artifact in `dist-pages`. A GitHub
  Actions workflow deploys that artifact to GitHub Pages from `main`, while the
  README links visitors to the public visual demo. Backend code, environment
  files, and AI credentials are never included in the Pages artifact.
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
- Implemented: pending requests show a looping three-dot thinking indicator.
  The backend consumes Gemini's SSE `streamGenerateContent` response and exposes
  provider-neutral NDJSON `delta`, `done`, and `error` events to the extension.
  The first delta replaces the indicator and subsequent deltas progressively
  update the safely rendered answer.
- Confirmed: answers are concise by default (normally 2–4 short sentences or a
  compact list) and expand only when the user asks for more depth. The output
  token ceiling remains high enough to avoid cutting off requested detail.
- Implemented: AI responses render a safe Markdown subset using DOM nodes rather
  than raw HTML. Bold, italics, inline code, headings, links, and ordered or
  unordered lists display as interface formatting instead of literal markers.
- Implemented: Gemini 3.5 Flash uses low thinking effort for this short-form
  study flow, reducing latency relative to its default medium effort.
- Implemented: initial Gemini network failures and HTTP 429 or 503 responses are
  retried up to three times with 400ms then 800ms backoff. Retries stop before
  any response delta is forwarded, preventing duplicated partial answers.
- Implemented: while generating, the composer's arrow becomes a compact Stop
  control. Cancelling aborts the browser fetch, closes the backend stream, and
  aborts the upstream Gemini request without saving the partial turn to history.
- Implemented on the saved-insights feature branch: completed answers can be
  bookmarked, and selected excerpts within an answer expose a small **Save
  insight** control. Saved items keep their question, selected source context,
  webpage title, URL, and creation time.
- Implemented on the saved-insights feature branch: saved items live locally in
  `chrome.storage.local`, capped at 200 recent items. The backend and Gemini do
  not receive a save request.
- Implemented on the saved-insights feature branch: the header bookmark opens a
  draggable, theme-aware **Study Shelf** beside the conversation. Shelf cards
  can fill the composer for further study, copy their text, open the original
  webpage, or be deleted.
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
6. Answer deltas stream through the backend into the floating window; the
   completed answer is then stored in conversation history.

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
