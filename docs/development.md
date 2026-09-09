# Development and testing

The installed entry point is `ScriptsUI Panels/Toolbox.jsx`. Helpers use After Effects' older ExtendScript engine. A modern JavaScript syntax check does not prove host-parser compatibility; load changed scripts in After Effects as well.

## Automated checks

Run from the repository root with a recent Node.js version:

```sh
node "ScriptsUI Panels/Toolbox_Assets/Tests/organizer.test.js"
node "ScriptsUI Panels/Toolbox_Assets/Tests/cleanup.test.js"
node "ScriptsUI Panels/Toolbox_Assets/Tests/scroll.test.js"
node "ScriptsUI Panels/Toolbox_Assets/Tests/update-online.test.js"
node "ScriptsUI Panels/Toolbox_Assets/Tests/source-projects.test.js"
```

There are 55 checks on macOS: 11 organizer/preferences checks, 17 cleanup/updater/theme checks, 4 viewport/scroll checks, 13 online-update checks, and 10 source-project checks. The Mac extraction test is skipped on other platforms.

- Organizer coverage: XAV/DMS routing, selected folder trees, TempFolder collisions, all four ratios, repeat runs, error cleanup, logging failures, legacy/new settings, write failures, recovery, and includes.
- Cleanup coverage: native collection delegation, recursive reduction selection, empty selections, native consolidation, final-item lookups, error cleanup, and project-directory cancellation/creation failures.
- Updater coverage: package discovery, preserved settings/preset directories, missing includes, successful backups, partial-copy rollback, backup failure, traversal rejection, real Mac ZIP extraction with quoted paths, and Windows command/failure handling.
- Theme coverage: case-insensitive ScriptUI control types and unchanged hierarchy, bounds, margins, orientation, and click handlers.

Tests use simulated project objects and File/Folder adapters. The cleanup suite creates disposable `.fixtures-*` directories inside its test directory and removes them when finished. It does not write installed settings. On macOS it invokes system ZIP utilities against those fixtures.

## Live validation and follow-up

For 2.2.6, the main panel and Settings visuals were checked in After Effects 2026/macOS. Collect Project reached the native save-required prompt and was cancelled without saving the demo. The new updater dialog loaded successfully. This does not constitute a complete live production-media regression or Windows validation.

For future releases, use a disposable saved project to exercise sequences, renamed/layered footage, duplicate imports with different interpretations, selected nested folders, reduction and Undo, native collection output, and settings persistence. Test Windows extraction on Windows before claiming full cross-platform verification.

## Cosmetic changes

`UTILITY_Theme.jsx` styles existing controls after UI construction. Do not change control bounds, margins, spacing, orientation, child order, or click handlers when extending the theme. Retain accessible text labels, native text editing/dropdowns, and visible keyboard focus.

## Screenshots and repository hygiene

Current panel, sourcing, composition, and settings screenshots under `docs/images` show 2.2.6 in After Effects 2026/macOS. `xav-organizer.png` is the earlier 2.2.5 output example retained for history; current guides use the new screenshots. No generated mockups are used.

Keep starter presets generic. Do not commit local user settings, render logs, `.bak`/`.pending` files, `.updates`, test fixtures, nested repositories, or unrelated applications. The optional AetherFlow installation is not bundled here.

Module container spacing is intentionally tightened in 2.2.6. The shared theme keeps individual control bounds intact; `connectToolboxModule` removes collapsed wrapper height and connects headers to darker bodies using native panel borders.

The user confirmed live main-panel scrolling in After Effects. The Tools popup compact and expanded appearance was also verified live after applying shared module framing.

Live 2.2.7 updater connectivity was checked in After Effects: GitHub was reached and the then-empty Releases page produced the intended no-release alert.
