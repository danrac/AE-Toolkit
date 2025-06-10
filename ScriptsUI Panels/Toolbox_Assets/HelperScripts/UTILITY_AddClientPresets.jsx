(function UTILITY_AddClientPresets(thisObj) {

#include "UTILITY_Functions.jsx";
#include "UTILITY_SaveLogs.jsx";

var scriptFile = new File($.fileName);
var scriptPath = scriptFile.parent.parent.fsName;
var studioListPath = scriptPath + "/SaveData/Presets/STUDIO_NAMES_LIST.txt";
var studioList = [];

var pal = (thisObj instanceof Panel) ? thisObj : new Window("dialog", "ADD PRESET", undefined, { resizeable: false });

    function AddClientPreset_buildUI(thisObj) {
        if (pal != null) {

            pal.add("StaticText", undefined, "--------------------------------------- ADD CLIENT --------------------------------------");
            
            var form = pal.add("Panel", undefined, '');
            form.orientation = 'row';
            form.preferredSize = [600, 600];
            var formGroup = form.add('group', undefined, '');
            formGroup.orientation = 'column';
            studioList = parseFromTxtFile(studioListPath, '\n');
            var clientGroup = formGroup.add('group', undefined, '');
            clientGroup.orientation = 'row';
            var ClientLabel = clientGroup.add('StaticText', undefined, 'CLIENT');
            var ClientName = clientGroup.add('EditText', undefined, '');
            ClientName.alignment = ['fill', 'center'];
            ClientName.size = [360, 25];
            var addBTNGroup = formGroup.add('group', undefined, '');
            addBTNGroup.orientation = 'row'
            var addPresetBTN = addBTNGroup.add('Button', undefined, 'ADD');
            addPresetBTN.size = [200, 50];
            var cancelBTN = addBTNGroup.add('Button', undefined, 'CANCEL');
            cancelBTN.size = [200, 50];

            addPresetBTN.onClick = function(){
                AddNewClientPreset(ClientName.text);
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

    function AddNewClientPreset(client){
        var firstline = ["Select a template..."];
        var nameARExists = arrayContains(studioList, client);
        if(nameARExists){
        } else {
            appenddelimitLog("/Presets/STUDIO_NAMES", client.toString(), "\n", "LIST");            
            createClientLog("Presets/" + client.toString() + "_SizeList", firstline, "Library");
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
    
    var rdetPal = AddClientPreset_buildUI(thisObj);
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