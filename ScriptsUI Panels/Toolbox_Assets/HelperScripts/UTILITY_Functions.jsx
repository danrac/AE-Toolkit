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

function copyFileToPath(sourcePath, destPath) {
    var srcFile = new File(sourcePath);
    if (!srcFile.exists) {
        // If source doesn’t exist, bail out with false
        return false;
    }

    var destFile = new File(destPath);
    // If a file already exists at destPath, return null
    if (destFile.exists) {
        return null;
    }

    // Ensure the destination folder exists (create it if needed)
    var destFolder = destFile.parent;
    if (!destFolder.exists) {
        destFolder.create(); // creates parent folders as needed
    }

    // Try to copy; “true” on success, “false” on failure
    var success = srcFile.copy(destFile);
    if (!success) {
        alert(
            "Failed to copy:\n" +
            sourcePath +
            "\nto:\n" +
            destPath
        );
    }
    return success;
}

////CREATE FOLDER IF FOLDER DOES NOT EXIST///////

    function getFolderByName(folderName) {
        var myProject = app.project;
        for (var i = 1; i <= myProject.numItems; i++) {
            if ((myProject.item(i) instanceof FolderItem) && (myProject.item(i).name == folderName)) {
                return myProject.item(i);
            }
        }
        myFolder = myProject.items.addFolder(folderName);
        return myFolder;
    }

    function removeFolderByName(folderName) {
        var myProject = app.project;
        for (var i = 1; i <= myProject.numItems; i++) {
            if ((myProject.item(i) instanceof FolderItem) && (myProject.item(i).name == folderName)) {
                myProject.item(i).remove();
            }
        }
    }

/////WRITE FILE FUNCTION - RETURNS TXT FILE OBJECT///////

    function writeFile(fileObj, fileContent, encoding) {
        encoding = encoding || "utf-8";
        fileObj = (fileObj instanceof File) ? fileObj : new File(fileObj);
        var parentFolder = fileObj.parent;
        if (!parentFolder.exists && !parentFolder.create())
            throw new Error("Cannot create file in path " + fileObj.fsName);
        fileObj.encoding = encoding;
        fileObj.open("w");
        fileObj.write(fileContent);
        fileObj.close();
        return fileObj;
    }

    function moveToFolder(itemtomove, thisfolder){
        var itemMatchArr = new Array();
        for (var i = 1; i < app.project.numItems; i++){
            var itemName = app.project.item(i).name;
            var itemobject = app.project.item(i);
            if(itemName == itemtomove){
                itemMatchArr.push(itemobject);
            }
        }  
        if(itemMatchArr.length > 0){
            var inputFolder = getFolderByName(thisfolder);
            for (var i = 0; i <= itemMatchArr.length; i++){
                itemMatchArr[i].parentFolder = inputFolder;
            }
        }
    }

    function moveToRoot(itemtomove){
        var itemMatchArr = new Array();
        for (var i = 1; i < app.project.numItems; i++){
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
        for (var i = 1; i < app.project.numItems; i++){
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
        var itemArr = new Array();
        var preffilepath = scriptPath + "/Toolbox_Assets/SaveData/BUILD_ORGANIZE_PREFS.txt";
        // alert(preffilepath);
        var prefsFile = new File(preffilepath);
        if(prefsFile.exists){
            prefsFile.open();
            var content = prefsFile.read();
            prefsFile.close();
            itemArr = content.split('-');
        }
        return itemArr;
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
        var scriptPathStripArr = scriptPath.split('/');
        var tmpArr = new Array();
        var newCleanPath = "";
        for(x = 0; x <= scriptPathStripArr.length - 2; x++){
        	tmpArr.push(scriptPathStripArr[x]);
        }
        tmpArr.push('SaveData/');
        newCleanPath = tmpArr.join('/');
        var itemArr = new Array();
        var preffilepath = newCleanPath + "BUILD_ORGANIZE_PREFS.txt";
        var prefsFile = new File(preffilepath);
        if(prefsFile.exists){
            prefsFile.open();
            var content = prefsFile.read();
            prefsFile.close();
            itemArr = content.split('-');
        }
        return itemArr;
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