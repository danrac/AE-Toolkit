(function ProjectBuilder(thisObj) {

var scriptFile  = new File($.fileName);
var scriptPath = scriptFile.parent.fsName;
var filePath = scriptPath;
var masterPanel = null;
var structureInput = null;
var rootInput = null;

///////////// BUILD UI ///////////////////////////////

function ProjectBuilder_buildUI(thisObj) {
    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Project Builder", undefined, { resizeable: true, closeButton: true });
        if (pal != null) {
            masterPanel = pal.add("panel", undefined, "");

            if(masterPanel == null){


            } else {

                var pbgrp = masterPanel.add('Panel', undefined, "PROJECT BUILDER");
                pbgrp.orientation = 'column';

                rootInput = pbgrp.add('EditText', undefined, 'Paste path to the directory you want make the root.');
                rootInput.size = [200, 25];

                structureInput = pbgrp.add('EditText', undefined, 'Project structure goes here:', {multiline:true}, {scrolling:true});
                structureInput.size = [200, 600];

                var BuildBtn = pbgrp.add('Button', undefined, "BUILD");

                BuildBtn.size = [100, 25];
                BuildBtn.onClick = function(){
                    buildStructure();
                }

                pal.layout.layout(true);
                pal.layout.resize();
            }
        }
        return pal;
    }

    var fullPaths = new Array();

    function buildStructure(){
        var rootDir = rootInput.text;
        var baseArr = new Array();
        var structureArr = structureInput.text.split('////');

        for(var i = 0; i < structureArr.length - 1; i++){
            if(structureArr[i].toString() != ''){
                baseArr.push(structureArr[i]);
            }
        }

        for(var i = 0; i < baseArr.length; i++){
            var rawlevelArr = baseArr[i].split('\n');
            var levelArr = new Array();
            for(var c = 0; c < rawlevelArr.length - 1; c++){
                if(rawlevelArr[c] != ""){
                    levelArr.push(rawlevelArr[c]);
                }
            }
            // alert(levelArr);
            folderPathTracer(levelArr);
        }

        
            

        // alert(levelArr[levelArr.length - 2]);
        // for(var c = 1; c <= levelArr.length - 1; c++){
        //     var levelCount = levelArr[c].split('>');
        //     var charCount = levelCount[0].split('');
        //     if(maxLayerDepth <= charCount.length - 1){
        //         maxLayerDepth = charCount.length - 1;
        //     }
        // }

        // alert(tracePath);
        // + "/" + levelNext[1]
        // if((c - 1) > 1){
        //     levelPrevious = levelArr[c - 1].split('>');
        // } else {
        //     levelPrevious = ['',''];
        // }

        // previousCharCount = levelPrevious[0].split('');
        
        // var foldername = levelCurrent[1];

        // if(charCount.length > previousCharCount.length){
        
        //     // alert(previousCharCount.length);
        //     for(var v = 0; v < charCount.length + 1; v++){
        //         // alert(v);
        //         var tmpnamesplit = levelArr[v + 1].split('>');
        //         var tmpnamesplitskip = levelArr[v + 2].split('>');
        //         var parentCheck = tmpnamesplit[0].split('');
        //         // alert(parentCheck.length +" // "+ charCount.length);
        //         if(charCount.length == parentCheck.length){
        //             tracePath = tracePath + "/" + tmpnamesplitskip[1];
        //             alert(tracePath);

        //         } else {
        //             tracePath = tracePath + "/" + tmpnamesplit[1];
        //             // alert(tracePath);
        //         }
        //     }
        //     var tempPath = levelRoot[1] + "/" + levelPrevious[1] + "/" + levelCurrent[1];
            
        // }
        // alert(foldername + " // " + levelArr[c] +" // "+ (charCount.length - 1) + " // " + c);
        // ;

        // var currentlayer = '';      
        // alert(baseArr);
        // for(var i = 1; i <= baseArr.length - 1; i++){
        //     tempBaseArr = structureArr[i].split('<>');
        //     alert(baseArr[i]);
        //     var levelArr = baseArr[i].split('\n');

        //     currentlayer = currentlayer + "-";
        //     var delimiter = "<" + currentlayer + ">";
            
        //     for(var c = 0; c <= levelArr.length; c++){   
        //         alert(levelArr[c]);
        //     }
        //     if (levelArr[c].indexOf(delimiter) !== -1){
        //         var newDirArr = levelArr[c].split(delimiter);
        //         var newDirName = newDirArr[1] + "/";
        //         var newPathCon = "";
        //         var parentCount = 0;
        //         for(var e = 0; e <= charCount.length - parentCount; e++){
        //             var addDir = levelArr[c - parentCount].split(delimiter);
        //             parentCount  = parentCount - 1;
        //             newPathCon = newPathCon + "/" + addDir[1];
        //             fullPaths.push(projectpath);
        //             alert(newPathCon);
        //         }
        //     }
        // }

        // alert(levelArr[c] + '\n\n' + delimiter);
        // alert(levelArr[c]);            

        // // get the number of deadends

        // var projectpath = rootDir + "/" + structureArr[i] + "/";
        // var OutputFolder = new Folder(projectpath);
        // if(!OutputFolder.exists){
        //     OutputFolder.create();
        // }
        // alert(projectpath);

        // }
        // alert(0);
        for(var i = 1; i <= fullPaths.length - 1; i++){
            // alert(fullPaths[i]);
        }
    }

    function folderPathTracer(levels){
        var levelRoot = levels[1].split('>');
        var tracePath = '';

        for(var c = 0; c < levels.length - 1; c++){

            var levelNext = levels[c + 1].split('>');
            var nextCharCount = levelNext[0].split('');
            
            var levelCurr = levels[c].split('>');
            var currCharCount = levelCurr[0].split('');
            
            if(currCharCount.length < nextCharCount.length){
                // alert(levelCurr[1] + " // " + levelNext[1]);
                tracePath = tracePath + "/" + levelCurr[1];
            }
            else if(currCharCount.length = nextCharCount.length){
                // alert(levelCurr[1] + " // " + levelNext[1]);
                tracePath = tracePath + "/" + levelCurr[1];
                levels[c] = "";
                var tempArr = new Array();
                
                for(var n = 0; n < levels.length; n++){
                    if(levels[n] != ""){
                        tempArr.push(levels[n]);
                    }
                }
                levels = tempArr;
                folderPathTracer(levels);
            }
        alert(tracePath);    
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

    var rdetPal = ProjectBuilder_buildUI(thisObj);
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