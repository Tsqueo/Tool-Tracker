# Tool Tracker V4.2 — Purpose Built.

V4.2 is a refinement release built directly on V4.1. Existing Firebase data is preserved; there is no migration or re-entry step.

## V4.2 changes

- Mobile Add Tool / Personal Tool form simplified to a single-column intake flow.
- Nameplate scan retained as an optional quick-start tool.
- Manufacturer Reference image workflow removed from the UI; the actual owned-tool photo is the inventory photo.
- Pairing removed from new-tool intake and kept only as an Admin option when editing an existing company tool.
- Category and Location cards now open Inventory filtered to that category/location.
- Legacy category names get sensible construction icons automatically in the UI.
- Inventory and Jobs navigation icons cleaned up.
- Desktop header now uses Home, Inventory, Jobs, Map and Reports navigation, while mobile keeps the bottom navigation.
- Purpose Built. lives with the Tool Tracker header identity.
- Manage Tool IDs naming replaces Renumber Tools.
- Tool History adds search, activity filters and date grouping while keeping the existing readable audit trail.
- Move history emphasizes actual location changes.
- Job Closeout now supports physical-accounting checkboxes and bulk movement, with formal photo verification still separate.
- Crew can use Job Closeout; only Admin can complete/archive the job.
- Wishlist is capped at three active requests per crew member in the app, requires a reason, and blocks similar active duplicates. Admin can resolve requests.
- Firestore wishlist permissions tightened so crew cannot edit another employee's request or change status.
- Reports hub added for Inventory, Insurance, Repair & Damage, Location/Job Inventory, Verification and Tool History CSV exports.
- Verification and operational Needs Attention are shown as separate tool-level signals.
- Jobsite Morale puzzle/fact progress persists for the current Pacific weekly key.
- PWA icons rebuilt without the old outer navy square and manifest no longer marks the same asset as maskable.

## Deploy

Upload the contents of the `tool-tracker-v4.2` folder to the GitHub Pages repository root, replacing the previous app files. Publish the included `firestore.rules` because wishlist permissions changed. Storage rules are unchanged from V4.1.

The service worker cache is `tool-tracker-v4.2`, so installed devices should move off the V4.1 shell after refresh/relaunch.
