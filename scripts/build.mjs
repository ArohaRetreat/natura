import './build-original-preview.mjs';
import {cp,rm,readFile,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const root=new URL('../',import.meta.url),target=new URL('dist/design/',root),preview=new URL('dist-preview/design/',root);
await rm(target,{recursive:true,force:true});await cp(preview,target,{recursive:true});
for(const name of ['index.html','app.js']){const p=new URL(name,target);await writeFile(p,(await readFile(p,'utf8')).replaceAll('0.6.1-preview.1','0.6.1'));}
const release=JSON.parse(await readFile(new URL('release.json',target)));
Object.assign(release,{version:'0.6.1',hrudhiKitVersion:'0.3.0-alpha.1',hrudhiReview:'alpha',status:'release',productionUpdated:undefined,revision:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),farmAtlasVersion:'0.1.0'});
await writeFile(new URL('release.json',target),JSON.stringify(release));
const required=['hrudhi/NATIVE-STUDIES.html','assets/hrudhi/native-studies/Hrudhi-explorer-warm-expression-study-v5.psd','assets/hrudhi/native-studies/Hrudhi-Original-Feature-Study-v5.puppet','downloads/Hrudhi-Original-Art-Alpha.zip'];for(const name of required)await readFile(new URL(name,target));
console.log('Built Natura 0.6.1 with Hrudhi 0.3.0-alpha.1 at /design/.');
