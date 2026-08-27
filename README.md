# Construction Tool Tracker PWA

A static, installable browser app for a small construction crew. It uses Firebase Authentication, Cloud Firestore, and Firebase Storage directly from the browser.

## Firebase services used

- Authentication: Email/Password for your four employee accounts
- Cloud Firestore: tools, locations, users, and immutable history entries
- Cloud Storage: tool photos under `tool-photos/{toolId}/...`

## One-time Firebase Console setup

1. Firebase Console → **Build / Authentication** → **Get started** → enable **Email/Password**.
2. Authentication → **Users** → create exactly the four employee accounts you want to use.
3. Firebase Console → **Build / Firestore Database** → create a Firestore database. Choose a region appropriate for you. Start in production mode.
4. Firestore → **Rules** → replace the rules with `firestore.rules` from this package → Publish.
5. Storage → **Rules** → replace the rules with `storage.rules` from this package → Publish.

Do not use `allow read, write: if true` for a live app.

## Easiest no-install launch: GitHub Pages

You do not need Node, npm, Firebase CLI, or a code editor.

1. Sign in to github.com and create a new repository, for example `tool-tracker`.
2. In the repository choose **Add file → Upload files**.
3. Upload these files from this package into the repository root:
   - index.html
   - styles.css
   - app.js
   - firebase-config.js
   - manifest.webmanifest
   - service-worker.js
   - icon.svg
4. Open repository **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main`, folder `/ (root)`, then Save.
7. GitHub will show the public HTTPS address. Open it on each employee's phone and sign in.
8. On Android/Chrome, use the app's Install prompt or browser menu → Add to Home screen.

Security rule files and this README do not need to be uploaded to the public site. They can stay private/local; only paste their contents into Firebase Console.

## First use

The first authenticated session automatically creates starter locations: Shop, In Transit, Repair, and Unassigned. Go to **Locations** to rename/add jobsites or trucks.

Add a tool from the Tools screen. The app suggests the next numeric label (`T-001`, `T-002`, etc.). Tool labels remain editable.

Use **Move / status** for normal field movement. Every move creates a history entry with employee name and Firebase server timestamp.

## Notes

- The Firebase web config in `firebase-config.js` is expected to be visible in browser code. Security depends on Authentication + Security Rules.
- Tool photos are restricted to authenticated users, image MIME types, and files smaller than 8 MB.
- Tool and location documents cannot be deleted by the provided rules. Mark a location inactive or a tool Retired instead; this protects audit history.
- This version is intentionally static and serverless, so there is no monthly web-server bill from the app itself. Firebase usage is billed according to your project plan and quotas.
- The service worker caches the app shell. Firebase data itself still requires a network connection in this starter version.

## File map

- `index.html` — UI
- `styles.css` — responsive/mobile styling
- `app.js` — authentication, realtime Firestore, history, tool/location workflows, photo uploads
- `firebase-config.js` — your Firebase project config
- `manifest.webmanifest` + `service-worker.js` + `icon.svg` — PWA/install support
- `firestore.rules` — Firestore access rules
- `storage.rules` — Storage access + image-size/type validation
