import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const config=JSON.parse(await readFile(new URL('../firebase.json',import.meta.url)));
if(config.hosting.site!=='aroha-retreat'||config.hosting.public!=='dist')throw Error('Unexpected deployment target.');
const release=JSON.parse(await readFile(new URL('../dist/design/release.json',import.meta.url)));
if(release.name!=='Natura'||release.basePath!=='/design/')throw Error('Build Natura before deploying.');
const head=spawnSync('git',['rev-parse','HEAD'],{cwd:new URL('../',import.meta.url),encoding:'utf8'}).stdout.trim();
if(release.revision!==head||release.status!=='release'||release.hrudhiReview!=='alpha')throw Error('Build the current release revision with Hrudhi explicitly alpha before deploying.');
const website=JSON.parse(await readFile(new URL('../dist/website-release.json',import.meta.url)));
if(website.name!=='Aroha Retreat')throw Error('Build the root website before deploying the shared Hosting site.');
// The shared Hosting build must contain both Natura and the root Aroha website.
const custom=process.env.FIREBASE_CLI_PATH;
const result=spawnSync(custom?process.execPath:'firebase',[...(custom?[custom]:[]),'deploy','--only','hosting','--project','aroha-retreat','--non-interactive'],{stdio:'inherit',cwd:new URL('../',import.meta.url)});
if(result.error)throw result.error;process.exitCode=result.status??1;
