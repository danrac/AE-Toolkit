var incrementsInput = 0;

// TOOL_stepAndRepeatUI.jsx

function buildStepAndRepeatUI(parentPanel) {
    var stepAndRepeatPanel = parentPanel.add("group", undefined, "");
    stepAndRepeatPanel.orientation = "column";
    stepAndRepeatPanel.alignment = ['center', 'bottom'];
    stepAndRepeatPanel.visible = false; // Initially hidden
    stepAndRepeatPanel.spacing = 0;
    // Container for square layout
    var buttonContainer = stepAndRepeatPanel.add("group", undefined);
    buttonContainer.orientation = "column";
    buttonContainer.alignChildren = ["center", "center"];
    buttonContainer.spacing = 0;

    var inputGroup = stepAndRepeatPanel.add("group", undefined, "");

    var incrementField = inputGroup.add("edittext", undefined, '');
    incrementField.size = [40, 25];
    incrementField.alignment = ['left', 'center'];

    var incCBGroup = inputGroup.add("group", undefined, "");
    incCBGroup.orientation = "column";
    incCBGroup.alignment = ["right", "center"];
    var IncCheckbox = incCBGroup.add("checkbox", undefined, "Offset");
    IncCheckbox.value = false;

    incrementField.text = 10;
    incrementField.enabled = false;
    incrementField.active = false;
    
    IncCheckbox.onClick = function(){
        if(IncCheckbox.value == false){
            incrementField.enabled = false;
            incrementField.active = false;
        } else {
            incrementField.enabled = true
            incrementField.active = true;
        }
    }
    
    var incrementsInput = parseFloat(incrementField.text);
    
    var buttonSize = [30, 30]; // Square button dimensions

    // Top row for diagonal Up-Left, Up, and Up-Right
    var topRow = buttonContainer.add("group", undefined);
    topRow.orientation = "row";

    var upLeftButton = topRow.add("button", undefined, "↖");
    upLeftButton.size = buttonSize;
    upLeftButton.onClick = function() { duplicateAndMove("up-left", parseFloat(incrementField.text), IncCheckbox.value); };

    var upButton = topRow.add("button", undefined, "↑");
    upButton.size = buttonSize;
    upButton.onClick = function() { duplicateAndMove("up", parseFloat(incrementField.text), IncCheckbox.value); };

    var upRightButton = topRow.add("button", undefined, "↗");
    upRightButton.size = buttonSize;
    upRightButton.onClick = function() { duplicateAndMove("up-right", parseFloat(incrementField.text), IncCheckbox.value); };

    // Middle row for Left, Duplicate, and Right buttons
    var middleRow = buttonContainer.add("group", undefined);
    middleRow.orientation = "row";

    var leftButton = middleRow.add("button", undefined, "←");
    leftButton.size = buttonSize;
    leftButton.onClick = function() { duplicateAndMove("left", parseFloat(incrementField.text), IncCheckbox.value); };

    var duplicateButton = middleRow.add("button", undefined, "Dup");
    duplicateButton.size = buttonSize;
    duplicateButton.onClick = function() { duplicateAndMove("duplicate", parseFloat(incrementField.text), IncCheckbox.value); };

    var rightButton = middleRow.add("button", undefined, "→");
    rightButton.size = buttonSize;
    rightButton.onClick = function() { duplicateAndMove("right", parseFloat(incrementField.text), IncCheckbox.value); };

    // Bottom row for diagonal Down-Left, Down, and Down-Right
    var bottomRow = buttonContainer.add("group", undefined);
    bottomRow.orientation = "row";

    var downLeftButton = bottomRow.add("button", undefined, "↙");
    downLeftButton.size = buttonSize;
    downLeftButton.onClick = function() { duplicateAndMove("down-left", parseFloat(incrementField.text), IncCheckbox.value); };

    var downButton = bottomRow.add("button", undefined, "↓");
    downButton.size = buttonSize;
    downButton.onClick = function() { duplicateAndMove("down", parseFloat(incrementField.text), IncCheckbox.value); };

    var downRightButton = bottomRow.add("button", undefined, "↘");
    downRightButton.size = buttonSize;
    downRightButton.onClick = function() { duplicateAndMove("down-right", parseFloat(incrementField.text), IncCheckbox.value); };

    return stepAndRepeatPanel;
}

// Function to duplicate and move the layer based on direction
function duplicateAndMove(direction, incrementsInput, offsetCheckbox) {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition and a layer.");
        return;
    }
    
    var selectedLayer = comp.selectedLayers[0];
    if (!selectedLayer) {
        alert("Please select a layer.");
        return;
    }
    
    app.beginUndoGroup("Duplicate and Move Layer");

    var offsetSizeX = 0;
    var offsetSizeY = 0;

    // Duplicate the layer
    var duplicateLayer = selectedLayer.duplicate();
    
    // Get layer width and height
    var layerWidth = selectedLayer.sourceRectAtTime(comp.time, false).width;
    var layerHeight = selectedLayer.sourceRectAtTime(comp.time, false).height;

    var complayerWidth = selectedLayer.scale.value[0];
    var complayerHeight = selectedLayer.scale.value[1];

    if(offsetCheckbox == false){
        if(selectedLayer instanceof ShapeLayer){
            offsetSizeX = layerWidth / 2;
            offsetSizeY = layerHeight / 2;
        } else {
            offsetSizeX = complayerWidth / 2;
            offsetSizeY = complayerHeight / 2;
        }
    } else {
        if(selectedLayer instanceof ShapeLayer){
            offsetSizeX = incrementsInput + (layerWidth / 2);
            offsetSizeY = incrementsInput + (layerHeight / 2);
        } else {
            offsetSizeX = incrementsInput + (complayerWidth / 2);
            offsetSizeY = incrementsInput + (complayerHeight / 2);
        }
    }

    // Move duplicated layer based on direction
    switch (direction) {
        case "up":
            duplicateLayer.position.setValue([
                selectedLayer.position.value[0],
                selectedLayer.position.value[1] - offsetSizeY
            ]);
            break;
        case "down":
            duplicateLayer.position.setValue([
                selectedLayer.position.value[0],
                selectedLayer.position.value[1] + offsetSizeY
            ]);
            break;
        case "left":
            duplicateLayer.position.setValue([
                selectedLayer.position.value[0] - offsetSizeX,
                selectedLayer.position.value[1]
            ]);
            break;
        case "right":
            duplicateLayer.position.setValue([
                selectedLayer.position.value[0] + offsetSizeX,
                selectedLayer.position.value[1]
            ]);
            break;
        case "up-left":
            duplicateLayer.position.setValue([
                selectedLayer.position.value[0] - offsetSizeX,
                selectedLayer.position.value[1] - offsetSizeY
            ]);
            break;
        case "up-right":
            duplicateLayer.position.setValue([
                selectedLayer.position.value[0] + offsetSizeX,
                selectedLayer.position.value[1] - offsetSizeY
            ]);
            break;
        case "down-left":
            duplicateLayer.position.setValue([
                selectedLayer.position.value[0] - offsetSizeX,
                selectedLayer.position.value[1] + offsetSizeY
            ]);
            break;
        case "down-right":
            duplicateLayer.position.setValue([
                selectedLayer.position.value[0] + offsetSizeX,
                selectedLayer.position.value[1] + offsetSizeY
            ]);
            break;
        case "duplicate":
            // No position change, just duplicate
            break;
    }

    // Select the duplicated layer
    selectedLayer.selected = false;
    duplicateLayer.selected = true;

    app.endUndoGroup();
}
