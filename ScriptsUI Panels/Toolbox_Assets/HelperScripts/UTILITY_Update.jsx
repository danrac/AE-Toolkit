// Toolbox updater: GitHub ZIP or extracted package, with backups and rollback.
function toolboxUpdateEnsureFolder(folder) {
    if (folder.exists) return;
    if (!folder.parent || folder.parent.fsName === folder.fsName) throw new Error("Cannot create " + folder.fsName);
    toolboxUpdateEnsureFolder(folder.parent);
    if (!folder.create()) throw new Error("Cannot create " + folder.fsName);
}
function toolboxUpdateRead(file) {
    file.encoding = "UTF-8";
    if (!file.open("r")) throw new Error("Cannot read " + file.fsName);
    try { return file.read(); } finally { file.close(); }
}
function toolboxUpdateWrite(file, text) {
    file.encoding = "UTF-8";
    if (!file.open("w")) throw new Error("Cannot write " + file.fsName);
    try { if (!file.write(text)) throw new Error("Cannot write " + file.fsName); }
    finally { file.close(); }
}
function toolboxUpdateCopy(source, destination) {
    toolboxUpdateEnsureFolder(destination.parent);
    if (!source.exists || !source.copy(destination.fsName) || !destination.exists || source.length !== destination.length) {
        throw new Error("Copy failed: " + source.fsName + " to " + destination.fsName);
    }
    if (/\.(jsx|js|json|txt)$/i.test(source.name) && toolboxUpdateRead(source) !== toolboxUpdateRead(destination)) {
        throw new Error("Verification failed: " + destination.fsName);
    }
}
function toolboxUpdateVersion(file) {
    var match = /var\s+version\s*=\s*"([0-9]+\.[0-9]+\.[0-9]+)"/.exec(toolboxUpdateRead(file));
    if (!match) throw new Error("Missing Toolbox version in " + file.fsName);
    return match[1];
}
function toolboxUpdateCompare(a, b) {
    var left = a.split("."), right = b.split(".");
    for (var i = 0; i < 3; i++) {
        var diff = Number(left[i]) - Number(right[i]);
        if (diff) return diff;
    }
    return 0;
}
function toolboxUpdateFindRoot(folder, depth) {
    depth = depth || 0;
    if (folder.alias || depth > 4) return null;
    if (new File(folder.fsName + "/Toolbox.jsx").exists && new Folder(folder.fsName + "/Toolbox_Assets/HelperScripts").exists) return folder;
    var children = folder.getFiles();
    for (var i = 0; i < children.length; i++) {
        if (children[i] instanceof Folder && children[i].name.charAt(0) !== "." && children[i].name !== "__MACOSX") {
            var found = toolboxUpdateFindRoot(children[i], depth + 1);
            if (found) return found;
        }
    }
    return null;
}
function toolboxUpdatePreserved(relative) {
    return /(^|\/)(SaveData|SwatchPalettes|NullAnimPresetData|Update_Packages|Tests|\.updates)(\/|$)/i.test(relative) || /(^|\/)\./.test(relative) || /\.(bak|pending)$/i.test(relative) || /log.*\.txt$/i.test(relative);
}
function toolboxUpdatePlan(packageRoot, installRoot) {
    var plan = [];
    function gather(source, relative) {
        if (source.alias) throw new Error("Update packages must not contain aliases: " + source.fsName);
        if (toolboxUpdatePreserved(relative)) return;
        if (source instanceof Folder) {
            var children = source.getFiles();
            for (var i = 0; i < children.length; i++) gather(children[i], relative + "/" + children[i].name);
        } else {
            plan.push({ source: source, target: new File(installRoot.fsName + "/" + relative), relative: relative });
        }
    }
    // Restrict updates to the installed script and its own assets. Main script is last.
    gather(new Folder(packageRoot.fsName + "/Toolbox_Assets/HelperScripts"), "Toolbox_Assets/HelperScripts");
    var resources = new Folder(packageRoot.fsName + "/Toolbox_Assets/ImageResources");
    if (resources.exists) gather(resources, "Toolbox_Assets/ImageResources");
    var aom = new File(packageRoot.fsName + "/Toolbox_Assets/aom.aep");
    if (aom.exists) gather(aom, "Toolbox_Assets/aom.aep");
    gather(new File(packageRoot.fsName + "/Toolbox.jsx"), "Toolbox.jsx");
    // Every literal include must resolve inside the supplied package, not a stale install.
    for (var i = 0; i < plan.length; i++) {
        if (!/\.jsx?$/i.test(plan[i].source.name)) continue;
        var text = toolboxUpdateRead(plan[i].source);
        var pattern = /^\s*#include\s+"([^"]+)"/gm, match;
        while ((match = pattern.exec(text)) !== null) {
            var include = new File(plan[i].source.parent.fsName + "/" + match[1]);
            if (!include.exists || include.alias || include.fsName.indexOf(packageRoot.fsName + "/") !== 0 && include.fsName.indexOf(packageRoot.fsName + "\\") !== 0) {
                throw new Error("Missing or invalid include: " + match[1] + " in " + plan[i].relative);
            }
        }
    }
    return plan;
}
function toolboxUpdateInstall(plan, backupRoot) {
    toolboxUpdateEnsureFolder(backupRoot);
    // Preflight and back up everything before replacing any installed file.
    for (var i = 0; i < plan.length; i++) {
        var entry = plan[i];
        entry.existed = entry.target.exists;
        entry.backup = new File(backupRoot.fsName + "/" + entry.relative);
        if (entry.existed) toolboxUpdateCopy(entry.target, entry.backup);
    }
    var attempted = [];
    try {
        for (var i = 0; i < plan.length; i++) {
            attempted.push(plan[i]);
            toolboxUpdateCopy(plan[i].source, plan[i].target);
        }
    } catch (error) {
        var failures = [];
        for (var i = attempted.length - 1; i >= 0; i--) {
            var entry = attempted[i];
            try {
                if (entry.existed) toolboxUpdateCopy(entry.backup, entry.target);
                else if (entry.target.exists && !entry.target.remove()) throw new Error("Cannot remove incomplete file");
            } catch (rollbackError) { failures.push(entry.target.fsName); }
        }
        throw new Error(error.toString() + (failures.length ? "\nRestore these files from the backup:\n" + failures.join("\n") : "\nPrevious installed files were restored.") + "\nBackup: " + backupRoot.fsName);
    }
}
function toolboxUpdateQuote(text) { return "'" + text.replace(/'/g, "'\\''") + "'"; }
function toolboxUpdateExtract(zip, destination) {
    toolboxUpdateEnsureFolder(destination);
    if ($.os.indexOf("Windows") !== -1 || $.os.indexOf("Win") !== -1) {
        var ps = new File(destination.parent.fsName + "/extract.ps1");
        var script = "$ErrorActionPreference = 'Stop'\n" +
            "Add-Type -AssemblyName System.IO.Compression.FileSystem\n" +
            "$src = '" + zip.fsName.replace(/'/g, "''") + "'\n" +
            "$dst = '" + destination.fsName.replace(/'/g, "''") + "'\n" +
            "$archive = [IO.Compression.ZipFile]::OpenRead($src)\n" +
            "try { foreach ($entry in $archive.Entries) { $name = $entry.FullName.Replace([char]92, [char]47); if ($name.StartsWith('/') -or $name.Split('/') -contains '..' -or $name.Contains(':') -or (($entry.ExternalAttributes -shr 16) -band 61440) -eq 40960) { throw 'Unsafe ZIP entry' } } } finally { $archive.Dispose() }\n" +
            "[IO.Compression.ZipFile]::ExtractToDirectory($src, $dst)\n" +
            "Write-Output 'TOOLBOX_EXTRACT_OK'\n";
        toolboxUpdateWrite(ps, script);
        var result = system.callSystem('powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "' + ps.fsName + '"');
        if (result.indexOf("TOOLBOX_EXTRACT_OK") === -1) throw new Error("ZIP extraction failed. Extract the ZIP manually and choose Extracted Folder.\n" + result);
    } else {
        var listing = system.callSystem("/usr/bin/unzip -Z1 " + toolboxUpdateQuote(zip.fsName));
        var entries = listing.split(/\r?\n/);
        for (var i = 0; i < entries.length; i++) {
            var entryName = entries[i].split("\\").join("/");
            var parts = entryName.split("/");
            if (entryName.charAt(0) === "/" || entryName.indexOf(":") !== -1) throw new Error("Unsafe ZIP entry: " + entryName);
            for (var j = 0; j < parts.length; j++) if (parts[j] === "..") throw new Error("Unsafe ZIP entry: " + entryName);
        }
        var detail = system.callSystem("/usr/bin/zipinfo -l " + toolboxUpdateQuote(zip.fsName));
        if (/^l[rwx-]{9}/m.test(detail)) throw new Error("ZIP packages must not contain symbolic links.");
        var result = system.callSystem("/usr/bin/ditto -x -k " + toolboxUpdateQuote(zip.fsName) + " " + toolboxUpdateQuote(destination.fsName) + " && /bin/echo TOOLBOX_EXTRACT_OK");
        if (result.indexOf("TOOLBOX_EXTRACT_OK") === -1) throw new Error("ZIP extraction failed.\n" + result);
    }
}
function toolboxUpdateMain() {
    var assets = new File($.fileName).parent.parent;
    var installRoot = assets.parent;
    var picker = new Window("dialog", "Update Toolbox");
    picker.add("statictext", undefined, "Choose a downloaded AE-Toolkit release.");
    var buttons = picker.add("group");
    var zipButton = buttons.add("button", undefined, "ZIP package");
    var folderButton = buttons.add("button", undefined, "Extracted folder");
    buttons.add("button", undefined, "Cancel", {name: "cancel"});
    var selected = null, isZip = false;
    zipButton.onClick = function() { selected = File.openDialog("Choose AE-Toolkit ZIP", "*.zip"); isZip = true; if (selected) picker.close(1); };
    folderButton.onClick = function() { selected = Folder.selectDialog("Choose the extracted AE-Toolkit folder"); if (selected) picker.close(1); };
    if (picker.show() !== 1 || !selected) return;
    try {
        var work = new Folder(assets.fsName + "/.updates/" + new Date().getTime());
        toolboxUpdateEnsureFolder(work);
        var source = selected;
        if (isZip) { source = new Folder(work.fsName + "/package"); toolboxUpdateExtract(selected, source); }
        var packageRoot = toolboxUpdateFindRoot(source);
        if (!packageRoot) throw new Error("Package must contain Toolbox.jsx and Toolbox_Assets/HelperScripts. GitHub ZIPs and extracted ScriptsUI Panels folders are supported.");
        var installed = toolboxUpdateVersion(new File(installRoot.fsName + "/Toolbox.jsx"));
        var incoming = toolboxUpdateVersion(new File(packageRoot.fsName + "/Toolbox.jsx"));
        if (toolboxUpdateCompare(incoming, installed) <= 0) throw new Error("Package version " + incoming + " is not newer than installed version " + installed + ".");
        var plan = toolboxUpdatePlan(packageRoot, installRoot);
        if (!confirm("Update Toolbox " + installed + " to " + incoming + "?\n" + plan.length + " files from:\n" + selected.fsName + "\nSaved settings and custom presets will be preserved.")) return;
        var backup = new Folder(work.fsName + "/backup");
        toolboxUpdateInstall(plan, backup);
        alert("Toolbox " + incoming + " installed. Close and reopen Toolbox (or restart After Effects).\nPrevious files: " + backup.fsName);
    } catch (error) { alert("Toolbox update did not complete.\n" + error.toString()); }
}
if (typeof TOOLBOX_TEST_MODE === "undefined") toolboxUpdateMain();
