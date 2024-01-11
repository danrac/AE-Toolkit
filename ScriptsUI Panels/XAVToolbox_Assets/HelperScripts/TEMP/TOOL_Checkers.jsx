(function Checker_Tools(thisObj) {

#include "UTILITY_SaveLogs.jsx";
#include "UTILITY_DateHandler.jsx";
#include "UTILITY_Functions.jsx";

var scriptFile = new File($.fileName);
var scriptPath = scriptFile.parent.fsName;

var StudioDDList = new Array();
var SizeDDList = new Array();
var currentStudioName = "";
var SizeDD;
var mainComp = null;
var frameNumberInput = null;
var selectedFrame = 0;
var LineOneInput = null;
var LineTwoInput = null;
var DateInput = null;
var SpotInput = null;

var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "CHECKERS", undefined, { resizeable: false });

function Checker_Tools_buildUI(thisObj) {

        if (pal != null) {
			StudioDDList = [];
			SizeDDList = [];

			createLog("Checkers/Default_StudioList", StudioDDList, "Library");
			createLog("Checkers/Default_SizeList", SizeDDList, "Library");

			StudioDDList = readLog('Checkers/Default_StudioList', 'Library').split('\n');			
			SizeDDList = readLog('Checkers/Default_SizeList', 'Library').split('\n');

            var mainPanel = pal.add('Group', undefined, '');
            mainPanel.orientation = 'column';
            mainPanel.alignChildren = ['left', 'top'];

			var dropdownGroup = mainPanel.add('Group', undefined, '');
			dropdownGroup.orientation = 'row';
			dropdownGroup.size = ['center', 'center'];
			
			var StudioGroup = dropdownGroup.add('Group', undefined, '');
			StudioGroup.orientation = 'column';

			var studioLable = StudioGroup.add("StaticText", undefined, "CLIENT SPECS:");
			studioLable.alignment = ['left', 'center'];
            var StudioDD = StudioGroup.add("dropdownlist", undefined, StudioDDList);
            StudioDD.size = [150, 25];
            StudioDD.selection = 0;

			
			var SizeGroup = dropdownGroup.add('Panel', undefined, '');
			SizeGroup.orientation = 'column';

			var sizeLable = SizeGroup.add("StaticText", undefined, "ASPECT RATIO:");
			sizeLable.alignment = ['left', 'center'];
            SizeDD = SizeGroup.add("dropdownlist", undefined, SizeDDList);
			SizeDD.size = [150, 25];

        	SizeDD.removeAll();
            for (var i = 0; i <= SizeDDList.length - 1; i++) {
                var tmpArr = SizeDDList[i].split(',');
                SizeDD.add("item", tmpArr[0]);
            }
            SizeDD.selection = 0;

			StudioDD.onChange = function(){
				if(StudioDD.selection != 0){
					var tempStudioName = StudioDD.selection.toString();
					var nameArr =  tempStudioName.split('_');
					currentStudioName = nameArr[0];
					createLog('Checkers/' + currentStudioName + '_SizeList', SizeDDList, "Library");	
					SizeDDList = readLog('Checkers/' + currentStudioName + '_SizeList', 'Library').split('\n');
                	SizeDD.removeAll();
	                for (var i = 0; i <= SizeDDList.length - 1; i++) {
	                    var tmpArr = SizeDDList[i].split(',');
	                    SizeDD.add("item", tmpArr[0]);
	                }
	                SizeDD.selection = 0;

	                pal.layout.layout(true);
	                pal.layout.resize();

				} else {
					SizeDDList = readLog('Checkers/Default_SizeList', 'Library').split('\n');
					SizeDD.removeAll();
					for (var i = 0; i <= SizeDDList.length - 1; i++) {
	                    var tmpArr = SizeDDList[i].split(',');
	                    SizeDD.add("item", tmpArr[0]);
	                }
	                SizeDD.selection = 0;
	                
	                pal.layout.layout(true);
	                pal.layout.resize();
				}
			}

			var coverPanel = mainPanel.add('Panel', undefined, '');
            coverPanel.orientation = 'column';
            coverPanel.alignment = ['center','center'];

            var CoverInputGroupA = coverPanel.add('Group', undefined, '');
            CoverInputGroupA.orientation = 'row';
            CoverInputGroupA.alignment = ['center','center'];

			var LineOneLable = CoverInputGroupA.add('StaticText', undefined, 'LINE1:');
			LineOneLable.alignment = ['left', 'center'];
			var LineOneInput = CoverInputGroupA.add('EditText', undefined, "Top Line...");
			LineOneInput.alignment = ['fill', 'center'];
			LineOneInput.size = [100, 25];

			var LineTwoLable = CoverInputGroupA.add('StaticText', undefined, 'LINE2:');
			LineTwoLable.alignment = ['left', 'center'];
			var LineTwoInput = CoverInputGroupA.add('EditText', undefined, "Bottom Line...");
			LineTwoInput.alignment = ['fill', 'center'];
			LineTwoInput.size = [100, 25];

            var CoverInputGroupB = coverPanel.add('Group', undefined, '');
            CoverInputGroupB.orientation = 'row';
            CoverInputGroupB.alignment = ['center','center'];

			var DateLable = CoverInputGroupB.add('StaticText', undefined, 'DATE:')
			var DateInput = CoverInputGroupB.add('EditText', undefined, "");
			DateInput.size = [100, 25];

			DateInput.text = GetDateMDY();

			var SpotLable = CoverInputGroupB.add('StaticText', undefined, 'SPOT:')
			var SpotInput = CoverInputGroupB.add('EditText', undefined, "Name and Version");
			SpotInput.size = [100, 25];
            
            var CreateCoverBTN = coverPanel.add('Button', undefined, 'CREATE COVER');
            CreateCoverBTN.size = [300, 25];

			CreateCoverBTN.onClick = function(){
            	var tmpArr = SizeDDList[SizeDD.selection.index].split(',');
    			CoverSetup(tmpArr, LineOneInput.text, LineTwoInput.text, DateInput.text, SpotInput.text);
    		}

			var checkerPanel = mainPanel.add('Panel',undefined,'');
			checkerPanel.orientation = 'row';
			checkerPanel.alignment = ['center', 'center'];

			var frameNumberInputGroup = checkerPanel.add('Group', undefined, '');
			frameNumberInputGroup.orientation = 'row';
			
			var frameNumberLable = frameNumberInputGroup.add('StaticText', undefined, 'FRAME:')
			frameNumberInput = frameNumberInputGroup.add('EditText', undefined, 10);
			frameNumberInput.size = [35, 25];

			var BTNGroup = checkerPanel.add('Group', undefined, '');
			BTNGroup.orientation = 'row';
			BTNGroup.alignment = ['center', 'center'];

			var CreateCheckerBTN = BTNGroup.add('Button', undefined, 'CREATE CHECKER');
            CreateCheckerBTN.size = [100, 25];
            
            CreateCheckerBTN.onClick = function(){
	            var tmpArr = SizeDDList[SizeDD.selection.index].split(',');
        		CheckerSetup(tmpArr);
            }

            var RenderCheckerBTN = BTNGroup.add('Button', undefined, 'RENDER CHECKER');
            RenderCheckerBTN.size = [100, 25];
		
			selectedFrame = parseFloat(frameNumberInput.text);
			frameNumberInput.onChange =function(){
				selectedFrame = parseFloat(frameNumberInput.text);
			}

        }
        pal.layout.layout(true);
        pal.layout.resize();
        return pal;

    }   

    function CheckerSetup(inputArray){
    	    var selectedItems = new Array();
            selectionName = SizeDD.selection.toString();
            var selectedComps = new Array();
            for (var x = 1; x <= app.project.numItems; x++){
                if (app.project.item(x).selected){
                    selectedComps.push(app.project.item(x));    
                }
            }
            for (var i = 0; i <= selectedComps.length - 1; i++){                    
                mainComp = selectedComps[i];
				BuildChecker(i, inputArray[1], inputArray[2], inputArray[3], parseInt(inputArray[4]), parseInt(inputArray[5]), parseInt(inputArray[6]), parseInt(inputArray[7]), inputArray[8], inputArray[9], inputArray[10], parseInt(inputArray[11]), parseInt(inputArray[12]), inputArray[13], parseInt(inputArray[14]), parseInt(inputArray[15]), inputArray[16]);
			}

    }

	function BuildChecker(numberid, newchart, newhdchart, newmatte, sizeX, sizeY, offsetX, offsetY, linereturn, textalignment, nameprefix, ltx, lty, lta, stx, sty, sta){
        var currentChart = ChartCheck(newchart);
        var currentHDChart = ChartCheck(newhdchart);
        var currentMatte = ChartCheck(newmatte);

		var textalignmentJustification;
		var legalTextJustification;
		var socialTextJustification;

		if(textalignment == "ParagraphJustification.CENTER_JUSTIFY"){
			textalignmentJustification = ParagraphJustification.CENTER_JUSTIFY;
		} else if(textalignment == "ParagraphJustification.LEFT_JUSTIFY"){
			textalignmentJustification = ParagraphJustification.LEFT_JUSTIFY;
		} else if (textalignment == "ParagraphJustification.RIGHT_JUSTIFY"){
			textalignmentJustification = ParagraphJustification.LEFT_JUSTIFY;
		}

		if(lta == "ParagraphJustification.CENTER_JUSTIFY"){
			legalTextJustification = ParagraphJustification.CENTER_JUSTIFY;
		} else if(lta == "ParagraphJustification.LEFT_JUSTIFY"){
			legalTextJustification = ParagraphJustification.LEFT_JUSTIFY;
		} else if (lta == "ParagraphJustification.RIGHT_JUSTIFY"){
			legalTextJustification = ParagraphJustification.LEFT_JUSTIFY;
		}

		if(sta == "ParagraphJustification.CENTER_JUSTIFY"){
			socialTextJustification = ParagraphJustification.CENTER_JUSTIFY;
		} else if(sta == "ParagraphJustification.LEFT_JUSTIFY"){
			socialTextJustification = ParagraphJustification.LEFT_JUSTIFY;
		} else if (sta == "ParagraphJustification.RIGHT_JUSTIFY"){
			socialTextJustification = ParagraphJustification.LEFT_JUSTIFY;
		}


        var prefixsplitArr = nameprefix.split('_');
        var prefixShort = prefixsplitArr[0];
        var newCompName = nameprefix + "0" + (numberid + 1) + "_" +  mainComp.name;
        var checkerComp = app.project.items.addComp(newCompName, sizeX, sizeY, 1, mainComp.duration, mainComp.frameRate);

        var socialCompName = nameprefix + "replacewithyoursocials";
        var legalCompName = nameprefix + "replacewithyourlegals";
        var socialComp = null;
        var legalComp = null;
        for(var i = 1; i <= app.project.numItems; i++){
            if(app.project.item(i).name == socialCompName){
                socialComp = app.project.item(i);
            }
            if(app.project.item(i).name == legalCompName){
                legalComp = app.project.item(i);
            }
        }

        if(socialComp == null){
            socialComp = app.project.items.addComp(nameprefix + "replacewithyoursocials", sizeX, sizeY, mainComp.pixelAspect, mainComp.duration, mainComp.frameRate);                
        }

        if(legalComp == null){
            legalComp = app.project.items.addComp(nameprefix + "replacewithyourlegals", sizeX, sizeY, mainComp.pixelAspect, mainComp.duration, mainComp.frameRate);
        }

        var renderComp = checkerComp.layers.add(mainComp);
        var legalLayer = checkerComp.layers.add(legalComp);
        var socialLayer = checkerComp.layers.add(socialComp);
        legalLayer.enabled = false;
        socialLayer.enabled = false;
        
        var chartLayer = checkerComp.layers.add(currentChart);
        chartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
        chartLayer.property("Opacity").setValue(50);
        
        if(chartnameHD != " "){
            var hdchartLayer = checkerComp.layers.add(currentHDChart);
            hdchartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
            hdchartLayer.property("Opacity").setValue(50);
        }

        checkerComp.time = 0;
        var checkerlayer = checkerComp.layer(mainComp.name);
        socialText = "";
        legalText = "";
        var socialCompText = checkerComp.layers.addText("social");
        socialCompText.enabled = true;
        var legalCompText = checkerComp.layers.addText("legal");
        legalCompText.enabled = true;
        var compInfoText = checkerComp.layers.addText("temp text");
        compInfoText.enabled = true;
        var mainTextDocument = compInfoText.property("ADBE Text Properties").property("ADBE Text Document")
        var textDocument1 = mainTextDocument.value;
        var mainTextDocument2 = socialCompText.property("ADBE Text Properties").property("ADBE Text Document")
        var textDocument2 = mainTextDocument2.value;
        var mainTextDocument3 = legalCompText.property("ADBE Text Properties").property("ADBE Text Document")
        var textDocument3 = mainTextDocument3.value;
        var PreCompsFolder = getFolderByName("PreComps");
        legalComp.parentFolder = PreCompsFolder;
        socialComp.parentFolder = PreCompsFolder;
        textDocument1.resetCharStyle();
        textDocument1.fontSize = 12;
        textDocument1.fillColor = [1, 1, 1];
        textDocument1.font = systemFont;
        textDocument1.text = checkerText;
        textDocument1.justification = textalignmentJustification;
        textDocument2.resetCharStyle();
        textDocument2.fontSize = 12;   
        textDocument2.fillColor = [1, 1, 1];
        textDocument2.font = systemFont;
        textDocument2.text = socialText;
        textDocument2.justification = socialTextJustification;
        textDocument3.resetCharStyle();
        textDocument3.fontSize = 12;   
        textDocument3.fillColor = [1, 1, 1];
        textDocument3.font = systemFont;
        textDocument3.text = legalText;
        textDocument3.justification = legalTextJustification;
        mainTextDocument.setValue(textDocument1);
        mainTextDocument2.setValue(textDocument2);
        mainTextDocument3.setValue(textDocument3);
        compInfoText.transform.position.setValue([offsetX, offsetY]);
        compInfoText.opacity.setValue(50);
        compInfoText.name = "comp filename";
        socialCompText.transform.position.setValue([stx, sty * 2]);
        socialCompText.opacity.setValue(50);
        socialCompText.name = "social filename";
        legalCompText.transform.position.setValue([ltx, lty * 3]);
        legalCompText.opacity.setValue(50);
        legalCompText.name = "legal filename";
        var textLayerPosExpression = "[" + offsetX + "," + offsetY + "];";
        var sLayerPosExpression = "[" + ltx + "," + lty + "];";
        var lLayerPosExpression = "[" + stx + "," + sty + "];";
        compInfoText.transform.position.expression = textLayerPosExpression;
        var textLayerExpression = "Date(0).toUpperCase() + \"" + linereturn + "   FILENAME: \" + thisComp.layer(thisComp.numLayers).name + \"    CHECKER GENERATED AT FRAME: \" +  timeToCurrentFormat(thisComp.layer(" + '"' + mainComp.name + '"' + ").timeRemap.valueAtTime(0)) +  \"      FPS: \" + (1.0 / thisComp.frameDuration).toFixed(3);";
        compInfoText.sourceText.expression = textLayerExpression;
        var socialLayerExpression = "" + '"' + "SOCIAL:" + '"' + " + thisComp.layer(" + '"' + socialComp.name + '"' + ").name.toUpperCase()";
        socialCompText.sourceText.expression = socialLayerExpression;
        socialCompText.transform.position.expression = sLayerPosExpression;
        var legalLayerExpression = "" + '"' + "LEGAL LINE:" + '"' + " + thisComp.layer(" + '"' + legalComp.name + '"' + ").name.toUpperCase()";
        legalCompText.sourceText.expression = legalLayerExpression;
        legalCompText.transform.position.expression = lLayerPosExpression;
        checkerlayer.timeRemapEnabled = true;
        var timeRemapProp = checkerlayer.property("ADBE Time Remapping");
        var times = 0;
        var frameNumInSec = selectedFrame / checkerComp.frameRate;
        var values = frameNumInSec;
        timeRemapProp.setValueAtTime(times, values);
        timeRemapProp.setValueAtTime(checkerComp.duration, values);
        app.project.timeDisplayType = TimeDisplayType.FRAMES;
        app.project.footageTimecodeDisplayStartType = FootageTimecodeDisplayStartType.FTCS_USE_SOURCE_MEDIA;
        colorLabel(checkerComp.name, 14);
    }

    function CoverSetup(inputArray, lineA, lineB, dateIn, spotIn){
        getCurrentDate();
        deselectAll();
        var CPname = inputArray[17];
        var lineoneInput = lineA;
        var linetwoInput = lineB;
        var dateInput = dateIn;
        var spotInput = spotIn;
		cpnametmpArr = inputArray[0].split(' ');
        var cpCompName =  cpnametmpArr[0] + "_COVER"
        var importOptions = new ImportOptions();
        
        var imagesFolder = getFolderByName("Images");
        var scriptPathStripArr = scriptPath.split('/');
        var tmpArr = new Array();
        var newCleanPath = "";
        for(x = 0; x <= scriptPathStripArr.length - 2; x++){
        	tmpArr.push(scriptPathStripArr[x]);
        }
        
        tmpArr.push('ImageResources/');
        newCleanPath = tmpArr.join('/');

        var filePath = newCleanPath + CPname;
        importOptions.file = new File(filePath);
        importOptions.sequence = false;
        if (importOptions.canImportAs(ImportAsType.COMP)) {
            importOptions.importAs = ImportAsType.COMP;
        }
        var importedFile = app.project.importFile(importOptions);
        var buildOptions = parseBuildOptionsHelperScriptToArr();
        var imagesFolder = getFolderByName(buildOptions[3]);
        var splitArr = CPname.split('.');
        var importedFolderName = splitArr[0] + " Layers";
        var importedFolder = getFolderByName(importedFolderName);
        importedFolder.parentFolder = imagesFolder;
        BuildCover(lineoneInput, linetwoInput, dateInput, spotInput, inputArray[0]);
        colorLabel(cpCompName, 14);
        moveToRoot(cpCompName);
    }

    function BuildCover(lonein, ltwoin, datein, spotin, mattetype){
        getCompByName(cpCompName);
        var cpComp;
        for(var i = 1; i <= app.project.numItems; i++){
            if(app.project.item(i).selected){
                cpComp = app.project.item(i);
            }
        }            
        var convertList = new Array();
        convertList.push(cpComp.layer(1));
        convertList.push(cpComp.layer(2));
        convertList.push(cpComp.layer(3));
        convertList.push(cpComp.layer(4));
        convertList.push(cpComp.layer(9));
        for(var i = 0; i <= convertList.length - 1; i++){
			convertList[i].selected = true;
        }
        cpComp.openInViewer();
        app.executeCommand(3799); //CONVERT TO EDITABLE
        var lineoneLayer = cpComp.layer(1);
        var linetwoLayer = cpComp.layer(2);
        var dateLayer = cpComp.layer(3);
        var spotNameLayer = cpComp.layer(4);
        var matteTypeLayer = cpComp.layer(9);
        var lonetextDocument = new TextDocument(lonein);
        lineoneLayer.property("Source Text").setValue(lonetextDocument);
        var ltwotextDocument = new TextDocument(ltwoin);
        linetwoLayer.property("Source Text").setValue(ltwotextDocument);
        var datetextDocument = new TextDocument(datein);
        dateLayer.property("Source Text").setValue(datetextDocument);
        var spottextDocument = new TextDocument(spotin);
        spotNameLayer.property("Source Text").setValue(spottextDocument);
        var mattetextDocument = new TextDocument(mattetype);
        matteTypeLayer.property("Source Text").setValue(mattetextDocument);
        if(lonein == "Top line..."){
            lineoneLayer.enabled = false;
            lonein = "";
        }
        if(ltwoin == "Bottom line..."){
            linetwoLayer.enabled = false;
            ltwoin = "";
        }
        cpComp.name = cpComp.name;
        cpCompName = cpComp.name;
    }

    function ChartCheck(newchartname){
		if(newchartname != ""){
		    var itemMatch;
		    var itemMatchArr = new Array();
		    for (var i = 1; i < app.project.numItems; i++){
		        var itemName = app.project.item(i).name;
		        var itemobject = app.project.item(i);
		        if (newchartname == itemName){
		            itemMatchArr.push(itemobject);
		        }
		    }
		    if(itemMatchArr <= 0){
		        var imagesFolder = getFolderByName("Images");
		        var scriptPathStripArr = scriptPath.split('/');
		        var tmpArr = new Array();
		        var newCleanPath = "";
		        for(x = 0; x <= scriptPathStripArr.length - 2; x++){
		        	tmpArr.push(scriptPathStripArr[x]);
		        }
		        tmpArr.push('ImageResources/');
		        newCleanPath = tmpArr.join('/');
		        var chartFile = newCleanPath + newchartname;
		        var chart = new File(chartFile);
		        var Chartimport = app.project.importFile(new ImportOptions(chart));
		        Chartimport.parentFolder = imagesFolder;
		        return Chartimport;
		    }else{
		        return itemMatchArr[0];
		    }
		} else {
			return null;
		}

    }

	function getFolderByName(folderName) {
        var myProject = app.project;
        for (var i = 1; i <= myProject.numItems; i++) {
            if ((myProject.item(i) instanceof FolderItem) && (myProject.item(i).name == folderName)) {
                return myProject.item(i);
            }
        }
        myFolder = myProject.items.addFolder(folderName);
        return myFolder;
    }


    ////BUILD UI FUNCTION///////

    var rdetPal = Checker_Tools_buildUI(thisObj);
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