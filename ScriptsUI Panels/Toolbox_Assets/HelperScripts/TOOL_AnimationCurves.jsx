/* 
    Advanced Curve Preset Integration
    ==================================
    This script launches external command files to start the socket server, persistent client, and graph editor,
    then sends a command ("getpreset") via a FIFO and polls asynchronously for a response.
    It also provides a UI for refreshing/applying presets and automatically updates the preset dropdown list
    when new presets appear in the preset_data folder.
    
    Note: Ensure that the Python socket server, persistent client, and graph editor scripts are in the correct locations.
*/

// Polyfill for String.trim() for ExtendScript
if (typeof String.prototype.trim !== "function") {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
    };
}

// Define scriptPath as the folder containing this script.
var scriptFile = new File($.fileName);
var scriptPath = scriptFile.parent.fsName;

// FIFO paths (hard-coded to /tmp)
var cmdFIFOPath = "/tmp/ae_cmd";
var respFIFOPath = "/tmp/ae_resp";

// Global variables for asynchronous polling and UI
var globalResponseCallback = null;
var responseAttempts = 0;
var responseMaxAttempts = 10;  // total wait time ~10 seconds
var pollingDelay = 1000;       // polling interval in milliseconds

var refreshDD = false;

// Asynchronous polling function that reads the FIFO using System.callSystem("cat ...")
function pollResponse() {
    var response = system.callSystem("cat " + respFIFOPath);
    $.writeln("Poll attempt " + responseAttempts + " response: " + response);
    
    if (typeof response !== "string") {
        response = "";
    }
    var trimmedResponse = response.replace(/^\s+|\s+$/g, "");
    
    if (trimmedResponse !== "") {
        if (globalResponseCallback) {
            globalResponseCallback(response);
        }
    } else {
        responseAttempts++;
        if (responseAttempts < responseMaxAttempts) {
            var pollCommand = "$.global.pollResponse()";
            app.scheduleTask(pollCommand, pollingDelay, false);
        } else {
            if (globalResponseCallback) {
                globalResponseCallback("");
            }
        }
    }
}
$.global.pollResponse = pollResponse;

// Function to send a command asynchronously via FIFO.
function sendCommandToPythonAsync(commandText, callback) {
    globalResponseCallback = callback;
    responseAttempts = 0;
    
    var cmdFile = new File(cmdFIFOPath);
    if (!cmdFile.open("w")) {
        alert("Could not open command FIFO for writing: " + cmdFIFOPath);
        callback("");
        return;
    }
    cmdFile.write(commandText);
    cmdFile.close();
    
    var pollCommand = "$.global.pollResponse()";
    app.scheduleTask(pollCommand, pollingDelay, false);
}

// Example: Run Python generator command.
function runPythonGenerator() {
    sendCommandToPythonAsync("getpreset", function(result) {
        alert("Response from Python socket server:\n" + result);
        // Once we have the response, update the preset dropdown.
        autoRefreshPresetDropdown();
    });
}

// --- Preset File I/O Functions ---
function getPresetList() {
    var scriptFile = new File($.fileName);
    var scriptFolder = scriptFile.parent.fsName;
    var presetFolder = new Folder(scriptFolder + "/preset_data");
    if (!presetFolder.exists) { // exists is a property
        presetFolder.create();
    }
    var presets = [];
    var files = presetFolder.getFiles("*.json");
    for (var i = 0; i < files.length; i++) {
        presets.push(files[i].name);
    }
    return presets;
}

function loadPreset(fileName) {
    var scriptFile = new File($.fileName);
    var scriptFolder = scriptFile.parent.fsName;
    var file = new File(scriptFolder + "/preset_data/" + fileName);
    if (!file.exists) {
        alert("Preset file not found: " + fileName);
        return null;
    }
    file.open("r");
    var jsonString = file.read();
    file.close();
    var presetData;
    try {
        presetData = JSON.parse(jsonString);
    } catch (e) {
        alert("Error parsing JSON from " + fileName + ":\n" + e.toString());
        return null;
    }
    return presetData;
}

