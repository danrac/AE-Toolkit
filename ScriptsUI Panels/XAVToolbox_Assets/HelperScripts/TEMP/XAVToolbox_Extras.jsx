(function XAVToolbox_Extras(thisObj) {

#include "TOOL_BuildProjectStructure.jsx";

var XAVToolbox_ExtrasData = new Object();
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
                cmds2: Group {orientation:'row', alignment:['center','center'], \
                    trimBtn: Button { text:'" + "TRIM PRE-COMPS" + "', alignment:['fill','center'] }, \
                }, \
            }";
            var found = new Array(100);

            pal.gr_two = pal.add(resSetCompDurations);
            pal.gr_two.cmds1.textFieldFrame.preferredSize = [70, 20];
            pal.gr_two.cmds1.setBtn.preferredSize = [120, 20];
            pal.gr_two.cmds1.setBtn.onClick = SetAllCompDurations;
            pal.gr_two.cmds2.trimBtn.preferredSize = [300, 20];
            pal.gr_two.cmds2.trimBtn.onClick = TrimComps;

            var newProjBTN = pal.add('Button', undefined, 'Create New Project Dir');
            
            newProjBTN.onClick = function(){
                createNewProjectDirectory();
            }

            pal.exportProgressbar = pal.add('progressbar', undefined, found.length);
            pal.exportProgressbar.preferredSize = [300, 10];
            pal.exportProgressbar.maxvalue = 100;
            pal.exportProgressbar.value = 0;

            pal.layout.layout(true);
            pal.layout.resize();
        }
        return pal;
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

    function TrimComps(){
        app.beginUndoGroup(XAVToolbox_ExtrasData.scriptName);
            
            function trimChildComps(comp, duration) {
                for (var i = 1; i <= comp.numLayers; i++) {
                    var layer = comp.layer(i);
                    if (layer.source instanceof CompItem) {
                        trimChildComps(layer.source, duration);
                        layer.startTime = layer.inPoint;
                        layer.outPoint = layer.startTime + duration;
                        alert("Layer Name" + layer.name + " Duration: " + duration);
                    }
                }
            }

            var selectedComp = app.project.activeItem;
            if (selectedComp instanceof CompItem) {
                trimChildComps(selectedComp, selectedComp.duration);
            }
        app.endUndoGroup();
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

