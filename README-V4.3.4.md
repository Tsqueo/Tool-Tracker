# Tool Tracker V4.3.4 — Streamline & Refine

Built directly from the deployed V4.3.3 baseline.

## Changes
- Category-first Inventory browsing with representative asset photos and live counts.
- Search still returns individual assets; job/location filters remain scoped while drilling into a category.
- New asset + successful photo upload creates an Initial Verification; no-photo assets remain Needs Verification.
- Never-verified assets explicitly surface in the attention/verification filter.
- Local Add Tool draft recovery for text/select/date fields after PWA refresh; photos must be re-added.
- Move / status respects an explicit status at the same jobsite and no longer writes no-op location history.
- Quick Tool ID editor now forecasts the next label after the user starts editing.
- Manage Tool IDs renamed Manage Assets, with ownership-transfer entry points.
- Personal pairing uses the Personal pool; Company and Personal pairing cannot cross pools.
- Categories can be deleted only when zero assets are assigned.
- Dashboard tiles reordered operational-first, records/admin-last; staff gets operational tiles and four-tab footer.
- Nameplate scan narrowed to Brand + Model, adds Senco recognition, preprocesses large images, and avoids serial/tool-name guessing.
- Branded black startup screen using the existing TT logo.

## Protected behavior
- Existing Firebase configuration/rules unchanged.
- V4.3.3 save/upload pipeline retained.
- Company pairing behavior retained except pool-safety/generalized presentation.
- Jobs -> View Tools continues to use the shared Inventory view.
- Existing PWA icon assets unchanged.
