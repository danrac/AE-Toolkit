(function XAVToolbox(thisObj) {
    //Load the XMP library
    var version = "2.0";
    var systemFont = "";
    var userName = system.userName;
    var systemPC;
    var systemMac;
    var rootpc = "";
    var rootmac = "";
    var gslink = "";
    var preferenceArray = new Array();
    var currentDate = "";
    var currentDateYMD = "";
    var projectSelection = 0;
    var showHideProject = false;
    var onlineRender = false;
    var subFolderInput = null;
    var userProjectInputArray = new Array();
    var XAVToolboxData = new Object();
    var formatList = new Array();
    var framerateList = new Array();
    var DMSList = new Array();
    var srFunctionList = new Array();
    var userPrefInputs = [0, 0, 0, 0, 0];
    var compSizeXSelection;
    var compSizeYSelection;
    var framerateSelection;
    var textLineReturn;
    var textAlignment;
    var infoTextOffsetX;
    var infoTextOffsetY;
    var compARname;
    var chartname;
    var chartnameHD;
    var mattename;
    var matteTypeName;
    var CPname;
    var cpCompName;
    var mainComp = null;
    var checkerText = "";
    var socialText = "";
    var legalText = "";
    var frameNum = 0;
    var selectionName = "";
    var scriptFile = new File($.fileName);
    var scriptPath = scriptFile.parent.fsName;
    var Chartimport;
    var HDchartimport;
    var Matteimport;
    var coverimport;
    var sizecbenabled = true;
    var fpscbenabled = true;
    var guidescbenabled = true;
    var selectedPreComps = new Array();
    var guideList = ["1x1_chart.psd", "1x1_matte.png", "4x5_chart.psd", "9x16_chart.psd", "9x16TT_1242x2208_matte.png", "4x5_matte.png", "4x5_9x16_matte.png", "HD_chart.psd", "UHD_chart.psd", "185_chart.psd", "185_matte.png", "210_chart.psd", "210_matte.png", "235_chart.psd", "235_matte.png", "240_chart.psd", "240_matte.png", "HD1020_chart.psd", "HD1020_matte.png", "NetflixProductSafe_chart.psd", "NetFlixProductSafe_matte.png", "TikTokSafe_chart.psd", "TikTokSafe_1242x2208_chart.png", "TikTokTopView_chart.png"];
    var progressBar;
    var typing = false;
    var addRender = false;
    var hasTemplates = false;
    var filecbArr = new Array();
    var thumbnail_renderSettings = {
        "Color Depth" : "16 bits per channel",
        Quality : "Best",
        Effects : "All On",
        "Time Span Start" : "0:00:00:00",
        "Time Span End" : "0:00:00:00",
        "Time Span Duration" : "0:00:00:01",
    };
    XAVToolboxData.scriptName = "XAVToolbox";
    XAVToolboxData.scriptTitle = XAVToolboxData.scriptName + " v1.0";
    if (ExternalObject.AdobeXMPScript == undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    }

    var guidesVisOnIcon = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x02\x00\x00\x00K\u008B\x124\x00\x00\x00\tpHYs\x00\x00.#\x00\x00.#\x01x\u00A5?v\x00\x00\x06\u00C6iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 6.0-c002 116.164655, 2021/01/26-15:41:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stEvt=\"http://ns.adobe.com/xap/1.0/sType/ResourceEvent#\" xmlns:photoshop=\"http://ns.adobe.com/photoshop/1.0/\" xmp:CreatorTool=\"Adobe Photoshop 21.2 (Macintosh)\" xmp:CreateDate=\"2021-03-04T23:00:24-08:00\" xmp:MetadataDate=\"2021-03-05T09:49:32-08:00\" xmp:ModifyDate=\"2021-03-05T09:49:32-08:00\" dc:format=\"image/png\" xmpMM:InstanceID=\"xmp.iid:344253bb-9ca3-427b-9216-823953628079\" xmpMM:DocumentID=\"xmp.did:06fa9006-4bce-45bd-a6f2-4bb6027b3533\" xmpMM:OriginalDocumentID=\"xmp.did:06fa9006-4bce-45bd-a6f2-4bb6027b3533\" photoshop:ColorMode=\"3\" photoshop:ICCProfile=\"sRGB IEC61966-2.1\"> <xmpMM:History> <rdf:Seq> <rdf:li stEvt:action=\"created\" stEvt:instanceID=\"xmp.iid:06fa9006-4bce-45bd-a6f2-4bb6027b3533\" stEvt:when=\"2021-03-04T23:00:24-08:00\" stEvt:softwareAgent=\"Adobe Photoshop 21.2 (Macintosh)\"/> <rdf:li stEvt:action=\"saved\" stEvt:instanceID=\"xmp.iid:344253bb-9ca3-427b-9216-823953628079\" stEvt:when=\"2021-03-05T09:49:32-08:00\" stEvt:softwareAgent=\"Adobe Photoshop 21.2 (Macintosh)\" stEvt:changed=\"/\"/> </rdf:Seq> </xmpMM:History> <photoshop:DocumentAncestors> <rdf:Bag> <rdf:li>adobe:docid:photoshop:a8f11a12-b97b-7c46-9dc8-1201339fc94f</rdf:li> <rdf:li>xmp.did:06fa9006-4bce-45bd-a6f2-4bb6027b3533</rdf:li> </rdf:Bag> </photoshop:DocumentAncestors> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>,\x18\u00EE\u0086\x00\x00\x03\u00E9IDAT8\u008D\u00AD\u00D5\u00CDK:]\x14\x07\u00F0\u00EB\u00F5\u00CE8N\u00A3f\x1AQ`o\u0094\u0094\u0092\u00D8B\x03\u00C1UED\u00D0\u009B\x11\x15A\u008Bj\x11-\"\u00DA\u00F4\x07\u00B4h\u00D7\",((\u00DA\x04\u00B5\u00A9\u00C4\u008AjUD\u00F4fe T\u00B8H\u0086\u00DE\u00A0\u00D1\u00CA\u0098\u00D4\u0099\u00B9\u00FE\x16\u00F6\u00F4\u00FC\u009E\u009Evv\u00963\u00C3\u0087;g\u00BE\u00E7\u008Clmm\r\u00FCR!\x00\u00C0\u00C4\u00C4\u0084\\.OG\u0091$ixx\x18\x01\x00\x10BiZ2\u0099\f\x00\x00\x01\x00\u00C9d2\x1D\u00E8K\u0080i*\x7F\x17\u00FA\u00F1\u00AA$I\x10B\x00\u00C0\u00C7\u00C7G,\x16\x13E\x11B\u00A8P(h\u009A\u0086\x10b\u008C\x7F\u00EC\u00C9\x0FV4\x1A\u00D5j\u00B5\x00\x00\u008E\u00E3\u008CFcii)EQ\u0089D\u0082e\u00D9@ @\u00D3\u00B4Z\u00AD~||d\x18&\u00D5\u00A6\x1F,\b\u00A1 \b\u0091H\u00C4n\u00B7\x17\x15\x15\x1D\x1C\x1C\u00B4\u00B6\u00B6\u00D6\u00D6\u00D6\x16\x17\x17\u00AB\u00D5j\u009E\u00E7\u00EF\u00EE\u00EE\u00F6\u00F7\u00F7=\x1E\u008F\u00C9d\u00AA\u00AC\u00AC\\__W*\u0095\x14Ea\u008C\u00BF[\u00A9winn\u00EE\u00E8\u00E8X\\\\t8\x1C\x03\x03\x03\f\u00C3\u0084B!\u009F\u00CF\u0097\u0097\u0097WZZj0\x18\x10B>\u009F\u00AF\u00B1\u00B1\u00B1\u00B0\u00B0paa\u0081\u00E7y\u009A\u00A6\u00FFc\t\u0082@\x10D{{{\x7F\x7F\u00FF\u00DA\u00DAZ8\x1C\x1E\x19\x19Q*\u0095KKK^\u00AFW\x10\x04\x00\u0080\u00C3\u00E1\u00E8\u00EB\u00EBs\u00B9\\\u00A1PhwwwhhH\u00A7\u00D3MOO\u00BF\u00BD\u00BD!\u0084>-\u008C1I\u0092MMM]]]\x1C\u00C7\u00ED\u00ED\u00ED\u0099L&\u0083\u00C1\u00B0\u00BD\u00BD\u00BD\u00BA\u00BAZ]]m\u00B1XB\u00A1\u0090\u00C7\u00E3\u00C9\u00C8\u00C8\u00E8\u00ED\u00EDu:\u009D^\u00AF\u00F7\u00E2\u00E2\u00A2\u00A6\u00A6F\u0092\u00A4\u00D9\u00D9\u00D9\u00D7\u00D7\u00D7\x7F-\u008B\u00C5\u00D2\u00D2\u00D2B\u0092\u00E4\u00E1\u00E1a\"\u00910\u009B\u00CD\u0082 lmm544\u00D4\u00D7\u00D7#\u0084L&\u0093R\u00A9L\u00D1F\u00A3\x11\x00p}}]QQa\u00B7\u00DBY\u0096]YY\x01\u00A9|eff\u00B6\u00B5\u00B5!\u0084DQ\f\u0087\u00C3\x10B\u00BD^\u00FF\u00F1\u00F1\x01\x00(((\u0080\x10\u00BE\u00BF\u00BF\u00C7\u00E3\u00F1\u00FC\u00FC|\u00BD^\u00CF\u00B2\u00ACF\u00A3\x11E\u0091\u00E7\u00F9\u00D49\u00EA\u00EA\u00EA4\x1A\u00CD\u00A7\u00C5\u00F3| \x10H}J\u0092$%I\u00E2y\u009E$I\u008C\u00F1\u00DB\u00DB\x1BA\x10\n\u0085\u0082 \u0088h4\u00FA\u00FE\u00FE\u00AER\u00A9\x04A\u0080\x10\u00A6\"F\x10D0\x18\u008C\u00C5b\u009FV\"\u0091\u00F0z\u00BD>\u009F\u008F \u0088\u00B2\u00B22\u00B9\\~ssCQ\u0094\u00D9l\u00DE\u00DC\u00DC<>>~yy\u00B9\u00BE\u00BE\u00DE\u00D8\u00D8`\x18\u00A6\u00BC\u00BC<\x14\n\x11\x04\u0091\u0097\u0097G\u0092\u00E4\u00C3\u00C3\u00C3\u00F2\u00F2r4\x1A\u00FD\u00EC\x17B\u0088\u00E3\u00B8\u00F9\u00F9y\u0095J\u00E5p8\u008A\u008B\u008B///\u00EB\u00EB\u00EB\u009B\u009B\u009B\u00EF\u00EE\u00EE\u00DCnwnn.\u00C7q\u00D9\u00D9\u00D9\u0083\u0083\u0083\n\u0085\u00E2\u00E4\u00E4\x04B\u00E8t:Y\u0096\u009D\u009A\u009A\n\x06\u0083\u00A93\u00CA;;;\u008F\u008E\u008E(\u008Az~~>;;\u00D3\u00E9t6\u009B\u00CD\u00EF\u00F7\u00C7b1\u00AB\u00D5j\u00B3\u00D9h\u009A\u0096$\u00C9j\u00B5vww\x17\x16\x16\u00FA\u00FD\u00FE\u009D\u009D\u009D\u00DA\u00DAZI\u0092\u00C6\u00C7\u00C7\u00AF\u00AE\u00AE(\u008AJ&\u0093UUU\u009F\u00F9\u00C2\x18\u00ABT\u00AAH$266\u00D6\u00D3\u00D3\u0093\u009D\u009D\u00ED\u00F1x\x14\n\u0085\u00D3\u00E9t\u00B9\\_\x19<==\u009D\u0099\u0099\u00C9\u00C9\u00C9I$\x12\u00A3\u00A3\u00A3\x1C\u00C7\u00A5\u00BA\u00FE=\u00F7\x18c\u0086a\u00E2\u00F1\u00F8\u00DC\u00DC\\II\u00C9\u00D3\u00D3\u0093\u00DB\u00ED>??W\u00AB\u00D5\x18c\ba<\x1E\u00F7\u00F9|\u00F7\u00F7\u00F7\x18\u00E3\u00C9\u00C9I\u009E\u00E7\u00B5Z\u00ED\u00D7\x00}\u009Fm\u008C1A\x10\b!\u0096e\t\u0082\u0088\u00C5b\x1E\u008FG\x14\u00C5\u00AF\u0081e\x18\u0086\u00A6\u00E9\u00DB\u00DB[\u0099L\u00A6R\u00A9\u00FE\u0086~\u00DE\x132\u0099\u008C$I\x00\x00I\u0092YYY\u00FF\x7F u\u00F7\x1B\x04~w\x17B\u00F0\u00CF\u00B6N\u00A7R\x02\x02\x00\u0088\u00A2\u0098\u00E6\u00CA\u0097$\t\x00 \u00FB\u00C5\u00FF\u00E3\x1F1\u008C\u00CD?f=\x1D(\x00\x00\x00\x00IEND\u00AEB`\u0082";
    var guidesVisOffIcon = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x02\x00\x00\x00K\u008B\x124\x00\x00\x00\tpHYs\x00\x00.#\x00\x00.#\x01x\u00A5?v\x00\x00\x07\u00A3iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 6.0-c002 116.164655, 2021/01/26-15:41:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stEvt=\"http://ns.adobe.com/xap/1.0/sType/ResourceEvent#\" xmlns:photoshop=\"http://ns.adobe.com/photoshop/1.0/\" xmp:CreatorTool=\"Adobe Photoshop 21.2 (Macintosh)\" xmp:CreateDate=\"2021-03-04T23:00:24-08:00\" xmp:MetadataDate=\"2021-03-05T09:49:34-08:00\" xmp:ModifyDate=\"2021-03-05T09:49:34-08:00\" dc:format=\"image/png\" xmpMM:InstanceID=\"xmp.iid:d458bb3e-cf12-456b-b0a7-ec04927a3d54\" xmpMM:DocumentID=\"adobe:docid:photoshop:a8f11a12-b97b-7c46-9dc8-1201339fc94f\" xmpMM:OriginalDocumentID=\"xmp.did:06fa9006-4bce-45bd-a6f2-4bb6027b3533\" photoshop:ColorMode=\"3\" photoshop:ICCProfile=\"sRGB IEC61966-2.1\"> <xmpMM:History> <rdf:Seq> <rdf:li stEvt:action=\"created\" stEvt:instanceID=\"xmp.iid:06fa9006-4bce-45bd-a6f2-4bb6027b3533\" stEvt:when=\"2021-03-04T23:00:24-08:00\" stEvt:softwareAgent=\"Adobe Photoshop 21.2 (Macintosh)\"/> <rdf:li stEvt:action=\"saved\" stEvt:instanceID=\"xmp.iid:2ab6a413-ebb4-4928-9b33-f5b0ad3f62bf\" stEvt:when=\"2021-03-04T23:00:33-08:00\" stEvt:softwareAgent=\"Adobe Photoshop 21.2 (Macintosh)\" stEvt:changed=\"/\"/> <rdf:li stEvt:action=\"saved\" stEvt:instanceID=\"xmp.iid:d458bb3e-cf12-456b-b0a7-ec04927a3d54\" stEvt:when=\"2021-03-05T09:49:34-08:00\" stEvt:softwareAgent=\"Adobe Photoshop 21.2 (Macintosh)\" stEvt:changed=\"/\"/> </rdf:Seq> </xmpMM:History> <photoshop:DocumentAncestors> <rdf:Bag> <rdf:li>adobe:docid:photoshop:a8f11a12-b97b-7c46-9dc8-1201339fc94f</rdf:li> <rdf:li>xmp.did:06fa9006-4bce-45bd-a6f2-4bb6027b3533</rdf:li> </rdf:Bag> </photoshop:DocumentAncestors> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>O9eU\x00\x00\x03\u00C9IDAT8\u008D\u00AD\u00D5K,+_\x18\x00\u00F0sf\u00DA\u009Ahgn$T#4\x11m\u00C8\u00B4\u0089\u0085\u0085gId<\u00BA\u00A8\u00AA\u00B2\u00C0\x12\x0B\u0089\u008D\u00B0\u00B4\u00B7#\x11\x0B\x11\u00B1\u00B1AE\u00B4\x154D\u009Bx,\x10,JZt\u00D1z\u00854\u00C5T;\u00C3\u00BC\u00FE\u008B\u008A\u009B\x7F\u00D9\\\u00F7\u009E\u00E5\u009C|\u00BF|\u00DF7\u00DF9\x07:\u009DN\u00F0\u008F\u0096\f\x000>>\u008E\u00A2\u00E8\x0F\u0082EQL$\x12v\u00BB\u00BD\u00B5\u00B55\x10\b\u00C8\x00\x002\u0099\u00EC\x07\u0096 \b,\u00CB\u00B6\u00B7\u00B7[\u00ADV\u00B7\u00DB\u00AD\u00D7\u00EB\x11\x00\u0080$I?\u0080\x12\u0089\u0084\u00CDf\u00B3Z\u00AD\u00AB\u00AB\u00AB\u008B\u008B\u008B\x00\x00\u00E4O\u0095\u00AF\u0090\u00C3\u00E1P*\u0095 \u00D5\u00AF\u00BF\u0084T*U\u00AA\u00B2\u00EF-\u0099L\x06!\u00E48N\u00ADV\u00EBt\u00BA\u00CC\u00CC\u00CC\u00B7\u00B7\u00B7\u00DB\u00DB\u00DB\u00CB\u00CB\u00CBT\u00B3-\x16\u00CB'\u0084\u00A2(\u00CF\u00F3\u00DF[:\u009DN\u00AB\u00D5\u00EE\u00EF\u00EF\u00D7\u00D6\u00D6666\x16\x16\x16\x12\x04\u00C10\u00CC\u00D5\u00D5\u00D5\u00D2\u00D2\x12A\x10\x16\u008B\u00C5\u00E7\u00F3}B\u009F\u0081\u00E9\u00FD\u00AA\u00AD\u00AD\x1D\x1C\x1CdY\u00B6\u00AA\u00AA\u00AA\u00BF\u00BF\u00BF\u00B4\u00B4\u00F4\u00F9\u00F9\u00D9\u00E7\u00F3\x05\u0083A\u0086a\u00CA\u00CA\u00CA,\x16\u00CB\u00D6\u00D6VFFF___\u00DA\u00DF\u00FF\u009D\x17\u0084\u00B0\u00A5\u00A5\u00A5\u00AF\u00AF\u00CF\u00E9tF\u00A3\u00D1\u00E1\u00E1a\f\u00C3\u00E6\u00E7\u00E7\u00D7\u00D6\u00D6\u0092\u00C9$M\u00D3\x1D\x1D\x1Duuu\u0081@\u00C0\u00EF\u00F7k\u00B5\u00DA\u00A1\u00A1!\u008DF3==\u00CD\u00B2\u00EC\u00FF,\x14E\u00CDfswww,\x16\u00DB\u00D9\u00D91\x1A\u008DZ\u00ADvss\u00D3\u00E5r\u0099L&\f\u00C3\x10\x04\u00A9\u00AC\u00AC\u00DC\u00DB\u00DB3\x1A\u008D6\u009B\u00CD\u00E3\u00F1\u009C\u009C\u009C444\b\u00820;;\x1B\u008F\u00C7?j\u0084\x10\x1A\f\x06\u00BB\u00DD.\u0097\u00CBOOOy\u009E'I\u0092\u00E7\u00F9\u008D\u008D\r\u008A\u00A2\u008A\u008B\u008B\u00B3\u00B2\u00B2*++\x0F\x0E\x0EVVVp\x1C7\x1A\u008D\x10\u00C2\u008B\u008B\x0B\u009E\u00E7+**(\u008AJ\x15\u008B\x00\x00\u0094Je{{\u00BB\\.\x17\x04\u00E1\u00E9\u00E9I\u0092\u00A4\u00EC\u00EC\u00ECd2\u00C9\u00F3\u00BC \b///$I\u009E\u009F\u009F\u00A3(\u00AA\u00D3\u00E9\x1E\x1E\x1E\b\u0082HM\x06\x00\u0080\u00E7\u00F9\u00E6\u00E6f\x1C\u00C7?,\u0096e\u00FD~\u00BF$I\x10\u00C2\u008C\u008C\fI\u0092\x18\u0086\x11\x04\u00E1\u00F1\u00F1\x11\u00C30\u0083\u00C1p~~\u009E\u0095\u0095\u00A5\u00D1hX\u0096\u00FD\u00F5\u00EB\x17\u00C7q\x10\u00C2T.\n\u0085\"\x14\n\u00BD\u00BD\u00BD}X<\u00CF\u00AF\u00AF\u00AF\x1F\x1F\x1F\u00CB\u00E5r\u00BD^\u008F \u0088\u00DF\u00EF\x0F\u0085B\x14E\u0095\u0097\u0097\x1F\x1D\x1D\u0089\u00A2\u0088\u00A2\u00E8\u00F6\u00F66A\x10$IF\"\x11\x14E\u00F3\u00F2\u00F20\f\u00BB\u00BB\u00BBs8\x1C\f\u00C3\u00FC\u00EE}<\x1E\u009F\u009B\u009BS\u00A9T\u00D5\u00D5\u00D5\x05\x05\x05^\u00AF\x17\u00C7q\u0093\u00C9\u00E4\u00F5z\x17\x17\x17u:\x1DM\u00D3999\x03\x03\x03\n\u0085\u00E2\u00F0\u00F0\x10EQ\u0093\u00C9\x14\x0E\u0087\u00A7\u00A6\u00A6\u00AE\u00AF\u00AF\u00D3g\"\x1A\u008D\u008E\u008D\u008D\u00C5b\u00B1\u00A2\u00A2\"\x1C\u00C7I\u0092\f\x06\u0083%%%===777\u00B9\u00B9\u00B9\u00F5\u00F5\u00F5\u00F9\u00F9\u00F9\u00A7\u00A7\u00A7gggMMM\u00E1pxbb\"\x12\u0089|3_\x00\x00\u009A\u00A6GGG{{{)\u008A\u00DA\u00D8\u00D8\x10E\u00B1\u00AB\u00AB\u00AB\u00AE\u00AE.\u00B5\u00CBq\u00DC\u00C1\u00C1\u00C1\u00CC\u00CC\u008CZ\u00AD\u00E68ndd\u00E4s\u00B2\u00D2\u00AD\u00CFC[SS\u00B3\u00BE\u00BE\u00BE\u00B0\u00B0\u0080\u00E3\u00F8\u00EB\u00EB+\u008E\u00E3\u00A2(\"\b\u00F2\u00FE\u00FE~xxH\u00D34\u00CF\u00F3\u0093\u0093\u0093_\x0F\u009F,\r\u00B2Z\u00AD.\u0097kyyY\u00A9TB\bwww\u00BF\u00C6\u00DC\u00DF\u00DF\x7F\u00FD\u00F8a\u0089\u00A2\u00C8\u00B2l\x1A\u00F4\u0083\u009B\x16\x01\x00$\u0093\u00C9\u00B6\u00B6\u00B6\u00BF\u0084>\u00F2\u00EA\u00EC\u00EC4\u009B\u00CDn\u00B7\u00FB\u00C7\x10\u0084\u00F0\u00C32\u009B\u00CD\x1E\u008F\u00C7\u00E1pdffJ\u0092\u0094\u00BA\u00D8\u00FEh\t\u0082\x00\x00\u0080\u00FF\u00F0}\u00FC\x0F\u00CFv\u00F7\u00DD\x18\x7F\u00A8\u00A3\x00\x00\x00\x00IEND\u00AEB`\u0082";
    //Build UI

    function XAVToolbox_buildUI(thisObj) {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "XAVToolbox", undefined, { resizeable: true });
        if (pal != null) {
            var resSourcing =
            "panel {orientation:'column', alignment:['fill','top'], \
                cmds1: Group {orientation:'column', alignment:['fill','top'], \
                    pastePaths: Button { text:'" + "PASTE ASSET PATHS" + "', alignment:['center','bottom'], preferredSize:[360,25] }, \
                    textField: EditText { alignment:['fill','fill'], properties:{multiline:true, scrolling:true} }, \
                    ImportPaths: Button { text:'" + "IMPORT ASSETS" + "', alignment:['center','bottom'], preferredSize:[360,25] }, \
                }, \
                cmds4: Group {orientation:'row', alignment:['fill','top'], \
                    SourceFromRen: Button { text:'" + "Import Sources : AE File" + "', alignment:['center','bottom'], preferredSize:[175,25] }, \
                    SourceFromRef: Button { text:'" + "Import Source : PR File" + "', alignment:['center','bottom'], preferredSize:[175,25] }, \
                }, \
            }";
            var resCompName =
            "group { orientation:'column', alignment:['center','top'], preferredSize:[360,65], \
            }";
            var resCreateModifyPanel =
            "panel { orientation:'column', alignment:['center','top'], \
            }";
            var resCreateModifyDrops =
            "group { orientation:'row', alignment:['fill','top'], \
            }";
            var resCreateModify =
            "group { orientation:'column', alignment:['center','top'], \
                customFormatCmds: Group {orientation:'row', alignment:['left','bottom'], \
                    title: StaticText { text:'" + "W:" + "', alignment:['left','center']} , \
                    widthField: EditText { alignment:['center','center'], preferredSize:[60,20], properties:{multiline:false} }, \
                    title: StaticText { text:'" + "H:" + "', alignment:['left','center']} , \
                    heightField: EditText { alignment:['center','center'], preferredSize:[60,20], properties:{multiline:false} }, \
                    title: StaticText { text:'" + "FPS:" + "', alignment:['right','center']} , \
                    fpsField: EditText { alignment:['center','center'], preferredSize:[60,20], properties:{multiline:false} }, \
                }, \
                cmds7: Group {orientation:'row', alignment:['right','bottom'], \
                    title: StaticText { text:'" + "JOB:" + "', alignment:['left','center']} , \
                    jobField: EditText { alignment:['center','center'], preferredSize:[137,20], properties:{multiline:false} }, \
                    title: StaticText { text:'" + "STYLE:" + "', alignment:['left','center']} , \
                    styleField: EditText { alignment:['center','center'], preferredSize:[137,20], properties:{multiline:false} }, \
                }, \
                cmds8: Group {orientation:'row', alignment:['right','bottom'], \
                    title: StaticText { text:'" + "DESCRIPTION:" + "', alignment:['left','center']} , \
                    descField: EditText { alignment:['center','center'], preferredSize:[190,20], properties:{multiline:false} }, \
                    title: StaticText { text:'" + "INITIALS:" + "', alignment:['right','center']} , \
                    initField: EditText { alignment:['center','center'], preferredSize:[25,20], properties:{multiline:false} }, \
                }, \
                cmds1: Group {orientation:'row', alignment:['fill','center'], \
                    createCompBtn: Button { text:'" + "CREATE COMP" + "', alignment:['center','center'], preferredSize:[170, 25] }, \
                    modifyCompBtn: Button { text:'" + "MODIFY COMP" + "', alignment:['center','center'], preferredSize:[170, 25] }, \
                }, \
                cmds2: Group {orientation:'row', alignment:['fill','center'], \
                    conformLayerSizeBtn: Button { text:'" + "CONFORM SELECTED LAYER SIZE" + "', alignment:['center','center'], preferredSize:[350, 25] }, \
                }, \
                cmds9: Panel {orientation:'row', alignment:['center','top'], \
                    sizeCB: Checkbox { text: 'SIZE', alignChildren: 'center', preferredSize: ['80','15']}, \
                    fpsCB: Checkbox { text: 'FPS', alignChildren: 'center', preferredSize: ['80','15']}, \
                    guidesCB: Checkbox { text: 'GUIDES', alignChildren: 'center', preferredSize: ['80','15']}, \
                }, \
            }";
            var resCheckers =
            "group { orientation:'row', alignment:['fill','top'], \
                cmds1: Group {orientation:'row', alignment:['center','top'], \
                    title: StaticText { text:'" + "FRAME #:" + "'} , \
                    frameField: EditText { properties:{multiline:false} }, \
                }, \
                cmds2: Group {orientation:'row', alignment:['center','center'], \
                    makeCheckerBtn: Button { text:'" + "CREATE CHECKER" + "', alignment:['fill','center'] }, \
                    addRenderBtn: Button { text:'" + "RENDER CHECKERS" + "', alignment:['fill','center'] }, \
                }, \
            }";
            var resCovers = 
            "group { orientation:'column', alignment:['center','top'], \
                cmds1: Group {orientation:'row', alignment:['fill','bottom'], \
                    title: StaticText { text:'" + "LINE1:" + "', alignment:['left','center']} , \
                    toplineField: EditText { alignment:['right','center'], preferredSize:[125,0], properties:{multiline:false} }, \
                    title: StaticText { text:'" + "LINE2:" + "', alignment:['left','center']} , \
                    bottomlineField: EditText { alignment:['right','center'], preferredSize:[125,0], properties:{multiline:false} }, \
                }, \
                cmds2: Group {orientation:'row', alignment:['fill','bottom'], \
                    title: StaticText { text:'" + "DATE:" + "', alignment:['left','center']} , \
                    dateField: EditText { alignment:['right','center'], preferredSize:[125,0], properties:{multiline:false} }, \
                    title: StaticText { text:'" + "SPOT:" + "', alignment:['left','center']} , \
                    spotField: EditText { alignment:['right','center'], preferredSize:[125,0], properties:{multiline:false} }, \
                }, \
                cmds3: Group {orientation:'column', alignment:['center','center'], \
                    makeCoverBtn: Button { text:'" + "CREATE COVER" + "', alignment:['fill','center'] }, \
                }, \
            }";
            var resDMS =
            "group { orientation:'column', alignment:['fill','top'], \
                cmds1: Group {orientation:'column', alignment:['fill','center'], \
                    DMSBtn: Button { text:'" + "ORGANIZE" + "', alignment:['center','center'], preferredSize:[150, 25] }, \
                }, \
            }";
            var resCollect =
            "group { orientation:'column', alignment:['fill','top'], \
                cmds1: Group {orientation:'column', alignment:['fill','center'], \
                    collectBtn: Button { text:'" + "COLLECT PROJECT" + "', alignment:['center','center'], preferredSize:[350, 25] }, \
                }, \
            }";
            var resCleanUp =
            "group { orientation:'column', alignment:['fill','top'], \
                cmds1: Group {orientation:'row', alignment:['fill','center'], \
                    consolDups: Button { text:'" + "CONSOLIDATE" + "', alignment:['center','center'], preferredSize:[110, 25] }, \
                    consolDupsLike: Button { text:'" + "LIKE FILES" + "', alignment:['center','center'], preferredSize:[110, 25] }, \
                    ReduceSelected: Button { text:'" + "REDUCE" + "', alignment:['center','center'], preferredSize:[110, 25] }, \
                }, \
            }";
            var resRename =
            "group { orientation:'column', alignment:['center','top'], \
                cmds1: Group {orientation:'row', alignment:['fill','top'], \
                    titleSearch: StaticText { text:'" + "SEARCH:" + "', alignment:['left','center']} , \
                    searchField: EditText { alignment:['right','center'], preferredSize:[290,20], properties:{multiline:false} }, \
                }, \
                cmds2: Group {orientation:'row', alignment:['fill','top'], \
                    titleReplace: StaticText { text:'" + "REPLACE:" + "', alignment:['left','center']} , \
                    replaceField: EditText { alignment:['right','center'], preferredSize:[290,20], properties:{multiline:false} }, \
                }, \
                cmds3: Group {orientation:'row', alignment:['fill','top'], \
                    duplicateCompBtn: Button { text:'" + "DUPLICATE COMPS" + "', alignment:['center','center'], preferredSize:[170, 25] }, \
                    RenameSelected: Button { text:'" + "RENAME SELECTED" + "', alignment:['center','center'], preferredSize:[170, 25] }, \
                }, \
            }";
            var resUsage =
            "panel { orientation:'column', alignment:['center','top'], \
                cmds1: Group {orientation:'row', alignment:['center','center'], \
                    extrasBtn: Button { text:'" + "EXTRAS" + "', alignment:['center','center'], preferredSize:[105, 25] }, \
                    buildOptions: Button { text:'" + "OPTIONS" + "', alignment:['center','center'], preferredSize:[105, 25] }, \
                    usageBtn: Button { text:'" + "HELP" + "', alignment:['center','center'], preferredSize:[105, 25] }, \
                }, \
            }";
            var resVer =
            "group { orientation:'column', alignment:['fill','top'], \
                cmds1: Group {orientation:'row', alignment:['fill','center'], \
                    scriptVersion: StaticText { text:'" + "" + "', alignment:['center','center']} , \
                }, \
            }";

            preferenceArray = parseBuildOptionsToArr();
            rootpc = preferenceArray[7];
            rootmac = preferenceArray[9];
            gslink = preferenceArray[9];

            var itemString = preferenceArray.join('_');
            savePrefs("BUILD_ORGANIZE", itemString, "PREFS"); 
            scrapeData();
            getCurrentDate();
            userProjectInputArray = loadUserProjects(userName);
            loadProjectFunctions();
            systemCheck();
            canWriteFiles();
            loadCheckerFormats();
            loadFramerates();
            loadSRFunctions();
            DMSARList();

            mainToolBoxPanel = pal.add("panel", undefined, '');
            mainToolBoxPanel.margins = [4, 4, 4, 4];
            mainToolBoxPanel.graphics.backgroundColor = mainToolBoxPanel.graphics.newBrush(mainToolBoxPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.15,1]);

            patchPanel = mainToolBoxPanel.add("panel", undefined, "");
            patchPanel.margins = [4, 4, 4, 4];
            patchPanelgrp = patchPanel.add("group", undefined, "");

            patchBTN = patchPanelgrp.add("button", undefined, "PATCH BUTTON");
            patchBTN.size = [400, 45];
            patchBTN.text = "Click here to patch offline guides.";
            patchBTN.fillBrush = patchBTN.graphics.newBrush(patchBTN.graphics.BrushType.SOLID_COLOR, [0.25,0,0]);
            patchBTN.textPen = patchBTN.graphics.newPen (patchBTN.graphics.PenType.SOLID_COLOR,[1,1,1], 1);
            patchBTN.onDraw = colorPatchBTN;

            patchBTN.onClick = function(){
                patchPaths();
            }

            showHideProjectBtn = mainToolBoxPanel.add('Button', undefined, '-------------------------------------    PROJECT NAVIGATION    -------------------------------------');
            showHideProjectBtn.size = [400, 25];

            MainProjectPanel = mainToolBoxPanel.add("Panel", undefined, "");
            MainProjectPanel.orientation = "row";
            MainProjectPanel.graphics.backgroundColor = MainProjectPanel.graphics.newBrush(MainProjectPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.15,0.2,1]);

            projPanel =  MainProjectPanel.add("panel", undefined, "");
            projPanel.orientation = "column";
            projPanel.alignment = ["fill", "center"];

            ddgrp = projPanel.add('group', undefined, '');
            ddgrp.orientation = 'row';

            projdd = ddgrp.add("dropdownlist", undefined, projectFunctionList);
            projdd.alignment = ["center", "top"];
            projdd.size = [300, 25];
            projdd.selection = 0;

            ddrefresh = ddgrp.add("Button", undefined, 'REFRESH');
            ddrefresh.alignment = ["center", "top"];
            ddrefresh.size = [100, 25];

            ddrefresh.onClick = function(){
                scrapeData();
                projdd.removeAll();
                userProjectInputArray = loadUserProjects(userName);   
                for (var i = 0; i <= userProjectInputArray.length - 1; i++) {
                    projdd.add("item", userProjectInputArray[i]);
                }
                projdd.selection = 0;
                pal.layout.layout(true);
                pal.layout.resize();
            }

            projdd.onChange = function (){
             projectSelection = projdd.selection;
                var projectpath = rootpc.toString() + projectSelection.toString() + "\\05_" + projectSelection.toString() + "_GFX\\02_AfterEffects\\";
                current(projectpath);
                var myFolder = myFolder.selectDlg(projectpath);
            }

            openFunctionGrp =  projPanel.add("panel", undefined, "");
            openFunctionGrp.orientation = 'row';
            
            OpenProject =  openFunctionGrp.add("Button", undefined, "OPEN PROJECT FILE");
            OpenProject.size = [400, 25];
            OpenProject.alignment = ['fill', 'fill'];

            OpenProject.onClick = function(){
                if(projdd.selection != 0){
                    var projectpath = rootpc.toString() + projectSelection.toString() + "\\05_" + projectSelection.toString() + "_GFX\\02_AfterEffects\\";
                    OpenFromDirectory(projectpath);
                } else {
                    alert("Please select a project from the drop down.");
                }
            }

            revealFunctionGrp =  projPanel.add("panel", undefined, "REVEAL FOLDER:");
            revealFunctionGrp.orientation = 'row';
            
            RevealProject =  revealFunctionGrp.add("Button", undefined, "PROJECTS");
            RevealAsset =  revealFunctionGrp.add("Button", undefined, "ASSETS");
            RevealToGFX =  revealFunctionGrp.add("Button", undefined, "TO GFX");
            RevealOutput =  revealFunctionGrp.add("Button", undefined, "OUTPUTS");

            RevealProject.onClick = function(){
                if(projdd.selection != 0){
                    var projectpath = rootpc.toString() + projectSelection.toString() + "\\05_" + projectSelection.toString() + "_GFX\\02_AfterEffects\\";
                    var folder = Folder(projectpath);
                    var cmd = ($.os.indexOf("Win") != -1) ? "explorer " + Folder.decode(folder.fsName) : "open \"" + Folder.decode(folder.fsName) + "\"";
                    system.callSystem(cmd);
                } else {
                    alert("Please select a project from the drop down.");
                }
            }

            RevealAsset.onClick = function(){
                if(projdd.selection != 0){
                    var projectpath = rootpc.toString() + projectSelection.toString() + "\\05_" + projectSelection.toString() + "_GFX\\03_Assets\\";
                    var folder = Folder(projectpath);
                    var cmd = ($.os.indexOf("Win") != -1) ? "explorer " + Folder.decode(folder.fsName) : "open \"" + Folder.decode(folder.fsName) + "\"";
                    system.callSystem(cmd);
                } else {
                    alert("Please select a project from the drop down.");
                }
            }

            RevealOutput.onClick = function(){
                if(projdd.selection != 0){
                    var projectpath = rootpc.toString() + projectSelection.toString() + "\\05_" + projectSelection.toString() + "_GFX\\07_Output\\";
                    var folder = Folder(projectpath);
                    var cmd = ($.os.indexOf("Win") != -1) ? "explorer " + Folder.decode(folder.fsName) : "open \"" + Folder.decode(folder.fsName) + "\"";
                    system.callSystem(cmd);
                } else {
                    alert("Please select a project from the drop down.");
                }
            }

            RevealToGFX.onClick = function(){
                if(projdd.selection != 0){
                    var projectpath = rootpc.toString() + projectSelection.toString() + "\\05_" + projectSelection.toString() + "_GFX\\06_ToGFX\\";
                    var folder = Folder(projectpath);
                    var cmd = ($.os.indexOf("Win") != -1) ? "explorer " + Folder.decode(folder.fsName) : "open \"" + Folder.decode(folder.fsName) + "\"";
                    system.callSystem(cmd);
                } else {
                    alert("Please select a project from the drop down.");
                }
            }

            importFunctionGrp =  projPanel.add("panel", undefined, "IMPORT ASSETS:");
            importFunctionGrp.orientation = 'row';
            
            ImportProject =  importFunctionGrp.add("Button", undefined, "PROJECTS");
            ImportAsset =  importFunctionGrp.add("Button", undefined, "ASSETS");
            ImportToGFX =  importFunctionGrp.add("Button", undefined, "TO GFX");
            ImportOutput =  importFunctionGrp.add("Button", undefined, "OUTPUTS");

            ImportProject.onClick = function(){
                if(projdd.selection != 0){
                    var projectpath = rootpc.toString() + projectSelection.toString() + "\\05_" + projectSelection.toString() + "_GFX\\02_AfterEffects\\";
                    ImportFromDirectory(projectpath);
                } else {
                    alert("Please select a project from the drop down.");
                }
            }

            ImportAsset.onClick = function(){
                if(projdd.selection != 0){
                    var projectpath = rootpc.toString() + projectSelection.toString() + "\\05_" + projectSelection.toString() + "_GFX\\03_Assets\\";
                    ImportFromDirectory(projectpath);
                } else {
                    alert("Please select a project from the drop down.");
                }
            }

            ImportOutput.onClick = function(){
                if(projdd.selection != 0){
                    var projectpath = rootpc.toString() + projectSelection.toString() + "\\05_" + projectSelection.toString() + "_GFX\\07_Output\\";
                  ImportFromDirectory(projectpath);
                } else {
                    alert("Please select a project from the drop down.");
                }
            }

            ImportToGFX.onClick = function(){
                if(projdd.selection != 0){
                    var projectpath = rootpc.toString() + projectSelection.toString() + "\\05_" + projectSelection.toString() + "_GFX\\06_ToGFX\\";
                    ImportFromDirectory(projectpath);
                } else {
                    alert("Please select a project from the drop down.");
                }
            }

            renderGrp =  projPanel.add("panel", undefined, "");
            renderGrp.orientation = 'column';
            renderGrp.alignment = ['fill', 'fill'];
            
            subfolderGrp =  renderGrp.add("group", undefined, "");
            subfolderGrp.orientation = 'row';
            subFolderUIText =  subfolderGrp.add("StaticText", undefined, "ADD SUBFOLDER:");
            subFolderUIText.alignment = ['fill', 'fill'];
            subFolderInput =  subfolderGrp.add("EditText", undefined, "");
            subFolderInput.alignment = ['fill', 'fill'];
            subFolderInput.size = [300, 25];

            renderFunctionGrp =  renderGrp.add("group", undefined, "");
            renderFunctionGrp.orientation = 'row';

            renderOfflineComp =  renderFunctionGrp.add("Button", undefined, "RENDER COMPS FOR OFFLINE");
            renderOfflineComp.size = [195, 25];
            renderOfflineComp.alignment = ['fill', 'fill'];

            renderOfflineComp.onClick = function(){
                if(projdd.selection != 0){
                    onlineRender = false;
                    var renderSubfolder = "";
                    if(subFolderInput.text != ""){
                       renderSubfolder =  "\\" + subFolderInput.text;
                    }
                    var projectpath = rootpc.toString() + projectSelection.toString() + "\\05_" + projectSelection.toString() + "_GFX\\07_Output\\" + currentDateYMD + renderSubfolder ;
                    var OutputFolder = new Folder(projectpath);
                    if(!OutputFolder.exists){
                        OutputFolder.create();
                        RenderToProject(projectpath, false);
                    } else{
                        RenderToProject(projectpath, false);
                    }
                } else {
                    alert("Please select a project from the drop down.");
                }
            }

            renderOnlineComp =  renderFunctionGrp.add("Button", undefined, "RENDER COMPS FOR ONLINE");
            renderOnlineComp.size = [195, 25];
            renderOnlineComp.alignment = ['fill', 'fill'];

            renderOnlineComp.onClick = function(){
                if(projdd.selection != 0){
                    onlineRender = true;
                    var renderSubfolder = "";
                    if(subFolderInput != ""){
                       renderSubfolder =  "\\" + subFolderInput.text;
                    }
                    var projectpath = rootpc.toString() + projectSelection.toString() + "\\05_" + projectSelection.toString() + "_GFX\\07_Output\\" + currentDateYMD + renderSubfolder;
                    var OutputFolder = new Folder(projectpath);
                    if(!OutputFolder.exists){
                        OutputFolder.create();
                        RenderToProject(projectpath, true);
                    } else{
                        RenderToProject(projectpath, true);
                    } 
                } else {
                    alert("Please select a project from the drop down.");
                }
            }


            if(userPrefInputs[4] == 1){
                MainProjectPanel.visible = 1;
                MainProjectPanel.maximumSize.height = 400;
                MainProjectPanel.size = [400, 400];
                MainProjectPanel.enabled = true;
                MainProjectPanel.active = true;
            } else {
                MainProjectPanel.visible = 0;
                MainProjectPanel.maximumSize.height = 0;
                MainProjectPanel.size = [400, 0];
                MainProjectPanel.enabled = false;
                MainProjectPanel.active = false;
            }

            showHideProjectBtn.onClick = function (){
                if(userPrefInputs[4] == 1){
                    userPrefInputs[4] = 0;
                    saveUserPrefs(system.userName, userPrefInputs);
                    MainProjectPanel.visible = 0;
                    MainProjectPanel.maximumSize.height = 0;
                    MainProjectPanel.size = [400, 0];
                    MainProjectPanel.enabled = false;
                    MainProjectPanel.active = false;
                } else {
                    userPrefInputs[4] = 1;
                    saveUserPrefs(system.userName, userPrefInputs);
                    MainProjectPanel.visible = 1;
                    MainProjectPanel.maximumSize.height = 400;
                    MainProjectPanel.size = [400, 400];
                    MainProjectPanel.enabled = true;
                    MainProjectPanel.active = true;
                }
                pal.layout.layout(true);
                pal.layout.resize();
            }

            sourcingPanelMain = mainToolBoxPanel.add("panel", undefined, "");
            sourcingPanelMain.margins = [4, 4, 4, 4];
            sourcingPanelShowHideGrp = sourcingPanelMain.add("group", undefined, "");
            sourcingPanelOptionGrp = sourcingPanelMain.add("group", undefined, "");

            sourcingPanelMain.graphics.backgroundColor = sourcingPanelMain.graphics.newBrush(sourcingPanelMain.graphics.BrushType.SOLID_COLOR, [0.1,0.15,0.2,1]);

            pal.sourcePanel =  sourcingPanelShowHideGrp.add("Button", undefined, "-------------------------------------    SOURCING    -------------------------------------");
            pal.sourcePanel.size = [400, 25];
            
            pal.gr_one = sourcingPanelOptionGrp.add(resSourcing);
            pal.gr_one.graphics.backgroundColor = pal.gr_one.graphics.newBrush(pal.gr_one.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);

            if(userPrefInputs[0] == 0){
                sourcingPanelOptionGrp.maximumSize.height = 0;
                sourcingPanelOptionGrp.visible = 0;
                pal.gr_one.visible = 0;
                pal.gr_one.active = false;
                pal.gr_one.maximumSize.height = 0;

                pal.gr_one.cmds1.maximumSize.height = 0;
                pal.gr_one.cmds1.visible = 0;
                pal.gr_one.cmds1.pastePaths.enabled = false;
                pal.gr_one.cmds1.ImportPaths.enabled = false;

                pal.gr_one.cmds4.maximumSize.height = 0;
                pal.gr_one.cmds4.visible = 0;
                pal.gr_one.cmds4.SourceFromRen.enabled = false;
                pal.gr_one.cmds4.SourceFromRef.enabled = false;
            }
            else {
                sourcingPanelOptionGrp.maximumSize.height = 600;
                sourcingPanelOptionGrp.visible = 1;
                pal.gr_one.visible = 1;
                pal.gr_one.active = true;
                pal.gr_one.maximumSize.height = 600;

                pal.gr_one.cmds1.maximumSize.height = 400;
                pal.gr_one.cmds1.visible = 1;
                pal.gr_one.cmds1.pastePaths.enabled = true;
                pal.gr_one.cmds1.ImportPaths.enabled = true;

                pal.gr_one.cmds4.maximumSize.height = 400;
                pal.gr_one.cmds4.visible = 1;
                pal.gr_one.cmds4.SourceFromRen.enabled = true;
                pal.gr_one.cmds4.SourceFromRef.enabled = true;
            }

            pal.sourcePanel.onClick = function(){
                if(userPrefInputs[0] == 1){
                    pal.gr_one.active = false;
                    userPrefInputs[0] = 0;
                    saveUserPrefs(system.userName, userPrefInputs);
                    // alert(userPrefInputs[0]);

                    sourcingPanelOptionGrp.maximumSize.height = 0;
                    sourcingPanelOptionGrp.visible = 0;

                    pal.gr_one.maximumSize.height = 0;

                    pal.gr_one.cmds1.maximumSize.height = 0;
                    pal.gr_one.cmds1.visible = 0;
                    pal.gr_one.cmds1.pastePaths.enabled = false;
                    pal.gr_one.cmds1.ImportPaths.enabled = false;

                    pal.gr_one.cmds4.maximumSize.height = 0;
                    pal.gr_one.cmds4.visible = 0;
                    pal.gr_one.cmds4.SourceFromRen.enabled = false;
                    pal.gr_one.cmds4.SourceFromRef.enabled = false;

                    pal.layout.layout(true);
                    pal.layout.resize();
                } else {
                    pal.gr_one.active = true;
                    userPrefInputs[0] = 1;
                    saveUserPrefs(system.userName, userPrefInputs);
                    // alert(userPrefInputs[0]);

                    sourcingPanelOptionGrp.maximumSize.height = 600;
                    sourcingPanelOptionGrp.visible = 1;

                    pal.gr_one.maximumSize.height = 600;

                    pal.gr_one.cmds1.maximumSize.height = 400;
                    pal.gr_one.cmds1.visible = 1;
                    pal.gr_one.cmds1.pastePaths.enabled = true;
                    pal.gr_one.cmds1.ImportPaths.enabled = true;

                    pal.gr_one.cmds4.maximumSize.height = 400;
                    pal.gr_one.cmds4.visible = 1;
                    pal.gr_one.cmds4.SourceFromRen.enabled = true;
                    pal.gr_one.cmds4.SourceFromRef.enabled = true;

                    pal.layout.layout(true);
                    pal.layout.resize();

                }
            }

            cmPanelMain = mainToolBoxPanel.add("panel", undefined, "");
            cmPanelMain.margins = [4, 4, 4, 4];
            cmPanelShowHideGrp = cmPanelMain.add("group", undefined, "");
            cmPanelOptionGrp = cmPanelMain.add("group", undefined, "");
            cmPanelMain.graphics.backgroundColor = cmPanelMain.graphics.newBrush(cmPanelMain.graphics.BrushType.SOLID_COLOR, [0.1,0.15,0.2,1]);

            pal.cmsh = cmPanelShowHideGrp.add("Button", undefined, "----------------------------------   CREATE / MODIFY    ----------------------------------");
            pal.cmsh.size = [400, 25];

            pal.createmodgroup = cmPanelOptionGrp.add(resCreateModifyPanel);
            pal.createmodgroup.graphics.backgroundColor = pal.createmodgroup.graphics.newBrush(pal.createmodgroup.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);

            pal.gr_seven = pal.createmodgroup.add(resCreateModifyDrops);
            ddsz=pal.gr_seven.add("dropdownlist", undefined, formatList);
            ddfr=pal.gr_seven.add("dropdownlist", undefined, framerateList);
            
            ddsz.alignment = ["center", "top"];
            ddsz.selection = 0;

            ddfr.alignment = ["center", "top"];
            ddfr.selection = 0;

            pal.gr_six = pal.createmodgroup.add(resCreateModify);

            pal.gr_six.cmds7.jobField.text = "XAV";
            pal.gr_six.cmds7.jobField.onActivate = function(){
                pal.gr_six.cmds7.jobField.text = "";
            };

            pal.gr_six.cmds7.styleField.text = "A";
            pal.gr_six.cmds7.styleField.onActivate = function(){
                pal.gr_six.cmds7.styleField.text = "";
            };

            pal.gr_six.cmds8.descField.text = "description";
            pal.gr_six.cmds8.descField.onActivate = function(){
                pal.gr_six.cmds8.descField.text = "";
            };

            pal.gr_six.cmds8.initField.text = "xx";
            pal.gr_six.cmds8.initField.onActivate = function(){
                pal.gr_six.cmds8.initField.text = "";
            };

            pal.gr_six.cmds1.createCompBtn.onClick = createXAVComp;
            pal.gr_six.cmds1.createCompBtn.helpTip = "This will create a comp based on the above specs. Each comp will include mattes, guides, and an info tag line.";
            pal.gr_six.cmds1.modifyCompBtn.onClick = modifyComp;
            pal.gr_six.cmds1.modifyCompBtn.helpTip = "This will modify all selected comps based on the above specs. All layers will be centered to fit the selected aspect ratio. This will also update the mattes, guides, and info tag line.";
            pal.gr_six.cmds9.sizeCB.onClick = sizeEnabled;
            pal.gr_six.cmds2.conformLayerSizeBtn.onClick = conformLayerToCompSize;
            pal.gr_six.cmds2.conformLayerSizeBtn.helpTip = "This will conform all selected layers to the active comp size.";
            pal.gr_six.cmds9.sizeCB.value = true;
            pal.gr_six.cmds9.fpsCB.onClick = fpsEnabled;
            pal.gr_six.cmds9.fpsCB.value = true;
            pal.gr_six.cmds9.guidesCB.onClick = guidesEnabled;
            pal.gr_six.cmds9.guidesCB.value = true;
            pal.gr_six.customFormatCmds.enabled = false;
            pal.gr_six.customFormatCmds.visible = 0;
            pal.gr_six.customFormatCmds.maximumSize.height = 0;
            pal.gr_six.customFormatCmds.fpsField.enabled = false;

            var panelColor=[0.15,0.16,0.17, 1];
            pal.gr_six.cmds9.graphics.backgroundColor = pal.gr_six.cmds9.graphics.newBrush(pal.gr_six.cmds9.graphics.BrushType.SOLID_COLOR, panelColor, 1);

            var imageOn = pal.gr_six.cmds9.add("image", undefined, guidesVisOnIcon);
            var imageOff = pal.gr_six.cmds9.add("image", undefined, guidesVisOffIcon);
            imageOn.addEventListener('click', showGuides, false);
            imageOff.addEventListener('click', hideGuides, false);

            ddsz.onChange = function szCustom(){
                if(ddsz.selection.index == 14 && ddfr.selection.index == 5){
                    pal.gr_six.customFormatCmds.enabled = true;
                    pal.gr_six.customFormatCmds.maximumSize.height = 50;
                    pal.gr_six.customFormatCmds.visible = 1;
                    pal.gr_six.customFormatCmds.heightField.enabled = true;
                    pal.gr_six.customFormatCmds.widthField.enabled = true;
                    pal.gr_six.customFormatCmds.fpsField.enabled = true;
                    pal.layout.layout(true);
                }
                if(ddsz.selection.index == 14 && ddfr.selection.index != 5){
                    pal.gr_six.customFormatCmds.enabled = true;
                    pal.gr_six.customFormatCmds.maximumSize.height = 50;
                    pal.gr_six.customFormatCmds.visible = 1;
                    pal.gr_six.customFormatCmds.heightField.enabled = true;
                    pal.gr_six.customFormatCmds.widthField.enabled = true;
                    pal.gr_six.customFormatCmds.fpsField.enabled = false;
                    pal.layout.layout(true);
                }
                if(ddsz.selection.index != 14 && ddfr.selection.index == 5){
                    pal.gr_six.customFormatCmds.enabled = true;
                    pal.gr_six.customFormatCmds.maximumSize.height = 50;
                    pal.gr_six.customFormatCmds.visible = 1;
                    pal.gr_six.customFormatCmds.heightField.enabled = false;
                    pal.gr_six.customFormatCmds.widthField.enabled = false;
                    pal.gr_six.customFormatCmds.fpsField.enabled = true;
                    pal.layout.layout(true);
                }
                if(ddsz.selection.index != 14 && ddfr.selection.index != 5){
                    pal.gr_six.customFormatCmds.enabled = false;
                    pal.gr_six.customFormatCmds.maximumSize.height = 0;
                    pal.gr_six.customFormatCmds.visible = 0;
                    pal.gr_six.customFormatCmds.heightField.enabled = false;
                    pal.gr_six.customFormatCmds.widthField.enabled = false;
                    pal.gr_six.customFormatCmds.fpsField.enabled = false;
                    pal.layout.layout(true);
                }
            }

            ddfr.onChange = function fpsCustom(){
                if(ddfr.selection.index == 5 && ddsz.selection.index == 14){
                    pal.gr_six.customFormatCmds.enabled = true;
                    pal.gr_six.customFormatCmds.maximumSize.height = 50;
                    pal.gr_six.customFormatCmds.visible = 1;
                    pal.gr_six.customFormatCmds.heightField.enabled = true;
                    pal.gr_six.customFormatCmds.widthField.enabled = true;
                    pal.gr_six.customFormatCmds.fpsField.enabled = true;
                    pal.layout.layout(true);
                }
                if(ddfr.selection.index == 5 && ddsz.selection.index != 14){
                    pal.gr_six.customFormatCmds.enabled = true;
                    pal.gr_six.customFormatCmds.maximumSize.height = 50;
                    pal.gr_six.customFormatCmds.visible = 1;
                    pal.gr_six.customFormatCmds.heightField.enabled = false;
                    pal.gr_six.customFormatCmds.widthField.enabled = false;
                    pal.gr_six.customFormatCmds.fpsField.enabled = true;
                    pal.layout.layout(true);
                }
                if(ddfr.selection.index != 5 && ddsz.selection.index == 14){
                    pal.gr_six.customFormatCmds.enabled = true;
                    pal.gr_six.customFormatCmds.maximumSize.height = 50;
                    pal.gr_six.customFormatCmds.visible = 1;
                    pal.gr_six.customFormatCmds.heightField.enabled = true;
                    pal.gr_six.customFormatCmds.widthField.enabled = true;
                    pal.gr_six.customFormatCmds.fpsField.enabled = false;
                    pal.layout.layout(true);
                }
                if(ddfr.selection.index != 5 && ddsz.selection.index != 14){
                    pal.gr_six.customFormatCmds.enabled = false;
                    pal.gr_six.customFormatCmds.maximumSize.height = 0;
                    pal.gr_six.customFormatCmds.visible = 0;
                    pal.gr_six.customFormatCmds.heightField.enabled = false;
                    pal.gr_six.customFormatCmds.widthField.enabled = false;
                    pal.gr_six.customFormatCmds.fpsField.enabled = false;
                    pal.layout.layout(true);
                }
            }

            if(userPrefInputs[1] == 0){
                pal.gr_seven.maximumSize.height = 0;
                pal.gr_seven.visible = 0;
                pal.gr_six.maximumSize.height = 0;
                pal.gr_six.visible = 0;

                pal.gr_six.active = false;
                pal.gr_six.hide();

                pal.gr_seven.active = false;
                pal.gr_seven.hide();

                ddsz.maximumSize.height = 0;
                ddsz.size = [175, 0];
                ddsz.visible = 0;
                ddsz.enabled = false;
                ddsz.active = false;
                ddsz.hide();

                ddfr.maximumSize.height = 0;
                ddfr.size = [175, 0];
                ddfr.visible = 0;
                ddfr.enabled = false;
                ddfr.active = false;
                ddfr.hide();

                pal.gr_six.cmds7.maximumSize.height = 0;
                pal.gr_six.cmds7.visible = 0;
                pal.gr_six.cmds7.jobField.enabled = false;
                pal.gr_six.cmds7.styleField.enabled = false;

                pal.gr_six.cmds8.maximumSize.height = 0;
                pal.gr_six.cmds8.visible = 0;
                pal.gr_six.cmds8.descField.enabled = false;
                pal.gr_six.cmds8.initField.enabled = false;

                pal.gr_six.cmds1.maximumSize.height = 0;
                pal.gr_six.cmds1.visible = 0;
                pal.gr_six.cmds1.createCompBtn.enabled = false;
                pal.gr_six.cmds1.modifyCompBtn.enabled = false;

                pal.gr_six.cmds2.maximumSize.height = 0;
                pal.gr_six.cmds2.visible = 0;
                pal.gr_six.cmds2.conformLayerSizeBtn.enabled = false;

                pal.gr_six.cmds9.maximumSize.height = 0;
                pal.gr_six.cmds9.visible = 0;
                pal.gr_six.cmds9.sizeCB.enabled = false;
                pal.gr_six.cmds9.fpsCB.enabled = false;
                pal.gr_six.cmds9.guidesCB.enabled = false;

                pal.createmodgroup.maximumSize.height = 0;
                pal.createmodgroup.active == false;
                pal.createmodgroup.hide();
            } else {
                pal.gr_seven.maximumSize.height = 200;
                pal.gr_seven.visible = 1;

                ddsz.maximumSize.height = 25;
                ddsz.size = [175, 25];
                ddsz.visible = 1;
                ddsz.enabled = true;
                ddfr.maximumSize.height = 25;
                ddfr.size = [175, 25];
                ddfr.visible = 1;
                ddfr.enabled = true;

                pal.gr_six.maximumSize.height = 200;
                pal.gr_six.visible = 1;

                pal.gr_six.cmds7.maximumSize.height = 100;
                pal.gr_six.cmds7.visible = 1;
                pal.gr_six.cmds7.jobField.enabled = true;
                pal.gr_six.cmds7.styleField.enabled = true;

                pal.gr_six.cmds8.maximumSize.height = 100;
                pal.gr_six.cmds8.visible = 1;
                pal.gr_six.cmds8.descField.enabled = true;
                pal.gr_six.cmds8.initField.enabled = true;

                pal.gr_six.cmds1.maximumSize.height = 100;
                pal.gr_six.cmds1.visible = 1;
                pal.gr_six.cmds1.createCompBtn.enabled = true;
                pal.gr_six.cmds1.modifyCompBtn.enabled = true;

                pal.gr_six.cmds2.maximumSize.height = 200;
                pal.gr_six.cmds2.visible = 1;
                pal.gr_six.cmds2.conformLayerSizeBtn.enabled = true;

                pal.gr_six.cmds9.maximumSize.height = 100;
                pal.gr_six.cmds9.visible = 1;
                pal.gr_six.cmds9.sizeCB.enabled = true;
                pal.gr_six.cmds9.fpsCB.enabled = true;
                pal.gr_six.cmds9.guidesCB.enabled = true;

                pal.createmodgroup.active = true;
                pal.createmodgroup.show();

                pal.createmodgroup.maximumSize.height = 400;
            }

            pal.cmsh.onClick = function(){
                if(userPrefInputs[1] == 1){
                    userPrefInputs[1] = 0;
                    saveUserPrefs(system.userName, userPrefInputs);

                    pal.gr_seven.maximumSize.height = 0;
                    pal.gr_seven.visible = 0;

                    ddsz.maximumSize.height = 0;
                    ddsz.size = [175, 0];
                    ddsz.visible = 0;
                    ddsz.enabled = false;   
                    ddfr.maximumSize.height = 0;
                    ddfr.size = [175, 0];
                    ddfr.visible = 0;
                    ddfr.enabled = false;

                    pal.gr_six.maximumSize.height = 0;
                    pal.gr_six.visible = 0;

                    pal.gr_six.cmds7.maximumSize.height = 0;
                    pal.gr_six.cmds7.visible = 0;
                    pal.gr_six.cmds7.jobField.enabled = false;
                    pal.gr_six.cmds7.styleField.enabled = false;

                    pal.gr_six.cmds8.maximumSize.height = 0;
                    pal.gr_six.cmds8.visible = 0;
                    pal.gr_six.cmds8.descField.enabled = false;
                    pal.gr_six.cmds8.initField.enabled = false;

                    pal.gr_six.cmds1.maximumSize.height = 0;
                    pal.gr_six.cmds1.visible = 0;
                    pal.gr_six.cmds1.createCompBtn.enabled = false;
                    pal.gr_six.cmds1.modifyCompBtn.enabled = false;

                    pal.gr_six.cmds2.maximumSize.height = 0;
                    pal.gr_six.cmds2.visible = 0;
                    pal.gr_six.cmds2.conformLayerSizeBtn.enabled = false;

                    pal.gr_six.cmds9.maximumSize.height = 0;
                    pal.gr_six.cmds9.visible = 0;
                    pal.gr_six.cmds9.sizeCB.enabled = false;
                    pal.gr_six.cmds9.fpsCB.enabled = false;
                    pal.gr_six.cmds9.guidesCB.enabled = false;

                    pal.createmodgroup.active = false;
                    pal.createmodgroup.hide();
                    pal.createmodgroup.maximumSize.height = 0;

                    pal.layout.layout(true);
                    pal.layout.resize();

                } else {
                    userPrefInputs[1] = 1;
                    saveUserPrefs(system.userName, userPrefInputs);

                    pal.gr_seven.maximumSize.height = 200;
                    pal.gr_seven.visible = 1;

                    ddsz.maximumSize.height = 25;
                    ddsz.size = [175, 25];
                    ddsz.visible = 1;
                    ddsz.enabled = true;
                    ddfr.maximumSize.height = 25;
                    ddfr.size = [175, 25];
                    ddfr.visible = 1;
                    ddfr.enabled = true;

                    pal.gr_six.maximumSize.height = 200;
                    pal.gr_six.visible = 1;

                    pal.gr_six.cmds7.maximumSize.height = 100;
                    pal.gr_six.cmds7.visible = 1;
                    pal.gr_six.cmds7.jobField.enabled = true;
                    pal.gr_six.cmds7.styleField.enabled = true;

                    pal.gr_six.cmds8.maximumSize.height = 100;
                    pal.gr_six.cmds8.visible = 1;
                    pal.gr_six.cmds8.descField.enabled = true;
                    pal.gr_six.cmds8.initField.enabled = true;

                    pal.gr_six.cmds1.maximumSize.height = 100;
                    pal.gr_six.cmds1.visible = 1;
                    pal.gr_six.cmds1.createCompBtn.enabled = true;
                    pal.gr_six.cmds1.modifyCompBtn.enabled = true;

                    pal.gr_six.cmds2.maximumSize.height = 200;
                    pal.gr_six.cmds2.visible = 1;
                    pal.gr_six.cmds2.conformLayerSizeBtn.enabled = true;

                    pal.gr_six.cmds9.maximumSize.height = 100;
                    pal.gr_six.cmds9.visible = 1;
                    pal.gr_six.cmds9.sizeCB.enabled = true;
                    pal.gr_six.cmds9.fpsCB.enabled = true;
                    pal.gr_six.cmds9.guidesCB.enabled = true;

                    pal.createmodgroup.active = true;
                    pal.createmodgroup.show();

                    pal.createmodgroup.maximumSize.height = 400;
                    pal.layout.layout(true);
                    pal.layout.resize();

                }
            }

            ccPanelMain = mainToolBoxPanel.add("panel", undefined, "");
            ccPanelMain.margins = [4, 4, 4, 4];
            ccPanelShowHideGrp = ccPanelMain.add("group", undefined, "");
            ccPanelOptionGrp = ccPanelMain.add("group", undefined, "");
            ccPanelMain.graphics.backgroundColor = ccPanelMain.graphics.newBrush(ccPanelMain.graphics.BrushType.SOLID_COLOR, [0.1,0.15,0.2,1]);

            pal.coverCheckerPanel = ccPanelShowHideGrp.add("Button", undefined, "------------------------------------ COVERS / CHECKERS ------------------------------------");
            pal.coverCheckerPanel.size = [400, 25];
            
            pal.ccdd = ccPanelOptionGrp.add("panel", undefined, "");
            pal.ccdd.alignment = ["center", "top"];
            pal.ccdd.preferredSize = [0, 0];
            pal.ccdd.maximumSize.height = 0;
            pal.ccdd.size = [0, 0];
            pal.ccdd.visible = 0;
            pal.ccdd.enabled = false;
            pal.ccdd.active = false;
            pal.ccdd.hide();
            pal.ccdd.graphics.backgroundColor = pal.ccdd.graphics.newBrush(pal.ccdd.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);

            dd = pal.ccdd.add("dropdownlist", undefined, formatList);
            
            dd.alignment = ["center", "top"];
            dd.preferredSize = [0, 0];
            dd.maximumSize.height = 0;
            dd.size = [0, 0];
            dd.visible = 0;
            dd.enabled = false;
            dd.active = false;  
            dd.hide();

            pal.gr_covers = pal.ccdd.add(resCovers);
            pal.gr_two = pal.ccdd.add(resCheckers);

            pal.gr_covers.cmds1.toplineField.text = "Top line...";
            pal.gr_covers.cmds1.toplineField.onActivate = function(){
                pal.gr_covers.cmds1.toplineField.text = "";
            }
            pal.gr_covers.cmds1.bottomlineField.text = "Bottom line...";
            pal.gr_covers.cmds1.bottomlineField.onActivate = function(){
                pal.gr_covers.cmds1.bottomlineField.text = "";            
            };
            var d = new Date().toString();
            var dArr= d.split(" ");

            var newdate = dArr[1] + " " + dArr[2] + " " + dArr[3]; 
            pal.gr_covers.cmds2.dateField.text = newdate;

            pal.gr_covers.cmds2.spotField.text = "Name and version";
            pal.gr_covers.cmds2.spotField.onActivate = function(){
                pal.gr_covers.cmds2.spotField.text = "";       
            };
            pal.gr_covers.cmds3.makeCoverBtn.onClick = MakeCover;
            pal.gr_covers.cmds3.makeCoverBtn.helpTip = "This will create a cover pages based on AE projects saved in scripts assets folder. Update the text fields and click to add new cover.";

            pal.gr_two.cmds1.frameField.text = 10;
            pal.gr_two.cmds1.frameField.onActivate = function(){
                pal.gr_two.cmds1.frameField.text = "";             
            };

            pal.gr_two.cmds2.makeCheckerBtn.onClick = MakeChecker;
            pal.gr_two.cmds2.addRenderBtn.onClick = RenderCheckers;
            pal.gr_two.cmds2.makeCheckerBtn.helpTip = "Choose an aspect ration from the drop down menu above. Then select the items you want to create your Checker from in the project window and click. This will automatically create a standard checker comp. To change the frame number, adjust the time remap keyframe on the bottom layer of the comp.";

            if(userPrefInputs[2] == 0){
            
                pal.gr_covers.maximumSize.height = 0;
                pal.gr_covers.size = [0, 0];
                pal.gr_covers.visible = 0;
                pal.gr_covers.enabled = false;
                pal.gr_covers.active = false;
                pal.gr_covers.hide();

                pal.gr_covers.cmds1.toplineField.maximumSize.height = 0;
                pal.gr_covers.cmds1.toplineField.size = [0, 0];
                pal.gr_covers.cmds1.toplineField.enabled = false;
                pal.gr_covers.cmds1.toplineField.visible = 0;

                pal.gr_covers.cmds1.bottomlineField.maximumSize.height = 0;
                pal.gr_covers.cmds1.bottomlineField.size = [0, 0];
                pal.gr_covers.cmds1.bottomlineField.enabled = false;
                pal.gr_covers.cmds1.bottomlineField.visible = 0;

                pal.gr_covers.cmds2.dateField.maximumSize.height = 0;
                pal.gr_covers.cmds2.dateField.size = [0, 0];
                pal.gr_covers.cmds2.dateField.enabled = false;
                pal.gr_covers.cmds2.dateField.visible = 0;

                pal.gr_covers.cmds2.spotField.maximumSize.height = 0;
                pal.gr_covers.cmds2.spotField.size = [0, 0];
                pal.gr_covers.cmds2.spotField.enabled = false;
                pal.gr_covers.cmds2.spotField.visible = 0;

                pal.gr_covers.cmds3.makeCoverBtn.maximumSize.height = 0;
                pal.gr_covers.cmds3.makeCoverBtn.size = [0, 0];
                pal.gr_covers.cmds3.makeCoverBtn.enabled = false;
                pal.gr_covers.cmds3.makeCoverBtn.visible = 0;

                pal.gr_two.maximumSize.height = 0;
                pal.gr_two.size = [0, 0];
                pal.gr_two.visible = 0;
                pal.gr_two.active = false;
                pal.gr_two.hide();

                pal.gr_two.cmds1.frameField.maximumSize.height = 0;
                pal.gr_two.cmds1.frameField.size = [0, 0];
                pal.gr_two.cmds1.frameField.enabled = false;
                pal.gr_two.cmds1.frameField.visible = 0;

                pal.gr_two.cmds2.visible = 0;
                pal.gr_two.cmds2.maximumSize.height = 0;
                
                pal.gr_two.cmds2.makeCheckerBtn.maximumSize.height = 0;
                pal.gr_two.cmds2.makeCheckerBtn.size = [0, 0];
                pal.gr_two.cmds2.makeCheckerBtn.enabled = false;
                pal.gr_two.cmds2.makeCheckerBtn.visible = 0;

                pal.gr_two.cmds2.addRenderBtn.maximumSize.height = 0;
                pal.gr_two.cmds2.addRenderBtn.size = [0, 0];
                pal.gr_two.cmds2.addRenderBtn.enabled = false;
                pal.gr_two.cmds2.addRenderBtn.visible = 0;
            } else {
                pal.ccdd.maximumSize.height = 500;
                pal.ccdd.visible = 1;
                pal.ccdd.enabled = true;
                pal.ccdd.active = true;
                pal.ccdd.show();

                dd.alignment = ["center", "top"];
                dd.size = [360, 25];
                dd.selection = 0;
                dd.maximumSize.height = 50;
                dd.visible = 1;
                dd.enabled = true;
                dd.active = true;
                dd.show();

                pal.gr_covers.maximumSize.height = 100;
                pal.gr_covers.size = [360, 100];
                pal.gr_covers.visible = 1;
                pal.gr_covers.enabled = true;
                pal.gr_covers.active = true;
                pal.gr_covers.show();

                pal.gr_covers.cmds1.toplineField.maximumSize.height = 100;
                pal.gr_covers.cmds1.toplineField.size = [125, 20];
                pal.gr_covers.cmds1.toplineField.enabled = true;

                pal.gr_covers.cmds1.bottomlineField.maximumSize.height = 100;
                pal.gr_covers.cmds1.bottomlineField.size = [125, 20];
                pal.gr_covers.cmds1.bottomlineField.enabled = true;

                pal.gr_covers.cmds2.dateField.maximumSize.height = 100;
                pal.gr_covers.cmds2.dateField.size = [125, 20];
                pal.gr_covers.cmds2.dateField.enabled = true;

                pal.gr_covers.cmds2.spotField.maximumSize.height = 100;
                pal.gr_covers.cmds2.spotField.size = [125, 20];
                pal.gr_covers.cmds2.spotField.enabled = true;

                pal.gr_covers.cmds3.makeCoverBtn.maximumSize.height = 100;
                pal.gr_covers.cmds3.makeCoverBtn.size = [360, 20];
                pal.gr_covers.cmds3.makeCoverBtn.enabled = true;
                pal.gr_covers.cmds3.makeCoverBtn.visible = 1;

                pal.gr_two.maximumSize.height = 100;
                pal.gr_two.size = [360, 50];
                pal.gr_two.visible = 1;
                pal.gr_two.active = true;
                pal.gr_two.show();

                pal.gr_two.cmds1.frameField.maximumSize.height = 100;
                pal.gr_two.cmds1.frameField.size = [40, 20];
                pal.gr_two.cmds1.frameField.enabled = true;
                pal.gr_two.cmds1.frameField.visible = 1;

                pal.gr_two.cmds2.visible = 1;
                pal.gr_two.cmds2.maximumSize.height = 100;
                
                pal.gr_two.cmds2.makeCheckerBtn.maximumSize.height = 100;
                pal.gr_two.cmds2.makeCheckerBtn.size = [125, 25];
                pal.gr_two.cmds2.makeCheckerBtn.enabled = true;
                pal.gr_two.cmds2.makeCheckerBtn.visible = 1;

                pal.gr_two.cmds2.addRenderBtn.maximumSize.height = 1000;
                pal.gr_two.cmds2.addRenderBtn.size = [125, 25];
                pal.gr_two.cmds2.addRenderBtn.enabled = true;
                pal.gr_two.cmds2.addRenderBtn.visible = 1;
            }

            pal.coverCheckerPanel.onClick = function(){

                if(userPrefInputs[2] == 1){
                    userPrefInputs[2] = 0;
                    saveUserPrefs(system.userName, userPrefInputs);

                    pal.ccdd.maximumSize.height = 0;
                    pal.ccdd.size = [0, 0];
                    pal.ccdd.visible = 0;
                    pal.ccdd.enabled = false;
                    pal.ccdd.active = false;
                    pal.ccdd.hide();

                    dd.alignment = ["center", "top"];
                    dd.size = [0, 0];
                    dd.selection = 0;
                    dd.maximumSize.height = 0;
                    dd.visible = 0;
                    dd.enabled = false;
                    dd.active = false;
                    dd.hide();

                    pal.gr_covers.maximumSize.height = 0;
                    pal.gr_covers.size = [0, 0];
                    pal.gr_covers.visible = 0;
                    pal.gr_covers.enabled = false;
                    pal.gr_covers.active = false;
                    pal.gr_covers.hide();

                    pal.gr_covers.cmds1.toplineField.maximumSize.height = 0;
                    pal.gr_covers.cmds1.toplineField.size = [0, 0];
                    pal.gr_covers.cmds1.toplineField.enabled = false;

                    pal.gr_covers.cmds1.bottomlineField.maximumSize.height = 0;
                    pal.gr_covers.cmds1.bottomlineField.size = [0, 0];
                    pal.gr_covers.cmds1.bottomlineField.enabled = false;

                    pal.gr_covers.cmds2.dateField.maximumSize.height = 0;
                    pal.gr_covers.cmds2.dateField.size = [0, 0];
                    pal.gr_covers.cmds2.dateField.enabled = false;

                    pal.gr_covers.cmds2.spotField.maximumSize.height = 0;
                    pal.gr_covers.cmds2.spotField.size = [0, 0];
                    pal.gr_covers.cmds2.spotField.enabled = false;

                    pal.gr_covers.cmds3.makeCoverBtn.maximumSize.height = 0;
                    pal.gr_covers.cmds3.makeCoverBtn.size = [0, 0];
                    pal.gr_covers.cmds3.makeCoverBtn.enabled = false;
                    pal.gr_covers.cmds3.makeCoverBtn.visible = 0;

                    pal.gr_two.maximumSize.height = 0;
                    pal.gr_two.size = [0, 0];
                    pal.gr_two.visible = 0;
                    pal.gr_two.active = false;
                    pal.gr_two.hide();

                    pal.gr_two.cmds1.frameField.maximumSize.height = 0;
                    pal.gr_two.cmds1.frameField.size = [0, 0];
                    pal.gr_two.cmds1.frameField.enabled = false;
                    pal.gr_two.cmds1.frameField.visible = 0;

                    pal.gr_two.cmds2.visible = 0;
                    pal.gr_two.cmds2.maximumSize.height = 0;
                    
                    pal.gr_two.cmds2.makeCheckerBtn.maximumSize.height = 0;
                    pal.gr_two.cmds2.makeCheckerBtn.size = [0, 0];
                    pal.gr_two.cmds2.makeCheckerBtn.enabled = false;
                    pal.gr_two.cmds2.makeCheckerBtn.visible = 0;

                    pal.gr_two.cmds2.addRenderBtn.maximumSize.height = 0;
                    pal.gr_two.cmds2.addRenderBtn.size = [0, 0];
                    pal.gr_two.cmds2.addRenderBtn.enabled = false;
                    pal.gr_two.cmds2.addRenderBtn.visible = 0;

                    pal.layout.layout(true);
                    pal.layout.resize();

                } else {

                    userPrefInputs[2] = 1;
                    saveUserPrefs(system.userName, userPrefInputs);

                    pal.ccdd.maximumSize.height = 500;
                    pal.ccdd.visible = 1;
                    pal.ccdd.enabled = true;
                    pal.ccdd.active = true;
                    pal.ccdd.show();

                    dd.alignment = ["center", "top"];
                    dd.size = [360, 25];
                    dd.selection = 0;
                    dd.maximumSize.height = 50;
                    dd.visible = 1;
                    dd.enabled = true;
                    dd.active = true;
                    dd.show();

                    pal.gr_covers.maximumSize.height = 100;
                    pal.gr_covers.size = [360, 100];
                    pal.gr_covers.visible = 1;
                    pal.gr_covers.enabled = true;
                    pal.gr_covers.active = true;
                    pal.gr_covers.show();

                    pal.gr_covers.cmds1.toplineField.maximumSize.height = 100;
                    pal.gr_covers.cmds1.toplineField.size = [125, 20];
                    pal.gr_covers.cmds1.toplineField.enabled = true;

                    pal.gr_covers.cmds1.bottomlineField.maximumSize.height = 100;
                    pal.gr_covers.cmds1.bottomlineField.size = [125, 20];
                    pal.gr_covers.cmds1.bottomlineField.enabled = true;

                    pal.gr_covers.cmds2.dateField.maximumSize.height = 100;
                    pal.gr_covers.cmds2.dateField.size = [125, 20];
                    pal.gr_covers.cmds2.dateField.enabled = true;

                    pal.gr_covers.cmds2.spotField.maximumSize.height = 100;
                    pal.gr_covers.cmds2.spotField.size = [125, 20];
                    pal.gr_covers.cmds2.spotField.enabled = true;

                    pal.gr_covers.cmds3.makeCoverBtn.maximumSize.height = 100;
                    pal.gr_covers.cmds3.makeCoverBtn.size = [360, 20];
                    pal.gr_covers.cmds3.makeCoverBtn.enabled = true;
                    pal.gr_covers.cmds3.makeCoverBtn.visible = 1;

                    pal.gr_two.maximumSize.height = 100;
                    pal.gr_two.size = [360, 50];
                    pal.gr_two.visible = 1;
                    pal.gr_two.active = true;
                    pal.gr_two.show();

                    pal.gr_two.cmds1.frameField.maximumSize.height = 100;
                    pal.gr_two.cmds1.frameField.size = [40, 20];
                    pal.gr_two.cmds1.frameField.enabled = true;
                    pal.gr_two.cmds1.frameField.visible = 1;

                    pal.gr_two.cmds2.visible = 1;
                    pal.gr_two.cmds2.maximumSize.height = 100;
                    
                    pal.gr_two.cmds2.makeCheckerBtn.maximumSize.height = 100;
                    pal.gr_two.cmds2.makeCheckerBtn.size = [125, 25];
                    pal.gr_two.cmds2.makeCheckerBtn.enabled = true;
                    pal.gr_two.cmds2.makeCheckerBtn.visible = 1;

                    pal.gr_two.cmds2.addRenderBtn.maximumSize.height = 1000;
                    pal.gr_two.cmds2.addRenderBtn.size = [125, 25];
                    pal.gr_two.cmds2.addRenderBtn.enabled = true;
                    pal.gr_two.cmds2.addRenderBtn.visible = 1;


                    pal.layout.layout(true);
                    pal.layout.resize();

                }
            }

            colPanelMain = mainToolBoxPanel.add("panel", undefined, "");
            colPanelMain.margins = [4, 4, 4, 4];
            colPanelShowHideGrp = colPanelMain.add("group", undefined, "");
            colPanelOptionGrp = colPanelMain.add("group", undefined, "");
            colPanelMain.graphics.backgroundColor = colPanelMain.graphics.newBrush(colPanelMain.graphics.BrushType.SOLID_COLOR, [0.1,0.15,0.2,1]);

            pal.cleanCollectPanel = colPanelShowHideGrp.add("Button", undefined, "---------------------------------    CLEAN UP / COLLECT   ---------------------------------");
            pal.cleanCollectPanel.size = [400, 25];

            ccMainPanel = colPanelOptionGrp.add("panel", undefined);
            ccMainPanel.graphics.backgroundColor = ccMainPanel.graphics.newBrush(ccMainPanel.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);

            cleanupgrp = ccMainPanel.add("group", undefined, "cleanupgroup");
            dmsgrp = ccMainPanel.add("panel", undefined, "");
            dmsddgrp = dmsgrp.add("group", undefined, "dmsddgroup");

            collectgrp = ccMainPanel.add("group", undefined, "collectgroup");

            pal.gr_three = cleanupgrp.add(resCleanUp);
            dmsdd = dmsddgrp.add("dropdownlist", undefined, DMSList);
            pal.gr_dms = dmsddgrp.add(resDMS);
            dmsdd.selection = 0;
            dmsdd.size = [173, 25];
            pal.gr_collect = collectgrp.add(resCollect);

            srgrp = ccMainPanel.add("group", undefined, "srgroup");

            ddsr=srgrp.add("dropdownlist", undefined, srFunctionList);
            ddsr.alignment = ["center", "top"];
            ddsr.size = [0, 0];
            ddsr.selection = 0;

            pal.gr_rename = ccMainPanel.add(resRename);
            pal.gr_rename.cmds1.searchField.text = "Search...";
            pal.gr_rename.cmds1.searchField.onActivate = function(){
               pal.gr_rename.cmds1.searchField.text = "";
            };


            pal.gr_rename.cmds2.replaceField.text = "Replace...";
            pal.gr_rename.cmds2.replaceField.onActivate = function(){
               pal.gr_rename.cmds2.replaceField.text = "";
            };

            pal.gr_rename.cmds3.duplicateCompBtn.onClick = duplicateComp;
            pal.gr_rename.cmds3.RenameSelected.onClick = searchAndReplace;
            pal.gr_rename.cmds3.RenameSelected.helpTip = "Choose a function from the drop down menu above. Then select the items you want to rename in the project window. Use the search field for adding Prefix and Suffix.";
            
            pal.gr_rename.cmds2.replaceField.maximumSize.height = 50;
            pal.gr_rename.cmds2.replaceField.visible = 1;

            ddsr.onChange = function srChangeText(){
                if(ddsr.selection.index == 0){    
                    pal.gr_rename.cmds1.titleSearch.text ="SEARCH";
                    pal.gr_rename.cmds2.titleReplace.text = "REPLACE";
                    pal.gr_rename.cmds1.searchField.text = "Search...";
                    pal.gr_rename.cmds1.searchField.enabled = true;
                    pal.gr_rename.cmds1.maximumSize.height = 50;
                    pal.gr_rename.cmds1.visible = 1;


                    pal.gr_rename.cmds2.replaceField.text = "Replace...";
                    pal.gr_rename.cmds2.replaceField.enabled = true;
                    pal.gr_rename.cmds2.maximumSize.height = 50;
                    pal.gr_rename.cmds2.visible = 1;
                    pal.layout.layout(true);
                }
                if(ddsr.selection.index == 1){   
                    pal.gr_rename.cmds1.titleSearch.text ="PREFIX";
                    pal.gr_rename.cmds2.titleReplace.text = "-------";
                    pal.gr_rename.cmds1.searchField.text = "Prefix...";
                    pal.gr_rename.cmds1.searchField.enabled = true;
                    pal.gr_rename.cmds1.maximumSize.height = 50;
                    pal.gr_rename.cmds1.visible = 1;

                    pal.gr_rename.cmds2.replaceField.text = "";
                    pal.gr_rename.cmds2.replaceField.enabled = false;
                    pal.gr_rename.cmds2.maximumSize.height = 0;
                    pal.gr_rename.cmds2.visible = 0;
                    pal.layout.layout(true);
                }
                if(ddsr.selection.index == 2){    
                    pal.gr_rename.cmds1.titleSearch.text ="SUFFIX";
                    pal.gr_rename.cmds2.titleReplace.text = "-------";
                    pal.gr_rename.cmds1.searchField.text = "Suffix...";
                    pal.gr_rename.cmds1.searchField.enabled = true;
                    pal.gr_rename.cmds1.maximumSize.height = 50;
                    pal.gr_rename.cmds1.visible = 1;

                    pal.gr_rename.cmds2.replaceField.text = "";
                    pal.gr_rename.cmds2.replaceField.enabled = false;
                    pal.gr_rename.cmds2.maximumSize.height = 0;
                    pal.gr_rename.cmds2.visible = 0;
                    pal.layout.layout(true);
                }
                if(ddsr.selection.index == 3){    
                    pal.gr_rename.cmds1.titleSearch.text ="NUMBER";
                    pal.gr_rename.cmds2.titleReplace.text = "-------";
                    pal.gr_rename.cmds1.searchField.text = "";
                    pal.gr_rename.cmds1.searchField.enabled = false;
                    pal.gr_rename.cmds1.maximumSize.height = 0;
                    pal.gr_rename.cmds1.visible = 0;

                    pal.gr_rename.cmds2.replaceField.text = "";
                    pal.gr_rename.cmds2.replaceField.enabled = false;
                    pal.gr_rename.cmds2.maximumSize.height = 0;
                    pal.gr_rename.cmds2.visible = 0;
                    pal.layout.layout(true);
                }
                if(ddsr.selection.index == 4){
                    pal.gr_rename.cmds1.titleSearch.text ="REMOVE";
                    pal.gr_rename.cmds2.titleReplace.text = "-------";
                    pal.gr_rename.cmds1.searchField.text = "Remove...";
                    pal.gr_rename.cmds1.searchField.enabled = true;
                    pal.gr_rename.cmds1.maximumSize.height = 50;
                    pal.gr_rename.cmds1.visible = 1;

                    pal.gr_rename.cmds2.replaceField.text = "";
                    pal.gr_rename.cmds2.replaceField.enabled = false;
                    pal.gr_rename.cmds2.maximumSize.height = 0;
                    pal.gr_rename.cmds2.visible = 0;
                    pal.layout.layout(true);
                }

            }

            if(userPrefInputs[3] == 0){

                pal.gr_three.active = false;

                ccMainPanel.maximumSize.height = 0;
                ccMainPanel.size = [0, 0];
                ccMainPanel.enabled = false;
                ccMainPanel.visible = 0;

                pal.gr_three.maximumSize.height = 0;
                pal.gr_three.size = [0, 0];
                pal.gr_three.enabled = false;
                pal.gr_three.visible = 0;

                pal.gr_rename.maximumSize.height = 0;
                pal.gr_rename.size = [0, 0];
                pal.gr_rename.enabled = false;
                pal.gr_rename.visible = 0;

                srgrp.maximumSize.height = 0;
                srgrp.size = [0, 0];
                srgrp.enabled = false;
                srgrp.visible = 0;

                pal.gr_collect.maximumSize.height = 0;
                pal.gr_collect.size = [0, 0];
                pal.gr_collect.enabled = false;
                pal.gr_collect.visible = 0;

                pal.gr_dms.maximumSize.height = 0;
                pal.gr_dms.size = [0, 0];
                pal.gr_dms.enabled = false;
                pal.gr_dms.visible = 0;

                pal.gr_rename.cmds1.searchField.enabled = false;
                pal.gr_rename.cmds1.maximumSize.height = 0;
                pal.gr_rename.cmds1.visible = 0;

                pal.gr_rename.cmds2.replaceField.enabled = false;
                pal.gr_rename.cmds2.maximumSize.height = 0;
                pal.gr_rename.cmds2.visible = 0;

                pal.gr_rename.cmds3.duplicateCompBtn.enabled = false;
                pal.gr_rename.cmds3.RenameSelected.enabled = false;
                pal.gr_rename.cmds3.maximumSize.height = 0;
                pal.gr_rename.cmds3.visible = 0;

                pal.gr_three.cmds1.consolDups.maximumSize.height = 0;
                pal.gr_three.cmds1.consolDups.size = [0, 0];
                pal.gr_three.cmds1.consolDups.enabled = false;
                pal.gr_three.cmds1.consolDups.visible = 0;

                pal.gr_three.cmds1.consolDupsLike.maximumSize.height = 0;
                pal.gr_three.cmds1.consolDupsLike.size = [0, 0];
                pal.gr_three.cmds1.consolDupsLike.enabled = false;
                pal.gr_three.cmds1.consolDupsLike.visible = 0;

                pal.gr_three.cmds1.ReduceSelected.maximumSize.height = 0;
                pal.gr_three.cmds1.ReduceSelected.size = [0, 0];
                pal.gr_three.cmds1.ReduceSelected.enabled = false;
                pal.gr_three.cmds1.ReduceSelected.visible = 0;

            } else {
                pal.gr_three.active = true;

                ccMainPanel.maximumSize.height = 300;
                ccMainPanel.size = [360, 200];
                ccMainPanel.enabled = true;
                ccMainPanel.visible = 1;

                ddsr.size = [350, 25];

                pal.gr_three.maximumSize.height = 100;
                pal.gr_three.size = [360, 250];
                pal.gr_three.enabled = true;
                pal.gr_three.visible = 1;

                pal.gr_rename.maximumSize.height = 200;
                pal.gr_rename.size = [360, 200];
                pal.gr_rename.enabled = true;
                pal.gr_rename.visible = 1;

                srgrp.maximumSize.height = 100;
                srgrp.size = [360, 25];
                srgrp.enabled = true;
                srgrp.visible = 1;

                pal.gr_collect.maximumSize.height = 100;
                pal.gr_collect.size = [360, 25];
                pal.gr_collect.enabled = true;
                pal.gr_collect.visible = 1;

                pal.gr_dms.maximumSize.height = 100;
                pal.gr_dms.size = [360, 25];
                pal.gr_dms.enabled = true;
                pal.gr_dms.visible = 1;

                pal.gr_rename.cmds1.searchField.enabled = true;
                pal.gr_rename.cmds1.maximumSize.height = 100;
                pal.gr_rename.cmds1.visible = 1;

                pal.gr_rename.cmds2.replaceField.enabled = true;
                pal.gr_rename.cmds2.maximumSize.height = 100;
                pal.gr_rename.cmds2.visible = 1;

                pal.gr_rename.cmds3.duplicateCompBtn.enabled = true;
                pal.gr_rename.cmds3.RenameSelected.enabled = true;
                pal.gr_rename.cmds3.maximumSize.height = 100;
                pal.gr_rename.cmds3.visible = 1;

                pal.gr_three.cmds1.consolDups.maximumSize.height = 100;
                pal.gr_three.cmds1.consolDups.size = [110, 25];
                pal.gr_three.cmds1.consolDups.enabled = true;
                pal.gr_three.cmds1.consolDups.visible = 1;

                pal.gr_three.cmds1.consolDupsLike.maximumSize.height = 100;
                pal.gr_three.cmds1.consolDupsLike.size = [110, 25];
                pal.gr_three.cmds1.consolDupsLike.enabled = true;
                pal.gr_three.cmds1.consolDupsLike.visible = 1;

                pal.gr_three.cmds1.ReduceSelected.maximumSize.height = 100;
                pal.gr_three.cmds1.ReduceSelected.size = [110, 25];
                pal.gr_three.cmds1.ReduceSelected.enabled = true;
                pal.gr_three.cmds1.ReduceSelected.visible = 1;

            }

            pal.cleanCollectPanel.onClick = function(){
                if(userPrefInputs[3] == 1){
                    userPrefInputs[3] = 0;
                    saveUserPrefs(system.userName, userPrefInputs);

                    pal.gr_three.active = false;

                    ccMainPanel.maximumSize.height = 0;
                    ccMainPanel.size = [0, 0];
                    ccMainPanel.enabled = false;
                    ccMainPanel.visible = 0;

                    ddsr.size = [0, 0];

                    pal.gr_three.maximumSize.height = 0;
                    pal.gr_three.size = [0, 0];
                    pal.gr_three.enabled = false;
                    pal.gr_three.visible = 0;

                    pal.gr_rename.maximumSize.height = 0;
                    pal.gr_rename.size = [0, 0];
                    pal.gr_rename.enabled = false;
                    pal.gr_rename.visible = 0;

                    srgrp.maximumSize.height = 0;
                    srgrp.size = [0, 0];
                    srgrp.enabled = false;
                    srgrp.visible = 0;

                    pal.gr_collect.maximumSize.height = 0;
                    pal.gr_collect.size = [0, 0];
                    pal.gr_collect.enabled = false;
                    pal.gr_collect.visible = 0;
        
                    pal.gr_dms.maximumSize.height = 0;
                    pal.gr_dms.size = [0, 0];
                    pal.gr_dms.enabled = false;
                    pal.gr_dms.visible = 0;

                    pal.gr_rename.cmds1.searchField.enabled = false;
                    pal.gr_rename.cmds1.maximumSize.height = 0;
                    pal.gr_rename.cmds1.visible = 0;

                    pal.gr_rename.cmds2.replaceField.enabled = false;
                    pal.gr_rename.cmds2.maximumSize.height = 0;
                    pal.gr_rename.cmds2.visible = 0;
                    
                    pal.gr_rename.cmds3.duplicateCompBtn.enabled = false;
                    pal.gr_rename.cmds3.RenameSelected.enabled = false;
                    pal.gr_rename.cmds3.maximumSize.height = 0;
                    pal.gr_rename.cmds3.visible = 0;

                    pal.gr_three.cmds1.consolDups.maximumSize.height = 0;
                    pal.gr_three.cmds1.consolDups.size = [0, 0];
                    pal.gr_three.cmds1.consolDups.enabled = false;
                    pal.gr_three.cmds1.consolDups.visible = 0;

                    pal.gr_three.cmds1.consolDupsLike.maximumSize.height = 0;
                    pal.gr_three.cmds1.consolDupsLike.size = [0, 0];
                    pal.gr_three.cmds1.consolDupsLike.enabled = false;
                    pal.gr_three.cmds1.consolDupsLike.visible = 0;

                    pal.gr_three.cmds1.ReduceSelected.maximumSize.height = 0;
                    pal.gr_three.cmds1.ReduceSelected.size = [0, 0];
                    pal.gr_three.cmds1.ReduceSelected.enabled = false;
                    pal.gr_three.cmds1.ReduceSelected.visible = 0;

                    pal.layout.layout(true);
                    pal.layout.resize();              
                }else{

                    userPrefInputs[3] = 1;
                    saveUserPrefs(system.userName, userPrefInputs);

                    pal.gr_three.active = true;

                    ccMainPanel.maximumSize.height = 300;
                    ccMainPanel.size = [360, 200];
                    ccMainPanel.enabled = true;
                    ccMainPanel.visible = 1;

                    ddsr.size = [350, 25];

                    pal.gr_three.maximumSize.height = 100;
                    pal.gr_three.size = [360, 250];
                    pal.gr_three.enabled = true;
                    pal.gr_three.visible = 1;

                    pal.gr_rename.maximumSize.height = 200;
                    pal.gr_rename.size = [360, 200];
                    pal.gr_rename.enabled = true;
                    pal.gr_rename.visible = 1;

                    srgrp.maximumSize.height = 100;
                    srgrp.size = [360, 25];
                    srgrp.enabled = true;
                    srgrp.visible = 1;

                    pal.gr_collect.maximumSize.height = 100;
                    pal.gr_collect.size = [360, 25];
                    pal.gr_collect.enabled = true;
                    pal.gr_collect.visible = 1;
        
                    pal.gr_dms.maximumSize.height = 100;
                    pal.gr_dms.size = [360, 25];
                    pal.gr_dms.enabled = true;
                    pal.gr_dms.visible = 1;

                    pal.gr_rename.cmds1.searchField.enabled = true;
                    pal.gr_rename.cmds1.maximumSize.height = 100;
                    pal.gr_rename.cmds1.visible = 1;

                    pal.gr_rename.cmds2.replaceField.enabled = true;
                    pal.gr_rename.cmds2.maximumSize.height = 100;
                    pal.gr_rename.cmds2.visible = 1;

                    pal.gr_rename.cmds3.duplicateCompBtn.enabled = true;
                    pal.gr_rename.cmds3.RenameSelected.enabled = true;
                    pal.gr_rename.cmds3.maximumSize.height = 100;
                    pal.gr_rename.cmds3.visible = 1;

                    pal.gr_three.cmds1.consolDups.maximumSize.height = 100;
                    pal.gr_three.cmds1.consolDups.size = [110, 25];
                    pal.gr_three.cmds1.consolDups.enabled = true;
                    pal.gr_three.cmds1.consolDups.visible = 1;

                    pal.gr_three.cmds1.consolDupsLike.maximumSize.height = 100;
                    pal.gr_three.cmds1.consolDupsLike.size = [110, 25];
                    pal.gr_three.cmds1.consolDupsLike.enabled = true;
                    pal.gr_three.cmds1.consolDupsLike.visible = 1;

                    pal.gr_three.cmds1.ReduceSelected.maximumSize.height = 100;
                    pal.gr_three.cmds1.ReduceSelected.size = [110, 25];
                    pal.gr_three.cmds1.ReduceSelected.enabled = true;
                    pal.gr_three.cmds1.ReduceSelected.visible = 1;

                    pal.layout.layout(true);
                    pal.layout.resize();
                    
                }
            }

            var found = new Array(100);
            pal.exportProgressbar = pal.add('progressbar', undefined, found.length);
            pal.exportProgressbar.preferredSize = [350, 10];
            pal.exportProgressbar.maxvalue = 100;
            pal.exportProgressbar.value = 0;
            progressBar = pal.exportProgressbar;

            // pal.add("StaticText", undefined, "-------------------------------------     USAGE      -------------------------------------");
            pal.gr_five = pal.add(resUsage);
            pal.gr_five.graphics.backgroundColor = pal.gr_five.graphics.newBrush(pal.gr_five.graphics.BrushType.SOLID_COLOR, [0.1,0.1,0.1,1]);
            // pal.add("StaticText", undefined, "------------------------------------------------------------------------------------------");

            pal.gr_ver = pal.add(resVer);
            pal.gr_ver.cmds1.scriptVersion.text = "v" + version.toString();
            
            pal.gr_one.cmds1.textField.preferredSize = [300, 0];
            pal.gr_one.cmds1.textField.active = false;
            pal.gr_one.cmds1.textField.hide();

            pal.gr_one.cmds1.pastePaths.onClick = function(){
                if(pal.gr_one.cmds1.textField.active == true){
                    pal.gr_one.cmds1.textField.preferredSize = [300, 0];
                    pal.gr_one.cmds1.textField.size = [300, 0];
                    pal.gr_one.cmds1.textField.active = false;
                    pal.gr_one.cmds1.textField.hide();
                    pal.layout.layout(true);
                    pal.layout.resize();
                }
                else{
                    pal.gr_one.cmds1.textField.preferredSize = [300, 300];
                    pal.gr_one.cmds1.textField.size = [300, 100];
                    pal.gr_one.cmds1.textField.active = true;
                    pal.gr_one.cmds1.textField.show();
                    pal.layout.layout(true);
                    pal.layout.resize();
                }

            }

            pal.gr_one.cmds1.textField.onActivate = function(){
                pal.gr_one.cmds1.textField.preferredSize = [300, 100];
                pal.layout.layout(true);
                pal.layout.resize();
            }

            pal.gr_one.cmds1.textField.onChanging = function(){
                if(pal.gr_one.cmds1.textField.text == ""){
                    pal.layout.layout(true);
                    pal.layout.resize();
                }
            }

// 
            // pal.gr_one.cmds1.pastePaths.onClick = pasteFilePaths;
            pal.gr_one.cmds1.textField.text = "Paths to files go here...";

            pal.layout.layout(true);
            pal.gr_one.minimumSize = pal.gr_one.size;
            pal.gr_covers.minimumSize = pal.gr_covers.size;
            pal.gr_two.minimumSize = pal.gr_two.size;
            pal.layout.resize();
            pal.onResizing = pal.onResize = function () { this.layout.resize(); }

            pal.gr_three.cmds1.consolDups.onClick = consolidateFiles;
            pal.gr_three.cmds1.consolDups.helpTip = "Select which files you want to leave untouched from Project window and click. This will reduce, consolidate, and remove all unused assets.";
            pal.gr_three.cmds1.consolDupsLike.onClick = consolidateLikeFiles;
            pal.gr_three.cmds1.consolDupsLike.helpTip = "Select which files you want to leave untouched from Project window and click. This will reduce, consolidate, and remove all unused assets.";
            pal.gr_three.cmds1.ReduceSelected.onClick = reduceProject;
            pal.gr_three.cmds1.ReduceSelected.helpTip = "Select which files you want to leave untouched from Project window and click. This will reduce, consolidate, and remove all unused assets.";
            
            var consdupsBtn = pal.gr_three.cmds1.consolDups;
            consdupsBtn.value = true;

            pal.gr_one.cmds1.ImportPaths.onClick = importFilesFromPaths;
            pal.gr_one.cmds1.ImportPaths.helpTip = "Paste paths in textbox and click. This will import all the files into your project. Be sure you check that you paths are correct. Each file path should be separated by a single line return.";
            pal.gr_one.cmds4.SourceFromRen.onClick = importSourceProjectsFromRenDialoge;
            pal.gr_one.cmds4.SourceFromRen.helpTip = "Select quicktime files in project window and click. This will import the AE project used to created the selected the quicktimes. The selected quicktimes file must have been rendered from After Effects with embedded metadata.";
            pal.gr_one.cmds4.SourceFromRef.onClick = importSourceProjectsFromRef;
            pal.gr_one.cmds4.SourceFromRef.helpTip = "Select quicktime files in project window and click. This will import all AE projects used to create the graphics in the  PR reference. Graphic comps are placed in ImportedComps folder. The selected quicktime file must be exported from Premiere with embeded metadata.";
            pal.gr_dms.cmds1.DMSBtn.onClick = BuildAndOrganize;
            pal.gr_collect.cmds1.collectBtn.onClick = AEPCollect;
            pal.gr_collect.cmds1.collectBtn.helpTip = "This will collect you project. Select comps you wish to export or choose to export the entire project.";
            pal.gr_five.cmds1.extrasBtn.onClick = extras;
            pal.gr_five.cmds1.usageBtn.onClick = usageLink;
            pal.gr_five.cmds1.usageBtn.helpTip = "Link to helpful resources.";
            pal.gr_five.cmds1.buildOptions.onClick = callBuildOptionUI;
            pal.gr_five.cmds1.buildOptions.helpTip = "These options are for changing the folder names used in the BUILD / ORGANIZE function.";
        }
        var filePath = scriptPath + "/XAVToolbox_Assets/";
        removeAOMPrefs();
        loadaoms(filePath);
        return pal;
    }


