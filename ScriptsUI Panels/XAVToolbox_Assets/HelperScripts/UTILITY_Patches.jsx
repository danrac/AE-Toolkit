////PATCH FUNCTION /////////

function replaceFilePath(item, newPath) {
    if (item == null) {
        return;
    }
    var currentPath = item.file.fsName;
    var pathfix = decodeURI(newPath);
    if (currentPath === pathfix) {
        return;
    }
    item.replace(new File(pathfix));
}

function patchPaths(){
    var filesInProject = [];
    var filesToFixInProject = [];
    var filesToCheck = [];
    var fileList = new Folder(scriptPath + "/XAVToolbox_Assets/ImageResources").getFiles();
    
    for (var i = 0; i < fileList.length; i++) {
        filesToCheck.push(fileList[i]);
    }

    for (var i = 0; i <= filesToCheck.length - 1; i++) {
        var currentFile = filesToCheck[i];
        var fileToFix = [];
        var fileExists = false;
        var currFilename = "";
        for (var j = 1; j <= app.project.numItems; j++) {
            if (app.project.item(j).name === currentFile.name) {
                fileToFix = app.project.item(j);
                fileExists = true;
                break;
            }
        }
        if (fileExists) {
            filesInProject.push(currentFile);
            filesToFixInProject.push(fileToFix);
        }
    }

    for (var i = 0; i <= filesInProject.length - 1; i++) {
        replaceFilePath(filesToFixInProject[i], filesInProject[i]);
    }

    alert("Successfully patched!");
}