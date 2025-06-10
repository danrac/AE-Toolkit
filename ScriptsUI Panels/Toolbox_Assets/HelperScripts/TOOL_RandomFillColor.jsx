function assignUniqueColors() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("No active composition.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("No layers selected.");
        return;
    }

    app.beginUndoGroup("Assign Unique Colors");

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        
        // Check if the layer is a solid
        if (layer instanceof AVLayer && layer.source.mainSource instanceof SolidSource) {
            // Add a Fill effect
            var fillEffect = layer.Effects.addProperty("ADBE Fill");

            // Generate a random color
            var randomColor = [Math.random(), Math.random(), Math.random()];
            fillEffect.property("Color").setValue(randomColor);
        }
    }

    app.endUndoGroup();
}

assignUniqueColors();
