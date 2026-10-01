# Tool Tracker V4.4.1 — Seasonal Tracking Update

V4.4.1 builds on the substantial V4.4 workflow and visual release from the corrected V4.3.6.1 baseline.

## Inventory integrity

- Company and Personal add-tool drafts are isolated.
- Discard Entry clears the active draft instead of restoring it later.
- Company and Personal label sequences remain separate.
- Duplicate checking covers exact serial numbers across both pools and excludes retired assets from normal matching warnings.
- Add Matching Unit now begins from an existing asset and copies classification data while requiring a new physical-unit photo.
- Admin can permanently remove a mistaken record after typing its Tool ID and recording a required reason; the audit event remains in history.
- Retiring remains the correct path for assets that once genuinely existed.

## Daily operations

- Needs Attention and Missing Tools are dedicated queues with purpose-specific actions and empty states.
- The redundant small Needs Attention shortcut is removed; the large dashboard counter remains the single entry point.
- Dashboard shortcuts are grouped under slim Field Work, Setup, and Records & Management labels to improve scanning without adding large panels.
- Crew & Assignments provides an assigned-tool queue and a home for handoffs and crew requests.
- Tool Details includes crew assignment controls.
- Existing Wishlist requests retain Admin review statuses.
- Insurance readiness can now be completed in place: enter a serial number or mark it N/A, update replacement cost, add a current photo, and save without losing the filtered-list position.

## V4.4 visual system

- Day One Projects white, cool grey, charcoal and blue palette.
- Black and layered-charcoal night mode with Day One blue highlights.
- Black TT loading screen retained.
- Approved Day One Projects logo added to company-branded surfaces.
- Footer icons use a consistent line system with blue active state.
- Halloween progresses automatically from subtle (Oct 1–14), to building (Oct 15–25), to full effects (Oct 26–Nov 1), then returns to normal Nov 2.
- Christmas progresses automatically from Dec 1 through Jan 6.
- A compact seasonal-effects control appears only while an event is active. Its visual-effects preference persists on the device; no event uses sound.
- Seasonal animation respects reduced-motion settings.

## Morale Department

- The page order is Worn-Out Heroes, Department Bulletin, Useless Knowledge, Incident Report, HR-Unapproved Joke, Foreman's Puzzle, and Measure Twice, Guess Once, followed by the existing get-back-to-work ending.
- The joke card rotates through the offside collection without leaving the Morale Department.
- The worn-out heroes image is the games header.
- `Measure Twice, Guess Once` opens as its own page with Apprentice, Journeyman and Foreman estimates.
- Each estimate provides a dimensioned drawing, A–D choices, an optional hint, one locked guess and a worked breakdown.
- Weekly state resets with the existing Monday 4:30 AM America/Vancouver morale week, and puzzle completion is tied to the specific puzzle/version so changed content never inherits an old completion.
- Seasonal props are decorative only and are explicitly excluded from takeoffs.

## Deployment

Upload the contents of the V4.4.1 folder (not the enclosing folder) to the GitHub Pages repository. The cache-bumped revision uses service-worker cache `tool-tracker-v4.4.1-r2`, `styles.css?v=4.4.1-r2`, and `app.js?v=4.4.1-r2` so it replaces the earlier V4.4.1 draft without changing the visible release number or PWA link.
