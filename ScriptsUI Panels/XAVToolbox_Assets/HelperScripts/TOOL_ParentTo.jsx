function ParentTo() {
	// Check if there's an active composition
	if (app.project.activeItem && app.project.activeItem instanceof CompItem) {
	    var comp = app.project.activeItem;
	    var selectedLayers = comp.selectedLayers;

	    // Check if there are multiple layers selected
	    if (selectedLayers.length > 1) {
	        var parentLayer = selectedLayers[selectedLayers.length - 1]; // Last selected layer

	        app.beginUndoGroup("Parent to Last Selected Layer");

	        // Loop through the selected layers (excluding the last one)
	        for (var i = 0; i < selectedLayers.length - 1; i++) {
	            var layer = selectedLayers[i];
	            layer.parent = parentLayer;
	        }

	        app.endUndoGroup();
	    } else {
	        alert("Please select multiple layers.");
	    }
	} else {
	    alert("Please select a composition.");
	}
}

function Unparent() {
    var activeComp = app.project.activeItem;
    if (!activeComp || !(activeComp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    var selectedLayers = activeComp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("Please select one or more layers.");
        return;
    }

    app.beginUndoGroup("Unparent Selected Layers");

    for (var i = 0; i < selectedLayers.length; i++) {
        selectedLayers[i].parent = null;
    }

    app.endUndoGroup();
}
