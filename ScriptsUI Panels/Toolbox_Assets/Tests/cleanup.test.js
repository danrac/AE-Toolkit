const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const childProcess = require('child_process');
const base = path.resolve(__dirname, '../..');
const helper = path.join(base, 'Toolbox_Assets/HelperScripts');
const source = fs.readFileSync(path.join(base, 'Toolbox.jsx'), 'utf8');
let passed = 0;
function test(name, run) { run(); passed++; console.log('PASS ' + name); }
function code(name) { return fs.readFileSync(path.join(helper, name), 'utf8').replace(/^\s*#.*$/gm, ''); }
function cleanupContext() {
    class FolderItem { constructor(items = []) { this.items = items; } get numItems() { return this.items.length; } item(i) { return this.items[i - 1]; } }
    class CompItem { constructor(id) { this.id = id; } }
    class FootageItem extends CompItem {}
    const events = [], alerts = [];
    const c = { FolderItem, CompItem, FootageItem, progressBar: { value: 44 }, alert: m => alerts.push(m), app: { project: {selection: [], reduceProject: a => events.push(['reduce', a]), removeUnusedFootage: () => events.push(['unused']), consolidateFootage: () => events.push(['consolidate'])}, beginUndoGroup: () => events.push(['begin']), endUndoGroup: () => events.push(['end']), findMenuCommandId: name => name === 'Collect Files...' ? 991 : 0, executeCommand: id => events.push(['command', id]) } };
    vm.createContext(c); vm.runInContext(source.slice(source.indexOf('    function AEPCollect('), source.indexOf('//// BUILD ORGANIZE PROJECT FUNCTION')), c);
    return {c, events, alerts, FolderItem, CompItem};
}
test('Collection delegates without saving, reducing, relinking or copying the project', () => {
    const {c, events} = cleanupContext(); c.AEPCollect(); assert.deepEqual(events, [['command', 991]]);
    c.app.findMenuCommandId = () => 0; c.AEPCollect(); assert.equal(events.length, 1);
});
test('Reduction includes nested folder contents once and closes undo', () => {
    const {c, events, FolderItem, CompItem} = cleanupContext(); const a = new CompItem(1), b = new CompItem(2); c.app.project.selection = [new FolderItem([a, new FolderItem([b])]), a]; c.reduceProject();
    assert.deepEqual(Array.from(events[1][1]), [a, b]); assert.equal(events.at(-1)[0], 'end'); assert.equal(c.progressBar.value, 0);
});
test('Empty-folder selection does not reduce the whole project; no selection removes unused footage', () => {
    const {c, events, alerts, FolderItem} = cleanupContext(); c.app.project.selection = [new FolderItem()]; c.reduceProject(); assert.equal(events.length, 0); assert.equal(alerts.length, 1); c.app.project.selection = []; c.reduceProject(); assert.equal(events[1][0], 'unused');
});
test('Native consolidation handles both buttons without name-based replacement', () => {
    const {c, events} = cleanupContext(); c.consolidateFiles(); c.consolidateLikeFiles(); assert.equal(events.filter(e => e[0] === 'consolidate').length, 2); assert.equal(events.filter(e => e[0] === 'end').length, 2);
});
test('Reduction and consolidation failures close undo and reset progress', () => {
    for (const op of ['reduceProject', 'consolidateFiles']) {
        const {c, events, alerts, CompItem} = cleanupContext(); c.app.project.selection = [new CompItem(1)]; c.app.project.reduceProject = c.app.project.consolidateFootage = () => { throw Error('failure'); }; c[op](); assert.equal(events.at(-1)[0], 'end'); assert.equal(c.progressBar.value, 0); assert.equal(alerts.length, 1);
    }
});
test('Lookup/move helpers include the last project item without overrunning matches', () => {
    const {c, CompItem, FolderItem} = cleanupContext(); const a = new CompItem(1); a.name = 'last'; const all = [a]; const root = new FolderItem(); c.app.project.rootFolder = root; Object.defineProperty(c.app.project, 'numItems', {get: () => all.length}); c.app.project.item = i => all[i - 1]; c.app.project.items = {addFolder(name) { const f = new FolderItem(); f.name = name; all.push(f); return f; }};
    function File() { this.parent = {fsName: base}; } c.File = File; c.$ = {fileName: 'Toolbox.jsx'};
    vm.runInContext(code('UTILITY_Functions.jsx'), c); c.moveToFolder('last', 'destination'); assert.equal(a.parentFolder.name, 'destination'); c.moveToRoot('last'); assert.equal(a.parentFolder, root); c.getCompByName('last'); assert.equal(a.selected, true);
});
// Disk-backed File/Folder adapters exercise the updater without touching installed files.
const fixture = fs.mkdtempSync(path.join(__dirname, '.fixtures-'));
let failCopy = null;
function File(p) { if (!(this instanceof File)) return new File(p); this.fsName = path.resolve(String(p)); this.name = path.basename(this.fsName); this.alias = fs.existsSync(this.fsName) && fs.lstatSync(this.fsName).isSymbolicLink(); }
Object.defineProperties(File.prototype, {exists: {get() {return fs.existsSync(this.fsName) && fs.statSync(this.fsName).isFile();}}, parent: {get() {return new Folder(path.dirname(this.fsName));}}, length: {get() {return fs.statSync(this.fsName).size;}}});
File.prototype.open = function(mode) { this.mode = mode; if (mode === 'r') return this.exists; try { fs.writeFileSync(this.fsName, ''); return true; } catch { return false; } };
File.prototype.read = function() {return fs.readFileSync(this.fsName, 'utf8');};
File.prototype.write = function(s) {fs.writeFileSync(this.fsName, s); return true;};
File.prototype.close = function() {return true;};
File.prototype.copy = function(dst) { if (failCopy && failCopy(this.fsName, dst)) return false; try {fs.copyFileSync(this.fsName, dst); return true;} catch {return false;} };
File.prototype.remove = function() {fs.unlinkSync(this.fsName); return true;};
function Folder(p) { if (!(this instanceof Folder)) return new Folder(p); this.fsName = path.resolve(String(p)); this.name = path.basename(this.fsName); this.alias = fs.existsSync(this.fsName) && fs.lstatSync(this.fsName).isSymbolicLink(); this.absoluteURI = this.fsName; }
Object.defineProperties(Folder.prototype, {exists: {get() {return fs.existsSync(this.fsName) && fs.statSync(this.fsName).isDirectory();}}, parent: {get() {return new Folder(path.dirname(this.fsName));}}});
Folder.prototype.create = function() {try {fs.mkdirSync(this.fsName);return true;} catch {return false;}};
Folder.prototype.getFiles = function() {return fs.readdirSync(this.fsName).map(n => {const p = path.join(this.fsName, n);return fs.statSync(p).isDirectory() ? new Folder(p) : new File(p);});};
const update = {File, Folder, TOOLBOX_TEST_MODE: true, $: {os: 'Macintosh'}, system: {callSystem: cmd => {try {return childProcess.execSync(cmd, {encoding: 'utf8'});} catch(e) {return String(e.stdout || '') + String(e.stderr || '');}}}};
vm.createContext(update); vm.runInContext(code('UTILITY_Update.jsx'), update);
function write(p, text) {fs.mkdirSync(path.dirname(p), {recursive: true});fs.writeFileSync(p, text);}
function packagePair(name) {const pkg = path.join(fixture, name, 'download/AE-Toolkit-main/ScriptsUI Panels'), install = path.join(fixture, name, 'install');write(path.join(pkg, 'Toolbox.jsx'), 'var version = "2.2.6";\n#include "Toolbox_Assets/HelperScripts/a.jsx";');write(path.join(pkg, 'Toolbox_Assets/HelperScripts/a.jsx'), 'new helper');write(path.join(install, 'Toolbox.jsx'), 'var version = "2.2.5";');write(path.join(install, 'Toolbox_Assets/HelperScripts/a.jsx'), 'old helper');return {pkg, install};}
try {
    test('Updater finds GitHub ZIP layout and preserves settings and custom preset directories', () => {
        const {pkg, install} = packagePair('plan'); write(path.join(pkg, 'Toolbox_Assets/SaveData/BUILD_ORGANIZE_PREFS.txt'), 'defaults');write(path.join(pkg, 'Toolbox_Assets/HelperScripts/SwatchPalettes/Custom.txt'), 'overwrite'); const root = update.toolboxUpdateFindRoot(new Folder(path.join(fixture, 'plan/download'))); assert.equal(root.fsName, pkg);const plan = update.toolboxUpdatePlan(root, new Folder(install)); assert.equal(plan.length, 2);assert.equal(plan.at(-1).relative, 'Toolbox.jsx');assert(update.toolboxUpdateCompare('2.10.0', '2.9.9') > 0);
    });
    test('Missing includes abort before installation', () => {
        const {pkg, install} = packagePair('include');fs.unlinkSync(path.join(pkg, 'Toolbox_Assets/HelperScripts/a.jsx'));assert.throws(() => update.toolboxUpdatePlan(new Folder(pkg), new Folder(install)), /include/);assert.equal(fs.readFileSync(path.join(install, 'Toolbox.jsx'), 'utf8'), 'var version = "2.2.5";');
    });
    test('Successful update keeps verified previous files in its backup', () => {
        const {pkg, install} = packagePair('success');const backup = new Folder(path.join(fixture, 'success/backup'));update.toolboxUpdateInstall(update.toolboxUpdatePlan(new Folder(pkg), new Folder(install)), backup);assert.equal(fs.readFileSync(path.join(backup.fsName, 'Toolbox_Assets/HelperScripts/a.jsx'), 'utf8'), 'old helper');assert.equal(fs.readFileSync(path.join(install, 'Toolbox_Assets/HelperScripts/a.jsx'), 'utf8'), 'new helper');
    });
    test('Failed replacement rolls back every attempted file including a partial write', () => {
        const {pkg, install} = packagePair('rollback');const plan = update.toolboxUpdatePlan(new Folder(pkg), new Folder(install));failCopy = (src, dst) => {if (src === path.join(pkg, 'Toolbox.jsx')) {fs.writeFileSync(dst, 'partial');return true;}return false;};assert.throws(() => update.toolboxUpdateInstall(plan, new Folder(path.join(fixture, 'rollback/backup'))), /restored/);failCopy = null;assert.equal(fs.readFileSync(path.join(install, 'Toolbox.jsx'), 'utf8'), 'var version = "2.2.5";');assert.equal(fs.readFileSync(path.join(install, 'Toolbox_Assets/HelperScripts/a.jsx'), 'utf8'), 'old helper');
    });
    test('Backup failure prevents any installed-file replacement', () => {
        const {pkg, install} = packagePair('backup-failure');failCopy = (src, dst) => dst.includes('/backup/');assert.throws(() => update.toolboxUpdateInstall(update.toolboxUpdatePlan(new Folder(pkg), new Folder(install)), new Folder(path.join(fixture, 'backup-failure/backup'))));failCopy = null;assert.equal(fs.readFileSync(path.join(install, 'Toolbox_Assets/HelperScripts/a.jsx'), 'utf8'), 'old helper');
    });
    test('ZIP traversal is rejected before extraction', () => {
        const original = update.system.callSystem; let calls = 0;update.system.callSystem = () => {calls++;return '../escape.jsx\n';};assert.throws(() => update.toolboxUpdateExtract(new File(path.join(fixture, 'bad.zip')), new Folder(path.join(fixture, 'bad-extract'))), /Unsafe/);assert.equal(calls, 1);update.system.callSystem = original;
    });
    if (process.platform === 'darwin') test('Mac ZIP extraction works with spaces and apostrophes in paths', () => {
        const {pkg} = packagePair("zip's test");const archive = path.join(fixture, "release's test.zip");childProcess.execFileSync('/usr/bin/ditto', ['-c', '-k', '--keepParent', path.dirname(pkg), archive]);const dest = new Folder(path.join(fixture, "extracted's folder"));update.toolboxUpdateExtract(new File(archive), dest);assert(update.toolboxUpdateFindRoot(dest));
    });
    test('Windows extraction uses a checked completion marker and quoted data paths', () => {
        const original = update.system.callSystem;update.$.os = 'Windows';let command='';update.system.callSystem = cmd => {command=cmd;return 'TOOLBOX_EXTRACT_OK';};const destination = new Folder(path.join(fixture, 'windows/package'));update.toolboxUpdateExtract(new File(path.join(fixture, "release's.zip")), destination);assert(command.includes('powershell.exe'));assert(fs.readFileSync(path.join(fixture, 'windows/extract.ps1'), 'utf8').includes("release''s.zip"));update.system.callSystem = () => 'failure';assert.throws(() => update.toolboxUpdateExtract(new File('bad.zip'), destination), /failed/);update.$.os='Macintosh';update.system.callSystem=original;
    });
    test('Directory creation cancellation and invalid names never prompt for a destination', () => {
        for (const name of [null, '', '../escape', 'CON']) {let selected=0;Folder.selectDialog=()=>{selected++;return new Folder(fixture);};const c={Folder,prompt:()=>name,alert(){}};vm.createContext(c);vm.runInContext(code('TOOL_BuildProjectStructure.jsx'), c);c.createNewProjectDirectory();assert.equal(selected,0);}
    });
    test('Directory builder creates ancestors and reports creation failures', () => {
        const alerts=[];Folder.selectDialog=()=>new Folder(fixture);const c={Folder,prompt:()=> 'DEMO_Template',alert:m=>alerts.push(m)};vm.createContext(c);vm.runInContext(code('TOOL_BuildProjectStructure.jsx'),c);c.createNewProjectDirectory();assert(fs.existsSync(path.join(fixture,'DEMO_Template/05_DEMO_GFX/1_3D/aa/PRJ')));assert(alerts.at(-1).includes('successfully'));const original=Folder.prototype.create;Folder.prototype.create=()=>false;c.prompt=()=> 'FAIL_Template';c.createNewProjectDirectory();Folder.prototype.create=original;assert(alerts.at(-1).includes('incomplete'));
    });
    test('Theme changes styling without changing bounds, hierarchy or click handlers', () => {
        const graphics={PenType:{SOLID_COLOR:1},BrushType:{SOLID_COLOR:1},newPen(){return {};},newBrush(){return {};}};const click=()=>{};const child={type:'Button',text:'--- CLEAN UP / COLLECT ---',graphics,onClick:click,bounds:Object.freeze([1,2,100,25]),size:Object.freeze([99,23])};const root={type:'panel',graphics,children:[child],margins:Object.freeze([10,10,10,10]),orientation:'column'};const c={};vm.createContext(c);vm.runInContext(code('UTILITY_Theme.jsx'),c);c.applyToolboxTheme(root);assert.equal(child.text,'Clean Up / Collect');assert.equal(child.onClick,click);assert.equal(root.children[0],child);assert.deepEqual(child.bounds,[1,2,100,25]);assert.equal(root.orientation,'column');assert.equal(typeof child.onDraw,'function');
    });
    test('Module headers reserve a 34px native click target and preserve their toggle', () => {
        const c={};vm.createContext(c);vm.runInContext(code('UTILITY_Theme.jsx'),c);let toggled=0,layouts=0;const parent={margins:null,spacing:0,alignment:null,alignChildren:null,minimumSize:{height:0},preferredSize:{height:0},maximumSize:{height:0}};const header={parent,alignment:null,minimumSize:{height:0},preferredSize:{height:0},maximumSize:{height:0},onClick(){toggled++;content.visible=true;content.maximumSize.height=200;}};const content={visible:false,maximumSize:{height:0}};const frame={margins:null,spacing:0,alignment:null,alignChildren:null};const root={layout:{layout(){layouts++;},resize(){layouts++;}}};c.connectToolboxModule(frame,header,content,content,root);assert.equal(header.minimumSize.height,34);assert.equal(header.preferredSize.height,34);assert.equal(header.maximumSize.height,34);assert.equal(parent.minimumSize.height,34);assert.equal(parent.maximumSize.height,34);header.onClick();assert.equal(toggled,1);assert.equal(content.visible,true);assert.equal(layouts,2);
    });
} finally { failCopy=null; fs.rmSync(fixture, {recursive:true,force:true}); }
console.log(`${passed} cleanup tests passed.`);
