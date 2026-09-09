# Settings and recovery

Choose **SETTINGS** at the bottom of Toolbox. The first five fields name the XAV Organizer destinations; all five must be nonblank. Remaining fields are optional integrations: Windows/macOS project roots, texture resources, and the checker email destination.

<img src="images/settings.png" alt="Toolbox settings dialog" width="395">

## Where settings live

Relative to your installed `Toolbox_Assets` directory:

```text
SaveData/BUILD_ORGANIZE_PREFS.txt       Current folder/path settings
SaveData/BUILD_ORGANIZE_PREFS.txt.bak   Previous valid settings after a save
SaveData/Presets/                      Client/project/template lists
SaveData/Users/                        Per-user preferences
```

Opening the panel reads settings; it does not rewrite the folder/path preset. **SAVE SETTINGS** validates the form, writes and verifies a pending file, backs up a readable valid original, and then replaces the main file. A failed save keeps the dialog open with an error. The current field values are refreshed in the panel after the dialog closes.

The `.bak` file is one previous valid version, not an unlimited history. Keep an independent backup when making substantial changes, especially in a shared installation. Multiple artists sharing the same installation also share the folder/path settings file; coordinate edits.

## Format compatibility

Older versions stored five or nine fields separated by hyphens. This version can read that legacy format, but a legacy file containing hyphens inside values is inherently ambiguous. It is reported rather than guessed.

New saves start with `TOOLBOX_BUILD_PREFS_V2` and encode each of the nine fields on its own line. This preserves hyphens, Unicode, spaces, and path separators. Use the settings dialog rather than hand-editing encoded fields. Missing or literal `undefined` optional legacy values are treated as unset.

Update the main script **and** its helpers together. Older Toolbox versions do not understand the new format; retain a legacy backup if you need to downgrade.

## Recovering settings

1. Close Toolbox and make a separate copy of the current `.txt` and `.bak` files before editing them.
2. Reopen Toolbox. If the main file cannot be read or decoded, it tries the backup and reports the fallback. Choose **SAVE SETTINGS** to restore the recovered values to the main file.
3. If both files are unavailable or invalid, defaults are displayed with a warning. The read operation leaves the files intact. Restore an independent backup or re-enter your names in the dialog.
4. If saving fails, check After Effects' scripting permission and operating-system write access to `SaveData`.

Recovery cannot reconstruct custom names that were overwritten before any usable backup existed. Defaults appearing on screen do not mean your original file has been overwritten by this version.

## Updating without losing preferences

Back up `Toolbox_Assets` before installing an update. Preserve the existing `SaveData` folder rather than replacing it with the repository's starter defaults. Preserve custom `HelperScripts/SwatchPalettes` and `HelperScripts/NullAnimPresetData` files too.
