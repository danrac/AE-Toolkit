(function TimeTracker_Tester(thisObj) {
/////////// GLOBAL VARIABLES /////////////////////
    var TimeTrackerData = new Object();
    TimeTrackerData.scriptName = "TimeTracker_Tester";
    TimeTrackerData.scriptTitle = TimeTrackerData.scriptName + " v" + version;

    var scriptFile  = new File($.fileName);
    var scriptPath = scriptFile.parent.fsName;
    var filePath = scriptPath + "/XAVToolbox_Assets/";
    var login = false;
    var admin = false;
    var palTrue = false;
    
    var dateOffset = 0;
    var currentLogCount = 0;
    var maxLogCount = 2;
    var logOffset = 0;
    var scripttimer = 0;
    var userStatus = 0;
    var statusIconCounter = 0;

    var systemPC;
    var systemMac;
    var version = "1.0";
    var systemFont = "";
    var userName = system.userName;
    var usernameText = "";
    var selectedUserName = "";
    var selectedUserNameText  = "";
    var newProjectName = "";
    var newSpotName = "";
    var currentLogName = "";
    var adminNotice = " ";
    var currentDate = "";
    var selectedDate = "";
    var hoursTotal = "HRS:";
    var hoursOTTotal = "OT:";
    var currentChatLogText = "";

    var mainLogPanel = null;
    var logpanel = null;
    var masterPanel = null;
    var jobeditgrp = null;
    var spoteditgrp= null;
    var loggingNameField = null;
    var projectNameField = null;
    var loggingNameField = null;
    var AddJobBTN = null;
    var RemoveJobBTN = null;
    var AddSpotBTN = null;
    var RemoveSpotBTN = null;
    var logRollBackBTN = null;
    var logRollForwardBTN = null;
    var closeMainScriptBTN = null;
    var MainChatPanel = null;
    var MainChatTextField = null;
    var ChatTextField = null;
    var ChatPromptGrp = null;
    var ChatPromtInputField = null;
    var ChatSubmitBtn = null;
    var MainUserPanel = null;
    var ChatUserGrp = null;
    var statusIcon = null;

    var userProjectInputArray = new Array();
    var spotInputArray = new Array();
    var logInputArray = new Array();
    var weekdays = new Array();
    var dateBtnArr = new Array();
    var projectFunctionList = new Array();
    var spotsFunctionList = new Array();
    var activityFunctionList = new Array();
    var logFunctionList = new Array();
    var loggrpArr = new Array();
    var loglinegrpArr = new Array();
    var logbtnArr = new Array();
    var logbtneditArr = new Array();
    var logjobcodeArr = new Array();
    var logspotnameArr = new Array();
    var lognotesArr = new Array();
    var logreghourArr = new Array();
    var logothourArr = new Array();
    var logactivityArr = new Array();
    var linegrpArr = new Array();
    var logStaticTextArr = new Array();
    var totalhoursArr = new Array();
    var totalhoursBtnArr = new Array();
    var loggedHoursArr = new Array();
    var totalhoursotArr = new Array();
    var totalhoursotBtnArr = new Array();
    var loggedHoursOtArr = new Array();
    var userprefArr =  new Array();
    var JobScrapeArr = new Array();
    var allUserNamesArr = new Array();
    var userStatusIconArr = new Array();
    var userChatNameArr = new Array();
    var userRBArr = new Array();
    var userSelectionArr = new Array();
    var curChatLogArr = new Array();

    var redIcon = File(filePath + "redIcon_01.png");
    var greenIcon = File(filePath + "greenIcon_01.png");
    var statusIconArr = [redIcon, greenIcon];   


////////////// LOAD JAVA EXTERNAL LIBRARIES ///////////////////////////////

    var md5LibFile = File(filePath + "cs_lib/md5.jsx");
    if(md5LibFile.exists){
      $.evalFile(md5LibFile);
    }
    var base64File = File(filePath + "cs_lib/Base64Encoder.jsx");
    if(base64File.exists){
      $.evalFile(base64File);
    }
    // var typoLibFile = File(filePath + "cs_lib/typo.jsx");
    // if(typoLibFile.exists){
    //   $.evalFile(typoLibFile);
    // }
    // var cryptoLibFile = File(filePath + "cs_lib/crypto-js.jsx");
    // if(cryptoLibFile.exists){
    //   $.evalFile(cryptoLibFile);
    // }
    // var dictionary = new Typo("en_US", false, false, { dictionaryPath: "cs_lib/typo/dictionaries" }),
    // var is_spelled_correctly = dictionary.check("helllo");
    // alert(is_spelled_correctly);

////////////// BUILD UI ///////////////////////////////

    function TimeTracker_Tester_buildUI(thisObj) {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "TimeTracker_Tester", undefined, { resizeable: true, closeButton: false });
        if (pal != null) {
            userprefArr = loadUser(userName);
            admin = userprefArr[0];
            getCurrentDate();
            systemCheck();
            nextDayDate(6);
            userProjectInputArray = loadUserProjects(userName);
            loadProjectFunctions();
            // var tempScrapperArr = [];
            // var newscrape =  [];
            // JobScrapeArr =  loadProjects();
            // for(var i = 1; i <= JobScrapeArr.length - 1; i++){
            //     tempScrapperArr = JobScrapeArr[i].split(">");
            //     var newtemp = tempScrapperArr[1].split('</');
            //     newscrape.push(newtemp[0]);
            // }
            // saveUserProjects(userName, newscrape.join(','))

////////////// CREATE MAIN PANEL ///////////////////////////////

            masterPanel = pal.add("panel", undefined, "");

            if(masterPanel == null){


            } else {

                allUserNamesArr = loadUserNameLog();
                
                userStatus = 1;
                refreshUserStatus();

                //// ADD USER PROFILE HEADER TO MAIN PANEL ////

                datePanel =  masterPanel.add("panel", undefined, "");
                datePanel.margin = [1, 1];
                datePanel.orientation = "row";
                datePanel.alignment = ["fill", "top"];
                datePanel.graphics.backgroundColor = datePanel.graphics.newBrush(datePanel.graphics.BrushType.SOLID_COLOR, [0.1,0.15,0.2,1]);

                todayGrp = datePanel.add("group", undefined, "");
                todayGrp.alignment = ["fill", "top"];

                var todayText = todayGrp.add("StaticText", undefined, "TODAY:    " + currentDate);
                todayText.size = [350, 25];
                todayText.margin = [1, 1];
                todayText.alignment = ["left", "top"];

                if(admin == "false"){
                   adminNotice = "USER:    ";
                   var usernameText = todayGrp.add("StaticText", undefined, adminNotice + userName);
                   todayText.size = [350, 25];
                   todayText.margin = [1, 1];
                   todayText.alignment = ["fill", "top"];
                }
                else if(admin == "true"){
                   adminNotice = "MANAGER: ";
                   usernameText = todayGrp.add("StaticText", undefined, adminNotice + userName);
                   todayText.size = [350, 25];
                   todayText.margin = [1, 1];
                   todayText.alignment = ["fill", "top"];
                }

                var settingBTN = todayGrp.add("Button", undefined, "SETTINGS");
                settingBTN.size = [75, 25];
                settingBTN.margin = [1, 1];
                settingBTN.alignment = ["fill", "top"];
                settingBTN.onClick = function(){
                   launchSettings();   
                }

                closeMainScriptBTN = todayGrp.add("Button", undefined, "X");
                closeMainScriptBTN.size = [25, 25];
                closeMainScriptBTN.margin = [1, 1];
                closeMainScriptBTN.alignment = ["fill", "top"];
                closeMainScriptBTN.onClick = function(){
                    userStatus = 0;
                    saveUserStatus();
                    for(var i = 0; i <= 0xffff; i++){
                        app.cancelTask(i);
                    }
                    pal.close();
                    rdetPal.hide();
                    rdetPal.close();
                    pal = null;
                }

                MainChatPanel = masterPanel.add("Panel", undefined, "MESSENGER");
                MainChatPanel.orientation = "row";
                MainChatPanel.graphics.backgroundColor = MainChatPanel.graphics.newBrush(MainChatPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.15,0.2,1]);

                MainChatTextField = MainChatPanel.add('Panel', undefined, '');
                MainChatTextField.orientation = 'column';
                MainChatTextField.size = [400, 250];
                MainChatTextField.graphics.backgroundColor = MainChatTextField.graphics.newBrush(MainChatTextField.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);


                MainUserPanel = MainChatPanel.add("Panel", undefined, "USERS");
                MainUserPanel.orientation = 'column';
                MainUserPanel.alignment = ['fill', 'top'];
                MainUserPanel.size = ['fill', 'fill'];
                
                ChatUserGrp = MainUserPanel.add('group', undefined, "");
                ChatUserGrp.alignment = ['left', 'top'];
                ChatUserGrp.orientation = 'column';

                ChatTextField = MainChatTextField.add('EditText', undefined, '', {multiline:true, scrolling:true, active:false});
                ChatTextField.size = [400, 250];
                ChatTextField.alignment = ['left', 'top'];
                ChatTextField.enabled = true;
                ChatTextField.active = true;


                for(var i = 0; i <= allUserNamesArr.length - 1; i++){
                    var userChatName = allUserNamesArr[i];

                    var chatUserDisplay = ChatUserGrp.add('group', undefined, '');
                    chatUserDisplay.alignment = ['fill', 'top'];
                    chatUserDisplay.orientation = 'row';
                    chatUserDisplay.size = ['fill', 'fill'];

                    var userRB = chatUserDisplay.add('checkbox', undefined, "");
                    userRB.alignment = ['left', 'bottom'];
                    userRB.size = [15, 15];
                    if(allUserNamesArr[i] == userName){
                        userRB.value = true;
                        userRB.visible = false;
                    }

                    userRB.onClick = function(){
                        curChatLogArr = loadChatLog();
                        ChatTextField.text = currentChatLogText;
                    }
                    userRBArr.push(userRB);

                    chatUserName = chatUserDisplay.add('StaticText', undefined, userChatName);

                    userChatNameArr.push(chatUserName);

                    var userActiveIcon = chatUserDisplay.add('image', undefined, statusIconArr[statusIconCounter]);
                    userActiveIcon.alignment = ['right', 'bottom'];
                    userActiveIcon.size = [15, 15];

                    userStatusIconArr.push(userActiveIcon);

                }

                ChatPromptGrp = MainChatTextField.add('group', undefined, '');
                ChatPromptGrp.orientation = 'row';
                ChatPromptGrp.size = [400, 25];
                ChatPromptGrp.graphics.backgroundColor = ChatPromptGrp.graphics.newBrush(ChatPromptGrp.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);

                
                ChatPromtInputField = ChatPromptGrp.add('EditText', undefined, '');
                ChatPromtInputField.size = [325, 25];

                ChatSubmitBtn = ChatPromptGrp.add('Button', undefined, 'SEND');
                ChatSubmitBtn.size = [50, 25];
                ChatSubmitBtn.onClick = function(){
                    saveChatLog(ChatPromtInputField.text);
                    curChatLogArr = loadChatLog();
                    ChatTextField.text = currentChatLogText;
                    // alert(Base64.encode(currentChatLogText));
                }

                //// ADD DATE AND TIME UI /////

                timeTrackerMainPanel =  masterPanel.add("panel", undefined, "LOGGING");
                timeTrackerMainPanel.margin = 0;
                timeTrackerMainPanel.orientation = "row";
                timeTrackerMainPanel.alignment = ["fill", "top"];
                timeTrackerMainPanel.graphics.backgroundColor = timeTrackerMainPanel.graphics.newBrush(timeTrackerMainPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.15,0.2,1]);

                datedisplaygrp = timeTrackerMainPanel.add("group", undefined, "");
                datedisplaygrp.orientation = "column";
                datedisplaygrp.alignment = ["center", "top"];

                timeTrackerDisplay =  datedisplaygrp.add("group", undefined, "");
                timeTrackerDisplay.orientation = "row";
                timeTrackerDisplay.alignment = ["center", "top"];

                ttdatePanel =  timeTrackerDisplay.add("group", undefined, "");
                ttdatePanel.orientation = "column";
                ttdatePanel.alignment = ["center", "top"];

                tthoursPanel =  timeTrackerDisplay.add("group", undefined, "");
                tthoursPanel.orientation = "column";
                tthoursPanel.alignment = ["center", "top"];

                tthoursOTPanel = timeTrackerDisplay.add("group", undefined, "");
                tthoursOTPanel.orientation = "column";
                tthoursOTPanel.alignment = ["center", "top"];

                dateoffsetgrp =  datedisplaygrp.add("group", undefined, "");
                dateoffsetgrp.orientation = "row";
                dateoffsetgrp.alignment = ["center", "top"];

                mainLogPanel = masterPanel.add("panel", undefined, "LOG: " + currentDate);
                mainLogPanel.graphics.backgroundColor = mainLogPanel.graphics.newBrush(mainLogPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.15,0.2,1]);

                mainLogPanel.orientation = "column";
                mainLogPanel.alignment = ["fill", "fill"];

                var LogTab = mainLogPanel.add("Button", undefined, "--------- LOG --------");
                LogTab.size = ['fill', 25];
                LogTab.alignment = ['fill', 'top'];

                LogTab.onClick = function(){
                    // hideLogPanel();
                }

                //// ADD DATE AND TIME SCROLL FUNCTIONS /////

                var rolldateforwardbtn = dateoffsetgrp.add("Button", undefined, "<--");
                rolldateforwardbtn.alignment = ["center", "top"];
                rolldateforwardbtn.size = [90, 25];
                
                rolldateforwardbtn.onClick = function(){
                    dateOffset = dateOffset + 1;
                    nextDayDate(6);
                    loadHours();
                    for(var i = 0; i <= weekdays.length - 1; i++){
                        loadHours();
                        for(var z = 0; z <= weekdays.length - 1; z++){
                            dateBtnArr[z].text = weekdays[z];
                            totalhoursBtnArr[z].text = loggedHoursArr[z];
                            totalhoursotBtnArr[z].text = loggedHoursOtArr[z];
                        }
                        logInputArray = loadLog(selectedDate, ttdd.selection.text);
                        loadLogFunctions();
                    }
                    pal.layout.layout(true);
                    pal.layout.resize();
                }

                var rolldatebackbtn = dateoffsetgrp.add("Button", undefined, "-->");
                rolldatebackbtn.alignment = ["center", "top"];
                rolldatebackbtn.size = [90, 25];

                rolldatebackbtn.onClick = function(){
                    dateOffset = dateOffset - 1;
                    nextDayDate(6);
                    loadHours();
                    for(var i = 0; i <= weekdays.length - 1; i++){
                        loadHours();
                        for(var z = 0; z <= weekdays.length - 1; z++){
                            dateBtnArr[z].text = weekdays[z];
                            totalhoursBtnArr[z].text = loggedHoursArr[z];
                            totalhoursotBtnArr[z].text = loggedHoursOtArr[z];
                        }
                        logInputArray = loadLog(selectedDate, ttdd.selection.text);
                        loadLogFunctions();
                    }
                    pal.layout.layout(true);
                    pal.layout.resize();
                }

               dateSelectedGrp = ttdatePanel.add("group", undefined, "");
               dateSelectedGrp.alignment = ["fill", "top"];

               var dateSelectedText = dateSelectedGrp.add("StaticText", undefined, currentDate);
               dateSelectedText.size = [110, 25];
               dateSelectedText.margin = [1, 1];
               dateSelectedText.alignment = ["fill", "top"];

               hourTotalGrp = tthoursPanel.add("group", undefined, "HRS:");
               hourTotalGrp.alignment = ["center", "top"];
               
               var hoursTotalText = hourTotalGrp.add("StaticText", undefined, hoursTotal);
               hoursTotalText.size = [30, 25];
               hoursTotalText.margin = [0, 0];
               hoursTotalText.alignment = ["fill", "top"];

               hourOTTotalGrp = tthoursOTPanel.add("group", undefined, "HRS:");
               hourOTTotalGrp.alignment = ["fill", "top"];
               
               var hoursOTTotalText = hourOTTotalGrp.add("StaticText", undefined, hoursOTTotal);
               hoursOTTotalText.size = [30, 25];
               hoursOTTotalText.margin = [0, 0];
               hoursOTTotalText.alignment = ["fill", "top"];

               mainEditorPanel = timeTrackerMainPanel.add("group", undefined, "");
               mainEditorPanel.orientation = "column";
               mainEditorPanel.alignment = ["fill", "bottom"];
               selectedDate = currentDate;

               activityPanel =  mainEditorPanel.add("panel", undefined, "ACTIVITY");
               activityPanel.orientation = "row";
               activityPanel.alignment = ["left", "center"];

               projectPanel =  mainEditorPanel.add("panel", undefined, "JOBS");
               projectPanel.orientation = "column";
               projectPanel.alignment = ["fill", "center"];
               
               loggingPanel =  mainEditorPanel.add("panel", undefined, "SPOTS");
               loggingPanel.orientation = "column";
               loggingPanel.alignment = ["fill", "center"];

               notesPanel =  mainEditorPanel.add("panel", undefined, "NOTES");
               
               notestextinput = notesPanel.add("EditText", undefined, "");
               notestextinput.alignment = ["fill", "center"];
               notestextinput.preferredSize = [320, 25];

               timePanel =  mainEditorPanel.add("panel", undefined, "TIME");

               timePanel.orientation = "row";
               timePanel.alignment = ["fill", "center"];
               timePanel.preferredSize = [360, 25];
               ingrp =  timePanel.add("group", undefined, "");
               ingrp.orientation = "row";
               ingrp.alignment = ["fill", "center"];

               ingrp.add("StaticText", undefined, "HRS:");
               
               intextinput =  ingrp.add("EditText", undefined, "");
               intextinput.preferredSize = [60, 25];
               intextinput.text = "";

               outgrp =  timePanel.add("group", undefined, "");
               outgrp.orientation = "row";
               outgrp.alignment = ["center", "center"];

               outgrp.add("StaticText", undefined, "OT:");
               
               outtextinput =  outgrp.add("EditText", undefined, "");
               outtextinput.preferredSize = [60, 25];
               outtextinput.text = "";

               submitgrp =  timePanel.add("group", undefined, "");
               submitgrp.orientation = "row";
               submitgrp.alignment = ["center", "center"];
               
               subbtn =  submitgrp.add("BUTTON", undefined, "LOG HOURS");
               subbtn.size = [120, 25];

               loadActivityFunctions();
               activitydd = activityPanel.add("dropdownlist", undefined, activityFunctionList);
               activitydd.alignment = ["center", "top"];
               activitydd.size = [320, 25];
               activitydd.selection = 0;        

               ttdd = projectPanel.add("dropdownlist", undefined, projectFunctionList);
               ttdd.alignment = ["left", "top"];
               ttdd.size = [320, 25];
               ttdd.selection = 0;

               spotInputArray = loadSpots(ttdd.selection.text);
               loadSpotsFunctions();
               logInputArray = loadLog(selectedDate, ttdd.selection.text);
               loadLogFunctions();

               jobeditgrp =  projectPanel.add("group", undefined, "");
               jobeditgrp.orientation = "row";
               jobeditgrp.alignment = ["fill", "center"];

               projectNameField =  jobeditgrp.add("EditText", undefined, "");
               projectNameField.preferredSize = [250, 25];
               projectNameField.text = "";
               projectNameField.onActivate = function(){
                   projectNameField.text = "";
               };
               
               addremovejobgrp = jobeditgrp.add("group", undefined, "");
               addremovejobgrp.orientation = "row";

               spotdd = loggingPanel.add("dropdownlist", undefined, spotsFunctionList);
               spotdd.alignment = ["left", "top"];
               spotdd.size = [320, 25];
               spotdd.selection = 0;

               spoteditgrp =  loggingPanel.add("group", undefined, "");
               spoteditgrp.orientation = "row";
               spoteditgrp.alignment = ["center", "center"];

               loggingNameField = spoteditgrp.add("EditText", undefined, "");
               loggingNameField.preferredSize = [250, 25];
               loggingNameField.text = "";
               loggingNameField.onActivate = function(){
                   loggingNameField.text = "";
               };

                logpanel = mainLogPanel.add("group", undefined, "");
                logpanel.orientation = "column";
                logpanel.alignment = ["fill", "fill"];

                var loggrp = logpanel.add("group", undefined, "");
                loggrp.orientation = "column";
                loggrp.alignment = ["fill", "fill"];

                currentLogName = currentDate;

                var loginfogrp = loggrp.add("group", undefined, "");
                loginfogrp.orientation = "column";
                loginfogrp.alignment = ["fill", "fill"];

                var logRollButtonGrp = loggrp.add("group", undefined, "");
                logRollButtonGrp.orientation = "row";
                logRollButtonGrp.size = [250, 25];
                logRollButtonGrp.alignment = ["fill", "bottom"];

                logRollBackBTN = logRollButtonGrp.add("Button", undefined, "<--");
                logRollBackBTN.size = [255, 25];
                logRollBackBTN.alignment = ["fill", "center"];
                logRollBackBTN.enabled = false;
                logRollBackBTN.onClick = function(){
                    if(logOffset > 0){
                        logOffset = logOffset - 1;
                        logInputArray = loadLog(selectedDate, ttdd.selection.text);
                        loadLogFunctions();
                        refreshLog();
                        pal.layout.layout(true);
                        pal.layout.resize();
                    }
                    if(logOffset == 0){
                        logRollBackBTN.enabled = false;
                    }

                }

                logRollForwardBTN = logRollButtonGrp.add("Button", undefined, "-->");
                logRollForwardBTN.size = [255, 25];
                logRollForwardBTN.alignment = ["fill", "center"];
                logRollForwardBTN.onClick = function(){
                    if(logOffset < currentLogCount / maxLogCount){
                        logOffset = logOffset + 1;
                        logRollForwardBTN.enabled = true;
                        if(logOffset > 0){
                            logRollBackBTN.enabled = true;
                        } else {
                            logRollBackBTN.enabled = false;
                        }
                        logInputArray = loadLog(selectedDate, ttdd.selection.text);
                        loadLogFunctions();
                        refreshLog();
                        pal.layout.layout(true);
                        pal.layout.resize();
                    }
                }

               
               for(var i = 0; i <= maxLogCount; i++){

                   var newLogGrp = loginfogrp.add("panel", undefined, "");
                   newLogGrp.alignment = ["fill", 'fill'];
                   newLogGrp.visible = 0;

                   newLogGrp.graphics.backgroundColor = newLogGrp.graphics.newBrush(newLogGrp.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);

                   var mainLineGrp = newLogGrp.add("group", undefined, "");
                   mainLineGrp.orientation = "row";
                   mainLineGrp.alignment = ["fill", 'fill'];
                   
                   var btngrp = mainLineGrp.add("group", undefined, "");
                   btngrp.orientation = "column";

                   var btn = btngrp.add("Button", undefined, "");
                   btn.size = [25, 25];
                   btn.alignment = ["left", "fill"];

                   var btnedit = btngrp.add("Button", undefined, "");
                   btnedit.size = [25, 25];
                   btnedit.alignment = ["left", "fill"];

                   var infoGrp = mainLineGrp.add("group", undefined, "");
                   infoGrp.orientation = "column";
                   infoGrp.alignment = ["fill", 'fill'];
                   infoGrp.graphics.backgroundColor = infoGrp.graphics.newBrush(infoGrp.graphics.BrushType.SOLID_COLOR, [0.15,0.15,0.15,1]);

                   var toplineGrp = infoGrp.add("group", undefined, "");
                   toplineGrp.orientation = "row";
                   toplineGrp.alignment = ["fill", 'fill'];
                   toplineGrp.graphics.backgroundColor = toplineGrp.graphics.newBrush(toplineGrp.graphics.BrushType.SOLID_COLOR, [0.25,0.25,0.25,1]);

                   var bottomlineGrp = infoGrp.add("group", undefined, "");
                   bottomlineGrp.orientation = "row";
                   bottomlineGrp.alignment = ["fill", 'fill'];

                   var noteslineGrp = infoGrp.add("group", undefined, "");
                   noteslineGrp.orientation = "row";
                   noteslineGrp.alignment = ["fill", 'fill'];
                   noteslineGrp.graphics.backgroundColor = noteslineGrp.graphics.newBrush(noteslineGrp.graphics.BrushType.SOLID_COLOR, [0.25,0.25,0.25,1]);

                   var notesText = noteslineGrp.add("StaticText", undefined, "NOTES");
                   notesText.alignment = ["fill", "fill"];

                   var jobText = toplineGrp.add("StaticText", undefined, "JOBCODE");
                   jobText.alignment = ["fill", "fill"];

                   var spotText = bottomlineGrp.add("StaticText", undefined, "SPOTNAME");
                   spotText.alignment = ["fill", "fill"];

                   var activityText = bottomlineGrp.add("StaticText", undefined, "ACTIVITY");

                   var reghoursText = bottomlineGrp.add("StaticText", undefined, "RG");
                   reghoursText.size = [120, 0];
                   reghoursText.alignment = ["right", "fill"];

                   var othoursText = bottomlineGrp.add("StaticText", undefined, "OT");
                   othoursText.size = [120, 0];
                   othoursText.alignment = ["right", "fill"];

                   linegrpArr.push(newLogGrp);
                   loggrpArr.push(newLogGrp);
                   logbtnArr.push(btn);
                   logbtneditArr.push(btnedit);
                   logjobcodeArr.push(jobText)
                   logspotnameArr.push(spotText);
                   logactivityArr.push(activityText);
                   logreghourArr.push(reghoursText);
                   logothourArr.push(othoursText);
                   lognotesArr.push(notesText);

               }

                for(var i = 0; i <= maxLogCount; i++){
                    var logRoll = i + logOffset;
                    logbtnArr[logRoll].text = "";
                    logbtneditArr[logRoll].text = "";
                    logjobcodeArr[logRoll].text = "";
                    logspotnameArr[logRoll].text = "";
                    logreghourArr[logRoll].text = "";
                    logothourArr[logRoll].text = "";
                    logactivityArr[logRoll].text = "";
                    lognotesArr[logRoll].text = "";
                    logbtnArr[logRoll].visible = 0;
                    logbtneditArr[logRoll].visible = 0;
                    logjobcodeArr[logRoll].visible = 0;
                    logspotnameArr[logRoll].visible = 0;
                    logreghourArr[logRoll].visible = 0;
                    logothourArr[logRoll].visible = 0;
                    logactivityArr[logRoll].visible = 0;    
                    lognotesArr[logRoll].visible = 0;
                }

                loadHours();

                for(var i = 0; i <= weekdays.length - 1; i++){
                    var tempDayArr = weekdays[i].split(",");
                    var day = ttdatePanel.add("Button", undefined, weekdays[i]);
                    dateBtnArr.push(day);

                    var totalhoursBtn = tthoursPanel.add("StaticText", undefined, "");
                    totalhoursBtn.text = loggedHoursArr[i];
                    totalhoursBtn.size = [20, 40];
                    totalhoursBtn.alignment = ["center", "top"];
                    totalhoursBtnArr.push(totalhoursBtn);

                    var totalhoursOTBtn = tthoursOTPanel.add("StaticText", undefined, "");
                    totalhoursOTBtn.text = loggedHoursOtArr[i];
                    totalhoursOTBtn.size = [20, 40];
                    totalhoursOTBtn.alignment = ["center", "top"];
                    totalhoursotBtnArr.push(totalhoursOTBtn);

                    day.alignment = ["center", "top"];
                    day.size = [110, 40];

                    day.onClick = function(){
                        logOffset = 0;
                        mainLogPanel.visible = 1;
                        loadHours();
                        for(var z = 0; z <= weekdays.length - 1; z++){
                            totalhoursBtnArr[z].text = loggedHoursArr[z];
                            totalhoursotBtnArr[z].text = loggedHoursOtArr[z];
                        }  
                        selectedDate = this.text;
                        dateSelectedText.text = this.text;
                        mainLogPanel.text = "LOG: " + selectedDate;
                        logInputArray = loadLog(selectedDate, ttdd.selection.text);
                        loadLogFunctions();
                        refreshLog();
                        this.parent.layout.layout(true);
                        this.parent.layout.resize();
                    }
                }

               addremovespotgrp = spoteditgrp.add("group", undefined, "");
               addremovespotgrp.orientation = "row";

               AddJobBTN = addremovejobgrp.add("Button", undefined, "+");
               AddJobBTN.size = [25, 25];
               RemoveJobBTN =  addremovejobgrp.add("Button", undefined, "-"); 
               RemoveJobBTN.size = [25, 25];

               AddSpotBTN = addremovespotgrp.add("Button", undefined, "+");
               AddSpotBTN.size = [25, 25];
               RemoveSpotBTN =  addremovespotgrp.add("Button", undefined, "-"); 
               RemoveSpotBTN.size = [25, 25];

               pal.layout.layout(true);
               projectNameField.minimumSize = projectNameField.size;
               pal.layout.resize();
               pal.onResizing = pal.onResize = function () { this.layout.resize(); }

               RemoveJobBTN.onClick = function(){
                   newProjectName = ttdd.selection;
                   removeProject();
                   ttdd.removeAll();
               
                   userProjectInputArray = loadUserProjects(userName);   

                   for (var i = 0; i <= userProjectInputArray.length - 1; i++) {
                       ttdd.add("item", userProjectInputArray[i]);
                   }
                   ttdd.selection = 0;
                   pal.layout.layout(true);
                   pal.layout.resize();
               }

               AddJobBTN.onClick = function(){
                   newProjectName = projectNameField.text;
                   ttdd.removeAll();
                   addProject();

                   userProjectInputArray = loadUserProjects(userName);
                   userProjectInputArray.sort();

                   for (var i = 0; i <= userProjectInputArray.length - 1; i++) {
                       ttdd.add("item", userProjectInputArray[i]);
                   }
                   ttdd.selection = 0;
                   pal.layout.layout(true);
                   pal.layout.resize();
               }

               RemoveSpotBTN.onClick = function(){
                   newSpotName = spotdd.selection;
                   removeSpot();
                   spotdd.removeAll();
               
                   spotInputArray = loadSpots(ttdd.selection.text);   

                   for (var i = 0; i <= spotInputArray.length - 1; i++) {
                       spotdd.add("item", spotInputArray[i]);
                   }
                   ttdd.selection = ttdd.selection;
                   spotdd.selection = 0; 
                   pal.layout.layout(true);
                   pal.layout.resize();
               }

               AddSpotBTN.onClick = function(){
                   spotdd.removeAll();
                   newSpotName = loggingNameField.text;
                   addSpot();
                   spotInputArray = loadSpots(ttdd.selection.text);
                   spotInputArray.sort();
                   
                   for (var i = 0; i <= spotInputArray.length - 1; i++) {
                       spotdd.add("item", spotInputArray[i]);
                   }
                   
                   spotdd.selection = 0;  
                   pal.layout.layout(true);
                   pal.layout.resize();
               }

               subbtn.onClick = function (){
                   addLog();
                   mainLogPanel.text = "LOG: " + selectedDate;
                   logInputArray = loadLog(selectedDate, ttdd.selection.text);
                   loadLogFunctions();
                   loadHours();
                   for(var z = 0; z <= weekdays.length - 1; z++){
                       totalhoursBtnArr[z].text = loggedHoursArr[z];
                       totalhoursotBtnArr[z].text = loggedHoursOtArr[z];
                   }  
                   refreshLog();
               }

               ttdd.onChange = function ttddlistener(){
                   spotdd.removeAll();
                   spotInputArray = loadSpots(ttdd.selection.text);

                   for (var i = 0; i <= spotInputArray.length - 1; i++) {
                       spotdd.add("item", spotInputArray[i]);
                   }
                   spotdd.selection = 0;

                   logInputArray = loadLog(selectedDate, ttdd.selection.text);
                   loadLogFunctions();
                   refreshLog();
                   
                   pal.layout.layout(true);
                   pal.layout.resize();
               }

                if(admin == "true"){
                    jobeditgrp.visible = 1;
                    spoteditgrp.visible = 1;
                    loggingNameField.visible = 1;
                    projectNameField.size[250, 25];
                    loggingNameField.preferredSize = [250, 25];
                    AddJobBTN.size = [25, 25];
                    RemoveJobBTN.size = [25, 25];
                    AddSpotBTN.size = [25, 25];
                    RemoveSpotBTN.size = [25, 25];
                    AddJobBTN.visible = 1;
                    RemoveJobBTN.visible = 1;
                    AddSpotBTN.visible = 1;
                    RemoveSpotBTN.visible = 1;

                }
                else{
                    jobeditgrp.visible = 0;
                    spoteditgrp.visible = 0;
                    loggingNameField.visible = 0;
                    projectNameField.size[0, 0];
                    loggingNameField.preferredSize = [250, 0];
                    AddJobBTN.size = [25, 0];
                    RemoveJobBTN.size = [25, 0];
                    AddSpotBTN.size = [25, 0];
                    RemoveSpotBTN.size = [25, 0];
                    AddJobBTN.visible = 0
                    RemoveJobBTN.visible = 0;
                    AddSpotBTN.visible = 0;
                    RemoveSpotBTN.visible = 0;
                }

                
                ////////////////////////////////////////////////////////////////////////////////////////////////////////

                //////////////// SCRIPT UPDATE FUNCTION ////////////////////////////////////////////////////////////////

                ////////////////////////////////////////////////////////////////////////////////////////////////////////                
                

                var ccr = app.scheduleTask("update()", 25, true);

                update = function () {
                    loadPermissions(userName);
                    if(admin == "true" && jobeditgrp.visible == 0){
                        adminNotice = "MANAGER:    ";
                        usernameText.text = adminNotice + userName;
                        jobeditgrp.visible = 1;
                        spoteditgrp.visible = 1;
                        loggingNameField.visible = 1;
                        projectNameField.size[250, 25];
                        loggingNameField.preferredSize = [250, 25];
                        AddJobBTN.size = [25, 25];
                        RemoveJobBTN.size = [25, 25];
                        AddSpotBTN.size = [25, 25];
                        RemoveSpotBTN.size = [25, 25];
                        AddJobBTN.visible = 1;
                        RemoveJobBTN.visible = 1;
                        AddSpotBTN.visible = 1;
                        RemoveSpotBTN.visible = 1;
                    }
                    else if(admin == "false" && jobeditgrp.visible == 1){
                        adminNotice = "USER:    ";
                        usernameText.text = adminNotice + userName;
                        jobeditgrp.visible = 0;
                        spoteditgrp.visible = 0;
                        loggingNameField.visible = 0;
                        projectNameField.size[0, 0];
                        loggingNameField.preferredSize = [250, 0];
                        AddJobBTN.size = [25, 0];
                        RemoveJobBTN.size = [25, 0];
                        AddSpotBTN.size = [25, 0];
                        RemoveSpotBTN.size = [25, 0];
                        AddJobBTN.visible = 0
                        RemoveJobBTN.visible = 0;
                        AddSpotBTN.visible = 0;
                        RemoveSpotBTN.visible = 0;
                    }
                    userStatus = 1;
                    saveUserStatus();          
                    for(var i = 0; i <= userChatNameArr.length - 1; i++){
                        if(userChatNameArr[i].text == userName){
                            if(userStatus == 1){
                                userStatusIconArr[i].image = ScriptUI.newImage(statusIconArr[1]);
                            }else{
                                userStatusIconArr[i].image = ScriptUI.newImage(statusIconArr[0]);
                            }
                        }
                    }

                    chatRefresh();

                    if(logInputArray[0] != null){
                        showLogPanel();
                    }
                    else{
                        hideLogPanel();
                    }

                }



            }
        }
        return pal;
    }

