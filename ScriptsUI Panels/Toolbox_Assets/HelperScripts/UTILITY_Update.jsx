// XAV Toolbox Updater
// Clean version with progress bar, debug log,
// and automatic latest UpgradePackage_v000.zip detection.
// ExtendScript-safe.

var DEBUG_LOG_FILE = null;
var PROGRESS_WIN = null;
var PROGRESS_BAR = null;
var PROGRESS_TEXT = null;
var PROGRESS_CLOSE_BTN = null;

main();

function main() {

    initDebugLog();
    createProgressWindow();

    logStep("Starting XAV Toolbox update process.");
    setProgress("Starting update...", 5);

    // -------------------------------------------------------
    // 1. Resolve Paths
    // -------------------------------------------------------
    var thisScript = new File($.fileName);
    var scriptFolder = thisScript.parent;
    var toolboxRoot = scriptFolder.parent;
    var scriptsUIFolder = toolboxRoot.parent;

    var updatePackagesFolder = new Folder(toolboxRoot.fsName + "/Update_Packages");

    var helperTarget = new Folder(toolboxRoot.fsName + "/HelperScripts");
    var resourcesTarget = new Folder(toolboxRoot.fsName + "/ImageResources");
    var mainScriptTarget = new File(scriptsUIFolder.fsName + "/XAVToolbox.jsx");

    logStep(
        "Resolved paths:\n" +
        "This Script: " + thisScript.fsName + "\n" +
        "Script Folder: " + scriptFolder.fsName + "\n" +
        "Toolbox Root: " + toolboxRoot.fsName + "\n" +
        "Scripts UI Folder: " + scriptsUIFolder.fsName + "\n" +
        "Update Packages Folder: " + updatePackagesFolder.fsName + "\n" +
        "HelperScripts Target: " + helperTarget.fsName + "\n" +
        "ImageResources Target: " + resourcesTarget.fsName + "\n" +
        "Main Script Target: " + mainScriptTarget.fsName
    );

    // -------------------------------------------------------
    // 2. Find Latest Upgrade Package
    // -------------------------------------------------------
    setProgress("Finding latest update package...", 10);

    var zipFile = getLatestUpgradePackage(updatePackagesFolder);

    if (!zipFile) {

        logStep(
            "No valid UpgradePackage_v000.zip package found in:\n" +
            updatePackagesFolder.fsName
        );

        setProgress("No package found. Select update package manually...", 10);

        zipFile = File.openDialog(
            "Select an UpgradePackage_v000.zip file for the XAV Toolbox update",
            "*.zip"
        );

        if (!zipFile) {
            failUpdate("Update cancelled. No zip selected.");
            return;
        }

        if (!isValidUpgradePackageName(zipFile.name)) {
            failUpdate(
                "Invalid file selected.\n" +
                "Expected naming convention:\n" +
                "UpgradePackage_v000.zip\n\n" +
                "Selected:\n" +
                zipFile.name
            );
            return;
        }

        logStep("Manual ZIP selected: " + zipFile.fsName);

    } else {

        logStep("Auto-selected latest update package: " + zipFile.fsName);
    }

    // -------------------------------------------------------
    // 3. Create Temp Folder
    // -------------------------------------------------------
    setProgress("Creating temporary extraction folder...", 20);

    var tempRoot = Folder.temp;
    var tempExtract = new Folder(tempRoot.fsName + "/XAVTMP_" + getTimeStamp());

    if (!tempExtract.exists) {
        tempExtract.create();
    }

    logStep(
        "Temporary extraction folder:\n" +
        tempExtract.fsName + "\n" +
        "Exists: " + tempExtract.exists
    );

    if (!tempExtract.exists) {
        failUpdate("Temp folder failed to create. Cannot continue.");
        return;
    }

    // -------------------------------------------------------
    // 4. Extract ZIP
    // -------------------------------------------------------
    setProgress("Extracting update package...", 35);

    if (!extractZipPowerShell(zipFile, tempExtract)) {
        failUpdate("Extraction failed. Check debug log for details.");
        return;
    }

    logStep("ZIP extraction complete.");

    // -------------------------------------------------------
    // 5. Detect Package Root
    // -------------------------------------------------------
    setProgress("Locating package contents...", 50);

    var packageRoot = findPackageRoot(tempExtract);

    if (!packageRoot) {
        deleteFolderRecursive(tempExtract);

        failUpdate(
            "Could not locate update package root.\n" +
            "Expected to find XAVToolbox.jsx or XAVToolbox_Assets."
        );
        return;
    }

    logStep("Package root found: " + packageRoot.fsName);

    // -------------------------------------------------------
    // 6. Update Main Script
    // -------------------------------------------------------
    setProgress("Checking main script version...", 60);

    var mainScriptUpdate = new File(packageRoot.fsName + "/XAVToolbox.jsx");

    logStep("Looking for updated main script: " + mainScriptUpdate.fsName);

    if (mainScriptUpdate.exists) {

        var currentVersion = getVersionFromScript(mainScriptTarget);
        var updateVersion = getVersionFromScript(mainScriptUpdate);

        logStep(
            "Version check:\n" +
            "Current version: " + currentVersion + "\n" +
            "Update version: " + updateVersion
        );

        if (compareVersions(updateVersion, currentVersion) > 0) {

            setProgress("Updating main script...", 68);

            if (copyFileOverwrite(mainScriptUpdate, mainScriptTarget)) {
                logStep("Main script updated to version " + updateVersion);
            } else {
                logStep(
                    "Failed to update main script.\n" +
                    "Source: " + mainScriptUpdate.fsName + "\n" +
                    "Destination: " + mainScriptTarget.fsName
                );
            }

        } else {
            logStep("Main script is already same or newer. Skipping.");
        }

    } else {
        logStep("UpdatePackage does not contain XAVToolbox.jsx. Skipping main script.");
    }

    // -------------------------------------------------------
    // 7. Update Asset Folders
    // -------------------------------------------------------
    setProgress("Updating asset folders...", 75);

    var rootSource = new Folder(packageRoot.fsName + "/XAVToolbox_Assets");

    logStep(
        "Looking for asset root:\n" +
        rootSource.fsName + "\n" +
        "Exists: " + rootSource.exists
    );

    if (!rootSource.exists) {

        logStep("UpdatePackage is missing XAVToolbox_Assets. Asset folders skipped.");

    } else {

        var helperSource = new Folder(rootSource.fsName + "/HelperScripts");

        if (helperSource.exists) {
            setProgress("Updating HelperScripts...", 82);
            copyFolderContentsOverwrite(helperSource, helperTarget, true);
            writeUpdatedFile(helperTarget);
            logStep("HelperScripts update complete.");
        } else {
            logStep("HelperScripts folder missing in update package.");
        }

        var resourcesSource = new Folder(rootSource.fsName + "/ImageResources");

        if (resourcesSource.exists) {
            setProgress("Updating ImageResources...", 90);
            copyFolderContentsOverwrite(resourcesSource, resourcesTarget, true);
            writeUpdatedFile(resourcesTarget);
            logStep("ImageResources update complete.");
        } else {
            logStep("ImageResources folder missing in update package.");
        }
    }

    // -------------------------------------------------------
    // 8. Cleanup
    // -------------------------------------------------------
    setProgress("Cleaning temporary files...", 96);

    deleteFolderRecursive(tempExtract);

    setProgress("Update completed successfully.", 100);
    logStep("XAV Toolbox update completed successfully.");

    finishProgress("Update completed successfully.");
}

