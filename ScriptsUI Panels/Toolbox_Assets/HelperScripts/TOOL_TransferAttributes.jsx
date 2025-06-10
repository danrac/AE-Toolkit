// Function to paste attributes
function pasteAttributes(copyPos, copyScale, copyRot) {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("No active composition.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length < 2) {
        alert("Please select at least two layers.");
        return;
    }

    // The last selected layer is the source for attributes
    var sourceLayer = selectedLayers[selectedLayers.length - 1];

    app.beginUndoGroup("Paste Attributes");

    // Copy attributes from source layer to other selected layers
    for (var i = 0; i < selectedLayers.length - 1; i++) {
        var targetLayer = selectedLayers[i];

        if (copyPos) {
            overwriteProperty(targetLayer.property("Position"), sourceLayer.property("Position").value);
        }
        if (copyScale) {
            overwriteProperty(targetLayer.property("Scale"), sourceLayer.property("Scale").value);
        }
        if (copyRot) {
            overwriteProperty(targetLayer.property("Rotation"), sourceLayer.property("Rotation").value);
        }
    }

    app.endUndoGroup();
}

// Helper function to overwrite property
function overwriteProperty(targetProperty, newValue) {
    if (targetProperty.numKeys > 0) {
        for (var k = targetProperty.numKeys; k >= 1; k--) {
            targetProperty.removeKey(k);
        }
    }
    targetProperty.setValue(newValue);
}
