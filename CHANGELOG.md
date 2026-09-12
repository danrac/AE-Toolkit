# Changelog

## 2.2.19

- Added **XAV Organizer 2025** to the Organize menu, with the supplied composition, cut, asset, C4D, AE-import, solid, and unsorted routing rules.
- Integrated the preset into Toolbox's existing single Undo group. The supplied standalone script's nested Undo group and `autoFixExpressions` mutation are intentionally excluded, preventing competing undo boundaries.
- Added repeat-run and folder-routing coverage for the new preset.

## 2.2.18

- Released the verified Import Assets repair: files are checked before folders, pasted paths survive ScriptUI focus changes, and clean imports do not interrupt the workflow.
- Retained alerts for failed and partial imports.

## 2.2.17

- Removed the success-only alert after **Sourcing → Import Assets** completes.
- Kept alerts for failed and partial imports so actionable errors remain visible.
- Added a regression check confirming a clean import finishes without an alert.

## 2.2.16

- Fixed **Sourcing → Import Assets** misclassifying every existing asset as a folder in After Effects. The parser now checks `File.exists` before `Folder.exists`.
- Kept pasted import paths through the ScriptUI focus transition and passed that captured text directly to the importer.
- Added a regression test for hosts that report an existing file through `Folder.exists`.
- Verified in After Effects 2026 on macOS by importing a real MP4 from the Sourcing text field.

## 2.2.15

- Fixed the remaining **Sourcing → Import Assets** field lookup regression by reading the input control directly in the button handler.
- Removed reliance on custom properties attached to the ScriptUI button, which can be lost during its click event.

## 2.2.14

- Fixed **Sourcing → Import Assets** passing the button click event instead of the pasted path to the importer.
- Capture the field value before ScriptUI changes focus and retain input events as a fallback.
- Removed the editable text placeholder, which could overwrite a freshly pasted path during focus changes.
- Verified the repaired panel loads in After Effects 2026 and added a regression check for the field-to-button data flow.

## 2.2.13

- Restored the original direct ScriptUI button callback for **Import Assets**, which preserves the clicked button's native parent field.
- Retain the value captured while typing or pasting as a fallback when ScriptUI reports a placeholder or empty field during the click event.

## 2.2.12

- Repaired the Import Assets button binding so it reads the field belonging to the clicked button instead of a panel reference that can be stale after ScriptUI layout changes.
- Added a regression check proving that a pasted path reaches the importer from the clicked Sourcing field.

## 2.2.11

- Removed the remaining escaped separator character-class patterns from the asset importer after an After Effects parser failure at helper line 37.
- Added a parser-safety regression check for macOS, Windows, and UNC separator handling.

## 2.2.10

- Replaced an escaped path regular expression in the new asset importer that After Effects' legacy ExtendScript parser rejected at load time.
- Absolute-path detection now uses parser-safe character checks for macOS, Windows, and UNC paths.

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