//////////////////////////////////////////////////////////////////////
// PROGRESS WINDOW
//////////////////////////////////////////////////////////////////////

function createProgressWindow() {

    PROGRESS_WIN = new Window("palette", "XAV Toolbox Updater");
    PROGRESS_WIN.orientation = "column";
    PROGRESS_WIN.alignChildren = ["fill", "top"];
    PROGRESS_WIN.spacing = 10;
    PROGRESS_WIN.margins = 15;

    PROGRESS_TEXT = PROGRESS_WIN.add("statictext", undefined, "Preparing updater...");
    PROGRESS_TEXT.preferredSize = [420, 24];

    PROGRESS_BAR = PROGRESS_WIN.add("progressbar", undefined, 0, 100);
    PROGRESS_BAR.preferredSize = [420, 18];

    PROGRESS_CLOSE_BTN = PROGRESS_WIN.add("button", undefined, "Close");
    PROGRESS_CLOSE_BTN.enabled = false;

    PROGRESS_CLOSE_BTN.onClick = function () {
        PROGRESS_WIN.close();
    };

    PROGRESS_WIN.center();
    PROGRESS_WIN.show();
    PROGRESS_WIN.update();
}

function setProgress(message, value) {

    logStep("Progress " + value + "%: " + message);

    if (!PROGRESS_WIN) {
        return;
    }

    if (PROGRESS_TEXT) {
        PROGRESS_TEXT.text = message;
    }

    if (PROGRESS_BAR) {
        PROGRESS_BAR.value = value;
    }

    PROGRESS_WIN.update();
}

