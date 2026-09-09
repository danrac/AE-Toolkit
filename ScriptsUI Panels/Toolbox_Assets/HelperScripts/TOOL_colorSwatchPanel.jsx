#target aftereffects

(function ColorSwatchManager(thisObj)
{

/* --------------------------------
PATHS / GLOBALS
-------------------------------- */

var scriptFile = new File($.fileName);
var scriptFolder = scriptFile.parent;
var presetFolder = new Folder(scriptFolder.fsName + "/SwatchPalettes");

if (!presetFolder.exists)
{
    presetFolder.create();
}

var swatchColors = [];
var currentPalette = null;
var suppressPaletteChange = false;

var SWATCH_SIZE = 26;
var SWATCH_GAP = 4;
var GRID_MIN_HEIGHT = 140;

/* --------------------------------
FILES
-------------------------------- */

function sanitizeFileName(name)
{
    var s = name;
    s = s.replace(/^\s+|\s+$/g, "");
    s = s.replace(/[\\\/\:\*\?\"\<\>\|]/g, "_");
    if (s === "") s = "Untitled";
    return s;
}

function paletteFile(name)
{
    return new File(presetFolder.fsName + "/" + sanitizeFileName(name) + ".txt");
}

function savePalette()
{
    if (!currentPalette) return;

    var file = paletteFile(currentPalette);

    if (!file.open("w"))
    {
        alert("Could not write palette file:\n" + file.fsName);
        return;
    }

    file.writeln("# Palette: " + currentPalette);

    for (var i = 0; i < swatchColors.length; i++)
    {
        var c = swatchColors[i];
        file.writeln(c[0] + "," + c[1] + "," + c[2]);
    }

    file.close();
}

function loadPalette(name)
{
    swatchColors = [];
    currentPalette = name;

    var file = paletteFile(name);

    if (!file.exists)
    {
        savePalette();
        return;
    }

    if (!file.open("r"))
    {
        alert("Failed to open palette:\n" + file.fsName);
        return;
    }

    while (!file.eof)
    {
        var line = file.readln();

        if (line.indexOf("#") === 0) continue;
        if (line === "") continue;

        var parts = line.split(",");
        if (parts.length === 3)
        {
            swatchColors.push([
                parseFloat(parts[0]),
                parseFloat(parts[1]),
                parseFloat(parts[2])
            ]);
        }
    }

    file.close();
}

function getPaletteNames()
{
    var files = presetFolder.getFiles("*.txt");
    var names = [];
    var i;

    for (i = 0; i < files.length; i++)
    {
        var n = files[i].displayName;
        if (n.toLowerCase().indexOf(".txt") === n.length - 4)
        {
            n = n.substring(0, n.length - 4);
        }
        names.push(n);
    }

    names.sort();
    return names;
}

function renamePaletteFile(oldName, newName)
{
    var oldFile = paletteFile(oldName);
    var newFile = paletteFile(newName);

    if (!oldFile.exists)
    {
        alert("Original palette file not found.");
        return false;
    }

    if (newFile.exists)
    {
        alert("A palette with that name already exists.");
        return false;
    }

    var ok = oldFile.rename(newFile.name);

    if (!ok)
    {
        alert("Could not rename palette file.");
        return false;
    }

    return true;
}

function deletePaletteFile(name)
{
    var file = paletteFile(name);

    if (!file.exists) return true;

    return file.remove();
}

function ensureAtLeastOnePalette()
{
    var names = getPaletteNames();

    if (names.length === 0)
    {
        currentPalette = "Default";
        swatchColors = [];
        savePalette();
    }
}

/* --------------------------------
COLOR UTILS
-------------------------------- */

function clamp255(v)
{
    v = parseInt(v, 10);
    if (isNaN(v)) v = 0;
    if (v < 0) v = 0;
    if (v > 255) v = 255;
    return v;
}

function channelToHex(n)
{
    var s = clamp255(n).toString(16).toUpperCase();
    if (s.length < 2) s = "0" + s;
    return s;
}

function rgb255ToHex(r, g, b)
{
    return "#" + channelToHex(r) + channelToHex(g) + channelToHex(b);
}

function hexToRgb255(hex)
{
    var s = hex;
    if (!s) return null;

    s = s.replace(/^\s+|\s+$/g, "");
    if (s.charAt(0) === "#") s = s.substring(1);

    if (s.length !== 6) return null;
    if (!/^[0-9A-Fa-f]{6}$/.test(s)) return null;

    return [
        parseInt(s.substring(0, 2), 16),
        parseInt(s.substring(2, 4), 16),
        parseInt(s.substring(4, 6), 16)
    ];
}

/* --------------------------------
LAYER TYPE HELPERS
-------------------------------- */

function isTextLayer(layer)
{
    try
    {
        return layer.property("Source Text") !== null;
    }
    catch (err)
    {
        return false;
    }
}

function isShapeLayer(layer)
{
    try
    {
        return layer.property("ADBE Root Vectors Group") !== null;
    }
    catch (err)
    {
        return false;
    }
}

/* --------------------------------
APPLY ENGINE
-------------------------------- */

function getApplyOptions()
{
    return {
        applyFill: fillCheckbox.value,
        applyStroke: strokeCheckbox.value,
        useFallback: fallbackCheckbox.value,
        createMissing: createMissingCheckbox.value
    };
}

function applyColorToSelection(rgb)
{
    var comp = app.project.activeItem;

    if (!(comp instanceof CompItem))
    {
        alert("Select a composition.");
        return;
    }

    if (comp.selectedLayers.length === 0)
    {
        alert("Select at least one layer.");
        return;
    }

    var opts = getApplyOptions();

    if (!opts.applyFill && !opts.applyStroke)
    {
        alert("Enable Fill and/or Stroke.");
        return;
    }

    app.beginUndoGroup("Apply Swatch Color");

    for (var i = 0; i < comp.selectedLayers.length; i++)
    {
        applyColorToLayer(comp.selectedLayers[i], rgb, opts);
    }

    app.endUndoGroup();
}

function applyColorToLayer(layer, rgb, opts)
{
    if (isTextLayer(layer))
    {
        applyColorToTextLayer(layer, rgb, opts);
        return;
    }

    if (isShapeLayer(layer))
    {
        var didApplyShape = applyColorToShapeLayer(layer, rgb, opts);

        if (!didApplyShape && opts.useFallback)
        {
            applyColorToEffectFallback(layer, rgb);
        }

        return;
    }

    if (opts.useFallback)
    {
        applyColorToEffectFallback(layer, rgb);
    }
}

function applyColorToTextLayer(layer, rgb, opts)
{
    try
    {
        var sourceTextProp = layer.property("Source Text");
        if (!sourceTextProp) return;

        var td = sourceTextProp.value;

        if (opts.applyFill)
        {
            td.applyFill = true;
            td.fillColor = rgb;
        }

        if (opts.applyStroke)
        {
            td.applyStroke = true;
            td.strokeColor = rgb;
        }

        sourceTextProp.setValue(td);
    }
    catch (err)
    {
    }
}

function applyColorToShapeLayer(layer, rgb, opts)
{
    var contents = layer.property("ADBE Root Vectors Group");
    if (!contents) return false;

    var result = {
        fillFound: false,
        strokeFound: false
    };

    traverseShapeGroup(contents, rgb, opts, result);

    if (opts.createMissing)
    {
        if (opts.applyFill && !result.fillFound)
        {
            try
            {
                var newFill = contents.addProperty("ADBE Vector Graphic - Fill");
                if (newFill)
                {
                    var fillColorProp = newFill.property("ADBE Vector Fill Color");
                    if (fillColorProp)
                    {
                        fillColorProp.setValue(rgb);
                        result.fillFound = true;
                    }
                }
            }
            catch (err1)
            {
            }
        }

        if (opts.applyStroke && !result.strokeFound)
        {
            try
            {
                var newStroke = contents.addProperty("ADBE Vector Graphic - Stroke");
                if (newStroke)
                {
                    var strokeColorProp = newStroke.property("ADBE Vector Stroke Color");
                    if (strokeColorProp)
                    {
                        strokeColorProp.setValue(rgb);
                        result.strokeFound = true;
                    }
                }
            }
            catch (err2)
            {
            }
        }
    }

    if (opts.applyFill && result.fillFound) return true;
    if (opts.applyStroke && result.strokeFound) return true;

    return false;
}

function traverseShapeGroup(group, rgb, opts, result)
{
    if (!group) return;

    var i;
    for (i = 1; i <= group.numProperties; i++)
    {
        var prop = group.property(i);
        if (!prop) continue;

        var mn = "";
        try
        {
            mn = prop.matchName;
        }
        catch (err)
        {
            mn = "";
        }

        if (opts.applyFill && mn === "ADBE Vector Graphic - Fill")
        {
            try
            {
                var fillColor = prop.property("ADBE Vector Fill Color");
                if (fillColor)
                {
                    fillColor.setValue(rgb);
                    result.fillFound = true;
                }
            }
            catch (err1)
            {
            }
        }

        if (opts.applyStroke && mn === "ADBE Vector Graphic - Stroke")
        {
            try
            {
                var strokeColor = prop.property("ADBE Vector Stroke Color");
                if (strokeColor)
                {
                    strokeColor.setValue(rgb);
                    result.strokeFound = true;
                }
            }
            catch (err2)
            {
            }
        }

        if (prop.numProperties && prop.numProperties > 0)
        {
            traverseShapeGroup(prop, rgb, opts, result);
        }
    }
}

function applyColorToEffectFallback(layer, rgb)
{
    try
    {
        var effects = layer.property("ADBE Effect Parade");
        if (!effects) return;

        var fill = findExistingFillEffect(effects);

        if (!fill)
        {
            fill = effects.addProperty("Fill");
        }

        if (fill)
        {
            var colorProp = fill.property("Color");
            if (colorProp)
            {
                colorProp.setValue(rgb);
            }
        }
    }
    catch (err)
    {
    }
}

function findExistingFillEffect(effects)
{
    var i;
    for (i = 1; i <= effects.numProperties; i++)
    {
        var fx = effects.property(i);
        if (!fx) continue;

        try
        {
            if (fx.matchName === "ADBE Fill")
            {
                return fx;
            }
        }
        catch (err)
        {
        }

        try
        {
            if (fx.name === "Fill")
            {
                return fx;
            }
        }
        catch (err2)
        {
        }
    }

    return null;
}

/* --------------------------------
COLOR PICKER
-------------------------------- */

function openColorPicker(initialRgb)
{
    var initR = 128;
    var initG = 128;
    var initB = 128;

    if (initialRgb && initialRgb.length === 3)
    {
        initR = Math.round(initialRgb[0] * 255);
        initG = Math.round(initialRgb[1] * 255);
        initB = Math.round(initialRgb[2] * 255);
    }

    var win = new Window("dialog", "Color Picker");
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 8;
    win.margins = 12;

    var previewPanel = win.add("panel", undefined, "Preview");
    previewPanel.preferredSize = [240, 56];

    function drawPreview(rgb)
    {
        previewPanel.onDraw = function()
        {
            var g = this.graphics;
            var brush = g.newBrush(g.BrushType.SOLID_COLOR, rgb);

            g.rectPath(0, 0, this.size[0], this.size[1]);
            g.fillPath(brush);
        };

        previewPanel.visible = false;
        previewPanel.visible = true;
    }

    function makeSliderRow(label, value)
    {
        var row = win.add("group");
        row.orientation = "row";
        row.alignChildren = ["left", "center"];

        row.add("statictext", undefined, label);

        var slider = row.add("slider", undefined, value, 0, 255);
        slider.preferredSize = [140, 20];

        var field = row.add("edittext", undefined, String(value));
        field.characters = 4;

        return {
            slider: slider,
            field: field
        };
    }

    var r = makeSliderRow("R", initR);
    var g = makeSliderRow("G", initG);
    var b = makeSliderRow("B", initB);

    var hexRow = win.add("group");
    hexRow.orientation = "row";
    hexRow.add("statictext", undefined, "HEX");
    var hexField = hexRow.add("edittext", undefined, rgb255ToHex(initR, initG, initB));
    hexField.characters = 8;

    var buttons = win.add("group");
    buttons.alignment = "right";
    var okBtn = buttons.add("button", undefined, "OK");
    var cancelBtn = buttons.add("button", undefined, "Cancel");

    var isUpdating = false;
    var result = null;

    function refreshPreview()
    {
        var rv = clamp255(r.field.text);
        var gv = clamp255(g.field.text);
        var bv = clamp255(b.field.text);

        drawPreview([rv / 255, gv / 255, bv / 255]);
    }

    function syncFromSliders()
    {
        if (isUpdating) return;
        isUpdating = true;

        var rv = clamp255(Math.round(r.slider.value));
        var gv = clamp255(Math.round(g.slider.value));
        var bv = clamp255(Math.round(b.slider.value));

        r.slider.value = rv;
        g.slider.value = gv;
        b.slider.value = bv;

        r.field.text = String(rv);
        g.field.text = String(gv);
        b.field.text = String(bv);

        hexField.text = rgb255ToHex(rv, gv, bv);
        refreshPreview();

        isUpdating = false;
    }

    function syncFromFields()
    {
        if (isUpdating) return;
        isUpdating = true;

        var rv = clamp255(r.field.text);
        var gv = clamp255(g.field.text);
        var bv = clamp255(b.field.text);

        r.slider.value = rv;
        g.slider.value = gv;
        b.slider.value = bv;

        r.field.text = String(rv);
        g.field.text = String(gv);
        b.field.text = String(bv);

        hexField.text = rgb255ToHex(rv, gv, bv);
        refreshPreview();

        isUpdating = false;
    }

    function syncFromHex()
    {
        if (isUpdating) return;

        var rgb = hexToRgb255(hexField.text);
        if (!rgb) return;

        isUpdating = true;

        r.slider.value = rgb[0];
        g.slider.value = rgb[1];
        b.slider.value = rgb[2];

        r.field.text = String(rgb[0]);
        g.field.text = String(rgb[1]);
        b.field.text = String(rgb[2]);

        hexField.text = rgb255ToHex(rgb[0], rgb[1], rgb[2]);
        refreshPreview();

        isUpdating = false;
    }

    r.slider.onChanging = syncFromSliders;
    g.slider.onChanging = syncFromSliders;
    b.slider.onChanging = syncFromSliders;

    r.field.onChange = syncFromFields;
    g.field.onChange = syncFromFields;
    b.field.onChange = syncFromFields;

    hexField.onChange = syncFromHex;

    refreshPreview();

    okBtn.onClick = function()
    {
        result = [
            clamp255(r.field.text) / 255,
            clamp255(g.field.text) / 255,
            clamp255(b.field.text) / 255
        ];

        win.close(1);
    };

    cancelBtn.onClick = function()
    {
        win.close(0);
    };

    if (win.show() === 1)
    {
        return result;
    }

    return null;
}

/* --------------------------------
NAME DIALOG
-------------------------------- */

function promptForPaletteName(title, defaultValue)
{
    var win = new Window("dialog", title);
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 8;
    win.margins = 12;

    win.add("statictext", undefined, "Palette name:");
    var field = win.add("edittext", undefined, defaultValue || "");
    field.characters = 24;
    field.active = true;

    var buttons = win.add("group");
    buttons.alignment = "right";
    var okBtn = buttons.add("button", undefined, "OK");
    var cancelBtn = buttons.add("button", undefined, "Cancel");

    var result = null;

    okBtn.onClick = function()
    {
        var name = field.text;
        name = name.replace(/^\s+|\s+$/g, "");

        if (name === "")
        {
            alert("Enter a palette name.");
            return;
        }

        result = name;
        win.close(1);
    };

    cancelBtn.onClick = function()
    {
        win.close(0);
    };

    if (win.show() === 1)
    {
        return result;
    }

    return null;
}

/* --------------------------------
UI
-------------------------------- */

var fillCheckbox = null;
var strokeCheckbox = null;
var fallbackCheckbox = null;
var createMissingCheckbox = null;

function buildUI(thisObj)
{
    var panel = (thisObj instanceof Panel)
        ? thisObj
        : new Window("palette", "Swatch Manager", undefined, {resizeable:true});

    panel.orientation = "column";
    panel.alignChildren = ["fill", "top"];
    panel.spacing = 6;
    panel.margins = 8;

    var paletteBar = panel.add("group");
    paletteBar.orientation = "row";
    paletteBar.alignChildren = ["left", "center"];

    var paletteDropdown = paletteBar.add("dropdownlist", undefined, []);
    paletteDropdown.preferredSize = [180, 24];

    var newBtn = paletteBar.add("button", undefined, "New");
    var renameBtn = paletteBar.add("button", undefined, "Rename");
    var deleteBtn = paletteBar.add("button", undefined, "Delete");

    var applyPanel = panel.add("panel", undefined, "Apply To");
    applyPanel.orientation = "column";
    applyPanel.alignChildren = ["left", "top"];
    applyPanel.margins = 8;

    var applyRow1 = applyPanel.add("group");
    applyRow1.orientation = "row";
    fillCheckbox = applyRow1.add("checkbox", undefined, "Fill");
    strokeCheckbox = applyRow1.add("checkbox", undefined, "Stroke");

    var applyRow2 = applyPanel.add("group");
    applyRow2.orientation = "row";
    fallbackCheckbox = applyRow2.add("checkbox", undefined, "Use effect fallback");
    createMissingCheckbox = applyRow2.add("checkbox", undefined, "Create missing shape fill/stroke");

    fillCheckbox.value = true;
    strokeCheckbox.value = false;
    fallbackCheckbox.value = true;
    createMissingCheckbox.value = false;

    var buttonBar = panel.add("group");
    buttonBar.orientation = "row";
    buttonBar.alignChildren = ["left", "center"];

    var addBtn = buttonBar.add("button", undefined, "Add");
    var clearBtn = buttonBar.add("button", undefined, "Clear Palette");

    var swatchBorder = panel.add("panel", undefined, "Swatches");
    swatchBorder.alignChildren = ["fill", "fill"];
    swatchBorder.margins = 8;
    swatchBorder.minimumSize = [220, GRID_MIN_HEIGHT];

    var swatchArea = swatchBorder.add("group");
    swatchArea.orientation = "column";
    swatchArea.alignChildren = ["fill", "top"];
    swatchArea.spacing = SWATCH_GAP;

    function clearSwatchArea()
    {
        while (swatchArea.children.length > 0)
        {
            swatchArea.remove(swatchArea.children[0]);
        }
    }

    function createRow()
    {
        var row = swatchArea.add("group");
        row.orientation = "row";
        row.alignChildren = ["left", "top"];
        row.spacing = SWATCH_GAP;
        return row;
    }

    function createSwatch(parentRow, rgb, index)
    {
        var sw = parentRow.add("panel");
        sw.minimumSize = [SWATCH_SIZE, SWATCH_SIZE];
        sw.maximumSize = [SWATCH_SIZE, SWATCH_SIZE];
        sw.preferredSize = [SWATCH_SIZE, SWATCH_SIZE];

        sw._rgb = rgb;
        sw._index = index;

        sw.onDraw = function()
        {
            var g = this.graphics;
            var brush = g.newBrush(g.BrushType.SOLID_COLOR, this._rgb);

            g.rectPath(0, 0, this.size[0], this.size[1]);
            g.fillPath(brush);
        };

        sw.addEventListener("mousedown", function(e)
        {
            if (ScriptUI.environment.keyboardState.altKey)
            {
                swatchColors.splice(this._index, 1);
                savePalette();
                refreshUI();
                return;
            }

            if (e.button === 2)
            {
                var newColor = openColorPicker(this._rgb);

                if (newColor !== null)
                {
                    swatchColors[this._index] = newColor;
                    savePalette();
                    refreshUI();
                }
                return;
            }

            if (e.button === 0)
            {
                applyColorToSelection(this._rgb);
            }
        });
    }

    function getUsableWidth()
    {
        var w = swatchBorder.size ? swatchBorder.size[0] : 0;
        if (!w || w < 100)
        {
            w = swatchBorder.minimumSize[0];
        }

        w = w - 24;
        if (w < SWATCH_SIZE) w = SWATCH_SIZE;
        return w;
    }

    function refreshUI()
    {
        clearSwatchArea();

        var usableWidth = getUsableWidth();
        var perRow = Math.floor((usableWidth + SWATCH_GAP) / (SWATCH_SIZE + SWATCH_GAP));
        if (perRow < 1) perRow = 1;

        var row = null;
        var i;

        for (i = 0; i < swatchColors.length; i++)
        {
            if (i % perRow === 0)
            {
                row = createRow();
            }

            createSwatch(row, swatchColors[i], i);
        }

        panel.layout.layout(true);
        panel.layout.resize();
    }

    function findDropdownItemByText(text)
    {
        var i;
        for (i = 0; i < paletteDropdown.items.length; i++)
        {
            if (paletteDropdown.items[i].text === text)
            {
                return paletteDropdown.items[i];
            }
        }
        return null;
    }

    function setDropdownSelectionByName(name)
    {
        var item = findDropdownItemByText(name);
        suppressPaletteChange = true;

        if (item)
        {
            paletteDropdown.selection = item;
        }
        else if (paletteDropdown.items.length > 0)
        {
            paletteDropdown.selection = 0;
        }
        else
        {
            paletteDropdown.selection = null;
        }

        suppressPaletteChange = false;
    }

    function rebuildDropdown(selectName)
    {
        var names = getPaletteNames();
        var i;

        suppressPaletteChange = true;
        paletteDropdown.removeAll();

        for (i = 0; i < names.length; i++)
        {
            paletteDropdown.add("item", names[i]);
        }

        suppressPaletteChange = false;
        setDropdownSelectionByName(selectName);
    }

    function selectPalette(name)
    {
        if (!name) return;

        currentPalette = name;
        loadPalette(name);
        setDropdownSelectionByName(name);
        refreshUI();
    }

    addBtn.onClick = function()
    {
        if (!currentPalette)
        {
            alert("No palette selected.");
            return;
        }

        var color = openColorPicker(null);

        if (color === null)
        {
            return;
        }

        swatchColors.push(color);
        savePalette();
        refreshUI();
    };

    clearBtn.onClick = function()
    {
        if (!currentPalette)
        {
            alert("No palette selected.");
            return;
        }

        if (!confirm("Clear all swatches in \"" + currentPalette + "\"?"))
        {
            return;
        }

        swatchColors = [];
        savePalette();
        refreshUI();
    };

    newBtn.onClick = function()
    {
        var name = promptForPaletteName("New Palette", "NewPalette");
        if (!name) return;

        name = sanitizeFileName(name);

        if (paletteFile(name).exists)
        {
            alert("A palette with that name already exists.");
            return;
        }

        currentPalette = name;
        swatchColors = [];
        savePalette();

        rebuildDropdown(name);
        refreshUI();
    };

    renameBtn.onClick = function()
    {
        if (!currentPalette)
        {
            alert("No palette selected.");
            return;
        }

        var oldName = currentPalette;
        var newName = promptForPaletteName("Rename Palette", oldName);
        if (!newName) return;

        newName = sanitizeFileName(newName);

        if (newName === oldName)
        {
            setDropdownSelectionByName(oldName);
            return;
        }

        if (paletteFile(newName).exists)
        {
            alert("A palette with that name already exists.");
            return;
        }

        if (!renamePaletteFile(oldName, newName))
        {
            return;
        }

        currentPalette = newName;
        savePalette();
        rebuildDropdown(newName);
        refreshUI();
    };

    deleteBtn.onClick = function()
    {
        if (!currentPalette)
        {
            alert("No palette selected.");
            return;
        }

        if (!confirm("Delete palette \"" + currentPalette + "\"?"))
        {
            return;
        }

        var nameToDelete = currentPalette;

        if (!deletePaletteFile(nameToDelete))
        {
            alert("Could not delete palette.");
            return;
        }

        ensureAtLeastOnePalette();

        var names = getPaletteNames();
        if (names.length > 0)
        {
            currentPalette = names[0];
            loadPalette(currentPalette);
            rebuildDropdown(currentPalette);
            refreshUI();
        }
        else
        {
            currentPalette = null;
            swatchColors = [];
            rebuildDropdown(null);
            refreshUI();
        }
    };

    paletteDropdown.onChange = function()
    {
        if (suppressPaletteChange) return;
        if (!this.selection) return;

        var name = this.selection.text;
        if (name === currentPalette) return;

        selectPalette(name);
    };

    panel.onResizing = panel.onResize = function()
    {
        this.layout.resize();
        refreshUI();
    };

    ensureAtLeastOnePalette();

    var names = getPaletteNames();
    if (names.length > 0)
    {
        currentPalette = names[0];
        loadPalette(currentPalette);
        rebuildDropdown(currentPalette);
    }
    else
    {
        currentPalette = "Default";
        swatchColors = [];
        savePalette();
        rebuildDropdown(currentPalette);
    }

    refreshUI();

    return panel;
}

/* --------------------------------
START
-------------------------------- */

var myPanel = buildUI(thisObj);

if (myPanel instanceof Window)
{
    myPanel.center();
    myPanel.show();
}

})(this);
