(function XAVToolbox_Tools(thisObj) {

var originalAlert = alert;
alert = function() {};

#include "UTILITY_DateHandler.jsx";
#include "UTILITY_SaveLogs.jsx";
#include "TOOL_SnapTo.jsx";
#include "TOOL_ParentTo.jsx";
#include "TOOL_LayerSelection.jsx";
#include "TOOL_AnimationHelper.jsx"

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
            // layerTools.alignment = ['left', 'top'];
            // layerTools.size = [450, 350];

            var layerSelectPanel = ToolSets.add('Panel', undefined, 'LAYER TOOLS:');
            layerSelectPanel.orientation = 'column';
            layerSelectPanel.alignChildren = ['center', 'top'];

            var layerToolsPanel = ToolSets.add('Panel', undefined, '');
            layerToolsPanel.orientation = 'row';
            layerToolsPanel.alignChildren = ['left', 'top'];

            var animationToolsPanel = ToolSets.add('Panel', undefined, 'ANIMATION TOOLS:');
            layerToolsPanel.orientation = 'row';
            layerToolsPanel.alignChildren = ['left', 'top'];

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
            // var fadeFrame = fadeGroup.add('StaticText', undefined, 'FRAMES:');
            // var framesFadeInput = fadeGroup.add('EditText', undefined, '');
            // framesFadeInput.text = 10;
            // framesFadeInput.size = [35, 25];

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
            selectBTN.preferredSize = [60,25];
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
            snapToBTN.size = [85, 25];
            snapToBTN.onClick = function(){
                SnapTo();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: SnapTo // :: //", "Log");
            }

            var parentToBTN = SnapParentGroup.add('Button', undefined, "PARENT");
            parentToBTN.size = [85, 25];
            parentToBTN.onClick = function(){
                ParentTo();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: ParentTo // :: //", "Log");
            }

            var UnparentBTN = SnapParentGroup.add('Button', undefined, "UNPARENT");
            UnparentBTN.size = [85, 25];
            UnparentBTN.onClick = function(){
                Unparent();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: Unparent // :: //", "Log");
            }

            var addNullParentGroup = layerSelectPanel.add('group', undefined, '');
            var addNullParentBTN = addNullParentGroup.add('Button', undefined, "ADD NULL PARENT");
            addNullParentBTN.onClick = function(){
                addNullParent();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: addNullParent // :: //", "Log");
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