///////// GET DATE INFORMATION /////////

    function getCurrentDate(){
        var currentDateStr = new Date().toString();
        var currentDateArray = currentDateStr.split(" ");
        currentDate = currentDateArray[1] + ", " + currentDateArray[0] + " " + currentDateArray[2] + ", " + currentDateArray[3];
    }

    function nextDayDate(count){
        
        weekdays = [];

        for(var i = 0; i <= count; i++){
            var nextday = new Date();
            nextday.setDate(nextday.getDate() - (i + dateOffset));
            var dayArr = nextday.toString().split(" ");
            var dayText = "";
            var dayNum = "";
            var month  = "";
            var year = "";

            dayText = dayArr[0];
            dayNum = dayArr[2];
            month = dayArr[1];
            year = dayArr[3];

            if(month < 10) {
                month = month;
            }
            if(dayNum < 10) {
                dayNum = dayNum;
            }

            var datestr = month + ", " + dayText + " " + dayNum + ", " + year;
            weekdays.push(datestr);

        }
    }

///////// LOAD ACTIVITY LIST /////////

    function loadActivityFunctions(){
        activityFunctionList.push("Administration");
        activityFunctionList.push("Research & Development");
        activityFunctionList.push("Assistant Editor");
        activityFunctionList.push("Assoc. Producer");
        activityFunctionList.push("Producer");
        activityFunctionList.push("Editor");
        activityFunctionList.push("Screening");
        activityFunctionList.push("Creative Director");
        activityFunctionList.push("Copywriting");
        activityFunctionList.push("Music Supervision");
        activityFunctionList.push("Music Licenses");
        activityFunctionList.push("Voice Over");
        activityFunctionList.push("Sound Design");
        activityFunctionList.push("Style Frames");
        activityFunctionList.push("Finishing");
        activityFunctionList.push("Graphics");
        activityFunctionList.push("GRX - Finish");
        activityFunctionList.push("Traffic Management");
        activityFunctionList.push("Business Development");
        activityFunctionList.push("Analytics/Reporting");
        activityFunctionList.push("Employee Training");
        activityFunctionList.push("Admin/Meetings");
        activityFunctionList.push("Music Cues");
        activityFunctionList.push("hi5 Client Website Review");
        activityFunctionList.push("Standby/Downtime");
    }