/////SYSTEM CHECK//////

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

    userPrefInputs = loadUserPrefs(system.userName);
    
}

///////// GET DATE INFORMATION /////////

    function getCurrentDate(){
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
    }

/////SAVE USER PREFS/////

function saveUserPrefs(userName, userPrefInput) {
    var filePath = scriptPath + "/XAVToolbox_Assets/SaveData/Users/" + userName + "/";
    var userPrefName = filePath + userName + "_UI_PREFS.txt";
    var userPrefFile = new File(userPrefName);

    if (!userPrefFile.exists) {
        writeFile(userPrefFile, userPrefInput);
        // alert("Log saved to: " + userPrefFile.fsName);
    }
    else {
        writeFile(userPrefFile, userPrefInput);
        // alert("Log saved to: " + userPrefFile.fsName);
    }
}

/////LOAD USER PREFS/////

function loadUserPrefs(userName) {
    var filePath = scriptPath + "/XAVToolbox_Assets/SaveData/Users/" + userName + "/";
    var userPrefName = filePath + userName + "_UI_PREFS.txt";
    var userPrefFile = new File(userPrefName);

        var itemArr = new Array();

        var prefsFile = new File(userPrefName);
        if(prefsFile.exists){
            prefsFile.open();
            var content = prefsFile.read();
            prefsFile.close();
            itemArr = content.split(',');
        }else {
            saveUserPrefs(system.userName, userPrefInputs);
        }
        return itemArr;
}



