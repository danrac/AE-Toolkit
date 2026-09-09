const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, '../HelperScripts/UTILITY_Update.jsx'), 'utf8');
let passed = 0;
function test(name, fn) {fn(); console.log('PASS ' + name); passed++;}
function setup() {
    const data = {}, alerts = [], events = [];
    function Folder(p) {this.fsName = p; this.exists = true;}
    Object.defineProperty(Folder.prototype, 'parent', {get() {return new Folder(path.dirname(this.fsName));}});
    function File(p) {this.fsName=p; this.name=path.basename(p);}
    Object.defineProperties(File.prototype, {parent:{get(){return new Folder(path.dirname(this.fsName));}},exists:{get(){return this.fsName in data;}},length:{get(){return (data[this.fsName] || '').length;}}});
    File.prototype.open = function(mode) {if(mode==='w') data[this.fsName]='';return true;};
    File.prototype.read = function(){return data[this.fsName];};
    File.prototype.write = function(s){data[this.fsName]=s;return true;};
    File.prototype.close = function(){};
    function Window(){this.add=()=>({});this.show=()=>{};this.update=()=>{};this.close=()=>events.push('close');}
    const c={TOOLBOX_TEST_MODE:true,File,Folder,Window,$:{os:'Macintosh',fileName:'/install/Toolbox_Assets/HelperScripts/UTILITY_Update.jsx'},system:{callSystem(){return '';}},alert:m=>alerts.push(m)};
    vm.createContext(c);vm.runInContext(source,c);
    return {c,data,alerts,events,File};
}
const metadata={tag_name:'v2.2.7',draft:false,prerelease:false,zipball_url:'https://api.github.com/repos/danrac/AE-Toolkit/zipball/v2.2.7',assets:[{name:'AE-Toolkit-v2.2.7.zip',state:'uploaded',size:123,browser_download_url:'https://github.com/danrac/AE-Toolkit/releases/download/v2.2.7/AE-Toolkit-v2.2.7.zip'}]};
test('Strict release JSON parses escapes, booleans and nested assets without evaluation',()=>{
 const {c}=setup();assert.equal(c.toolboxUpdateJSON(JSON.stringify(metadata)).assets[0].size,123);assert.equal(c.toolboxUpdateJSON('"Hello\\u263a\\n"'),'Hello☺\n');for(const s of ['{"a":1,}','[1,]','{}; evil()','{"a":undefined}','"bad\n"'])assert.throws(()=>c.toolboxUpdateJSON(s));
});
test('Selects versioned ZIP and supports GitHub source archive fallback',()=>{const {c}=setup();assert.equal(c.toolboxUpdateRelease(metadata).size,123);assert.equal(c.toolboxUpdateRelease({...metadata,assets:[]}).url,metadata.zipball_url);});
test('Rejects prereleases, invalid versions and downloads outside this repository',()=>{const {c}=setup();for(const m of [{...metadata,prerelease:true},{...metadata,tag_name:'latest'},{...metadata,assets:[],zipball_url:'https://evil.example/update.zip'}])assert.throws(()=>c.toolboxUpdateRelease(m));assert.equal(c.toolboxUpdateAllowedURL('https://github.com/danrac/AE-Toolkit/releases/download/v2.2.7/a.zip;evil'),false);});
test('HTTP 200 without successful transfer marker is an incomplete download',()=>{const {c,data,File}=setup();data['/work/archive']='abc';c.system.callSystem=()=> 'TOOLBOX_HTTP:200 curl: interrupted';const r=c.toolboxUpdateFetch(metadata.zipball_url,new File('/work/archive'),20);assert.equal(r.status,200);assert.equal(r.complete,false);});
test('Transport uses HTTPS verification, redirect restrictions and timeout',()=>{const {c,data,File}=setup();data['/work/archive']='abc';let command;c.system.callSystem=x=>{command=x;return 'TOOLBOX_HTTP:200TOOLBOX_TRANSFER_OK';};assert.equal(c.toolboxUpdateFetch(metadata.zipball_url,new File('/work/archive'),20).complete,true);assert(command.includes('--proto-redir'));assert(command.includes('--max-time'));assert(!command.includes('--insecure'));});
test('Windows transport quotes arguments and checks curl exit status',()=>{const {c,data,File}=setup();c.$.os='Windows';data["/work/release's.zip"]='abc';c.system.callSystem=()=> 'TOOLBOX_HTTP:200TOOLBOX_TRANSFER_OK';c.toolboxUpdateFetch(metadata.zipball_url,new File("/work/release's.zip"),20);assert(data['/work/download.ps1'].includes("release''s.zip"));assert(data['/work/download.ps1'].includes('$LASTEXITCODE -eq 0'));});
test('Download length and SHA256 mismatch prevent installation',()=>{const {c,data,File}=setup();data['/work/archive']='abc';const file=new File('/work/archive');assert.throws(()=>c.toolboxUpdateVerifyDownload(file,{size:4}),/incomplete/);c.system.callSystem=()=> 'b'.repeat(64)+'  file';assert.throws(()=>c.toolboxUpdateVerifyDownload(file,{size:3,digest:'sha256:'+'a'.repeat(64)}),/checksum/);c.toolboxUpdateVerifyDownload(file,{size:3,digest:'sha256:'+'b'.repeat(64)});});
function flow(options={}) {
 const state=setup(),{c,data,events}=state;
 c.toolboxUpdateEnsureFolder=()=>{};
 c.toolboxUpdateFetch=(url,file)=>{events.push(url);if(url==='https://api.github.com/')return {status:options.offline?0:200,complete:!options.offline};if(url.includes('/latest')){data[file.fsName]=JSON.stringify(metadata);return {status:options.http||200,complete:true};}return {status:200,complete:!options.partial};};
 c.toolboxUpdateVersion=file=>file.fsName==='/install/Toolbox.jsx'?(options.installed||'2.2.6'):(options.packageVersion||'2.2.7');
 c.toolboxUpdateVerifyDownload=()=>events.push('verify');c.toolboxUpdateExtract=()=>events.push('extract');c.toolboxUpdateFindRoot=()=>({fsName:'/package'});c.toolboxUpdatePlan=()=>{events.push('plan');return [];};c.toolboxUpdateInstall=()=>{events.push('install');if(options.failInstall)throw Error('write failed; previous files restored');};c.toolboxUpdateMain();return state;
}
test('Offline check alerts before release lookup or installation',()=>{const {alerts,events}=flow({offline:true});assert(alerts[0].includes('No internet'));assert.equal(events.filter(e=>e.startsWith('https')).length,1);assert(!events.includes('install'));});
test('No release and rate limit produce distinct alerts without installation',()=>{for(const code of [404,403,429]){const {alerts,events}=flow({http:code});assert(alerts[0].includes(code===404?'No published':'limiting'));assert(!events.includes('install'));}});
test('Up-to-date installation does not download or install',()=>{const {alerts,events}=flow({installed:'2.2.7'});assert(alerts[0].includes('already up to date'));assert(!events.includes('verify'));assert(!events.includes('install'));});
test('Partial download and tag/version mismatch abort before replacing files',()=>{for(const options of [{partial:true},{packageVersion:'2.2.6'}]){const {alerts,events}=flow(options);assert(alerts[0].includes('did not complete'));assert(!events.includes('install'));}});
test('Successful update verifies, installs once, and requests all script windows reopen',()=>{const {alerts,events}=flow();assert(events.indexOf('verify')<events.indexOf('extract'));assert.equal(events.filter(e=>e==='install').length,1);assert(alerts[0].includes('has been installed'));assert(alerts[0].includes('Tools or Settings'));assert(alerts[0].includes('relaunch Toolbox'));});
test('Failed installation does not report success or restart instruction',()=>{const {alerts}=flow({failInstall:true});assert(alerts[0].includes('did not complete'));assert(!alerts[0].includes('has been installed'));});
console.log(passed+' online update tests passed.');
