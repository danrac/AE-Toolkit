var tempscriptPath = $.fileName;
var tempscriptDir = tempscriptPath.substring(0, tempscriptPath.lastIndexOf("/"));
var parentDir = tempscriptDir.substring(0, tempscriptDir.lastIndexOf("/"));

function appendLog(logName, logInput, logType) {
    var filenameSplit = logName.split('.');
    var newfilename = filenameSplit[0];
    var logname = parentDir + "/SaveData/" + newfilename + "_" + logType + ".txt";
    var logFile = new File(logname);

    if (!logFile.exists) {
        writeFile(logFile, logInput);
        // alert("Log saved to: " + logFile.fsName);
    }
    else {
        logFile.open();
        var newInput = logFile.read();
        logFile.close();

        writeFile(logFile, newInput + "\n" + logInput);
        // alert("Log saved to: " + logFile.fsName);
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