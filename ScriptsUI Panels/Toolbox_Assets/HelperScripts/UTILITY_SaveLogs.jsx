var tempscriptPath = $.fileName;
var tempscriptDir = tempscriptPath.substring(0, tempscriptPath.lastIndexOf("/"));
var parentDir = tempscriptDir.substring(0, tempscriptDir.lastIndexOf("/"));

function overwriteLog(logName, logInput, logType) {;
    var filenameSplit = logName.split('.');
    var newfilename = filenameSplit[0];
    var logname = parentDir + "/SaveData/" + newfilename + "_" + logType + ".txt";
    
    var logFile = new File(logname);
    
    if (!logFile.open("w")) {
        return false;
    }
    
    for (var i = 0; i < logInput.length; i++) {
        var line = String(logInput[i]);
        if (i < logInput.length - 2) {
            logFile.writeln(line);
        } else {
            logFile.write(line);
        }
    }

    logFile.close();
}

function overwriteClientLog(logName, logInput, logType) {;
    var filenameSplit = logName.split('.');
    var newfilename = filenameSplit[0];
    var logname = parentDir + "/SaveData/" + newfilename + "_" + logType + ".txt";
    
    var logFile = new File(logname);
    
    if (!logFile.open("w")) {
        return false;
    }
    
    for (var i = 0; i < logInput.length; i++) {
        var line = String(logInput[i]);
        if (i < logInput.length - 1) {
            logFile.writeln(line);
        } else {
            logFile.write(line);
        }
    }

    logFile.close();
}

function appendLog(logName, logInput, logType) {
    var filenameSplit = logName.split('.');
    var newfilename = filenameSplit[0];
    var logname = parentDir + "/SaveData/" + newfilename + "_" + logType + ".txt";
    var logFile = new File(logname);
    if (!logFile.exists) {
        writeFile(logFile, logInput);
    }
    else {
        logFile.open();
        var newInput = logFile.read();
        logFile.close();
        writeFile(logFile, newInput + "\n" + logInput);
    }
}

function appenddelimitLog(logName, logInput, delimiter, logType) {
    var filenameSplit = logName.split('.');
    var newfilename = filenameSplit[0];
    var logname = parentDir + "/SaveData/" + newfilename + "_" + logType + ".txt";
    var logFile = new File(logname);
    if (!logFile.exists) {
        writeFile(logFile, logInput);
    }
    else {
        logFile.open();
        var newInput = logFile.read();
        logFile.close();
        if(newInput != ""){
            writeFile(logFile, newInput + delimiter + logInput);
        } else {
            writeFile(logFile, logInput);
        }
    }
}

function appendLogNoDups(logName, logInput, logType) {
    // 1. Build the filename for the log:
    var filenameSplit = logName.split(".");
    var baseName = filenameSplit[0];
    var outPath = parentDir + "/SaveData/" + baseName + "_" + logType + ".txt";
    var logFile = new File(outPath);

    // 2. Read existing contents (if any), and collect them into an array “items”:
    var items = [];
    if (logFile.exists) {
        if (logFile.open("r")) {
            var existingText = logFile.read();
            logFile.close();

            if (existingText) {
                // Split on commas (no line breaks should be present, but just in case)
                var rawParts = existingText.split(",");
                for (var i = 0; i < rawParts.length; i++) {
                    var it = rawParts[i].replace(/^\s+|\s+$/g, ""); // trim whitespace
                    if (it !== "") {
                        // Avoid pushing duplicates in this initial pass
                        if (items.indexOf(it) === -1) {
                            items.push(it);
                        }
                    }
                }
            }
        }
    }

    // 3. Normalize the incoming logInput so we can split it into discrete “new items”:
    //    - Replace any CR characters, then turn all newline blocks into commas.
    //    - That way, whether the user passed “A,B,C” or “A\nB\nC”, we handle both.
    var normalized = logInput.replace(/\r/g, "")
                             .replace(/\n+/g, ",");
    var newParts   = normalized.split(",");

    for (var j = 0; j < newParts.length; j++) {
        var candidate = newParts[j].replace(/^\s+|\s+$/g, "");
        if (candidate !== "" && items.indexOf(candidate) === -1) {
            items.push(candidate);
        }
    }

    // 4. Now “items” holds a deduplicated array of all log entries.  Join them with commas:
    var finalContents = items.join(",");

    // 5. Ensure the parent folder exists before writing:
    var parentFolder = logFile.parent;
    if (!parentFolder.exists) {
        parentFolder.create(); // recursive folder creation
    }

    // 6. Overwrite the file with a single line of comma-separated items:
    if (logFile.open("w")) {
        logFile.write(finalContents);
        logFile.close();
    } else {
        alert("Unable to open log file for writing:\n" + outPath);
    }
}


function createLog(logName, logInput, logType) {
    var logname = parentDir + "/SaveData/" + logName + "_" + logType + ".txt";
    var logFile = new File(logname);

    if (!logFile.exists) {
        logInput = "_________" + "\n";
        writeFile(logFile, logInput);
        // alert("Log saved to: " + logFile.fsName);
    }
    else {
        logFile.open();
        var newInput = logFile.read();
        logFile.close();
        return newInput;
    }
}


function createClientLog(logName, logInput, logType) {
    var logname = parentDir + "/SaveData/" + logName + "_" + logType + ".txt";
    var logFile = new File(logname);

    if (!logFile.exists) {
        logInput = "Select a template...";
        writeFile(logFile, logInput);
        // alert("Log saved to: " + logFile.fsName);
    }
    else {
        logFile.open();
        var newInput = logFile.read();
        logFile.close();
        return newInput;
    }
}


function readLog(logName, logType) {
    var currentLog = "";
    var logname = parentDir + "/SaveData/" + logName + "_" + logType + ".txt";
    var logFile = new File(logname);
    if (!logFile.exists) {
        alert("There is no save data available for " + logName + "_" + logType + ".txt.");
    }
    else {
        logFile.open();
        var newInput = logFile.read();
        logFile.close();
        currentLog = newInput;
    }
    return currentLog;
}