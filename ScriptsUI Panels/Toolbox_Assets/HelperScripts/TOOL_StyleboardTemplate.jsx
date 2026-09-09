(function TOOL_StyleboardTemplate(thisObj) {

    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Create Styleboard Template", undefined, { resizeable: false });

    function TOOL_Styleboard_buildUI(thisObj) {
        if (pal != null) {
            var resMatrix =
                "panel { \
                    text: '', orientation:'column', alignment:['fill','top'], \
                    cmds5: Group { \
                        orientation:'row', alignment:['fill','fill'], \
                        prefixLabel: StaticText { text:'Comp Name:', alignment:['fill','fill'] }, \
                        textFieldPrefix: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                    }, \
                    cmds2: Group { \
                        orientation:'row', alignment:['fill','fill'], \
                        rowLabel: StaticText { text:'Columns:', alignment:['fill','fill'] }, \
                        textFieldColumns: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                        colLabel: StaticText { text:'Rows:', alignment:['fill','fill'] }, \
                        textFieldRows: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                    }, \
                    cmds3: Group { \
                        orientation:'row', alignment:['fill','fill'], \
                        scaleXLabel: StaticText { text:'Scale X:', alignment:['fill','fill'] }, \
                        textFieldWidth: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                        scaleYLabel: StaticText { text:'Scale Y:', alignment:['fill','fill'] }, \
                        textFieldHeight: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                    }, \
                    cmds4: Group { \
                        orientation:'row', alignment:['fill','fill'], \
                        marginXLabel: StaticText { text:'Margin X:', alignment:['fill','fill'] }, \
                        textFieldMarginX: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                        marginYLabel: StaticText { text:'Margin Y:', alignment:['fill','fill'] }, \
                        textFieldMarginY: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                    }, \
                    cmds1: Group { \
                        alignment:['fill','top'], \
                        makeArrayBtn: Button { text:'CREATE TEMPLATE', alignment:['fill','bottom'], preferredSize:[300,50] }, \
                    }, \
                }";

            pal.grp = pal.add(resMatrix);
            pal.grp.graphics.backgroundColor = pal.grp.graphics.newBrush(pal.grp.graphics.BrushType.SOLID_COLOR, [0.1, 0.1, 0.1, 1]);
            pal.grp.cmds5.textFieldPrefix.preferredSize = [150, 20];
            pal.grp.cmds5.textFieldPrefix.text = "TempName";
            pal.grp.cmds2.textFieldColumns.preferredSize = [50, 20];
            pal.grp.cmds2.textFieldColumns.text = "3";
            pal.grp.cmds2.textFieldRows.preferredSize = [50, 20];
            pal.grp.cmds2.textFieldRows.text = "3";
            pal.grp.cmds3.textFieldWidth.preferredSize = [50, 20];
            pal.grp.cmds3.textFieldWidth.text = "1920";
            pal.grp.cmds3.textFieldHeight.preferredSize = [50, 20];
            pal.grp.cmds3.textFieldHeight.text = "1080";
            pal.grp.cmds4.textFieldMarginX.preferredSize = [50, 20];
            pal.grp.cmds4.textFieldMarginX.text = "25";
            pal.grp.cmds4.textFieldMarginY.preferredSize = [50, 20];
            pal.grp.cmds4.textFieldMarginY.text = "25";
            pal.grp.cmds1.makeArrayBtn.onClick = CreateStyleboard;
            pal.layout.layout(true);
            pal.layout.resize();
            return pal;
        }

        function CreateStyleboard() {
            app.beginUndoGroup("Create Styleboard Template");

            var prefixText = this.parent.parent.cmds5.textFieldPrefix.text;
            var arrayMarginX = parseInt(this.parent.parent.cmds4.textFieldMarginX.text);
            var arrayMarginY = parseInt(this.parent.parent.cmds4.textFieldMarginY.text);
            var arrayWidth = parseInt(this.parent.parent.cmds3.textFieldWidth.text);
            var arrayHeight = parseInt(this.parent.parent.cmds3.textFieldHeight.text);
            var arrayColumns = parseInt(this.parent.parent.cmds2.textFieldColumns.text);
            var arrayRows = parseInt(this.parent.parent.cmds2.textFieldRows.text);
            var itemCount = arrayColumns * arrayRows;
            var gridCenterX = ((arrayWidth + arrayMarginX) * arrayColumns) / 2;
            var gridCenterY = ((arrayHeight + arrayMarginY) * arrayRows) / 2;
            var newCompLayers = [];
            var newNull;

            if (prefixText !== "") {
                var newBoards = getFolderByName(prefixText + "_PreComps");
                var comp = app.project.items.addComp(prefixText + "_Styleboard_01", ((arrayWidth + arrayMarginX) * arrayColumns), ((arrayHeight + arrayMarginY) * arrayRows), 1, 120, 24);

                for (var b = 1; b <= itemCount; b++) {
                    var newCompLayer = app.project.items.addComp(prefixText + "_PreComp_0" + b, arrayWidth, arrayHeight, 1, comp.duration, comp.frameRate);
                    newCompLayer.parentFolder = newBoards;
                    newCompLayer.layers.addSolid([0.5, 0.5, 0.5], prefixText + "_Solid_0" + b, arrayWidth, arrayHeight, 1, comp.duration);
                    var newLayer = comp.layers.add(newCompLayer);
                    newCompLayers.push(newLayer);
                }

                newNull = comp.layers.addNull(comp.duration);
                newNull.name = "control_null";
                newNull.position.setValue([gridCenterX, gridCenterY]);

                var index = 0;
                for (var y = 0; y < arrayRows; y++) {
                    for (var x = 0; x < arrayColumns; x++) {
                        if (index < newCompLayers.length) {
                            newCompLayers[index].position.setValue([
                                ((arrayWidth + arrayMarginX) * x) + ((arrayWidth + arrayMarginX) / 2),
                                ((arrayHeight + arrayMarginY) * y) + ((arrayHeight + arrayMarginY) / 2)
                            ]);
                            newCompLayers[index].parent = newNull;
                            newCompLayers[index].moveToEnd();
                            index++;
                        }
                    }
                }

                comp.width = (arrayWidth + arrayMarginX) * arrayColumns;
                comp.height = (arrayHeight + arrayMarginY) * arrayRows;
                newNull.transform.position.setValue([gridCenterX, gridCenterY]);

            } else {
                alert("Please add a prefix for your comp.");
            }

            app.endUndoGroup();
        }
    }

    function getFolderByName(folderName) {
        for (var i = 1; i <= app.project.rootFolder.numItems; i++) {
            if (app.project.rootFolder.item(i) instanceof FolderItem && app.project.rootFolder.item(i).name === folderName) {
                return app.project.rootFolder.item(i);
            }
        }
        return app.project.items.addFolder(folderName);
    }

    var rdetPal = TOOL_Styleboard_buildUI(thisObj);
    if (rdetPal !== null) {
        if (rdetPal instanceof Window) {
            rdetPal.center();
            rdetPal.show();
        } else {
            rdetPal.layout.layout(true);
        }
    }

})(this);
