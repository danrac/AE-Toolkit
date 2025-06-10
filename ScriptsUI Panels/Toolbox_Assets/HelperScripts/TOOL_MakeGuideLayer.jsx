function MakeGuideLayer() {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length !== 1) {
        alert("Please select exactly one layer.");
        return;
    }

    var layer = selectedLayers[0];

    app.beginUndoGroup("Shrink and Move to Corner");

    // Set scale to 35%
    var scalePercent = 35;
    layer.property("Scale").setValue([scalePercent, scalePercent]);

    // Calculate position with 25px margin from top-left
    var rect = layer.sourceRectAtTime(comp.time, false);
    var scaleFactor = scalePercent / 100;

    var offsetX = 25 + (layer.anchorPoint.value[0] - rect.left) * scaleFactor;
    var offsetY = 25 + (layer.anchorPoint.value[1] - rect.top) * scaleFactor;
    layer.property("Position").setValue([offsetX, offsetY]);

    // Move layer to top of stack if not already
    if (layer.index !== 1) {
        layer.moveToBeginning();
    }

    // Set as guide layer
    layer.guideLayer = true;

    app.endUndoGroup();
}
