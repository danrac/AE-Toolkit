// TOOL_setAnchorPointUI.jsx

function buildSetAnchorPointUI(parentPanel) {

    var setAnchorPointPanel = parentPanel.add("group", undefined, "");
    setAnchorPointPanel.orientation = "column";
    setAnchorPointPanel.alignment = ['center', 'top'];
    setAnchorPointPanel.visible = false; // Initially hidden
    setAnchorPointPanel.spacing = 0;

    // Container for square layout
    var buttonContainer = setAnchorPointPanel.add("group", undefined);
    buttonContainer.orientation = "column";
    buttonContainer.alignChildren = ["center", "center"];
    buttonContainer.spacing = 0;

    var selectionDDGroup = setAnchorPointPanel.add("group", undefined, "");

    var SelectionDD = selectionDDGroup.add("dropdownlist", undefined, []);
    SelectionDD.size = [50, 25];
    SelectionDD.alignment = ['left', 'center'];
    SelectionDD.add("item", "LAYER");
    SelectionDD.add("item", "COMP");
    SelectionDD.selection = 0;
    var layerTypeSelection = SelectionDD.selection.toString();
    
    SelectionDD.onChange = function(){
        layerTypeSelection = SelectionDD.selection.toString();
    }

    var CBGroup = selectionDDGroup.add("group", undefined, "");
    CBGroup.orientation = "column";
    CBGroup.alignment = ["right", "center"];
    var AbsoluteCheckbox = CBGroup.add("checkbox", undefined, "Abs.");
    AbsoluteCheckbox.value = false;

    var buttonSize = [30, 30]; // Square button dimensions

    // Top row for Top-left, Top-center, Top-right
    var topRow = buttonContainer.add("group", undefined);
    topRow.orientation = "row";

    var topLeftButton = topRow.add("button", undefined, "↖");
    topLeftButton.size = buttonSize;
    topLeftButton.onClick = function() { setAnchorPoint("top-left", AbsoluteCheckbox.value, layerTypeSelection); };

    var topCenterButton = topRow.add("button", undefined, "↑");
    topCenterButton.size = buttonSize;
    topCenterButton.onClick = function() { setAnchorPoint("top-center", AbsoluteCheckbox.value, layerTypeSelection); };

    var topRightButton = topRow.add("button", undefined, "↗");
    topRightButton.size = buttonSize;
    topRightButton.onClick = function() { setAnchorPoint("top-right", AbsoluteCheckbox.value, layerTypeSelection); };

    // Middle row for Left, Center, Right buttons
    var middleRow = buttonContainer.add("group", undefined);
    middleRow.orientation = "row";

    var leftButton = middleRow.add("button", undefined, "←");
    leftButton.size = buttonSize;
    leftButton.onClick = function() { setAnchorPoint("left", AbsoluteCheckbox.value, layerTypeSelection); };

    var centerButton = middleRow.add("button", undefined, "•");
    centerButton.size = buttonSize;
    centerButton.onClick = function() { setAnchorPoint("center", AbsoluteCheckbox.value, layerTypeSelection); };

    var rightButton = middleRow.add("button", undefined, "→");
    rightButton.size = buttonSize;
    rightButton.onClick = function() { setAnchorPoint("right", AbsoluteCheckbox.value, layerTypeSelection); };

    // Bottom row for Bottom-left, Bottom-center, Bottom-right
    var bottomRow = buttonContainer.add("group", undefined);
    bottomRow.orientation = "row";

    var bottomLeftButton = bottomRow.add("button", undefined, "↙");
    bottomLeftButton.size = buttonSize;
    bottomLeftButton.onClick = function() { setAnchorPoint("bottom-left", AbsoluteCheckbox.value, layerTypeSelection); };

    var bottomCenterButton = bottomRow.add("button", undefined, "↓");
    bottomCenterButton.size = buttonSize;
    bottomCenterButton.onClick = function() { setAnchorPoint("bottom-center", AbsoluteCheckbox.value, layerTypeSelection); };

    var bottomRightButton = bottomRow.add("button", undefined, "↘");
    bottomRightButton.size = buttonSize;
    bottomRightButton.onClick = function() { setAnchorPoint("bottom-right", AbsoluteCheckbox.value, layerTypeSelection); };

    return setAnchorPointPanel;

}

