# Changelog

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
