// Shared colors and drawing; module spacing is configured separately below.
function applyToolboxTheme(root) {
    var colors = {
        background: [0.105, 0.114, 0.129, 1],
        surface: [0.145, 0.157, 0.176, 1],
        field: [0.09, 0.098, 0.114, 1],
        text: [0.88, 0.9, 0.93, 1],
        muted: [0.59, 0.63, 0.69, 1],
        accent: [0.37, 0.64, 0.98, 1]
    };
    function titleCase(text) {
        return text.toLowerCase().replace(/(^|\s)([a-z])/g, function(all, space, letter) { return space + letter.toUpperCase(); });
    }
    function style(control, inModule, inSurface) {
        inSurface = inSurface || (root.gr_ver && control === root.gr_ver);
        inModule = inModule || control._toolboxModule;
        var type = String(control.type).toLowerCase();
        if (control.graphics) {
            var g = control.graphics;
            try {
                g.foregroundColor = g.newPen(g.PenType.SOLID_COLOR, colors.text, 1);
                if (type === "panel" || type === "group" || control === root || inSurface) {
                    g.backgroundColor = g.newBrush(g.BrushType.SOLID_COLOR, inModule ? [0.085, 0.095, 0.11, 1] : (type === "panel" || (control === root && root.gr_ver) || inSurface ? colors.surface : colors.background));
                } else if (type === "edittext") {
                    g.backgroundColor = g.newBrush(g.BrushType.SOLID_COLOR, colors.field);
                }
                if (type === "statictext" && /^-----/.test(control.text)) {
                    control.text = titleCase(control.text.replace(/^-+\s*|\s*-+$/g, ""));
                    if (!control.text) control.onDraw = function() {
                        var graph = this.graphics;
                        graph.newPath();
                        graph.moveTo(0, this.size[1] / 2);
                        graph.lineTo(this.size[0], this.size[1] / 2);
                        graph.strokePath(graph.newPen(graph.PenType.SOLID_COLOR, [0.24, 0.27, 0.31, 1], 1));
                    };
                }
                if (type === "button" && !control.fillBrush) {
                    var heading = /^---/.test(control.text);
                    if (heading) control.text = titleCase(control.text.replace(/^-+\s*|\s*-+$/g, ""));
                    control._toolboxHeading = heading;
                    control._toolboxAccent = /^(ORGANIZE|CREATE COMP|SAVE SETTINGS)$/.test(control.text);
                    control.onDraw = function() {
                        var graph = this.graphics;
                        var w = this.size[0], h = this.size[1];
                        var fill = this._toolboxAccent ? [0.17, 0.32, 0.52, 1] : (this._toolboxHeading ? [0.12, 0.145, 0.18, 1] : [0.19, 0.21, 0.24, 1]);
                        graph.newPath();
                        graph.rectPath(0, 0, w, h);
                        graph.fillPath(graph.newBrush(graph.BrushType.SOLID_COLOR, fill));
                        graph.newPath();
                        graph.rectPath(0.5, 0.5, w - 1, h - 1);
                        graph.strokePath(graph.newPen(graph.PenType.SOLID_COLOR, [0.29, 0.32, 0.37, 1], 1));
                        if (this._toolboxHeading) {
                            graph.newPath();
                            graph.rectPath(0, 0, 2, h);
                            graph.fillPath(graph.newBrush(graph.BrushType.SOLID_COLOR, colors.accent));
                        }
                        var measure = graph.measureString(this.text, graph.font);
                        graph.drawString(this.text, graph.newPen(graph.PenType.SOLID_COLOR, this.enabled ? colors.text : colors.muted, 1), Math.max(5, (w - measure[0]) / 2), Math.max(0, (h - measure[1]) / 2), graph.font);
                        if (this.active) {
                            graph.newPath();
                            graph.rectPath(2, 2, w - 4, h - 4);
                            graph.strokePath(graph.newPen(graph.PenType.SOLID_COLOR, colors.accent, 1));
                        }
                    };
                }
            } catch (error) {
                // Native drawing remains available on hosts without a styling property.
            }
        }
        if (control.children) for (var i = 0; i < control.children.length; i++) style(control.children[i], inModule, inSurface);
    }
    style(root);
}

// Preserve module order and controls while removing empty collapsed wrappers.
function connectToolboxModule(frame, header, body, content, root) {
    frame._toolboxModule = true;
    frame.margins = [0, 0, 0, 0];
    frame.spacing = 0;
    frame.alignment = ["fill", "top"];
    frame.alignChildren = ["fill", "top"];
    header.alignment = ["fill", "top"];
    if (header.parent !== frame) {
        header.parent.margins = 0;
        header.parent.spacing = 0;
        header.parent.alignment = ["fill", "top"];
        header.parent.alignChildren = ["fill", "top"];
    }
    function sync() {
        var expanded = content.visible && content.maximumSize.height !== 0;
        body.visible = expanded;
        if (body !== content) body.maximumSize.height = expanded ? 2000 : 0;
        frame.margins = expanded ? [0, 0, 0, 8] : [0, 0, 0, 0];
    }
    var toggle = header.onClick;
    header.onClick = function() {
        // Reveal the wrapper first so the existing handler can measure its contents.
        if (body !== content) { body.visible = true; body.maximumSize.height = 2000; }
        toggle.call(this);
        sync();
        root.layout.layout(true);
        root.layout.resize();
    };
    sync();
}
