# Tool Tracker V3.4

V3.4 is a direct upgrade of the V3.2 Firebase/PWA build. It preserves the V3.2 visual language and data model while adding the agreed inventory, map, verification and closeout workflows.

## V3.4 changes

- Keeps the existing TT app logo consistently in the top-left header on every page, without an extra colored backing tile.
- Adds the selected Day One Projects Concept 2B logo to the upper-right of the dashboard. Admin branding uploads can replace the company logo later without changing the TT app logo.
- Enlarges the existing worker + cat mascot artwork and uses a contained crop so the worker's hard hat and the steel beam remain visible on desktop and mobile.
- Renames the primary tool list from **Tools** to **Inventory**.
- Main navigation is now **Home · Jobs · Map · Inventory**. Jobs uses a crane-style icon so it no longer resembles Home.
- Adds a manual **Map** view based on active jobsite addresses. No GPS trackers are assumed. Each jobsite card shows current tool count, attention count, Google Maps access and a link into that job's inventory.
- Adds **Quick Move** from the dashboard. Choose a tool, then update its location/status using the existing history-aware move workflow.
- Adds **Last Verified** to tool records. Quick Move automatically verifies the tool on that date.
- Adds **Needs Attention** logic for Repair/Lost tools, tools not verified in roughly six months, and tools whose condition-photo reminder is due.
- Adds configurable **Condition photo reminders**: Off, every 6 months (default), or annually. Uploading an actual-tool photo records the condition-photo date.
- Adds **possible duplicate warnings** while entering brand/model/name. Duplicate labels are still blocked; same-model tools are allowed after review.
- Adds an Admin **Job Closeout** workflow: select an active job, review tools still assigned there, move them out, and only then mark the job completed.
- Keeps existing V3.2 features: Firebase Authentication, Firestore sync, Storage photos, staff/admin UI roles, private admin tools, customizable locations/categories, tool history, wishlist, warranty watch, brand-aware next-ID suggestions, light/dark mode, and PWA installation.

## Deployment

Upload the contents of this folder over the existing repository files and commit. GitHub Pages can continue to serve the app from the repository root.

V3.4 uses a new service-worker cache key. After deployment, close/reopen the installed PWA or browser tab once so the old V3.2 cache is replaced.

## Firebase compatibility

No new Firebase project is required. Existing V3.2 Firestore documents remain compatible; V3.4 only adds optional fields such as `lastVerified`, `photoReminderMonths`, `conditionPhotoAt`, `closedAt`, and `companyLogoURL`.

The included Firestore and Storage rules remain the same reference rules used by V3.2. For a wider staff deployment, server-side role enforcement in Firestore rules is recommended before treating the UI-only Admin/Staff distinction as a security boundary.
