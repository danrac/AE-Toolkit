# Resolved issues and validation limits

The actionable defects documented in the 2.2.5 audit are addressed in 2.2.6:

| Previous defect | Resolution |
| --- | --- |
| Same display names could relink different footage | Removed name-based replacement; both consolidation buttons use native matching. |
| Collection could collide filenames, miss sequence frames, and lose unsaved changes | Replaced the custom collector with the native Collect Files workflow. |
| Reduction crashed in an unfinished helper | Removed the helper, handled selected folder contents, and added reliable undo/progress cleanup. |
| Updater used the wrong installation names and Windows-only extraction | Replaced it with a package-aware macOS/Windows updater, backups, verification, and rollback. |
| Lookup/move loops skipped the final item or overran matches | Corrected the bounds and guarded folder moves against cycles. |
| Project-directory creation mishandled cancellation and reported false success | Validates names, creates ancestors, checks results, and reports partial failures. |

## Data and host limitations

- An old hyphen-delimited settings file containing hyphens inside values cannot be reconstructed unambiguously. Reads preserve the file and report the issue. Saving replacement values now also preserves the unreadable original in a timestamped recovery backup. Custom names overwritten before any backup existed cannot be recovered by this update.
- Detailed organizer/reduction behavior is tested with simulated project items. Native collection and consolidation follow the host's behavior and options; they are not independent reimplementations of Adobe's media handling.
- The live macOS check confirmed the UI, the collector's save prompt/cancellation, and the updater chooser. Actual Mac ZIP extraction and isolated updater rollback were tested using disk fixtures.
- Windows command generation/failure detection is tested in simulation. Windows execution, earlier After Effects versions, and a live keyboard Undo round trip remain unverified.

See [cleanup workflows](cleanup.md), [updating](updating.md), and [development/testing](development.md) for exact behavior.

## 2.2.7 additions

Automatic GitHub release installation and the up-to-date response were verified in After Effects 2026/macOS. Image source lookup requires retained XMP project-link metadata; no path can be recovered from absent or stripped metadata alone. Windows runtime and real image-export metadata variations still need broader coverage.
