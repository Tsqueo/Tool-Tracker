# Tool Tracker V4.3.3 — Data Entry Cleanup

Focused refinement built directly from V4.3.2. The proven Save/Verify upload pipeline is intentionally preserved.

Changes:
- Progress indicators are hidden/reset until an actual Save or Verify begins.
- Nameplate camera guidance now targets the information label and prioritizes Model + Brand, with conservative Serial extraction and TYPE/noise filtering.
- Model, Serial and Tool ID normalize to uppercase; known/configured brands normalize to readable brand casing.
- Tool ID suggestions only use Admin-configured brand prefixes; unknown brands no longer invent two-letter prefixes.
- When editing an existing tool, the next-ID suggestion stays hidden until the user actually begins changing the Tool ID.
- Existing receipt reader behavior is unchanged; multi-item receipt intelligence is intentionally deferred.

No Firebase data migration is required. Existing asset IDs, history, photos, permissions and inventory data are preserved.
