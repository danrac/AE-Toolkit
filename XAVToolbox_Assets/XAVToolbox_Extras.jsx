(function XAVToolbox_Extras(thisObj) {

var XAVToolbox_ExtrasData = new Object();
var timeValues = new Array();
var timeMarkers = new Array();
var scriptFile = new File($.fileName);
var scriptPath = scriptFile.parent.fsName;
XAVToolbox_ExtrasData.scriptName = "XAVToolbox_Extras";
XAVToolbox_ExtrasData.scriptTitle = XAVToolbox_ExtrasData.scriptName + " v1.0";
var systemPC;
var systemMac;
var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Extras", undefined, { resizeable: false });

function XAVToolbox_Extras_buildUI(thisObj) {
        if (pal != null) {
            var resSetCompDurations = 
            "panel { text: 'Set All Comp Duration', orientation:'column', alignment:['center','top'], borderStyle:'Raised', \
                cmds1: Group {orientation:'row', alignment:['center','center'], \
                    title: StaticText { text:'FRAME NUMBER:', alignment:['fill','fill'] }, \
                    textFieldFrame: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                    setBtn: Button { text:'" + "SET DURATIONS" + "', alignment:['fill','center'] }, \
                }, \
            }";
            var resCutter = 
            "panel { text: 'Auto-Splice', orientation:'column', alignment:['center','top'], borderStyle:'Raised', \
                cmds1: Group {orientation:'row', alignment:['center','center'], \
                    title: StaticText { text:'" + "THRESHOLD:" + "'} , \
                    slider: Slider { text:'" + "Threshold" + "', alignment:['fill','center'] }, \
                    sliderField: EditText { text:'" + " " + "', alignment:['fill','center'] }, \
                }, \
                cmds2: Group {orientation:'row', alignment:['center','center'], \
                    cutBtn: Button { text:'" + "CUT" + "', alignment:['fill','center'] }, \
                }, \
            }";
            var resMatrix =
                "panel { \
                text: 'Make Array', orientation:'column', alignment:['fill','top'], \
                  cmds5: Group { \
                orientation:'row', alignment:['fill','fill'], \
                      title: StaticText { text:'Prefix:', alignment:['fill','fill'] }, \
                      textFieldPrefix: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                  }, \
                  cmds3: Group { \
                orientation:'row', alignment:['fill','fill'], \
                      title: StaticText { text:'ScaleX:', alignment:['fill','fill'] }, \
                      textFieldWidth: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                      title: StaticText { text:'ScaleY:', alignment:['fill','fill'] }, \
                      textFieldHeight: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                  }, \
                  cmds2: Group { \
                orientation:'row', alignment:['fill','fill'], \
                      title: StaticText { text:'Row:', alignment:['fill','fill'] }, \
                      textFieldColumns: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                      title: StaticText { text:'Col:', alignment:['fill','fill'] }, \
                      textFieldRows: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                  }, \
                  cmds4: Group { \
                orientation:'row', alignment:['fill','fill'], \
                      title: StaticText { text:'MarginX:', alignment:['fill','fill'] }, \
                      textFieldMarginX: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                      title: StaticText { text:'MarginY:', alignment:['fill','fill'] }, \
                      textFieldMarginY: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                  }, \
                cmds1: Group { \
                        alignment:['fill','top'], \
                        makeArrayBtn: Button { text:'MAKE ARRAY', alignment:['fill','bottom'], preferredSize:[300,20] }, \
                }, \
            }";
            var resLaunchCaptioneer =
                "panel { \
                cmds1: Group { \
                        alignment:['fill','top'], \
                        launchCaptioneerBtn: Button { text:'Captioneer', alignment:['fill','bottom'], preferredSize:[300,20] }, \
                }, \
            }";
            var resLaunchAE2019 =
                "panel { text: 'Launch AE', orientation:'column', alignment:['center','top'], borderStyle:'Raised', \
                cmds1: Group { \
                    orientation:'column', alignment:['fill','fill'], \
                        alignment:['fill','top'], \
                        launchAE2019Btn: Button { text:'LAUNCH NEW AE 2019', alignment:['fill','bottom'], preferredSize:[300,20] }, \
                        alignment:['fill','top'], \
                        launchAE2020Btn: Button { text:'LAUNCH NEW AE 2020', alignment:['fill','bottom'], preferredSize:[300,20] }, \
                }, \
            }";
            var resSelections =
            "group { \
            orientation:'row', alignment:['fill','top'], \
            cmds1: Group {orientation:'row', alignment:['center','center'], \
                selectBtn: Button { text:'Select', alignment:['fill','bottom'], preferredSize:[100,25] }, \
                alignment:['fill','top'], \
            }, \
            }";

            pal.grpSel = pal.add(resSelections);

            SelectionTypeDD = pal.grpSel.add("dropdownlist", undefined, []);
            SelectionTypeDD.size = [70, 25];
            SelectionTypeDD.add("item", "None");
            SelectionTypeDD.add("item", "Nulls");
            SelectionTypeDD.add("item", "Solids");
            SelectionTypeDD.add("item", "Shapes");
            SelectionTypeDD.add("item", "Comps");
            SelectionTypeDD.add("item", "Cameras");
            SelectionTypeDD.add("item", "Lights");
            SelectionTypeDD.add("item", "Footage");
            SelectionTypeDD.add("item", "Text");
            SelectionTypeDD.selection = 2;

            LabelColorDD = pal.grpSel.add("dropdownlist", undefined, []);
            LabelColorDD.size = [70, 25];
            LabelColorDD.add("item", "None");
            LabelColorDD.add("item", "Red");
            LabelColorDD.add("item", "Yellow");
            LabelColorDD.add("item", "Aqua");
            LabelColorDD.add("item", "Pink");
            LabelColorDD.add("item", "Lavender");
            LabelColorDD.add("item", "Peach");
            LabelColorDD.add("item", "Sea Foam");
            LabelColorDD.add("item", "Blue");
            LabelColorDD.add("item", "Green");
            LabelColorDD.add("item", "Purple");
            LabelColorDD.add("item", "Orange");
            LabelColorDD.add("item", "Brown");
            LabelColorDD.add("item", "Fuchsia");
            LabelColorDD.add("item", "Cyan");
            LabelColorDD.add("item", "Sandstone");
            LabelColorDD.add("item", "Dark Green");
            LabelColorDD.selection = 0;

            SelectionOperatorDD = pal.grpSel.add("dropdownlist", undefined, []);
            SelectionOperatorDD.size = [70, 25];
            SelectionOperatorDD.add("item", "Only");
            SelectionOperatorDD.add("item", "Add");
            SelectionOperatorDD.add("item", "Subtract");
            SelectionOperatorDD.selection = 0;

            pal.grpSel.cmds1.selectBtn.onClick = MakeSelection;

            pal.grp = pal.add(resMatrix);
            pal.grp.graphics.backgroundColor = pal.grp.graphics.newBrush(pal.grp.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
            pal.grp.cmds5.textFieldPrefix.preferredSize = [150, 20];
            pal.grp.cmds5.textFieldPrefix.text = "CompName";
            pal.grp.cmds2.textFieldColumns.preferredSize = [50,20];
            pal.grp.cmds2.textFieldColumns.text = "3";
            pal.grp.cmds2.textFieldRows.preferredSize = [50,20];
            pal.grp.cmds2.textFieldRows.text = "3";
            pal.grp.cmds3.textFieldWidth.preferredSize = [50,20];
            pal.grp.cmds3.textFieldWidth.text = "1920";                
            pal.grp.cmds3.textFieldHeight.preferredSize = [50,20];
            pal.grp.cmds3.textFieldHeight.text = "1080";
            pal.grp.cmds4.textFieldMarginX.preferredSize = [50,20];
            pal.grp.cmds4.textFieldMarginX.text = "25";                
            pal.grp.cmds4.textFieldMarginY.preferredSize = [50,20];
            pal.grp.cmds4.textFieldMarginY.text = "25";
            pal.grp.cmds1.makeArrayBtn.onClick = MakeArray;

            pal.gr_one = pal.add(resCutter);
            pal.gr_one.graphics.backgroundColor = pal.gr_one.graphics.newBrush(pal.gr_one.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
            var found = new Array(100);

            pal.gr_two = pal.add(resSetCompDurations);
            pal.gr_two.graphics.backgroundColor = pal.gr_one.graphics.newBrush(pal.gr_one.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
            pal.gr_two.cmds1.textFieldFrame.preferredSize = [70, 20];
            pal.gr_two.cmds1.setBtn.preferredSize = [120, 20];
            pal.gr_two.cmds1.setBtn.onClick = SetAllCompDurations;

            pal.grp = pal.add(resLaunchCaptioneer);
            pal.grp.cmds1.launchCaptioneerBtn.onClick = LaunchCaptioneer;

            pal.grp = pal.add(resLaunchAE2019);
            pal.grp.cmds1.launchAE2019Btn.onClick = launchNewAE2019;
            pal.grp.cmds1.launchAE2020Btn.onClick = launchNewAE2020;

            pal.exportProgressbar = pal.add('progressbar', undefined, found.length);
            pal.exportProgressbar.preferredSize = [300, 10];
            pal.exportProgressbar.maxvalue = 100;
            pal.exportProgressbar.value = 0;

            pal.gr_one.cmds1.slider.preferredSize.width = 175;
            pal.gr_one.cmds1.sliderField.preferredSize.width = 30;
            pal.gr_one.cmds1.slider.maxvalue = 100;
            pal.gr_one.cmds1.slider.value = 6;
            pal.gr_one.cmds1.sliderField.text = pal.gr_one.cmds1.slider.value;

            pal.gr_one.cmds1.slider.onChanging = function(){
                pal.gr_one.cmds1.sliderField.text = this.value.toFixed(0);
            };

            pal.gr_one.cmds1.sliderField.onChange = function(){
                pal.gr_one.cmds1.slider.value = parseInt(this.text);
            };

            pal.gr_one.cmds2.cutBtn.preferredSize = [300, 20];
            pal.gr_one.cmds2.cutBtn.onClick = Setup;
            pal.layout.layout(true);
            pal.gr_one.minimumSize = pal.gr_one.size;
            pal.layout.resize();
        }
        return pal;
    }

    function MakeSelection(){
        app.beginUndoGroup(XAVToolbox_ExtrasData.scriptName);
        var SelectionType = SelectionTypeDD.selection.toString();
        var LabelColor = LabelColorDD.selection.toString();
        var LabelColorInt = LabelColorDD.selection.index;
        var SelectionOp = SelectionOperatorDD.selection.toString();
        var comp = app.project.activeItem;
        if(comp == null){
            alert("Please select a comp.");
        }else{
            comp.selected = true;
            comp.openInViewer();
        }
        var layerCollection =  comp.layers;
        if(SelectionType != "None"){
            if(SelectionOp == "Only"){
                deselectAllLayers();
                for (var i = 1; i <= layerCollection.length; i++){
                    var layerItem = layerCollection[i].source;
                    if(SelectionType == "Nulls"){
                        if (layerCollection[i].nullLayer){
                            layerCollection[i].selected = true;
                        }
                    }
                    if(SelectionType == "Solids"){
                        if (layerCollection[i] instanceof ShapeLayer){
                            layerCollection[i].selected = false;
                        }else if(layerCollection[i] instanceof CameraLayer){
                            layerCollection[i].selected = false;
                        }else if(layerCollection[i] instanceof LightLayer){
                            layerCollection[i].selected = false;
                        }else if(layerCollection[i].source.mainSource instanceof SolidSource){
                            if (layerCollection[i].nullLayer){
                                layerCollection[i].selected = false;
                            }else{
                                layerCollection[i].selected = true;
                            }
                        }
                    }
                    if(SelectionType == "Shapes"){
                        if(layerCollection[i] instanceof ShapeLayer){
                            if (layerCollection[i].nullLayer){
                                layerCollection[i].selected = false;
                            }else{
                                layerCollection[i].selected = true;
                            }
                        }
                    }
                    if(SelectionType == "Comps"){
                        if (layerItem instanceof CompItem){
                            layerCollection[i].selected = true;
                        }
                    }
                    if(SelectionType == "Cameras"){
                        if (layerCollection[i] instanceof CameraLayer){
                            layerCollection[i].selected = true;
                        }
                    }
                    if(SelectionType == "Lights"){
                        if (layerCollection[i] instanceof LightLayer){
                            layerCollection[i].selected = true;
                        }
                    }
                    if(SelectionType == "Footage"){
                        if (layerItem instanceof FootageItem && !layerCollection[i].nullLayer){
                            if(layerCollection[i].source.mainSource instanceof SolidSource){
                                layerCollection[i].selected = false;
                            }else{
                                layerCollection[i].selected = true;
                            }
                        }
                    }
                    if(SelectionType == "Text"){
                        if (!layerCollection[i].nullLayer){
                            if(layerCollection[i].Text == null){
                                layerCollection[i].selected = false;
                            }else{
                                layerCollection[i].selected = true;
                            }
                        }
                    }
                }
            }

            if(SelectionOp == "Add"){
                for (var i = 1; i <= layerCollection.length; i++){
                    var layerItem = layerCollection[i].source;
                    if(SelectionType == "Nulls"){
                        if (layerCollection[i].nullLayer){
                            layerCollection[i].selected = true;
                        }
                    }
                    if(SelectionType == "Solids"){
                        if (layerCollection[i] instanceof ShapeLayer && layerCollection[i].selected){
                            layerCollection[i].selected = true;
                        }else if(layerCollection[i] instanceof CameraLayer && layerCollection[i].selected){
                            layerCollection[i].selected = true;
                        }else if(layerCollection[i] instanceof LightLayer && layerCollection[i].selected){
                            layerCollection[i].selected = true;
                        }else if (layerCollection[i] instanceof ShapeLayer && !layerCollection[i].selected){
                            layerCollection[i].selected = false;
                        }else if(layerCollection[i] instanceof CameraLayer && !layerCollection[i].selected){
                            layerCollection[i].selected = false;
                        }else if(layerCollection[i] instanceof LightLayer && !layerCollection[i].selected){
                            layerCollection[i].selected = false;
                        }else if(layerCollection[i].source.mainSource instanceof SolidSource){
                            if (layerCollection[i].nullLayer){
                                if(layerCollection[i].selected){
                                    layerCollection[i].selected = true;
                                }else{
                                    layerCollection[i].selected = false;
                                }
                            }else{
                                layerCollection[i].selected = true;
                            }
                        }
                    }
                    if(SelectionType == "Shapes"){
                        if(layerCollection[i] instanceof ShapeLayer){
                            if (layerCollection[i].nullLayer){
                                layerCollection[i].selected = false;
                            }else{
                                layerCollection[i].selected = true;
                            }
                        }
                    }
                    if(SelectionType == "Comps"){
                        if (layerItem instanceof CompItem){
                            layerCollection[i].selected = true;
                        }
                    }
                    if(SelectionType == "Cameras"){
                        if (layerCollection[i] instanceof CameraLayer){
                            layerCollection[i].selected = true;
                        }
                    }
                    if(SelectionType == "Lights"){
                        if (layerCollection[i] instanceof LightLayer){
                            layerCollection[i].selected = true;
                        }
                    }
                    if(SelectionType == "Footage"){
                        if (layerItem instanceof FootageItem && !layerCollection[i].nullLayer){
                            if(layerCollection[i].source.mainSource instanceof SolidSource){
                                if(layerCollection[i].selected){
                                    layerCollection[i].selected = true;
                                }else{
                                    layerCollection[i].selected = false;
                                }
                            }else{
                                layerCollection[i].selected = true;
                            }
                        }
                    }
                    if(SelectionType == "Text"){
                        if (!layerCollection[i].nullLayer){
                            if(layerCollection[i].Text == null){
                                if(layerCollection[i].selected){
                                    layerCollection[i].selected = true;
                                }else{
                                    layerCollection[i].selected = false;
                                }
                            }else{
                                layerCollection[i].selected = true;
                            }
                        }
                    }
                }
            }

            if(SelectionOp == "Subtract"){
                for (var i = 1; i <= layerCollection.length; i++){
                    var layerItem = layerCollection[i].source;
                    if(SelectionType == "Nulls"){
                        if (layerCollection[i].nullLayer){
                            layerCollection[i].selected = false;
                        }
                    }
                    if(SelectionType == "Solids"){
                         if (layerCollection[i] instanceof ShapeLayer && layerCollection[i].selected){
                            layerCollection[i].selected = true;
                        }else if(layerCollection[i] instanceof CameraLayer && layerCollection[i].selected){
                            layerCollection[i].selected = true;
                        }else if(layerCollection[i] instanceof LightLayer && layerCollection[i].selected){
                            layerCollection[i].selected = true;
                        } else if (layerCollection[i] instanceof ShapeLayer && !layerCollection[i].selected){
                            layerCollection[i].selected = false;
                        }else if(layerCollection[i] instanceof CameraLayer && !layerCollection[i].selected){
                            layerCollection[i].selected = false;
                        }else if(layerCollection[i] instanceof LightLayer && !layerCollection[i].selected){
                            layerCollection[i].selected = false;
                        }else if(layerCollection[i].source.mainSource instanceof SolidSource){
                            if (layerCollection[i].nullLayer){
                                if(layerCollection[i].selected){
                                    layerCollection[i].selected = true;
                                }else{
                                    layerCollection[i].selected = false;
                                }
                            }else{
                                layerCollection[i].selected = false;
                            }
                        }
                    }
                    if(SelectionType == "Shapes"){
                        if(layerCollection[i] instanceof ShapeLayer){
                            if (layerCollection[i].nullLayer){
                                layerCollection[i].selected = false;
                            }else{
                                layerCollection[i].selected = false;
                            }
                        }
                    }
                    if(SelectionType == "Comps"){
                        if (layerItem instanceof CompItem){
                            layerCollection[i].selected = false;
                        }
                    }
                    if(SelectionType == "Cameras"){
                        if (layerCollection[i] instanceof CameraLayer){
                            layerCollection[i].selected = false;
                        }
                    }
                    if(SelectionType == "Lights"){
                        if (layerCollection[i] instanceof LightLayer){
                            layerCollection[i].selected = false;
                        }
                    }
                    if(SelectionType == "Footage"){
                        if (layerItem instanceof FootageItem && !layerCollection[i].nullLayer){
                            if(layerCollection[i].source.mainSource instanceof SolidSource){
                                if(layerCollection[i].selected){
                                    layerCollection[i].selected = true;
                                }else{
                                    layerCollection[i].selected = false;
                                }
                            }else{
                                layerCollection[i].selected = false;
                            }
                        }
                    }
                    if(SelectionType == "Text"){
                        if (!layerCollection[i].nullLayer){
                            if(layerCollection[i].Text != null){
                                layerCollection[i].selected = false;
                            }
                        }
                    }
                }
            }
        }

        if(LabelColor != "None"){
            if(SelectionOp == "Only"){
                deselectAllLayers();
                for (var i = 1; i <= layerCollection.length; i++){
                    var layerItem = layerCollection[i].source;
                    if(layerCollection[i].label == LabelColorInt){
                            layerCollection[i].selected = true;
                    }
                }
            }
            if(SelectionOp == "Add"){
                for (var i = 1; i <= layerCollection.length; i++){
                    var layerItem = layerCollection[i].source;
                    if(layerCollection[i].label == LabelColorInt){
                            layerCollection[i].selected = true;
                    }
                }
            }
            if(SelectionOp == "Subtract"){
                for (var i = 1; i <= layerCollection.length; i++){
                    var layerItem = layerCollection[i].source;
                    if(layerCollection[i].label == LabelColorInt){
                            layerCollection[i].selected = false;
                    }
                }
            }
        }
        app.endUndoGroup();    
    }

    function Setup(){
        var progressBar = this.parent.parent.parent.exportProgressbar;
        while(progressBar.value < 100) {
           progressBar.value++; 
           $.sleep(3);
        }
        app.beginUndoGroup(XAVToolbox_ExtrasData.scriptName);
        var threshold = this.parent.parent.cmds1.slider.value;
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
        progressBar.value = 0;   
        Mark(mainComp, mainLayer, threshold);
        progressBar.value = 0;   
        Cut(mainComp, mainLayer);
        progressBar.value = 0;   
        app.endUndoGroup();
        progressBar.value = 0;   
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
    }

    function Cut(Comp, currLayer){
        var layerEffects;
        try{
            layerEffects = currLayer.Effects;
            for (j = layerEffects.numProperties; j > 0; j--){
                layerEffects.property(j).remove();
            }
        }catch(err){
        }
        for(i =0; i<= timeMarkers.length; i++){
            var newCut = currLayer.duplicate();
            Comp.time = timeMarkers[i];
            newCut.inPoint = timeMarkers[i];
            newCut.outPoint = timeMarkers[i + 1];
        }
    }

    function removeElement(array, elem) {
        var index = array.indexOf(elem);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    function getFolderByName(folderName) {
        var myProject = app.project;
        for (var i = 1; i <= myProject.numItems; i++) {
            if ((myProject.item(i) instanceof FolderItem) && (myProject.item(i).name == folderName)){
                return myProject.item(i);
            }
        }
        myFolder = myProject.items.addFolder(folderName);
        return myFolder;
    }
    
    function MakeArray() {
        if (app.project === null)
            return;
            var progressBar = this.parent.parent.parent.exportProgressbar;
            while(progressBar.value < 100) {
               progressBar.value++; 
               $.sleep(3);
            }
            app.beginUndoGroup(XAVToolbox_ExtrasData.scriptName);
            var prefixText = this.parent.parent.cmds5.textFieldPrefix.text;
            var arrayMarginX = parseInt(this.parent.parent.cmds4.textFieldMarginX.text);
            var arrayMarginY = parseInt(this.parent.parent.cmds4.textFieldMarginY.text);
            var arrayWidth = parseInt(this.parent.parent.cmds3.textFieldWidth.text);
            var arrayHeight = parseInt(this.parent.parent.cmds3.textFieldHeight.text);
            var arrayColumns = (parseInt(this.parent.parent.cmds2.textFieldColumns.text) - 1);
            var arrayRows = (parseInt(this.parent.parent.cmds2.textFieldRows.text) - 1);
            var Cols = parseInt(this.parent.parent.cmds2.textFieldColumns.text);
            var Rows = parseInt(this.parent.parent.cmds2.textFieldRows.text);
            var itemCount = (Cols * Rows) + 1;
            var gridCenterX = ((arrayWidth + arrayMarginX) * Cols) / 2;
            var gridCenterY = ((arrayHeight + arrayMarginY) * Rows) / 2;
            var newCompLayers = [];
            var repoLayers = [];
            var newNull;
            var newBoards = getFolderByName(prefixText + "_PreComps");
            if(prefixText != ""){
                var comp = app.project.items.addComp(prefixText + "_Styleboard_01", ((arrayWidth + arrayMarginX) * Cols), ((arrayHeight + arrayMarginY)  * Rows), 1, 120, 24);
        
                for (var b = 1; b < itemCount; b++){
                    var newCompLayer = app.project.items.addComp(prefixText + "_PreComp_0" + b , arrayWidth, arrayHeight, 1, comp.duration, comp.frameRate);
                    newCompLayer.parentFolder = newBoards;
                    newCompLayer.layers.addSolid([0.5, 0.5, 0.5],  prefixText + "_Solid_0" + b, arrayWidth, arrayHeight, 1, comp.duration);
                    var newLayer = comp.layers.add(newCompLayer);
                    newCompLayers.push(newLayer);
                }
            
               if (comp.layer("control_null") == null){
                    newNull = comp.layers.addNull(comp.duration);
                    newNull.name = "control_null";
                    newNull.property("Position").setValue([gridCenterX, gridCenterY]);
                }
                else{
                    newNull = comp.layer("control_null");
                    newNull.property("Position").setValue([gridCenterX, gridCenterY]);
                }
                
                for (var i = 0; i < newCompLayers.length - 1; i++) { 
                    for (var y = 0; y <= arrayColumns; y++) {
                        for (var x = 0; x <= arrayRows; x++) {    
                            newCompLayers[i].property("Position").setValue([((arrayWidth + arrayMarginX) * x) + ((arrayWidth + arrayMarginX) / 2), ((arrayHeight + arrayMarginY) * y) + ((arrayHeight + arrayMarginY) / 2)]); 
                            newCompLayers[i].parent = newNull;
                            newCompLayers[i].moveToEnd();
                            removeElement(newCompLayers, newCompLayers[i]);
                        }
                    }
                }
                comp.width = (arrayWidth + arrayMarginX) * Rows;
                comp.height = (arrayHeight + arrayMarginY) * Cols;
                newNull.transform.position.setValue([gridCenterX, gridCenterY]);

            }else{
                alert("Please add a prefix for your comp.");
            }
        app.endUndoGroup();
        progressBar.value = 0;   
    }

    function SetAllCompDurations(){
        var selectedComps = new Array();
        var compStringArr = new Array();
        var primaryComp;
        var frameInput = parseFloat(this.parent.parent.cmds1.textFieldFrame.text);
        var frameNumber;
        selectedPreComps = [];
        for (var x = 1; x <= app.project.numItems; x++){
            if (app.project.item(x).selected){
                selectedComps.push(app.project.item(x));
            }
        }
        for(var i = 0; i <= selectedComps.length - 1; i++){
            primaryComp = selectedComps[i];
            selectedPreComps.push(primaryComp);
        }
        frameNumber = frameInput / primaryComp.frameRate;
        primaryComp.duration = frameNumber;
        for(var i = 0; i <= selectedPreComps.length - 1; i++){
            compStringArr.push(getPreCompsInComp(selectedPreComps[i]));
        }
        var dupCompArr = new Array();
        dupCompArr.push(primaryComp);
        for(var i = 0; i < compStringArr.length - 1; i++){
            for(var x = 1; x < compStringArr[i].length - 1; x++){
                dupCompArr.push(compStringArr[i][x]);
                compStringArr.pop(compStringArr[i][x]);

            }
        }
        app.beginUndoGroup(XAVToolboxData.scriptName);
        for(var i = 0; i <= dupCompArr.length; i++){
            var newLayers = dupCompArr[i].layers;
            var len = newLayers.length;
            for(var x = 1; x <= len; x++){
                var layerItem = newLayers[x];
                var layerItemSource = newLayers[x].source;
                if (layerItemSource instanceof CompItem){
                    // alert(layerItem.outPoint);
                    layerItem.outPoint = frameNumber;
                    layerItemSource.duration = frameNumber;
                }
            }
        }
        app.endUndoGroup();      
        alert("Done");
    }

    function getPreCompsInComp(searchComp){
        var layerCollection = searchComp.layers;
        for (var x = 1; x <= layerCollection.length; x++){
            var layerItem = layerCollection[x].source;
            if (layerItem instanceof CompItem){
                selectedPreComps.push(layerItem);
            }
        }
        return selectedPreComps;
    }
    
    function deselectAllLayers(){
        var comp = app.project.activeItem;
        var layerCollection =  comp.layers;
        for (var i = 1; i <= layerCollection.length; i++){
            layerCollection[i].selected = false;
        }
    }

    function systemCheck(){
    
        var systemid = $.os.split(" ");

        if(systemid[0] == "Macintosh"){
            systemMac = true;
            systemPC = false;
            systemFont = "Trade Gothic Next";
        } else {
            systemMac = false;
            systemPC = true;
            systemFont = "Arial";
        }
    
    }

    function LaunchCaptioneer(){
        $.evalFile(scriptPath + "/XAVToolbox_Captions.jsx");
    }

    function launchNewAE2019(){
        if(systemMac){
            var runcmd = 'open -n /Applications/Adobe\\ After\\ Effects\\ CC\\ 2019/Adobe\\ After\\ Effects\\ CC\\ 2019.app';
            system.callSystem(runcmd);
        }else{
            var runcmd = '"C://Program Files/Adobe/Adobe After Effects 2019/Support Files/AfterFX.exe" -m';
            system.callSystem(runcmd);
        }
    }

    function launchNewAE2020(){
        if(systemMac){
            var runcmd = 'open -n /Applications/Adobe\\ After\\ Effects\\ 2020/Adobe\\ After\\ Effects\\ 2020.app';
            system.callSystem(runcmd);
        }else{
            var runcmd = '"C://Program Files/Adobe/Adobe After Effects 2021/Support Files/AfterFX.exe" -m';
            system.callSystem(runcmd);
        }
    }

        

    ////BUILD UI FUNCTION///////

    var rdetPal = XAVToolbox_Extras_buildUI(thisObj);
    if (rdetPal !== null) {
        if (rdetPal instanceof Window) {
            rdetPal.center();
            rdetPal.show();
        }
        else
            rdetPal.layout.layout(true);
        }
    }
)(this);

