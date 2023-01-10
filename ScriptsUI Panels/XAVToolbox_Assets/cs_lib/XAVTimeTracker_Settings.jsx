(function XAVTimeTracker_Settings(thisObj) {

    //Build UI

    var admin;
    var userName = system.userName;
    var usernames = new Array();
    var usernamesArr = new Array();
    var adminArr = new Array();
    var scriptFile  = new File($.fileName);
    var scriptPath = scriptFile.parent.parent.fsName;
    var permissionBtns = new Array();

    function XAVTimeTracker_Settings_buildUI(thisObj) {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("dialog", "XAVTimeTracker_Settings", undefined, { resizeable: true });
        if (pal != null) {
            
            usernamesArr = loadLog();

            var ddgrp = pal.add("panel", undefined, "");
            dd = ddgrp.add("dropdownlist", undefined, usernamesArr);
            dd.size = [200, 25];
            dd.selection = 0;

            var settingsGrp = pal.add("group", undefined, "");
            settingsGrp.add("StaticText", undefined, "Admin: ");
            var adminRadio = settingsGrp.add("radiobutton", undefined, "");
            
            settingsGrp.add("StaticText", undefined, "User: ");
            var userRadio = settingsGrp.add("radiobutton", undefined, "");

            permissionBtns.push(userRadio);
            permissionBtns.push(adminRadio);

            loadPermissions(dd.selection.text);

            if(admin == "false"){
                permissionBtns[0].value = true;
                permissionBtns[0].selected = true;

                permissionBtns[1].value = false;
                permissionBtns[1].selected = false;
            }
            else if (admin == "true"){
                permissionBtns[0].value = false;
                permissionBtns[0].selected = false;

                permissionBtns[1].value = true;
                permissionBtns[1].selected = true;
            }

            dd.onChange = function ddlistener(){
                loadPermissions(dd.selection.text);
                
                if(admin != "true"){
                    permissionBtns[0].value = true;
                    permissionBtns[0].selected = true;

                    permissionBtns[1].value = false;
                    permissionBtns[1].selected = false;
                } else {
                    permissionBtns[0].value = false;
                    permissionBtns[0].selected = false;
                    
                    permissionBtns[1].value = true;
                    permissionBtns[1].selected = true;
                }

            }


            userRadio.onClick = function usrRAD(){
                adminRadio.value = false;
                adminRadio.selected = false;
                admin = false;
                savePermissions(dd.selection.text);
            }
            adminRadio.onClick = function usrRAD(){
                userRadio.value = false;
                userRadio.selected = false;
                admin = true;
                savePermissions(dd.selection.text);
            }

            var buttonGrp = pal.add("group", undefined, "");
            
            var cancelBTN = buttonGrp.add("Button", undefined, "CANCEL");
            cancelBTN.size = [100, 25];
            
            var saveBTN = buttonGrp.add("Button", undefined, "SAVE");
            saveBTN.size = [100, 25];            

            saveBTN.onClick = function(){
                savePermissions(dd.selection.text);
                pal.close();
            };
            cancelBTN.onClick = function(){
                pal.close();
            };

            pal.layout.layout(true);
            pal.layout.resize();
            pal.onResizing = pal.onResize = function () { this.layout.resize(); }

        }
        return pal;
    }


    ////SAVE AND LOAD USERNAMES FUNCTION///////

        function saveLog(userName) {
            var logname = scriptPath + "/Projects/Users/USERNAMES.txt";
            var logFile = new File(logname);
            if (!logFile.exists) {
                writeFile(logFile, userName);
            }
            else {
                writeFile(logFile, userName);
            }
        }

        function loadLog() {
            var itemArr = new Array();
            var usersFileName = scriptPath + "/Projects/Users/USERNAMES.txt";
            var projFile = new File(usersFileName);
            if(projFile.exists){
                projFile.open();
                var content = projFile.read();
                projFile.close();
                if(content != ""){
                    itemArr = content.split(',');
                }
                else{
                    itemArr = content.split();
                }
            }else {
                saveLog(userName);
            }
            return itemArr;
        }

        function savePermissions(userName) {
            var filePath = scriptPath + "/Projects/Users/" + userName + "/";
            var usersFileName = filePath + userName + "_PREFS.txt";
            var userFile = new File(usersFileName);        
            var logFile = new File(usersFileName);
            writeFile(logFile, admin);
        }

        function loadPermissions(userName) {
            var itemArr = new Array();
            var filePath = scriptPath + "/Projects/Users/" + userName + "/";
            var usersFileName = filePath + userName + "_PREFS.txt";
            var userFile = new File(usersFileName);        

            if(userFile.exists){
                userFile.open();
                var content = userFile.read();
                userFile.close();
                if(content != ""){
                    itemArr = content.split();
                }
                else{
                    itemArr = content.split();
                }
                admin = itemArr[0];
                return itemArr;
            }
        }


    var rdetPal = XAVTimeTracker_Settings_buildUI(thisObj);
    if (rdetPal !== null) {
        if (rdetPal instanceof Window) {
            rdetPal.center();
            rdetPal.show();
        } else
            rdetPal.layout.layout(true);
    }
}
)(this);