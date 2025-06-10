#include "UTILITY_Functions.jsx";
#include "UTILITY_SaveLogs.jsx";

function RemoveClientPreset(studioSelection, studioList){
    if(studioSelection != 0){
        var tmpList = [];
        for(var i = 0; i < studioList.length; i++){
            if(i != studioSelection.index){
                tmpList.push(studioList[i]);
            }
        }
        overwriteClientLog("Presets/STUDIO_NAMES", tmpList, "LIST");
    } else {
        alert("Please choose a Client to remove");
    }
}