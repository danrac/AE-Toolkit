// Shared by the panel and settings dialog. Reading never writes preferences.
function defaultBuildPreferences() {
    return ["Comps", "PreComp", "Footage", "Images", "Solids", "", "", "", ""];
}

function decodeBuildPreferences(content) {
    content = content.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
    if (!content.replace(/\s/g, "")) throw new Error("The settings file is empty.");
    var fields;
    if (content.indexOf("TOOLBOX_BUILD_PREFS_V2\n") === 0) {
        fields = content.split("\n");
        fields.shift();
        if (fields.length !== 9) throw new Error("The settings file is incomplete.");
        for (var i = 0; i < fields.length; i++) fields[i] = decodeURIComponent(fields[i]);
    } else {
        fields = content.split("-");
        // Legacy hyphens within values cannot be reconstructed unambiguously.
        if (fields.length !== 9 && fields.length !== 5) throw new Error("The legacy settings contain ambiguous separators. Restore a backup or re-enter the settings.");
    }
    var result = defaultBuildPreferences();
    for (var i = 0; i < fields.length; i++) {
        if (fields[i] !== "undefined" && (i >= 5 || fields[i].replace(/\s/g, ""))) result[i] = fields[i];
    }
    return result;
}

function readBuildPreferenceFile(path) {
    var file = new File(path);
    file.encoding = "UTF-8";
    if (!file.open("r")) throw new Error("Cannot read settings: " + file.fsName);
    try { return file.read(); } finally { file.close(); }
}

function readBuildPreferences(path) {
    if (!new File(path).exists && !new File(path + ".bak").exists) return defaultBuildPreferences();
    try {
        return decodeBuildPreferences(readBuildPreferenceFile(path));
    } catch (error) {
        try {
            var recovered = decodeBuildPreferences(readBuildPreferenceFile(path + ".bak"));
            alert("Toolbox loaded the settings backup because the main file could not be read. Save Settings to restore it.");
            return recovered;
        } catch (backupError) {
            alert("Toolbox could not load your custom settings. Defaults will be used; the saved file has not been changed.\n" + error.toString());
            return defaultBuildPreferences();
        }
    }
}

function saveBuildPreferences(path, fields) {
    if (fields.length !== 9) throw new Error("Expected nine settings fields.");
    var encoded = ["TOOLBOX_BUILD_PREFS_V2"];
    for (var i = 0; i < fields.length; i++) {
        if (typeof fields[i] !== "string") throw new Error("A settings field is missing.");
        if (i < 5 && (!fields[i].replace(/\s/g, "") || fields[i] === "undefined")) {
            throw new Error("All five project folder names are required.");
        }
        encoded.push(encodeURIComponent(fields[i]));
    }
    var content = encoded.join("\n");
    var target = new File(path);
    var pending = new File(path + ".pending");
    pending.encoding = "UTF-8";
    if (!pending.open("w")) throw new Error("Cannot write settings: " + pending.fsName);
    try {
        if (!pending.write(content)) throw new Error("Writing settings failed.");
    } finally { pending.close(); }
    try {
        if (readBuildPreferenceFile(pending.fsName) !== content) throw new Error("Settings verification failed.");
        // Never replace a good backup with a corrupt or empty main file.
        if (target.exists) {
            var validOriginal = false;
            try { decodeBuildPreferences(readBuildPreferenceFile(path)); validOriginal = true; } catch (error) {}
            if (validOriginal && !target.copy(path + ".bak")) throw new Error("Could not back up the existing settings.");
        }
        if (!pending.copy(path)) throw new Error("Could not replace settings; the backup has been preserved.");
        if (readBuildPreferenceFile(path) !== content) throw new Error("Saved settings verification failed; the backup has been preserved.");
    } finally { pending.remove(); }
}
