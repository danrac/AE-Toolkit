(function TOOL_EditText(thisObj)
{
	// Globals
	
	var EditTextData = new Object();	// Store globals in an object
	EditTextData.scriptName = "Edit Text";
	EditTextData.scriptTitle = EditTextData.scriptName + " v3.0";
	
	EditTextData.maxTextChars = 255;		// Maximum number of characters supported by edittext control
	
	EditTextData.strTextHeading = {en: "Text (up to "+EditTextData.maxTextChars+" characters):"};
	EditTextData.strGetText = {en: "Get Text"};
	EditTextData.strSetText = {en: "Set Text"};
    EditTextData.strSetAllText = {en: "Set All Text"};
	EditTextData.strHelp = {en: "?"}
	EditTextData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project window, and try again."};
	EditTextData.strErrNoSingleTextLayerSel = {en: "Cannot perform operation. Please select a single text layer, and try again."};
	EditTextData.strErrNoTextLayersSel = {en: "Cannot perform operation. Please select at least one text layer, and try again."};
	EditTextData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	
	
	function EditText_localize(strVar)
	{
		return strVar["en"];
	}
	
	function EditText_buildUI(thisObj)
	{
        //var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", EditTextData.scriptName, undefined, {resizeable:true});
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", EditTextData.scriptName, undefined, {resizeable:true});		
        
		if (pal !== null)
		{
			var res =
			"group { \
				orientation:'column', alignment:['fill','fill'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + EditTextData.scriptName + "', alignment:['fill','center'] }, \
				}, \
				textField: EditText { alignment:['fill','fill'], properties:{multiline:true} }, \
				cmds: Group { \
                        alignment:['fill','bottom'], \
                        getTextBtn: Button { text:'" + EditText_localize(EditTextData.strGetText) + "', alignment:['right','bottom'], preferredSize:[-1,20] }, \
                        setTextBtn: Button { text:'" + EditText_localize(EditTextData.strSetText) + "', alignment:['right','bottom'], preferredSize:[-1,20] }, \
                        setAllTextBtn: Button { text:'" + EditText_localize(EditTextData.strSetAllText) + "', alignment:['right','bottom'], preferredSize:[-1,20] }, \
				}, \
			}";
                pal.grp = pal.add(res);
			
                pal.grp.textField.preferredSize = [100,40];
			
                pal.layout.layout(true);
                pal.grp.minimumSize = pal.grp.size;
                pal.layout.resize();
                pal.onResizing = pal.onResize = function () {this.layout.resize();}

                pal.grp.cmds.getTextBtn.onClick = EditText_doGetText;
                pal.grp.cmds.setTextBtn.onClick = EditText_doSetText;
                pal.grp.cmds.setAllTextBtn.onClick = EditText_doSetAllText;
		}
		
		return pal;
	}
	
	function EditText_getSelectedTextLayers()
	{
		var textLayers = new Array();
		
		// Check that a project exists
		if (app.project !== null)
		{
			// Get the current (active/frontmost) comp
			var comp = app.project.activeItem;
			
			if ((comp !== null) && (comp instanceof CompItem))
			{
				// Search the selected layers for text layers
				for (var i=0; i<comp.selectedLayers.length; i++)
					if (comp.selectedLayers[i].property("sourceText") !== null)
						textLayers[textLayers.length] = comp.selectedLayers[i];
			}
		}
		
		return textLayers;
	}

	function EditText_getAllTextLayers()
	{
		var textLayers = new Array();
         
		// Check that a project exists
		if (app.project !== null)
		{
			// Get the current (active/frontmost) comp

            var comp = app.project.activeItem;
            
			if ((comp !== null) && (comp instanceof CompItem))
			{
				// Search the selected layers for text layers
			for (var i=0; i<comp.selectedLayers.length; i++)
					if (comp.selectedLayers[i].property("sourceText") !== null)
						textLayers[textLayers.length] = comp.selectedLayers[i];
			}
		}
		return textLayers;
	}

    function SelectAllLayers(){
        var myComp = app.project.activeItem;
        var myLayers = myComp.layers;
            
        for (var i = 1; i <= myLayers.length; i++) 
        {
            myLayers[i].selected = true;	
        }        
    }
	
	
	function EditText_doGetText()
	{
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			//alert(EditText_localize(EditTextData.strErrNoCompSel), EditTextData.scriptName);
			return;
		}
		
		// Get the selected text layers
		var textLayers = EditText_getSelectedTextLayers();
		
		// Make sure we have only one text layer selected
		if (textLayers.length !== 1)
		{
			alert(EditText_localize(EditTextData.strErrNoSingleTextLayerSel), EditTextData.scriptName);
			return;
		}
		
		var rawText = textLayers[0].property("sourceText").value.text;
		// On Windows only, include newlines with carriage returns so that multi-line text appears as expected
		if ($.os.indexOf("Windows") !== -1)
			rawText = rawText.replace(/\r/g, "\r\n");
		
		// Visualize carriage returns as separate lines in the text field
		rdetPal.grp.textField.text = new TextDocument(rawText);
	}
	
	
	function EditText_doSetText()
	{
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(EditText_localize(EditTextData.strErrNoCompSel), EditTextData.scriptName);
			return;
		}
		
		// Get the selected text layers
		var textLayers = EditText_getSelectedTextLayers();
		
		// Make sure we have at least one text layer selected
		if (textLayers.length < 1)
		{
			alert(EditText_localize(EditTextData.strErrNoTextLayersSel), EditTextData.scriptName);
			return;
		}
		
		// Perform the actual updating of selected text layers
		app.beginUndoGroup(EditTextData.scriptName);
		
		var newText = this.parent.parent.textField.text;
		var currTime = comp.time;
		
		// Due to a limitation with setting a text layer to a blank string, we need to set it to a blank character
		if (newText === "")
			newText = " ";
		newText = new TextDocument(newText);
		
		for (var i=0; i<textLayers.length; i++)
		{
			// Create a Source Text key only if previous keyframed
			if (textLayers[i].property("sourceText").numKeys > 0)
				textLayers[i].property("sourceText").setValueAtTime(currTime, newText);
			else
				textLayers[i].property("sourceText").setValue(newText);
		}
		
		app.endUndoGroup();
	}

	function EditText_doSetAllText()
	{
        SelectAllLayers();

        // Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(EditText_localize(EditTextData.strErrNoCompSel), EditTextData.scriptName);
			return;
		}
		
		// Get the selected text layers
		var textLayers = EditText_getAllTextLayers();
		
		// Make sure we have at least one text layer selected
		if (textLayers.length < 1)
		{
			alert(EditText_localize(EditTextData.strErrNoTextLayersSel), EditTextData.scriptName);
			return;
		}
		
		// Perform the actual updating of selected text layers
		app.beginUndoGroup(EditTextData.scriptName);
		
		var newText = this.parent.parent.textField.text;
		var currTime = comp.time;
		
		// Due to a limitation with setting a text layer to a blank string, we need to set it to a blank character
		if (newText === "")
			newText = " ";
		newText = new TextDocument(newText);
        
		for (var i=0; i<textLayers.length; i++)
		{
			// Create a Source Text key only if previous keyframed
			if (textLayers[i].property("sourceText").numKeys > 0)
				textLayers[i].property("sourceText").setValueAtTime(currTime, newText);
			else
				textLayers[i].property("sourceText").setValue(newText);
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
        if (parseFloat(app.version) < 10.0)
            alert(EditText_localize(EditTextData.strMinAE100), EditTextData.scriptName);
        else
        {
            // Build and show the console's floating palette
            var rdetPal = EditText_buildUI(thisObj);
            if (rdetPal !== null)
            {
                EditText_doGetText();
                
                if (rdetPal instanceof Window)
                {
                    // Show the palette
                    rdetPal.center();
                    rdetPal.show();
                }
                else
                    rdetPal.layout.layout(true);
            }
        }
    }
)(this);