///////// SAVE / LOAD JOBS /////////

    function loadProjectFunctions(){
        userProjectInputArray = loadUserProjects(userName);
        projectFunctionList = [];
        for (var i = 0; i <= userProjectInputArray.length - 1; i++) {
            projectFunctionList.push(userProjectInputArray[i]);
        }
    }

    function saveUserProjects(userName, userInput) {
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/";
        var userProjName = filePath + "PROJECTS.txt";
        var userProjFile = new File(userProjName);

        if (!userProjFile.exists) {
            writeFile(userProjFile, "--------------------------------");
        }
        else {
            writeFile(userProjFile, userInput);
        }
    }

    function loadUserProjects(userName) {
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/";
        var userProjName = filePath + "PROJECTS.txt";
        var userProjFile = new File(userProjName);
            var itemArr = new Array();
            var projFile = new File(userProjName);
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
                saveUserProjects(userName, userProjectInputArray.join());
            }
            return itemArr;
    }

    function loadProjects() {
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/";
        var listName = filePath + "RawJobData.txt";
        var listFile = new File(listName);
            var itemArr = new Array();
            var listFile = new File(listName);
            if(listFile.exists){
                listFile.open();
                var content = listFile.read();
                listFile.close();
                if(content != ""){
                    itemArr = content.split('\n');
                }
                else{
                    itemArr = content.split();
                }
            }
            return itemArr;
    }

