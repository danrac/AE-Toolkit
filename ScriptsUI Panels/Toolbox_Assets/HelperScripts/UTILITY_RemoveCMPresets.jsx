#include "UTILITY_Functions.jsx";
#include "UTILITY_SaveLogs.jsx";

// var scriptFile = new File($.fileName);
// var scriptPath = scriptFile.parent.parent.fsName;
// var studioListPath = scriptPath + "/SaveData/Presets/Default_StudioList_Library.txt";
// var studioList = [];
//     studioList = parseFromTxtFile(studioListPath, '\n');

function RemoveCMPreset(studio, sizeSelection, SizeList){
    if(sizeSelection != 0){
        var tmpList = [];
        // tmpList.push(SizeList[0]);
        for(var i = 0; i <= SizeList.length; i++){
            if(i != sizeSelection.index){
                tmpList.push(SizeList[i]);
            }
        }
        overwriteLog("Presets/" + studio.toString() + "_SizeList", tmpList, "Library");
    } else {
        alert("Please choose an aspect ratio to remove");
    }
}