function finishProgress(message) {

    if (!PROGRESS_WIN) {
        return;
    }

    if (PROGRESS_TEXT) {
        PROGRESS_TEXT.text = message;
    }

    if (PROGRESS_BAR) {
        PROGRESS_BAR.value = 100;
    }

    if (PROGRESS_CLOSE_BTN) {
        PROGRESS_CLOSE_BTN.enabled = true;
    }

    PROGRESS_WIN.update();
}

function failUpdate(message) {

    logStep("FAILED: " + message);

    if (PROGRESS_WIN) {

        if (PROGRESS_TEXT) {
            PROGRESS_TEXT.text = "Update failed. See debug log.";
        }

        if (PROGRESS_CLOSE_BTN) {
            PROGRESS_CLOSE_BTN.enabled = true;
        }

        PROGRESS_WIN.update();
    }
}

//////////////////////////////////////////////////////////////////////
// DEBUG LOG FUNCTIONS
//////////////////////////////////////////////////////////////////////

function initDebugLog() {

    var thisScript = new File($.fileName);
    var scriptFolder = thisScript.parent;

    DEBUG_LOG_FILE = new File(scriptFolder.fsName + "/XAVToolbox_Update_DebugLog.txt");

    if (DEBUG_LOG_FILE.open("w")) {
        DEBUG_LOG_FILE.writeln("XAV Toolbox Update Debug Log");
        DEBUG_LOG_FILE.writeln("Started: " + String(new Date()));
        DEBUG_LOG_FILE.writeln("Script: " + thisScript.fsName);
        DEBUG_LOG_FILE.writeln("--------------------------------------------------");
        DEBUG_LOG_FILE.close();
    }
}

function logStep(message) {

    if (!DEBUG_LOG_FILE) {
        return;
    }

    if (DEBUG_LOG_FILE.open("a")) {
        DEBUG_LOG_FILE.writeln("");
        DEBUG_LOG_FILE.writeln("[" + String(new Date()) + "]");
        DEBUG_LOG_FILE.writeln(String(message));
        DEBUG_LOG_FILE.close();
    }
}

//////////////////////////////////////////////////////////////////////
// UPDATE PACKAGE DETECTION
//////////////////////////////////////////////////////////////////////

function getLatestUpgradePackage(updatePackagesFolder) {

    if (!updatePackagesFolder.exists) {
        logStep("Update_Packages folder does not exist: " + updatePackagesFolder.fsName);
        return null;
    }

    var files = updatePackagesFolder.getFiles();
    var latestFile = null;
    var latestVersion = -1;
    var i;

    for (i = 0; i < files.length; i++) {

        if (!(files[i] instanceof File)) {
            continue;
        }

        if (!isValidUpgradePackageName(files[i].name)) {
            continue;
        }

        var versionNumber = getUpgradePackageVersion(files[i].name);

        logStep(
            "Found upgrade package:\n" +
            files[i].fsName + "\n" +
            "Version: " + versionNumber
        );

        if (versionNumber > latestVersion) {
            latestVersion = versionNumber;
            latestFile = files[i];
        }
    }

    if (latestFile) {
        logStep(
            "Latest upgrade package selected:\n" +
            latestFile.fsName + "\n" +
            "Version: " + latestVersion
        );
    }

    return latestFile;
}

function isValidUpgradePackageName(fileName) {

    var s = String(fileName);

    if (s.indexOf("UpgradePackage_v") !== 0) {
        return false;
    }

    if (s.length < 21) {
        return false;
    }

    if (s.substring(s.length - 4).toLowerCase() !== ".zip") {
        return false;
    }

    var versionText = getUpgradePackageVersionText(s);

    if (versionText === "") {
        return false;
    }

    return true;
}

