var currentDate = "";
var currentDateYMD = "";
var currentMonth = "";

function dateHandler(){
    var currentDateStr = new Date().toString();
    var currentDateArray = currentDateStr.split(" ");
    currentDate = currentDateArray[1] + ", " + currentDateArray[0] + " " + currentDateArray[2] + ", " + currentDateArray[3];
    var dt = new Date();
    var month = dt.getMonth() + 1;
    var monthStr = "";
    
    if(month <= 9){
        monthStr = "0" + month.toString();
    } else{
        monthStr = month.toString();
    }
    var yearArr = currentDateArray[3].split('');
    var yearStr = yearArr[2] + yearArr[3];
    currentDateYMD = yearStr + monthStr + currentDateArray[2];
    currentMonth = monthStr;
}