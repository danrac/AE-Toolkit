(function () {
    var project = app.project;
    if (!project.file) {
        alert("Project not saved. Cannot determine project file path.");
        return;
    }

    var projectPath = project.file.fsName; // Full absolute path to the AEP file
    var logFolder = new Folder("~/Desktop/AE_Render_Logs");
    if (!logFolder.exists) {
        logFolder.create();
    }

    var logFile = new File(logFolder.fsName + "/render_log.txt");
    if (logFile.open("a")) {
        var date = new Date();
        logFile.writeln("Render completed: " + date.toString());
        logFile.writeln("Project: " + projectPath);
        logFile.writeln("---------------------------");
        logFile.close();
    } else {
        alert("Unable to write to log file.");
    }
})();
