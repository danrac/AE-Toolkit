var fadeType = "";

function getOrCreateMarker(layer, markerName, defaultTime) {
    var markerProperty = layer.property("Marker");
    for (var i = 1; i <= markerProperty.numKeys; i++) {
        if (markerProperty.keyValue(i).comment === markerName) {
            return markerProperty.keyTime(i);
        }
    }
    // If marker doesn't exist, create one at defaultTime
    var newMarker = new MarkerValue(markerName);
    layer.property("Marker").setValueAtTime(defaultTime, newMarker);
    return defaultTime;
}

function removeExistingMarkers(layer, markerName) {
    var markerProperty = layer.property("Marker");
    for (var i = 1; i <= markerProperty.numKeys; i++) {
        if (markerProperty.keyValue(i).comment === markerName) {
            markerProperty.removeKey(i);
            i--;  // Adjust the index after removing a key
        }
    }
}

function removeKeyframesAtMarker(layer, property, markerName) {
    var markerProperty = layer.property("Marker");
    for (var i = 1; i <= markerProperty.numKeys; i++) {
        if (markerProperty.keyValue(i).comment === markerName) {
            var timeAtMarker = markerProperty.keyTime(i);
            var keyIndex = property.nearestKeyIndex(timeAtMarker);
            if (keyIndex !== 0 && Math.abs(property.keyTime(keyIndex) - timeAtMarker) < 0.001) {
                property.removeKey(keyIndex);
            }
        }
    }
}

function setUnifiedExpression(layer) {
    var expression = 'var markers = thisLayer.marker; if (!markers.numKeys) value; else { var fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd; try { fadeInStart = markers.key("fadeIn_start").time; } catch(e) { fadeInStart = -1; } try { fadeInEnd = markers.key("fadeIn_end").time; } catch(e) { fadeInEnd = -1; } try { fadeOutStart = markers.key("fadeOut_start").time; } catch(e) { fadeOutStart = thisLayer.outPoint + 1; } try { fadeOutEnd = markers.key("fadeOut_end").time; } catch(e) { fadeOutEnd = thisLayer.outPoint + 1; } if (time < fadeInStart) 0; else if (time < fadeInEnd) linear(time, fadeInStart, fadeInEnd, 0, 100); else if (time < fadeOutStart) 100; else if (time < fadeOutEnd) linear(time, fadeOutStart, fadeOutEnd, 100, 0); else 0; }';
    layer.opacity.expression = expression;
}

function setUnifiedScaleExpression(layer) {
    var expression = 'var markers = thisLayer.marker; if (!markers.numKeys) value; else { var slamStart, slamEnd; try { slamStart = markers.key("slam_start").time; } catch(e) { slamStart = -1; } try { slamEnd = markers.key("slam_end").time; } catch(e) { slamEnd = -1; } var multiplier = effect("Scale Multiplier")("Slider").value / 100; if (time < slamStart) [1000, 1000] * multiplier; else if (time < slamEnd) linear(time, slamStart, slamEnd, [1000, 1000] * multiplier, [100, 100]); else [100, 100]; }';
    layer.scale.expression = expression;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function applyDriftEase(scaleProp, easeType) {
    if (!scaleProp) {
        alert("Scale property is not valid.");
        return;
    }

    if (scaleProp.numKeys < 2) {
        alert("Not enough keyframes on the scale property.");
        return;
    }

    var easeInValues = [new KeyframeEase(0, 53.33), new KeyframeEase(0, 53.33), new KeyframeEase(0, 53.33)];
    var easeOutValues = [new KeyframeEase(0, 0.1), new KeyframeEase(0, 0.1), new KeyframeEase(0, 0.1)];

    if (easeType === "linear") {
        scaleProp.setInterpolationTypeAtKey(1, KeyframeInterpolationType.LINEAR);
        scaleProp.setInterpolationTypeAtKey(2, KeyframeInterpolationType.LINEAR);
    } else {
        scaleProp.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER);
        scaleProp.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER);
    }

    switch (easeType) {
        case "easeIn":
            scaleProp.setTemporalEaseAtKey(2, easeInValues, easeOutValues);
            break;
        case "easeOut":
            scaleProp.setTemporalEaseAtKey(1, easeOutValues, easeInValues);
            break;
        case "easeInOut":
            scaleProp.setTemporalEaseAtKey(1, easeInValues, easeOutValues);
            scaleProp.setTemporalEaseAtKey(2, easeInValues, easeOutValues);
            break;
        case "linear":
            break;
        default:
            alert("Invalid easeType provided.");
            return;
    }
}

