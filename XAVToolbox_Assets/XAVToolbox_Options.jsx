(function XAVToolbox_Options(thisObj) {

var pal = (thisObj instanceof Panel) ? thisObj : new Window("dialog", "Build Options", undefined, { resizeable: false });

    function Options_buildUI(thisObj) {
        if (pal != null) {
            var resBuildOptions = 
            "group { orientation:'column', alignment:['center','top'], \
                cmds1: Group {orientation:'row', alignment:['fill','bottom'], \
                    title: StaticText { text:'" + "MASTER-COMPS:" + "', alignment:['left','center']} , \
                    compsField: EditText { alignment:['right','center'], preferredSize:[175,20], properties:{multiline:false} }, \
                }, \
                cmds2: Group {orientation:'row', alignment:['fill','bottom'], \
                    title: StaticText { text:'" + "PRE-COMPS:" + "', alignment:['left','center']} , \
                    precompsField: EditText { alignment:['right','center'], preferredSize:[175,20], properties:{multiline:false} }, \
                }, \
                cmds3: Group {orientation:'row', alignment:['fill','bottom'], \
                    title: StaticText { text:'" + "FOOTAGE:" + "', alignment:['left','center']} , \
                    footageField: EditText { alignment:['right','center'], preferredSize:[175,20], properties:{multiline:false} }, \
                }, \
                cmds4: Group {orientation:'row', alignment:['fill','bottom'], \
                    title: StaticText { text:'" + "IMAGES:" + "', alignment:['left','center']} , \
                    imageField: EditText { alignment:['right','center'], preferredSize:[175,20], properties:{multiline:false} }, \
                }, \
                cmds5: Group {orientation:'row', alignment:['fill','bottom'], \
                    title: StaticText { text:'" + "SOLIDS / NULLS:" + "', alignment:['left','center']} , \
                    snField: EditText { alignment:['right','center'], preferredSize:[175,20], properties:{multiline:false} }, \
                }, \
                title: StaticText { text:'" + "------------------------------------------------------------------------------------------" + "'} , \
                cmds7: Group {orientation:'row', alignment:['fill','bottom'], \
                    title: StaticText { text:'" + "SEND CHECKERS TO:" + "', alignment:['left','center']} , \
                    emailField: EditText { alignment:['right','center'], preferredSize:[175,20], properties:{multiline:false} }, \
                }, \
                title: StaticText { text:'" + "------------------------------------------------------------------------------------------" + "'} , \
                cmds6: Group {orientation:'row', alignment:['center','center'], \
                    saveBtn: Button { text:'" + "SAVE SETTINGS" + "', alignment:['left','center'] }, \
                    cancelBtn: Button { text:'" + "CANCEL" + "', name: 'CANCEL', alignment:['right','center'] }, \
                }, \
            }";

            pal.add("StaticText", undefined, "-------------------------------------- BUILD OPTIONS -------------------------------------");
            pal.gr_one = pal.add(resBuildOptions);
            pal.add("StaticText", undefined, "------------------------------------------------------------------------------------------");
            var itemArr = new Array();
            var preffilepath = scriptPath + "/XAVToolbox_Assets/BuildOptions_Prefs.txt";
            var prefsFile = new File(preffilepath);
            if(prefsFile.exists){
                prefsFile.open();
                var content = prefsFile.read();
                prefsFile.close();
                itemArr = content.split('_');
                pal.gr_one.cmds1.compsField.text = itemArr[0];
                pal.gr_one.cmds2.precompsField.text = itemArr[1];
                pal.gr_one.cmds3.footageField.text = itemArr[2];
                pal.gr_one.cmds4.imageField.text = itemArr[3];
                pal.gr_one.cmds5.snField.text = itemArr[4];
                pal.gr_one.cmds7.emailField.text = itemArr[5];

            } else {
                pal.gr_one.cmds1.compsField.text = "Archive";
                pal.gr_one.cmds2.precompsField.text = "PreComps";
                pal.gr_one.cmds3.footageField.text = "Footage";
                pal.gr_one.cmds4.imageField.text = "Images";
                pal.gr_one.cmds5.snField.text = "Solids";
                pal.gr_one.cmds7.emailField.text = "example@mail.com";
            }
        
            pal.gr_one.cmds6.saveBtn.preferredSize = [175, 25];
            pal.gr_one.cmds6.saveBtn.onClick = SavePrefs;
            pal.gr_one.cmds6.cancelBtn.preferredSize = [175, 25];
            pal.layout.layout(true);
            pal.gr_one.minimumSize = pal.gr_one.size;
            pal.layout.resize();
        }
        return pal;
    }

    function SavePrefs(){
        var itemArr = new Array();
        var masters = this.parent.parent.cmds1.compsField.text;
        var precomps = this.parent.parent.cmds2.precompsField.text;
        var footage = this.parent.parent.cmds3.footageField.text;
        var images = this.parent.parent.cmds4.imageField.text;
        var sn = this.parent.parent.cmds5.snField.text;
        var email = this.parent.parent.cmds7.emailField.text;
        itemArr.push(masters);
        itemArr.push(precomps);
        itemArr.push(footage);
        itemArr.push(images);
        itemArr.push(sn);
        itemArr.push(email);
        var itemString = itemArr.join('_');
        saveLog("BuildOptions", itemString, "Prefs");
        pal.close();
    }


    ////SAVELOG FUNCTION///////

    function saveLog(logName, logInput, logType) {
        var scriptFile = new File($.fileName);
        var scriptPath = scriptFile.parent.fsName;
        var filenameSplit = logName.split('.');
        var newfilename = filenameSplit[0];
        var extensionPath = scriptPath;
        var logname = extensionPath + "/" + newfilename + "_" + logType + ".txt";
        var logFile = new File(logname);

        if (!logFile.exists) {
            writeFile(logFile, logInput);
            // alert("Log saved to: " + logFile.fsName);
        }
        else {
            writeFile(logFile, logInput);
            // alert("Log saved to: " + logFile.fsName);
        }
    }
    
    var rdetPal = Options_buildUI(thisObj);
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