# Development and testing

The installed entry point is `ScriptsUI Panels/Toolbox.jsx`. Helpers use After Effects' ExtendScript engine; preserve compatibility with its older JavaScript parser. A successful modern Node.js syntax check does not prove an ExtendScript script will load.

## Regression tests

From the repository root:

```sh
node "ScriptsUI Panels/Toolbox_Assets/Tests/organizer.test.js"
```

The 11 cases cover XAV routing; selected nested folders; an existing TempFolder; repeated XAV and all four DMS modes; renamed/dotted/uppercase sources; both path separators; error cleanup and logging failure; legacy settings; encoded settings round trips; write/backup failures; backup recovery; startup read-only behavior; and includes.

The test runner executes the organizer functions in a simulated project and the shared preference helper against an in-memory filesystem. It does not load After Effects or write production settings. Tests require a recent Node.js version supporting `Object.hasOwn`.

## Live smoke test

1. Install the complete script and helpers together and reload Toolbox in After Effects. Catch host-parser errors before testing behavior.
2. In a disposable project, add master/precomps, audio, stills, footage, solids, and nested folders. Select a folder tree and run XAV. Check routing, preservation, repeated runs, and Undo.
3. Exercise each DMS ratio, including uppercase extensions, renamed PSD layers, audio, and `06_ToGFX` paths.
4. In a test installation, save names with hyphens and Unicode. Reopen settings, verify the values, and check the previous valid `.bak` file. Test an unwritable settings directory.
5. Verify existing settings are unchanged by merely reopening the panel.

For 2.2.5, live validation confirmed panel loading, XAV folder creation and a repeated run in an empty project, and successful settings save with the original backup retained. A parser incompatibility found during that check was replaced with simple string-based filename/path handling. Detailed project routing remains covered by simulated tests; live Undo was not confirmed.

## Screenshots

The images under `docs/images` were captured directly from After Effects 2026 on macOS during this update. They show the repaired interface before the final version-label bump from 2.2.4 to 2.2.5. No generated mockups were used. Capture only neutral demo projects and avoid exposing private client paths.

## Repository hygiene

Keep starter presets generic. Do not commit per-user files, render logs, `.bak`/`.pending` files, nested repositories, local update archives, or unrelated bundled applications. The optional AetherFlow installation on the development machine is not part of this release. Preserve the repository's license.
