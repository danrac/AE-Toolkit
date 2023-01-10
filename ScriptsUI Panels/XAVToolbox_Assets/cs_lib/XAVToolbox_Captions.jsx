
(function XAVToolbox_Captions(thisObj)
{
	// Globals
    var scriptFile = new File($.fileName);
    var scriptPath = scriptFile.parent.fsName;
    var size = 25;
    var margin = 0.5;
    var newFillColor = [1, 1, 1];
	var XAVToolbox_CaptionsData = new Object();	// Store globals in an object
	XAVToolbox_CaptionsData.scriptName = "XAVToolbox_Captions";
	XAVToolbox_CaptionsData.scriptTitle = XAVToolbox_CaptionsData.scriptName + " v1.0";
	XAVToolbox_CaptionsData.maxTextChars = 255;		// Maximum number of characters supported by edittext control
	XAVToolbox_CaptionsData.strTextHeading = {en: "Text (up to "+XAVToolbox_CaptionsData.maxTextChars+" characters):"};
	XAVToolbox_CaptionsData.strHelp = {en: "?"}
	XAVToolbox_CaptionsData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project window, and try again."};
	XAVToolbox_CaptionsData.strErrNoSingleTextLayerSel = {en: "Cannot perform operation. Please select a single text layer, and try again."};
	XAVToolbox_CaptionsData.strErrNoTextLayersSel = {en: "Cannot perform operation. Please select at least one text layer, and try again."};
	XAVToolbox_CaptionsData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
        
    	function XAVToolbox_Captions_localize(strVar)
    	{
    		return strVar["en"];
    	}
    	
    	function XAVToolbox_Captions_buildUI(thisObj)
    	{
            var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", XAVToolbox_CaptionsData.scriptName, undefined, {resizeable:true});		
            
    		if (pal !== null)
    		{
    			var res =
                    "group { \
    				orientation:'column', alignment:['fill','top'], \
                    cmds3: Group {orientation:'row', alignment:['center','center'], \
                        title: StaticText { text:'" + "Start Time:" + "', alignment:['left','center']} , \
                        startTimeField: EditText { alignment:['left','center'], preferredSize:[20,20], properties:{multiline:false} }, \
                        alignment:['fill','top'], \
                        title: StaticText { text:'" + "Font Size:" + "', alignment:['left','center']} , \
                        fontSizeField: EditText { alignment:['left','center'], preferredSize:[20,20], properties:{multiline:false} }, \
                        alignment:['fill','top'], \
                        title: StaticText { text:'" + "Text Color:" + "', alignment:['left','center']} , \
                    }, \
                    cmds1: Group {orientation:'row', alignment:['left','bottom'], \
                        title: StaticText { text:'" + "Filepath:" + "', alignment:['left','center']} , \
                        textFilepathField: EditText { alignment:['center','center'], preferredSize:[100,20], properties:{multiline:false} }, \
                        alignment:['fill','top'], \
                        getCaptionFilepath: Button { text:'Caption File', alignment:['fill','bottom'], preferredSize:[100,25] }, \
                    }, \
    				cmds2: Group { \
                        alignment:['fill','top'], \
                        GenereateMarkersBtn: Button { text:'Generate Markers', alignment:['fill','bottom'], preferredSize:[100,25] }, \
    					alignment:['fill','top'], \
                        CreateCaptionsBtn: Button { text:'Create Captions', alignment:['fill','bottom'], preferredSize:[100,25] }, \
    				}, \
                    }";

                    fontsDD = pal.add("dropdownlist", undefined, []);
                    fontsDD.size = [360, 25];
                    var bt = new BridgeTalk();
                    bt.target = "indesign";
                    bt.body = "var fonts = [];\
                                    var fontsFile = File('" + scriptPath + "/fonts.txt');\
                                    if(!fontsFile.exists) {\
                                    fontsFile.open('w');\
                                    for(var i = 0; i < app.fonts.length; i++) { \
                                    fontsFile.writeln(app.fonts[i].postscriptName);\
                                    } \
                                    fontsFile.close();\
                                    }";
                    bt.onResult = function(res) {
                    var arr = eval(res.body);
                    var fontFile = File(scriptPath + "/fonts.txt");
                    fontFile.open("r");
                    do {
                        fontsDD.add("item", fontFile.readln());
                        } while(!fontFile.eof);
                    fontFile.close();
                    fontsDD.selection = 0;
                    }
                    bt.send();

                    pal.graphics.backgroundColor = pal.graphics.newBrush(pal.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
                    pal.grp = pal.add(res);
                    pal.onResizing = pal.onResize = function () {this.layout.resize();}
                    pal.grp.cmds1.textFilepathField.preferredSize = [200,25];
                    pal.grp.cmds1.textFilepathField.text = "Text file path...";
                    pal.grp.cmds1.getCaptionFilepath.onClick = getCaptionFilepath;
                    pal.grp.cmds2.GenereateMarkersBtn.onClick = generateMarkers;
                    pal.grp.cmds2.CreateCaptionsBtn.onClick = createCaptions;
                    pal.grp.cmds3.startTimeField.text = 0;
                    pal.grp.cmds3.fontSizeField.text = 74;
                    pal.grp.cmds3.color_grp = pal.grp.cmds3.add("group", undefined, "GroupOne");  
                    pal.grp.cmds3.color_grp.alignment = ["fill", "center"];
                    pal.grp.cmds3.color_grp.location = [margin,margin];
                    pal.grp.cmds3.color_grp.size = [size*2,size];
                    pal.grp.cmds3.color_grp.graphics.backgroundColor = pal.grp.cmds3.color_grp.graphics.newBrush(pal.grp.cmds3.color_grp.graphics.BrushType.SOLID_COLOR, newFillColor);
                    pal.grp.cmds3.color_grp.addEventListener ("click", function (m){handleMouseDownFC(m,pal.grp.cmds3.color_grp)});
                    pal.layout.layout(true);
                    pal.grp.minimumSize = pal.grp.size;
                    pal.layout.resize();
    		}
    		
    		return pal;
    	}

        function getCaptionFilepath(){
            var CaptionFile = new File(File.openDialog("Select caption text file", "*.txt", false));
            var textpathField = this.parent.parent.cmds1.textFilepathField;
            if(CaptionFile != null){
                textpathField.text = CaptionFile.fsName;          
            }else{
                textpathField.text = "Caption filepath here...";
            }
        }

        function loadCaptions(textpathField){
            var CaptionFile = new File(textpathField);
            var txtFile;
            var captionArr = [];
            var textString;
            if(CaptionFile != null){      
                txtFile = CaptionFile.open("r");
                textString = CaptionFile.read();
            }
            return textString;
        }
    	
    	function generateMarkers(){
    		    app.beginUndoGroup(XAVToolbox_CaptionsData.scriptName);
                var textpathField = this.parent.parent.cmds1.textFilepathField.text;
                var startTime = parseInt(this.parent.parent.cmds3.startTimeField.text);
                var captions = loadCaptions(textpathField);
                var captionArr = [];
                var tempCaptionArr = captions.split("\n");
                for(var i = 0; i <= tempCaptionArr.length - 1; i++){
                    if(tempCaptionArr[i] != ""){
                        captionArr.push(tempCaptionArr[i]);
                    }
                }
                var compDuration;
                var newNull;
                var gridCenterX = 960;
                var gridCenterY = 540;
                var comp = app.project.activeItem;
                if(comp == null){
                	alert("Please select a comp.");
                }
                else {
                    comp.openInViewer();
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
                var markerTime = startTime;
                var markerTimeIncrement = comp.duration / captionArr.length;

                var marker = new MarkerValue("");
                for(var i = 0; i <= captionArr.length - 1; i++){
                    marker.comment = captionArr[i];
                    newNull.property("Marker").setValueAtTime(markerTime, marker);
                    markerTime += markerTimeIncrement;
                }

    			app.endUndoGroup();    
    	}

    	function createCaptions() {
                app.beginUndoGroup(XAVToolbox_CaptionsData.scriptName);
                var textFont = fontsDD.selection.toString();
                var textSize = parseInt(this.parent.parent.cmds3.fontSizeField.text);
                var textColor = newFillColor;
                var comp = app.project.activeItem;
                var newNull = comp.layer("control_null");
                var compCenterX = comp.width / 2;
                var compCenterY = comp.height / 2;
                if(comp == null){
                    alert("Please select a comp.");
                }
                else {
                    comp.openInViewer();
                    if(newNull == null){
                        alert("Please generate markers first.");
                    }
                }
                
                newNull.property("Position").setValue([compCenterX, compCenterY]);
                nullEffects = newNull.Effects;
                for (j = nullEffects.numProperties; j > 0; j--){
                    nullEffects.property(j).remove();
                }

                var newCaptionLayer;
                var captionColorControl = newNull.Effects.addProperty("ADBE Color Control" );
                captionColorControl.name = "Text Color";
                captionColorControl.property("Color").setValue(textColor);
                for(var i = newNull.property("Marker").numKeys; i > 0; i--){
                    newCaptionLayer = comp.layers.addText(newNull.property("Marker").keyValue(i).comment);
                    newCaptionLayer.inPoint = newNull.property("Marker").keyTime(i);
                    
                    var mainTextDocument = newCaptionLayer.property("ADBE Text Properties").property("ADBE Text Document");
                    var textDocument1 = mainTextDocument.value;
                    textDocument1.resetCharStyle();
                    textDocument1.font = textFont;
                    textDocument1.fontSize = textSize;
                    textDocument1.justification = ParagraphJustification.CENTER_JUSTIFY;
                    mainTextDocument.setValue(textDocument1);

                    if(i != newNull.property("Marker").numKeys){
                        newCaptionLayer.outPoint = newNull.property("Marker").keyTime(i + 1);
                    }
                    var captionFillColor = newCaptionLayer.Effects.addProperty("ADBE Fill");
                    captionFillColor.property("ADBE Fill-0002").expression = 'thisComp.layer("control_null").effect("Text Color")("Color")';
                    newCaptionLayer.parent = newNull;
                    newCaptionLayer.selected = false;
                }
                newNull.property("Position").setValue([960, 1000]);
                newNull.selected = true;
                newNull.moveToBeginning();
                app.endUndoGroup();        
    	}

        function handleMouseDownFC(ev,theButton){
            colorpickerFace();
            theButton.graphics.backgroundColor = theButton.graphics.newBrush(theButton.graphics.BrushType.SOLID_COLOR, newFillColor, 1);
        }

        function colorpickerFace (result_color){
            var hexToRGB = function(hex) {
            var r = hex >> 16;var g = hex >> 8 & 0xFF;var b = hex & 0xFF;
            return [r, g, b];    };
            var color_decimal = $.colorPicker();
            if (color_decimal<0) return null;    // added this line, to handle the case where the dialog is dismissed (else: errors)
            var color_hexadecimal = color_decimal.toString(16);
            var color_rgb = hexToRGB(parseInt(color_hexadecimal, 16));
            var result_color = [color_rgb[0] / 255, color_rgb[1] / 255, color_rgb[2] / 255]; 
            newFillColor = result_color;                              
            return result_color;
        }

        if (parseFloat(app.version) < 10.0)
            alert(XAVToolbox_Captions_localize(XAVToolbox_CaptionsData.strMinAE100), XAVToolbox_CaptionsData.scriptName);
        else{
            var rdetPal = XAVToolbox_Captions_buildUI(thisObj);
            if (rdetPal !== null){
                if (rdetPal instanceof Window){
                    rdetPal.center();
                    rdetPal.show();
                } else
                    rdetPal.layout.layout(true);
            }
        }
    }
)(this);