/////SECURITY ACCESS CHECK/////

function canWriteFiles() {
    var appVersion, commandID, scriptName, tabName;

    appVersion = parseFloat(app.version);

    commandID = 2359;
    tabName = 'General';
    if (appVersion >= 16.1) {
        commandID = 3131;
        tabName = 'Scripting & Expressions';
    }

    if (isSecurityPrefSet()) return true;

    alert(message = ' Requires access to write files.\n' +
        'Go to the "' + tabName + '" panel of the application preferences and make sure ' +
        '"Allow Scripts to Write Files and Access Network" is checked.');

    app.executeCommand(commandID);

    return isSecurityPrefSet();

    function isSecurityPrefSet() {
        return app.preferences.getPrefAsLong(
            'Main Pref Section',
            'Pref_SCRIPTING_FILE_NETWORK_SECURITY'
        ) === 1;
    }
}

/////INITIALIZE CUSTOM OUTPUT MODULES///////

function checkRQsettings(testRQ) {

    var hasPNGModule = false;
    var PNGModuleName = "X_pngRGB";  
    for (i = 0; i < testRQ.outputModules[1].templates.length; ++i) {
        tempName = testRQ.outputModules[1].templates[i];
        if (tempName == PNGModuleName) {
            hasPNGModule = true;
        }
    }
    if(hasPNGModule){
        hasTemplates = true;
    }
    return(hasTemplates);
}

