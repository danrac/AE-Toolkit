// The viewport clips a naturally sized content group. Root layout calls from
// existing module handlers remeasure the content without enlarging the window.
function createToolboxScrollPanel(root) {
    var viewport = root.add("group");
    var content = viewport.add("group");
    var scrollbar = root.add("scrollbar", [0, 0, 14, 300], 0, 0, 1);
    content.orientation = "column";
    content.alignChildren = ["fill", "top"];
    content.margins = 10;
    content.spacing = 10;
    scrollbar.stepdelta = 32;
    root.minimumSize = [460, 180];
    root.preferredSize = [490, 700];
    var busy = false;
    var overflow = 0;
    function position() {
        scrollbar.value = Math.max(0, Math.min(overflow, scrollbar.value));
        content.location = [0, -Math.round(scrollbar.value)];
    }
    function layout() {
        if (busy) return;
        busy = true;
        var stage = "root size";
        try {
            var width = root.size && root.size[0] > 0 ? root.size[0] : root.preferredSize[0];
            var height = root.size && root.size[1] > 0 ? root.size[1] : root.preferredSize[1];
            if (!root.size) root.size = [width, height];
            var viewWidth = Math.max(1, width - 22);
            var viewHeight = Math.max(1, height - 8);
            stage = "viewport";
            viewport.bounds = [4, 4, 4 + viewWidth, 4 + viewHeight];
            stage = "content measure";
            content.layout.layout(true);
            stage = "content size";
            var naturalHeight = content.preferredSize[1];
            content.size = [viewWidth, naturalHeight];
            stage = "content resize";
            content.layout.resize();
            overflow = Math.max(0, naturalHeight - viewHeight);
            stage = "scrollbar";
            scrollbar.bounds = [width - 16, 4, width - 2, height - 4];
            scrollbar.maxvalue = Math.max(1, overflow);
            scrollbar.jumpdelta = Math.max(32, viewHeight - 32);
            scrollbar.enabled = overflow > 0;
            position();
        } catch (error) {
            throw new Error(stage + ": " + error.toString());
        } finally {
            busy = false;
        }
    }
    scrollbar.onChanging = scrollbar.onChange = position;
    root.layout = { layout: layout, resize: layout };
    // Native scrollbar remains usable on hosts that do not send wheel events.
    viewport.addEventListener("mousewheel", function(event) {
        var type = event.target ? String(event.target.type).toLowerCase() : "";
        if (type === "edittext" || type === "dropdownlist" || type === "listbox" || type === "slider") return;
        if (!overflow || !event.wheelDelta) return;
        scrollbar.value -= event.wheelDelta > 0 ? 32 : -32;
        position();
        if (event.preventDefault) event.preventDefault();
    });
    return content;
}
