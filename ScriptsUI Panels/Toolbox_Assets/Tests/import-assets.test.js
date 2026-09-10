const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const code = fs.readFileSync(path.join(__dirname, '../HelperScripts/UTILITY_ImportAssets.jsx'), 'utf8');
let passed = 0;
function test(name, run) { run(); passed++; console.log('PASS ' + name); }

function setup(os) {
    const files = {}, folders = {}, imported = [], alerts = [], events = [];
    function File(value) { this.fsName = String(value); this.name = this.fsName.split(/[\\/]/).pop(); }
    Object.defineProperty(File.prototype, 'exists', { get() { return files[this.fsName] === true || files[this.fsName] === 'throws'; } });
    function Folder(value) { this.fsName = String(value); }
    Object.defineProperty(Folder.prototype, 'exists', { get() { return folders[this.fsName] === true; } });
    const context = {
        File,
        Folder,
        ImportOptions: function(file) { this.file = file; },
        $: { os: os || 'Macintosh' },
        alert: message => alerts.push(String(message)),
        app: {
            beginUndoGroup: name => events.push('begin:' + name),
            endUndoGroup: () => events.push('end'),
            project: {
                importFile(options) {
                    if (files[options.file.fsName] === 'throws') throw Error('unsupported format');
                    imported.push(options.file.fsName);
                }
            }
        }
    };
    vm.createContext(context);
    vm.runInContext(code, context);
    return { context, files, folders, imported, alerts, events };
}

test('Accepts ordinary paths, quotes, and file URLs without an extension whitelist', () => {
    const { context } = setup();
    const parsed = context.toolboxImportParse('  "/show/source/My file.avif"\nfile:///Volumes/Show/render%20pass.exr\nfile://server/share/plate.dpx');
    assert.deepEqual(Array.from(parsed.paths), ['/show/source/My file.avif', '/Volumes/Show/render pass.exr', '//server/share/plate.dpx']);
    assert.equal(parsed.errors.length, 0);
});

test('Supports a folder line followed by filenames and never reads beyond the pasted list', () => {
    const { context, folders } = setup('Windows');
    folders['C:\\Show\\Assets'] = true;
    const parsed = context.toolboxImportParse('C:\\Show\\Assets\nplate 0001.exr\nmatte.svg');
    assert.deepEqual(Array.from(parsed.paths), ['C:\\Show\\Assets/plate 0001.exr', 'C:\\Show\\Assets/matte.svg']);
    assert.equal(parsed.errors.length, 0);
});

test('Uses parser-safe separator helpers for Mac, Windows, and UNC paths', () => {
    const { context } = setup('Windows');
    assert.equal(context.toolboxImportEndsInSeparator('/show/assets/'), true);
    assert.equal(context.toolboxImportEndsInSeparator('C:\\Show\\Assets\\'), true);
    assert.equal(context.toolboxImportEndsInSeparator('//server/share'), false);
    assert.equal(context.toolboxImportJoin('C:\\Show\\Assets\\', '\\plate.exr'), 'C:\\Show\\Assets/plate.exr');
    assert.equal(code.indexOf('[\\\\/]'), -1);
});

test('Keeps an invalid relative path visible instead of converting it into a broken File', () => {
    const { context } = setup();
    const parsed = context.toolboxImportParse('orphan.png\n/show/valid.png');
    assert.deepEqual(Array.from(parsed.paths), ['/show/valid.png']);
    assert.equal(parsed.errors.length, 1);
    assert(parsed.errors[0].includes('Line 1'));
});

test('Deduplicates pasted Windows paths without changing their case-sensitive Mac behavior', () => {
    const { context } = setup('Windows');
    const parsed = context.toolboxImportParse('C:\\Show\\Plate.exr\nc:/show/plate.exr');
    assert.equal(parsed.paths.length, 1);
});

test('Uses the configured Mac and Windows roots when the pasted path is from the other platform', () => {
    const { context, files } = setup();
    files['/Volumes/Show/shot/plate.exr'] = true;
    const file = context.toolboxImportMappedFile('Z:\\Show\\shot\\plate.exr', 'Z:\\Show', '/Volumes/Show');
    assert.equal(file.fsName, '/Volumes/Show/shot/plate.exr');
});

test('Imports remaining valid files after errors and always closes its undo group', () => {
    const { context, files, imported, alerts, events } = setup();
    files['/show/good.png'] = true;
    files['/show/bad.mov'] = 'throws';
    const result = context.toolboxImportAssets('/show/good.png\n/show/missing.exr\n/show/bad.mov', '', '');
    assert.equal(result.imported, 1);
    assert.deepEqual(imported, ['/show/good.png']);
    assert.deepEqual(events, ['begin:Import assets', 'end']);
    assert.equal(result.errors.length, 2);
    assert(alerts[0].includes('Imported 1 asset'));
    assert(alerts[0].includes('Not found'));
    assert(alerts[0].includes('unsupported format'));
});

test('Placeholder input does not open an empty undo group', () => {
    const { context, alerts, events } = setup();
    const result = context.toolboxImportAssets('Paths to files go here...', '', '');
    assert.equal(result.imported, 0);
    assert.deepEqual(events, []);
    assert(alerts[0].includes('Paste one or more'));
});

console.log(passed + ' import asset tests passed.');
