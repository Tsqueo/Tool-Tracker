# Tool Tracker V3.4.1

V3.4.1 is a refinement/pilot build based directly on V3.4. It keeps the established dashboard and flow while applying the usability and multi-user changes found during real-world testing.

## Highlights

- Personal inventory is Admin-only, has its own `P-<brand>-##` numbering sequence, and does not affect company counts, Jobs, Map, or crew views.
- Purchase records now include receipt attachment, purchase price, retailer, purchase date, warranty, and editable receipt-reading suggestions for image receipts.
- Crew sign-ins can be created from Admin > Team access using Firebase Authentication. Each user gets their own name/role and activity attribution.
- Company tool verification is actionable: verify location/status, add a current condition photo, and clear overdue warnings.
- Tool Detail supports permission-aware quick edits; crew can update operational information while Admin controls business-sensitive fields.
- Map is now an interactive OpenStreetMap/Leaflet view using active job addresses as pins. Address geocoding requires internet access.
- Android/browser back navigation now uses page history states instead of immediately exiting from deeper app views.
- Dashboard Recent Activity is capped at 3 items on mobile and 5 on desktop; full history remains available through View All.
- Company Branding labels are clearer and explicitly separate from the fixed TT app identity.
- PWA icons were rebuilt from the proper TT logo for Android and Apple home-screen use.
- Mascot hero uses a wide composite so the hard hat and beam stay visible without large dead side gutters.

## Firebase update required

V3.4.1 adds stronger role/private-data rules and new Storage paths for receipts/personal files. After uploading the web files, deploy the included `firestore.rules` and `storage.rules` in Firebase before the crew pilot or Personal receipt uploads. The Firebase project/config itself does not need to change.

Email/Password Authentication must remain enabled. The in-app crew creator uses Firebase Authentication to create the pilot staff account and then stores the Staff profile in Firestore.

## Receipt reading

Image receipts use Tesseract.js in the browser to suggest retailer, date and total. Suggestions are never auto-saved: review/edit the fields before saving. PDF receipts are stored and linked to the tool, but automatic reading is currently image-only.

## App icon refresh

Android/iOS may cache the previous installed icon. After V3.4.1 is deployed, remove the old home-screen/PWA install once and reinstall it to force the new TT icon.
