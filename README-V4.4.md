# Tool Tracker V4.4 — Day One Field Update

V4.4 is the substantial workflow and visual release built from the corrected V4.3.6.1 baseline.

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
- Crew & Assignments provides an assigned-tool queue and a home for handoffs and crew requests.
- Tool Details includes crew assignment controls.
- Existing Wishlist requests retain Admin review statuses.

## V4.4 visual system

- Day One Projects white, cool grey, charcoal and blue palette.
- Black and layered-charcoal night mode with Day One blue highlights.
- Black TT loading screen retained.
- Approved Day One Projects logo added to company-branded surfaces.
- Footer icons use a consistent line system with blue active state.
- Halloween and Christmas decoration hooks activate automatically using America/Vancouver dates and respect reduced-motion settings.

## Morale Department

- Safety bulletins, facts and rotating puzzle formats appear before the games.
- The worn-out heroes image is the games header.
- `Measure Twice, Guess Once` opens as its own page with Apprentice, Journeyman and Foreman estimates.
- Each estimate provides a dimensioned drawing, A–D choices, an optional hint, one locked guess and a worked breakdown.
- Weekly state resets with the existing Monday 4:30 AM America/Vancouver morale week.
- Seasonal props are decorative only and are explicitly excluded from takeoffs.

## Deployment

Upload the contents of the V4.4 folder (not the enclosing folder) to the GitHub Pages repository. The service-worker cache is `tool-tracker-v4.4.0` and the app script is loaded as `app.js?v=4.4.0`.
