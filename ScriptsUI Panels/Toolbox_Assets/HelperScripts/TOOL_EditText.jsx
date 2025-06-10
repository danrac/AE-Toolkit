var inputText;

	function EditText_getSelectedTextLayers(){
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

	function EditText_doSetText(inputText){
		if (app.project === null)
			return;

		var comp = app.project.activeItem;
		if ((comp === null) || !(comp instanceof CompItem)){
			return;
		}
		var textLayers = EditText_getSelectedTextLayers();
		if (textLayers.length < 1){
			return;
		}

		app.beginUndoGroup("EditText");
		
		var newText = inputText.text;
		var currTime = comp.time;			
		if (newText === "")
			newText = " ";
			newText = new TextDocument(newText);
		
		for (var i=0; i<textLayers.length; i++){
			if (textLayers[i].property("sourceText").numKeys > 0)
				textLayers[i].property("sourceText").setValueAtTime(currTime, newText);
			else
				textLayers[i].property("sourceText").setValue(newText);
		}
		app.endUndoGroup();
	}