function removeAOMPrefs(){
    prefFile = new File("C:/Users/"+ userName +"/AppData/Roaming/Adobe/After Effects/22.5/Adobe After Effects 22.5 Prefs-indep-output.txt");
    prefFile.remove();
}

function loadaoms(extensionPath){
    while (app.project.renderQueue.numItems > 0){
        app.project.renderQueue.item(app.project.renderQueue.numItems).remove();
    }
    var newComp;
    if(app.project.renderQueue.item[1] == null){
        newComp = app.project.items.addComp("testComp" , 100, 100, 1, 100, 24);
        var newCompitem = app.project.renderQueue.items.add(newComp);
    }
    var presetRQ = app.project.renderQueue.item(app.project.renderQueue.numItems);    
    var tempExist = checkRQsettings(presetRQ);
    if(!tempExist){
        var orig_file = null;
        if(app.project.file != null){
            orig_file = new File(app.project.file.fsName);
            app.project.close(CloseOptions.PROMPT_TO_SAVE_CHANGES);
            aomSaveAsTemplate(extensionPath);
            app.open(orig_file);
        }
        else{
            aomSaveAsTemplate(extensionPath);
        }
    }else{
        newComp.remove();
    }
}

function  aomSaveAsTemplate(extensionPath){
    var aomprojectpath = extensionPath + "/aom.aep";
    var newaomproj = new File(aomprojectpath);
    if(app.project.renderQueue.item[1] == null){
        var newComp = app.project.items.addComp("testComp" , 100, 100, 1, 100, 24);
        var newCompitem = app.project.renderQueue.items.add(newComp);
    }
    var presetRQ = app.project.renderQueue.item(app.project.renderQueue.numItems);    
    var tempExist = checkRQsettings(presetRQ);
    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);    
    if(!tempExist && newaomproj.exists){
        var aomprojimport = app.open(newaomproj);
        var presetRQ = app.project.renderQueue.item(app.project.renderQueue.numItems);
        var pngOM = presetRQ.outputModules[1];
        var pngaOM = presetRQ.outputModules[2];
        var gatewayjpgOM = presetRQ.outputModules[3];
        var tiffOM = presetRQ.outputModules[4];
        var finTrilproresOM = presetRQ.outputModules[5];
        var finMillproresOM = presetRQ.outputModules[6];
        var gatewayOM = presetRQ.outputModules[7];
        var pendryOM = presetRQ.outputModules[8];
        var proresOM = presetRQ.outputModules[9];
        if(hasTemplates == false){
            presetRQ.outputModules[1].saveAsTemplate(pngOM.name);
            presetRQ.outputModules[2].saveAsTemplate(pngaOM.name);
            presetRQ.outputModules[3].saveAsTemplate(gatewayjpgOM.name);
            presetRQ.outputModules[4].saveAsTemplate(tiffOM.name);
            presetRQ.outputModules[5].saveAsTemplate(finTrilproresOM.name);
            presetRQ.outputModules[7].saveAsTemplate(gatewayOM.name);
            presetRQ.outputModules[8].saveAsTemplate(pendryOM.name);
            presetRQ.outputModules[9].saveAsTemplate(proresOM.name);
            presetRQ.outputModules[6].saveAsTemplate(finMillproresOM.name);
        }
        app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    }
}

