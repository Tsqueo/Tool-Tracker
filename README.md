# Tool Tracker V5.0.1

For this update, read **READ-FIRST-V5.0.1.txt** first. Install over V5.0; no new Firebase rules. The following V5.0 notes remain background documentation.

TOOL TRACKER V5.0 — EXISTING APP UPGRADE

Built from your V4.4.2.5-COMPLETE-HALLOWEEN ZIP. This package has not been deployed to your live app or Firebase project.

INSTALL IN THIS ORDER
1. Keep a backup of your existing GitHub files and current Firebase rules.
2. Firebase Console > Firestore Database > Rules: replace the rules with the complete contents of firestore.rules from this package, then Publish.
3. Firebase Console > Storage > Rules: replace with the complete contents of storage.rules from this package, then Publish.
4. Extract this ZIP. Upload ALL files AND folders inside the extracted folder to the same GitHub repository directory where index.html currently lives. Preserve boss/, christmas-art/ and halloween-art/. Do not upload the ZIP itself or add an extra parent folder.
5. Keep your existing firebase-config.js if you have changed its configuration since supplying the source ZIP. No credentials or project changes are required.
6. Commit the upload and let your existing GitHub Pages deployment finish. Close and reopen the installed app. Refresh once if it still shows V4.4.2.5.

IMPORTANT: GitHub uploading .rules files does not publish Firebase rules. Steps 2 and 3 must be done separately. The new request and Boss progress collections will be denied until these rules are published.

FIRST LIVE CHECK
Sign in as admin and one crew account. Create a two-item request, make just one item Ready for pickup, and have the requester confirm receiving it. Check the first tool’s assignment/location and the remaining outstanding item. Confirm Personal inventory remains hidden from staff. Start a Boss attempt, pause/leave, then return and confirm the saved time. These live permission checks have not been run against your Firebase project.

WHAT IS INCLUDED
- Bulk tool requests, job, needed-by date/time, routine/work-blocking priority, notes and optional photo.
- Private requester/admin conversation per request and blue unread-conversation bell.
- Per-item approval, staging, decline, receipt and outstanding items. Ready tools are reserved against another request; approval does not move custody. Receipt confirmation updates custody and writes history in one transaction.
- Existing wishlist remains for purchase suggestions. No general chat.
- My Tools with return/move and damage reporting through the existing tool workflows.
- Boss’s Puzzle integrated in Morale: weekly typed construction gate, opening-door animation, five-minute clock, two weekly attempts, no practice reset, saved paused attempt and clear pass/fail debrief.
- Eight authored Boss scenarios with different dependencies, resource needs and crew restrictions. They rotate weekly and repeat after eight weeks. This is not a claim of 52 unique Boss scenarios.
- Optional helpers shorten framing, unloading and cleanup by 15 minutes; qualified leads, shared tools, dependencies and shift limits still apply.
- Boss face with your Day One Projects logo, chomping mouth and steam at ten seconds; red eyes at five. Minute/45/30/15-second flashes and solid red final ten seconds.
- More visual shift playback and planned vs actual results, including blocked/unassigned/late/on-time labels.
- 52 separately authored regular Foreman puzzles; seasonal Foreman puzzles take over during events. The existing 14 seasonal/regular packs still supply the jokes, facts and challenge sets, so those smaller banks eventually repeat.
- Typed and sequence-building responses added to suitable weekly challenges. Other visual challenges retain multiple choice.
- Correct-answer text contrast fixed; progressive management reactions rotate weekly. Incident status text uses normal card text. Incident report stays before the games.
- Smaller unlabeled secret pumpkin with candlelight glow, away from the event toggle. Christmas uses a discreet ornament entrance instead.
- All 16 approved Christmas backgrounds: 7 daytime and 9 night/evening, including Beebo’s pinecone tree and Christmas road trip. Optimized app images are already inside christmas-art/. Do not upload your separate full-resolution artwork folder.
- New scene on a fresh app load, matching light/dark mode; no 30-second slideshow. Full scene viewer preserves the entire composition. Portrait art is contained on wide screens; the landscape road-trip render is contained on phones too.
- Multicoloured slowly twinkling night perimeter lights, restrained downward snow, character cameos, Bumble’s snowball poses, and occasional sleigh passes. Week one introduces characters; later weeks animate and increase snow without covering the app. Reduced-motion preferences are respected.

SEASON CALENDAR — 4:30 A.M. AMERICA/VANCOUVER
Halloween full: October 26–November 2, 2026.
Normal: November 2–November 30.
Christmas: November 30. Steps up December 7, 14 and 21.
New Year: December 30–January 3, with coloured snowfall/confetti and fireworks over the winter artwork (not a separate new render collection).
Christmas finale: January 3–January 10, 2027.
Normal: January 10 onward. Further holidays are not scheduled in this build.

BILLING AND CONNECTION
No paid service or external subscription was added. Requests/messages, photo uploads and saved Boss attempts use your existing Firebase plan and therefore add reads/writes/storage. Boss saves while planning roughly every ten seconds and on changes/pause. Keep your existing $1 CAD billing alert. Internet access is needed to reserve/sync game attempts and submit requests; an unresolved save failure pauses the puzzle instead of granting fresh attempts.

VALIDATION
JavaScript syntax checks; Pacific calendar boundary checks; 3,000 random scheduling invariants including helpers; eight solvable Boss scenarios with $0 winning schedules; clock/pause/attempt-limit tests; browser checks of pause/restoration, second-attempt lock, bulk request creation, partial receipt and conversations using local test data. Christmas day/night and normal-mode visual checks use simulated event dates. No live inventory was modified. Firebase rules have not been emulator-tested or published to your project; run FIRST LIVE CHECK after installation.

LATER UPDATE
Consumables, kits, repair tracking, audits, outside loans and QR labels are not part of this release.