function getUpgradePackageVersion(fileName) {

    var versionText = getUpgradePackageVersionText(fileName);

    if (versionText === "") {
        return -1;
    }

    var n = parseInt(versionText, 10);

    if (isNaN(n)) {
        return -1;
    }

    return n;
}

function getUpgradePackageVersionText(fileName) {

    var s = String(fileName);

    var prefix = "UpgradePackage_v";
    var suffix = ".zip";

    if (s.indexOf(prefix) !== 0) {
        return "";
    }

    if (s.substring(s.length - suffix.length).toLowerCase() !== suffix) {
        return "";
    }

    var startIndex = prefix.length;
    var endIndex = s.length - suffix.length;

    var versionText = s.substring(startIndex, endIndex);

    if (versionText === "") {
        return "";
    }

    var i;

    for (i = 0; i < versionText.length; i++) {
        if (!isDigit(versionText.charAt(i))) {
            return "";
        }
    }

    return versionText;
}

//////////////////////////////////////////////////////////////////////
// ZIP EXTRACTION
//////////////////////////////////////////////////////////////////////

function extractZipPowerShell(zipFile, destFolder) {

    logStep("Extracting via PowerShell using temporary .ps1 file.");

    var tempRoot = Folder.temp;
    var stamp = getTimeStamp();

    var psFile = new File(tempRoot.fsName + "/XAV_ExtractZip_" + stamp + ".ps1");
    var psLogFile = new File(tempRoot.fsName + "/XAV_ExtractZip_Log_" + stamp + ".txt");

    var src = String(zipFile.fsName);
    var dst = String(destFolder.fsName);
    var logPath = String(psLogFile.fsName);

    if (!psFile.open("w")) {
        logStep("Could not create PowerShell script file: " + psFile.fsName);
        return false;
    }

    psFile.writeln("$ErrorActionPreference = 'Stop'");
    psFile.writeln("$src = '" + escapePowerShellPath(src) + "'");
    psFile.writeln("$dst = '" + escapePowerShellPath(dst) + "'");
    psFile.writeln("$log = '" + escapePowerShellPath(logPath) + "'");
    psFile.writeln("");
    psFile.writeln("function LogLine($msg) {");
    psFile.writeln("    Add-Content -LiteralPath $log -Value $msg");
    psFile.writeln("}");
    psFile.writeln("");
    psFile.writeln("try {");
    psFile.writeln("    LogLine 'PowerShell extraction started'");
    psFile.writeln("    LogLine ('SRC=' + $src)");
    psFile.writeln("    LogLine ('DST=' + $dst)");
    psFile.writeln("    LogLine ('ZIP_EXISTS=' + (Test-Path -LiteralPath $src))");
    psFile.writeln("    LogLine ('DST_EXISTS_BEFORE=' + (Test-Path -LiteralPath $dst))");
    psFile.writeln("");
    psFile.writeln("    if (!(Test-Path -LiteralPath $src)) {");
    psFile.writeln("        throw 'ZIP file does not exist.'");
    psFile.writeln("    }");
    psFile.writeln("");
    psFile.writeln("    if (!(Test-Path -LiteralPath $dst)) {");
    psFile.writeln("        New-Item -ItemType Directory -Path $dst | Out-Null");
    psFile.writeln("    }");
    psFile.writeln("");
    psFile.writeln("    Expand-Archive -LiteralPath $src -DestinationPath $dst -Force");
    psFile.writeln("");
    psFile.writeln("    LogLine ('DST_EXISTS_AFTER=' + (Test-Path -LiteralPath $dst))");
    psFile.writeln("    LogLine 'EXTRACTED_ITEMS:'");
    psFile.writeln("    Get-ChildItem -LiteralPath $dst -Force | ForEach-Object {");
    psFile.writeln("        LogLine $_.FullName");
    psFile.writeln("    }");
    psFile.writeln("");
    psFile.writeln("    LogLine 'PowerShell extraction completed'");
    psFile.writeln("    exit 0");
    psFile.writeln("}");
    psFile.writeln("catch {");
    psFile.writeln("    LogLine 'POWER_SHELL_ERROR:'");
    psFile.writeln("    LogLine $_.Exception.Message");
    psFile.writeln("    LogLine $_.ScriptStackTrace");
    psFile.writeln("    exit 1");
    psFile.writeln("}");

    psFile.close();

    logStep(
        "PowerShell script written:\n" +
        psFile.fsName + "\n" +
        "PowerShell log target:\n" +
        psLogFile.fsName
    );

    var cmd = "";
    cmd += 'cmd.exe /c ';
    cmd += '"';
    cmd += '"%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" ';
    cmd += '-NoProfile ';
    cmd += '-ExecutionPolicy Bypass ';
    cmd += '-File ';
    cmd += '"' + psFile.fsName + '"';
    cmd += '"';

    logStep("Executing PowerShell file command:\n" + cmd);

    var output = system.callSystem(cmd);

    logStep("system.callSystem output:\n" + output);

    if (psLogFile.exists) {
        var psLogText = readTextFile(psLogFile);
        logStep("PowerShell file log:\n" + psLogText);
    } else {
        logStep("PowerShell log file was not created: " + psLogFile.fsName);
    }

    var contents = destFolder.getFiles();

    logStep("Files detected after extraction: " + contents.length);

    if (psFile.exists) {
        psFile.remove();
    }

    if (psLogFile.exists) {
        psLogFile.remove();
    }

    if (contents.length > 0) {
        return true;
    }

    return false;
}

