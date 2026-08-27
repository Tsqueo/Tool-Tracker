# Tool Tracker V3

This is the Firebase-backed V3 construction tool tracker. It keeps the existing `tools`, `locations`, `history`, and `users` data, then adds `jobs`, `categories`, `wishlist`, `settings`, and sign-in history.

## V3 features
- Click-through dashboard tiles with built-in SVG icons (no external icon service)
- Tool inventory with compact mobile cards, actual photos and optional manufacturer/stock photo URLs
- Brand-aware suggested IDs (DW-01, B-01, etc.) with editable brand prefixes
- Jobsites with addresses and one-tap Google Maps links
- Jobs automatically become selectable tool locations
- Customizable/reorderable tool categories
- Shop, jobsites, trucks, storage, repair and other location types
- Timestamped tool movement/history and sign-in records
- Wishlist for crew suggestions
- Warranty expiry tracking
- Admin/staff UI roles; private tools are hidden from staff in the app
- Owner branding/logo upload
- Light/dark theme
- PWA install support

## Updating the existing GitHub Pages app
Upload/replace these files in the root of your existing `Tool-Tracker` repository:
`index.html`, `app.js`, `styles.css`, `service-worker.js`, `manifest.webmanifest`, `icon.svg`, and `firebase-config.js`.
Commit the changes. GitHub Pages will redeploy automatically.

No Firebase database reset is needed. Existing tools remain.

## Firebase collections
The app uses: `tools`, `locations`, `history`, `users`, `jobs`, `categories`, `wishlist`, `settings`, and `signins`.

## Important security note
The currently supplied rules require a signed-in Firebase Authentication account. V3 also enforces Admin/Staff and private-tool visibility in the UI. Because employee accounts are manually created by the owner, this is suitable for the initial 4-person deployment. A later hardening revision can enforce every role/private rule at the Firestore rules layer after all employee role documents are established.

## Manufacturer image lookup
V3's “Search model” button opens an image search using the brand/model/name. A browser-only app cannot safely and reliably scrape a manufacturer's image automatically. Paste an approved manufacturer image URL into the stock-photo field; the employee's real phone photo remains stored separately in Firebase Storage.

## Team accounts
Create new employee email/password accounts in Firebase Authentication. After an employee signs in once, their profile appears under Admin & Warranty → Team access, where an admin can set Staff or Admin.