/////PROJECT CONTROL FUNCTIONS//////

    function AddOfflineMovToRenderQueue(comp, renderFilePath){
        var item = app.project.renderQueue.items.add(comp);
        var outputModule = item.outputModule(1);               
        outputModule.applyTemplate("X_ProRes 4444 Trillions Alpha");
        var outputname = comp.name + "_" + (1/comp.frameDuration) + "fps_" + comp.width + "x" + comp.height + ".mov";
        var separator = "/";
        outputModule.file = File(renderFilePath + separator + outputname);
    }

    function AddOnlineMovToRenderQueue(comp, renderFilePath){
        var item = app.project.renderQueue.items.add(comp);
        var outputModule = item.outputModule(1);               
        outputModule.applyTemplate("X_FIN_ProRes 4444 Trill Alpha");
        var outputname = comp.name + "_" + (1/comp.frameDuration) + "fps_" + comp.width + "x" + comp.height + ".mov";
        var separator = "/";
        outputModule.file = File(renderFilePath + separator + outputname);
    }

    function RenderToProject(projectpath, OnlineRender){
        saveRenderLog(projectpath);
        while (app.project.renderQueue.numItems > 0){
            app.project.renderQueue.item(app.project.renderQueue.numItems).remove();
        }
        var selectedComps = new Array();
        var outputFileNames = new Array();
        var outputFiles = new Array();
        var OutputPath = decodeURI(projectpath);
        for (var x = 1; x <= app.project.numItems; x++){
            if (app.project.item(x).selected){
                selectedComps.push(app.project.item(x));  
            }
        }
        for(var i = 0; i <= selectedComps.length - 1; i++){
            if(onlineRender){
                AddOnlineMovToRenderQueue(selectedComps[i], OutputPath);
            } else{
                AddOfflineMovToRenderQueue(selectedComps[i], OutputPath);
            }
            app.project.renderQueue.render();
        }

    }

    function saveRenderLog(newlogInput) {
        var date = new Date();
        var content = "";
        var newline = userName.toUpperCase() + " :-: " + currentDate + " :-: " + newlogInput;
        var logname = scriptPath + "/XAVToolbox_Assets/SaveData/RENDER_LOG.txt";
        var logFile = new File(logname);
        if (!logFile.exists) {
            writeFile(logFile, newline);
        }
        else if(logFile.exists) {
            logFile.open();
            var content = logFile.read();
            logFile.close();
            writeFile(logFile, content + "\n" + newline);
        }
    }

    function OpenFromDirectory(projectpath){
        var path = new File(projectpath);
        var file = path.openDlg("Choose File:");
        while (file.alias) {
            file = file.resolve().openDlg("Choose File:");
        }
        currentProject = app.open(file);
    }

    function ImportFromDirectory(projectpath){
        var path = new File(projectpath);
        var file = path.openDlg("Choose File:");
        while (file.alias) {
            file = file.resolve().openDlg("Choose File:");
        }
        ImportedFile = app.project.importFile(new ImportOptions(file));
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
        var filePath = scriptPath + "/XAVToolbox_Assets/SaveData/";
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
        var filePath = scriptPath + "/XAVToolbox_Assets/SaveData/";
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
        var filePath = scriptPath + "/XAVToolbox_Assets/SaveData/";
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

////DROPDOWN CONTENT/////////

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
        formatList.push("9x16");
        formatList.push("9x16 TikTok (In-Feed)");
        formatList.push("9x16 TikTok (Takeover)");
        formatList.push("9x16 TikTok (Topdown)");
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

////CREATE / MODIFY///////////

    function getCompFormat(){
        if(ddfr.selection.index == 0){
            framerateSelection = 23.976;
        }
        if(ddfr.selection.index == 1){
            framerateSelection = 24;
        }
        if(ddfr.selection.index == 2){
            framerateSelection = 29.97;
        }
        if(ddfr.selection.index == 3){
            framerateSelection = 30;
        }
        if(ddfr.selection.index == 4){
            framerateSelection = 60;
        }
        if(ddfr.selection.index == 5){
            framerateSelection = 0;
        }

        if(ddsz.selection.index == 0){
            infoTextOffsetX = 1920;
            infoTextOffsetY = 17;
            compARname = "16x9";
            matteTypeName = "None";
            textAlignment = ParagraphJustification.CENTER_JUSTIFY;
            chartname = "UHD_chart.psd";
            textLineReturn = "";
            mattename = " ";
            chartnameHD = " ";
            HDchartimport = " ";
            CPname = "CP_16x9.psd";
            compSizeXSelection = 3840;
            compSizeYSelection = 2160;
            matteimport = " ";
            if(guidescbenabled == true){
                itemCheck(chartname);
            }
        }
        if(ddsz.selection.index == 1){
            infoTextOffsetX = 960;
            infoTextOffsetY = 17;
            textLineReturn = "";
            textAlignment = ParagraphJustification.CENTER_JUSTIFY;
            compARname = "240";
            matteTypeName = "2:40";
            chartname = "240_chart.psd";
            chartnameHD = "HD_Red_chart.psd";
            mattename = "240_matte.png";
            CPname = "CP_16x9.psd";        
            compSizeXSelection = 1920;
            compSizeYSelection = 1080;
            if(guidescbenabled == true){
                itemCheck(chartname);
                HDChartCheck(chartnameHD);
                matteCheck(mattename);
            }
        }
        if(ddsz.selection.index == 2){
            infoTextOffsetX = 960;
            infoTextOffsetY = 17;
            textLineReturn = "";
            textAlignment = ParagraphJustification.CENTER_JUSTIFY;
            compARname = "235";
            matteTypeName = "2:35";
            chartname = "235_chart.psd";
            chartnameHD = "HD_Red_chart.psd";
            mattename = "235_matte.png";
            CPname = "CP_16x9.psd";        
            compSizeXSelection = 1920;
            compSizeYSelection = 1080;
            if(guidescbenabled == true){
                itemCheck(chartname);
                HDChartCheck(chartnameHD);
                matteCheck(mattename);
            }
        }
        if(ddsz.selection.index == 3){
            infoTextOffsetX = 960;
            infoTextOffsetY = 17;
            textLineReturn = "";
            textAlignment = ParagraphJustification.CENTER_JUSTIFY;
            compARname = "210";
            matteTypeName = "2:10";
            chartname = "210_chart.psd";
            chartnameHD = "HD_Red_chart.psd";
            mattename = "210_matte.png";
            CPname = "CP_16x9.psd";
            compSizeXSelection = 1920;
            compSizeYSelection = 1080;
            if(guidescbenabled == true){
                itemCheck(chartname);
                HDChartCheck(chartnameHD);
                matteCheck(mattename);
            }
        }
        if(ddsz.selection.index == 4){
            infoTextOffsetX = 960;
            infoTextOffsetY = 17;
            textLineReturn = "";
            textAlignment = ParagraphJustification.CENTER_JUSTIFY;
            compARname = "185";
            matteTypeName = "1:85";
            chartname = "185_chart.psd";
            chartnameHD = "HD_Red_chart.psd";
            mattename = "185_matte.png";
            CPname = "CP_16x9.psd";
            compSizeXSelection = 1920;
            compSizeYSelection = 1080;
            if(guidescbenabled == true){
                itemCheck(chartname);
                HDChartCheck(chartnameHD);
                matteCheck(mattename);
            }
        }
        if(ddsz.selection.index == 5){
            infoTextOffsetX = 960;
            infoTextOffsetY = 17;
            textLineReturn = "";
            textAlignment = ParagraphJustification.CENTER_JUSTIFY;
            compARname = "16x9";
            matteTypeName = "None";
            chartname = "HD_chart.psd";
            mattename = " ";
            chartnameHD = " ";
            HDchartimport = " ";
            CPname = "CP_16x9.psd";
            compSizeXSelection = 1920;
            compSizeYSelection = 1080;
            matteimport = " ";
            if(guidescbenabled == true){
                itemCheck(chartname);
            }
        }
        if(ddsz.selection.index == 6){
            infoTextOffsetX = 960;
            infoTextOffsetY = 17;
            compARname = "HD1020";
            matteTypeName = "None";
            textAlignment = ParagraphJustification.CENTER_JUSTIFY;
            chartname = "HD1020_chart.psd";
            textLineReturn = "'\\n'";
            mattename = "HD1020_matte.png";
            HDchartimport = " ";
            chartnameHD = " ";
            CPname = "CP_HD1020.psd";
            compSizeXSelection = 1920;
            compSizeYSelection = 1080;
            if(guidescbenabled == true){
                itemCheck(chartname);
                matteCheck(mattename);
            }
        }
        if(ddsz.selection.index == 7){
            infoTextOffsetX = 960;
            infoTextOffsetY = 17;
            compARname = "16x9NPS";
            matteTypeName = "None";
            textAlignment = ParagraphJustification.CENTER_JUSTIFY;
            chartname = "NetflixProductSafe_chart.psd";
            textLineReturn = "'\\n'";
            mattename = "NetFlixProductSafe_matte.png";
            HDchartimport = " ";
            chartnameHD = " ";
            CPname = "CP_NetflixProductSafe.psd";
            compSizeXSelection = 1920;
            compSizeYSelection = 1080;
            if(guidescbenabled == true){
                itemCheck(chartname);
                matteCheck(mattename);
            }
        }
        if(ddsz.selection.index == 8){
            infoTextOffsetX = 14;
            infoTextOffsetY = 17;
            compARname = "9x16";
            matteTypeName = "None";
            textAlignment = ParagraphJustification.LEFT_JUSTIFY;
            chartname = "9x16_chart.psd";
            textLineReturn = "'\\n'";
            mattename = "4x5_9x16_matte.png";
            HDchartimport = " ";
            chartnameHD = " ";
            CPname = "CP_9x16.psd";
            compSizeXSelection = 1080;
            compSizeYSelection = 1920;
            if(guidescbenabled == true){
                itemCheck(chartname);
                matteCheck(mattename);
            }
        }
        if(ddsz.selection.index == 9){
            infoTextOffsetX = 14;
            infoTextOffsetY = 17;
            compARname = "9x16TT_IF";
            matteTypeName = "None";
            textAlignment = ParagraphJustification.LEFT_JUSTIFY;
            chartname = "TikTokSafe_chart.psd";
            textLineReturn = "'\\n'";
            mattename = "9x16TT_matte.png";
            HDchartimport = " ";
            chartnameHD = " ";
            CPname = "CP_9x16.psd";
            compSizeXSelection = 1080;
            compSizeYSelection = 1920;
            if(guidescbenabled == true){
                itemCheck(chartname);
                matteCheck(mattename);
            }
        }
        if(ddsz.selection.index == 10){
            infoTextOffsetX = 14;
            infoTextOffsetY = 17;
            compARname = "9x16TT_TO";
            matteTypeName = "None";
            textAlignment = ParagraphJustification.LEFT_JUSTIFY;
            chartname = "TikTokSafe_1242x2208_chart.png";
            textLineReturn = "'\\n'";
            mattename = "9x16TT_1242x2208_matte.png";
            HDchartimport = " ";
            chartnameHD = " ";
            CPname = "CP_9x16.psd";
            compSizeXSelection = 1080;
            compSizeYSelection = 1920;
            if(guidescbenabled == true){
                itemCheck(chartname);
                matteCheck(mattename);
            }
        }
        if(ddsz.selection.index == 11){
            infoTextOffsetX = 14;
            infoTextOffsetY = 17;
            compARname = "9x16TT_TD";
            matteTypeName = "None";
            textAlignment = ParagraphJustification.LEFT_JUSTIFY;
            chartname = "TikTokTopView_chart.png";
            textLineReturn = "'\\n'";
            mattename = "9x16TT_1242x2208_matte.png";
            HDchartimport = " ";
            chartnameHD = " ";
            CPname = "CP_9x16.psd";
            compSizeXSelection = 1080;
            compSizeYSelection = 1920;
            if(guidescbenabled == true){
                itemCheck(chartname);
                matteCheck(mattename);
            }
        }   
        if(ddsz.selection.index == 12){
            infoTextOffsetX = 14;
            infoTextOffsetY = 17;
            compARname = "4x5";
            matteTypeName = "None";
            textAlignment = ParagraphJustification.LEFT_JUSTIFY;
            chartname = "4x5_chart.psd";
            textLineReturn = "'\\n'";
            mattename = "4x5_matte.png";
            CPname = "CP_4x5.psd";
            compSizeXSelection = 1080;
            compSizeYSelection = 1350;
            matteimport = " ";
            HDchartimport = " ";
            chartnameHD = " ";
            if(guidescbenabled == true){
                itemCheck(chartname);
                matteCheck(mattename);
            }
        }
        if(ddsz.selection.index == 13){
            infoTextOffsetX = 14;
            infoTextOffsetY = 17;
            compARname = "1x1";
            matteTypeName = "None";
            textAlignment = ParagraphJustification.LEFT_JUSTIFY;
            chartname = "1x1_chart.psd";
            textLineReturn = "'\\n'";
            mattename = "1x1_matte.png";
            matteimport = " ";
            HDchartimport = " ";
            chartnameHD = " ";
            CPname = "CP_1x1.psd";
            compSizeXSelection = 1080;
            compSizeYSelection = 1080;
            if(guidescbenabled == true){
                itemCheck(chartname);
                matteCheck(mattename);
            }
        }
        if(ddsz.selection.index == 14){
            infoTextOffsetX = 0;
            infoTextOffsetY = 0;
            compARname = "";
            matteTypeName = "None";
            textAlignment = ParagraphJustification.LEFT_JUSTIFY;
            chartname = "1x1_chart.psd";
            textLineReturn = "'\\n'";
            mattename = "1x1_matte.png";
            HDchartimport = " ";
            chartnameHD = " ";
            CPname = "CP_1x1.psd";
            compSizeXSelection = 0;
            compSizeYSelection = 0;
            if(guidescbenabled == true){
                itemCheck(chartname);
                matteCheck(mattename);
            }
        }
        
        HDchartimport.selected = false;
        Matteimport.selected = false;
        Chartimport.selected = false;
    }

    function getCheckerFormat(){
        if(dd.selection.index == 0){
            compARname = "16x9";
            matteTypeName = "None";
            CPname = "16x9_COVER_01.psd";
            cpCompName = "16x9_COVER_01";
        }
        if(dd.selection.index == 1){
            compARname = "2:40";
            matteTypeName = "2:40";
            CPname = "16x9_COVER_01.psd";
            cpCompName = "CP_16x9";
        }
        if(dd.selection.index == 2){
            compARname = "2:35";
            matteTypeName = "2:35";
            CPname = "16x9_COVER_01.psd";
            cpCompName = "CP_16x9";
        }
        if(dd.selection.index == 3){
            compARname = "2:10";
            matteTypeName = "2:10";
            CPname = "16x9_COVER_01.psd";
            cpCompName = "16x9_COVER_01";
        }
        if(dd.selection.index == 4){
            compARname = "1:85";
            matteTypeName = "1:85";
            CPname = "16x9_COVER_01.psd";
            cpCompName = "16x9_COVER_01";        
        }
        if(dd.selection.index == 5){
            compARname = "16x9";
            matteTypeName = "None";
            CPname = "16x9_COVER_01.psd";
            cpCompName = "16x9_COVER_01";        
        }
        if(dd.selection.index == 6){
            compARname = "HD1020";
            matteTypeName = "None";
            CPname = "HD1020_COVER_01.psd";
            cpCompName = "HD1020_COVER_01";
        }
        if(dd.selection.index == 7){
            compARname = "16x9NPS";
            matteTypeName = "None";
            CPname = "NetflixProductSafe_COVER_01.psd";
            cpCompName = "NetflixProductSafe_COVER_01";
        }
        if(dd.selection.index == 8){
            compARname = "9x16";
            matteTypeName = "None";
            CPname = "9x16_COVER_01.psd";
            cpCompName = "9x16_COVER_01";
        }
        if(dd.selection.index == 9){
            compARname = "9x16TT_IF";
            matteTypeName = "None";
            CPname = "9x16_COVER_01.psd";
            cpCompName = "9x16_COVER_01";
        }
        if(dd.selection.index == 10){
            compARname = "9x16TT_TO";
            matteTypeName = "None";
            CPname = "9x16_COVER_01.psd";
            cpCompName = "9x16_COVER_01";
        }
        if(dd.selection.index == 11){
            compARname = "9x16TT_TD";
            matteTypeName = "None";
            CPname = "9x16_COVER_01.psd";
            cpCompName = "9x16_COVER_01";
        }
        if(dd.selection.index == 12){
            compARname = "4x5";
            matteTypeName = "None";
            CPname = "4x5_COVER_01.psd";
            cpCompName = "4x5_COVER_01";
        }
        if(dd.selection.index == 13){
            compARname = "1x1";
            matteTypeName = "None";
            CPname = "1x1_COVER_01.psd";
            cpCompName = "1x1_COVER_01";
        }
    }

    function pasteFilePaths(){
        var textInput = this.parent.parent.cmds1.textField;
        textInput.preferredSize = [300, 300];
        var clipboardScriptPath = new File(scriptPath + "/XAVToolbox_Assets/HelperScripts/XAVToolbox_GetClipboard.command").execute();
        $.setTimeout = function(func, time) {
            $.sleep(time);
            func();
        };
        var content = "";
        $.setTimeout(function () {
            var clipboardTextFile = new File("~/Desktop/XAVPastedPaths.txt");
            if(!clipboardTextFile.exists){
                clipboardTextFile = new File("~/Desktop/XAVPastedPaths.txt");
                clipboardTextFile.open();
                content = clipboardTextFile.read();
                clipboardTextFile.close();
                textInput.text = content;
            }
            else{
                clipboardTextFile.open();
                content = clipboardTextFile.read();
                clipboardTextFile.close();  
                textInput.text = content;
            }
            clipboardTextFile.remove();
        }, 200);
        if(textInput.text != ""){
            textInput.size = [300, 100];
            textInput.active = true;
            textInput.show();
        }
    }

////EMAIL //////////////////

    function sizeEnabled(){
        if(sizecbenabled == true){
            sizecbenabled = false;
            ddsz.enabled = false;
        }else{
            sizecbenabled = true;
            ddsz.enabled = true;
        }
    }

    function fpsEnabled(){
        if(fpscbenabled == true){
            fpscbenabled = false;
            ddfr.enabled = false;
        }else{
            fpscbenabled = true;
            ddfr.enabled = true;
        }
    }

    function guidesEnabled(){
        if(guidescbenabled == true){
            guidescbenabled = false;
        }else{
            guidescbenabled = true;
        }
    }

    String.prototype.endsWith = function( str ) {
        return this.substring( this.length - str.length, this.length ) === str;
    };

    function hideGuides(){
            var selectedComps = new Array();
            for (var x = 1; x <= app.project.numItems; x++){
                if (app.project.item(x).selected){
                    selectedComps.push(app.project.item(x));
                }
            }
            if(selectedComps.length > 0){
                for (var x = 0; x < selectedComps.length; x++){
                    var oldguides = new Array();
                    var layerCollection = selectedComps[x].layers;
                    var currlayer;
                    for(var y = 1; y <= layerCollection.length; y++){
                        if(layerCollection[y].name == "XAV frame counter info"){
                                layerCollection[y].enabled = false;
                        }
                        var layername = layerCollection[y].name;
                        var chartlayermatch = layername.endsWith("chart.psd");
                        var mattelayermatch = layername.endsWith("matte.png");
                        if(chartlayermatch){
                            layerCollection[y].enabled = false;
                        }
                        if(mattelayermatch){
                            layerCollection[y].enabled = false;
                        }
                    }
                }
            }
    }

    function showGuides(){
            var selectedComps = new Array();
            for (var x = 1; x <= app.project.numItems; x++){
                if (app.project.item(x).selected){
                    selectedComps.push(app.project.item(x));
                }
            }
            if(selectedComps.length > 0){
                for (var x = 0; x < selectedComps.length; x++){
                    var oldguides = new Array();
                    var layerCollection = selectedComps[x].layers;
                    var currlayer;
                    for(var y = 1; y <= layerCollection.length; y++){
                        if(layerCollection[y].name == "XAV frame counter info"){
                                layerCollection[y].enabled = true;
                        }
                        var layername = layerCollection[y].name;
                        var chartlayermatch = layername.endsWith("chart.psd");
                        var mattelayermatch = layername.endsWith("matte.png");
                        if(chartlayermatch){
                            layerCollection[y].enabled = true;
                        }
                        if(mattelayermatch){
                            layerCollection[y].enabled = true;
                        }
                    }
                }
            }

    }

    function createXAVComp(){
        while(progressBar.value < 100) {
           progressBar.value++; 
           $.sleep(2);
        }
        app.beginUndoGroup(XAVToolboxData.scriptName);
            app.project.timeDisplayType = TimeDisplayType.FRAMES;
            app.project.footageTimecodeDisplayStartType = FootageTimecodeDisplayStartType.FTCS_USE_SOURCE_MEDIA;
            var job = this.parent.parent.cmds7.jobField.text;
            var style = this.parent.parent.cmds7.styleField.text;
            var desc = this.parent.parent.cmds8.descField.text;
            var init = this.parent.parent.cmds8.initField.text;
            var sizeX = parseInt(this.parent.parent.customFormatCmds.widthField.text);
            var sizeY = parseInt(this.parent.parent.customFormatCmds.heightField.text);
            var fpsInput = parseInt(this.parent.parent.customFormatCmds.fpsField.text);
            getCompFormat();
            var customInputs = false;
            if(ddsz.selection.index == 14){
                customInputs = true;
                compSizeXSelection = sizeX;
                compSizeYSelection = sizeY;
                compARname = sizeX + "x" + sizeY;
            }
            if(ddfr.selection.index == 5){
                framerateSelection = fpsInput;
            }

            var newXAVComp = app.project.items.addComp(job + "_" + compARname + "_" + style + "_" + desc + "_" + init + "_01", compSizeXSelection, compSizeYSelection, 1, 10, framerateSelection);
            if(guidescbenabled == true && customInputs == false){
                if(Matteimport != " "){
                    var matteLayer = newXAVComp.layers.add(Matteimport);
                    matteLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                    matteLayer.guideLayer = true;
                }
                if(HDchartimport != " "){
                    var HDchartLayer = newXAVComp.layers.add(HDchartimport);
                    HDchartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                    HDchartLayer.guideLayer = true;
                    HDchartLayer.property("Opacity").setValue(50);
                }
                var chartLayer = newXAVComp.layers.add(Chartimport);
                chartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                chartLayer.guideLayer = true;
                chartLayer.property("Opacity").setValue(50);
                var compInfoText = newXAVComp.layers.addText("temp text");
                var mainTextDocument = compInfoText.property("ADBE Text Properties").property("ADBE Text Document")
                var textDocument1 = mainTextDocument.value;
                textDocument1.resetCharStyle();
                textDocument1.fontSize = 12;   
                textDocument1.fillColor = [1, 1, 1];
                textDocument1.font = systemFont;
                textDocument1.text = "";
                textDocument1.justification = textAlignment;
                mainTextDocument.setValue(textDocument1);
                compInfoText.transform.position.setValue([infoTextOffsetX, infoTextOffsetY]);
                var textLayerPosExpression = "[" + infoTextOffsetX + "," + infoTextOffsetY + "];";
                compInfoText.transform.position.expression = textLayerPosExpression;
                compInfoText.opacity.setValue(50);
                compInfoText.name = "XAV frame counter info";
                var textLayerExpression = " thisComp.name + \"   \"  + timeToCurrentFormat(time) + \"   FPS: \" + (1.0 / thisComp.frameDuration).toFixed(3);";
                compInfoText.sourceText.expression = textLayerExpression;    
            }
            colorLabel(newXAVComp.name, 14);    
        app.endUndoGroup();
        progressBar.value = 0;       
        deselectAll();
    }

    function modifyComp(){
        app.beginUndoGroup(XAVToolboxData.scriptName);
            app.project.timeDisplayType = TimeDisplayType.FRAMES;
            app.project.footageTimecodeDisplayStartType = FootageTimecodeDisplayStartType.FTCS_USE_SOURCE_MEDIA;
            var selectedComps = new Array();
            for (var x = 1; x <= app.project.numItems; x++){
                if (app.project.item(x).selected){
                    selectedComps.push(app.project.item(x));
                }
            }
            while(progressBar.value < 100) {
               progressBar.value++; 
               $.sleep(2);
            }
            if(selectedComps.length > 0){
                for (var x = 0; x < selectedComps.length; x++){
                    getCompFormat();
                    var sizeX = parseInt(this.parent.parent.customFormatCmds.widthField.text);
                    var sizeY = parseInt(this.parent.parent.customFormatCmds.heightField.text);
                    var fpsInput = parseInt(this.parent.parent.customFormatCmds.fpsField.text);
                    var job = this.parent.parent.cmds7.jobField.text;
                    var desc = this.parent.parent.cmds8.descField.text;
                    var init = this.parent.parent.cmds8.initField.text;
                    var customInputs = false;
                    var layersToOffset = new Array();
                    var oldguides = new Array();
                    var layerCollection = selectedComps[x].layers;
                    var offsetnull = selectedComps[x].layers.addNull();
                    var currlayer;
                    var matteLayer;
                    var chartLayer;
                    var HDchartLayer;
                    colorLabel(selectedComps[x].name, 14);
                    offsetnull.name = "XAVoffset";
                    offsetnull.source.name = "XAVoffset";
                    offsetnull.threeDLayer = true;
                    var namesplittrim = new Array();

                    for(var y = 2; y <= layerCollection.length; y++){
                        if(layerCollection[y].name != mattename && layerCollection[y].name != chartname && layerCollection[y].name != "XAV frame counter info" && layerCollection[y].name != "XAVoffset"){
                            if(layerCollection[y].parent == null){
                                layerCollection[y].parent = offsetnull;
                            }
                        }
                    }
                    if(fpscbenabled == true){
                        if(ddfr.selection.index == 5){
                            framerateSelection = fpsInput;
                        }
                        selectedComps[x].frameRate = framerateSelection;
                    }

                    if(sizecbenabled == true){
                        if(ddsz.selection.index == 14){
                            customInputs = true;
                            compSizeXSelection = sizeX;
                            compSizeYSelection = sizeY;
                            compARname = sizeX + "x" + sizeY;
                        }

                        selectedComps[x].height = compSizeYSelection;
                        selectedComps[x].width = compSizeXSelection; 
                        offsetnull.transform.position.setValue([(compSizeXSelection / 2), (compSizeYSelection / 2), 0]);
                        var nameSplitArr = selectedComps[x].name.split('_');
                        
                        var ARnames = ["16x9", "240" ,"235", "210", "185", "9x16", "4x5", "1x1", "16x9NPS", "HD1020", "9x16TT_IF", "9x16TT_TO", "9x16TT_TD"];
                        for(var c = 0; c <= ARnames.length; c++){
                            if(nameSplitArr[1] == ARnames[c]){
                                nameSplitArr[1] = compARname;
                            }
                        }
                        
                        for(var c = 0; c <= ARnames.length; c++){
                            if((nameSplitArr[1] + "_" + nameSplitArr[2]) == ARnames[c]){                                
                                nameSplitArr[1] = compARname;
                                nameSplitArr[2] = " ";
                            }
                        }

                        for(var n = 0; n <= nameSplitArr.length; n++){
                            if(nameSplitArr[n] != " "){
                                namesplittrim.push(nameSplitArr[n]);
                            }
                        }
                
                        nameSplitArr = namesplittrim.slice(0, -1);
                        var newName = nameSplitArr.join('_');                     
                
                        if(guidescbenabled == true && customInputs == false){
                            selectedComps[x].name = newName;
                            for(var z = 0; z <= guideList.length; z++){
                                var currlayer = selectedComps[x].layer(guideList[z]);
                                if(currlayer){
                                    currlayer.remove();
                                }
                            }
                            if(selectedComps[x].layer("XAV frame counter info")){
                                currlayer = selectedComps[x].layer("XAV frame counter info");
                                currlayer.name = "XAV frame counter info";  
                            }else{
                                currlayer = selectedComps[x].layers.addText("temp text");
                                currlayer.name = "XAV frame counter info";  
                            }
                            currlayer.transform.position.setValue([infoTextOffsetX, infoTextOffsetY]); 

                            if(mattename != " "){   
                                if(selectedComps[x].layer(Matteimport.name)){
                                    matteLayer = selectedComps[x].layer(Matteimport.name);
                                    matteLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                                    matteLayer.guideLayer = true; 
                                }else{
                                    matteLayer = selectedComps[x].layers.add(Matteimport);
                                    matteLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                                    matteLayer.guideLayer = true; 
                                }
                                if(selectedComps[x].layer(Chartimport.name)){
                                    chartLayer = selectedComps[x].layer(Chartimport.name);
                                    chartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                                }else{
                                    chartLayer = selectedComps[x].layers.add(Chartimport);
                                    chartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                                }

                                if(chartnameHD != " "){
                                    if(selectedComps[x].layer(HDchartimport.name)){
                                        HDchartLayer = selectedComps[x].layer(HDchartimport.name);
                                        HDchartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                                    }else{
                                        HDchartLayer = selectedComps[x].layers.add(HDchartimport);
                                        HDchartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                                    }
                                    HDchartLayer.property("Opacity").setValue(50);
                                    HDchartLayer.guideLayer = true;
                                }

                            }
                            else{
                                if(selectedComps[x].layer(Chartimport.name)){
                                    chartLayer = selectedComps[x].layer(Chartimport.name);
                                    chartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                                }else{
                                    chartLayer = selectedComps[x].layers.add(Chartimport);
                                    chartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                                }

                                if(chartnameHD != " "){
                                    if(selectedComps[x].layer(HDchartimport.name)){
                                        HDchartLayer = selectedComps[x].layer(HDchartimport.name);
                                        HDchartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                                    }else{
                                        HDchartLayer = selectedComps[x].layers.add(HDchartimport);
                                        HDchartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
                                    }
                                    HDchartLayer.property("Opacity").setValue(50);
                                    HDchartLayer.guideLayer = true;
                                }
                            }              
                            chartLayer.property("Opacity").setValue(50);
                            chartLayer.guideLayer = true;
                            currlayer.moveBefore(selectedComps[x].layer(1));
                            var mainTextDocument = currlayer.property("ADBE Text Properties").property("ADBE Text Document");
                            var textDocument1 = mainTextDocument.value;
                            textDocument1.resetCharStyle();
                            textDocument1.fontSize = 12;   
                            textDocument1.fillColor = [1, 1, 1];
                            textDocument1.font = systemFont;
                            textDocument1.text = "";
                            textDocument1.justification = textAlignment;
                            mainTextDocument.setValue(textDocument1);
                            var textLayerPosExpression = "[" + infoTextOffsetX + "," + infoTextOffsetY + "];";
                            currlayer.transform.position.expression = textLayerPosExpression;
                            var textLayerExpression = " thisComp.name + \"   \"  + timeToCurrentFormat(time) + \"   FPS: \" + (1.0 / thisComp.frameDuration).toFixed(3);";
                            currlayer.sourceText.expression = textLayerExpression;
                        } else {
                            selectedComps[x].name = newName;
                            for(var z = 0; z <= guideList.length; z++){
                                var currlayer = selectedComps[x].layer(guideList[z]);
                                if(currlayer){
                                    currlayer.remove();
                                }
                            }
                            if(selectedComps[x].layer("XAV frame counter info")){
                                currlayer = selectedComps[x].layer("XAV frame counter info");
                                currlayer.remove();  
                            }
                        }
                    }
                    offsetnull.remove();
                    for (var u = 1; u < app.project.numItems; u++){
                        if (app.project.item(u).name == "XAVoffset"){
                            app.project.item(u).remove();
                        }
                    }
                }  
                progressBar.value = 0;
            }else{
                alert("Please select a composition from the project window.");
            }
        progressBar.value = 0;
        app.endUndoGroup();
    }

    function conformLayerToCompSize(){
        app.beginUndoGroup(XAVToolboxData.scriptName);
            var everyItem = app.project.items;
            var item;
            if(app.project.activeItem == false){
                alert("Select the layers to conform.");
            }else{
                item = app.project.activeItem;
            }
            if (item instanceof CompItem){
                var curComp = item;
                for (var j = 1; j <= curComp.numLayers; j++){

                    var curLayer = curComp.layer(j);

                    if((curComp.layer(j).nullLayer) &&(curComp.layer(j).selected)){
                        // alert("NO SELECTING NULL'S DUMMY!");
                    }
                    else if(curComp.layer(j).nullLayer){
                        // alert("A NULL IS IN THE COMP!");
                    }
                    else {
                        if (curLayer instanceof AVLayer) {
                            if ((curLayer.selected) && (curLayer.source.mainSource instanceof SolidSource)){
                                // alert(curLayer.name);
                                curLayer.source.width = curComp.width;
                                curLayer.source.height = curComp.height;
                            }
                        }
                    }
                }
            }
        app.endUndoGroup();
    } 
    
////CHECKERS FUNCTIONS////////

    function itemCheck(newchartname){
        var itemMatch;
        var itemMatchArr = new Array();
        for (var i = 1; i < app.project.numItems; i++){
            var itemName = app.project.item(i).name;
            var itemobject = app.project.item(i);
            if (newchartname == itemName){
                itemMatchArr.push(itemobject);
            }
        }
        if(itemMatchArr <= 0){
            var imagesFolder = getFolderByName("Images");
            var chartFile = scriptPath + "/XAVToolbox_Assets/ImageResources/" + newchartname;
            var chart = new File(chartFile);
            Chartimport = app.project.importFile(new ImportOptions(chart));
            Chartimport.parentFolder = imagesFolder;
        }else{
            Chartimport = itemMatchArr[0];
        }
    }
    function HDChartCheck(newchartname){
        var itemMatch;
        var itemMatchArr = new Array();
        for (var i = 1; i < app.project.numItems; i++){
            var itemName = app.project.item(i).name;
            var itemobject = app.project.item(i);
            if (newchartname == itemName){
                itemMatchArr.push(itemobject);
            }
        }
        if(itemMatchArr <= 0){
            var imagesFolder = getFolderByName("Images");
            var chartFile = scriptPath + "/XAVToolbox_Assets/ImageResources/" + newchartname;
            var chart = new File(chartFile);
            HDchartimport = app.project.importFile(new ImportOptions(chart));
            HDchartimport.parentFolder = imagesFolder;
        }else{
            HDchartimport = itemMatchArr[0];
        }
    }
    function matteCheck(newmattename){
        var itemMatch;
        var itemMatchArr = new Array();
        for (var i = 1; i < app.project.numItems; i++){
            var itemName = app.project.item(i).name;
            var itemobject = app.project.item(i);
            if (newmattename == itemName){
                itemMatchArr.push(itemobject);
            }
        }
        if(itemMatchArr.length <= 0){
            var imagesFolder = getFolderByName("Images");
            var matteFile = scriptPath + "/XAVToolbox_Assets/ImageResources/" + newmattename;
            var matte = new File(matteFile);
            Matteimport = app.project.importFile(new ImportOptions(matte));  
            Matteimport.parentFolder = imagesFolder;
            
        }else{
            Matteimport = itemMatchArr[0];
        }
    }
    function MakeChecker() {
        app.beginUndoGroup(XAVToolboxData.scriptName);
            var selectedItems = new Array();
            frameNum = parseFloat(this.parent.parent.cmds1.frameField.text);
            selectionName = dd.selection.toString();
            var selectedComps = new Array();
            for (var x = 1; x <= app.project.numItems; x++){
                if (app.project.item(x).selected){
                    selectedComps.push(app.project.item(x));    
                }
            }
            while(progressBar.value < 100) {
               progressBar.value++; 
               $.sleep(2);
            }
            for (var i = 0; i <= selectedComps.length - 1; i++){                    
                mainComp = selectedComps[i];
                if(dd.selection.index == 0){
                    chartname = "UHD_chart.psd";
                    Matteimport = " ";
                    itemCheck(chartname);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 3840, 2160, 1920, 17, "", ParagraphJustification.CENTER_JUSTIFY, "CKR_UHD_", 3825, 17, ParagraphJustification.RIGHT_JUSTIFY, 3825, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }
                if(dd.selection.index == 1){
                    chartname = "240_chart.psd";
                    // mattename = "240_matte.png";
                    Matteimport = " ";
                    chartnameHD = "HD_chart.psd";
                    itemCheck(chartname);
                    HDChartCheck(chartnameHD);
                    // matteCheck(mattename);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1920, 1080, 960, 17, "", ParagraphJustification.CENTER_JUSTIFY, "CKR_240_", 1906, 17, ParagraphJustification.RIGHT_JUSTIFY, 1906, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }
                if(dd.selection.index == 2){
                    chartname = "235_chart.psd";
                    // mattename = "235_matte.png";
                    Matteimport = " ";
                    chartnameHD = "HD_chart.psd";
                    itemCheck(chartname);
                    HDChartCheck(chartnameHD);
                    // matteCheck(mattename);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1920, 1080, 960, 17, "", ParagraphJustification.CENTER_JUSTIFY, "CKR_235_", 1906, 17, ParagraphJustification.RIGHT_JUSTIFY, 1906, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }
                if(dd.selection.index == 3){
                    chartname = "210_chart.psd";
                    // mattename = "210_matte.png";
                    Matteimport = " ";
                    chartnameHD = "HD_chart.psd";
                    itemCheck(chartname);
                    HDChartCheck(chartnameHD);
                    // matteCheck(mattename);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1920, 1080, 960, 17, "", ParagraphJustification.CENTER_JUSTIFY, "CKR_210_", 1906, 17, ParagraphJustification.RIGHT_JUSTIFY, 1906, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }
                if(dd.selection.index == 4){
                    chartname = "185_chart.psd";
                    // mattename = "185_matte.png";
                    Matteimport = " ";
                    chartnameHD = "HD_chart.psd";
                    itemCheck(chartname);
                    HDChartCheck(chartnameHD);
                    // matteCheck(mattename);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1920, 1080, 960, 17, "", ParagraphJustification.CENTER_JUSTIFY, "CKR_185_", 1906, 17, ParagraphJustification.RIGHT_JUSTIFY, 1906, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }
                if(dd.selection.index == 5){
                    chartname = "HD_chart.psd";
                    Matteimport = " ";
                    itemCheck(chartname);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1920 , 1080, 960, 17, "", ParagraphJustification.CENTER_JUSTIFY, "CKR_HD_", 1906, 17, ParagraphJustification.RIGHT_JUSTIFY, 1906, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }
                if(dd.selection.index == 6){
                    chartname = "HD1020_chart.psd";
                    // mattename = "HD1020_matte.png";
                    Matteimport = " ";
                    itemCheck(chartname);
                    // matteCheck(mattename);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1920, 1080, 960, 17, "'\\n'", ParagraphJustification.LEFT_JUSTIFY, "CKR_HD1020_", 1996, 17, ParagraphJustification.RIGHT_JUSTIFY, 1986, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }  
                if(dd.selection.index == 7){
                    chartname = "NetflixProductSafe_chart.psd";
                    // mattename = "NetflixProductSafe_matte.png";
                    Matteimport = " ";
                    itemCheck(chartname);
                    // matteCheck(mattename);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1920, 1080, 960, 17, "'\\n'", ParagraphJustification.LEFT_JUSTIFY, "CKR_16x9NPS_", 1986, 17, ParagraphJustification.RIGHT_JUSTIFY, 1986, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }
                if(dd.selection.index == 8){
                    chartname = "9x16_chart.psd";
                    Matteimport = " ";
                    chartnameHD = " ";
                    itemCheck(chartname);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1080, 1920, 14, 17, "'\\n'", ParagraphJustification.LEFT_JUSTIFY, "CKR_9x16_", 1061, 17, ParagraphJustification.RIGHT_JUSTIFY, 1061, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }
                if(dd.selection.index == 9){
                    chartname = "TikTokSafe_chart.psd";
                    // mattename = "9x16TT_matte.png";
                    Matteimport = " ";
                    chartnameHD = " ";
                    itemCheck(chartname);
                    // matteCheck(mattename);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1080, 1920, 14, 17, "'\\n'", ParagraphJustification.LEFT_JUSTIFY, "CKR_9x16TT_IF_", 1061, 17, ParagraphJustification.RIGHT_JUSTIFY, 1061, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }
                if(dd.selection.index == 10){
                    chartname = "TikTokSafe_1242x2208_chart.png";
                    // mattename = "9x16TT_1242x2208_matte.png";
                    Matteimport = " ";
                    chartnameHD = " ";
                    itemCheck(chartname);
                    matteCheck(mattename);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1080, 1920, 14, 17, "'\\n'", ParagraphJustification.LEFT_JUSTIFY, "CKR_9x16TT_TO_", 1222, 17, ParagraphJustification.RIGHT_JUSTIFY, 1222, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }
                if(dd.selection.index == 11){
                    chartname = "TikTokTopView_chart.png";
                    // mattename = "9x16TT_1242x2208_matte.png";
                    Matteimport = " ";
                    chartnameHD = " ";
                    itemCheck(chartname);
                    // matteCheck(mattename);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1080, 1920, 14, 17, "'\\n'", ParagraphJustification.LEFT_JUSTIFY, "CKR_9x16TT_TD_", 1222, 17, ParagraphJustification.RIGHT_JUSTIFY, 1222, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }
                if(dd.selection.index == 12){
                    chartname = "4x5_chart.psd";
                    Matteimport = " ";
                    chartnameHD = " ";
                    itemCheck(chartname);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1080, 1350, 14, 17, "'\\n'", ParagraphJustification.LEFT_JUSTIFY, "CKR_4x5_", 1061, 17, ParagraphJustification.RIGHT_JUSTIFY, 1061, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }
                if(dd.selection.index == 13){
                    chartname = "1x1_chart.psd";
                    // mattename = "1x1_matte.png";
                    Matteimport = " ";
                    chartnameHD = " ";
                    itemCheck(chartname);
                    // matteCheck(mattename);
                    BuildChecker(i, Chartimport, HDchartimport, Matteimport, 1080, 1080, 14, 17, "'\\n'", ParagraphJustification.LEFT_JUSTIFY, "CKR_1x1_", 1061, 17, ParagraphJustification.RIGHT_JUSTIFY, 1061, 31, ParagraphJustification.RIGHT_JUSTIFY);
                }  
            }
            progressBar.value = 0;                
            selectedItems.clear();
        app.endUndoGroup();
    }

    function RenderCheckers(){
        while (app.project.renderQueue.numItems > 0){
            app.project.renderQueue.item(app.project.renderQueue.numItems).remove();
        }
        var selectedComps = new Array();
        var outputFileNames = new Array();
        var outputFiles = new Array();
        var OutputPath = decodeURI(Folder.selectDialog("Select output path", undefined, true));
        var emailPaths = new Array();
        for (var x = 1; x <= app.project.numItems; x++){
            if (app.project.item(x).selected){
                selectedComps.push(app.project.item(x));  
            }
        }
        for(var i = 0; i <= selectedComps.length - 1; i++){
            AddToRenderQueue(selectedComps[i], OutputPath);
            var fileName = selectedComps[i].name + ".png";
            var filePath = OutputPath + "/" + selectedComps[i].name + ".png00000";
            outputFileNames.push(fileName);
            outputFiles.push(filePath);
            app.project.renderQueue.item(i + 1).setSettings( thumbnail_renderSettings );
            app.project.renderQueue.render();
        }
        for(var i = 0; i <= outputFiles.length - 1; i++){
            var newFile = new File(outputFiles[i]);
            newFile.rename(outputFileNames[i]);
            emailPaths.push(newFile);
        }        
        emailConfirmation(emailPaths);
    }

    function emailConfirmation(arr) {
        var itemArr = parseBuildOptionsToArr();
        var emailAddress = itemArr[5];
        var messageStr = "Please review these checkers: \n";
        if(emailAddress != ""){
            for(var i = 0; i <= arr.length - 1; i++){
                messageStr += arr[i].fsName + "\n";
            }     
            // var command = "echo " + messageStr + " | mail -s 'Checkers for review' '" + emailAddress + "'";
            // var command = "echo '" + messageStr + "' | mail -s 'Checkers for review' '" + emailAddress + "'";
            var command = "echo '" + messageStr + "' | mail -s 'Checkers for review' dan@modeselect.net, board-957681303@projectxav-team.monday.com ";
            system.callSystem(command);
            // alert("Email sent to: " + emailAddress);
        }
    }

    function AddToRenderQueue(comp, renderFilePath){
        var item = app.project.renderQueue.items.add(comp);
        var outputModule = item.outputModule(1);               
        outputModule.applyTemplate("X_pngRGB");
        var outputname = comp.name;
        var separator = "/";
        outputModule.file = File(renderFilePath + separator + outputname);
    }

    function BuildChecker(numberid, newchart, newhdchart, newmatte, sizeX, sizeY, offsetX, offsetY, linereturn, textalignment, nameprefix, ltx, lty, lta, stx, sty, sta){
        var prefixsplitArr = nameprefix.split('_');
        var prefixShort = prefixsplitArr[0];
        var checkerComp = app.project.items.addComp(nameprefix + "0" + (numberid + 1) + "_" +  mainComp.name, sizeX, sizeY, 1, mainComp.duration, mainComp.frameRate);
        var socialCompName = nameprefix + "replacewithyoursocials";
        var legalCompName = nameprefix + "replacewithyourlegals";
        var socialComp = null;
        var legalComp = null;
        for(var i = 1; i <= app.project.numItems; i++){
            if(app.project.item(i).name == socialCompName){
                socialComp = app.project.item(i);
            }
            if(app.project.item(i).name == legalCompName){
                legalComp = app.project.item(i);
            }
        }
        if(socialComp == null){
            socialComp = app.project.items.addComp(nameprefix + "replacewithyoursocials", sizeX, sizeY, mainComp.pixelAspect, mainComp.duration, mainComp.frameRate);                
        }
        if(legalComp == null){
            legalComp = app.project.items.addComp(nameprefix + "replacewithyourlegals", sizeX, sizeY, mainComp.pixelAspect, mainComp.duration, mainComp.frameRate);
        }
        var renderComp = checkerComp.layers.add(mainComp);
        var legalLayer = checkerComp.layers.add(legalComp);
        var socialLayer = checkerComp.layers.add(socialComp);
        legalLayer.enabled = false;
        socialLayer.enabled = false;
        // if(newmatte != ""){
        //     var matteLayer = checkerComp.layers.add(newmatte);
        //     matteLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
        //     matteLayer.guideLayer = true;
        // }
        var chartLayer = checkerComp.layers.add(newchart);
        chartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
        chartLayer.property("Opacity").setValue(50);
        if(chartnameHD != " "){
            var hdchartLayer = checkerComp.layers.add(newhdchart);
            hdchartLayer.transform.position.expression = "[(thisComp.width / 2),(thisComp.height / 2)];";
            hdchartLayer.property("Opacity").setValue(50);
        }
        checkerComp.time = 0;
        var checkerlayer = checkerComp.layer(mainComp.name);
        socialText = "";
        legalText = "";
        var socialCompText = checkerComp.layers.addText("social");
        socialCompText.enabled = false;
        var legalCompText = checkerComp.layers.addText("legal");
        legalCompText.enabled = false;
        var compInfoText = checkerComp.layers.addText("tmep text");
        compInfoText.enabled = false;
        var mainTextDocument = compInfoText.property("ADBE Text Properties").property("ADBE Text Document")
        var textDocument1 = mainTextDocument.value;
        var mainTextDocument2 = socialCompText.property("ADBE Text Properties").property("ADBE Text Document")
        var textDocument2 = mainTextDocument2.value;
        var mainTextDocument3 = legalCompText.property("ADBE Text Properties").property("ADBE Text Document")
        var textDocument3 = mainTextDocument3.value;
        var PreCompsFolder = getFolderByName("PreComps");
        legalComp.parentFolder = PreCompsFolder;
        socialComp.parentFolder = PreCompsFolder;
        textDocument1.resetCharStyle();
        textDocument1.fontSize = 12;
        textDocument1.fillColor = [1, 1, 1];
        textDocument1.font = systemFont;
        textDocument1.text = checkerText;
        textDocument1.justification = textalignment;
        textDocument2.resetCharStyle();
        textDocument2.fontSize = 12;   
        textDocument2.fillColor = [1, 1, 1];
        textDocument2.font = systemFont;
        textDocument2.text = socialText;
        textDocument2.justification = sta;
        textDocument3.resetCharStyle();
        textDocument3.fontSize = 12;   
        textDocument3.fillColor = [1, 1, 1];
        textDocument3.font = systemFont;
        textDocument3.text = legalText;
        textDocument3.justification = lta;
        mainTextDocument.setValue(textDocument1);
        mainTextDocument2.setValue(textDocument2);
        mainTextDocument3.setValue(textDocument3);
        compInfoText.transform.position.setValue([offsetX, offsetY]);
        compInfoText.opacity.setValue(50);
        compInfoText.name = "comp filename";
        socialCompText.transform.position.setValue([stx, sty]);
        socialCompText.opacity.setValue(50);
        socialCompText.name = "social filename";
        legalCompText.transform.position.setValue([ltx, lty]);
        legalCompText.opacity.setValue(50);
        legalCompText.name = "legal filename";
        var textLayerPosExpression = "[" + offsetX + "," + offsetY + "];";
        var sLayerPosExpression = "[" + ltx + "," + lty + "];";
        var lLayerPosExpression = "[" + stx + "," + sty + "];";
        compInfoText.transform.position.expression = textLayerPosExpression;
        var textLayerExpression = "Date(0).toUpperCase() + \"" + linereturn + "   FILENAME: \" + thisComp.layer(thisComp.numLayers).name + \"    CHECKER GENERATED AT FRAME: \" +  timeToCurrentFormat(thisComp.layer(" + '"' + mainComp.name + '"' + ").timeRemap.valueAtTime(0)) +  \"      FPS: \" + (1.0 / thisComp.frameDuration).toFixed(3);";
        compInfoText.sourceText.expression = textLayerExpression;
        var socialLayerExpression = "" + '"' + "SOCIAL:" + '"' + " + thisComp.layer(" + '"' + socialComp.name + '"' + ").name.toUpperCase()";
        socialCompText.sourceText.expression = socialLayerExpression;
        socialCompText.transform.position.expression = sLayerPosExpression;
        var legalLayerExpression = "" + '"' + "LEGAL LINE:" + '"' + " + thisComp.layer(" + '"' + legalComp.name + '"' + ").name.toUpperCase()";
        legalCompText.sourceText.expression = legalLayerExpression;
        legalCompText.transform.position.expression = lLayerPosExpression;
        checkerlayer.timeRemapEnabled = true;
        var timeRemapProp = checkerlayer.property("ADBE Time Remapping");
        var times = 0;
        var frameNumInSec = frameNum / checkerComp.frameRate;
        var values = frameNumInSec;
        timeRemapProp.setValueAtTime(times, values);
        timeRemapProp.setValueAtTime(checkerComp.duration, values);
        app.project.timeDisplayType = TimeDisplayType.FRAMES;
        app.project.footageTimecodeDisplayStartType = FootageTimecodeDisplayStartType.FTCS_USE_SOURCE_MEDIA;
        colorLabel(checkerComp.name, 14);
    }

////COVER FUNCTIONS////////

    function MakeCover(){
        app.beginUndoGroup(XAVToolboxData.scriptName);
        while(progressBar.value < 100) {
           progressBar.value++; 
           $.sleep(2);
        }
        deselectAll();
        var lineoneInput = this.parent.parent.cmds1.toplineField.text;
        var linetwoInput = this.parent.parent.cmds1.bottomlineField.text;
        var dateInput = this.parent.parent.cmds2.dateField.text;
        var spotInput = this.parent.parent.cmds2.spotField.text;
        var OutputPath;
        getCheckerFormat();
        var importOptions = new ImportOptions();
        var filePath = scriptPath + "/XAVToolbox_Assets/ImageResources/" + CPname;
        importOptions.file = new File(filePath);
        importOptions.sequence = false;
        if (importOptions.canImportAs(ImportAsType.COMP)) {
            importOptions.importAs = ImportAsType.COMP;
        }
        var importedFile = app.project.importFile(importOptions);
        var buildOptions = parseBuildOptionsToArr();
        var imagesFolder = getFolderByName(buildOptions[3]);
        var splitArr = CPname.split('.');
        var importedFolderName = splitArr[0] + " Layers";
        var importedFolder = getFolderByName(importedFolderName);
        importedFolder.parentFolder = imagesFolder;
        app.endUndoGroup();
        coverText(lineoneInput, linetwoInput, dateInput, spotInput, matteTypeName, OutputPath);
        colorLabel(cpCompName, 14);
        moveToRoot(cpCompName);
        progressBar.value = 0;
    }

    function coverText(lonein, ltwoin, datein, spotin, mattetype, renderFilePath){
            app.beginUndoGroup(XAVToolboxData.scriptName);
            getCompByName(cpCompName);
            var cpComp;
            for(var i = 1; i <= app.project.numItems; i++){
                if(app.project.item(i).selected){
                    cpComp = app.project.item(i);
                }
            }            
            var convertList = new Array();
            convertList.push(cpComp.layer(1));
            convertList.push(cpComp.layer(2));
            convertList.push(cpComp.layer(3));
            convertList.push(cpComp.layer(4));
            convertList.push(cpComp.layer(9));
            for(var i = 0; i <= convertList.length - 1; i++){
                    convertList[i].selected = true;
            }
            cpComp.openInViewer();
            app.executeCommand(3799);            
            var lineoneLayer = cpComp.layer(1);
            var linetwoLayer = cpComp.layer(2);
            var dateLayer = cpComp.layer(3);
            var spotNameLayer = cpComp.layer(4);
            var matteTypeLayer = cpComp.layer(9);
            var lonetextDocument = new TextDocument(lonein);
            lineoneLayer.property("Source Text").setValue(lonetextDocument);
            var ltwotextDocument = new TextDocument(ltwoin);
            linetwoLayer.property("Source Text").setValue(ltwotextDocument);
            var datetextDocument = new TextDocument(datein);
            dateLayer.property("Source Text").setValue(datetextDocument);
            var spottextDocument = new TextDocument(spotin);
            spotNameLayer.property("Source Text").setValue(spottextDocument);
            var mattetextDocument = new TextDocument(mattetype);
            matteTypeLayer.property("Source Text").setValue(mattetextDocument);
            if(lonein == "Top line..."){
                lineoneLayer.enabled = false;
                lonein = "";
            }
            if(ltwoin == "Bottom line..."){
                linetwoLayer.enabled = false;
                ltwoin = "";
            }
            cpComp.name = cpComp.name + "_" + lonein + ltwoin;
            cpCompName = cpComp.name;
            app.endUndoGroup();
            if(addRender == true){
                AddToRenderQueue(cpComp, renderFilePath);
                app.project.renderQueue.item(1).setSettings( thumbnail_renderSettings );
                var pngStill = {
                   "Output Info" : "Single Frame",
                };
                app.project.renderQueue.item(1).outputModule(1).setSettings( pngStill );
            }

    }

////COLLECT AEP FUNCTION///////

    function AEPCollect(){
        var dlg = new Window( "dialog", "Collect Options" );
        dlg.btnPnl = dlg.add( "panel", undefined,);
        dlg.btnPnl.orientation = "row";
        dlg.alignment = ["center", "center"];
        dlg.btnPnl.AllBtn = dlg.btnPnl.add( "button", undefined, "ALL COMPS");
        dlg.btnPnl.SelectedBtn = dlg.btnPnl.add( "button", undefined, "SELECTED COMPS");
        dlg.btnPnl.CancelBtn = dlg.btnPnl.add( "button", undefined, "CANCEL", { name: "CANCEL" } );
        dlg.btnPnl.AllBtn.onClick = function() { collectAll(); dlg.close();};;
        dlg.btnPnl.SelectedBtn.onClick = function() { collectSelected(); dlg.close();};;
        dlg.show();
    }

    function collectAll(){
        var selectedComps = [];
        for(var i = 1; i <= app.project.numItems; i ++){
            selectedComps.push(app.project.item(i));
        }
        if(selectedComps.length > 0){
            if(app.project.file != null){
                var OutputPath = decodeURI(Folder.selectDialog("Select output path", undefined, true));
                collectAEP(OutputPath, selectedComps);
            } else {
                alert("Please save your project first.");
            }
        }
    }

    function collectSelected(){
        var selectedComps = [];
        for(var i = 1; i <= app.project.numItems; i ++){
            if (app.project.item(i).selected) {
                selectedComps.push(app.project.item(i));
            }
        }
        if(selectedComps.length > 0){
            if(app.project.file != null){
                var OutputPath = decodeURI(Folder.selectDialog("Select output path", undefined, true));
                collectAEP(OutputPath, selectedComps);
            } else {
                alert("Please save your project first.");
            }
        } else {
            alert("Please select a comps from the project window.");
        }
    }

    function collectAEP(outputPath, selectionComps){       
        while(progressBar.value < 100) {
           progressBar.value++; 
           $.sleep(4);
        }
        app.beginUndoGroup(XAVToolboxData.scriptName);
        var projectName = app.project.file.fsName;
        var projectNameArr = projectName.split('.');
        var AEPCollectName = projectNameArr[0] + "_Collect.aep";
        var AEPOutputPath = projectNameArr[0] + "_Collect";
        var projNameClipArr = projectNameArr[0].split('/');
        var AEPOutputDir = outputPath + "/" + (projNameClipArr[projNameClipArr.length -1]) + "_Collect";
        var AEProjectDest = outputPath + "/" + (projNameClipArr[projNameClipArr.length -1]) + "_Collect/" + (projNameClipArr[projNameClipArr.length -1]) + "_Collect.aep";
        var orig = new File(app.project.file.fsName);
        app.project.reduceProject(selectionComps);
        var collectdir = Folder(AEPOutputDir);
        var collectdirstr = AEPOutputDir;
        var footagedir = Folder(AEPOutputDir + "/Footage");
        var footagedirstr = AEPOutputDir + "/Footage";
            if(!collectdir.exists){
                var newCollect = collectdir.create();
            }
            if(!footagedir.exists){
                var newFootageFolder = footagedir.create();
            }
            for (i=1; i<=app.project.items.length; i++) {
                if (app.project.item(i) instanceof FootageItem && app.project.item(i).file != null)  {
                    var filename = app.project.item(i).file.name;
                    var file = new File(app.project.item(i).file.fsName);
                    file.copy(footagedirstr + "/" + filename);
                    var newfilelocation = new File(footagedirstr + "/" + filename);
                    app.project.item(i).replace(newfilelocation);
                }
            }
        app.project.save(File(AEProjectDest));
        app.open(orig);
        progressBar.value = 0;
    }

////CLEAN PROJECT FUNCTION - ONCLICK BUTTON ACTION///////

    function reduceProject() {
        while(progressBar.value < 100) {
           progressBar.value++; 
           $.sleep(2);
        }
        app.beginUndoGroup(XAVToolboxData.scriptName);

        var selectedItems = [];        
        for (var i = 1; i <= app.project.numItems; i++) {
            if (app.project.item(i).selected) {
                selectedItems.push(app.project.item(i));
            }
        }

        if(selectedItems.length > 0){
            var redint = app.project.reduceProject(selectedItems);
            removeItems();
        } else {
            // removeItems();
            app.project.removeUnusedFootage();
        }
        selectedItems = [];
        app.endUndoGroup();
        progressBar.value = 0;
    }

    function removeItems(){
        var comps = new Array();
        var items = new Array();
        var itemName;
        for(var i = 1; i <= app.project.numItems; i++){
            itemName = app.project.item(i).name;
            if(app.project.item(i) instanceof CompItem){
                comps.push(app.project.item(i));
            }
            if(app.project.item(i) instanceof FootageItem){
                items.push(app.project.item(i));
            }
        }
        searchComps(comps, items);
        // deleteItems();
    }

    function searchComps(comps, items){
        var thisComp;
        var thisLayer;
        var layerCol = [];
        for(var i = 0; i <= comps.length; i++){
            layerCol = comps[i].layers;
            for(var x = 0; x <= layerCol.length; x++){
                // thisLayer = ;
                // for(var z = items.length; z >= 0; z--){
                //     if(thisLayer == items[z]){
                //         alert("REMOVE");
                //         thisLayer.comment = "REMOVE";
                //     }
                // }
            }       
        }
    }

    function deleteItems(){
        for(var i = app.project.numItems; i > 0; i--){
            if(app.project.item(i).typeName == "Footage" && app.proectitem(i).comment != "REMOVE"){
                app.project.item(i).remove();
            }
        }
    }

    function consolidateFiles() {
        while(progressBar.value < 100) {
           progressBar.value++; 
           $.sleep(2);
        }
     
        app.beginUndoGroup(XAVToolboxData.scriptName);
        app.project.consolidateFootage();
       
        app.endUndoGroup();
        progressBar.value = 0;
    }

    function consolidateLikeFiles() {
        while(progressBar.value < 100) {
           progressBar.value++; 
           $.sleep(2);
        }
        app.beginUndoGroup(XAVToolboxData.scriptName);

        removeDuplicates = this.parent.parent.cmds1.consolDups.value;
        var allFiles = [];
        var allFileNames = [];
        for(var i = 1; i <= app.project.numItems; i++){
            if(app.project.item(i) instanceof FootageItem && !app.project.item(i).selected){
                allFiles.push(app.project.item(i));
                allFileNames.push(app.project.item(i).name);
            }
        }
        consolidateDuplicates(allFiles, allFileNames);
        app.project.consolidateFootage();
        app.endUndoGroup();
        progressBar.value = 0;
    }

    function consolidateDuplicates(arr, arrnames){
        function compareFirstNames( a, b ) {
          if ( a.name < b.name ){
            return -1;
          }
          if ( a.name > b.name ){
            return 1;
          }
          return 0;
        }
        arr.sort(compareFirstNames);
        var sorted_arr = new Array();
        var len = arr.length - 2;
        var _tempname;
        var _tempfile;

        for(var i = 0; i <= len; i++){
            if(arr[i].name != _tempname){
                sorted_arr.push(arr[i]);
                _tempname = arr[i].name;
                _tempfile = arr[i].file;
            }
            else{
                arr[i].replace(_tempfile);
            }
        }
    }

////FOLDER FUNCTIONS///////

    function moveFolderToRoot(folders){
        for (var i = 0; i <= folders.length - 1; i++) {
            folders[i].parentFolder = app.project.rootFolder;
            folders[i].label = 11;
        }
    }

    function moveItemsInFolderToRoot(folders){
        for (var i = 0; i <= folders.length - 1; i++) {
            folders[i].parentFolder = app.project.rootFolder;
            folders[i].label = 11;
        }
    }

    function selectAssetsInFolders(){
        for (var i = 1; i <= app.project.numItems; i++) {
            if(app.project.item(i).parentFolder.selected == true){
                app.project.item(i).selected = true;
            }
        }
    }


////XAV BUILD ORGANIZE PROJECT FUNCTION///////

    function XAVorganizeProject() {  

        while(progressBar.value < 100) {
           progressBar.value++; 
           $.sleep(2);
        }

        var itemArr = parseBuildOptionsToArr();
        var selectedFolders = [];
        var selectedItems = [];
        var selectedItemsPaired = [];

       ////PRESERVE SELECTION

        for (var i = 1; i <= app.project.numItems; i++) {
            if (app.project.item(i).selected) {
               selectedFolders.push(app.project.item(i));
            }
        }
        moveFolderToRoot(selectedFolders);
        selectAssetsInFolders();

       ////SEPERATE GET UNSELECTED ITEMS

        for (var i = 1; i <= app.project.numItems; i++) {
            if (!app.project.item(i).selected) {
                selectedItems.push(app.project.item(i));
            }
        }

       ////SEPERATE UNSELECTED ASSETS / FOLDERS

        var tempFolder = getFolderByName("TempFolder");
        for (var i = 0; i <= selectedItems.length; i++) {
                if (selectedItems[i] instanceof FolderItem) {
                    selectedItems[i].parentFolder = tempFolder;
                }
        }
        for (var i = 0; i <= selectedItems.length; i++) {
            if (selectedItems[i] instanceof FootageItem) {
                selectedItems[i].parentFolder = app.project.rootFolder;
            } else if (selectedItems[i] instanceof CompItem) {
                selectedItems[i].parentFolder = app.project.rootFolder;
            }
        }

        tempFolder.remove();

       ////CREATE FOLDERS

        var mastercompFolder = getFolderByName(itemArr[0]);
        var precompFolder = getFolderByName(itemArr[1]);
        var footageFolder = getFolderByName(itemArr[2]);
        var imagesFolder = getFolderByName(itemArr[3]);
        var solidsFolder = getFolderByName(itemArr[4]);
        for (var i = 1; i <= app.project.numItems; i++) {
            if (!app.project.item(i).selected) {
                selectedItemsPaired.push(app.project.item(i));
            }
        }
       ////ORGANIZE PROJECT

        for (var i = 0; i <= selectedItemsPaired.length; i++) {
            if (!(selectedItemsPaired[i] instanceof FolderItem)) {
                if (selectedItemsPaired[i] instanceof CompItem) {
                    if(selectedItemsPaired[i].usedIn.length <= 0){
                        selectedItemsPaired[i].parentFolder = mastercompFolder;
                    }else{
                        selectedItemsPaired[i].parentFolder = precompFolder;
                    }
                } else if (selectedItemsPaired[i] instanceof FootageItem && selectedItemsPaired[i].mainSource instanceof SolidSource) {
                    selectedItemsPaired[i].parentFolder = solidsFolder;
                }
                else if (selectedItemsPaired[i].hasVideo == true && selectedItemsPaired[i].duration != 0) {
                    selectedItemsPaired[i].parentFolder = footageFolder;
                }
                else if (selectedItemsPaired[i] instanceof FootageItem && selectedItemsPaired[i].mainSource.isStill) {
                    selectedItemsPaired[i].parentFolder = imagesFolder;
                }
            }
            progressBar.value = 0;
        }
    }


////DMS BUILD ORGANIZE PROJECT FUNCTION///////

function DMSorganizeProject(){
    var selectedFolders = [];
    var selectedItems = [];
    var userSelectedItems = [];

    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i).selected) {
            userSelectedItems.push(app.project.item(i));
        }
    }

    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof FolderItem) {
            selectedFolders.push(app.project.item(i));
        } else {
            selectedItems.push(app.project.item(i));
        }
    }

   //  //SEPERATE UNSELECTED ASSETS / FOLDERS

    var tempFolder = getFolderByName("TempFolder");
    for (var i = 0; i < selectedFolders.length; i++) {
        selectedFolders[i].parentFolder = tempFolder;
    }
    for (var i = 0; i < selectedItems.length; i++) {
        selectedItems[i].parentFolder = app.project.rootFolder;
    }

    tempFolder.remove();

    selectedItems = [];

    for (var i = 1; i <= app.project.numItems; i++) {
        selectedItems.push(app.project.item(i));
    }

////CREATE FOLDERS///////

    var DMScomps = getFolderByName("1_COMPS");
    var DMSAR = null;
    var DMSprecompAR = null;
    var DMSfootageAR = null;

    if(dmsdd.selection.index == 1){
        DMSAR = getFolderByName("16x9");
        DMSfootageAR = app.project.items.addFolder("16x9");
        DMSprecompAR = app.project.items.addFolder("16x9");
    }
    if(dmsdd.selection.index == 2){
        DMSAR = getFolderByName("9x16");
        DMSfootageAR = app.project.items.addFolder("9x16");
        DMSprecompAR = app.project.items.addFolder("9x16");
    }
    if(dmsdd.selection.index == 3){
        DMSAR = getFolderByName("4x5");
        DMSfootageAR = app.project.items.addFolder("4x5");
        DMSprecompAR = app.project.items.addFolder("4x5");
    }
    if(dmsdd.selection.index == 4){
        DMSAR = getFolderByName("1x1");
        DMSfootageAR = app.project.items.addFolder("1x1");
        DMSprecompAR = app.project.items.addFolder("1x1");
    }

    var DMSprecomps = getFolderByName("2_PRE_COMPS");
    
    var DMSgfx = getFolderByName("3_GFX");
    var DMSmov = getFolderByName("MOV");
    var DMSai = getFolderByName("AI");
    var DMSc4d = getFolderByName("C4D");
    var DMSjpeg = getFolderByName("JPEG");
    var DMStif = getFolderByName("TIF");
    var DMSpng = getFolderByName("PNG");
    var DMSlogos = getFolderByName("LOGOS");
    var DMSpsd = getFolderByName("PSD");
    var DMSsolids = getFolderByName("SOLIDS");

    DMSmov.parentFolder = DMSgfx;
    DMSai.parentFolder = DMSgfx;
    DMSc4d.parentFolder = DMSgfx;
    DMSjpeg.parentFolder = DMSgfx;
    DMSpng.parentFolder = DMSgfx;
    DMStif.parentFolder = DMSgfx;
    DMSlogos.parentFolder = DMSgfx;
    DMSpsd.parentFolder = DMSgfx;
    DMSsolids.parentFolder = DMSgfx;

    var DMSfootage = getFolderByName("4_FOOTAGE");
    DMSAR.parentFolder = DMScomps;
    DMSprecompAR.parentFolder = DMSprecomps;
    DMSfootageAR.parentFolder = DMSfootage;

////ORGANIZE PROJECT///////
    if(dmsdd.selection.index != 0){
        for (var i = 0; i <= selectedItems.length - 1; i++) {

            if (selectedItems[i] instanceof CompItem){
                if(selectedItems[i].usedIn.length <= 0){
                    selectedItems[i].parentFolder = DMSAR;
                } else {
                    selectedItems[i].parentFolder = DMSprecompAR;
                }
            }
          
            if (selectedItems[i].duration != 0) {

                var tempNameArr = selectedItems[i].name.split('.');
                if(tempNameArr[tempNameArr.length-1] == "mov" | tempNameArr[tempNameArr.length-1] == "mp4"){
                    if(selectedItems[i] && selectedItems[i].file){
                        var newpath = selectedItems[i].file.fsName;
                        var arr = newpath.split("\\");
                        for (var x = 0; x <= arr.length - 1; x++) {
                            if(arr[x] == "07_Output"){
                                selectedItems[i].parentFolder = DMSmov;
                            }
                            else if(arr[x] == "06_ToGFX"){
                                selectedItems[i].parentFolder = DMSfootageAR;
                            }
                            else {
                                selectedItems[i].parentFolder = DMSmov;
                            }
                        }
                    }
                }
                else if(tempNameArr[1] == "wav"){
                    selectedItems[i].parentFolder = DMSfootageAR;
                }
                else if(tempNameArr[1] == "aif"){
                    selectedItems[i].parentFolder = DMSfootageAR;
                }
                else if(tempNameArr[1] == "mp3"){
                    selectedItems[i].parentFolder = DMSfootageAR;
                }
                else if(tempNameArr[1] != null){
                    var extname = tempNameArr[tempNameArr.length - 1];
                    var tempFolder = getFolderByName(extname.toUpperCase());
                    tempFolder.parentFolder = DMSgfx;
                    selectedItems[i].parentFolder = tempFolder;
                }
            }
         
            if (selectedItems[i] instanceof FootageItem && selectedItems[i].mainSource.isStill) {
                var tempNameArr = selectedItems[i].name.split('.');
                if(tempNameArr[1] == "png"){
                    selectedItems[i].parentFolder = DMSpng;
                }
                else if(tempNameArr[1] == "ai"){
                    selectedItems[i].parentFolder = DMSai;
                }
                else if(tempNameArr[1] == "psd"){
                    selectedItems[i].parentFolder = DMSpsd;
                }
                else if(tempNameArr[1] == "jpeg"){
                    selectedItems[i].parentFolder = DMSjpeg;
                }
                else if(tempNameArr[1] == "jpg"){
                    selectedItems[i].parentFolder = DMSjpeg;
                }
                else if(tempNameArr[1] == "tif"){
                    selectedItems[i].parentFolder = DMStif;
                }
                else if(tempNameArr[1] == "tiff"){
                    selectedItems[i].parentFolder = DMStif;
                }
                else if(tempNameArr[1] == "c4d"){
                    selectedItems[i].parentFolder = DMSc4d;
                }
                else if(tempNameArr[1] != null){
                    var extname = tempNameArr[tempNameArr.length - 1];
                    var tempFolder = getFolderByName(extname.toUpperCase());
                    tempFolder.parentFolder = DMSgfx;
                    selectedItems[i].parentFolder = tempFolder;
                }
                else{
                    selectedItems[i].parentFolder = DMSgfx;
                }
            }

            if (selectedItems[i] instanceof FootageItem && selectedItems[i].mainSource instanceof SolidSource) {
                selectedItems[i].parentFolder = DMSsolids;
            }
        }
        for (var i = 0; i <= userSelectedItems.length - 1; i++) {
            userSelectedItems[i].parentFolder = DMScomps;
        }
    }

}


////BUILD ORGANIZE FUNCTION///////

    function BuildAndOrganize(){

        app.beginUndoGroup(XAVToolboxData.scriptName);

        if(dmsdd.selection.index == 0){
            // while(progressBar.value < 100) {
            //    progressBar.value++; 
            //    $.sleep(2);
            // }
            XAVorganizeProject();
            // progressBar.value = 0;
        } else {
            while(progressBar.value < 100) {
            progressBar.value++; 
            $.sleep(2);
            }
            DMSorganizeProject();
            progressBar.value = 0;
        }

        app.endUndoGroup();
    }

function checkpathfor(pathid, itempath){
    var id = pathid;
    var arr = itempath.split("\\");
    var bool = false;
    for (var i = 0; i <= arr.length - 1; i++) {
        if(arr[i] == id){
            bool = true;
        }
    }
    return bool;
}

////DUPLICATE///////

    function duplicateComp(){
        // getAllProperties();
        var selectedComps = new Array();
        var compStringArr = new Array();
        var origCompArrName = new Array();
        var primaryComp;
        var primaryDupComp;
        var compDups = new Array();
        var dupFolder;
        var sText = this.parent.parent.cmds1.searchField.text;
        var rText = this.parent.parent.cmds2.replaceField.text;
        selectedPreComps = [];
        for (var x = 1; x <= app.project.numItems; x++){
            if (app.project.item(x).selected){
                selectedComps.push(app.project.item(x));
            }
        }
        for(var i = 0; i <= selectedComps.length - 1; i++){
            primaryComp = selectedComps[i];
            selectedPreComps.push(primaryComp);
        }
        for(var i = 0; i <= selectedPreComps.length - 1; i++){
            compStringArr.push(getPreCompsInComp(selectedPreComps[i]));
        }
        origCompArrName.push(compStringArr[0][0].name);
        primaryDupComp = compStringArr[0][0].duplicate();
        primaryDupComp.name = compStringArr[0][0].name + "_DUP";
        dupFolder = getFolderByName("PreComps");
        compDups.push(primaryDupComp);
        var dupCompArr = new Array();
        var dupCompPairedArr = new Array();
        for(var i = 0; i < compStringArr.length - 1; i++){
            for(var x = 1; x < compStringArr[i].length; x++){
                dupCompArr.push(compStringArr[i]);
                dupCompArr.push(compStringArr[i][x]);
                origCompArrName.push(compStringArr[i][x].name);
                compStringArr.pop(compStringArr[i][x]);
            }
        }

        function compareFirstNames( a, b ) {
          if ( a.name < b.name ){
            return -1;
          }
          if ( a.name > b.name ){
            return 1;
          }
          return 0;
        }
        app.beginUndoGroup(XAVToolboxData.scriptName);
        var sorted_arr = dupCompArr.sort(compareFirstNames);
        var len = sorted_arr.length - 1;
        sorted_arr.sort();
        for (var i = 0; i <= len; i++){
            if(i != len){
                if (sorted_arr[i] != sorted_arr[i + 1]){
                    dupCompPairedArr.push(sorted_arr[i]);
                }
            }
        }
        for(var i = 0; i <= dupCompPairedArr.length - 1; i++){
                var newComp = dupCompPairedArr[i].duplicate();
                newComp.name = dupCompPairedArr[i].name + "_DUP";
                newComp.parentFolder = dupFolder;
                compDups.push(newComp);
        }
        replaceComps(origCompArrName, primaryDupComp, compDups);
        var newFolderIter = 0;
        for(var i = 0; i <= compDups.length - 1; i++){
            compDups[i].selected = true;
            var dupNameArr = compDups[i].name.split('_DUP');
            compDups[i].name = dupNameArr[0];
            
            var lastCharStr =compDups[i].name.slice(-1);
            var frontStr = compDups[i].name.substring(0, compDups[i].name.length - 1);

            if(lastCharStr.match(/^[0-9]+$/) != null){
                var newiter = parseInt(lastCharStr) + 1;
                newFolderIter = parseInt(primaryComp.name.slice(-1)) + 1;
                var nameCompStr = frontStr + newiter;
                compDups[i].name = nameCompStr;
                compDups[i].selected = false;
            } else {
                compDups[i].name += "_01";
                compDups[i].selected = false;
            }
            compDups[0].selected = true;
        }
        
        primaryComp.selected = false;

        app.endUndoGroup();
        if(ddsr.selection.index == 0){    
            searchreplace(sText, rText);
        }
        if(ddsr.selection.index == 1){   
            addPrefix(sText);
        }
        if(ddsr.selection.index == 2){    
            addSuffix(sText);
        }   

        alert("Done");
    }

    function getPreCompsInComp(searchComp){
        var layerCollection = searchComp.layers;
        for (var x = 1; x <= layerCollection.length; x++){
            var layerItem = layerCollection[x].source;
            if (layerItem instanceof CompItem){
                selectedPreComps.push(layerItem);
            }
        }
        return selectedPreComps;
    }

    function replaceComps(originCompNames, primaryDupComp, dups){
        for(var i = 0; i <= dups.length - 1; i++){
            var layerCollection = dups[i].layers;
            for (var x = 1; x <= layerCollection.length; x++){
                var layerItem = layerCollection[x].source;
                if (layerItem instanceof CompItem){
                    for(var b = 0; b <= originCompNames.length; b++){
                        if(originCompNames[b] == layerItem.name){
                            var replaceComp = compByName(layerItem.name + "_DUP");
                            layerCollection[x].replaceSource(replaceComp, false);
                        }
                    }   
                }
            }
        }
    }


    // function processProperty(theProp){
    //     if (theProp.propertyType == PropertyType.PROPERTY){
    //         alert(theProp.name);
    //         // $.writeln(theProp.name);
    //     }else{
    //         // must be a group
    //         for (var i = 1; i <= theProp.numProperties; i++){
    //             processProperty(theProp.property(i));
    //         }
    //     }
    //     // alert(theProp.name);
    // }
    
    // function getAllProperties(){
    //     var myLayer = app.project.activeItem.layer(1);
    //     processProperty(myLayer);
    //     // for(i = 0; i <= propArr.length; i++){
    //     //     alert(propArr(i).name);
    //     // }
    // }

    function compByName(compName){
        var foundComp;
        for (var x = 1; x <= app.project.numItems; x++){
            if (app.project.item(x).name == compName){
                 foundComp  = app.project.item(x);       
            }
        }
        return foundComp
    }


////SEARCH AND REPLACE///////

function searchAndReplace(){
    var sText = this.parent.parent.cmds1.searchField.text;
    var rText = this.parent.parent.cmds2.replaceField.text;
    if(ddsr.selection.index == 0){    
        searchreplace(sText, rText);
    }
    if(ddsr.selection.index == 1){   
        addPrefix(sText);
    }
    if(ddsr.selection.index == 2){    
        addSuffix(sText);
    }
    if(ddsr.selection.index == 3){    
        numberText();
    }
    if(ddsr.selection.index == 4){    
        removeText(sText);
    }
}

function searchreplace(s, r){
    app.beginUndoGroup(XAVToolboxData.scriptName);
    var selectedItems = [];
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i).selected) {
            selectedItems.push(app.project.item(i));
        }
    }
    for (var i = 0; i <= selectedItems.length - 1; i++) {
        var newname = selectedItems[i].name.replaceAll(s, r);
        selectedItems[i].name = newname;
    }

    app.endUndoGroup();
}

String.prototype.replaceAll = function (search, replacement){
    var  target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function addPrefix(s){
    app.beginUndoGroup(XAVToolboxData.scriptName);
    var selectedItems = [];
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i).selected) {
            selectedItems.push(app.project.item(i));
        }
    }
    for (var i = 0; i <= selectedItems.length; i++) {
        selectedItems[i].name = s + selectedItems[i].name;
    }
    app.endUndoGroup();
}

