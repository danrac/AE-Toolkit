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
    }
    return reformattedLines.join('\n');
}


