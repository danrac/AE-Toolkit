// Get the current script file and its parent folder.
var scriptFile = new File($.fileName);
var scriptPath = scriptFile.parent.fsName;

/*
  splitFootageByShotCuts.jsx

  This script:
  - Retrieves the currently selected footage layer.
  - Gets the source file's path.
  - Constructs the path to your Python analysis script (assumed in a "Python" subfolder).
  - Launches the Python script using an osascript command similar to your working snippet.
  - Waits for the output JSON file ("cut_data.json") to appear.
  - Loads the JSON data.
  - Splits the footage layer in the active comp at each detected cut time.
  - Deletes the JSON file after processing.
*/

/**
 * Searches all layers in the comp for a layer that uses the same footage (source)
 * and whose inPoint and outPoint enclose the given absolute time.
 *
 * @param {FootageItem} footageItem - The footage item (source) of the originally selected layer.
 * @param {Number} absoluteTime - The absolute time (in seconds) at which to split.
 * @param {CompItem} comp - The active composition.
 * @return {Layer} The found layer that spans the specified time, or null if none is found.
 */
function findLayerForCut(footageItem, absoluteTime, comp) {
    for (var i = 1; i <= comp.numLayers; i++) {
        var lyr = comp.layer(i);
        if (lyr.source && lyr.source === footageItem) {
            if (lyr.inPoint <= absoluteTime && lyr.outPoint > absoluteTime) {
                return lyr;
            }
        }
    }
    return null;
}

function runSplitByShotCuts() {
    // Check that a composition is active.
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please open a composition.");
        return;
    }
    
    // Verify that at least one layer is selected.
    if (comp.selectedLayers.length === 0) {
        alert("Please select a footage layer.");
        return;
    }
    
    // Get the first selected layer.
    var layer = comp.selectedLayers[0];
    
    // Ensure it is a footage item.
    if (!(layer.source instanceof FootageItem)) {
        alert("Selected layer is not a valid footage item.");
        return;
    }
    
    // Get the full file path of the footage item.
    var footageItem = layer.source;
    var filePath = footageItem.file.fsName;
    
    // Construct the path to your Python analysis script.
    // The Python script is assumed to be in a subfolder "Python" inside the current jsx folder.
    var pyscriptpath = scriptPath + "/Python/analysis_script.py";
    
    // Define the full path to your Python interpreter.
    // Adjust this path as needed (as in your working snippet).
    var pythonPath = "/Users/danracusin/miniconda3/bin/python";
    
    // Assemble the osascript command to launch the Python script in the background.
    // This command passes the footage file path and a threshold value (e.g., 30.0) as arguments.
    var command = 'osascript -e \'do shell script "nohup ' + pythonPath +
        ' \\"' + pyscriptpath + '\\" \\"' + filePath + '\\" 30.0 >/dev/null 2>&1 &"\'';
    
    var result = system.callSystem(command);
    $.writeln("Python launch result: " + result);
    
    // Define the JSON file path where the Python script is expected to output the cut data.
    // The JSON file is named "cut_data.json" and should be created in the same folder as the footage file.
    var footageFolder = footageItem.file.path;
    var jsonFile = new File(footageFolder + "/cut_data.json");
    $.writeln("Expecting JSON file at: " + jsonFile.fsName);
    
    // Wait until the JSON file exists (up to a maximum wait time).
    var maxWait = 20000; // maximum wait time in milliseconds (20 seconds)
    var startTime = (new Date()).getTime();
    while (!jsonFile.exists && ((new Date()).getTime() - startTime) < maxWait) {
        // Pause for 500 ms.
        $.sleep(500);
    }
    
    if (!jsonFile.exists) {
        alert("Cut data file not found after waiting. Please check your Python analysis script.");
        return;
    }
    
    // Read and parse the JSON file.
    jsonFile.open("r");
    var jsonString = jsonFile.read();
    jsonFile.close();
    
    var cutData;
    try {
        cutData = JSON.parse(jsonString);
    } catch (e) {
        alert("Error parsing JSON: " + e.toString());
        return;
    }
    
    if (cutData.length === 0) {
        alert("No cuts detected in the video.");
        return;
    }
    
    // Build an array of cuts with absolute times.
    // Compute the absolute time for each cut by adding the layer's inPoint.
    // Skip any cut at time 0 (or near 0) since it represents the beginning.
    var cuts = [];
    for (var i = 0; i < cutData.length; i++) {
        if (Math.abs(cutData[i].time) < 0.01) continue; // ignore near 0
        cuts.push({ 
            absoluteTime: layer.inPoint + cutData[i].time,
            originalTime: cutData[i].time 
        });
    }
    
    if (cuts.length === 0) {
        alert("No valid cuts (other than the start) detected.");
        return;
    }
    
    // Sort the cuts in descending order (largest absoluteTime first)
    cuts.sort(function(a, b) {
        return b.absoluteTime - a.absoluteTime;
    });
    
    app.beginUndoGroup("Split Footage Layer by Shot Cuts");
    
    // Iterate over each cut time.
    // For each cut, search among all layers that share the same footage for one that spans the cut time,
    // then split that layer at the cut time.
    for (var i = 0; i < cuts.length; i++) {
        var cutTime = cuts[i].absoluteTime;
        var layerToSplit = findLayerForCut(footageItem, cutTime, comp);
        if (layerToSplit) {
            layerToSplit.splitLayer(cutTime);
            $.writeln("Layer split at: " + cutTime);
        } else {
            alert("No layer found covering time: " + cutTime);
        }
    }
    
    app.endUndoGroup();
    
    // Remove the JSON file now that processing is complete.
    if (jsonFile.exists) {
        if (jsonFile.remove()) {
            $.writeln("Successfully removed JSON file: " + jsonFile.fsName);
        } else {
            alert("Unable to remove JSON file: " + jsonFile.fsName);
        }
    }
    
}

// Run the splitting routine.
runSplitByShotCuts();
