#include "UTILITY_BuildPrefs.jsx";
var scriptFile = new File($.fileName);
var scriptPath = scriptFile.parent.fsName;

function confirmRemoval(itemName) {
    var msg =
      "You are about to remove " + itemName + ".\n" +
      "Do you wish to proceed?";
    return confirm(msg);
}

function browseForFilePath(promptText, fileTypes) {
    promptText = promptText || "Select a file";

    // Build filterString with a for‐loop (instead of .map)
    var filterString = null;
    if (fileTypes && fileTypes.length) {
        var parts = [];
        for (var i = 0; i < fileTypes.length; i++) {
            var ext = fileTypes[i];
            // strip leading dot if necessary
            if (ext.charAt(0) === ".") {
                ext = ext.substr(1);
            }
            parts.push("*." + ext);
        }
        // join into "*.ext;*.ext;*.ext"
        filterString = parts.join(";");
    }

    // Open the dialog; pass null if filterString is still null
    var chosenFile = File.openDialog(promptText, filterString);
    if (chosenFile) {
        return chosenFile.fsName;
    }
    return "";
}

function presetFileNameFromPath(pathText) {
    var text = pathText === undefined || pathText === null ? "" : String(pathText);
    text = text.replace(/^\s+|\s+$/g, "");
    var slash = Math.max(text.lastIndexOf("/"), text.lastIndexOf("\\"));
    return slash === -1 ? text : text.substring(slash + 1);
}

function ensureFolderTree(folder) {
    if (folder.exists) return true;
    var parent = folder.parent;
    if (!parent || parent.fsName === folder.fsName) return false;
    if (!ensureFolderTree(parent)) return false;
    return folder.create() || folder.exists;
}

// Copies an asset once. An existing destination is already a valid installation.
function copyFileToPath(sourcePath, destPath) {
    copyFileToPath.lastError = "";
    var srcFile = new File(sourcePath);
    var destFile = new File(destPath);
    if (destFile.exists) return true;
    if (!srcFile.exists) {
        copyFileToPath.lastError = "Source file does not exist: " + sourcePath;
        return false;
    }
    if (!ensureFolderTree(destFile.parent)) {
        copyFileToPath.lastError = "Cannot create destination folder: " + destFile.parent.fsName;
        return false;
    }
    if (!srcFile.copy(destFile.fsName) || !destFile.exists) {
        copyFileToPath.lastError = "Failed to copy " + sourcePath + " to " + destPath;
        return false;
    }
    if (srcFile.length !== destFile.length) {
        copyFileToPath.lastError = "Copied file could not be verified: " + destPath;
        return false;
    }
    return true;
}

////CREATE FOLDER IF FOLDER DOES NOT EXIST///////

    function getFolderByName(folderName) {
        var myProject = app.project;
        for (var i = 1; i <= myProject.numItems; i++) {
            if ((myProject.item(i) instanceof FolderItem) && (myProject.item(i).name == folderName)) {
                return myProject.item(i);
            }
        }
        var myFolder = myProject.items.addFolder(folderName);
        return myFolder;
    }

    function removeFolderByName(folderName) {
        var matches = [];
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (!(item instanceof FolderItem) || item.name !== folderName) continue;
            var ancestor = item.parentFolder;
            var covered = false;
            while (ancestor && ancestor !== app.project.rootFolder) {
                if (ancestor.name === folderName) { covered = true; break; }
                ancestor = ancestor.parentFolder;
            }
            if (!covered) matches.push(item);
        }
        for (var i = 0; i < matches.length; i++) matches[i].remove();
    }

