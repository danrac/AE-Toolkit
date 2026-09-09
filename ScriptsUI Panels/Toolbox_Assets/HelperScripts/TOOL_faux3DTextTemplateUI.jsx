(function faux3DTextTemplateUI(thisObj) {
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Faux 3D Text Template", undefined, { resizeable: false });

        win.orientation = "column";
        win.alignChildren = ["fill", "top"];

        win.add("statictext", undefined, "Text:");
        var textInput = win.add("edittext", undefined, "Your Text Here");
        textInput.characters = 20;

        win.add("statictext", undefined, "Font Size:");
        var fontSizeInput = win.add("edittext", undefined, "200");
        fontSizeInput.characters = 5;

        win.add("statictext", undefined, "Layer Count:");
        var layerCountInput = win.add("edittext", undefined, "10");
        layerCountInput.characters = 5;

        win.add("statictext", undefined, "Color:");

        // Color Swatch Button
        var colorGroup = win.add("group");
        colorGroup.orientation = "row";
        var colorSwatch = colorGroup.add("panel", undefined, "");
        colorSwatch.preferredSize = [220, 20];
        colorSwatch.alignment = "center";

        var selectedColor = [1, 0, 0]; // Default Red

        function updateSwatchColor() {
            colorSwatch.graphics.backgroundColor = colorSwatch.graphics.newBrush(colorSwatch.graphics.BrushType.SOLID_COLOR, selectedColor);
        }

        updateSwatchColor();

        colorSwatch.addEventListener("click", function () {
            var picked = $.colorPicker();
            if (picked != -1) {
                var r = ((picked >> 16) & 0xFF) / 255;
                var g = ((picked >> 8) & 0xFF) / 255;
                var b = (picked & 0xFF) / 255;
                selectedColor = [r, g, b];
                updateSwatchColor();
            }
        });

        var generateBtn = win.add("button", undefined, "CREATE TEMPLATE");

        generateBtn.onClick = function () {
            var text = textInput.text;
            var fontSize = parseFloat(fontSizeInput.text);
            var layerCount = parseInt(layerCountInput.text);

            if (isNaN(fontSize) || isNaN(layerCount)) {
                alert("Please enter valid numbers for Font Size and Layer Count.");
                return;
            }

            app.beginUndoGroup("Faux 3D Text Template");

            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                alert("Please select a composition.");
                app.endUndoGroup();
                return;
            }

            // Create main comp
            var mainComp = app.project.items.addComp("TXT_" + text + "_PreComp_01", 2048, 2048, 1, comp.duration, comp.frameRate);
            comp.layers.add(mainComp);

            // Create TEXT PreComp
            var textPreComp = app.project.items.addComp("EDIT_" + text + "_PreComp_01", 2048, 2048, 1, comp.duration, comp.frameRate);
            var textLayer = textPreComp.layers.addText(text);
            var textProp = textLayer.property("Source Text");
            var textDocument = textProp.value;
            textDocument.font = "Arial";
            textDocument.fontSize = fontSize;
            textProp.setValue(textDocument);

            // Add Control Null
            var controlNull = mainComp.layers.addNull();
            controlNull.name = "ControllerNull";
            controlNull.threeDLayer = true;

            // Add Slider Controls
            var zSlider = controlNull.property("Effects").addProperty("ADBE Slider Control");
            zSlider.name = "Depth Offset";
            zSlider.property("Slider").setValue(10);

            var lightAngleSlider = controlNull.property("Effects").addProperty("ADBE Angle Control");
            lightAngleSlider.name = "Bevel Light Angle";
            lightAngleSlider.property("Angle").setValue(135);

            var lightIntensitySlider = controlNull.property("Effects").addProperty("ADBE Slider Control");
            lightIntensitySlider.name = "Bevel Light Intensity";
            lightIntensitySlider.property("Slider").setValue(1);

            var fillColor = controlNull.property("Effects").addProperty("ADBE Color Control");
            fillColor.name = "Fill Color";
            fillColor.property("Color").setValue(selectedColor);

            // Add TEXT_PreComp Layers
            for (var i = 0; i < layerCount; i++) {
                var layer = mainComp.layers.add(textPreComp);
                layer.threeDLayer = true;
                layer.motionBlur = false;
                layer.parent = controlNull;

                // Z Depth Expression
                layer.property("Position").expression = "value + [0,0,thisComp.layer('ControllerNull').effect('Depth Offset')('Slider') * index];";

                // Bevel Effect (skip top layer)
                if (i < layerCount - 1) {
                    var bevel = layer.property("Effects").addProperty("ADBE Bevel Alpha");
                    bevel.property("Light Angle").expression = "thisComp.layer('ControllerNull').effect('Bevel Light Angle')('Angle');";
                    bevel.property("Edge Thickness").expression = "thisComp.layer('ControllerNull').effect('Bevel Light Intensity')('Slider');";
                } else {
                    // Top layer gets Fill Effect linked to Controller
                    var fill = layer.property("Effects").addProperty("ADBE Fill");
                    fill.property("Color").expression = "thisComp.layer('ControllerNull').effect('Fill Color')('Color');";
                }
            }

            // Add Special Top Layer (Black, Bevel, Screen)
            var specialLayer = mainComp.layers.add(textPreComp);
            specialLayer.threeDLayer = true;
            specialLayer.motionBlur = false;
            specialLayer.parent = controlNull;

            var fillBlack = specialLayer.property("Effects").addProperty("ADBE Fill");
            fillBlack.property("Color").setValue([0, 0, 0]); // Black

            var bevelSpecial = specialLayer.property("Effects").addProperty("ADBE Bevel Alpha");
            bevelSpecial.property("Light Angle").expression = "thisComp.layer('ControllerNull').effect('Bevel Light Angle')('Angle');";
            bevelSpecial.property("Edge Thickness").expression = "thisComp.layer('ControllerNull').effect('Bevel Light Intensity')('Slider');";

            specialLayer.blendingMode = BlendingMode.SCREEN;

            // Move Controller Null to Top
            controlNull.moveToBeginning();

            app.endUndoGroup();
        };

        win.layout.layout(true);
        return win;
    }

    var myScriptPal = buildUI(thisObj);
    if (myScriptPal instanceof Window) {
        myScriptPal.center();
        myScriptPal.show();
    }

})(this);
