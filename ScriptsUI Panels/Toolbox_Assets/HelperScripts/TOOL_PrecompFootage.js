function precompAndRename() {
    app.beginUndoGroup(scriptName);

    var comp = app.project.activeItem;

    if (!comp || !(comp instanceof CompItem)) {
        alert('Please select a composition.');
        return;
    }

    var selectedLayers = comp.selectedLayers;

    if (selectedLayers.length === 0) {
        alert('Please select at least one layer.');
        return;
    }

    var layer = selectedLayers[0];
    var layerIndex = layer.index;
    
    // Get layer source attributes for later use
    var layerWidth = layer.source.width;
    var layerHeight = layer.source.height;
    var layerFramerate = layer.containingComp.frameRate;

    var duplicateLayer = layer.duplicate();
    duplicateLayer.moveToEnd();
    
    var layerInPoint = layer.inPoint;
    var layerOutPoint = layer.outPoint;
    var layerStartTime = layer.startTime;

    var preComp = comp.layers.precompose([duplicateLayer.index], "FOOTAGE_Precomp_01", true);

    // Set the pre-comp attributes to match the selected layer
    preComp.width = layerWidth;
    preComp.height = layerHeight;
    preComp.frameRate = layerFramerate;
    preComp.duration = layerOutPoint - layerInPoint;

    // Move all layers in pre-comp to start at time zero
    for (var i = 1; i <= preComp.numLayers; i++) {
        var preCompLayer = preComp.layer(i);
        preCompLayer.startTime = -layerInPoint + preCompLayer.inPoint;
    }

    // Find the pre-comp in the original comp and set its start time
    var preCompLayerInOriginalComp = comp.selectedLayers[0];
    preCompLayerInOriginalComp.startTime = layerInPoint;
    preCompLayerInOriginalComp.outPoint = layerOutPoint; // Trim to original layer length

    // Move the pre-comp directly above the original layer in the layer stack
    if(layerIndex > 1) {
        preCompLayerInOriginalComp.moveAfter(comp.layer(layerIndex));
    }

    app.endUndoGroup();
}