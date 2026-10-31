import {renderMotionCatalogue} from './render-motion-catalogue.mjs';
import {renderSeasonGuide} from './render-season-guide.mjs';
import {mkdir,cp,copyFile,readFile,rm,writeFile} from 'node:fs/promises';
import {sceneSvg,sceneDefinitions} from '../src/nature-scenes.js';
const root=new URL('../',import.meta.url),dist=new URL('dist/',root),target=new URL('design/',dist);
await renderSeasonGuide();await renderMotionCatalogue();
await rm(dist,{recursive:true,force:true});await mkdir(target,{recursive:true});await cp(new URL('public/',root),target,{recursive:true});
for(const file of ['index.html','styles.css','app.js','model.js','site-renderer.js','component-patterns.js','exports.js','nature-scenes.js','additional-scenes.js','seasonal.js','weather-landscape.js','season-studio.js'])await copyFile(new URL('src/'+file,root),new URL(file,target));
for(const kind of Object.keys(sceneDefinitions)){const path=new URL(`assets/scenes/${kind}.svg`,target);await mkdir(new URL('assets/scenes/',target),{recursive:true});await writeFile(path,sceneSvg(kind));await writeFile(new URL(`public/assets/scenes/${kind}.svg`,root),sceneSvg(kind));}
const icons=JSON.parse(await readFile(new URL('public/data/icons.json',root),'utf8'));if(Object.keys(icons).length!==48)throw Error('The icon catalogue is incomplete.');
for(const language of ['english','kannada','bilingual'])for(const layout of ['full','primary','horizontal','wordmark'])for(const mode of ['colour','forest','black','white'])for(const ext of ['svg','pdf'])await readFile(new URL(`public/assets/logos/${language}/aroha-${layout}-${mode}.${ext}`,root));
await copyFile(new URL('LICENSE',root),new URL('LICENSE.txt',target));
await copyFile(new URL('config/retreat-location.json',root),new URL('data/retreat-location.json',target));
await writeFile(new URL('release.json',target),JSON.stringify({name:'Natura',version:'0.3.0',basePath:'/design/',scenes:Object.keys(sceneDefinitions)}));
console.log('Built Natura v0.3.0 at /design/: 48 icons, 2 illustrations, 12 independent nature timelines and layered weather.');