function applyEase(layer, property, keyIndex, easeType) {
        // Set the interpolation type after setting the ease values
    if (easeType === "linear") {
        property.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.LINEAR);
    } else {
        property.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.BEZIER);
    }
    switch (easeType) {
        case "easeIn":
            var easeInValue = new KeyframeEase(0, 33.33);
            var easeOutValue = new KeyframeEase(0, 0);
            property.setTemporalEaseAtKey(keyIndex, [easeInValue], [easeOutValue]);
            break;
        case "easeOut":
            easeInValue = new KeyframeEase(0, 0);
            easeOutValue = new KeyframeEase(0, 33.33);
            property.setTemporalEaseAtKey(keyIndex, [easeInValue], [easeOutValue]);
            break;
        case "easeInOut":
            easeInValue = new KeyframeEase(0, 33.33);
            easeOutValue = new KeyframeEase(0, 33.33);
            property.setTemporalEaseAtKey(keyIndex, [easeInValue], [easeOutValue]);
            break;
        case "linear":
            break;
        default:
            alert("Invalid easeType provided.");
            return;
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function addFadeIn(easeType) {
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

    app.beginUndoGroup("Add Fade In");

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        var defaultStartTime = layer.inPoint;
        var defaultEndTime = defaultStartTime + 10 / comp.frameRate; // 10 frames later

        // Get or create markers
        var startTime = getOrCreateMarker(layer, "fadeIn_start", defaultStartTime);
        var endTime = getOrCreateMarker(layer, "fadeIn_end", defaultEndTime);

        // // Remove existing markers and keyframes
        // removeKeyframesAtMarker(layer, layer.opacity, "fadeIn_start");
        // removeKeyframesAtMarker(layer, layer.opacity, "fadeIn_end");


        // Set keyframes at start and 10 frames later
        layer.opacity.setValueAtTime(startTime, 0);
        layer.opacity.setValueAtTime(endTime, 100);
        // layer.opacity.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.LINEAR);

        // Apply the desired easing to the keyframes
        if(easeType == "easeIn"){
            applyEase(layer, layer.opacity, layer.opacity.nearestKeyIndex(endTime), 'linear');
            applyEase(layer, layer.opacity, layer.opacity.nearestKeyIndex(startTime), easeType);
        }
        if(easeType == "easeOut"){
            applyEase(layer, layer.opacity, layer.opacity.nearestKeyIndex(startTime), 'linear');
            applyEase(layer, layer.opacity, layer.opacity.nearestKeyIndex(endTime), easeType);
        }
        if(easeType == 'linear' || easeType == 'easeInOut') {
            applyEase(layer, layer.opacity, layer.opacity.nearestKeyIndex(startTime), easeType);
            applyEase(layer, layer.opacity, layer.opacity.nearestKeyIndex(endTime), easeType);
        }

        var fadeInStartMarker = new MarkerValue("fadeIn_start");
        layer.property("Marker").setValueAtTime(startTime, fadeInStartMarker);
        
        var fadeInEndMarker = new MarkerValue("fadeIn_end");
        layer.property("Marker").setValueAtTime(endTime, fadeInEndMarker);
    }

    setUnifiedExpression(layer);

    app.endUndoGroup();
}

