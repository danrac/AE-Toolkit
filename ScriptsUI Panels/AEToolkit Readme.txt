AE-Toolkit / Toolbox 2.2.19

Full documentation and screenshots:
https://github.com/danrac/AE-Toolkit#readme

Copy Toolbox.jsx and Toolbox_Assets together into After Effects' ScriptUI Panels folder:
macOS: /Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/
Windows: C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\

Restart After Effects, then choose Window > Toolbox.jsx.
Enable scripting file/network access and ensure Toolbox_Assets/SaveData is writable.

When updating, preserve your existing SaveData folder and any custom helper presets.
Use manual installation to upgrade from 2.2.5 or earlier. The new UPDATE dialog accepts ZIPs and extracted folders.

2.2.19 adds XAV Organizer 2025 to Clean Up / Collect. It uses the supplied production folder layout inside Toolbox's single Undo group; the standalone script's nested Undo group and autoFixExpressions change are excluded.
2.2.18 includes the verified Sourcing > Import Assets repair. Valid media imports silently; errors and partial-import details still appear when action is needed.
See README.md and docs/ for workflows, screenshots, recovery, tests, and known issues.

UPDATE now checks GitHub Releases and automatically downloads and installs the latest stable version. Close and relaunch Toolbox after a successful update.