// --- Weight-Based Keyframe Application Function ---
// Now accepts a second parameter "dimension" ("X", "Y", or "Both").
// It applies keyframes only to the specified channel(s). If dimension is "Both",
// keyframes are applied to both the X and Y components.
function applyCurvePresetWithWeights(presetJSON, dimension) {
    // Parse the JSON data.
    alert(0);
    var presetData;
    try {
        presetData = JSON.parse(presetJSON);
    } catch (e) {
        alert("Failed to parse preset JSON: " + e.toString());
        return;
    }
    
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem) || comp.selectedLayers.length === 0) {
        alert("Please select a layer in an active composition.");
        return;
    }
    var layer = comp.selectedLayers[0];
    var posProp = layer.property("Position");
    alert(1);
    // Ensure the Position property is separated into dimensions.
    if (!posProp.canSetExpression) {
        alert("The selected property cannot have expressions or keyframes set.");
        return;
    }
    if (!posProp.property(1).isModified) {
        posProp.dimensionsSeparated = true;
    }
    alert(2);
    app.beginUndoGroup("Apply Curve Preset With Weights");
    
    // Remove existing keyframes from applicable channels.
    if (dimension.toLowerCase() === "X" || dimension.toLowerCase() === "Both") {
        for (var i = posProp.property(1).numKeys; i > 0; i--) {
            posProp.property(1).removeKey(i);
        }
    }
    if (dimension.toLowerCase() === "Y" || dimension.toLowerCase() === "Both") {
        for (var i = posProp.property(2).numKeys; i > 0; i--) {
            posProp.property(2).removeKey(i);
        }
    }
    
    // Loop through preset data and add keyframes.
    for (var i = 0; i < presetData.length; i++) {
        var keyTime = presetData[i].time;
        var keyValue = presetData[i].value;
        var keyWeight = presetData[i].weight;
        
        if (dimension.toLowerCase() === "X" || dimension.toLowerCase() === "bBth") {
            posProp.property(1).setValueAtTime(keyTime, keyValue);
        }
        if (dimension.toLowerCase() === "Y" || dimension.toLowerCase() === "Both") {
            posProp.property(2).setValueAtTime(keyTime, keyValue);
        }
        
        var easeIn = new KeyframeEase();
        var easeOut = new KeyframeEase();
        easeIn.influence = keyWeight;
        easeIn.speed = 0;
        easeOut.influence = keyWeight;
        easeOut.speed = 0;
        
        if (dimension.toLowerCase() === "X" || dimension.toLowerCase() === "Both") {
            var keyIndexX = posProp.property(1).numKeys;
            posProp.property(1).setTemporalEaseAtKey(keyIndexX, [easeIn], [easeOut]);
        }
        if (dimension.toLowerCase() === "Y" || dimension.toLowerCase() === "Both") {
            var keyIndexY = posProp.property(2).numKeys;
            posProp.property(2).setTemporalEaseAtKey(keyIndexY, [easeIn], [easeOut]);
        }
    }
    
    app.endUndoGroup();
    alert("Preset applied successfully to " + dimension + " channel(s)!");
}

// --- Standard Keyframe Application Function ---
function applyCurvePreset(presetData, dimension) {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem) || comp.selectedLayers.length === 0) {
        alert("Please select a layer in an active composition.");
        return;
    }
    var layer = comp.selectedLayers[0];
    var posProp = layer.property("Position");
    
    while (posProp.numKeys > 0) {
        posProp.removeKey(1);
    }
    
    app.beginUndoGroup("Apply Curve Preset (" + dimension + ")");
    if (dimension.toLowerCase() === "x") {
        for (var i = 0; i < presetData.length; i++) {
            var t = presetData[i].time;
            var val = presetData[i].value;
            var newVal = [posProp.value[0] + val, posProp.value[1]];
            posProp.setValueAtTime(t, newVal);
        }
    } else if (dimension.toLowerCase() === "y") {
        for (var i = 0; i < presetData.length; i++) {
            var t = presetData[i].time;
            var val = presetData[i].value;
            var newVal = [posProp.value[0], posProp.value[1] + val];
            posProp.setValueAtTime(t, newVal);
        }
    } else if (dimension.toLowerCase() === "both") {
        for (var i = 0; i < presetData.length; i++) {
            var t = presetData[i].time;
            var val = presetData[i].value;
            var newVal = [posProp.value[0] + val, posProp.value[1] + val];
            posProp.setValueAtTime(t, newVal);
        }
    }
    app.endUndoGroup();
    alert("Preset applied to the " + dimension.toUpperCase() + " channel successfully!");
}

