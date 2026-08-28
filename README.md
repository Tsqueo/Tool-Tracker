# Tool Tracker V3.2

Production PWA revision for the Tool Tracker Firebase project.

## V3.2 highlights

- Hybrid industrial TT logo is now the PWA/home-screen icon and the app/header/dashboard logo.
- Dashboard includes the worker + cat steel-beam artwork and more compact navigation tiles.
- Employee names are display-normalized to start with capitals (for example `tony` -> `Tony`).
- Tool cards are clickable. Tap a card to open full tool details.
- Tool detail supports a larger photo preview by tapping either image.
- Full Edit Tool workflow remains available from both the card and details screen, including category changes.
- Exactly two image slots per tool: **Manufacturer / Primary** and **Our Tool**. Manufacturer/Primary is used on inventory cards when present; Our Tool is the fallback.
- Manufacturer/Primary can be entered as a URL or uploaded from a file. Our Tool can be captured/uploaded from the phone.
- Active Jobs automatically create/repair linked Jobsite locations, so a tool can be moved directly to an active job without separately creating the location.
- Existing Firebase data is preserved; this is a front-end/data-compatible upgrade.

## Deploy through GitHub Pages

Upload the contents of this folder over the existing repository files and commit. GitHub Pages will rebuild automatically from `main` / `(root)`.

After deployment, close and reopen the installed PWA/browser tab once so the V3.2 service worker replaces the older cache.

## Firebase

No new Firebase project is required. Existing Authentication, Cloud Firestore, and Storage remain in use. The included rules files are reference copies; if your currently published rules already require authenticated users and allow `tool-photos/{toolId}/{fileName}` image uploads up to 8 MB, they do not need to be republished for V3.2.
