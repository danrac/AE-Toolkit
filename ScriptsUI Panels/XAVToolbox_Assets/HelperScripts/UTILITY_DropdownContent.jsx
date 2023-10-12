////DROPDOWN CONTENT/////////
var formatList = new Array();
var framerateList = new Array();
var DMSList = new Array();
var srFunctionList = new Array();

function loadSRFunctions(){
    srFunctionList.push("Search / Replace");
    srFunctionList.push("Add Prefix");
    srFunctionList.push("Add Suffix");
    srFunctionList.push("Number");
    srFunctionList.push("Remove");
}

function loadCheckerFormats(){
    formatList.push("UHD");
    formatList.push("HD 2:40");
    formatList.push("HD 2:35");
    formatList.push("HD 2:10");
    formatList.push("HD 1:85");
    formatList.push("HD (No Matte)");
    formatList.push("HD 10/20");
    formatList.push("HD Netflix Product Safe");
    formatList.push("9x16 Netflix (TikTok)");
    formatList.push("9x16");
    formatList.push("9x16 TikTok (In-Feed)");
    formatList.push("9x16 TikTok (Takeover)");
    formatList.push("9x16 TikTok (Topdown)");
    formatList.push("9x16 Amazon (IGReels)");
    formatList.push("9x16 Amazon (TikTok)");
    formatList.push("9x16 Facebook (Reels)");
    formatList.push("9x16 Facebook (Stories)");
    formatList.push("9x16 Paramount (IGReels)");
    formatList.push("9x16 Paramount (Snap)");
    formatList.push("9x16 Starz Safe");
    formatList.push("4x5");
    formatList.push("1x1");
    formatList.push("Custom");
}
function loadFramerates(){
    framerateList.push("23.976 fps");
    framerateList.push("24 fps");
    framerateList.push("29.97 fps");
    framerateList.push("30 fps");
    framerateList.push("60 fps");
    framerateList.push("Custom");
}
function DMSARList(){
    DMSList.push("XAV Organizer");
    DMSList.push("DMS 16x9");
    DMSList.push("DMS 9x16");
    DMSList.push("DMS 4x5");
    DMSList.push("DMS 1x1");
}