function addSuffix(s){
    app.beginUndoGroup(XAVToolboxData.scriptName);
    var selectedItems = [];
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i).selected) {
            selectedItems.push(app.project.item(i));
        }
    }
    for (var i = 0; i <= selectedItems.length; i++) {
        selectedItems[i].name = selectedItems[i].name + s;
    }
    app.endUndoGroup();
}


function numberText(){
    app.beginUndoGroup(XAVToolboxData.scriptName);
    var selectedItems = app.project.selection;
    // for (var i = 1; i <= app.project.numItems; i++) {
    //     if (app.project.item(i).selected) {
    //         selectedItems.push(app.project.item(i));
    //     }
    // }    
    for (var i = 0; i <= selectedItems.length; i++) {
        selectedItems[i].name = selectedItems[i].name + "_00" + (i + 1);
    }
    app.endUndoGroup();
}

function removeText(s){
    app.beginUndoGroup(XAVToolboxData.scriptName);

    var selectedItems = [];
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i).selected) {
            selectedItems.push(app.project.item(i));
        }
    }
    for (var i = 0; i <= selectedItems.length - 1; i++) {
        var newname = selectedItems[i].name.replaceAll(s, "");
        selectedItems[i].name = newname;
    }

    app.endUndoGroup();
}


////IMPORT SOURCE FILES FROM INPUT TEXT PATHS - ONCLICK BUTTON ACTION///////

    function importFilesFromPaths() {
        while(progressBar.value < 100) {
           progressBar.value++; 
           $.sleep(2);
        }
        var projectPaths = this.parent.textField.text;
        var projectFileStrip = projectPaths.replaceAll("file:///", "");
        var projectPathsSplit = projectFileStrip.split(' ').join('%20');
        var projectPathsArr = projectPathsSplit.split("\n");
        for (var i = 0; i < projectPathsArr.length; i++) {
            if(systemMac){
                var flipslash = projectPathsArr[i].replaceAll("\\\\", "/");
                var macpath = flipslash.replaceAll("10.1.0.6", "Volumes");
                var newFile = new File(encodeURI(macpath));
                var newImport = app.project.importFile(new ImportOptions(newFile));
            }
            else{
                var flipslash = projectPathsArr[i].replaceAll("/", "\\\\");
                var pcpathfixprefix = flipslash.replaceAll("Volumes", "\\\\10.1.0.6");
                var newFile = new File(decodeURI(pcpathfixprefix));
                var newImport = app.project.importFile(new ImportOptions(newFile));
            
            }
        }
        progressBar.value = 0;
    }

