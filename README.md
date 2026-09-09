# AE-Toolkit

A dockable production toolbox for Adobe After Effects: import assets, build and modify compositions, create covers and checkers, organize projects, and run everyday layer and animation tools.

**Version 2.2.5** fixes the XAV Organizer's end-of-run error and protects custom folder settings from being rewritten when the panel opens. It also improves DMS sorting and brings the repository up to date with the current Toolbox helpers.

[Installation](#installation) · [Quick start](#quick-start) · [Organizer guide](docs/organizer.md) · [Settings and recovery](docs/settings.md) · [Known issues](docs/known-issues.md) · [Changelog](CHANGELOG.md)

![Toolbox's current Clean Up / Collect controls in After Effects](docs/images/organizer-controls.png)

## Installation

1. Download this repository using **Code → Download ZIP**, or clone it.
2. Open the repository's `ScriptsUI Panels` directory. Copy **both** `Toolbox.jsx` and `Toolbox_Assets` into your After Effects **ScriptUI Panels** directory:

   | Platform | Typical installation directory |
   | --- | --- |
   | macOS | `/Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/` |
   | Windows | `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\` |

3. Keep the script and assets next to each other, with their names unchanged:

   ```text
   ScriptUI Panels/
   ├── Toolbox.jsx
   └── Toolbox_Assets/
       ├── HelperScripts/
       ├── ImageResources/
       ├── SaveData/
       └── aom.aep
   ```

4. In After Effects settings/preferences, under **Scripting & Expressions**, enable **Allow Scripts to Write Files and Access Network** for settings, logs, and file-based workflows. The installation's `Toolbox_Assets/SaveData` folder must also be writable by your account.
5. Restart After Effects, then open **Window → Toolbox.jsx**. Dock the panel wherever you prefer.

The repository directory is named `ScriptsUI Panels`; the actual After Effects directory is named `ScriptUI Panels`. Copy its contents, rather than nesting the repository directory inside After Effects.

### Updating an existing installation

Close Toolbox before replacing its code. Back up your existing `Toolbox_Assets` directory, then replace `Toolbox.jsx` and merge in the updated helpers and resources. **Keep your existing `SaveData` directory**—it contains custom folder names, client/project presets, and user preferences. Also retain any custom swatch palettes or null animation presets under `HelperScripts`.

Use this manual update process for 2.2.5. The legacy **UPDATE** button still needs cross-platform repair; see [known issues](docs/known-issues.md#legacy-updater).

## Quick start

1. Click a section heading to expand its controls. Collapse unused sections to fit the panel on smaller screens.
2. Open **SETTINGS** and enter the five project folder names you want. Click **SAVE SETTINGS**.
3. Expand **CLEAN UP / COLLECT**, select **XAV Organizer**, and click **ORGANIZE**.
4. To preserve a folder and everything inside it, select that folder in the Project panel first. XAV also preserves individually selected items.

Organization changes folders inside the After Effects project; it does not move source files on disk. The separate **CREATE NEW PROJECT DIRECTORY** command creates disk folders.

## Workflows

| Section | Use it for | What to have ready |
| --- | --- | --- |
| Project Navigation | Navigate a configured production project and its folders | A project entry and matching local/network root paths |
| Sourcing | Import files from pasted paths; find source projects from rendered media | One file path per line; embedded source metadata for source-project lookup |
| Create / Modify | Build named compositions or update selected compositions | Client/aspect-ratio presets, frame rate, and naming fields |
| Covers / Checkers | Generate covers, guides, and checker compositions | Source comps and the appropriate templates/render presets |
| Clean Up / Collect | Organize, rename, duplicate, reduce, consolidate, or collect | Project-panel selections appropriate to the operation |
| Tools | Layer selection, animation helpers, text replacement, auto-splice, and templates | A composition and relevant layers selected |
| Settings | Customize folder names, root paths, texture paths, and checker email | Your own production paths; leave unused integration fields blank |

Some render and shared-production functions depend on studio-specific presets and paths. Basic organization does not require a shared drive. Reduction, same-name consolidation, and collection have [known limitations](docs/known-issues.md); test them on a project copy.

### Import assets

Expand **SOURCING**, paste one file path per line, then choose **IMPORT ASSETS**. The source-project buttons require rendered media with suitable embedded metadata; they cannot recover missing source information from an arbitrary video.

<details>
<summary>Screenshot: Sourcing</summary>

![Sourcing controls with the multiline file-path input](docs/images/sourcing.png)

</details>

### Create or modify compositions

Expand **CREATE / MODIFY**, choose the client, aspect ratio, and frame rate, and enter the naming fields. Choose **CREATE COMP** for a new composition. To modify existing comps, select them in the Project panel and use **MODIFY COMP** with the desired **SIZE**, **FPS**, and **GUIDES** options enabled.

<details>
<summary>Screenshot: Create / Modify</summary>

![Composition presets, naming fields, and create/modify controls](docs/images/create-modify.png)

</details>

### Organize projects

**XAV Organizer** uses your five custom folder names. **DMS 16x9**, **DMS 9x16**, **DMS 4x5**, and **DMS 1x1** build a fixed production hierarchy with the chosen aspect-ratio folders. Selecting a DMS ratio changes the folder structure, not composition dimensions.

See the [organizer guide](docs/organizer.md) for routing rules, selection behavior, and examples.

### Customize settings

Open **SETTINGS** to edit folder names and optional production paths. Version 2.2.5 saves settings only when you choose **SAVE SETTINGS**, supports hyphens and Unicode, and backs up valid previous settings before replacing them.

<details>
<summary>Screenshot: Settings</summary>

<img src="docs/images/settings.png" alt="Build Options dialog with custom folder names and optional production paths" width="395">

</details>

See [settings and recovery](docs/settings.md) for backup locations and legacy-format compatibility.

## Compatibility and validation

The current panel was opened in **After Effects 2026 on macOS**. Live checks covered XAV folder creation, a repeated run, and saving settings with preservation of the original backup. The four DMS ratios and detailed sorting/selection behavior are covered by simulated regression tests; they have not all been checked in a live production project. Windows and earlier After Effects versions have not been revalidated for this update.

Run the regression tests with Node.js from the repository root:

```sh
node "ScriptsUI Panels/Toolbox_Assets/Tests/organizer.test.js"
```

These tests do not launch After Effects or change your saved preferences. See [development and testing](docs/development.md) for the distinction between automated checks and live verification.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Toolbox is missing from Window | Confirm both install paths and restart After Effects. |
| Script reports a missing include | Install the entire `Toolbox_Assets/HelperScripts` folder, including `UTILITY_BuildPrefs.jsx`. |
| The panel is clipped | Enlarge or undock it, or collapse unused sections. |
| Settings will not save | Check scripting permissions and write access to `Toolbox_Assets/SaveData`; the dialog reports the failure. |
| Defaults appear instead of custom names | Read the warning, preserve the original settings file, and follow the [recovery guide](docs/settings.md#recovering-settings). |
| Shared paths or render presets fail | Configure your studio's root paths and render/output-module templates. |

## Contributing and license

For bugs, include the After Effects version, operating system, exact error message, selected organizer mode, and a minimal reproduction. Do not include confidential project paths or client footage in public reports.

Licensed under the [BSD 3-Clause License](LICENSE).
