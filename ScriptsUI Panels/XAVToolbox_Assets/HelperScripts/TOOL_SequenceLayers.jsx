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
