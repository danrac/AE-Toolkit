# Changelog

## 2.2.9

- Repaired **Sourcing → Import Assets**. The prior loop processed one past the final pasted path and could stop the entire import with an undefined-path error.
- Replaced the extension-specific formatter with a parser for ordinary absolute paths, quoted paths, `file://` URLs, UNC paths, and folder-plus-filename lists.
- Cross-platform Windows/Mac root mapping now applies when the direct path is unavailable. Invalid or missing files are reported after valid files continue importing.
- Added seven automated import-asset checks covering path formats, mapping, deduplication, partial failures, and undo cleanup.

## 2.2.8

- Increased each expandable main-panel and Tools header to a 34px native ScriptUI button target, including header wrapper groups used by the Windows layout engine.
- Added a regression check that confirms the target sizing and preserves one-click module toggling.

## 2.2.7

- Source AE project lookup now includes still images/sequences and matching XMP sidecars, uses structured project-link fields, reports missing metadata and deduplicates project imports.
- Source import no longer moves unrelated existing compositions or creates folders before the user imports.

- UPDATE checks GitHub connectivity, downloads the latest stable release ZIP, validates it and installs it with backups and rollback.
- Added clear offline, up-to-date, rate-limit and incomplete-download messages, followed by close/relaunch instructions only after success.
- Verify release asset size and SHA-256 digest when available, and require matching release/script versions.
- Added 13 online-updater regression checks and release packaging documentation.

## 2.2.6 — 2026-09-09

- Modern dark surfaces, flat controls, subtle blue accents, cleaner section titles, and quieter dividers. The layout, control bounds, order, and handlers are preserved.
- Collect Project opens the native After Effects Collect Files workflow, eliminating custom copy/relink collision and sequence handling.
- Consolidate and Like Files use native source/interpretation matching; same display names never trigger custom relinking.
- Reduction includes selected folder contents, deduplicates selections, rejects empty-folder-only selections, and closes undo on failure. Removed the unfinished reduction helpers.
- Lookup/move functions include the final project item, avoid array overruns, and prevent folder cycles.
- Disk project creation handles cancelled/invalid names, creates ancestors, and reports partial failures.
- Updater accepts GitHub ZIP/extracted folder layouts on macOS and Windows, preserves settings/custom presets, verifies copies, backs up before replacement, and rolls back failed installs.
- Saving over unreadable preferences preserves a recovery copy; failed writes clean up their pending file.
- Updated documentation and screenshots; 28 regression checks pass. Live macOS UI checks and actual Mac ZIP extraction passed. Windows execution and a live keyboard Undo round trip remain unverified.

## 2.2.5 — 2026-09-09

### Fixed

- XAV Organizer no longer reads beyond its item list after creating folders.
- Selected XAV items and selected folder trees are preserved; only empty unprotected folders are removed.
- DMS sorting handles source filenames, uppercase/multiple-dot extensions, audio, and Mac/Windows `06_ToGFX` paths.
- Organizer failures close the undo group and reset progress. Logging failures cannot block sorting.
- Opening Toolbox no longer rewrites the custom folder/path settings file.
- Settings support hyphens and Unicode, validate folder names, verify writes, preserve the previous valid backup, and recover from readable backups.
- Settings changes refresh the panel's cached root paths.
- Replaced organizer regex patterns rejected by the live ExtendScript parser with string operations.

### Updated

- Synced current composition/animation/path helpers and additional text-template, null-animation, and color-swatch scripts from the working installation.
- Rewrote installation, organization, settings recovery, testing, and known-issue documentation.
- Added current After Effects screenshots and 11 automated regression tests.

### Validation

- Regression tests pass.
- After Effects 2026/macOS: panel launch, XAV folder creation/repeated run, and settings save/backup checked live.
- Detailed routing uses simulated tests. Windows, older hosts, and a live Undo round trip remain unverified.

See [known issues](docs/known-issues.md) for outstanding reduction, consolidation, collection, and updater defects.

### UI follow-up

- Removed Auto-splice from the Tools panel.
- Matched the version footer and surrounding background to the main panel.

### Scrollable main panel

- Added a clipped content viewport and native vertical scrollbar so multiple expanded modules remain accessible in a fixed-height panel.
- Recalculate the range on resize and module changes, preserving and clamping the current offset.
- Removed an unused empty group from the main layout.
- Added four viewport regression checks.

- Matched the Tools popup to the main module styling: compact collapsed spacing, connected headers and dark bordered bodies. Verified collapsed and expanded states in After Effects.
