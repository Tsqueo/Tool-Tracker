# Tool Tracker V4.3.6 — Inventory Entry & Cleanup

V4.3.6 is a focused inventory-entry release built from the tested V4.3.5 baseline.

## Included

- Clickable Uncategorized and legacy-category cards so affected assets can be opened and edited.
- Save & add matching unit workflow that carries shared details forward, assigns the next Tool ID, and clears unique identifiers.
- A new photo is required for every newly created physical asset.
- Matching-asset guidance lists existing Tool IDs without blocking legitimate multiples.
- Optional identifying mark field for paint marks, initials and stickers.
- Richer Admin Tool ID rows with photo, model, category, status, serial and identifying mark.
- Retired assets are excluded from the dashboard total, ordinary inventory browsing and category counts. They remain available through Status → Retired and their history is preserved.

## Data safety

- No existing asset is automatically merged, deleted or retired.
- Existing V4.3.5 data and history remain compatible.
- No Firebase console, Firestore rules or Storage rules changes are required.

## Deferred to V4.4

- Assign tools to crew members.
- Tool request system.