function setAnchorPoint(direction, type, layerType) {
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
    
    var oldAnchor = selectedLayer.anchorPoint.value;
    var oldPosition = selectedLayer.position.value;
    var oldScale = selectedLayer.scale.value;
    var layerScaleX = selectedLayer.scale.value[0];
    var layerScaleY = selectedLayer.scale.value[1];
    var newAnchor;

    var layerWidth = selectedLayer.sourceRectAtTime(comp.time, false).width;
    var layerHeight = selectedLayer.sourceRectAtTime(comp.time, false).height;
    var rect = selectedLayer.sourceRectAtTime(comp.time, false);

    var compWidth = comp.width;
    var compHeight = comp.height;
    var complayerWidth = selectedLayer.scale.value[0];
    var complayerHeight = selectedLayer.scale.value[1];
    var offsetSizeX = 0;
    var offsetSizeY = 0;

    if(selectedLayer instanceof ShapeLayer){
        offsetSizeX = layerWidth;
        offsetSizeY = layerHeight;
    } else {
        offsetSizeX = selectedLayer.scale.value[0];
        offsetSizeY = selectedLayer.scale.value[1];
    }

    if(layerType == "LAYER"){

        var currentAnchor = selectedLayer.anchorPoint.value;
        var newAnchor = [0, 0];

        if (type == false){

            switch (direction) {
                case "top-left":
                    newAnchor = [0, 0];
                    break;
                case "top-center":
                    newAnchor = [(offsetSizeX/2) * 0.5, 0];
                    break;
                case "top-right":
                    newAnchor = [(offsetSizeX/2), 0];
                    break;
                case "left":
                    newAnchor = [0, (offsetSizeY/2) * 0.5];
                    break;
                case "center":
                    newAnchor = [(offsetSizeX/2) * 0.5, (offsetSizeY/2) * 0.5];
                    break;
                case "right":
                    newAnchor = [(offsetSizeX/2), (offsetSizeY/2) * 0.5];
                    break;
                case "bottom-left":
                    newAnchor = [0, (offsetSizeY/2)];
                    break;
                case "bottom-center":
                    newAnchor = [(offsetSizeX/2) * 0.5, (offsetSizeY/2)];
                    break;
                case "bottom-right":
                    newAnchor = [(offsetSizeX/2), (offsetSizeY/2)];
                    break;
            }

            var currentPosition = selectedLayer.position.value;
            var newPosition = [];
            var anchorDifference = [];

            if(selectedLayer instanceof ShapeLayer){

                anchorDifference = [
                    newAnchor[0] - currentAnchor[0],
                    newAnchor[1] - currentAnchor[1]
                ];
                newPosition = [
                    currentPosition[0] - anchorDifference[0],
                    currentPosition[1] - anchorDifference[1]
                ];

            } else {

                anchorDifference = [
                    newAnchor[0] - currentAnchor[0],
                    newAnchor[1] - currentAnchor[1]
                ];
                newPosition = [
                    currentPosition[0] + anchorDifference[0],
                    currentPosition[1] + anchorDifference[1]
                ];
            }
            
            app.beginUndoGroup("Set Anchor Point");
            selectedLayer.position.setValue(newPosition);
            selectedLayer.anchorPoint.setValue(newAnchor);
            app.endUndoGroup();

        } else {

            switch (direction) {
                case "bottom-right":
                    newAnchor = [0, 0];
                    break;
                case "bottom-center":
                    newAnchor = [(offsetSizeX/2) * 0.5, 0];
                    break;
                case "bottom-left":
                    newAnchor = [(offsetSizeX/2), 0];
                    break;
                case "right":
                    newAnchor = [0, (offsetSizeY/2) * 0.5];
                    break;
                case "center":
                    newAnchor = [(offsetSizeX/2) * 0.5, (offsetSizeY/2) * 0.5];
                    break;
                case "left":
                    newAnchor = [(offsetSizeX/2), (offsetSizeY/2) * 0.5];
                    break;
                case "top-right":
                    newAnchor = [0, (offsetSizeY/2)];
                    break;
                case "top-center":
                    newAnchor = [(offsetSizeX/2) * 0.5, (offsetSizeY/2)];
                    break;
                case "top-left":
                    newAnchor = [(offsetSizeX/2), (offsetSizeY/2)];
                    break;
            }

            var currentPosition = selectedLayer.position.value;

            var anchorDifference = [
                newAnchor[0] - currentAnchor[0],
                newAnchor[1] - currentAnchor[1]
            ];

            var newPosition = [
                currentPosition[0] - anchorDifference[0],
                currentPosition[1] - anchorDifference[1]
            ];
           
            app.beginUndoGroup("Set Anchor Point");
            selectedLayer.anchorPoint.setValue(newAnchor);
            // selectedLayer.position.setValue(newPosition);
            app.endUndoGroup();

        }
    }

    else if (layerType == "COMP") {

        var oldAnchor = selectedLayer.anchorPoint.value;
        var oldPosition = selectedLayer.position.value;
        
        var compTarget;

        if(selectedLayer instanceof ShapeLayer){
            offsetSizeX = layerWidth;
            offsetSizeY = layerHeight;
        } else {
            offsetSizeX = complayerWidth;
            offsetSizeY = complayerHeight;
        }
        
        switch (direction) {
            case "top-left":
                compTarget = [0, 0];
                break;
            case "top-center":
                compTarget = [compWidth / 2, 0];
                break;
            case "top-right":
                compTarget = [compWidth, 0];
                break;
            case "left":
                compTarget = [0, compHeight / 2];
                break;
            case "center":
                compTarget = [compWidth / 2, compHeight / 2];
                break;
            case "right":
                compTarget = [compWidth, compHeight / 2];
                break;
            case "bottom-left":
                compTarget = [0, compHeight];
                break;
            case "bottom-center":
                compTarget = [compWidth / 2, compHeight];
                break;
            case "bottom-right":
                compTarget = [compWidth, compHeight];
                break;
        }
        var newPosition = compTarget;

        var newAnchor = [
            compTarget[0] - (oldPosition[0] - oldAnchor[0]),
            compTarget[1] - (oldPosition[1] - oldAnchor[1])
        ];
        
        app.beginUndoGroup("Set Comp Anchor Point");
        selectedLayer.anchorPoint.setValue(newAnchor);
        selectedLayer.position.setValue(newPosition);
        app.endUndoGroup();

    }
}