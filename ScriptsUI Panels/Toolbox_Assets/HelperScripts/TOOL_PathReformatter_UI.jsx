// Create UI
var myWindow = new Window("palette", "Text Reformatter", undefined);
myWindow.orientation = "column";

var textGroup = myWindow.add("group", undefined, "TextGroup");
textGroup.orientation = "column";
textGroup.add("statictext", undefined, "Input Text:");
var inputText = textGroup.add("edittext", undefined, "", {multiline: true, scrolling: true});
inputText.size = [600, 300];

var buttonGroup = myWindow.add("group", undefined, "ButtonGroup");
var reformatButton = buttonGroup.add("button", undefined, "Reformat");

var outputText = myWindow.add("edittext", undefined, "", {multiline: true, scrolling: true});
outputText.size = [600, 300];

reformatButton.onClick = function() {
    var input = inputText.text;
    var reformatted = reformatText(input);
    outputText.text = reformatted;
}

myWindow.center();
myWindow.show();

// Custom trim function
function customTrim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

// Function to reformat text
function reformatText(input) {
    var lines = input.split('\n');
    var foundpaths = [];
    var foundfiles = [];
    var currentPath = "";
    var reformattedLines = [];

    for (var i = 0; i < lines.length; i++) {
        var line = customTrim(lines[i]);
        if (line === "") continue;
        if (line.indexOf('\\') > -1 && line.indexOf('.mov') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.mov') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }
        else{
            reformattedLines.push(line);
        }

        if (line.indexOf('\\') > -1 && line.indexOf('.mp4') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.mp4') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }

        if (line.indexOf('\\') > -1 && line.indexOf('.tif') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.tif') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }

        if (line.indexOf('\\') > -1 && line.indexOf('.tiff') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.tiff') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }

        if (line.indexOf('\\') > -1 && line.indexOf('.exr') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.exr') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }

        if (line.indexOf('\\') > -1 && line.indexOf('.psd') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.psd') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }

        if (line.indexOf('\\') > -1 && line.indexOf('.eps') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.eps') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }

        if (line.indexOf('\\') > -1 && line.indexOf('.ai') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.ai') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }

        if (line.indexOf('\\') > -1 && line.indexOf('.aep') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.aep') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }

        if (line.indexOf('\\') > -1 && line.indexOf('.c4d') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.c4d') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }

        if (line.indexOf('\\') > -1 && line.indexOf('.jpg') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.jpg') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }
     
        if (line.indexOf('\\') > -1 && line.indexOf('.jpeg') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.jpeg') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }
    
        if (line.indexOf('\\') > -1 && line.indexOf('.gif') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.gif') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }
 
        if (line.indexOf('\\') > -1 && line.indexOf('.pdf') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.pdf') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }

        if (line.indexOf('\\') > -1 && line.indexOf('.mpeg') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.mpeg') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }
       
        if (line.indexOf('\\') > -1 && line.indexOf('.aiff') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.aiff') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }
      
        if (line.indexOf('\\') > -1 && line.indexOf('.wav') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.wav') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }
       
        if (line.indexOf('\\') > -1 && line.indexOf('.mp3') <= -1) {
            currentPath = line;
        }
        else if (line.indexOf('\\') <= -1 && line.indexOf('.mp3') > -1) {
            reformattedLines.push(currentPath + '\\' + line);
        }
    }
    return reformattedLines.join('\n');
}


