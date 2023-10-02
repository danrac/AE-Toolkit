function SnapTo() {
    // Check if there's an active composition
    if (app.project.activeItem && app.project.activeItem instanceof CompItem) {
        var comp = app.project.activeItem;
        var selectedLayers = comp.selectedLayers;

        // Check if there are multiple layers selected
        if (selectedLayers.length > 1) {
            var targetPosition = selectedLayers[selectedLayers.length - 1].position.value; // Last selected layer

            app.beginUndoGroup("Center Layers");

            // Loop through the selected layers (excluding the last one)
            for (var i = 0; i < selectedLayers.length - 1; i++) {
                var layer = selectedLayers[i];
                var currentTime = comp.time;

                // If the layer being moved has position keyframes or not
                if (layer.position.numKeys > 0 || layer.position.isTimeVarying) {
                    // Set a new keyframe at the current time with the target position
                    layer.position.setValueAtTime(currentTime, targetPosition);
                } else {
                    // If the layer doesn't have keyframes, just set the position value
                    layer.position.setValue(targetPosition);
                }
            }

            app.endUndoGroup();
        } else {
            alert("Please select multiple layers.");
        }
    } else {
        alert("Please select a composition.");
    }
}