function addFadeOut(easeType) {
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

    app.beginUndoGroup("Add Fade Out");

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        var defaultEndTime = layer.outPoint;
        var defaultStartTime = defaultEndTime - 10 / comp.frameRate; // 10 frames before the end

        // Get or create markers
        var startTime = getOrCreateMarker(layer, "fadeOut_start", defaultStartTime);
        var endTime = getOrCreateMarker(layer, "fadeOut_end", defaultEndTime);

        // Remove existing markers and keyframes
        // removeKeyframesAtMarker(layer, layer.opacity, "fadeOut_start");
        // removeKeyframesAtMarker(layer, layer.opacity, "fadeOut_end");

        // Set keyframes at 10 frames before the end and at the end
        layer.opacity.setValueAtTime(startTime, 100);
        layer.opacity.setValueAtTime(endTime, 0);
        // layer.opacity.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.LINEAR);

        // Apply the desired easing to the keyframes
        if(easeType == "easeIn"){
            applyEase(layer, layer.opacity, layer.opacity.nearestKeyIndex(endTime), 'linear');
            applyEase(layer, layer.opacity, layer.opacity.nearestKeyIndex(startTime), easeType);
        }
        if(easeType == "easeOut"){
            applyEase(layer, layer.opacity, layer.opacity.nearestKeyIndex(startTime), 'linear');
            applyEase(layer, layer.opacity, layer.opacity.nearestKeyIndex(endTime), easeType);
        }
        if(easeType == 'linear' || easeType == 'easeInOut') {
            applyEase(layer, layer.opacity, layer.opacity.nearestKeyIndex(startTime), easeType);
            applyEase(layer, layer.opacity, layer.opacity.nearestKeyIndex(endTime), easeType);
        }

        var fadeOutStartMarker = new MarkerValue("fadeOut_start");
        layer.property("Marker").setValueAtTime(startTime, fadeOutStartMarker);
        
        var fadeOutEndMarker = new MarkerValue("fadeOut_end");
        layer.property("Marker").setValueAtTime(endTime, fadeOutEndMarker);
    }

    setUnifiedExpression(layer);

    app.endUndoGroup();
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function createDriftController(fadeType) {
    var activeComp = app.project.activeItem;
    if (!activeComp || !(activeComp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    // Create a null layer
    var driftController = activeComp.layers.addNull();
    driftController.name = "Drift_Null";
    driftController.startTime = 0; // Start at the beginning of the comp
    driftController.outPoint = activeComp.duration; // Set the out point to the comp's duration

    // Add two keyframes to the scale property
    var scaleProperty = driftController.property('Scale');
    scaleProperty.setValueAtTime(0, [100, 100]); // First frame
   
    var lastFrameTime = activeComp.duration - (1 / activeComp.frameRate); // Calculate the time of the last frame
    scaleProperty.setValueAtTime(lastFrameTime, [200, 200]); // Last frame

    // Add a slider effect to the Drift_Controller
    var sliderEffect = driftController.Effects.addProperty("ADBE Slider Control");
    sliderEffect.name = "Scale Control";

    // Add an expression to the scale property
    var scaleExpression = 'var sliderValue = effect("Scale Control")("Slider").value; var lastKeyTime = key(numKeys).time; var lastKeyValue = key(numKeys).value; if (time >= lastKeyTime) { lastKeyValue - [sliderValue, sliderValue]; } else { linear(time, key(numKeys-1).time, lastKeyTime, key(numKeys-1).value, lastKeyValue - [sliderValue, sliderValue]);}';
    scaleProperty.expression = scaleExpression;

    applyDriftEase(driftController.property('Scale'), fadeType);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function addSlamIn(easeType) {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    app.beginUndoGroup("Add Slam In");

    // Create a null layer called "SlamController"
    var slamController = comp.layers.addNull();
    slamController.name = "Slam_Null";
    slamController.startTime = 0;
    slamController.outPoint = comp.duration;

    var defaultStartTime = slamController.inPoint;
    var defaultEndTime = slamController.inPoint + 10 / comp.frameRate; // Default 3 frames before the end

    // Add a slider effect to the SlamController
    var sliderEffect = slamController.Effects.addProperty("ADBE Slider Control");
    sliderEffect.name = "Scale Multiplier";
    sliderEffect.property("Slider").setValue(100);  // Default value

    // Get or create the slam_marker
    var startTime = getOrCreateMarker(slamController, "slam_start", defaultStartTime);
    var endTime = getOrCreateMarker(slamController, "slam_end", defaultEndTime);

    // Apply the desired easing to the keyframes
    var scaleProperty = slamController.property('Scale');
    scaleProperty.setValueAtTime(startTime, [1000, 1000]);
    scaleProperty.setValueAtTime(endTime, [100, 100]);

    if(easeType == "easeIn"){
        applyEase(slamController, scaleProperty, scaleProperty.nearestKeyIndex(endTime), 'linear');
        applyEase(slamController, scaleProperty, scaleProperty.nearestKeyIndex(startTime), easeType);
    }
    if(easeType == "easeOut"){
        applyEase(slamController, scaleProperty, scaleProperty.nearestKeyIndex(startTime), 'linear');
        applyEase(slamController, scaleProperty, scaleProperty.nearestKeyIndex(endTime), easeType);
    }
    if(easeType == 'linear' || easeType == 'easeInOut') {
        applyEase(slamController, scaleProperty, scaleProperty.nearestKeyIndex(startTime), easeType);
        applyEase(slamController, scaleProperty, scaleProperty.nearestKeyIndex(endTime), easeType);
    }

    setUnifiedScaleExpression(slamController);

    app.endUndoGroup();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function addNullParent() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length !== 1) {
        alert("Please select a single layer.");
        return;
    }

    var layer = selectedLayers[0];
    var layerIndex = layer.index;

    app.beginUndoGroup("Add Offset Null Parent");

    // Create a null layer called "Offset_Null"
    var offsetNull = comp.layers.addNull();
    offsetNull.name = "Offset_Null";
    offsetNull.startTime = layer.inPoint;
    offsetNull.outPoint = layer.outPoint;

    // Center the null on the selected layer
    var layerPosition = layer.transform.position.value;
    offsetNull.transform.position.setValue(layerPosition);

    // Parent the selected layer to the null
    layer.parent = offsetNull;

    if(layerIndex > 1) {
        offsetNull.moveBefore(comp.layer(layerIndex - 1));
    }
    app.endUndoGroup();
}