///////// SAVE / LOAD USERS /////////    

    function deactivateUserStatus(){
        for(var i = 0; i <= allUserNamesArr.length - 1; i++){
            var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Users/" + allUserNamesArr[i] + "/";
            var usersFileName = filePath + allUserNamesArr[i] + "_STATUS.txt";
            var usersFile = new File(usersFileName);
            
            var userTimeStamp = usersFile.modified.toString();
            var dateTimeStr = new Date().toString();

            if(userTimeStamp != dateTimeStr){
                writeFile(usersFile, 0 + "," + usersFile.modified.toString()); 
            }
        }

    }

    function refreshUserStatus(){
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Users/" + userName + "/";
        var usersFileName = filePath + userName + "_STATUS.txt";
        var usersFile = new File(usersFileName);
        
        var userTimeStamp = usersFile.modified.toString();
        var dateTimeStr = new Date().toString();

        if(userTimeStamp != dateTimeStr){
            // alert("Date Compare:" + "\n" + userTimeStamp + "\n" + dateTimeStr);
            saveUserStatus();
            loadUserStatus();
        }
    }

    function loadUserStatus(){
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Users/" + userName + "/";
        var usersFileName = filePath + userName + "_STATUS.txt";
        var usersFile = new File(usersFileName);
        var itemArr = new Array();
        if(usersFile.exists){
            usersFile.open();
            var content = usersFile.read();
            usersFile.close();
            if(content != ""){
                itemArr = content.split(',');
            }
            else{
                itemArr = content.split();
            }
        }
        userStatus = itemArr[0];        
    }

    function saveUserStatus(){
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Users/" + userName + "/";
        var usersFileName = filePath + userName + "_STATUS.txt";
        var usersFile = new File(usersFileName);

        if (!usersFile.exists) {
            writeFile(usersFile, 1 + "," + usersFile.modified.toString());
        }
        else {
            writeFile(usersFile, userStatus + "," + usersFile.modified.toString());
        }    
    }

    function saveUser() {
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Users/" + userName + "/";
        var usersFileName = filePath + userName + "_PREFS.txt";
        var usersFile = new File(usersFileName);
        if (!usersFile.exists) {
            writeFile(usersFile, "false");
        }
        else {
            writeFile(usersFile, admin);
        }
    }

    function loadUser(userName) {
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Users/" + userName + "/";
        var usersFileName = filePath + userName + "_PREFS.txt";
        var userFile = new File(usersFileName);
        var itemArr = new Array();
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
            saveUser();
        }
        return itemArr;
    }

    function loadUserNameLog() {
        var itemArr = new Array();
        var usersFileName = scriptPath + "/XAVToolbox_Assets/Projects/Users/USERNAMES.txt";
        var projFile = new File(usersFileName);
            if(projFile.exists){
                projFile.open();
                var content = projFile.read();
                projFile.close();
                if(content != ""){
                    itemArr = content.split(',');
                } else {
                    itemArr = content.split();
                }
            } else {
                saveLog(userName);
            }
        return itemArr;
    }