function escapePowerShellPath(pathText) {

    var s = String(pathText);
    var out = "";
    var i;
    var ch;

    for (i = 0; i < s.length; i++) {

        ch = s.charAt(i);

        if (ch === "'") {
            out += "''";
        } else {
            out += ch;
        }
    }

    return out;
}

//////////////////////////////////////////////////////////////////////
// FILE AND FOLDER HELPERS
//////////////////////////////////////////////////////////////////////

function findPackageRoot(tempExtract) {

    var directMain = new File(tempExtract.fsName + "/XAVToolbox.jsx");
    var directAssets = new Folder(tempExtract.fsName + "/XAVToolbox_Assets");

    if (directMain.exists || directAssets.exists) {
        return tempExtract;
    }

    var items = tempExtract.getFiles();
    var i;

    for (i = 0; i < items.length; i++) {

        if (items[i] instanceof Folder) {

            var testMain = new File(items[i].fsName + "/XAVToolbox.jsx");
            var testAssets = new Folder(items[i].fsName + "/XAVToolbox_Assets");

            if (testMain.exists || testAssets.exists) {
                return items[i];
            }
        }
    }

    return null;
}

function copyFolderContentsOverwrite(srcFolder, destFolder, verbose) {

    if (!destFolder.exists) {
        destFolder.create();
    }

    var items = srcFolder.getFiles();
    var i;

    for (i = 0; i < items.length; i++) {

        var item = items[i];
        var destPath = destFolder.fsName + "/" + item.name;

        if (item instanceof Folder) {

            var childDestFolder = new Folder(destPath);
            copyFolderContentsOverwrite(item, childDestFolder, verbose);

        } else {

            var destFile = new File(destPath);

            if (!copyFileOverwrite(item, destFile)) {

                if (verbose) {
                    logStep(
                        "Failed to copy file:\n" +
                        "Source: " + item.fsName + "\n" +
                        "Destination: " + destFile.fsName
                    );
                }
            }
        }
    }
}

function copyFileOverwrite(srcFile, destFile) {

    if (!srcFile.exists) {
        logStep("Source file does not exist: " + srcFile.fsName);
        return false;
    }

    var parentFolder = destFile.parent;

    if (!parentFolder.exists) {
        parentFolder.create();
    }

    if (destFile.exists) {
        var removed = destFile.remove();

        if (!removed && destFile.exists) {
            logStep("Could not remove existing destination file: " + destFile.fsName);
            return false;
        }
    }

    var copied = srcFile.copy(destFile.fsName);

    if (!copied) {
        logStep(
            "Copy failed:\n" +
            "Source: " + srcFile.fsName + "\n" +
            "Destination: " + destFile.fsName
        );
    }

    return copied;
}

