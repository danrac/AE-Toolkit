// Create the main UI panel
var mainWindow = new Window("palette", "Color Palette Generator", undefined);
mainWindow.orientation = "column";

// Dropdown for selecting the number of colors
var colorDropdown = mainWindow.add("dropdownlist", undefined, ["4", "6", "8", "16"]);
colorDropdown.selection = 0; // Default to 4 colors

// Button to generate the colors
var generateBtn = mainWindow.add("button", undefined, "Generate Colors");
generateBtn.onClick = function() {
    generateColors(parseInt(colorDropdown.selection.text));
}

mainWindow.center();
mainWindow.show();

function generateColors(numColors) {
    var activeComp = app.project.activeItem;
    if (!activeComp || !(activeComp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }
    
    var colors = sampleColorsFromComp(activeComp, numColors);
    createColorPaletteComp(colors);
}

function sampleColorsFromComp(comp, numColors) {
    var sampledColors = [];
    
    var mainLayer = comp.layer(1); // Assuming the first layer is the one we want to sample from
    
    // Add Point Control effect to the layer
    var pointControl = mainLayer.Effects.addProperty('ADBE Point Control');
    
    // Expression to sample RGB values
    var sampleExpRGB = 'samplePoint = thisLayer.effect("Point Control")("Point"); sampleRadius = [1,1]; sampleColor = thisLayer.sampleImage(samplePoint, sampleRadius); sampleColor;';
    
    var widthStep = comp.width / Math.sqrt(numColors);
    var heightStep = comp.height / Math.sqrt(numColors);
    
    for (var i = 0; i < Math.sqrt(numColors); i++) {
        for (var j = 0; j < Math.sqrt(numColors); j++) {
            var x = i * widthStep;
            var y = j * heightStep;
            
            // Set the Point Control to the current position
            pointControl.property(1).setValue([x, y]);
            
            // Apply the expression to sample RGB values
            var colorEffect = mainLayer.Effects.addProperty("ADBE Color Control");
            colorEffect.name = "COLOR_TEMP";
            colorEffect.property(1).expression = sampleExpRGB;
            
            // Wait for the expression to be evaluated
            var maxAttempts = 10;
            var attempts = 0;
            while (colorEffect.property(1).value[0] === 0 && attempts < maxAttempts) {
                $.sleep(100);  // Give AE a moment to evaluate
                attempts++;
            }
            
            var sampledColor = colorEffect.property(1).value;
            var Red = sampledColor[0];
            var Green = sampledColor[1];
            var Blue = sampledColor[2];
            
            // Store the sampled color
            sampledColors.push([Red/255, Green/255, Blue/255]);
            
            // Remove the added effect to keep the layer clean
            colorEffect.remove();
        }
    }
    
    // Remove the Point Control effect
    pointControl.remove();
    
    return sampledColors;
}



function createColorPaletteComp(colors) {
    var compWidth = 1080;
    var compHeight = 1080;
    var numColors = colors.length;
    var gridWidth = Math.sqrt(numColors);
    
    // Create a new composition
    var paletteComp = app.project.items.addComp('Color Palette', compWidth, compHeight, 1, 10, 30);
    
    // Calculate the size of each solid
    var solidWidth = compWidth / gridWidth;
    var solidHeight = compHeight / gridWidth;
    
    for (var i = 0; i < gridWidth; i++) {
        for (var j = 0; j < gridWidth; j++) {
            var color = colors[i * gridWidth + j];
            var solidName = "Color_" + (i * gridWidth + j + 1);
            var solid = paletteComp.layers.addSolid(color, solidName, solidWidth, solidHeight, 1);
            solid.position.setValue([i * solidWidth + solidWidth / 2, j * solidHeight + solidHeight / 2]);
        }
    }
    
    paletteComp.openInViewer();
}

