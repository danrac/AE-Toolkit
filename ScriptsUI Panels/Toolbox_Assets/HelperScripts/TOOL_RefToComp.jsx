function RefToComp() {
    app.beginUndoGroup("Create Comp from Trimmed Item");

    var proj = app.project;
    var selectedItems = proj.selection;

    if (selectedItems.length !== 1 || !(selectedItems[0] instanceof FootageItem)) {
        alert("Please select a single footage item in the project panel.");
        return;
    }

    var footage = selectedItems[0];
    var frameRate = footage.frameRate || 24; // Default to 24 if frame rate is undefined
    var trimTime = 144 / frameRate; // Convert frames to time in seconds

    // Create a new comp using the trimmed footage
    var newComp = proj.items.addComp(footage.name + "_NoSlate", footage.width, footage.height, footage.pixelAspect, footage.duration - trimTime, frameRate);

    newComp.openInViewer();
    newComp.selected = true;

    // Add the footage to the new comp
    var layer = newComp.layers.add(footage);
    footage.selected = false;
    layer.inPoint = trimTime;
    var currentTime = 0;
    layer.startTime = currentTime - layer.inPoint;

    app.endUndoGroup();
}

