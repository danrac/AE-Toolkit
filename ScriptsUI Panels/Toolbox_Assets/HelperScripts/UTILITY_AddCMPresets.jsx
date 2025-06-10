(function UTILITY_AddCMPresets(thisObj) {

#include "UTILITY_Functions.jsx";
#include "UTILITY_SaveLogs.jsx";

var scriptFile = new File($.fileName);
var scriptPath = scriptFile.parent.parent.fsName;
var studioListPath = scriptPath + "/SaveData/Presets/STUDIO_NAMES_LIST.txt";
var guidelistfilepath = scriptPath + "/Toolbox_Assets/SaveData/Presets/GUIDE_PRESET_LIST.txt";
var arNamelistfilepath = scriptPath + "/Toolbox_Assets/SaveData/Presets/AR_NAMES_PRESET_LIST.txt";
var studioList = [];
var studiodd;

var pal = (thisObj instanceof Panel) ? thisObj : new Window("dialog", "ADD PRESET", undefined, { resizeable: false });

    function AddCMPreset_buildUI(thisObj) {
        if (pal != null) {
            pal.add("StaticText", undefined, "--------------------------------------- ADD PRESETS --------------------------------------");
            
            var form = pal.add("Panel", undefined, '');
            form.orientation = 'row';
            form.preferredSize = [600, 600];

            var formGroup = form.add('group', undefined, '');
            formGroup.orientation = 'column';
            
            studioList = parseFromTxtFile(studioListPath, '\n');

            var studioddgrp = formGroup.add("group", undefined, '');
            studiodd = studioddgrp.add("dropdownlist", undefined, studioList);
            studiodd.alignment = ["center", "top"];
            studiodd.size = [400, 35];
            studiodd.selection = 0;

            var SizeGroup = formGroup.add('group', undefined, '');
            SizeGroup.orientation = 'row';

            var ARNameLabel = SizeGroup.add('StaticText', undefined, 'Prefix');
            var ARNameInput = SizeGroup.add('EditText', undefined, '');
            ARNameInput.alignment = ['fill', 'center'];
            ARNameInput.size = [75, 25];

            var ARLabel = SizeGroup.add('StaticText', undefined, 'Aspect');
            var ARInput = SizeGroup.add('EditText', undefined, '');
            ARInput.alignment = ['fill', 'center'];
            ARInput.size = [75, 25];

            var SizeXLabel = SizeGroup.add('StaticText', undefined, 'SizeX');
            var SizeXInput = SizeGroup.add('EditText', undefined, '');
            SizeXInput.alignment = ['fill', 'center'];
            SizeXInput.size = [50, 25];

            var SizeYLabel = SizeGroup.add('StaticText', undefined, 'SizeY');
            var SizeYInput = SizeGroup.add('EditText', undefined, '');
            SizeYInput.alignment = ['fill', 'center'];
            SizeYInput.size = [50, 25];

            var coverGroup = formGroup.add('group', undefined, '');
            coverGroup.orientation = 'row';
            var coverLabel = coverGroup.add('StaticText', undefined, 'COVER');
            var CoverPath = coverGroup.add('EditText', undefined, '');
            CoverPath.alignment = ['fill', 'center'];
            CoverPath.size = [250, 25];
            var CoverSearch = coverGroup.add('Button', undefined, 'BROWSE');

            var matteGroup = formGroup.add('group', undefined, '');
            matteGroup.orientation = 'row';
            var MatteLabel = matteGroup.add('StaticText', undefined, 'MATTE');
            var MattePath = matteGroup.add('EditText', undefined, '');
            MattePath.alignment = ['fill', 'center'];
            MattePath.size = [250, 25];
            var MatteSearch = matteGroup.add('Button', undefined, 'BROWSE');

            var chartGroup = formGroup.add('group', undefined, '');
            chartGroup.orientation = 'row';
            var ChartLabel = chartGroup.add('StaticText', undefined, 'CHART 1');
            var ChartPath = chartGroup.add('EditText', undefined, '');
            ChartPath.alignment = ['fill', 'center'];
            ChartPath.size = [250, 25];
            var ChartSearch = chartGroup.add('Button', undefined, 'BROWSE');
            
            var chartGroup2 = formGroup.add('group', undefined, '');
            chartGroup2.orientation = 'row';
            var ChartLabel2 = chartGroup2.add('StaticText', undefined, 'CHART 2');
            var ChartPath2 = chartGroup2.add('EditText', undefined, '');
            ChartPath2.alignment = ['fill', 'center'];
            ChartPath2.size = [250, 25];
            var ChartSearch2 = chartGroup2.add('Button', undefined, 'BROWSE');

            var addBTNGroup = formGroup.add('group', undefined, '');
            addBTNGroup.orientation = 'row'
            var addPresetBTN = addBTNGroup.add('Button', undefined, 'CREATE');
            addPresetBTN.size = [200, 50];
            var cancelBTN = addBTNGroup.add('Button', undefined, 'CANCEL');
            cancelBTN.size = [200, 50];

            CoverSearch.onClick = function(){
               var myFilePath = browseForFilePath("Choose an image or script", ["psd", "png", "jpg", "tif", "tiff"]);
               CoverPath.text = myFilePath;                
            }

            MatteSearch.onClick = function(){
               var myFilePath = browseForFilePath("Choose an image or script", ["psd", "png", "jpg", "tif", "tiff"]);
               MattePath.text = myFilePath;                
            }

            ChartSearch.onClick = function(){
               var myFilePath = browseForFilePath("Choose an image or script", ["psd", "png", "jpg", "tif", "tiff", 'ai']);
               ChartPath.text = myFilePath;
            }

            ChartSearch2.onClick = function(){
               var myFilePath = browseForFilePath("Choose an image or script", ["psd", "png", "jpg", "tif", "tiff", 'ai']);
               ChartPath2.text = myFilePath;
            }

            addPresetBTN.onClick = function(){
                AddNewCMPreset(studiodd.selection, ARNameInput.text ,SizeXInput.text, SizeYInput.text, CoverPath.text, ARInput.text, MattePath.text, ChartPath.text, ChartPath2.text);
            }

            cancelBTN.onClick = function(){
                pal.close();
            }
            
            pal.add("StaticText", undefined, "------------------------------------------------------------------------------------------");

            pal.layout.layout(true);
            pal.minimumSize = pal.size;
            pal.layout.resize();
        }

        return pal;
    }

    function AddNewCMPreset(studio, arname, sizeX, sizeY, cover, ar, path1, path2, path3){
        var FullStudioList = readLog('Presets/' + studio.toString() + '_SizeList', 'Library').split('\n');
        var FullARList = readLog('Presets/AR_NAMES_PRESET', 'LIST').split(',');
        var FullGuideList = readLog('Presets/GUIDE_PRESET', 'LIST').split(',');

        var trimCoverArr = cover.split('/');        
        var trimCover = trimCoverArr[ trimCoverArr.length - 1 ];

        var trimpath1Arr = path1.split('/');        
        var trimpath1 = trimpath1Arr[ trimpath1Arr.length - 1 ];
        
        var trimpath2Arr = path2.split('/');        
        var trimpath2 = trimpath2Arr[ trimpath2Arr.length - 1 ];

        var trimpath3Arr = path3.split('/');        
        var trimpath3 = trimpath3Arr[ trimpath3Arr.length - 1 ];

        var presetdata = arname + "," + sizeX + "," + sizeY + "," + trimCover + "," + ar + "," + trimpath1 + "," + trimpath2 + "," + trimpath3;

        if(arname == "" || sizeX == "" || sizeY == ""){
            alert("Please include a prefix and dimensions");
        } else {
            appendLog("Presets/" + studio.toString() + "_SizeList", presetdata, "Library");
        }

        var newpathCover = scriptPath + "/ImageResources/Covers/" + trimCover;
        var newpath1 = scriptPath + "/ImageResources/" + studio.toString() + "/" + trimpath1;
        var newpath2 = scriptPath + "/ImageResources/" + studio.toString() + "/" + trimpath2;
        var newpath3 = scriptPath + "/ImageResources/" + studio.toString() + "/" + trimpath3;
        
        copyFileToPath(cover, newpathCover);
        copyFileToPath(path1, newpath1);
        copyFileToPath(path2, newpath2);
        copyFileToPath(path3, newpath3);

        var coverExists = arrayContains(FullGuideList, trimCover);
        var g1Exists = arrayContains(FullGuideList, trimpath1);
        var g2Exists = arrayContains(FullGuideList, trimpath2);
        var g3Exists = arrayContains(FullGuideList, trimpath3);

        var newguides = [];

        if(trimCover != "" && coverExists == false){
            newguides.push(trimCover);
        }
        if(trimpath1.toString() != "" && g1Exists == false){
            newguides.push(trimpath1);
        }
        if(trimpath2.toString() != "" && g2Exists == false){
            newguides.push(trimpath2);
        }
        if(trimpath3.toString() != "" && g3Exist == false){
            newguides.push(trimpath3);
        }
        appenddelimitLog("/Presets/GUIDE_PRESET", newguides.toString(), ",", "LIST");
        
        var nameARExists = arrayContains(FullARList, ar);
        if(nameARExists){
        } else {
            appenddelimitLog("/Presets/AR_NAMES_PRESET", ar.toString(), ",", "LIST");
        }        
        
        pal.close();

    }

    function arrayContains(haystack, needle) {
        for (var i = 0; i < haystack.length; i++) {
            if (haystack[i] === needle) {
                return true;
            }
        }
            return false;
    }
    
    var rdetPal = AddCMPreset_buildUI(thisObj);
    if (rdetPal != null) {
        if (rdetPal instanceof Window) {
            rdetPal.center();
            rdetPal.show();
        }
        else
            rdetPal.layout.layout(true);
        }
    }
)(this);