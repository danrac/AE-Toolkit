// Run with node Toolbox_Assets/Tests/organizer.test.js. No AE project or disk prefs are modified.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const base = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(base, 'Toolbox.jsx'), 'utf8');
const organizer = source.slice(source.indexOf('    function getOrganizerState('), source.indexOf('    function checkpathfor('));
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('PASS ' + name); }
function setup(index = 0) {
    let id = 0;
    const all = [];
    class Item {
        constructor(name, parent) { this.id = ++id; this.name = name; this.selected = false; this.parentFolder = parent; this.label = 4; all.push(this); }
    }
    class FolderItem extends Item {
        get numItems() { return all.filter(x => x.parentFolder === this).length; }
        item(i) { return all.filter(x => x.parentFolder === this)[i - 1]; }
        remove() { assert.equal(this.numItems, 0, 'must never remove populated folders'); all.splice(all.indexOf(this), 1); this.deleted = true; }
    }
    class CompItem extends Item { constructor(name, parent, used = false) { super(name, parent); this.usedIn = used ? [{}] : []; } }
    class SolidSource {}
    class FootageItem extends Item {
        constructor(name, parent, options = {}) { super(name, parent); Object.assign(this, {mainSource: {isStill: false}, hasAudio: false, hasVideo: true, file: {name, fsName: '/assets/' + name}}, options); }
    }
    const root = new FolderItem('root', null); all.pop();
    const project = {rootFolder: root, get numItems() { return all.length; }, item(i) {return all[i - 1];}, items: {addFolder(name) {return new FolderItem(name, root);}}};
    const context = {app: {project, beginUndoGroup() {context.begins++;}, endUndoGroup() {context.ends++;}}, begins: 0, ends: 0, FolderItem, CompItem, FootageItem, SolidSource,
        parseBuildOptionsToArr: () => ['Comps', 'PreComp', 'Footage', 'Images', 'Solids'], dmsdd: {selection: {index}}, progressBar: {value: 72}, ToolboxData: {scriptName: 'Toolbox'}, alerts: [], alert: s => context.alerts.push(s), getCurrentDate() {}, appendLog() {}, currentDateYMD: '', userName: '', $: {writeln() {}}};
    vm.createContext(context); vm.runInContext(organizer, context);
    return {context, all, root, folder: (n,p=root) => new FolderItem(n,p), comp: (n,p=root,u=false) => new CompItem(n,p,u), footage: (n,p=root,o={}) => new FootageItem(n,p,o), SolidSource};
}
test('XAV sorts comps, stills, solids, video and audio without a terminal error', () => {
    const x=setup(); const old=x.folder('old'), nested=x.folder('nested',old);
    const master=x.comp('master',nested), pre=x.comp('pre',nested,true), video=x.footage('v.mov',nested), audio=x.footage('a.wav',nested,{hasAudio:true,hasVideo:false}), still=x.footage('i.png',nested,{mainSource:{isStill:true}}), solid=x.footage('Solid',nested,{mainSource:new x.SolidSource(),file:null});
    x.context.BuildAndOrganize();
    assert.deepEqual([master,pre,video,audio,still,solid].map(a=>a.parentFolder.name),['Comps','PreComp','Footage','Footage','Images','Solids']);
    assert.equal(x.context.alerts.length,0); assert.equal(x.context.begins,1); assert.equal(x.context.ends,1); assert.equal(x.context.progressBar.value,0); assert(old.deleted&&nested.deleted);
});
test('Selected nested folders and selected items survive without changing selection or labels', () => {
    const x=setup(), outer=x.folder('old'), keep=x.folder('Comps',outer), nested=x.folder('inner',keep), comp=x.comp('protected',nested), selected=x.comp('selected',outer), loose=x.comp('loose'); keep.selected=true; selected.selected=true;
    // Child-first order exposes reliance on project enumeration order.
    x.all.reverse(); x.context.organizeProject();
    assert.equal(keep.parentFolder,x.root); assert.equal(nested.parentFolder,keep); assert.equal(comp.parentFolder,nested); assert.equal(selected.parentFolder,x.root); assert.notEqual(loose.parentFolder,keep); assert.equal(comp.selected,false); assert.equal(keep.label,4); assert(outer.deleted);
});
test('Existing TempFolder does not trigger self-parenting or data loss',()=>{
    const x=setup(), temp=x.folder('TempFolder'), comp=x.comp('a',temp); x.context.organizeProject(); assert(!comp.deleted); assert.equal(comp.parentFolder.name,'Comps');
});
test('Repeated XAV and all DMS ratios keep stable folder counts',()=>{
    for(let mode=0;mode<=4;mode++){const x=setup(mode);x.comp('a');x.footage('a.png');x.context.BuildAndOrganize();const count=x.all.length;x.context.BuildAndOrganize();assert.equal(x.all.length,count);assert.equal(x.context.alerts.length,0);}
});
test('XAV 2025 routes its full folder map in one Toolbox undo group',()=>{
    const x=setup(5);
    const old=x.folder('old');
    const nested=x.comp('nested_layer'), host=x.comp('master');host.numLayers=1;host.layer=()=>({source:nested});
    const indiv=x.comp('indiv_title'), sub=x.comp('sub_caption');
    const ref=x.footage('shot_ref.mov'), ae=x.footage('Adobe After Effects Graphic'), c4d=x.footage('scene.c4d');
    const image=x.footage('art.tif'), video=x.footage('clip.mp4'), audio=x.footage('mix.wav',{hasAudio:true,hasVideo:false});
    const unknown=x.footage('data.bin'), solid=x.footage('Solid',x.root,{mainSource:new x.SolidSource(),file:null}), selected=x.footage('keep.mp4',old);selected.selected=true;
    x.context.BuildAndOrganize();
    assert.equal(host.parentFolder.name,'01_compositions');assert.equal(nested.parentFolder.name,'_PRE');assert.equal(indiv.parentFolder.name,'_INDIVS');assert.equal(sub.parentFolder.name,'_SUBS');
    assert.equal(ref.parentFolder.name,'02_cuts');assert.equal(ae.parentFolder.name,'05_AE-import');assert.equal(c4d.parentFolder.name,'04_c4d');assert.equal(image.parentFolder.name,'tiff');assert.equal(video.parentFolder.name,'mp4');assert.equal(audio.parentFolder.name,'Audio');assert.equal(unknown.parentFolder.name,'unsorted');assert.equal(solid.parentFolder.name,'Solids');assert.equal(selected.parentFolder,x.root);assert(selected.selected);assert(old.deleted);
    assert.equal(x.context.begins,1);assert.equal(x.context.ends,1);assert.equal(x.context.alerts.length,0);
    const count=x.all.length;x.context.BuildAndOrganize();assert.equal(x.all.length,count);assert.equal(x.context.begins,2);assert.equal(x.context.ends,2);
});
test('DMS respects source extensions, Mac/Windows paths, dotted comps, audio and protected folders',()=>{
    const x=setup(1), keep=x.folder('protected');keep.selected=true;const protectedComp=x.comp('keep',keep), dotted=x.comp('v1.2'), selected=x.comp('master');selected.selected=true;
    const mac=x.footage('renamed',x.root,{file:{name:'shot.MOV',fsName:'/show/06_ToGFX/shot.MOV'}}), win=x.footage('renamed',x.root,{file:{name:'shot.mp4',fsName:'C:\\show\\06_ToGFX\\shot.mp4'}}), output=x.footage('shot.mov'), psd=x.footage('Layer 1',x.root,{file:{name:'multi.dot.PSD',fsName:'/art/multi.dot.PSD'},mainSource:{isStill:true}}), audio=x.footage('multi.dot.WAV',x.root,{hasAudio:true,hasVideo:false});
    x.context.BuildAndOrganize();assert.equal(x.context.alerts.length,0);assert.equal(protectedComp.parentFolder,keep);assert.equal(dotted.parentFolder.parentFolder.name,'1_COMPS');assert.equal(selected.parentFolder.name,'1_COMPS');
    for(const a of [mac,win,audio])assert.equal(a.parentFolder.parentFolder.name,'4_FOOTAGE');assert.equal(output.parentFolder.name,'MOV');assert.equal(psd.parentFolder.name,'PSD');
});
test('An organizer failure closes undo and resets progress; logging failure does not block sorting',()=>{
    const x=setup();x.context.organizeProject=()=>{throw Error('simulated failure');};x.context.BuildAndOrganize();assert.equal(x.context.ends,1);assert.equal(x.context.progressBar.value,0);assert.equal(x.context.alerts.length,1);
    const y=setup();const comp=y.comp('a');y.context.appendLog=()=>{throw Error('read-only log');};y.context.BuildAndOrganize();assert.equal(comp.parentFolder.name,'Comps');assert.equal(y.context.alerts.length,0);
});
function prefsSetup() {
    const disk={}; const failures={};
    function File(name) {this.fsName=name;this.name=name;}
    Object.defineProperty(File.prototype,'exists',{get(){return Object.hasOwn(disk,this.fsName);}});
    File.prototype.open=function(mode){if(failures.open===this.fsName)return false;this.mode=mode;if(mode==='w')disk[this.fsName]='';return this.exists;};
    File.prototype.read=function(){return disk[this.fsName];};
    File.prototype.write=function(s){if(failures.write)return false;disk[this.fsName]=s;return true;};
    File.prototype.close=function(){return true;};
    File.prototype.copy=function(dest){if(failures.copy===dest)return false;disk[dest]=disk[this.fsName];return true;};
    File.prototype.remove=function(){delete disk[this.fsName];return true;};
    const c={File,alert(){}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(base,'Toolbox_Assets/HelperScripts/UTILITY_BuildPrefs.jsx'),'utf8'),c);return {c,disk,failures};
}
const legacy='Comps-PreComp-Footage-Images-Solids-undefined-undefined-undefined-undefined';
test('Reads legacy settings and missing values without writing the file',()=>{
    const {c,disk}=prefsSetup();disk.prefs=legacy;assert.equal(c.readBuildPreferences('prefs')[0],'Comps');assert.equal(c.readBuildPreferences('prefs')[6],'');assert.deepEqual(disk,{prefs:legacy});assert.equal(c.readBuildPreferences('missing').length,9);assert.equal(Object.keys(disk).length,1);
});
test('New preferences round-trip hyphens, Unicode, spaces and both path formats',()=>{
    const {c,disk}=prefsSetup();disk.prefs=legacy;const fields=['01-Master Comps','Pré-comps','Footage','Images','Solids','a-b@example.com','C:\\my-project','/Volumes/my-project','/my-textures/'];c.saveBuildPreferences('prefs',fields);assert.deepEqual(Array.from(c.readBuildPreferences('prefs')),fields);assert.equal(disk['prefs.bak'],legacy);assert(!Object.hasOwn(disk,'prefs.pending'));
});
test('Blank names, failed writes and failed backups preserve current preferences',()=>{
    for(const fail of ['blank','open','write','copy']){const {c,disk,failures}=prefsSetup();disk.prefs=legacy;const fields=Array.from(c.defaultBuildPreferences());if(fail==='blank')fields[0]=' ';if(fail==='open')failures.open='prefs.pending';if(fail==='write')failures.write=true;if(fail==='copy')failures.copy='prefs.bak';assert.throws(()=>c.saveBuildPreferences('prefs',fields));assert.equal(disk.prefs,legacy);assert(!Object.hasOwn(disk,'prefs.pending'));}
});
test('Corrupt settings recover from backup without replacing the backup',()=>{
    const {c,disk}=prefsSetup();disk.prefs='';disk['prefs.bak']=legacy;const fields=c.readBuildPreferences('prefs');assert.equal(fields[0],'Comps');assert.equal(disk.prefs,'');c.saveBuildPreferences('prefs',fields);assert.equal(disk['prefs.bak'],legacy);assert.equal(c.readBuildPreferences('prefs')[0],'Comps');const recovery=Object.keys(disk).filter(k=>k.includes('.unreadable-'));assert.equal(recovery.length,1);assert.equal(disk[recovery[0]],'');
});
test('Panel startup contains no preference save, and every include resolves',()=>{
    const ui=source.slice(source.indexOf('    function Toolbox_buildUI'),source.indexOf('function ProjectColorSettings'));
    assert(!/savePrefs\("BUILD_ORGANIZE"/.test(ui));
    const visited=new Set();function check(file){if(visited.has(file))return;visited.add(file);const text=fs.readFileSync(file,'utf8');new vm.Script(text.replace(/^\s*#.*$/gm,''));for(const match of text.matchAll(/^\s*#include\s+"([^"]+)"/gm)){const child=path.resolve(path.dirname(file),match[1]);assert(fs.existsSync(child),child);check(child);}}check(path.join(base,'Toolbox.jsx'));check(path.join(base,'Toolbox_Assets/HelperScripts/Toolbox_Options.jsx'));
});
console.log(`${passed} tests passed.`);
