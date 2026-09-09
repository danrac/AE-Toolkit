// Read only explicit project links. A filename or XMP document ID alone is not
// enough to identify the After Effects project that rendered an image.
function toolboxSourcePaths(xmp) {
    var paths = [];
    if (!xmp) return paths;
    var creator = XMPConst.NS_CREATOR_ATOM || "http://ns.adobe.com/creatorAtom/1.0/";
    var dm = XMPConst.NS_DM || "http://ns.adobe.com/xmp/1.0/DynamicMedia/";
    function add(property) {
        if (!property) return;
        var value = String(property.value !== undefined ? property.value : property);
        if (!/\.aepx?$/i.test(value)) return;
        for (var i = 0; i < paths.length; i++) if (paths[i] === value) return;
        paths.push(value);
    }
    try { add(xmp.getStructField(creator, "aeProjectLink", creator, "fullPath")); } catch (error) {}
    try { add(xmp.getStructField(dm, "projectRef", dm, "path")); } catch (error) {}
    // Some older files expose fullPath directly instead of under aeProjectLink.
    try { add(xmp.getProperty(creator, "fullPath")); } catch (error) {}
    return paths;
}
function toolboxSourceNormalize(path) {
    path = String(path).replace(/^\s+|\s+$/g, "").split("\\").join("/");
    if (/^file:/i.test(path)) {
        path = path.replace(/^file:\/\/localhost\//i, "/");
        path = path.replace(/^file:\/\/\//i, "/");
        path = path.replace(/^file:\/\//i, "//");
        if (/^\/[A-Za-z]:\//.test(path)) path = path.substr(1);
        try { path = decodeURIComponent(path); } catch (error) {}
    }
    return path;
}
function toolboxSourceResolve(path, pcRoot, macRoot) {
    var normalized = toolboxSourceNormalize(path);
    if (!/\.aepx?$/i.test(normalized) || !/^(\/|[A-Za-z]:\/)/.test(normalized)) return null;
    var direct = new File(normalized);
    if (direct.exists) return direct;
    var roots = [toolboxSourceNormalize(pcRoot || ""), toolboxSourceNormalize(macRoot || "")];
    for (var i = 0; i < 2; i++) {
        var from = roots[i].replace(/\/+$/, ""), to = roots[1 - i].replace(/\/+$/, "");
        if (!from || !to || from === "undefined" || to === "undefined") continue;
        var matches = i === 0 ? normalized.toLowerCase().indexOf(from.toLowerCase() + "/") === 0 : normalized.indexOf(from + "/") === 0;
        if (matches) {
            var mapped = new File(to + normalized.substr(from.length));
            if (mapped.exists) return mapped;
        }
    }
    return direct; // Keep the original path visible when the project has moved.
}
function toolboxSourceRead(file) {
    var paths = [], errors = [], handle;
    function merge(xmp) {
        var found = toolboxSourcePaths(xmp);
        for (var i = 0; i < found.length; i++) {
            var duplicate = false;
            for (var j = 0; j < paths.length; j++) if (paths[j] === found[i]) duplicate = true;
            if (!duplicate) paths.push(found[i]);
        }
    }
    try {
        handle = new XMPFile(file.fsName, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);
        merge(handle.getXMP());
    } catch (error) { errors.push("Embedded metadata could not be read: " + error.toString()); }
    finally { if (handle) try { handle.closeFile(); } catch (closeError) {} }
    var sidecars = [new File(file.fsName + ".xmp"), new File(file.fsName.replace(/\.[^\/.]+$/, "") + ".xmp")];
    for (var i = 0; i < sidecars.length; i++) {
        var sidecar = sidecars[i];
        if (!sidecar.exists || i > 0 && sidecar.fsName === sidecars[0].fsName) continue;
        var opened = false;
        try {
            if (sidecar.length > 10 * 1024 * 1024) throw new Error("Sidecar exceeds 10 MB.");
            sidecar.encoding = "UTF-8";
            opened = sidecar.open("r");
            if (!opened) throw new Error("Cannot open sidecar.");
            merge(new XMPMeta(sidecar.read()));
        } catch (error) { errors.push(sidecar.name + ": " + error.toString()); }
        finally { if (opened) sidecar.close(); }
    }
    return {paths: paths, errors: errors};
}
function toolboxSourceDiscover(selection, pcRoot, macRoot) {
    var records = [], notices = [], seen = {};
    for (var i = 0; i < selection.length; i++) {
        var item = selection[i];
        if (!(item instanceof FootageItem) || !item.file) { notices.push(item.name + ": select file-based footage, not a composition, folder or solid."); continue; }
        if (!item.file.exists) { notices.push(item.name + ": source media is offline."); continue; }
        var result = toolboxSourceRead(item.file);
        if (!result.paths.length) notices.push(item.name + ": no AE project link found." + (result.errors.length ? " " + result.errors.join(" ") : ""));
        for (var j = 0; j < result.paths.length; j++) {
            var file = toolboxSourceResolve(result.paths[j], pcRoot, macRoot);
            if (!file) { notices.push(item.name + ": project path is not an absolute .aep/.aepx path."); continue; }
            var key = "$" + file.fsName;
            if ($.os.indexOf("Win") !== -1) key = key.toLowerCase();
            if (!seen[key]) { seen[key] = true; records.push({file: file}); }
        }
    }
    return {records: records, notices: notices};
}
function toolboxSourceImport(records, selection) {
    var errors = [], imported = [], projectsFolder = null, compsFolder = null;
    function matchComp(comp) {
        for (var i = 0; i < selection.length; i++) {
            var name = selection[i].name.replace(/\.[^.]+$/, "");
            var clean = name.replace(/_[0-9.]+fps_[0-9]+x[0-9]+$/, "");
            if (comp.name === name || comp.name === clean) return true;
        }
        return false;
    }
    function gather(folder, matches) {
        if (!(folder instanceof FolderItem)) return;
        for (var i = 1; i <= folder.numItems; i++) {
            var item = folder.item(i);
            if (item instanceof CompItem && matchComp(item)) matches.push(item);
            else if (item instanceof FolderItem) gather(item, matches);
        }
    }
    app.beginUndoGroup("Import source AE projects");
    try {
        for (var i = 0; i < records.length; i++) {
            var file = records[i].file;
            try {
                if (!file.exists) throw new Error("Project not found: " + file.fsName);
                var project = app.project.importFile(new ImportOptions(file));
                imported.push(project);
                if (!projectsFolder) projectsFolder = getFolderByName("ImportedProjects");
                project.parentFolder = projectsFolder;
                var matches = []; gather(project, matches);
                for (var j = 0; j < matches.length; j++) {
                    if (!compsFolder) compsFolder = getFolderByName("ImportedComps");
                    matches[j].parentFolder = compsFolder;
                }
            } catch (error) { errors.push(file.name + ": " + error.toString()); }
        }
    } finally { app.endUndoGroup(); }
    if (errors.length) alert("Imported " + imported.length + " project(s).\n\n" + errors.join("\n"));
}
function toolboxSourceDialog(pcRoot, macRoot) {
    var selection = app.project.selection.slice(0);
    if (!selection.length) { alert("Select rendered footage or images in the Project panel first."); return; }
    var result = toolboxSourceDiscover(selection, pcRoot, macRoot);
    if (!result.records.length) {
        alert("No source AE project links were found.\n\n" + result.notices.join("\n") + "\n\nImages must retain a project link in embedded XMP or a matching .xmp sidecar. Not every image export includes one."); return;
    }
    var dialog = new Window("dialog", "Project Import Options");
    dialog.add("statictext", undefined, "Select the source projects to import. Missing paths are shown for reference.");
    var list = dialog.add("listbox", undefined, [], {multiselect: true, numberOfColumns: 2, showHeaders: true, columnTitles: ["Status", "Source AE project"], columnWidths: [80, 550]});
    list.preferredSize = [650, 240];
    for (var i = 0; i < result.records.length; i++) {
        var record = result.records[i], row = list.add("item", record.file.exists ? "Found" : "Missing");
        row.subItems[0].text = record.file.fsName;
        row.selected = record.file.exists;
    }
    if (result.notices.length) {
        var notes = dialog.add("edittext", undefined, result.notices.join("\n"), {multiline: true, readonly: true});
        notes.preferredSize = [650, 80];
    }
    var buttons = dialog.add("group");
    var importButton = buttons.add("button", undefined, "IMPORT");
    buttons.add("button", undefined, "CANCEL", {name: "cancel"});
    importButton.onClick = function() {
        var rows = list.selection || [], chosen = [];
        for (var i = 0; i < rows.length; i++) if (result.records[rows[i].index].file.exists) chosen.push(result.records[rows[i].index]);
        if (!chosen.length) { alert("Select at least one project marked Found."); return; }
        dialog.close(); toolboxSourceImport(chosen, selection);
    };
    applyToolboxTheme(dialog);
    dialog.show();
}
