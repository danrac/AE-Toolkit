function arrangeLayersSequentially() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("Please select one or more layers.");
        return;
    }

    app.beginUndoGroup("Arrange Layers Sequentially from Start");

    // Sort the layers based on their in-point
    selectedLayers.sort(function(a, b) {
        return a.inPoint - b.inPoint;
    });

    var currentTime = 0; // Start from the beginning of the comp

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        var layerDuration = layer.outPoint - layer.inPoint;

        layer.startTime += currentTime - layer.inPoint; // Adjust the layer's start time
        currentTime += layerDuration;
    }

    app.endUndoGroup();
}


function reverseLayerOrder() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("No active composition.");
        return;
    }

    var selectedLayers = [];
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        if (layer.selected) {
            selectedLayers.push(layer);
        }
    }

    if (selectedLayers.length === 0) {
        alert("No layers selected.");
        return;
    }

    app.beginUndoGroup("Reverse Layer Order");

    // Get the index of the topmost and bottommost selected layers
    var topIndex = selectedLayers[0].index;
    var bottomIndex = selectedLayers[selectedLayers.length - 1].index;

    // Calculate the range and midpoint of the selection
    var range = bottomIndex - topIndex + 1;
    var midpoint = Math.floor(range / 2);

    // Swap the layers in the selection
    for (var i = 0; i < midpoint; i++) {
        selectedLayers[i].moveAfter(comp.layer(bottomIndex - i));
        selectedLayers[selectedLayers.length - 1 - i].moveBefore(comp.layer(topIndex + i));
    }

    app.endUndoGroup();
}

function getCurrentTimeMarker() {
    var comp = app.project.activeItem;
    
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    var currentTime = comp.time;
    return currentTime;
}

function sequenceLayers() {

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

    // Get the current time marker
    var currentTime = comp.time;

    for (var i = 0; i < numLayers; i++) {
        var layer = selectedLayers[i];
        // var timeOffset = layer.inPoint - layer.startTime;
        var duration = layer.outPoint - layer.inPoint; // Calculate the duration of the layer
        var timeOffset = (layer.inPoint - layer.startTime);
        // if(i <= 0){
            layer.startTime = currentTime - timeOffset;
        // } else {
            // layer.startTime = currentTime - timeOffset;
        // }
        currentTime += duration;
    }

    app.endUndoGroup();

}