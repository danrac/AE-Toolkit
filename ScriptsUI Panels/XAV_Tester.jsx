(function XAV_Tester(thisObj) {

    //Build UI

    var scriptFile  = new File($.fileName);
    var scriptPath = scriptFile.parent.fsName;

    function XAV_Tester_buildUI(thisObj) {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "XAV_Tester", undefined, { resizeable: true });
        if (pal != null) {
            var res =
                "group {orientation:'column', alignment:['fill','top'], \
                    cmds1: Group {orientation:'row', alignment:['fill','bottom'], \
                        Btn1: Button { text:'" + "XAVToolbox" + "', alignment:['fill','bottom'], preferredSize:[75,50] }, \
                    }, \
                    cmds2: Group {orientation:'row', alignment:['fill','bottom'], \
                        Btn2: Button { text:'" + "Time Tracker" + "', alignment:['fill','bottom'], preferredSize:[75,50] }, \
                    }, \
                    cmds3: Group {orientation:'row', alignment:['fill','bottom'], \
                        Btn3: Button { text:'" + "Spell Checker" + "', alignment:['fill','bottom'], preferredSize:[75,50] }, \
                    }, \
                    cmds4: Group {orientation:'row', alignment:['fill','bottom'], \
                        Btn4: Button { text:'" + "Build File Structure" + "', alignment:['fill','bottom'], preferredSize:[75,50] }, \
                    }, \
            }";
       
            pal.gr_two = pal.add(res);
            pal.layout.layout(true);
            pal.gr_two.minimumSize = pal.gr_two.size;
            pal.layout.resize();
            pal.onResizing = pal.onResize = function () { this.layout.resize(); }
            pal.gr_two.cmds1.Btn1.onClick = Launch1;
            pal.gr_two.cmds2.Btn2.onClick = Launch2;
            pal.gr_two.cmds3.Btn3.onClick = Launch3;
            pal.gr_two.cmds4.Btn4.onClick = Launch4;

        }
        return pal;
    }

    function Launch1(){
        $.evalFile(scriptPath + "/XAVToolbox_Tester.jsx");
    }
    function Launch2(){
        $.evalFile(scriptPath + "/XAVTimeTracker.jsx");
    }
    function Launch3(){
        $.evalFile(scriptPath + "/XAVToolbox_Assets/HelperScripts/SpellChecker.jsx");
    }
    function Launch4(){
        $.evalFile(scriptPath + "/XAVToolbox_Assets/HelperScripts/ProjectBuilder.jsx");
    }

    var rdetPal = XAV_Tester_buildUI(thisObj);
    if (rdetPal !== null) {
        if (rdetPal instanceof Window) {
            rdetPal.center();
            rdetPal.show();
        } else
            rdetPal.layout.layout(true);
    }
}
)(this);