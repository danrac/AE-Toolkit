# Updating Toolbox

To install 2.2.6 from 2.2.5 or earlier, use the [manual installation instructions](../README.md#updating-an-existing-installation). The old updater is replaced by the code in this release.

## Using UPDATE in 2.2.6 and later

1. Download a newer AE-Toolkit release from this repository.
2. Click **UPDATE** and choose **ZIP package** or **Extracted folder**.
3. Select the ZIP or extracted download. The updater locates `Toolbox.jsx` and `Toolbox_Assets/HelperScripts`, including inside GitHub's enclosing directory and `ScriptsUI Panels`.
4. Review the source location, version change, and file count in the confirmation dialog.
5. After success, close and reopen Toolbox or restart After Effects.

The updater rejects equal/older versions and incomplete packages before installing. It updates the main script and supplied helpers/resources. It preserves `SaveData`, swatch palettes, null-animation presets, local update packages, and logs. Aliases, hidden files, and unsafe ZIP paths are rejected or excluded.

ZIP extraction uses built-in macOS tools or Windows PowerShell/.NET. If extraction is unavailable, unpack the ZIP manually and choose **Extracted folder**. Windows execution has not been tested on an actual Windows host.

## Backups and failure recovery

Before any installed file is replaced, all existing destination files are copied and checked under:

```text
Toolbox_Assets/.updates/<timestamp>/backup/
```

The main script is copied last. If replacement fails, the updater attempts to restore each attempted file and remove partially added files. If restoration also fails, the error lists the paths requiring manual restoration and the backup directory. A partial update is never reported as success.

The updater retains backups and extraction files. After validating an update, you can remove older `.updates` directories to recover disk space. Do not delete the backup while you still need to revert.

Copy verification compares file sizes, plus text contents for scripts and text/configuration files. This is not cryptographic package signing or a guarantee against every possible storage failure. Install packages from the repository you trust.
