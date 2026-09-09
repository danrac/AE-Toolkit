(function tiktokGraphicTemplateUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "TikTok Graphic Generator", undefined, {resizeable: true});
    var lineGrp;
    var lineOptions = ["1 Line", "2 Line", "3 Line", "4 Line", "5 Line"];
    var lineCount = 1;
    var subText = "";

    var row = win.add("group", undefined);
    row.orientation = "row";
    var dropdown = row.add("dropdownlist", undefined, lineOptions);
    dropdown.alignment = ["center", "top"];
    dropdown.size = [220, 25];
    dropdown.selection = 0;

    // Color Picker (Swatch Panel as Button)
    var colorGroup = win.add("group", undefined);
    colorGroup.orientation = "row";
    var colorSwatch = colorGroup.add("panel", undefined, "");
    colorSwatch.preferredSize = [220, 30];
    colorSwatch.alignment = "left";

    // Checkboxes
    var cbGroup = win.add("group", undefined, "");
    cbGroup.orientation = "row";
    var invertCheckbox = cbGroup.add("checkbox", undefined, "White");
    var backplateCheckbox = cbGroup.add("checkbox", undefined, "Show Backplate");
    backplateCheckbox.value = true;

    // Default Color (White)
    var backplateColor = [1, 1, 1, 1];

    function updateSwatchColor() {
        if (invertCheckbox.value) {
            backplateColor = [0, 0, 0, 1];
            invertCheckbox.text = "Black";
        } else {
            backplateColor = [1, 1, 1, 1];
            invertCheckbox.text = "White";
        }
        colorSwatch.graphics.backgroundColor = colorSwatch.graphics.newBrush(colorSwatch.graphics.BrushType.SOLID_COLOR, backplateColor);
    }

    updateSwatchColor();

    invertCheckbox.onClick = function () {
        updateSwatchColor();
    };

    // Swatch acts as color picker button
    colorSwatch.addEventListener("click", function () {
        var picked = $.colorPicker();
        if (picked !== -1) {
            var r = ((picked >> 16) & 255) / 255;
            var g = ((picked >> 8) & 255) / 255;
            var b = (picked & 255) / 255;
            backplateColor = [r, g, b, 1];
            colorSwatch.graphics.backgroundColor = colorSwatch.graphics.newBrush(colorSwatch.graphics.BrushType.SOLID_COLOR, backplateColor);
        }
    });

    var inputFields = [];
    var lineGroups = [];
    for (var i = 0; i < 5; i++) {
        lineGrp = win.add('group', undefined);
        var field = lineGrp.add("edittext", undefined, "Line " + (i + 1));
        field.characters = 30;
        inputFields.push(field);
        lineGroups.push(lineGrp);
    }

    var btn = win.add("button", undefined, "CREATE TEMPLATE");
    btn.size = [220, 50];

    dropdown.onChange = function () {
        lineCount = dropdown.selection.index + 1;
        for (var i = 0; i < 5; i++) {
            lineGroups[i].enabled = i < lineCount;
        }
        win.layout.layout(true);
        win.layout.resize();
    };
    dropdown.onChange();

    btn.onClick = function () {
        var parentComp = app.project.activeItem;
        if (!(parentComp instanceof CompItem)) {
            alert("Please select an active composition.");
            return;
        }

        app.beginUndoGroup("Generate TikTok Graphic");

        subText = "";
        for (var i = 0; i < lineCount; i++) {
            subText += inputFields[i].text;
        }

        var subTextNoSpaces = subText.replace(/\s+/g, "");
        var compName = "TXT_" + lineCount + "L_" + subTextNoSpaces + "_PC_01";
        var graphicComp = app.project.items.addComp(compName, 1080, 1080, 1, parentComp.duration, parentComp.frameRate);

        var useBackplate = backplateCheckbox.value;
        var invert = invertCheckbox.value;

        var textFillColor, strokeColor;

        if (useBackplate) {
            if (invert) {
                textFillColor = [1, 1, 1];
            } else {
                textFillColor = [0, 0, 0];
            }
        } else {
            if (invert) {
                textFillColor = [0, 0, 0];
                strokeColor = [1, 1, 1];
            } else {
                textFillColor = [1, 1, 1];
                strokeColor = [0, 0, 0];
            }
        }

        var backplate, contents;
        if (useBackplate) {
            backplate = graphicComp.layers.addShape();
            backplate.name = "backplate";
            contents = backplate.property("Contents");
        }

        for (var i = 0; i < lineCount; i++) {
            var lineName = "line_0" + (i + 1);
            var textY = graphicComp.height / 2 + i * 92;

            // Create text layer
            var text = graphicComp.layers.addText(inputFields[i].text);
            text.name = lineName;

            var textProp = text.property("Source Text");
            var textDocument = textProp.value;

            textDocument.font = "Arial";
            textDocument.fontSize = 85;
            textDocument.fillColor = textFillColor;
            textDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
            textDocument.tracking = 0;

            if (!useBackplate) {
                textDocument.strokeOverFill = false;
                textDocument.applyStroke = true;
                textDocument.strokeColor = strokeColor;
                textDocument.strokeWidth = 8;
            }

            textProp.setValue(textDocument);
            text.property("Position").setValue([graphicComp.width / 2, textY]);

            if (useBackplate) {
                var rectGroup = contents.addProperty("ADBE Vector Group");
                rectGroup.name = "Rectangle" + (i + 1);
                var rectContents = rectGroup.property("Contents");

                var rectPath = rectContents.addProperty("ADBE Vector Shape - Rect");
                rectPath.property("Size").expression =
                    's = thisComp.layer("' + lineName + '");\n' +
                    'w = s.sourceRectAtTime().width + 40;\n' +
                    'h = s.sourceRectAtTime().height + 40;\n' +
                    '[w, h]';
                rectPath.property("Position").setValue([0, textY]);

                rectGroup.property("Transform").property("Position").setValue([0, -564]);
            }
        }

        if (useBackplate) {
            var merge = contents.addProperty("ADBE Vector Filter - Merge");
            merge.property("Mode").setValue(2);
            var fill = contents.addProperty("ADBE Vector Graphic - Fill");
            fill.property("Color").setValue(backplateColor);
            var round = contents.addProperty("ADBE Vector Filter - RC");
            round.property("Radius").setValue(9);
        }

        var offsetNull = graphicComp.layers.addNull();
        offsetNull.name = "offset_null";
        offsetNull.transform.position.setValue([540, 540]);

        for (var j = 1; j <= graphicComp.numLayers; j++) {
            var lyr = graphicComp.layer(j);
            if (lyr.name !== "offset_null") {
                lyr.parent = offsetNull;
            }
        }

        offsetNull.transform.position.setValue([540, 440]);

        var newLayer = parentComp.layers.add(graphicComp);
        newLayer.name = "TikTok_Graphic";
        newLayer.property('Scale').setValue([80, 80]);

        app.endUndoGroup();
    };

    win.layout.layout(true);
    win.center();
    if (win instanceof Window) {
        win.show();
    }
})(this);
