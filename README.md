# Tool Tracker V4.3.2 — Purpose Built.

V4.3.2 is the foundation-cleanup release built directly from the deployed V4.3.1 baseline. It focuses on real-use performance, workflow completion, data integrity, and mobile/desktop polish.

## Included

- Save/Verify one-tap locking, visible upload/save stages, and client-side tool-photo resizing/compression.
- Partial-success nameplate scanning with raw detected text and no false “suggestions ready” state.
- Conditions: New, Good, Fair, Missing Parts, Needs Service, Damaged. The last three raise Needs Attention and require a fresh condition photo.
- Live Job Closeout rebuilding from current tool assignment state.
- Visible two-way paired-equipment controls and paired-move prompt.
- Admin-only individual and bulk Personal ↔ Company inventory transfers using the same permanent asset record.
- Transfer history, Tool ID continuity, and an Ownership Transfers history filter.
- Suggested Tool ID placement before manual Tool ID entry.
- Visual condition-history records alongside verification photos.
- Updated Jobs, Inventory, Photos & Documents, Reports, and Manage Tool IDs icon language.
- Long-category layout cleanup, mobile masthead cleanup, Morale puzzle completion lock, and restrained incident-status styling.
- A dedicated desktop dashboard density/framing pass while preserving the existing desktop header.

## Intentionally not included

Job Setup and the optional branded TT / Purpose Built launch animation remain shelved for V4.4.

## Firebase

Deploy the included `firestore.rules` and `storage.rules` with the web files. Existing Firestore asset documents remain in place; visible Tool IDs can change without replacing the permanent Firestore document ID.