////IMPORT AE PROJECTS FROM REF - ONCLICK BUTTON ACTION///////

    function importSourceProjectsFromRef() {

        var importedProjectArr = [];
        var importedProjectFolderTarget = getFolderByName("ImportedProjects");
        var importedCompsFolderTarget = getFolderByName("ImportedComps");
        var aeppathList = SearchMetaData("creatorAtom:fullPath", ".aep", "AEP");
        var filenameList = SearchMetaData("filePath", ".mov", "FileName");
        var aeppathListArr;
        var metadata;

        if(systemMac){
            aeppathListArr = aeppathList.split("\n");
            metadata = filenameList + '\n\n' + aeppathList;
        }
        else{
            var flipslash = aeppathList.replaceAll("/", "\\");
            var pcpath = flipslash.replaceAll("Volumes", "\\10.1.0.6");
            aeppathListArr = pcpath.split("\n");
            metadata = filenameList + '\n\n' + pcpath;
        }
        
        var filenameListArr = filenameList.split("\n");
        var existingAEP = [];
        var errorAEP = [];
        var compList = [];

        var Selection;

        for (var i = 1; i <= app.project.numItems; i++) {
            if (app.project.item(i).selected) {
                Selection = app.project.item(i);
            }
        }
        if(Selection == null){
            alert("Select item from project window.");
        }else{
            if(filenameList == "" || aeppathList == ""){
                alert("No metadata found in file.");
            } else {       
                saveLog(Selection.name, metadata, "Log");               
                for (var i = 0; i < aeppathListArr.length; i++) {
                    var aepfile = new File(aeppathListArr[i]);
                    if (!aepfile.exists) {
                        errorAEP.push(aepfile.fsName);
                        // alert(aepfile.fsName + " does not exist.");
                    }
                    else {
                        existingAEP.push(aepfile.fsName);
                        // alert(aepfile.fsName + " exists.");
                    }
                }
                for (var i = 0; i < existingAEP.length; i++) {
                    while(progressBar.value < 100) {
                       progressBar.value++; 
                       $.sleep(2);
                    }
                    var aepfile= new File(existingAEP[i]);
                    var newImport = app.project.importFile(new ImportOptions(aepfile));
                    importedProjectArr.push(newImport);  
                    progressBar.value = 0;
                }
                for (var s = 0; s < importedProjectArr.length; s++) {
                    while(progressBar.value < 100) {
                       progressBar.value++; 
                       $.sleep(2);
                    }  
                    importedProjectArr[s].parentFolder = importedProjectFolderTarget;
                    progressBar.value = 0;
                }
                alert("AEP sources have been imported. Matching comps are placed in the ImportedComps folder. Check log on desktop if there are any missing assets.");
                for (var b = 0; b <= filenameListArr.length; b++) { 
                    var filenoEXT = filenameListArr[b].split('.');
                    for (var a = 1; a <= app.project.numItems; a++) {
                        var itemNameArr = app.project.item(a).name.split('.');
                        if(app.project.item(a) instanceof CompItem && itemNameArr[0] == filenoEXT[0]){
                            selectedComp = app.project.item(a);
                            selectedComp.parentFolder = importedCompsFolderTarget;
                            // alert(filenoEXT[0] + "\n" + itemNameArr[0]);
                            progressBar.value = 0;
                        }
                    }
                }
            }
        }
    }

    function importSourceProjectsFromRen() {
        var importedProjectArr = [];
        var importedProjectFolderTarget = getFolderByName("ImportedProjects");
        var importedCompsFolderTarget = getFolderByName("ImportedComps");
        var SelectedItems = [];
        var selectionNames = [];
        var selectionItems = [];
        var projectList = [];
        var projLength = 0;
        var projectItemArr = [];

        for (var i = 1; i <= app.project.numItems; i++) {
            if (app.project.item(i).selected)
                SelectedItems[SelectedItems.length] = app.project.item(i);
        }
        for (var b = 0; b < SelectedItems.length; b++) {
            var item = SelectedItems[b];
            selectionNames.push(item.name);
            selectionItems.push(item);
            if (item instanceof FootageItem && !item.mainSource.isStill) {
                var selectedFile = item.file.fsName;
                var fileRef = new File(selectedFile);
                if (fileRef instanceof File) {
                    var xmpFile = new XMPFile(selectedFile, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);
                    var xmp = xmpFile.getXMP();
                    var xmpString = xmp.dumpObject().toString();
                    var creatorFsName = xmpString.match(RegExp('(.*creatorAtom:fullPath = ")(.*)(")'))[2];
                     if(systemMac){
                        // alert(creatorFsName);
                        projectList.push(creatorFsName);
                    }
                    else{
                        var flipslash = creatorFsName.replaceAll("/", "\\");
                        var pcpath = flipslash.replace("Volumes", "\\10.1.0.6");
                        // alert(pcpath);
                        projectList.push(pcpath);
                    }
                    xmpFile.closeFile();
                }
            }
        }
        var uniqueProjectsList = projectList.unique();
        for (var x = 0; x < uniqueProjectsList.length; x++) {
            projectString += ", " + projectList[x];
            var project = uniqueProjectsList[x];
            var newProject = new File(project);
            if (!newProject.exists) {
                alert("Project could not be found at: " + project);
            }
            else if (newProject.exists && filecbArr[x].value == true) {
                var importedProject = app.project.importFile(new ImportOptions(newProject));
                importedProjectArr.push(importedProject);
                projectItemArr.push(importedProject.name);
            }
        }
        for (var s = 0; s < importedProjectArr.length; s++) {
            importedProjectArr[s].parentFolder = importedProjectFolderTarget;
        }
        for (var i = filecbArr.length; i > 0; i--) {
            filecbArr.pop();
        }
        
        for (var b = 0; b < selectionNames.length; b++) {
            var currXsize = selectionItems[b].width;
            var currYsize = selectionItems[b].height;
            var currFps = selectionItems[b].frameRate;
            var currFpsRound = Math.round((currFps) * 1000) / 1000;
            currname = selectionNames[b].split(".");
            var nameSansMov = selectionNames[b].replace(".mov", '');
            var extentionName = "_" + currFpsRound + "fps" + "_" + currXsize + "x" + currYsize;

            // alert(nameSansMov);
            // alert(currname[0].replace(extentionName, ''));

            for (var i = 1; i <= app.project.numItems; i++) {
                if (app.project.item(i).name == currname[0]){
                    app.project.item(i).parentFolder = importedCompsFolderTarget;
                }
                if (app.project.item(i).name == nameSansMov.replace(extentionName, '')){
                    app.project.item(i).parentFolder = importedCompsFolderTarget;
                }
            }
        }
    }

