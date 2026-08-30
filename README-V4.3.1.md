# Tool Tracker V4.3.1 — Purpose Built.

Shakedown refinement release built on V4.3. Existing Firebase data remains compatible.

Highlights: optional Corded/Cordless power metadata and filter; real Cordless Batteries & Chargers category for new category seeds; automatic location-aware status on moves; live Job Closeout refresh; immutable verification photo history by Firestore asset document ID; actionable Insurance cleanup metrics; Wishlist copy cleanup; persistent batched Tool ID edits; filtered full CSV report export; mobile Purpose Built branding; refined footer icons.

## Deployment
Publish `firestore.rules` before/with the UI because V4.3.1 adds the append-only `verificationPhotos` collection. Storage rules are unchanged.
