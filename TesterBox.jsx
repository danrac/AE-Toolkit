(function TesterBox(thisObj) {

    //Build UI

    var scriptFile  = new File($.fileName);
    var scriptPath = scriptFile.parent.fsName;

    function TesterBox_buildUI(thisObj) {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "TesterBox", undefined, { resizeable: true });
        if (pal != null) {
            var res =
                "group {orientation:'column', alignment:['fill','top'], \
                    cmds1: Group {orientation:'row', alignment:['fill','bottom'], \
                        xavtoolboxBtn: Button { text:'" + "XAVToolbox" + "', alignment:['fill','bottom'], preferredSize:[75,50] }, \
                    }, \
                    cmds2: Group {orientation:'row', alignment:['fill','bottom'], \
                        timetrackerBtn: Button { text:'" + "Time Tracker" + "', alignment:['fill','bottom'], preferredSize:[75,50] }, \
                    }, \
            }";
       
            pal.gr_two = pal.add(res);
            pal.layout.layout(true);
            pal.gr_two.minimumSize = pal.gr_two.size;
            pal.layout.resize();
            pal.onResizing = pal.onResize = function () { this.layout.resize(); }
            pal.gr_two.cmds1.xavtoolboxBtn.onClick = LaunchXAVToolbox;
            pal.gr_two.cmds2.timetrackerBtn.onClick = LaunchTimeTracker;

        }
        return pal;
    }

    function LaunchXAVToolbox(){
        $.evalFile(scriptPath + "/XAVToolbox_Tester.jsx");
    }
    function LaunchTimeTracker(){
        $.evalFile(scriptPath + "/TimeTracker_Tester.jsx");
    }

    var rdetPal = TesterBox_buildUI(thisObj);
    if (rdetPal !== null) {
        if (rdetPal instanceof Window) {
            rdetPal.center();
            rdetPal.show();
        } else
            rdetPal.layout.layout(true);
    }
}
)(this);