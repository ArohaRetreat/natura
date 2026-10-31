import {mkdir,cp,copyFile,readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),dist=new URL('dist/',root);
await mkdir(dist,{recursive:true});await cp(new URL('public/',root),dist,{recursive:true});
for(const file of ['index.html','styles.css','app.js','model.js','site-renderer.js','exports.js'])await copyFile(new URL('src/'+file,root),new URL(file,dist));
const icons=JSON.parse(await readFile(new URL('public/data/icons.json',root),'utf8'));if(Object.keys(icons).length!==48)throw Error('The icon catalogue is incomplete.');
console.log('Built Aroha Design Studio: nine routes, 48 custom icons, browser-local page builder.');
for(const language of ['english','kannada','bilingual'])for(const layout of ['full','primary','horizontal','wordmark'])for(const mode of ['colour','forest','black','white'])for(const ext of ['svg','pdf'])await readFile(new URL(`public/assets/logos/${language}/aroha-${layout}-${mode}.${ext}`,root));
console.log('Verified all 48 logo variants in SVG and PDF.');
