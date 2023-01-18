(function AImageGenerator(thisObj) {

    //Build UI

    var scriptFile  = new File($.fileName);
    var scriptPath = scriptFile.parent.parent.fsName;
    var Inputfield = null;

    function AImageGenerator_buildUI(thisObj) {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "AImageGenerator", undefined, { resizeable: true });
        if (pal != null) {
1

            var imagePanel = pal.add('Panel', undefined, '');
            
            var thumbnail = imagePanel.add('group', undefined, '');
            var thumbnail = imagePanel.add('Image', undefined, scriptPath + '/ImageResources/blankSquare.png');
            thumbnail.size = [500, 500];

            // alert(scriptPath + '/ImageResources/blankSquare.png');

            var promptPanel = pal.add('Panel', undefined, '');
            promptPanel.orientation = 'column';

            Inputfield = promptPanel.add('EditText', undefined, '');
            Inputfield.size = [450, 25];

            var submitBtn = promptPanel.add('Button', undefined, 'SUBMIT');
            submitBtn.size = [50, 25];

            pal.layout.layout(true);
            pal.layout.resize();
            pal.onResizing = pal.onResize = function () { this.layout.resize(); }
            

            submitBtn.onClick = function(){
                savePrompt();
                Launch1();
            }

        }
        return pal;
    }

    function Launch1(){

        var commandCode = "open"
        var fileLink = scriptPath + "/HelperScripts/PythonStable.bash";
        var f = " ";
        var r = "\\ ";
        system.callSystem(commandCode + " " + fileLink.replaceAll(f, r));
        // alert(commandCode + " " + fileLink.replaceAll(f, r));
    }

    String.prototype.replaceAll = function (search, replacement){
        var  target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    function savePrompt() {
        var filePath = scriptPath + "/HelperScripts/temp";
        var tempFileName = filePath + "/tempPrompt.txt";
        var tempFile = new File(tempFileName);    
        writeFile(tempFile, Inputfield.text);
    }

    function writeFile(fileObj, fileContent, encoding) {
        encoding = encoding || "utf-8";
        fileObj = (fileObj instanceof File) ? fileObj : new File(fileObj);
        var parentFolder = fileObj.parent;
        if (!parentFolder.exists && !parentFolder.create())
            throw new Error("Cannot create file in path " + fileObj.fsName);
        fileObj.encoding = encoding;
        fileObj.open("w");
        fileObj.write(fileContent);
        fileObj.close();
        return fileObj;
    }


    var rdetPal = AImageGenerator_buildUI(thisObj);
    if (rdetPal !== null) {
        if (rdetPal instanceof Window) {
            rdetPal.center();
            rdetPal.show();
        } else
            rdetPal.layout.layout(true);
    }
}
)(this);


// run /Users/danracusin/Documents/GitHub/AE-Toolkit/ScriptsUI\ Panels/XAVToolbox_Assets/HelperScripts/PythonStable.bash