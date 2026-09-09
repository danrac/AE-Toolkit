// Latest stable GitHub release updater, with verified downloads and rollback.
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
        if (result.indexOf("TOOLBOX_EXTRACT_OK") === -1) throw new Error("ZIP extraction failed.\n" + result);
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
// Strict JSON reader for ExtendScript hosts without JSON.parse. Never evaluate
// release metadata as JavaScript.
function toolboxUpdateJSON(text) {
    var at = 0;
    function whitespace() { while (/\s/.test(text.charAt(at)) && at < text.length) at++; }
    function value(depth) {
        if (depth > 50) throw new Error("Release metadata is too deeply nested.");
        whitespace();
        var ch = text.charAt(at++), result, key;
        if (ch === '"') {
            result = "";
            while (at < text.length) {
                ch = text.charAt(at++);
                if (ch === '"') return result;
                if (ch === "\\") {
                    ch = text.charAt(at++);
                    var escapes = {'"':'"', "\\":"\\", "/":"/", b:"\b", f:"\f", n:"\n", r:"\r", t:"\t"};
                    if (ch === "u") {
                        var hex = text.substr(at, 4);
                        if (!/^[0-9a-f]{4}$/i.test(hex)) throw new Error("Invalid JSON escape.");
                        result += String.fromCharCode(parseInt(hex, 16)); at += 4;
                    } else if (escapes[ch] !== undefined) result += escapes[ch];
                    else throw new Error("Invalid JSON escape.");
                } else { if (ch.charCodeAt(0) < 32) throw new Error("Invalid JSON string."); result += ch; }
            }
        } else if (ch === "{" || ch === "[") {
            var object = ch === "{", end = object ? "}" : "]";
            result = object ? {} : [];
            whitespace();
            if (text.charAt(at) === end) { at++; return result; }
            while (at < text.length) {
                if (object) {
                    whitespace(); if (text.charAt(at) !== '"') throw new Error("Invalid JSON key.");
                    key = value(depth + 1); whitespace();
                    if (text.charAt(at++) !== ":") throw new Error("Invalid JSON object.");
                    var item = value(depth + 1);
                    if (key !== "__proto__" && key !== "constructor" && key !== "prototype") result[key] = item;
                } else result.push(value(depth + 1));
                whitespace(); ch = text.charAt(at++);
                if (ch === end) return result;
                if (ch !== ",") throw new Error("Invalid JSON separator.");
            }
        } else {
            at--;
            var token = /^(true|false|null|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)/.exec(text.substr(at));
            if (token) { at += token[0].length; return token[0] === "true" ? true : token[0] === "false" ? false : token[0] === "null" ? null : Number(token[0]); }
        }
        throw new Error("GitHub returned invalid release metadata.");
    }
    var result = value(0); whitespace();
    if (at !== text.length) throw new Error("Unexpected data after release metadata.");
    return result;
}
function toolboxUpdateAllowedURL(url) {
    return typeof url === "string" && (/^https:\/\/api\.github\.com\/(?:$|repos\/danrac\/AE-Toolkit\/(?:releases\/latest|zipball\/[A-Za-z0-9._-]+)$)/.test(url) || /^https:\/\/github\.com\/danrac\/AE-Toolkit\/releases\/download\/[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+\.zip$/.test(url));
}
function toolboxUpdateFetch(url, file, timeout) {
    if (!toolboxUpdateAllowedURL(url)) throw new Error("Unexpected release download URL.");
    var args = ['--location', '--silent', '--show-error', '--proto', '=https', '--proto-redir', '=https', '--connect-timeout', '10', '--max-time', String(timeout), '--user-agent', 'AE-Toolkit-Updater', '--header', 'Accept: application/vnd.github+json', '--output', file.fsName, '--write-out', 'TOOLBOX_HTTP:%{http_code}', url];
    var output;
    if ($.os.indexOf("Win") !== -1) {
        var ps = new File(file.parent.fsName + "/download.ps1");
        var quoted = [];
        for (var i = 0; i < args.length; i++) quoted.push("'" + args[i].replace(/'/g, "''") + "'");
        toolboxUpdateWrite(ps, "$ErrorActionPreference = 'Stop'\n& curl.exe " + quoted.join(" ") + "\nif ($LASTEXITCODE -eq 0) { Write-Output 'TOOLBOX_TRANSFER_OK' }\n");
        output = system.callSystem('powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "' + ps.fsName + '"');
    } else {
        var quoted = [];
        for (var i = 0; i < args.length; i++) quoted.push(toolboxUpdateQuote(args[i]));
        output = system.callSystem("/usr/bin/curl " + quoted.join(" ") + " 2>&1 && /bin/echo TOOLBOX_TRANSFER_OK");
    }
    var status = /TOOLBOX_HTTP:([0-9]{3})/.exec(output);
    return {status: status ? Number(status[1]) : 0, complete: output.indexOf("TOOLBOX_TRANSFER_OK") !== -1 && file.exists && file.length > 0};
}
function toolboxUpdateRelease(metadata) {
    if (!metadata || metadata.draft || metadata.prerelease || !/^v?[0-9]+\.[0-9]+\.[0-9]+$/.test(metadata.tag_name)) throw new Error("The latest release must have a stable version tag such as v2.2.7.");
    var version = metadata.tag_name.replace(/^v/, "");
    var name = "AE-Toolkit-v" + version + ".zip";
    var assets = metadata.assets || [];
    for (var i = 0; i < assets.length; i++) {
        if (assets[i].name === name && assets[i].state === "uploaded") {
            if (!toolboxUpdateAllowedURL(assets[i].browser_download_url) || !(assets[i].size > 0)) throw new Error("Invalid release ZIP asset.");
            return {version: version, url: assets[i].browser_download_url, size: assets[i].size, digest: assets[i].digest};
        }
    }
    // GitHub supplies a source ZIP for releases without a packaged asset.
    if (!toolboxUpdateAllowedURL(metadata.zipball_url)) throw new Error("The release has no valid ZIP download.");
    return {version: version, url: metadata.zipball_url, size: 0, digest: null};
}
function toolboxUpdateVerifyDownload(file, release) {
    if (!file.exists || !file.length || release.size && file.length !== release.size) throw new Error("The release ZIP download is incomplete. Please try Update again.");
    if (!release.digest) return;
    if (!/^sha256:[0-9a-f]{64}$/i.test(release.digest)) throw new Error("Unsupported release checksum.");
    var output;
    if ($.os.indexOf("Win") !== -1) {
        var ps = new File(file.parent.fsName + "/verify.ps1");
        toolboxUpdateWrite(ps, "$ErrorActionPreference = 'Stop'\n(Get-FileHash -Algorithm SHA256 -LiteralPath '" + file.fsName.replace(/'/g, "''") + "').Hash\n");
        output = system.callSystem('powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "' + ps.fsName + '"');
    } else output = system.callSystem("/usr/bin/shasum -a 256 " + toolboxUpdateQuote(file.fsName));
    var hash = /^\s*([0-9a-f]{64})(?:\s|$)/i.exec(output);
    if (!hash || hash[1].toLowerCase() !== release.digest.substr(7).toLowerCase()) throw new Error("The release ZIP checksum did not match. No installed files were changed.");
}
function toolboxUpdateMain() {
    var assets = new File($.fileName).parent.parent;
    var installRoot = assets.parent;
    var progress = new Window("palette", "Update Toolbox");
    var label = progress.add("statictext", undefined, "Checking internet connection...");
    label.preferredSize = [390, 30];
    function status(message) { label.text = message; progress.update(); }
    progress.show();
    try {
        var work = new Folder(assets.fsName + "/.updates/" + new Date().getTime());
        toolboxUpdateEnsureFolder(work);
        var connection = toolboxUpdateFetch("https://api.github.com/", new File(work.fsName + "/connection.json"), 15);
        if (!connection.complete || !connection.status) throw new Error("No internet connection, or GitHub cannot be reached. Check your connection and try again.");
        status("Checking the latest GitHub release...");
        var metadataFile = new File(work.fsName + "/release.json");
        var response = toolboxUpdateFetch("https://api.github.com/repos/danrac/AE-Toolkit/releases/latest", metadataFile, 30);
        if (response.status === 404) throw new Error("No published Toolbox release is available yet.");
        if (response.status === 403 || response.status === 429) throw new Error("GitHub is temporarily limiting update requests. Please try again later.");
        if (!response.complete || response.status !== 200) throw new Error("Could not check the latest GitHub release. Please try again later.");
        var release = toolboxUpdateRelease(toolboxUpdateJSON(toolboxUpdateRead(metadataFile)));
        var installed = toolboxUpdateVersion(new File(installRoot.fsName + "/Toolbox.jsx"));
        if (toolboxUpdateCompare(release.version, installed) <= 0) {
            progress.close(); alert("Toolbox " + installed + " is already up to date."); return;
        }
        status("Downloading Toolbox " + release.version + "...");
        var zip = new File(work.fsName + "/release.zip");
        response = toolboxUpdateFetch(release.url, zip, 300);
        if (!response.complete || response.status !== 200) throw new Error("The release ZIP could not be downloaded completely. Check your connection and try again.");
        toolboxUpdateVerifyDownload(zip, release);
        status("Validating the downloaded package...");
        var source = new Folder(work.fsName + "/package");
        toolboxUpdateExtract(zip, source);
        var packageRoot = toolboxUpdateFindRoot(source);
        if (!packageRoot) throw new Error("The ZIP does not contain a Toolbox installation.");
        var incoming = toolboxUpdateVersion(new File(packageRoot.fsName + "/Toolbox.jsx"));
        if (incoming !== release.version) throw new Error("The downloaded script version does not match its release tag.");
        var plan = toolboxUpdatePlan(packageRoot, installRoot);
        var backup = new Folder(work.fsName + "/backup");
        status("Backing up and installing Toolbox " + incoming + "...");
        toolboxUpdateInstall(plan, backup);
        progress.close();
        alert("Toolbox " + incoming + " has been installed.\n\nClose Toolbox and any open Tools or Settings windows, then relaunch Toolbox from the Window menu.\n\nPrevious files: " + backup.fsName);
    } catch (error) { progress.close(); alert("Toolbox update did not complete.\n" + error.toString()); }
}
if (typeof TOOLBOX_TEST_MODE === "undefined") toolboxUpdateMain();
