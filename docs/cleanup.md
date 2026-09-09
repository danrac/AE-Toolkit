# Cleanup workflows

The controls stay in their existing positions under **Clean Up / Collect**. Version 2.2.6 changes the affected operations to remove the defects identified in the audit.

## Consolidate and Like Files

Both buttons now call After Effects' native footage consolidation. The old name-only replacement algorithm is gone. A shared display name is not sufficient to relink two different files; After Effects determines which imports can be consolidated using source and interpretation settings. This operation covers the whole project; selected items are not exclusions. [Adobe's footage documentation](https://helpx.adobe.com/after-effects/desktop/work-with-footage-items/manage-footage-items/footage-items.html)

**Consolidate Offline** is a separate existing control; it is not the Like Files routine described here.

## Reduce

Select the compositions or footage to keep, then choose **REDUCE**. Selected folders contribute their descendants, and duplicate selections are collapsed before calling After Effects' reduction operation. Dependencies are retained by After Effects.

With no selection, REDUCE removes unused footage. Selecting only empty folders does nothing and displays an explanation. Errors close the undo group and reset progress; they no longer enter the unfinished helper that used to crash after reduction.

## Collect Project

**COLLECT PROJECT** opens **File → Dependencies → Collect Files**. Use After Effects' dialog to choose all, selected, or queued compositions and select a destination. After Effects prompts to save if necessary. Cancelling that prompt leaves the project uncollected.

This replaces the old custom collector that flattened filenames, copied one sequence frame, and relinked before checking copy success. Native collection supplies the project-copy, source/proxy, and file-gathering workflow. Choose the appropriate proxy settings in the dialog and check the collected output before handing it off. [Adobe's collection documentation](https://helpx.adobe.com/after-effects/desktop/render-and-export/basics-of-rendering-and-exporting/basics-rendering-exporting.html)

In a non-English host where the menu command cannot be found by name, Toolbox displays the menu route instead of trying an unrelated command ID.
