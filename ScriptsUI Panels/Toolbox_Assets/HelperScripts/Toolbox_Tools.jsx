(function Toolbox_Tools(thisObj) {

var scriptFile = new File($.fileName);
var scriptPath = scriptFile.parent.fsName;
var originalAlert = alert;
alert = function() {};

#include "UTILITY_DateHandler.jsx";
#include "UTILITY_SaveLogs.jsx";
#include "TOOL_SnapTo.jsx";
#include "TOOL_ParentTo.jsx";
#include "TOOL_LayerSelection.jsx";
#include "TOOL_AnimationHelper.jsx";
#include "TOOL_AutoSplice.jsx";
#include "TOOL_SequenceLayers.jsx";
#include "TOOL_EditText.jsx";
#include "TOOL_TransferAttributes.jsx";
#include "TOOL_stepAndRepeatUI.jsx";
#include "TOOL_setAnchorPointUI.jsx";
#include "TOOL_RefToComp.jsx";
#include "TOOL_RefToComp.jsx";
#include "TOOL_MakeGuideLayer.jsx";


alert = originalAlert;

var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "TOOLS", undefined, { resizeable: false });

function Toolbox_Tools_buildUI(thisObj) {

        if (pal != null) {

            var mainPanel = pal.add('Group', undefined, '');
            mainPanel.orientation = 'column';
            mainPanel.alignChildren = ['left', 'top'];

            var ToolSets = mainPanel.add('Panel', undefined, '');
            ToolSets.orientation = 'column';
            ToolSets.size = [300, undefined];
            ToolSets.graphics.backgroundColor = ToolSets.graphics.newBrush(ToolSets.graphics.BrushType.SOLID_COLOR, [0.2,0.3,0.5,1]);


            showHideAnimationBtn = ToolSets.add('Button', undefined, '-------------   ANIMATION TOOLS    -----------');
            showHideAnimationBtn.size = [300, 25];


            var animationToolsPanel = ToolSets.add('Panel', undefined, '');
            animationToolsPanel.graphics.backgroundColor = animationToolsPanel.graphics.newBrush(animationToolsPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
            animationToolsPanel.alignment = ['fill', 'top'];
            animationToolsPanel.visible = 0;
            animationToolsPanel.maximumSize.height = 0;
            animationToolsPanel.size = [280, 0];
            animationToolsPanel.enabled = false;
            animationToolsPanel.active = false;

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
            AddFadeInBTN.size = [70, 25];
            AddFadeInBTN.onClick = function(){
            // var frameCount = parseInt(framesFadeInput.text);
                addFadeIn(fadeType);
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: FadeIn // :: //", "Log");
            }
            var AddFadeOutBTN = animationGroup.add('Button', undefined, "FADE OUT");
            AddFadeOutBTN.size = [70, 25];
            AddFadeOutBTN.onClick = function(){
                // var frameCount = parseInt(framesFadeInput.text);
                addFadeOut(fadeType);
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: FadeOut // :: //", "Log");
            }
            var DriftControllerBTN = animationGroup.add('Button', undefined, "DRIFT");
            DriftControllerBTN.size = [60, 25];
            DriftControllerBTN.onClick = function(){
                createDriftController(fadeType);
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: DriftController // :: //", "Log");
            }
            var SlamControllerBTN = animationGroup.add('Button', undefined, "SLAM");
            SlamControllerBTN.size = [60, 25];
            SlamControllerBTN.onClick = function(){
                addSlamIn(fadeType);
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: SlamController // :: //", "Log");
            }

            showHideLayersBtn = ToolSets.add('Button', undefined, '---------   LAYER TOOLS    -------');
            showHideLayersBtn.size = [300, 25];

            var layerSelectPanel = ToolSets.add('Panel', undefined, '');
            layerSelectPanel.graphics.backgroundColor = layerSelectPanel.graphics.newBrush(layerSelectPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
            layerSelectPanel.orientation = 'column';
            layerSelectPanel.alignment = ['center', 'top'];
            layerSelectPanel.alignChildren = ['center', 'top'];

            layerSelectPanel.visible = 0;
            layerSelectPanel.maximumSize.height = 0;
            layerSelectPanel.enabled = false;
            layerSelectPanel.active = false;

            var gridToolGroup = layerSelectPanel.add('Panel', undefined, '');
            gridToolGroup.graphics.backgroundColor = gridToolGroup.graphics.newBrush(gridToolGroup.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.5,1]);


            // Toggle button for Anchor UI
            var toggleSetAncButton = gridToolGroup.add("button", undefined, "SET ANCHOR / STEP & REPEAT");
            toggleSetAncButton.size = [250, 35];
            
            var offsetPanel = layerSelectPanel.add('Group', undefined, '');
            offsetPanel.orientation = 'row';
            offsetPanel.alignment = ['center', 'top'];

            var StepPanel = offsetPanel.add('Panel', undefined, 'Step And Repeat');
            StepPanel.orientation = 'row';
            StepPanel.alignment = ['center', 'top'];

            var AnchorPanel = offsetPanel.add('Panel', undefined, 'Set Anchor');
            AnchorPanel.orientation = 'row';
            AnchorPanel.alignment = ['center', 'top'];

            var anchorPointPanel = buildSetAnchorPointUI(AnchorPanel);
            var stepAndRepeatPanel = buildStepAndRepeatUI(StepPanel);

            // toggleSetAncButton.onDraw = function() {
            //     var g = this.graphics;
            //     var blueBrush = g.newBrush(g.BrushType.SOLID_COLOR,[0/255,152/255,255/255,1]);
            //     var blackPen = g.newPen(g.PenType.SOLID_COLOR,[0/255,0/255,0/255,1],1);
            //     var textSize = g.measureString(toggleSetAncButton.text);
            //     var textX = (this.size.width-textSize.width)/2;
            //     var textY = (this.size.height-textSize.height)/2;
            //     g.newPath();
            //     g.rectPath(0,0,this.size.width,this.size.height);
            //     g.fillPath(blueBrush);
            //     g.drawString(toggleSetAncButton.text,blackPen,textX,textY);
            // }

            toggleSetAncButton.onClick = function() {
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: Set Anchor // :: //", "Log");
                anchorPointPanel.visible = !anchorPointPanel.visible;
                stepAndRepeatPanel.visible = !stepAndRepeatPanel.visible;
                toggleSetAncButton.text = anchorPointPanel.visible ? "SET ANCHOR / STEP & REPEAT" : "SET ANCHOR / STEP & REPEAT";

                if(anchorPointPanel.enabled == false){
                    turnPanelOn(StepPanel, 300);
                    turnPanelOn(AnchorPanel, 300);
                    turnPanelOn(offsetPanel, 300);
                    turnPanelOn(anchorPointPanel, 300);
                    turnPanelOn(stepAndRepeatPanel, 300);

                    turnPanelOff(addNullParentGroup);
                    turnPanelOff(selectionGroup)
                    turnPanelOff(OrderLayerGroup);
                    turnPanelOff(SnapParentGroup);
                    turnPanelOff(TransferAttrGroup);
                }
                else{
                    turnPanelOff(StepPanel);
                    turnPanelOff(AnchorPanel);
                    turnPanelOff(offsetPanel);
                    turnPanelOff(anchorPointPanel);
                    turnPanelOff(stepAndRepeatPanel);

                    turnPanelOn(addNullParentGroup, 300);
                    turnPanelOn(selectionGroup, 300)
                    turnPanelOn(OrderLayerGroup, 300);
                    turnPanelOn(SnapParentGroup, 300);
                    turnPanelOn(TransferAttrGroup, 300);
                }
                pal.layout.layout(true);
                pal.layout.resize();
            };

            turnPanelOff(stepAndRepeatPanel);
            turnPanelOff(anchorPointPanel);
            turnPanelOff(offsetPanel);
            
            function turnPanelOn(inputPanel, newsize){
                inputPanel.maximumSize.height = newsize;
                inputPanel.visible = 1;
                inputPanel.enabled = true;
            }

            function turnPanelOff(inputPanel){
                inputPanel.maximumSize.height = 0;
                inputPanel.visible = 0;
                inputPanel.enabled = false;
            }

            showHideCompBtn = ToolSets.add('Button', undefined, '------------   COMP TOOLS    ----------');
            showHideCompBtn.size = [300, 25];

            var compToolsPanel = ToolSets.add('Panel', undefined, '');
            compToolsPanel.graphics.backgroundColor = compToolsPanel.graphics.newBrush(compToolsPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
            compToolsPanel.orientation = 'column';
            compToolsPanel.alignment = ['fill', 'top'];
            compToolsPanel.alignChildren = ['center', 'top'];
            compToolsPanel.visible = 0;
            compToolsPanel.maximumSize.height = 0;
            compToolsPanel.size = [300, 0];
            compToolsPanel.enabled = false;
            compToolsPanel.active = false;

            var styleboardBTNGroup = compToolsPanel.add("Panel", undefined, "");
            styleboardBTNGroup.graphics.backgroundColor = styleboardBTNGroup.graphics.newBrush(styleboardBTNGroup.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.2,1]);

            styleboardBTNGroup.orientation = 'row';
            var styleboardBTN = styleboardBTNGroup.add("button", undefined, "CREATE STYLEBOARD TEMPLATE");
            styleboardBTN.size = [280, 50];
            styleboardBTN.onClick = function(){
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: styleboardBTN // :: //", "Log");
                $.evalFile(scriptPath + "/TOOL_StyleboardTemplate.jsx");
            }

            var extendCompInputPanel = compToolsPanel.add('Panel', undefined, "");
            extendCompInputPanel.orientation = 'column';

            var extendCompInputGroup = extendCompInputPanel.add('Group', undefined, "");
            extendCompInputGroup.orientation = 'row';


            var subFrameBTN = extendCompInputGroup.add("button", undefined, "-1");
            // appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: subFrameBTN // :: //", "Log");
            subFrameBTN.size = [60, 25];
            subFrameBTN.onClick = function(){
                var comps = app.project.items;
                for (var i = 1; i <= comps.length; i++) {
                    if (comps[i] instanceof CompItem && comps[i].selected) {
                        var frameRate = comps[i].frameRate;
                        comps[i].duration = comps[i].duration - (1 / frameRate);
                    }
                }
            }

            var subTenFramesBTN = extendCompInputGroup.add("button", undefined, "-10");
            // appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: subTenFramesBTN // :: //", "Log");
            subTenFramesBTN.size = [60, 25];
            subTenFramesBTN.onClick = function(){
                var comps = app.project.items;
                for (var i = 1; i <= comps.length; i++) {
                    if (comps[i] instanceof CompItem && comps[i].selected) {
                        var frameRate = comps[i].frameRate;
                        comps[i].duration = comps[i].duration - (10 / frameRate);
                    }
                }
            }

            var addTenFramesBTN = extendCompInputGroup.add("button", undefined, "+10");
            // appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: addFrameBTN // :: //", "Log");
            addTenFramesBTN.size = [60, 25];
            addTenFramesBTN.onClick = function(){
                var comps = app.project.items;
                for (var i = 1; i <= comps.length; i++) {
                    if (comps[i] instanceof CompItem && comps[i].selected) {
                        var frameRate = comps[i].frameRate;
                        comps[i].duration = comps[i].duration + (10 / frameRate);
                    }
                }
            }

            var addFrameBTN = extendCompInputGroup.add("button", undefined, "+1");
            // appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: addFrameBTN // :: //", "Log");
            addFrameBTN.size = [60, 25];
            addFrameBTN.onClick = function(){
                var comps = app.project.items;
                for (var i = 1; i <= comps.length; i++) {
                    if (comps[i] instanceof CompItem && comps[i].selected) {
                        var frameRate = comps[i].frameRate;
                        comps[i].duration = comps[i].duration + (1 / frameRate);
                    }
                }
            }


            var setCompDurationGroup = compToolsPanel.add("group", undefined, "");
            setCompDurationGroup.orientation = 'column';
            // setCompDurationGroup.add("statictext", undefined, "ENTER NEW DURATION IN SECONDS:");
            var setCompDurationInputGroup = compToolsPanel.add('Group', undefined, "");

            var setStartInput = setCompDurationInputGroup.add("edittext", undefined, "0");
            setStartInput.size = [25, 25];
            setStartInput.characters = 5;

            var setStartDuration = setCompDurationInputGroup.add("button", undefined, "SET START");

            setStartDuration.onClick = function(){
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: setStartDuration // :: //", "Log");
                var comps = app.project.items;
                var newStart = parseFloat(setStartInput.text);

                for (var i = 1; i <= comps.length; i++) {
                    if (comps[i] instanceof CompItem && comps[i].selected) {
                        var frameRate = comps[i].frameRate;
                        comps[i].displayStartTime = newStart / frameRate;
                    }
                }
            }

            var durationInput = setCompDurationInputGroup.add("edittext", undefined, "1");
            durationInput.size = [25, 25];
            durationInput.characters = 5;

            var changeCompDuration = setCompDurationInputGroup.add("button", undefined, "SET DURATION");
            changeCompDuration.onClick = function(){
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: changeCompDuration // :: //", "Log");
                var comps = app.project.items;
                var newDuration = parseFloat(durationInput.text);

                for (var i = 1; i <= comps.length; i++) {
                    if (comps[i] instanceof CompItem && comps[i].selected) {
                        comps[i].duration = newDuration;
                    }
                }
            }

            var CompToRefGroup = compToolsPanel.add("Panel", undefined, "");
            CompToRefGroup.orientation = 'column';

            var CompToRefBTN = CompToRefGroup.add("button", undefined, "REF TO COMP");
            CompToRefBTN.size = [280, 35];
            CompToRefGroup.graphics.backgroundColor = CompToRefGroup.graphics.newBrush(CompToRefGroup.graphics.BrushType.SOLID_COLOR, [0.2,0.1,0.1,1]);

            CompToRefBTN.onClick = function(){
                RefToComp();
            }

            var MakeGuideLayerBTN = CompToRefGroup.add("button", undefined, "REF TO GUIDE LAYER");
            MakeGuideLayerBTN.size = [280, 35];

            MakeGuideLayerBTN.onClick = function(){
                MakeGuideLayer();
            }

            var selectionGroup = layerSelectPanel.add("group", undefined, ''); 
            var OrderLayerGroup = layerSelectPanel.add("group", undefined, '');
            OrderLayerGroup.orientation = 'row';
            var layerOrderLayerGroup = OrderLayerGroup.add("group", undefined, '');
            var sequenceLayerGroup = OrderLayerGroup.add("group", undefined, '');
            var SnapParentGroup = layerSelectPanel.add("group", undefined, '');
            var addNullParentGroup = layerSelectPanel.add('group', undefined, '');
            var TransferAttrGroup = layerSelectPanel.add("group", undefined, '');

            showHideFontTextBtn = ToolSets.add('Button', undefined, '---------   FONT & TEXT    -------');
            showHideFontTextBtn.size = [300, 25];

            var EditTextPanel = ToolSets.add('Panel', undefined, '');
            EditTextPanel.orientation = 'column';
            EditTextPanel.graphics.backgroundColor = EditTextPanel.graphics.newBrush(EditTextPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
            EditTextPanel.alignment = ['fill', 'top'];
            EditTextPanel.visible = 0;
            EditTextPanel.maximumSize.height = 0;
            EditTextPanel.size = [300, 0];
            EditTextPanel.enabled = false;
            EditTextPanel.active = false;

            
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

            var sequenceBTN = sequenceLayerGroup.add('Button', undefined, "SEQUENCE");
            sequenceBTN.size = [145, 25];
            sequenceBTN.onClick = function(){
                sequenceLayers();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: sequenceLayers // :: //", "Log");
            }


            var layerOrderBTN = layerOrderLayerGroup.add('Button', undefined, "FLIP");
            layerOrderBTN.size = [145, 25];
            layerOrderBTN.onClick = function(){
                reverseLayerOrder();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: reverseLayerOrder // :: //", "Log");
            }

            var parentToBTN = SnapParentGroup.add('Button', undefined, "PARENT");
            parentToBTN.size = [145, 35];
            parentToBTN.onClick = function(){
                ParentTo();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: ParentTo // :: //", "Log");
            }

            var UnparentBTN = SnapParentGroup.add('Button', undefined, "UNPARENT");
            UnparentBTN.size = [145, 35];
            UnparentBTN.onClick = function(){
                Unparent();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: Unparent // :: //", "Log");
            }

            var addNullParentBTN = addNullParentGroup.add('Button', undefined, "ADD PARENT NULL");
            addNullParentBTN.size = [300, 25];
            addNullParentBTN.onClick = function(){
                addNullParent();
                dateHandler();
                appendLog("Function_Tracking", currentDateYMD + " " + userName + " // :: Function Name: addNullParent // :: //", "Log");
            }

            TransferAttrGroup.orientation = 'column';
            var pasteButton = TransferAttrGroup.add('Button', undefined, 'TRANSFER PROPERTIES');
            pasteButton.size = [300, 25];
            var transferCBGroup = TransferAttrGroup.add('group', undefined, '');
            transferCBGroup.orientation = 'row';
            // Checkboxes for each attribute
            var posCheckbox = transferCBGroup.add("checkbox", undefined, "Position");
            var scaleCheckbox = transferCBGroup.add("checkbox", undefined, "Scale");
            var rotCheckbox = transferCBGroup.add("checkbox", undefined, "Rotation");
            posCheckbox.value = scaleCheckbox.value = rotCheckbox.value = true; // Default to checked

            pasteButton.onClick = function(){
                pasteAttributes(posCheckbox.value, scaleCheckbox.value, rotCheckbox.value);
            }

            var inputText = EditTextPanel.add('EditText', undefined, '', {multiline: true});
            inputText.alignment = ['fill', 'center'];
            inputText.preferredSize = [300,200];

            var editTextBtn = EditTextPanel.add('Button', undefined, 'REPLACE TEXT');
            editTextBtn.preferredSize = [300,25];
            editTextBtn.onClick = function (){
                EditText_doSetText(inputText);
            } 

            showHideEditingBtn = ToolSets.add('Button', undefined, '------------   EDIT TOOLS    ----------');
            showHideEditingBtn.size = [300, 25];

            var AutoSplicePanel = ToolSets.add('Panel', undefined, '');
            AutoSplicePanel.graphics.backgroundColor = AutoSplicePanel.graphics.newBrush(AutoSplicePanel.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);

            AutoSplicePanel.orientation = 'column';
            AutoSplicePanel.alignment = ['fill', 'top'];
            AutoSplicePanel.visible = 0;
            AutoSplicePanel.maximumSize.height = 0;
            AutoSplicePanel.size = [300, 0];
            AutoSplicePanel.enabled = false;
            AutoSplicePanel.active = false;

            var AutoSpliceBTNGroup = AutoSplicePanel.add('Group', undefined, '');
            AutoSpliceBTNGroup.orientation = 'row';
            var AutoSpliceBTN = AutoSpliceBTNGroup.add('Button', undefined, 'AUTO-SPLICE FOOTAGE');

            var AutoSpliceGroup = AutoSplicePanel.add('Group', undefined, '');
            AutoSpliceGroup.orientation = 'row';
            var AutoSpliceLabel = AutoSpliceGroup.add('StaticText', undefined, 'THRESHOLD');
            AutoSpliceLabel.alignment = ['fill', 'center'];
            var AutoSpliceSlider = AutoSpliceGroup.add('Slider', undefined, '');
            AutoSpliceSlider.alignment = ['fill', 'center'];
            var AutoSpliceSliderInput = AutoSpliceGroup.add('EditText', undefined, 'Threshold');
            AutoSpliceSliderInput.alignment = ['fill', 'center'];

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

            showHideAnimationBtn.onClick = function (){
                if(animationToolsPanel.visible  == 1){
                    animationToolsPanel.visible = 0;
                    animationToolsPanel.maximumSize.height = 0;
                    animationToolsPanel.size = [300, 0];
                    animationToolsPanel.enabled = false;
                    animationToolsPanel.active = false;
                } else {
                    animationToolsPanel.visible = 1;
                    animationToolsPanel.maximumSize.height = 450;
                    animationToolsPanel.size = [300, 450];
                    animationToolsPanel.enabled = true;
                    animationToolsPanel.active = true;
                }
                    pal.layout.layout(true);
                    pal.layout.resize();
            }

            showHideLayersBtn.onClick = function (){
                if(layerSelectPanel.visible  == 1){
                    layerSelectPanel.visible = 0;
                    layerSelectPanel.maximumSize.height = 0;
                    layerSelectPanel.size = [300, 0];
                    layerSelectPanel.enabled = false;
                    layerSelectPanel.active = false;
                } else {
                    layerSelectPanel.visible = 1;
                    layerSelectPanel.maximumSize.height = 450;
                    layerSelectPanel.size = [300, 450];
                    layerSelectPanel.enabled = true;
                    layerSelectPanel.active = true;
                }

                    pal.layout.layout(true);
                    pal.layout.resize();
            } 


            showHideEditingBtn.onClick = function (){
                if(AutoSplicePanel.visible  == 1){
                    AutoSplicePanel.visible = 0;
                    AutoSplicePanel.maximumSize.height = 0;
                    AutoSplicePanel.size = [300, 0];
                    AutoSplicePanel.enabled = false;
                    AutoSplicePanel.active = false;
                } else {
                    AutoSplicePanel.visible = 1;
                    AutoSplicePanel.maximumSize.height = 450;
                    AutoSplicePanel.size = [300, 450];
                    AutoSplicePanel.enabled = true;
                    AutoSplicePanel.active = true;
                }

                    pal.layout.layout(true);
                    pal.layout.resize();
            } 

            showHideCompBtn.onClick = function (){
                if(compToolsPanel.visible  == 1){
                    compToolsPanel.visible = 0;
                    compToolsPanel.maximumSize.height = 0;
                    compToolsPanel.size = [300, 0];
                    compToolsPanel.enabled = false;
                    compToolsPanel.active = false;
                } else {
                    compToolsPanel.visible = 1;
                    compToolsPanel.maximumSize.height = 450;
                    compToolsPanel.size = [300, 450];
                    compToolsPanel.enabled = true;
                    compToolsPanel.active = true;
                }

                    pal.layout.layout(true);
                    pal.layout.resize();
            } 

            showHideFontTextBtn.onClick = function (){
                if(EditTextPanel.visible  == 1){
                    EditTextPanel.visible = 0;
                    EditTextPanel.maximumSize.height = 0;
                    EditTextPanel.size = [300, 0];
                    EditTextPanel.enabled = false;
                    EditTextPanel.active = false;
                } else {
                    EditTextPanel.visible = 1;
                    EditTextPanel.maximumSize.height = 450;
                    EditTextPanel.size = [300, 450];
                    EditTextPanel.enabled = true;
                    EditTextPanel.active = true;
                }

                    pal.layout.layout(true);
                    pal.layout.resize();
            } 

            pal.layout.layout(true);
            pal.layout.resize();

        }

        return pal;

    }        

    ////BUILD UI FUNCTION///////

    var rdetPal = Toolbox_Tools_buildUI(thisObj);
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