///////// SAVE / LOAD SPOTS /////////

    function loadSpotsFunctions(){
        spotInputArray = loadSpots(ttdd.selection.text);
        spotsFunctionList = [];
        for (var i = 0; i <= spotInputArray.length - 1; i++) {
            spotsFunctionList.push(spotInputArray[i]);
        }
    }

    function saveSpots(job, spotsInput) {
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Spots/";
        var spotsFileName = filePath + job + "_SPOTS.txt";
        var spotsFile = new File(spotsFileName);

        if (!spotsFile.exists) {
            writeFile(spotsFile, spotsInput);
        }
        else {
            writeFile(spotsFile, spotsInput);
        }
    }

    function loadSpots(job) {
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Spots/";
        var jobNames = filePath + job + "_SPOTS.txt";
            var itemArr = new Array();
            var jobFile = new File(jobNames);
            if(jobFile.exists){
                jobFile.open();
                var content = jobFile.read();
                jobFile.close();
                if(content != ""){
                    itemArr = content.split(',');
                }
                else{
                    itemArr = content.split('');
                }
            }else {
                saveSpots(job, spotInputArray.join());
            }

            return itemArr;
    }

///////// SAVE / LOAD LOGS /////////

    function hideLogPanel(){
        logpanel.visible = 0;
        mainLogPanel.size = [650, 75];
    }

    function showLogPanel(){
        logpanel.visible = 1;
        mainLogPanel.size = [650, 650];
    }

    function refreshLog(){
        currentLogCount = logInputArray.length;
        if(currentLogCount > 0){
            var newlog = new Array();
            for(var i = 0; i <= maxLogCount; i++){
                var logRoll = i + logOffset;
                newlog.push(logInputArray[logRoll]);
            }
            for(var i = 0; i <= maxLogCount; i++){
                logbtnArr[i].text = "";
                logbtneditArr[i].text = "";
                logjobcodeArr[i].text = "JOB NAME: ";
                logspotnameArr[i].text = "SPOT NAME: ";
                logreghourArr[i].text = "REG. HOURS: ";
                logothourArr[i].text = "OT HOURS: ";
                logactivityArr[i].text = "ACTIVITY: ";
                lognotesArr[i].text = "NOTES: ";
                logbtneditArr[i].visible = 0;
                logbtnArr[i].visible = 0;
                linegrpArr[i].visible = 0;
                lognotesArr[i].visible = 0;
            }
            
            for(var i = 0; i <= maxLogCount; i++){
                var currentLog = newlog[i].split("//");
                var newBtnText = "R";
                var newBtnEditText = "E";
                logjobcodeArr[i].text = "JOB NAME: " + currentLog[1];
                logspotnameArr[i].text = "SPOT NAME: " +  currentLog[2];
                logreghourArr[i].text = "REG. HOURS: " + currentLog[4];
                logothourArr[i].text = "OT HOURS: " + currentLog[5];
                logactivityArr[i].text = "ACTIVITY: " + currentLog[3];
                lognotesArr[i].text = "NOTES: " + currentLog[6];
                
                logbtnArr[i].text = newBtnText;
                logbtnArr[i].visible = 1;

                logbtneditArr[i].text = newBtnEditText;
                logbtneditArr[i].visible = 1;

                logjobcodeArr[i].visible = 1;
                logspotnameArr[i].visible = 1;
                logreghourArr[i].visible = 1;
                logothourArr[i].visible = 1;
                logactivityArr[i].visible = 1;
                linegrpArr[i].visible = 1;
                lognotesArr[i].visible = 1;
                logbtnArr[i].onClick = function(){
                    var job = this.parent.parent.children[1].children[0].children[0].text.split(": ");
                    var spot = this.parent.parent.children[1].children[1].children[0].text.split(": ");
                    var act =  this.parent.parent.children[1].children[1].children[1].text.split(": ");
                    var reg = this.parent.parent.children[1].children[1].children[2].text.split(": ");
                    var ot = this.parent.parent.children[1].children[1].children[3].text.split(": ");
                    var notes = this.parent.parent.children[1].children[2].children[0].text.split(": ");
                    var newLineArr = [selectedDate, job[1], spot[1], act[1], reg[1], ot[1], notes[1]];
                    var strToRemove =  newLineArr.join('//');
                    RemoveItemFromLog(strToRemove);
                }
                logbtneditArr[i].onClick = function(){
                    var job = this.parent.parent.children[1].children[0].children[0].text.split(": ");
                    var spot = this.parent.parent.children[1].children[1].children[0].text.split(": ");
                    var act =  this.parent.parent.children[1].children[1].children[1].text.split(": ");
                    var reg = this.parent.parent.children[1].children[1].children[2].text.split(": ");
                    var ot = this.parent.parent.children[1].children[1].children[3].text.split(": ");
                    var notes = this.parent.parent.children[1].children[2].children[0].text.split(": ");
                    var newLineArr = [selectedDate, job[1], spot[1], act[1], reg[1], ot[1], notes[1]];
                    var strToRemove =  newLineArr.join('//');
                    EditItemFromLog(strToRemove);
                }
            }
        } else {
            for(var i = 0; i <= maxLogCount; i++){
                logbtnArr[i].text = "";
                logbtneditArr[i].text = "";
                logjobcodeArr[i].text = "";
                logspotnameArr[i].text = "";
                logreghourArr[i].text = "";
                logothourArr[i].text = "";
                logactivityArr[i].text = "";
                lognotesArr[i].text = "";
                logbtnArr[i].visible = 0;
                logbtneditArr[i].visible = 0;
                linegrpArr[i].visible = 0;
            }
        }
    }

    function loadLogFunctions(){
        logInputArray = loadLog(selectedDate, ttdd.selection.text);
        logFunctionList = [];
        for (var i = 0; i <= logInputArray.length - 1; i++) {
            logFunctionList.push(logInputArray[i]);
        }

    }

    function saveLog(date, job, spot, activity, reghours, othours, notes){
        var logstr = date  +"//" + job  + "//" + spot  + "//" + activity + "//" + reghours  + "//" + othours + "//" + notes;
        
        for(var i = 0; i <= maxLogCount; i++){
            if(logInputArray[i] == logstr){
                // RemoveItemFromLog(logstr);
                // alert(logInputArray[i]);
            }
        }

        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Users/" + userName + "/Logs/";
        var logFileName = filePath + date + "_LOG.txt";
        var logFile = new File(logFileName);
        if (!logFile.exists) {
            writeFile(logFile, logstr);
        }
        else {
            for(var i = 0; i <= logInputArray.length - 1; i++){
                if(logInputArray[i] != logstr){
                    writeFile(logFile, logstr + "\n" +logInputArray.join('\n'));
                } else {
                    removeAnElement(logInputArray, i + 1);
                    writeFile(logFile, logstr + "\n" +logInputArray.join('\n'));
                    loadHours();
                }
            }
        }
    }

    function overwriteLog(){
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Users/" + userName + "/Logs/";
        var logFileName = filePath + selectedDate + "_LOG.txt";
        var logFile = new File(logFileName);
        writeFile(logFile, logInputArray.join('\n'));
    }

    function loadLog(date, job) {
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Users/" + userName + "/Logs/";
        var logNames = filePath + date + "_LOG.txt";
        currentLogName = date + "_LOG.txt";
        var itemArr = new Array();
        var logFile = new File(logNames);
        if(logFile.exists){
            logFile.open();
            var content = logFile.read();
            logFile.close();
            if(content != ""){
                itemArr = content.split('\n');
            }
            else{
                itemArr = content.split('');
            }
        }
        return itemArr;
    }