// --- Auto-Refresh Preset Dropdown ---
function autoRefreshPresetDropdown() {
    if ($.global.presetDropdown) {
        var newList = getPresetList();
        var currentList = [];
        for (var i = 0; i < $.global.presetDropdown.items.length; i++) {
            currentList.push($.global.presetDropdown.items[i].text);
        }
        if (JSON.stringify(newList) !== JSON.stringify(currentList)) {
            $.global.presetDropdown.removeAll();
            for (var i = 0; i < newList.length; i++) {
                $.global.presetDropdown.add("item", newList[i]);
            }
            if ($.global.presetDropdown.items.length > 0) {
                $.global.presetDropdown.selection = 0;
            }
            alert("Preset dropdown refreshed automatically!");
        }
    } else {
        $.writeln("Global presetDropdown is not defined.");
    }
    // Optional continuous monitoring:
    // app.scheduleTask("autoRefreshPresetDropdown()", 5000, false);
}
$.global.autoRefreshPresetDropdown = autoRefreshPresetDropdown;

// --- Build the UI ---
function buildUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Advanced Curve Presets", undefined, {resizeable:true});
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    
    // Button to launch the graph editor.
    var graphBtn = win.add("button", undefined, "Launch Graph Editor");
    graphBtn.onClick = function() {
        var graphCmd = 'osascript -e \'do shell script "nohup /Users/danracusin/miniconda3/bin/python \\"' +
            scriptPath + '/Python/graph_editor.py\\" >/dev/null 2>&1 &"\'';
        var result = system.callSystem(graphCmd);
        $.writeln("Graph editor launch result: " + result);
        // Optionally, schedule a one-time auto-refresh after a delay.
        app.scheduleTask('$.global.autoRefreshPresetDropdown()', 5000, false);
    };
    
    // Dropdown for available presets.
    var ddGroup = win.add("group", undefined);
    ddGroup.orientation = "row";
    ddGroup.add("statictext", undefined, "Select Preset:");
    var presetDropdown = ddGroup.add("dropdownlist", undefined, getPresetList());
    $.global.presetDropdown = presetDropdown;
    if (presetDropdown.items.length > 0) {
        presetDropdown.selection = 0;
    }
    
    // Radio group for choosing which dimension(s) to apply.
    var dimGroup = win.add("group", undefined);
    dimGroup.orientation = "row";
    dimGroup.add("statictext", undefined, "Apply to:");
    var radioX = dimGroup.add("radiobutton", undefined, "X");
    var radioY = dimGroup.add("radiobutton", undefined, "Y");
    var radioBoth = dimGroup.add("radiobutton", undefined, "Both");
    radioBoth.value = true;
    
    // Button to apply the selected preset.
    var applyBtn = win.add("button", undefined, "Apply Selected Curve");
    
    function refreshddlist(){
        presetDropdown.removeAll();
        var presetList = getPresetList();
        for (var i = 0; i < presetList.length; i++) {
            presetDropdown.add("item", presetList[i]);
        }
        if (presetDropdown.items.length > 0) {
            presetDropdown.selection = 0;
        }
    }

    presetDropdown.onActivate = function(){
        var newList = getPresetList();
        if(newList.length != presetDropdown.length){
            refreshDD = true;
            refreshddlist();
        }
    };

    applyBtn.onClick = function () {
        if (presetDropdown.selection !== null) {
            var fileName = presetDropdown.selection.text;
            var presetData = loadPreset(fileName);
            if (presetData) {
                var dimension;
                if (radioX.value) {
                    dimension = "X";
                } else if (radioY.value) {
                    dimension = "Y";
                } else {
                    dimension = "Both";
                }
                // Call the weight-based keyframe function with the dimension parameter.
                applyCurvePresetWithWeights(JSON.stringify(presetData), dimension);
            }
        }
    };
    
    win.center();
    win.show();
}

// --- Main Execution ---
(function main(thisObj) {
    buildUI(thisObj);
})(this);
