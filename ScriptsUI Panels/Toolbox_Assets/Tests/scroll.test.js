const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../HelperScripts/UTILITY_ScrollPanel.jsx'), 'utf8'), context);
function control(type) {
    return {type, children: [], value: 0, listeners: {},
        add(type) { const child = control(type); this.children.push(child); return child; },
        addEventListener(name, fn) {this.listeners[name] = fn;},
        layout: {layout() {}, resize() {}}
    };
}
const root = control('palette');
const content = context.createToolboxScrollPanel(root);
const viewport = root.children[0], bar = root.children[1];
let naturalHeight = 1200;
content.layout.layout = () => {content.preferredSize = [450, naturalHeight];};
root.layout.layout(true);
assert.equal(root.size[1], 700);
assert.equal(bar.maxvalue, 508);
assert.equal(bar.enabled, true);
bar.value = bar.maxvalue;
bar.onChanging();
assert.equal(content.location[1], -508);
assert.equal(content.size[1] + content.location[1], viewport.bounds[3] - viewport.bounds[1]);
console.log('PASS Initial unsized root measures content and bottom remains reachable');
root.size = [490, 400];
root.layout.resize();
assert.equal(bar.maxvalue, 808);
assert.equal(content.location[1], -508);
console.log('PASS Resizing preserves offset and recalculates scroll range');
naturalHeight = 200;
root.layout.layout(true);
assert.equal(bar.enabled, false);
assert.equal(bar.value, 0);
assert.ok(content.location[1] === 0);
console.log('PASS Collapsing content clamps offset without blank overscroll');
naturalHeight = 1200;
root.layout.layout(true);
viewport.listeners.mousewheel({target: {type:'button'}, wheelDelta:-1});
assert.equal(bar.value, 32);
viewport.listeners.mousewheel({target: {type:'edittext'}, wheelDelta:-1});
assert.equal(bar.value, 32);
console.log('PASS Wheel scroll leaves editable fields to handle their own events');