///////// SAVE / LOAD CHATS /////////
    
    function chatRefresh(){
        var tempContacts = new Array();
        for(var i = 0; i <= userRBArr.length - 1; i++){
            if(userRBArr[i].value == true){
                tempContacts.push(userChatNameArr[i].text);
            }
        }
        var logname = scriptPath + "/XAVToolbox_Assets/Projects/Chats/" + tempContacts.join('_') + "_CHATLOG.txt";
        var logFile = new File(logname);      
        
        if(logFile.exists){      
            var chatlogTimeStamp = logFile.modified.toString();
            var dateTimeStr = new Date().toString();
            if(chatlogTimeStamp != dateTimeStr){
                curChatLogArr = loadChatLog();
                ChatTextField.text = currentChatLogText;
            }
        }
        else {
            return null;
        }
    }


    function loadChatLog(){
        currentChatLogText = '';
        var tempContacts = new Array();
        for(var i = 0; i <= userRBArr.length - 1; i++){
            if(userRBArr[i].value == true){
                tempContacts.push(userChatNameArr[i].text);
            }
        }

        var logname = scriptPath + "/XAVToolbox_Assets/Projects/Chats/" + tempContacts.join('_') + "_CHATLOG.txt";
        var logFile = new File(logname);

        var itemArr = new Array();
        if (logFile.exists) {
            logFile.open();
            var content = logFile.read();
            var contentDecoded = Base64.decode(content);
            itemArr = contentDecoded.split("//////");
            logFile.close();
        }

        for(var i = 0; i <= itemArr.length - 1; i++){
            if(currentChatLogText != ""){
                currentChatLogText = currentChatLogText + "\n" + itemArr[i];
            } else{
                currentChatLogText = itemArr[i];
            }
        }
        return itemArr;
    }

    function saveChatLog(newlogInput) {
        var content = "";
        var newline = userName.toUpperCase() + ":\n     " + newlogInput;
        var tempContacts = new Array();
        for(var i = 0; i <= userRBArr.length - 1; i++){
            if(userRBArr[i].value == true){
                tempContacts.push(userChatNameArr[i].text);
            }
        }
        var logname = scriptPath + "/XAVToolbox_Assets/Projects/Chats/" + tempContacts.join('_') + "_CHATLOG.txt";
        var logFile = new File(logname);
        if (!logFile.exists) {
            writeFile(logFile, Base64.encode(newline));
        }
        else if(logFile.exists) {
            logFile.open();
            var content = logFile.read();
            var contentDecoded = Base64.decode(content);
            itemArr = contentDecoded;
            logFile.close();
            writeFile(logFile, Base64.encode(itemArr + "//////" + newline));
        }
    }

