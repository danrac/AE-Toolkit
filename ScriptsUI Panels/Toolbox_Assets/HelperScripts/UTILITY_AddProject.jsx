(function UTILITY_AddProject(thisObj) {

#include "UTILITY_Functions.jsx";
#include "UTILITY_SaveLogs.jsx";

var scriptFile = new File($.fileName);
var scriptPath = scriptFile.parent.parent.fsName;
var projectListPath = scriptPath + "/SaveData/Presets/PROJECTS_LIST.txt";
var projectList = [];

var pal = (thisObj instanceof Panel) ? thisObj : new Window("dialog", "ADD PROJECT", undefined, { resizeable: false });

    function AddProject_buildUI(thisObj) {
        if (pal != null) {

            pal.add("StaticText", undefined, "--------------------------------------- ADD CLIENT --------------------------------------");
            
            var form = pal.add("Panel", undefined, '');
            form.orientation = 'row';
            form.preferredSize = [600, 600];
            var formGroup = form.add('group', undefined, '');
            formGroup.orientation = 'column';
            projectList = parseFromTxtFile(projectListPath, '\n');
            var projectGroup = formGroup.add('group', undefined, '');
            projectGroup.orientation = 'row';
            var ProjectLabel = projectGroup.add('StaticText', undefined, 'PROJECT');
            var ProjectName = projectGroup.add('EditText', undefined, '');
            ProjectName.alignment = ['fill', 'center'];
            ProjectName.size = [360, 25];
            var addBTNGroup = formGroup.add('group', undefined, '');
            addBTNGroup.orientation = 'row'
            var addPresetBTN = addBTNGroup.add('Button', undefined, 'ADD');
            addPresetBTN.size = [200, 50];
            var cancelBTN = addBTNGroup.add('Button', undefined, 'CANCEL');
            cancelBTN.size = [200, 50];

            addPresetBTN.onClick = function(){
                AddNewProject(ProjectName.text);
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

    function AddNewProject(newProjectName){
        userProjectInputArray = loadUserProjects(userName);
        projectFunctionList = [];
        userProjectInputArray.push(newProjectName);
        var newtmpArr = userProjectInputArray.unique();
        saveUserProjects(userName, newtmpArr.join());
        for (var i = 0; i <= newtmpArr.length - 1; i++) {
            projectFunctionList.push(newtmpArr[i]);
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
    
    var rdetPal = AddProject_buildUI(thisObj);
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