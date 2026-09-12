// Run with node Toolbox_Assets/Tests/preset-assets.test.js. No real files are modified.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const base = path.resolve(__dirname, '../..');

function createFilesystem() {
    const files = {};
    const folders = { '/': true, 'C:': true };
    let copies = 0;
    const normalize = value => String(value).replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
    const parent = value => {
        const normalized = normalize(value);
        if (normalized === '/') return '/';
        const index = normalized.lastIndexOf('/');
        return index === 0 ? '/' : (index < 0 ? normalized : normalized.substring(0, index));
    };
    function Folder(value) { this.fsName = String(value); }
    Object.defineProperty(Folder.prototype, 'exists', { get() { return !!folders[normalize(this.fsName)]; } });
    Object.defineProperty(Folder.prototype, 'parent', { get() { return new Folder(parent(this.fsName)); } });
    Folder.prototype.create = function () {
        if (!this.parent.exists && normalize(this.fsName) !== normalize(this.parent.fsName)) return false;
        folders[normalize(this.fsName)] = true;
        return true;
    };
    function File(value) { this.fsName = String(value); this.name = path.posix.basename(normalize(value)); }
    Object.defineProperty(File.prototype, 'exists', { get() { return Object.prototype.hasOwnProperty.call(files, normalize(this.fsName)); } });
    Object.defineProperty(File.prototype, 'parent', { get() { return new Folder(parent(this.fsName)); } });
    Object.defineProperty(File.prototype, 'length', { get() { return this.exists ? files[normalize(this.fsName)].length : 0; } });
    File.prototype.copy = function (target) {
        const targetPath = normalize(target);
        if (!this.exists || !new File(target).parent.exists || Object.prototype.hasOwnProperty.call(files, targetPath)) return false;
        files[targetPath] = files[normalize(this.fsName)];
        copies++;
        return true;
    };
    return { File, Folder, files, folders, normalize, addFile(name, content) { files[normalize(name)] = content; }, get copies() { return copies; } };
}

function setup() {
    const disk = createFilesystem();
    const context = {
        File: disk.File, Folder: disk.Folder, $: { fileName: '/install/Toolbox_Assets/HelperScripts/UTILITY_AddCMPresets.jsx' },
        alerts: [], logs: [], guideWrites: [], arWrites: [], alert(message) { context.alerts.push(message); },
        readLog(name) { return name.indexOf('AR_NAMES') !== -1 ? '16x9' : ''; },
        appendLog(name, value) { context.logs.push({ name, value }); },
        appenddelimitLog(name, value) { if (name.indexOf('GUIDE') !== -1) context.guideWrites.push(value); else context.arWrites.push(value); }
    };
    vm.createContext(context);
    const utility = fs.readFileSync(path.join(base, 'Toolbox_Assets/HelperScripts/UTILITY_Functions.jsx'), 'utf8').replace(/^\s*#include.*$/gm, '');
    vm.runInContext(utility, context);
    const preset = fs.readFileSync(path.join(base, 'Toolbox_Assets/HelperScripts/UTILITY_AddCMPresets.jsx'), 'utf8');
    const start = preset.indexOf('    function presetText(');
    const end = preset.indexOf('    function arrayContains(');
    vm.runInContext(preset.slice(start, end) + 'function arrayContains(haystack, needle) { for (var i = 0; i < haystack.length; i++) if (haystack[i] === needle) return true; return false; }', context);
    context.scriptPath = '/install/Toolbox_Assets';
    context.pal = { close() { context.closed = true; } };
    return { context, disk };
}

let passed = 0;
function test(name, fn) { fn(); passed++; console.log('PASS ' + name); }

test('Extracts macOS and Windows asset filenames', () => {
    const { context } = setup();
    assert.equal(context.presetFileNameFromPath('/Volumes/show/guide.png'), 'guide.png');
    assert.equal(context.presetFileNameFromPath('C:\\show\\guide.psd'), 'guide.psd');
});

test('Creates nested resource folders and writes a preset only after copies succeed', () => {
    const { context, disk } = setup();
    disk.addFile('/external/cover.psd', 'cover');
    disk.addFile('/external/matte.png', 'matte');
    disk.addFile('C:\\external\\chart.psd', 'chart');
    context.AddNewCMPreset({ text: 'Client A' }, 'HD', '1920', '1080', '/external/cover.psd', '16x9', '/external/matte.png', 'C:\\external\\chart.psd', '');
    assert.equal(disk.files['/install/Toolbox_Assets/ImageResources/Covers/cover.psd'], 'cover');
    assert.equal(disk.files['/install/Toolbox_Assets/ImageResources/Client A/matte.png'], 'matte');
    assert.equal(disk.files['/install/Toolbox_Assets/ImageResources/Client A/chart.psd'], 'chart');
    assert.equal(context.logs.length, 1);
    assert.equal(context.alerts.length, 0);
    assert(context.closed);
});

test('Existing resource files succeed without a second copy', () => {
    const { context, disk } = setup();
    disk.addFile('/external/matte.png', 'new');
    disk.addFile('/install/Toolbox_Assets/ImageResources/Client A/matte.png', 'existing');
    const copiesBefore = disk.copies;
    context.AddNewCMPreset({ text: 'Client A' }, 'HD', '1920', '1080', '', '16x9', '/external/matte.png', '', '');
    assert.equal(disk.copies, copiesBefore);
    assert.equal(context.logs.length, 1);
    assert.equal(context.alerts.length, 0);
});

test('A missing asset leaves no partial preset record', () => {
    const { context, disk } = setup();
    disk.addFile('/external/cover.psd', 'cover');
    context.AddNewCMPreset({ text: 'Client A' }, 'HD', '1920', '1080', '/external/cover.psd', '16x9', '/missing/matte.png', '', '');
    assert.equal(context.logs.length, 0);
    assert.equal(context.alerts.length, 1);
    assert(/No preset was saved/.test(context.alerts[0]));
});

console.log(`${passed} tests passed.`);
