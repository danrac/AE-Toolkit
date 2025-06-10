(function TOOL_StyleboardTemplate(thisObj) {

var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Create Styleboard Template", undefined, { resizeable: false });

function TOOL_Styleboard_buildUI(thisObj) {
    if (pal != null) {
      var resMatrix =
          "panel { \
          text: 'Make Array', orientation:'column', alignment:['fill','top'], \
            cmds5: Group { \
          orientation:'row', alignment:['fill','fill'], \
                title: StaticText { text:'Prefix:', alignment:['fill','fill'] }, \
                textFieldPrefix: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
            }, \
            cmds3: Group { \
          orientation:'row', alignment:['fill','fill'], \
                title: StaticText { text:'ScaleX:', alignment:['fill','fill'] }, \
                textFieldWidth: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                title: StaticText { text:'ScaleY:', alignment:['fill','fill'] }, \
                textFieldHeight: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
            }, \
            cmds2: Group { \
          orientation:'row', alignment:['fill','fill'], \
                title: StaticText { text:'Row:', alignment:['fill','fill'] }, \
                textFieldColumns: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                title: StaticText { text:'Col:', alignment:['fill','fill'] }, \
                textFieldRows: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
            }, \
            cmds4: Group { \
          orientation:'row', alignment:['fill','fill'], \
                title: StaticText { text:'MarginX:', alignment:['fill','fill'] }, \
                textFieldMarginX: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
                title: StaticText { text:'MarginY:', alignment:['fill','fill'] }, \
                textFieldMarginY: EditText { alignment:['fill','center'], properties:{multiline:false} }, \
            }, \
          cmds1: Group { \
                  alignment:['fill','top'], \
                  makeArrayBtn: Button { text:'CREATE', alignment:['fill','bottom'], preferredSize:[300,50] }, \
          }, \
      }";

      pal.grp = pal.add(resMatrix);
      pal.grp.graphics.backgroundColor = pal.grp.graphics.newBrush(pal.grp.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
      pal.grp.cmds5.textFieldPrefix.preferredSize = [150, 20];
      pal.grp.cmds5.textFieldPrefix.text = "CompName";
      pal.grp.cmds2.textFieldColumns.preferredSize = [50,20];
      pal.grp.cmds2.textFieldColumns.text = "3";
      pal.grp.cmds2.textFieldRows.preferredSize = [50,20];
      pal.grp.cmds2.textFieldRows.text = "3";
      pal.grp.cmds3.textFieldWidth.preferredSize = [50,20];
      pal.grp.cmds3.textFieldWidth.text = "1920";                
      pal.grp.cmds3.textFieldHeight.preferredSize = [50,20];
      pal.grp.cmds3.textFieldHeight.text = "1080";
      pal.grp.cmds4.textFieldMarginX.preferredSize = [50,20];
      pal.grp.cmds4.textFieldMarginX.text = "25";                
      pal.grp.cmds4.textFieldMarginY.preferredSize = [50,20];
      pal.grp.cmds4.textFieldMarginY.text = "25";
      pal.grp.cmds1.makeArrayBtn.onClick = CreateStyleboard;
      pal.layout.layout(true);
      pal.layout.resize();
      return pal;
    }

  function CreateStyleboard() {
      var prefixText = this.parent.parent.cmds5.textFieldPrefix.text;
      var arrayMarginX = parseInt(this.parent.parent.cmds4.textFieldMarginX.text);
      var arrayMarginY = parseInt(this.parent.parent.cmds4.textFieldMarginY.text);
      var arrayWidth = parseInt(this.parent.parent.cmds3.textFieldWidth.text);
      var arrayHeight = parseInt(this.parent.parent.cmds3.textFieldHeight.text);
      var arrayColumns = (parseInt(this.parent.parent.cmds2.textFieldColumns.text) - 1);
      var arrayRows = (parseInt(this.parent.parent.cmds2.textFieldRows.text) - 1);
      var Cols = parseInt(this.parent.parent.cmds2.textFieldColumns.text);
      var Rows = parseInt(this.parent.parent.cmds2.textFieldRows.text);
      var itemCount = (Cols * Rows) + 1;
      var gridCenterX = ((arrayWidth + arrayMarginX) * Cols) / 2;
      var gridCenterY = ((arrayHeight + arrayMarginY) * Rows) / 2;
      var newCompLayers = [];
      var repoLayers = [];
      var newNull;

      var newBoards = getFolderByName(prefixText + "_PreComps");
      if(prefixText != ""){
          var comp = app.project.items.addComp(prefixText + "_Styleboard_01", ((arrayWidth + arrayMarginX) * Cols), ((arrayHeight + arrayMarginY)  * Rows), 1, 120, 24);

          for (var b = 1; b < itemCount; b++){
              var newCompLayer = app.project.items.addComp(prefixText + "_PreComp_0" + b , arrayWidth, arrayHeight, 1, comp.duration, comp.frameRate);
              newCompLayer.parentFolder = newBoards;
              newCompLayer.layers.addSolid([0.5, 0.5, 0.5],  prefixText + "_Solid_0" + b, arrayWidth, arrayHeight, 1, comp.duration);
              var newLayer = comp.layers.add(newCompLayer);
              newCompLayers.push(newLayer);
          }
      
         if (comp.layer("control_null") == null){
              newNull = comp.layers.addNull(comp.duration);
              newNull.name = "control_null";
              newNull.position.setValue([gridCenterX, gridCenterY]);
          }
          else{
              newNull = comp.layer("control_null");
              newNull.position.setValue([gridCenterX, gridCenterY]);
          }
          for (var i = 0; i < newCompLayers.length - 1; i++) { 
              for (var y = 0; y <= arrayColumns; y++) {
                  for (var x = 0; x <= arrayRows; x++) {    
                      newCompLayers[i].position.setValue([((arrayWidth + arrayMarginX) * x) + ((arrayWidth + arrayMarginX) / 2), ((arrayHeight + arrayMarginY) * y) + ((arrayHeight + arrayMarginY) / 2)]); 
                      newCompLayers[i].parent = newNull;
                      newCompLayers[i].moveToEnd();
                      removeElement(newCompLayers, newCompLayers[i]);
                  }
              }
          }
          comp.width = (arrayWidth + arrayMarginX) * Rows;
          comp.height = (arrayHeight + arrayMarginY) * Cols;
          newNull.transform.position.setValue([gridCenterX, gridCenterY]);

      }else{
          alert("Please add a prefix for your comp.");
      }
    }
  }

  function removeElement(array, elem) {
      var index = array.indexOf(elem);
      if (index > -1) {
          array.splice(index, 1);
      }
  }

////BUILD UI FUNCTION///////

  var rdetPal = TOOL_Styleboard_buildUI(thisObj);
    if (rdetPal !== null) {
    if (rdetPal instanceof Window) {
        rdetPal.center();
        rdetPal.show();
    }
    else
        rdetPal.layout.layout(true);
    }
  }
)(this);