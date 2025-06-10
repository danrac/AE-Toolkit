// Function to create UI for sequencing layers with specified frame duration
function sequenceLayersUI() {
    // Create the UI window
    var win = new Window("palette", "Sequence Layers", undefined);
    win.orientation = "column";

    // Dropdown for frame duration selection
    var frameGroup = win.add("group", undefined);
    frameGroup.add("statictext", undefined, "Duration (frames):");
    var frameDropdown = frameGroup.add("dropdownlist", undefined, ["1", "2", "3", "4", "5", "6"]);
    frameDropdown.selection = 0; // Default selection to 1 frame

    // Checkbox for "Draw On" option
    var drawOnCheckbox = win.add("checkbox", undefined, "Draw On (Add Frames)");

    // Checkbox for "Reverse Order" option
    var reverseOrderCheckbox = win.add("checkbox", undefined, "Reverse Order");

    // Button to apply sequencing
    var applyButton = win.add("button", undefined, "Create Animation");
    applyButton.onClick = function() {
        var frameDuration = parseInt(frameDropdown.selection.text);
        var drawOn = drawOnCheckbox.value;
        var reverseOrder = reverseOrderCheckbox.value;

        // Choose the function based on "Draw On" checkbox
        if (drawOn) {
            drawOnSequence(frameDuration, reverseOrder);
        } else {
            sequenceLayers(frameDuration, reverseOrder);
        }
    };

    win.center();
    win.show();
}

// Function for the standard layer sequencing without draw-on effect
function sequenceLayers(frameDuration, reverseOrder) {
    var comp = app.project.activeItem;

    if (!(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    var numLayers = selectedLayers.length;

    if (numLayers < 1) {
        alert("Please select at least one layer.");
        return;
    }

    app.beginUndoGroup("Sequence Layers");

    // Convert frame duration to seconds
    var durationInSeconds = frameDuration / comp.frameRate;

    // Sort layers based on the reverse order option
    var layers = reverseOrder ? selectedLayers.slice().reverse() : selectedLayers;

    var currentTime = 0;
    for (var i = 0; i < numLayers; i++) {
        var layer = layers[i];
        layer.startTime = currentTime;
        layer.outPoint = currentTime + durationInSeconds;
        currentTime += durationInSeconds;
    }

    app.endUndoGroup();
}

// Function for the draw-on layer sequencing with cumulative frame addition
function drawOnSequence(frameDuration, reverseOrder) {
    var comp = app.project.activeItem;

    if (!(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    var numLayers = selectedLayers.length;

    if (numLayers < 1) {
        alert("Please select at least one layer.");
        return;
    }

    app.beginUndoGroup("Draw On Sequence Layers");

    // Convert frame duration to seconds
    var durationInSeconds = frameDuration / comp.frameRate;

    // Sort layers based on the reverse order option
    var layers = reverseOrder ? selectedLayers.slice().reverse() : selectedLayers;

    // Start all layers at time 0
    for (var i = 0; i < numLayers; i++) {
        layers[i].startTime = 0;
    }

    // Set cumulative duration by adding the frame duration to each layer’s end time
    var currentTime = 0;
    for (var i = 0; i < numLayers; i++) {
        var layer = layers[i];
        layer.outPoint = currentTime + durationInSeconds;
        currentTime += durationInSeconds;
    }

    app.endUndoGroup();
}

// Run the UI function
sequenceLayersUI();
