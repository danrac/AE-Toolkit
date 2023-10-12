(function XAVToolbox_Tools(thisObj) {

var scriptFile = new File($.fileName);
var scriptPath = scriptFile.parent.fsName;
var originalAlert = alert;
alert = function() {};

#include "UTILITY_DateHandler.jsx";
#include "UTILITY_SaveLogs.jsx";
#include "TOOL_SnapTo.jsx";
#include "TOOL_ParentTo.jsx";
#include "TOOL_LayerSelection.jsx";
#include "TOOL_AnimationHelper.jsx"
#include "TOOL_AutoSplice.jsx"

alert = originalAlert;

var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "TOOLS", undefined, { resizeable: false });

function XAVToolbox_Tools_buildUI(thisObj) {

        if (pal != null) {

            var mainPanel = pal.add('Group', undefined, '');
            mainPanel.orientation = 'column';
            mainPanel.alignChildren = ['left', 'top'];

            var ToolSets = mainPanel.add('Group', undefined, '');
            ToolSets.orientation = 'column';
            ToolSets.size = [300, undefined];

            var layerSelectPanel = ToolSets.add('Panel', undefined, 'LAYER TOOLS:');
            layerSelectPanel.graphics.backgroundColor = layerSelectPanel.graphics.newBrush(layerSelectPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
            layerSelectPanel.orientation = 'column';
            layerSelectPanel.alignment = ['fill', 'top'];
            layerSelectPanel.alignChildren = ['center', 'top'];

            var layerToolsPanel = ToolSets.add('Panel', undefined, '');
            layerToolsPanel.graphics.backgroundColor = layerToolsPanel.graphics.newBrush(layerToolsPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
            layerToolsPanel.orientation = 'row';
            layerToolsPanel.alignment = ['fill', 'center'];
            layerToolsPanel.alignChildren = ['left', 'top'];

            var compToolsPanel = mainPanel.add('Panel', undefined, 'COMP TOOLS:');
            compToolsPanel.graphics.backgroundColor = compToolsPanel.graphics.newBrush(compToolsPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
            compToolsPanel.orientation = 'column';
            compToolsPanel.alignment = ['fill', 'top'];
            compToolsPanel.alignChildren = ['center', 'top'];
            var styleboardBTNGroup = compToolsPanel.add("group", undefined, "");
            styleboardBTNGroup.orientation = 'row';
            var styleboardBTN = styleboardBTNGroup.add("button", undefined, "CREATE STYLEBOARD TEMPLATE");
            styleboardBTN.size = [300, 50];
            styleboardBTN.onClick = function(){
                $.evalFile(scriptPath + "/TOOL_StyleboardTemplate.jsx");
            }

            var setCompDurationGroup = compToolsPanel.add("group", undefined, "");
            setCompDurationGroup.orientation = 'column';
            setCompDurationGroup.add("statictext", undefined, "ENTER NEW DURATION IN SECONDS:");

            var setCompDurationInputGroup = compToolsPanel.add('Group', undefined, "");

            var durationInput = setCompDurationInputGroup.add("edittext", undefined, "1");
            durationInput.characters = 5;

            var changeCompDuration = setCompDurationInputGroup.add("button", undefined, "CHANGE DURATION");
            changeCompDuration.onClick = function(){
                var comps = app.project.items;
                var newDuration = parseFloat(durationInput.text);

                for (var i = 1; i <= comps.length; i++) {
                    if (comps[i] instanceof CompItem && comps[i].selected) {
                        comps[i].duration = newDuration;
                    }
                }
            }

            var animationToolsPanel = ToolSets.add('Panel', undefined, 'ANIMATION TOOLS:');
            animationToolsPanel.graphics.backgroundColor = animationToolsPanel.graphics.newBrush(animationToolsPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
            animationToolsPanel.alignment = ['fill', 'top'];

            var fadeDD = animationToolsPanel.add("dropdownlist", undefined, []);
            fadeDD.size = [300, 25];
            fadeDD.add("item", "linear");
            fadeDD.add("item", "easeIn");
            fadeDD.add("item", "easeOut");
            fadeDD.add("item", "easeInOut");
            fadeDD.selection = 0;
            fadeType = 'linear';

            fadeDD.onChange = function(){
                fadeType = fadeDD.selection.toString();
            }

            var animationGroup = animationToolsPanel.add('Group', undefined, "");

            var AddFadeInBTN = animationGroup.add('Button', undefined, "FADE IN");
            AddFadeInBTN.size = [75, 25];
            AddFadeInBTN.onClick = function(){
            // var frameCount = parseInt(framesFadeInput.text);
                addFadeIn(fadeType);
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: FadeIn // :: //", "Log");
            }
            var AddFadeOutBTN = animationGroup.add('Button', undefined, "FADE OUT");
            AddFadeOutBTN.size = [75, 25];
            AddFadeOutBTN.onClick = function(){
                // var frameCount = parseInt(framesFadeInput.text);
                addFadeOut(fadeType);
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: FadeOut // :: //", "Log");
            }
            var DriftControllerBTN = animationGroup.add('Button', undefined, "DRIFT");
            DriftControllerBTN.size = [65, 25];
            DriftControllerBTN.onClick = function(){
                createDriftController(fadeType);
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: DriftController // :: //", "Log");
            }
            var SlamControllerBTN = animationGroup.add('Button', undefined, "SLAM");
            SlamControllerBTN.size = [65, 25];
            SlamControllerBTN.onClick = function(){
                addSlamIn(fadeType);
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: SlamController // :: //", "Log");
            }

            var selectionGroup = layerSelectPanel.add("group", undefined, '');
            var SnapParentGroup = layerSelectPanel.add("group", undefined, '');
            
            var SelectionTypeDD = selectionGroup.add("dropdownlist", undefined, []);
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

            var LabelColorDD = selectionGroup.add("dropdownlist", undefined, []);
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

            var SelectionOperatorDD = selectionGroup.add("dropdownlist", undefined, []);
            SelectionOperatorDD.size = [70, 25];
            SelectionOperatorDD.add("item", "Only");
            SelectionOperatorDD.add("item", "Add");
            SelectionOperatorDD.add("item", "Subtract");
            SelectionOperatorDD.selection = 0;

            var selectBTN = selectionGroup.add('Button', undefined, "SELECT");
            selectBTN.alignment = ['fill','center'];
            selectBTN.preferredSize = [50,25];
            selectBTN.onClick = function(){
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: selectLayers // :: //", "Log");
                var SelectionType = SelectionTypeDD.selection.toString();
                var LabelColor = LabelColorDD.selection.toString();
                var LabelColorInt = LabelColorDD.selection.index;
                var SelectionOp = SelectionOperatorDD.selection.toString();
                MakeSelection(SelectionType, LabelColor, LabelColorInt, SelectionOp);
            }

            var snapToBTN = SnapParentGroup.add('Button', undefined, "SNAP TO");
            snapToBTN.size = [90, 50];
            snapToBTN.onClick = function(){
                SnapTo();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: SnapTo // :: //", "Log");
            }

            var parentToBTN = SnapParentGroup.add('Button', undefined, "PARENT");
            parentToBTN.size = [90, 50];
            parentToBTN.onClick = function(){
                ParentTo();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: ParentTo // :: //", "Log");
            }

            var UnparentBTN = SnapParentGroup.add('Button', undefined, "UNPARENT");
            UnparentBTN.size = [90, 50];
            UnparentBTN.onClick = function(){
                Unparent();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: Unparent // :: //", "Log");
            }

            var addNullParentGroup = layerSelectPanel.add('group', undefined, '');
            var addNullParentBTN = addNullParentGroup.add('Button', undefined, "ADD NULL PARENT");
            addNullParentBTN.size = [290, 25];
            addNullParentBTN.onClick = function(){
                addNullParent();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: addNullParent // :: //", "Log");
            }


            var AutoSplicePanel = pal.add('Panel', undefined, 'AUTO-SPLICE:');
            AutoSplicePanel.graphics.backgroundColor = AutoSplicePanel.graphics.newBrush(AutoSplicePanel.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);

            AutoSplicePanel.orientation = 'column';
            AutoSplicePanel.alignment = ['fill', 'top'];
            var AutoSpliceGroup = AutoSplicePanel.add('Group', undefined, '');
            AutoSpliceGroup.orientation = 'row';
            var AutoSpliceLabel = AutoSpliceGroup.add('StaticText', undefined, 'THRESHOLD');
            AutoSpliceLabel.alignment = ['fill', 'center'];
            var AutoSpliceSlider = AutoSpliceGroup.add('Slider', undefined, '');
            AutoSpliceSlider.alignment = ['fill', 'center'];

            var AutoSpliceSliderInput = AutoSpliceGroup.add('EditText', undefined, 'Threshold');
            AutoSpliceSliderInput.alignment = ['fill', 'center'];
            var AutoSpliceBTNGroup = AutoSplicePanel.add('Group', undefined, '');
            AutoSpliceBTNGroup.orientation = 'row';
            var AutoSpliceBTN = AutoSpliceBTNGroup.add('Button', undefined, 'CUT');
            AutoSpliceSlider.preferredSize.width = 175;
            AutoSpliceSliderInput.preferredSize.width = 30;
            AutoSpliceSlider.maxvalue = 100;
            AutoSpliceSlider.value = 6;
            AutoSpliceSliderInput.text = AutoSpliceSlider.value;
            AutoSpliceSlider.onChanging = function(){
                AutoSpliceSliderInput.text = this.value.toFixed(0);
            };
            AutoSpliceSliderInput.onChange = function(){
                AutoSpliceSlider.value = parseInt(this.text);
            };
            AutoSpliceBTN.size = [300, 25];
            AutoSpliceBTN.onClick = function() {
                AutoSplice(AutoSpliceSlider.value);
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: AutoSplice // :: //", "Log");
            }


            pal.layout.layout(true);
            pal.layout.resize();

        }

        return pal;

    }        

    ////BUILD UI FUNCTION///////

    var rdetPal = XAVToolbox_Tools_buildUI(thisObj);
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