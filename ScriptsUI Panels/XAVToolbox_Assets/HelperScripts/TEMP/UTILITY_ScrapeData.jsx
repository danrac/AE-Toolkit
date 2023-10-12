////DATA SCRAPER ///////////

var gslink = "";

function scrapeData(){
    var f = " ";
    var r = "\\ ";
    var cmd = "";
    var dataPath = scriptPath + "\\XAVToolbox_Assets\\SaveData\\";
    var tempPath = "C:\\Users\\"+ userName +"\\";
    var ProjectDataArr = [];
    var datafile = null;

    if(systemMac){
        var newPath = scriptPath + "/XAVToolbox_Assets/HelperScripts/XAVToolbox_Scrape.command";
        var scrapeScript  = new File(newPath).execute();        
    }
    if(systemPC){
        var curlCommand = "curl -L -o " + tempPath + "PROJECT_DATA.txt " + gslink;
        var cmd = "cmd /c \""+curlCommand+"\"";
        system.callSystem(cmd);
        var tempFile = new File(tempPath + "PROJECT_DATA.txt");
        tempFile.copy(dataPath + "PROJECT_DATA.txt");
        tempFile.remove();
    }
    
    var updateTimer = app.scheduleTask("update()", 1000, false);

    update = function () {    
        if(systemMac){
            var newPath = scriptPath + "/XAVToolbox_Assets/SaveData/docs.google.com/spreadsheets/d/1RmIljgl5nEhXci3DB8Cb1DjWmTHhVjQpYhqIL5_bgTE/index.html";
            datafile = new File(newPath);
        }
        
        if(systemPC){
            datafile = new File(dataPath + "PROJECT_DATA.txt"); 
        }
        
        if(datafile.exists){
            var itemArr = new Array();
            datafile.open();
            var content = datafile.read();
            datafile.close();
            itemArr = content.split('class="softmerge-inner');
            var tempSplit1 = itemArr[1].split('>');
            var tempSplit2 = tempSplit1[1].split('<');
            ProjectDataArr = tempSplit2[0].split(',');
            var filePath = scriptPath + "/XAVToolbox_Assets/SaveData/";
            var projName = filePath + "PROJECTS.txt";
            var projFile = new File(projName);

            if (!projFile.exists) {
                writeFile(projFile, ProjectDataArr.join(','));
            }
            else {
                writeFile(projFile, ProjectDataArr.join(','));
            }
        }
        else{
            alert("No file!");
        }
    }
}