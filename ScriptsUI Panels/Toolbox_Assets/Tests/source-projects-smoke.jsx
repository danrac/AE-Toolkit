// Run manually in After Effects. In-memory metadata only; no project mutations.
(function() {
    var TOOLBOX_TEST_MODE = true;
    #include "../HelperScripts/UTILITY_SourceProjects.jsx";
    #include "../HelperScripts/UTILITY_Update.jsx";
    if (ExternalObject.AdobeXMPScript === undefined) ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    var creator = XMPConst.NS_CREATOR_ATOM || "http://ns.adobe.com/creatorAtom/1.0/";
    var dm = XMPConst.NS_DM || "http://ns.adobe.com/xmp/1.0/DynamicMedia/";
    var xmp = new XMPMeta();
    xmp.setStructField(creator, "aeProjectLink", creator, "fullPath", "/fixture/Example Project.aep");
    if (toolboxSourcePaths(xmp)[0] !== "/fixture/Example Project.aep") throw new Error("Creator project link failed");
    var still = new XMPMeta();
    still.setStructField(dm, "projectRef", dm, "path", "file:///fixture/Still%20Project.aepx");
    still.setStructField(dm, "projectRef", dm, "type", "still");
    if (toolboxSourcePaths(new XMPMeta(still.serialize()))[0] !== "file:///fixture/Still%20Project.aepx") throw new Error("Still project link failed");
    if (toolboxUpdateJSON('{"tag_name":"v2.2.7","assets":[]}').tag_name !== "v2.2.7") throw new Error("Release JSON parser failed");
    alert("PASS: Native XMP creator link, still projectRef link, serialized sidecar metadata, and release JSON parsing. No project changes made.");
})();