///////// LOAD HOURS /////////

    function loadHours(){
        loggedHoursArr = [];
        loggedHoursOtArr = [];
        for(var z = 0; z <= weekdays.length - 1; z++){
            var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Users/" + userName + "/Logs/";
            var logNames = filePath + weekdays[z] + "_LOG.txt";
            currentLogName = weekdays[z] + "_LOG.txt";
            var itemArr = new Array();
            var logFile = new File(logNames);
            if(logFile.exists){
                logFile.open();
                var content = logFile.read();
                logFile.close();
                if(content != ""){
                    itemArr = content.split('\n');
                }
                else{
                    itemArr = content.split('');
                }
            }        
            var hourscount = 0;
            var hoursotcount = 0;
            for (var i = 0; i <= itemArr.length - 1; i++){
                var hourLog = itemArr[i].split("//");
                hourscount = hourscount + parseFloat(hourLog[4]);
                hoursotcount = hoursotcount + parseFloat(hourLog[5]);
            }
            loggedHoursArr.push(hourscount);
            loggedHoursOtArr.push(hoursotcount);
        }
    }

///////// JOB FUNCTIONS /////////

    function addProject(){
        var match = false;
        for (var i = 0; i < userProjectInputArray.length; i++) {
            if(userProjectInputArray[i] == newProjectName){
                match = true;
            }       
        }
        if(match){
            alert("This project already exists.");
        }
        else {
            userProjectInputArray.push(newProjectName);
            userProjectInputArray.sort();
            saveUserProjects(userName, userProjectInputArray.join());
        }
        loadUserProjects(userName);
        loadProjectFunctions();
    }


    function removeProject(){
        if(userProjectInputArray[0] != ""){
            removeAnElement(userProjectInputArray, ttdd.selection.index + 1);
            saveUserProjects(userName, userProjectInputArray.join());
        }
        loadUserProjects(userName);
        loadProjectFunctions();
    }