/////WRITE FILE FUNCTION - RETURNS TXT FILE OBJECT///////

    function writeFile(fileObj, fileContent, encoding) {
        encoding = encoding || "utf-8";
        fileObj = (fileObj instanceof File) ? fileObj : new File(fileObj);
        var parentFolder = fileObj.parent;
        if (!parentFolder.exists && !parentFolder.create())
            throw new Error("Cannot create file in path " + fileObj.fsName);
        fileObj.encoding = encoding;
        if (!fileObj.open("w")) throw new Error("Cannot open file for writing: " + fileObj.fsName);
        try {
            if (!fileObj.write(fileContent)) throw new Error("Cannot write file: " + fileObj.fsName);
        } finally { fileObj.close(); }
        return fileObj;
    }

    function moveToFolder(itemtomove, thisfolder){
        var itemMatchArr = new Array();
        for (var i = 1; i <= app.project.numItems; i++){
            var itemName = app.project.item(i).name;
            var itemobject = app.project.item(i);
            if(itemName == itemtomove){
                itemMatchArr.push(itemobject);
            }
        }
        if(itemMatchArr.length > 0){
            var inputFolder = getFolderByName(thisfolder);
            for (var i = 0; i < itemMatchArr.length; i++){
                var ancestor = inputFolder;
                var wouldCycle = false;
                while (ancestor && ancestor !== app.project.rootFolder) {
                    if (ancestor === itemMatchArr[i]) { wouldCycle = true; break; }
                    ancestor = ancestor.parentFolder;
                }
                if (!wouldCycle) itemMatchArr[i].parentFolder = inputFolder;
            }
        }
    }

    function moveToRoot(itemtomove){
        var itemMatchArr = new Array();
        for (var i = 1; i <= app.project.numItems; i++){
            var itemName = app.project.item(i).name;
            var itemobject = app.project.item(i);
            if(itemName == itemtomove){
                itemMatchArr.push(itemobject);
            }
        }
        if(itemMatchArr.length > 0){
            for (var i = 0; i <= itemMatchArr.length - 1; i++){
                itemMatchArr[i].parentFolder = app.project.rootFolder;
            }
        }
    }

    function getCompByName(compToFind){
        var itemMatchArr = new Array();
        for (var i = 1; i <= app.project.numItems; i++){
            var itemName = app.project.item(i).name;
            var itemobject = app.project.item(i);
            if(itemName == compToFind && itemobject instanceof CompItem){
                itemMatchArr.push(itemobject);
            }
        }
        if(itemMatchArr.length > 0){
            for (var i = 0; i <= itemMatchArr.length - 1; i++){
                itemMatchArr[i].selected = true;
            }
        }
    }

    function importFile(filenName){
        var itemMatchArr = new Array();
        var archiveFolder = getFolderByName("Archive");
        var fileNamePath = scriptPath + "/Toolbox_Assets/" + filenName;
        var filetoimport = new File(fileNamePath);
        var importedFile = app.project.importFile(new ImportOptions(filetoimport));
        importedFile.parentFolder = archiveFolder;
    }

    function parseBuildOptionsToArr(){
        return readBuildPreferences(scriptPath + "/Toolbox_Assets/SaveData/BUILD_ORGANIZE_PREFS.txt");
    }

    function parseFromTxtFile(path, delimiter){
        var itemArr = new Array();
        var prefsFile = new File(path);
        if(prefsFile.exists){
            prefsFile.open();
            var content = prefsFile.read();
            prefsFile.close();
            itemArr = content.split(delimiter);
        }
        return itemArr;
    }

    function parseBuildOptionsHelperScriptToArr(){
        return readBuildPreferences(new Folder(scriptPath).parent.fsName + "/SaveData/BUILD_ORGANIZE_PREFS.txt");
    }

    function deselectAll(){
        for (var x = 1; x <= app.project.numItems; x++){
            app.project.item(x).selected = false;
        }
    }

    function colorLabel(compNameStr, colorStr){
        for (var x = 1; x <= app.project.numItems; x++){
            if (app.project.item(x).name == compNameStr){
                app.project.item(x).label = colorStr;
            }
        }
    }

    function textJustification(inputString){
        if(inputString == "ParagraphJustification.LEFT_JUSTIFY"){
            return ParagraphJustification.LEFT_JUSTIFY;
        }
        if(inputString == "ParagraphJustification.RIGHT_JUSTIFY"){
            return ParagraphJustification.RIGHT_JUSTIFY;
        }
                if(inputString == "ParagraphJustification.CENTER_JUSTIFY"){
            return ParagraphJustification.CENTER_JUSTIFY;
        }
    }

    /////CHECK FOR DUPLICATE STRING FUNCTION - RETURNS ARRAY///////

    Array.prototype.unique = function () {
        var r = new Array();
        o: for (var i = 0, n = this.length; i < n; i++) {
            for (var x = 0, y = r.length; x < y; x++) {
                if (r[x] == this[i]) {
                    continue o;
                }
            }
            r[r.length] = this[i];
        }
        return r;
    }
