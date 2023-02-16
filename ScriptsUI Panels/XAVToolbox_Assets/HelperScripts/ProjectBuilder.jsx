(function ProjectBuilder(thisObj) {

var scriptFile  = new File($.fileName);
var scriptPath = scriptFile.parent.fsName;
var filePath = scriptPath;

///////////// BUILD UI ///////////////////////////////

function SpellChecker_buildUI(thisObj) {
    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "SpellChecker", undefined, { resizeable: true, closeButton: true });
        if (pal != null) {
            masterPanel = pal.add("panel", undefined, "");

            if(masterPanel == null){


            } else {

                var pbgrp = masterPanel.add('Panel', undefined, "PROJECT BUILDER");
                pbgrp.orientation = 'column';

                var rootInput = pbgrp.add('EditText', undefined, '');
                rootInput.size = [200, 25];

                var structureInput = pbgrp.add('EditText', undefined, '');
                structureInput.size = [200, 600];

                var BuildBtn = pbgrp.add('Button', undefined, "BUILD", multiline:true);
                BuildBtn.size = [100, 25];
                BuildBtn.onClick = function(){
					alert(structureInput.text);
                }

                pal.layout.layout(true);
                pal.layout.resize();
            }
        }
        return pal;
    }

    var rdetPal = SpellChecker_buildUI(thisObj);
    if (rdetPal != null) {
        if (rdetPal instanceof Window) {
            rdetPal.center();
            rdetPal.show();
        }
        else
            rdetPal.layout.layout(true);
        }
    }
)(this);