function writeUpdatedFile(folder) {

    if (!folder.exists) {
        folder.create();
    }

    var f = new File(folder.fsName + "/updated.txt");

    if (f.open("w")) {
        f.write("Updated: " + String(new Date()));
        f.close();
    } else {
        logStep("Failed to write updated.txt: " + f.fsName);
    }
}

function deleteFolderRecursive(folder) {

    if (!folder) {
        return;
    }

    if (!folder.exists) {
        return;
    }

    var items = folder.getFiles();
    var i;

    for (i = 0; i < items.length; i++) {

        if (items[i] instanceof Folder) {

            deleteFolderRecursive(items[i]);

        } else {

            items[i].remove();
        }
    }

    folder.remove();
}

function readTextFile(fileObj) {

    if (!fileObj) {
        return "";
    }

    if (!fileObj.exists) {
        return "";
    }

    if (!fileObj.open("r")) {
        return "";
    }

    var txt = fileObj.read();
    fileObj.close();

    return txt;
}

//////////////////////////////////////////////////////////////////////
// VERSION HELPERS
//////////////////////////////////////////////////////////////////////

function getVersionFromScript(fileObj) {

    if (!fileObj) {
        return "0.0.0";
    }

    if (!fileObj.exists) {
        return "0.0.0";
    }

    if (!fileObj.open("r")) {
        logStep("Could not open file for version read: " + fileObj.fsName);
        return "0.0.0";
    }

    var contents = fileObj.read();
    fileObj.close();

    return findVersionInText(contents);
}

function findVersionInText(contents) {

    var lines = String(contents).split("\n");
    var i;

    for (i = 0; i < lines.length; i++) {

        var line = lines[i];

        if (
            line.indexOf("version") >= 0 ||
            line.indexOf("VERSION") >= 0 ||
            line.indexOf("@version") >= 0
        ) {

            var version = extractFirstVersionNumber(line);

            if (version !== "") {
                return version;
            }
        }
    }

    return "0.0.0";
}

function extractFirstVersionNumber(line) {

    var s = String(line);
    var started = false;
    var out = "";
    var i;
    var ch;

    for (i = 0; i < s.length; i++) {

        ch = s.charAt(i);

        if (isDigit(ch)) {
            started = true;
            out += ch;
        } else if (started && ch === ".") {
            out += ch;
        } else if (started) {
            break;
        }
    }

    if (out === "") {
        return "";
    }

    if (out.charAt(out.length - 1) === ".") {
        out = out.substring(0, out.length - 1);
    }

    return out;
}

function isDigit(ch) {

    if (ch === "0") return true;
    if (ch === "1") return true;
    if (ch === "2") return true;
    if (ch === "3") return true;
    if (ch === "4") return true;
    if (ch === "5") return true;
    if (ch === "6") return true;
    if (ch === "7") return true;
    if (ch === "8") return true;
    if (ch === "9") return true;

    return false;
}

function compareVersions(v1, v2) {

    var a = String(v1).split(".");
    var b = String(v2).split(".");

    var len = a.length;

    if (b.length > len) {
        len = b.length;
    }

    var i;

    for (i = 0; i < len; i++) {

        var n1 = 0;
        var n2 = 0;

        if (i < a.length) {
            n1 = parseInt(a[i], 10);

            if (isNaN(n1)) {
                n1 = 0;
            }
        }

        if (i < b.length) {
            n2 = parseInt(b[i], 10);

            if (isNaN(n2)) {
                n2 = 0;
            }
        }

        if (n1 > n2) {
            return 1;
        }

        if (n1 < n2) {
            return -1;
        }
    }

    return 0;
}

//////////////////////////////////////////////////////////////////////
// DATE HELPERS
//////////////////////////////////////////////////////////////////////

function getTimeStamp() {

    var d = new Date();

    return (
        String(d.getFullYear()) +
        pad2(d.getMonth() + 1) +
        pad2(d.getDate()) +
        "_" +
        pad2(d.getHours()) +
        pad2(d.getMinutes()) +
        pad2(d.getSeconds())
    );
}

function pad2(n) {

    n = parseInt(n, 10);

    if (n < 10) {
        return "0" + String(n);
    }

    return String(n);
}
