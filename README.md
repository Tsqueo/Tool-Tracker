# Tool Tracker V4.3.6 — Purpose Built.

V4.3.6 is the inventory-entry and cleanup release built directly from the tested V4.3.5 baseline. See `README-V4.3.6.md` for the complete scope.

## What changed

- Nameplate scanning now prioritizes Model and Brand, treats serial as confidence-only, ignores manufacturer noise such as TYPE 1, and avoids claiming success when nothing useful was extracted.
- Tool ID suggestions use only configured Admin brand prefixes; unknown brands no longer get invented fallback prefixes.
- Existing-tool ID suggestions stay hidden until the ID is actually being modified.
- Model, Serial, and Tool ID values are normalized to uppercase; known brands use proper manufacturer casing.
- Add/Edit/Verify progress indicators reset cleanly and remain hidden until an actual save/verify operation starts.
- Jobs and Inventory navigation icons received a small presentation refinement: a clearer side-profile tower crane and a more recognizable open construction Jobox.
- Receipt expansion and multi-item receipt creation remain parked for a later revision.

No Firestore or Storage rule changes are required for V4.3.5.