////IMPORT AE PROJECTS FUNCTION - ONCLICK BUTTON ACTION///////

    function importSourceProjectsFromRenDialoge(){

        var importedProjectArr = [];
        var importedProjectFolderTarget = getFolderByName("ImportedProjects");
        var SelectedItems = [];
        var selectionNames = [];
        var projectList = [];
        var projLength = 0;
        var projectItemArr = [];
        for (var i = 1; i <= app.project.numItems; i++) {
            if (app.project.item(i).selected)
                SelectedItems[SelectedItems.length] = app.project.item(i);
        }
        for (var b = 0; b < SelectedItems.length; b++) {
            var item = SelectedItems[b];
            selectionNames.push(item.name);
            if (item instanceof FootageItem && !item.mainSource.isStill) {
                var selectedFile = item.file.fsName;
                var fileRef = new File(selectedFile);
                if (fileRef instanceof File) {
                    var xmpFile = new XMPFile(selectedFile, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);
                    var xmp = xmpFile.getXMP();
                    var xmpString = xmp.dumpObject().toString();
                    var creatorFsName = xmpString.match(RegExp('(.*creatorAtom:fullPath = ")(.*)(")'))[2];
                    if(systemMac){
                        // alert(creatorFsName);
                        projectList.push(creatorFsName);
                    }
                    else{
                        var flipslash = creatorFsName.replaceAll("/", "\\");
                        var pcpath = flipslash.replace("Volumes", "\\10.1.0.6");
                        // alert(pcpath);
                        projectList.push(pcpath);
                    }
                    xmpFile.closeFile();
                }
            }
        }
        var dlg = new Window( "dialog", "Project Import Options" );
        dlg.fileListPnl = dlg.add( "panel", undefined,);
        dlg.fileListPnl.orientation = "column";
        dlg.fileListPnl.alignment = ['fill', 'fill'];
        var uniqueProjectsList = projectList.unique();
        for (var x = 0; x < uniqueProjectsList.length; x++) {
            projectString += ", " + projectList[x];
            var project = uniqueProjectsList[x];
            var newProject = new File(project);
            dlg.filePnl = dlg.fileListPnl.add( "panel", undefined,);
            dlg.filePnl.orientation = "row";
            dlg.filePnl.size = [500, 60];
            dlg.filePnl.checkBox = dlg.filePnl.add( "checkBox", undefined);
            dlg.filePnl.checkBox.value = true;
            var nameArr = uniqueProjectsList[x].split('/');
            var currProjectNmae = nameArr[nameArr.length - 1];
            dlg.filePnl.SelectedBtn = dlg.filePnl.add( "button", undefined, currProjectNmae);
            dlg.filePnl.SelectedBtn.alignment = ['fill', 'top'];
            dlg.filePnl.SelectedBtn.size = [200, 30];
            dlg.filePnl.SelectedBtn.enabled = false;
            dlg.messagePanel = dlg.filePnl.add( "group", undefined,);
            dlg.messagePanel.alignment = ['right', 'top'];
            dlg.messagePanel.size = [30, 30];
            dlg.messagePanel.orientation = "row";
            filecbArr.push(dlg.filePnl.checkBox);
                if (!newProject.exists) {
                    var messagePanelColor=[0.4,0.0,0.0];
                    var statusLabel = dlg.messagePanel.add( "button", undefined, "File is missing.");
                    statusLabel.alignment = ['center', 'center'];
                    statusLabel.fillBrush = statusLabel.graphics.newBrush(statusLabel.graphics.BrushType.SOLID_COLOR, messagePanelColor);
                    statusLabel.onDraw = customDraw;
                } else {
                    var messagePanelColor=[0.0,0.4,0.0];
                    var statusLabel = dlg.messagePanel.add( "button", undefined, "Project found.");
                    statusLabel.alignment = ['center', 'center'];
                    statusLabel.fillBrush = statusLabel.graphics.newBrush(statusLabel.graphics.BrushType.SOLID_COLOR, messagePanelColor);
                    statusLabel.onDraw = customDraw;
                }
        }
        dlg.btnPnl = dlg.add( "panel", undefined,);
        dlg.btnPnl.orientation = "row";
        dlg.alignment = ["left", "center"];
        dlg.btnPnl.SelectedBtn = dlg.btnPnl.add( "button", undefined, "IMPORT");
        dlg.btnPnl.CancelBtn = dlg.btnPnl.add( "button", undefined, "CANCEL", { name: "CANCEL" } );
        dlg.btnPnl.SelectedBtn.onClick = function() { importSourceProjectsFromRen(); dlg.close();};;
        dlg.show();
    }

    function customDraw(){
        with(this){
            graphics.drawOSControl();
            graphics.rectPath(0,0,size[0],size[1]);
            graphics.fillPath(fillBrush);
        }
    }

////GET METADATA AND SAVE LOG - ONCLICK BUTTON ACTION///////

    function logMetadata() {
        var Selection;
        var aeppathList = SearchMetaData("creatorAtom:fullPath", ".aep", "AEP");
        var filenameList = SearchMetaData("filePath", ".mov", "FileName");
        var metadata = filenameList + '\n\n' + aeppathList;
        for (var i = 1; i <= app.project.numItems; i++) {
            if (app.project.item(i).selected) {
                Selection = app.project.item(i);
            }
        }
        if (aeppathList == "" || filenameList == "") {
            alert("No metadata found in file.");
        }
        else {
            saveLog(Selection.name, metadata, "Log");
        }
    }

////METADATA SEARCH FUNCTION - RETURNS STRING///////

    function SearchMetaData(searchInput, extensionType, searchType) {
        var SelectedItems = [];
        var selectionNames = [];
        var initialList = [];
        var rawList = [];
        var UniqueList = [];
        var ListString = "";
        var currentSelection;

        for (var i = 1; i <= app.project.numItems; i++) {
            if (app.project.item(i).selected)
                SelectedItems[SelectedItems.length] = app.project.item(i);
        }
        for (var b = 0; b < SelectedItems.length; b++) {
            var item = SelectedItems[b];
            currentSelection = item;
            selectionNames.push(item.name);
            if (item instanceof FootageItem && !item.mainSource.isStill) {
                var selectedFile = item.file.fsName;
                var fileRef = new File(selectedFile);
                if (fileRef instanceof File) {
                    var xmpFile = new XMPFile(selectedFile, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);
                    var xmp = xmpFile.getXMP();
                    var xmpString = xmp.dumpObject().toString();
                    initialList = xmpString.split(searchInput);
                    xmpFile.closeFile();
                }
            }
        }
        for (var i = 1; i <= initialList.length - 1; i++) {
            var pathname = initialList[i];
            var pathArr = pathname.split('"');
            rawList.push(pathArr[1]);
        }
        UniqueList = rawList.unique();
        for (var i = 0; i <= UniqueList.length - 1; i++) {
            if (UniqueList[i].indexOf(extensionType) !== -1) {
                ListString += UniqueList[i] + "\n";
            }
        }
        return ListString;
    }

////SAVELOG FUNCTION///////

    function saveLog(logName, logInput, logType) {
        var filenameSplit = logName.split('.');
        var newfilename = filenameSplit[0];
        var extensionPath = "~/Desktop";
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

////SAVELOG FUNCTION///////

function savePrefs(logName, logInput, logType) {
    var filenameSplit = logName.split('.');
    var newfilename = filenameSplit[0];
    var extensionPath = scriptPath;
    var logname = extensionPath + "/SaveData/" + newfilename + "_" + logType + ".txt";
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

////SHOW EXTRAS MENU///////////////

    function extras(){
            $.evalFile(scriptPath + "/XAVToolbox_Assets/HelperScripts/XAVToolbox_Extras.jsx");
    }


////USAGE LINKS///////////////

    function usageLink(){
        // var commandCode = "open"
        // var siteLink = scriptPath + "/XAVToolbox_Assets/html/index.html";
        // var f = " ";
        // var r = "\\ ";
        // system.callSystem(commandCode + " " + siteLink.replaceAll(f, r));
        // alert(commandCode + " " + siteLink.replaceAll(f, r));
    }

////BUILD OPTIONS///////////////

    function callBuildOptionUI(){
        $.evalFile(scriptPath + "/XAVToolbox_Assets/HelperScripts/XAVToolbox_Options.jsx");
    }


////CREATE FOLDER IF FOLDER DOES NOT EXIST///////

    function getFolderByName(folderName) {
        var myProject = app.project;
        for (var i = 1; i <= myProject.numItems; i++) {
            if ((myProject.item(i) instanceof FolderItem) && (myProject.item(i).name == folderName)) {
                return myProject.item(i);
            }
        }
        myFolder = myProject.items.addFolder(folderName);
        return myFolder;
    }

    function removeFolderByName(folderName) {
        var myProject = app.project;
        for (var i = 1; i <= myProject.numItems; i++) {
            if ((myProject.item(i) instanceof FolderItem) && (myProject.item(i).name == folderName)) {
                myProject.item(i).remove();
            }
        }
    }

/////WRITE FILE FUNCTION - RETURNS TXT FILE OBJECT///////

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

    function moveToFolder(itemtomove, thisfolder){
        var itemMatchArr = new Array();
        for (var i = 1; i < app.project.numItems; i++){
            var itemName = app.project.item(i).name;
            var itemobject = app.project.item(i);
            if(itemName == itemtomove){
                // alert(itemobject.name);
                itemMatchArr.push(itemobject);
            }
        }  
        if(itemMatchArr.length > 0){
            var inputFolder = getFolderByName(thisfolder);
            for (var i = 0; i <= itemMatchArr.length; i++){
                itemMatchArr[i].parentFolder = inputFolder;
            }
        }
    }

    function moveToRoot(itemtomove){
        var itemMatchArr = new Array();
        for (var i = 1; i < app.project.numItems; i++){
            var itemName = app.project.item(i).name;
            var itemobject = app.project.item(i);
            if(itemName == itemtomove){
                itemMatchArr.push(itemobject);
            }
        }  
        if(itemMatchArr.length > 0){
            for (var i = 0; i <= itemMatchArr.length - 1; i++){
                itemMatchArr[i].parentFolder = app.project.rootFolder;
            }
        }
    }

    function getCompByName(compToFind){
        var itemMatchArr = new Array();
        for (var i = 1; i < app.project.numItems; i++){
            var itemName = app.project.item(i).name;
            var itemobject = app.project.item(i);
            if(itemName == compToFind && itemobject instanceof CompItem){
                itemMatchArr.push(itemobject);
            }
        }  
        if(itemMatchArr.length > 0){
            for (var i = 0; i <= itemMatchArr.length - 1; i++){
                itemMatchArr[i].selected = true;
            }
        }
    }

    function importFile(filenName){
        var itemMatchArr = new Array();
        var archiveFolder = getFolderByName("Archive");
        var fileNamePath = scriptPath + "/XAVToolbox_Assets/" + filenName;
        var filetoimport = new File(fileNamePath);
        var importedFile = app.project.importFile(new ImportOptions(filetoimport)); 
        importedFile.parentFolder = archiveFolder;
    }

    function parseBuildOptionsToArr(){
        var itemArr = new Array();
        var preffilepath = scriptPath + "/XAVToolbox_Assets/SaveData/BUILD_ORGANIZE_PREFS.txt";
        var prefsFile = new File(preffilepath);
        if(prefsFile.exists){
            prefsFile.open();
            var content = prefsFile.read();
            prefsFile.close();
            itemArr = content.split('_');
        }
        return itemArr;
    }

    function deselectAll(){
        for (var x = 1; x <= app.project.numItems; x++){
            app.project.item(x).selected = false;
        }
    }

    function colorLabel(compNameStr, colorStr){
        for (var x = 1; x <= app.project.numItems; x++){
            if (app.project.item(x).name == compNameStr){
                app.project.item(x).label = colorStr;    
            }
        }
    }

/////CHECK FOR DUPLICATE STRING FUNCTION - RETURNS ARRAY///////

    Array.prototype.unique = function () {
        var r = new Array();
        o: for (var i = 0, n = this.length; i < n; i++) {
            for (var x = 0, y = r.length; x < y; x++) {
                if (r[x] == this[i]) {
                    continue o;
                }
            }
            r[r.length] = this[i];
        }
        return r;
    }

////DATA SCRAPER ///////////

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
    
    if(systemMac){
        var curlCommand = "curl -L -o " + tempPath + "PROJECT_DATA.txt https://docs.google.com/spreadsheets/d/1AuL8lNGGSxuW9rdcJxsxx3OvKBZh8fgMuR2xPxuf9ls";
        var cmd = "cmd /c \""+curlCommand+"\"";
        system.callSystem(cmd);
    }

    var tempFile = new File(tempPath + "PROJECT_DATA.txt");
    tempFile.copy(dataPath + "PROJECT_DATA.txt");
    
    var updateTimer = app.scheduleTask("update()", 5000, false);

    update = function () {    
        if(systemMac){
            var newPath = scriptPath + "/XAVToolbox_Assets/SaveData/docs.google.com/spreadsheets/d/1AuL8lNGGSxuW9rdcJxsxx3OvKBZh8fgMuR2xPxuf9ls/index.html";
            datafile = new File(newPath);
        }
        
        if(systemPC){
            datafile = new File(dataPath + "PROJECT_DATA.txt"); 
        }
        
        var itemArr = new Array();

            if(datafile.exists){
                datafile.open();
                var content = datafile.read();
                datafile.close();
                itemArr = content.split('class="softmerge-inner');
                var tempSplit1 = itemArr[1].split('>');
                var tempSplit2 = tempSplit1[1].split('<');
                ProjectDataArr = tempSplit2[0].split(',');
            }
            else{
                alert("No file!");
            }

            var filePath = scriptPath + "/XAVToolbox_Assets/SaveData/";
            var projName = filePath + "PROJECTS.txt";
            var projFile = new File(projName);

            if (!projFile.exists) {
                writeFile(projFile, ProjectDataArr.join(','));
            }
            else {
                writeFile(projFile, ProjectDataArr.join(','));
            }

        return ProjectDataArr;      
    }
}

////PATCH FUNCTION /////////

    function replaceFilePath(item, newPath) {
        if (item == null) {
            return;
        }
        var currentPath = item.file.fsName;
        var pathfix = decodeURI(newPath);
        if (currentPath === pathfix) {
            return;
        }
        item.replace(new File(pathfix));
    }

    function patchPaths(){
        var filesInProject = [];
        var filesToFixInProject = [];
        var filesToCheck = [];
        var fileList = new Folder(scriptPath + "/XAVToolbox_Assets/ImageResources").getFiles();
        
        for (var i = 0; i < fileList.length; i++) {
            filesToCheck.push(fileList[i]);
        }

        for (var i = 0; i <= filesToCheck.length - 1; i++) {
            var currentFile = filesToCheck[i];
            var fileToFix = [];
            var fileExists = false;
            var currFilename = "";
            for (var j = 1; j <= app.project.numItems; j++) {
                if (app.project.item(j).name === currentFile.name) {
                    fileToFix = app.project.item(j);
                    fileExists = true;
                    break;
                }
            }
            if (fileExists) {
                filesInProject.push(currentFile);
                filesToFixInProject.push(fileToFix);
            }
        }

        for (var i = 0; i <= filesInProject.length - 1; i++) {
            replaceFilePath(filesToFixInProject[i], filesInProject[i]);
        }

        alert("Successfully patched!");
    }

    function colorPatchBTN(){
        with( this ) {
            graphics.drawOSControl();
            graphics.rectPath(0,0,size[0],size[1]);
            graphics.fillPath(fillBrush);
            graphics.drawString(text,textPen,(size[0]-graphics.measureString (text,graphics.font,size[0])[0])/2,16,graphics.font);
        }
    }

////BUILD UI FUNCTION///////

    var rdetPal = XAVToolbox_buildUI(thisObj);
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