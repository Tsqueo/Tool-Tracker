# Tool Tracker V4.1 — Purpose Built

Daily-use stabilization release built directly from the deployed V4.0 source.

## Included
- Compact Add/Edit Tool workflow with side-by-side fields and collapsed advanced sections
- Local camera/nameplate OCR suggestions for brand/model/serial/category
- Actual owned-tool photo promoted to primary; manufacturer image demoted to optional reference
- Separate Condition, Status and Location fields
- Physical Verification is the only normal workflow that writes Last Verified
- Verification Due Soon / Due Now / Overdue windows
- Admin-managed paired tools with optional paired move prompt
- Expanded construction category icon picker and Saw Stands default category
- Missing tools blocked from Quick Move; explicit Found recovery path
- Corrected footer order/icons
- Desktop responsive refinement while preserving the mobile layout
- Canonical dashboard mascot image cached instead of the old wide image
- Jobsite Morale Department visual polish
- Crew Firestore permissions tightened around verification/admin-only fields
- Next-ID suggestions respect historical previous labels

## Firebase
Deploy `firestore.rules` with this build. Existing Storage rules remain compatible.
