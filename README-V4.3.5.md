# Tool Tracker V4.3.5 — History, Morale & Transfer Refinement

Built directly from the deployed V4.3.4 baseline.

## Changes
- Added date filtering to searchable, categorized Tool History.
- Replaced the footer Inventory graphic with a recognizable handled toolbox and refined the Jobs graphic as a clear tower crane; Home, Map and Personal retain their correct house, folded-map and lock symbols.
- Jobsite Morale now selects one deterministic weekly package shared by all users, including the dashboard message, bulletin, puzzle, fact and incident.
- Weekly Morale still resets Monday at 4:30 AM Pacific and preserves the completed-puzzle lock for that week.
- Ownership-transfer destination controls and actions remain accessible while scrolling long inventories.
- Missing company destination now focuses and scrolls to the required field.
- Replaced the browser-native GitHub confirmation alert with a branded transfer review.
- Transfer review lists the asset, old/new Tool ID, category and destination.
- Assets remember their Company and Personal Tool IDs and restore the prior pool-specific ID when available.
- Includes a safe one-time repair for the tested Bosch Circular Saw from P-B-43 back to P-B-03, preserving its permanent record and transfer history.

## Protected behavior
- Existing Firebase configuration and rules are unchanged.
- V4.3.3 save/upload pipeline remains unchanged.
- Company and Personal inventory remain separate and pairing remains pool-safe.
- Ownership transfers remain atomic and preserve permanent asset identity.
