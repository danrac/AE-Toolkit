var timeValues = new Array();
var timeMarkers = new Array();

function AutoSplice(thresholdInput){
    app.beginUndoGroup("AutoSplice");
    var threshold = thresholdInput;
    var mainComp;
    var mainLayer;
    var Red;
    var Green;
    var Blue;
    var Adverage;
    timeValues = [];
    timeMarkers = [];
    mainComp = app.project.activeItem;
    mainLayer = app.project.activeItem.selectedLayers[0];
    var sliderControlR = mainLayer.Effects.addProperty("ADBE Slider Control");
    sliderControlR.name = "RED";
    var sliderControlG = mainLayer.Effects.addProperty("ADBE Slider Control");
    sliderControlG.name = "GREEN";
    var sliderControlB = mainLayer.Effects.addProperty("ADBE Slider Control");
    sliderControlB.name = "BLUE";
    var sliderControlADV = mainLayer.Effects.addProperty("ADBE Slider Control");
    sliderControlADV.name = "ADVERAGE";
    var pointControl = mainLayer.Effects.addProperty('ADBE Point Control');
    var point = pointControl.property(1);
    var sampleExpR = 'samplePoint = thisLayer.effect("Point Control")("Point"); sampleRadius = [thisComp.height,thisComp.width]; sampleColor = 255 * thisLayer.sampleImage(samplePoint, sampleRadius); R = Math.round(sampleColor[0]); outstring = R;'; 
    var sampleExpG = 'samplePoint = thisLayer.effect("Point Control")("Point"); sampleRadius = [thisComp.height,thisComp.width]; sampleColor = 255 * thisLayer.sampleImage(samplePoint, sampleRadius); G = Math.round(sampleColor[1]); outstring = G;'; 
    var sampleExpB = 'samplePoint = thisLayer.effect("Point Control")("Point"); sampleRadius = [thisComp.height,thisComp.width]; sampleColor = 255 * thisLayer.sampleImage(samplePoint, sampleRadius); B = Math.round(sampleColor[2]); outstring = B;'; 
    var sampleExpADV = 'R = thisLayer.effect(1)(1); G = thisLayer.effect(2)(1); B = thisLayer.effect(3)(1); ADV = Math.round((R + G + B)/3); outstring = ADV;';
    mainLayer.Effects(1).property(1).expression = sampleExpR;
    mainLayer.Effects(2).property(1).expression = sampleExpG;
    mainLayer.Effects(3).property(1).expression = sampleExpB;
    mainLayer.Effects(4).property(1).expression = sampleExpADV;
    Red = mainLayer.Effects(1).property(1).value;
    Green = mainLayer.Effects(2).property(1).value;
    Blue = mainLayer.Effects(3).property(1).value;
    Adverage = mainLayer.Effects(4).property(1).value;
    Analyse(mainComp, mainLayer);
    Mark(mainComp, mainLayer, threshold);
    Cut(mainComp, mainLayer);
    reverseSelectedLayersOrder();
    app.endUndoGroup();
}

function Analyse(Comp, thisLayer){
    var time;
    var propVal;
    var duration = Comp.duration;
    var frameDuration = Comp.frameDuration;
    var totalFrames = duration / frameDuration;
    for(var frame = 0; frame <= totalFrames; frame++){
        time = frame * frameDuration;
        propVal = thisLayer.Effects(4).property(1).valueAtTime(time, false);
        timeValues.push([time, propVal]);
    }
    return timeValues;
}

function Mark(Comp, currLayer, threshold){
    var newLayer = currLayer;
    var startMarker = currentFormatToTime(currLayer.inPoint, Comp.frameRate);
    var endMarker = Comp.duration;
    timeMarkers.push(startMarker);
    for(var frame = 1; frame <= timeValues.length - 1; frame++){
        var currVal = timeValues[frame];
        var prevVal = timeValues[frame - 1];
        var total = currVal[1];
        var obtained;
        if(currVal[1] > prevVal[1]){
            obtained = currVal[1] - prevVal[1];
        }
        else {
            obtained = prevVal[1] - currVal[1];
        }
        var percent = Math.round((obtained/100) * total);

        if(obtained >= threshold){
            var t = currentFormatToTime(frame, Comp.frameRate);
            timeMarkers.push(t);
        }
    }
    timeMarkers.push(endMarker);
}

function Cut(Comp, currLayer){
    var layerEffects;
    var tmpSelectedLayers = [];
    try{
        layerEffects = currLayer.Effects;
        for (j = layerEffects.numProperties; j > 0; j--){
            layerEffects.property(j).remove();
        }
    }catch(err){
    }
    for(i = 0; i < timeMarkers.length - 1; i++){
        Comp.time = timeMarkers[i];
        currLayer.inPoint = timeMarkers[i];
        currLayer.outPoint = timeMarkers[i + 1];
        var tmpClip = currLayer.duplicate();
        tmpSelectedLayers.push(tmpClip);
    }
    tmpSelectedLayers.push(currLayer);
    for(i = 0; i < tmpSelectedLayers.length - 1; i++){
        tmpSelectedLayers[i].selected = true;
        tmpSelectedLayers[i].moveToBeginning();

        // alert(tmpSelectedLayers[i].name);
    }
    currLayer.remove();


}