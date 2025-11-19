// reformatButton.onClick = function() {
//     var input = inputText.text;
//     var reformatted = reformatText(input);
//     outputText.text = reformatted;
// }

// Custom trim function
function customTrim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

// Function to reformat text
function reformatText(input) {
    // fallback trim if customTrim is not defined
    function _trim(s) {
        if (typeof customTrim === "function") return customTrim(s);
        return s.replace(/^\s+|\s+$/g, "");
    }

    // list of extensions to treat as file lines
    var exts = ['mov','mp4','tif','tiff','exr','psd','eps','ai','aep','c4d','jpg','jpeg','gif','pdf','mpeg','aiff','wav','mp3'];
    // regex to detect filename by extension at the end of the line
    var extRegex = new RegExp("\\.(" + exts.join("|") + ")$", "i");

    var lines = input.split(/\r?\n/);
    var currentPath = "";
    var reformattedLines = [];

    for (var i = 0; i < lines.length; i++) {
        var line = _trim(lines[i]);
        if (line === "") continue;

        // Normalize forward slashes to backslashes
        line = line.replace(/\//g, "\\");

        var hasBackslash = (line.indexOf("\\") > -1);
        var isFile = extRegex.test(line);

        if (isFile) {
            // If the file line already includes a path, push as-is.
            if (hasBackslash) {
                reformattedLines.push(line);
            } else {
                // Otherwise, join with currentPath if available; otherwise push filename alone.
                if (currentPath) {
                    // ensure we don't accidentally duplicate a backslash
                    var sep = (currentPath.charAt(currentPath.length - 1) === "\\") ? "" : "\\";
                    reformattedLines.push(currentPath + sep + line);
                } else {
                    reformattedLines.push(line); // no current path known
                }
            }
        } else {
            // Not a file: treat as a path candidate
            if (hasBackslash) {
                // remove any trailing backslashes for consistency
                currentPath = line.replace(/\\+$/g, "");
            } else {
                // line doesn't have backslashes and isn't a file -> ignore or log? we'll ignore
                // (keeps same behavior as original which skipped empty/non-matching lines)
            }
        }
    }
    return reformattedLines.join('\n');
}


