// Parse user-pasted asset paths without assuming a small set of extensions.
function toolboxImportTrim(value) {
    return String(value).replace(/^\s+|\s+$/g, "");
}
function toolboxImportCleanPath(value) {
    var path = toolboxImportTrim(value);
    if ((path.charAt(0) === '"' && path.charAt(path.length - 1) === '"') || (path.charAt(0) === "'" && path.charAt(path.length - 1) === "'")) {
        path = path.substring(1, path.length - 1);
    }
    if (/^file:/i.test(path)) {
        // Keep network file URLs as UNC paths; a generic replacement would
        // accidentally turn file://server/share into /server/share.
        if (/^file:\/\/localhost\//i.test(path)) {
            path = path.replace(/^file:\/\/localhost\//i, "/");
        } else if (/^file:\/\/\//i.test(path)) {
            path = path.replace(/^file:\/\/\//i, "/");
        } else if (/^file:\/\//i.test(path)) {
            path = path.replace(/^file:\/\//i, "//");
        } else {
            path = path.replace(/^file:\//i, "//");
        }
        if (/^\/[A-Za-z]:\//.test(path)) path = path.substring(1);
        try { path = decodeURI(path); } catch (error) {}
    }
    return path;
}
function toolboxImportAbsolute(path) {
    // Keep this deliberately expression-free: AE's legacy ExtendScript parser
    // can misread the escaped-slash/backslash pattern used here previously.
    if (!path) return false;
    var first = path.charAt(0);
    if (first === "/") return true;
    if (first === "\\" && path.charAt(1) === "\\") return true;
    return path.length > 2 && path.charAt(1) === ":" && (path.charAt(2) === "/" || path.charAt(2) === "\\");
}
function toolboxImportJoin(folder, filename) {
    return folder.replace(/[\\/]+$/, "") + "/" + filename.replace(/^[\\/]+/, "");
}
function toolboxImportMappedFile(path, pcRoot, macRoot) {
    var direct = new File(path);
    if (direct.exists) return direct;
    var normalized = path.split("\\").join("/");
    var roots = [toolboxImportCleanPath(pcRoot || "").split("\\").join("/").replace(/\/+$/, ""), toolboxImportCleanPath(macRoot || "").split("\\").join("/").replace(/\/+$/, "")];
    for (var i = 0; i < roots.length; i++) {
        var from = roots[i], to = roots[1 - i];
        if (!from || !to || from === "undefined" || to === "undefined") continue;
        var insensitive = $.os.indexOf("Win") !== -1;
        var candidate = insensitive ? normalized.toLowerCase() : normalized;
        var prefix = insensitive ? from.toLowerCase() : from;
        if (candidate.indexOf(prefix + "/") === 0) {
            var mapped = new File(to + normalized.substring(from.length));
            if (mapped.exists) return mapped;
        }
    }
    return direct;
}
function toolboxImportParse(text) {
    var result = { paths: [], errors: [] };
    var currentFolder = "", seen = {};
    var lines = String(text || "").replace(/\r/g, "").split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = toolboxImportCleanPath(lines[i]);
        if (!line || line === "Paths to files go here...") continue;
        var trailingSlash = /[\\/]$/.test(line);
        var absolute = toolboxImportAbsolute(line);
        var candidate = absolute ? line : (currentFolder ? toolboxImportJoin(currentFolder, line) : "");
        if (!candidate) {
            result.errors.push("Line " + (i + 1) + ": enter an absolute path or put it after a folder path.");
            continue;
        }
        if (trailingSlash || new Folder(candidate).exists) {
            currentFolder = candidate;
            continue;
        }
        var key = candidate.split("\\").join("/");
        if ($.os.indexOf("Win") !== -1) key = key.toLowerCase();
        if (!seen[key]) {
            seen[key] = true;
            result.paths.push(candidate);
        }
    }
    return result;
}
function toolboxImportAssets(text, pcRoot, macRoot) {
    var parsed = toolboxImportParse(text);
    var imported = 0, errors = parsed.errors.slice(0);
    if (!parsed.paths.length) {
        alert(errors.length ? "No assets were imported.\n\n" + errors.join("\n") : "Paste one or more asset paths before importing.");
        return { imported: 0, errors: errors };
    }
    app.beginUndoGroup("Import assets");
    try {
        for (var i = 0; i < parsed.paths.length; i++) {
            var file = toolboxImportMappedFile(parsed.paths[i], pcRoot, macRoot);
            if (!file.exists) {
                errors.push("Not found: " + file.fsName);
                continue;
            }
            try {
                app.project.importFile(new ImportOptions(file));
                imported++;
            } catch (error) {
                errors.push("Could not import " + file.fsName + ": " + error.toString());
            }
        }
    } finally {
        app.endUndoGroup();
    }
    var summary = imported ? "Imported " + imported + " asset" + (imported === 1 ? "." : "s.") : "No assets were imported.";
    if (errors.length) summary += "\n\n" + errors.join("\n");
    alert(summary);
    return { imported: imported, errors: errors };
}