///////// SPOT FUNCTIONS /////////

    function addSpot(){
        var match = false;
        if(spotInputArray[0] != ""){
            for (var i = 0; i < spotInputArray.length; i++) {
                if(spotInputArray[i] == newSpotName){
                    match = true;
                }       
            }
            if(match){
                alert("This spot already exists.");
            }
            else {
                spotInputArray.push(newSpotName);
                spotInputArray.sort();
                saveSpots(ttdd.selection.text, spotInputArray.join());
            }
            
        }
        loadSpots(ttdd.selection.text);
        loadSpotsFunctions();
    }

    function removeSpot(){
        if(spotInputArray[0] != ""){
            removeAnElement(spotInputArray, spotdd.selection.index + 1);
            saveSpots(ttdd.selection.text, spotInputArray.join());
        }
        loadSpots(ttdd.selection.text);
        loadSpotsFunctions();
    }

///////// LOG FUNCTIONS /////////

    function addLog(){
        loadLog(selectedDate, ttdd.selection.text);
        loadLogFunctions();

        var reghours = this.intextinput.text;
        var othours =  this.outtextinput.text;
        
        if(reghours == ""){
            reghours = 0;
        }else{
            // alert(0);
        }
        if(othours == ""){
            othours = 0;
        }else{
            // alert(1);
        }
        saveLog(selectedDate, ttdd.selection.text, spotdd.selection.text , activitydd.selection.text, reghours, othours, this.notestextinput.text);
    }

    function RemoveItemFromLog(itemStr){
        for(var i = 0; i <= logInputArray.length - 1; i++){
            if(logInputArray[i] != itemStr){
                // alert(itemStr + "\n" + logInputArray[i]);
            }else{
                removeAnElement(logInputArray, i + 1);
                overwriteLog();
                loadHours();
                for(var z = 0; z <= weekdays.length - 1; z++){
                    totalhoursBtnArr[z].text = loggedHoursArr[z];
                    totalhoursotBtnArr[z].text = loggedHoursOtArr[z];
                }  
                refreshLog();
            }
        }
    }

    function EditItemFromLog(itemStr){
        // logInputArray
        var logItemArr = itemStr.split("//");
        // alert(logItemArr[1]);
        for(var i = 0; i <= userProjectInputArray.length - 1; i++){
            if(userProjectInputArray[i] == logItemArr[1]){
                ttdd.selection = i;
            }
        }
        for(var i = 0; i <= spotInputArray.length - 1; i++){
            if(spotInputArray[i] == logItemArr[2]){
                spotdd.selection = i;
            }
        }
        for(var i = 0; i <= activityFunctionList.length - 1; i++){
            if(activityFunctionList[i] == logItemArr[3]){
                activitydd.selection = i;
            }
        }
        this.notestextinput.text = logItemArr[6];
        this.intextinput.text = logItemArr[4];
        this.outtextinput.text = logItemArr[5];

    }

///////// SETTINGS / PREFERENCES /////////

    function launchSettings(){
            $.evalFile(scriptPath + "/XAVToolbox_Assets/TimeTracker_Tester_Settings.jsx");
    }

    function loadPermissions(userName) {
        var itemArr = new Array();
        var filePath = scriptPath + "/XAVToolbox_Assets/Projects/Users/" + userName + "/";
        var usersFileName = filePath + userName + "_PREFS.txt";
        var userFile = new File(usersFileName);
        if(userFile.exists){
            userFile.open();
            var content = userFile.read();
            userFile.close();
            if(content != ""){
                itemArr = content.split(',');
            }
            else{
                itemArr = content.split();
            }
            admin = itemArr[0];
            return itemArr;
        }
    }

///////// UTILITY FUNCTIONS /////////
    

    // function crypttest(){
        // var encrypted = CryptoJS.RC4.encrypt("Message", "Secret Passphrase");
        // var decrypted = CryptoJS.RC4.decrypt(encrypted, "Secret Passphrase");
        // var hash = md5('value');
        // var hash = TestVar;
        // alert(decrypted);
    // }

    function systemCheck(){
        var systemid = $.os.split(" ");
        if(systemid[0] == "Macintosh"){
            systemMac = true;
            systemPC = false;
            systemFont = "Trade Gothic Next";
        } else {
            systemMac = false;
            systemPC = true;
            systemFont = "Arial";
        }
    }

    function removeAnElement( array, index ) {
        index--;

        if ( index === -1 ) {
            return array.shift();
        } else {
            return array.splice( index, 1 );
        }
    }

    function writeFile(fileObj, fileContent, encoding) {
        encoding = encoding || "utf-8";
        fileObj = (fileObj instanceof File) ? fileObj : new File(fileObj);
        var parentFolder = fileObj.parent;
        if (!parentFolder.exists && !parentFolder.create())
            throw new Error("Cannot create file in path " + fileObj.fsName);
        fileObj.encoding = encoding;
        fileObj.open("w");
        fileObj.write(fileContent);
        fileObj.close();
        return fileObj;
    }

///////// CLEAR / BUILD LAYOUT /////////

    var rdetPal = TimeTracker_Tester_buildUI(thisObj);
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