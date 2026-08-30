# Tool Tracker V4.0 — Purpose Built.

Built from the V3.4.1 Firebase PWA with backward-compatible tool records.

## Before staff rollout
1. Back up/tag the current V3.4.1 GitHub release.
2. Publish `firestore.rules` and `storage.rules` from this package in Firebase Console.
3. Upload the V4 files to the GitHub Pages repository.
4. Hard refresh/reinstall the PWA on the Admin Android device and test verification photo upload.
5. Test Admin on laptop, then one Crew account on iPhone before wider rollout.

## V4 highlights
- Purpose Built branding and V3.2-derived visual language.
- Dashboard: Inventory, Active Jobs, Needs Attention, Missing Tools.
- Actual owned-tool photo is primary; manufacturer photo is secondary.
- Physical verification requires confirmation + fresh photo; routine moves no longer reset verification.
- Crew can report Needs Attention; Admin can resolve/defer.
- Admin master photo browser.
- Admin insurance readiness with current replacement cost and CSV export.
- Admin bulk Tool-ID renumbering with immutable history and collision validation.
- Expanded construction category icon vocabulary and Tool Storage/Scaffold categories.
- Jobsite Morale Department weekly cycle keyed to Monday 4:30 AM America/Vancouver.
- History rules are immutable.
- Firebase Storage rules include V3 compatibility and V4 `tool-files` paths.

## Important
V4 is designed to preserve existing Firestore tool documents. New fields are optional/defaulted so V3.4.1 records continue to render. Do not delete the V3.4.1 release until the pilot passes.
