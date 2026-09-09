# Known issues

This release concentrates on organizer reliability and custom settings. The following defects were found in source review and remain unresolved. Use copies of projects when exercising affected workflows.

| Area | Current limitation | Source |
| --- | --- | --- |
| Like Files | Same display names can cause distinct footage to be relinked to the same source. The comparison loop also omits its final entry. | `Toolbox.jsx`: `consolidateDuplicates` |
| Collect Project | Flattens source filenames into one directory without collision handling or checking copy success before relinking; image sequences need explicit handling. | `Toolbox.jsx`: `collectAEP` |
| Reduce | Calls an unfinished helper that reads past the comp array after the project has already been reduced. | `Toolbox.jsx`: `reduceProject`, `searchComps` |
| Item lookup/moving helpers | Some loops skip the last project item; `moveToFolder` also reads past the end of its match array. | `UTILITY_Functions.jsx` |
| Create New Project Directory | Cancelling the name prompt is not handled correctly, and directory creation success is not fully checked. | `TOOL_BuildProjectStructure.jsx` |
| Legacy ambiguous settings | Values containing hyphens cannot be reliably separated in an old hyphen-delimited file. Restore a backup or re-enter the values. | `UTILITY_BuildPrefs.jsx` |

## Legacy updater

The included `UTILITY_Update.jsx` targets `XAVToolbox.jsx` / `XAVToolbox_Assets` package names and uses PowerShell extraction. This repository installs `Toolbox.jsx` / `Toolbox_Assets`. Do not use the **UPDATE** button for this release; use the [manual update instructions](../README.md#updating-an-existing-installation).

## Validation limits

Live checks were performed on After Effects 2026 on macOS, using an otherwise empty project and the current settings dialog. Automated tests simulate project items and file I/O; they are not a substitute for testing host behavior with production footage, shared storage, and render templates. A live keyboard Undo round trip was not confirmed. Windows and older versions were not retested.
