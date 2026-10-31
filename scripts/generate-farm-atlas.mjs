import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {farmIconList,farmIcons,farmIconSvg,farmContext,ATLAS_VERSION} from '../src/farm-atlas/icons.js';
import {animalDefinitions,renderAnimal,animalKeyframes} from '../src/farm-atlas/animals.js';
const root=new URL('../',import.meta.url),base=new URL('public/assets/farm-atlas/',root);
const write=async(path,data)=>{const url=new URL(path,base);await mkdir(new URL('.',url),{recursive:true});await writeFile(url,data);};
for(const icon of farmIconList)for(const weight of ['regular','strong'])await write(`icons/${weight}/${icon.id}.svg`,farmIconSvg(icon.id,{size:24,weight,color:'#294F38',label:icon.label}));
// Extract complete icon child markup; do not split on shape closing brackets.
await write('farm-icons.svg',`<svg xmlns="http://www.w3.org/2000/svg"><defs>${farmIconList.map(icon=>`<symbol id="farm-${icon.id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${farmIconSvg(icon.id).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</symbol>`).join('')}</defs></svg>`);
await write('catalogue.json',JSON.stringify({schemaVersion:1,version:ATLAS_VERSION,context:farmContext,icons:farmIconList,animals:animalDefinitions},null,2));
await mkdir(new URL('public/data/',root),{recursive:true});const existing=JSON.parse(await readFile(new URL('public/data/icons.json',root),'utf8'));const core=Object.fromEntries(Object.entries(existing).filter(([id])=>!id.startsWith('farm-atlas-')));if(Object.keys(core).length!==48)throw Error('Retained core icon library changed unexpectedly');
for(const icon of farmIconList)core['farm-atlas-'+icon.id]={label:icon.label,category:icon.group,aliases:icon.tags,nodes:icon.nodes};await writeFile(new URL('public/data/icons.json',root),JSON.stringify(core,null,2)+'\n');
for(const d of animalDefinitions){await write(`animals/${d.id}.svg`,renderAnimal(d.id));await write(`timelines/${d.id}.json`,JSON.stringify(animalKeyframes(d.id)));for(let i=0;i<36;i++)await write(`.frames/${d.id}/${String(i).padStart(2,'0')}.svg`,renderAnimal(d.id,{progress:i/35}));}
await write('README.md',await readFile(new URL('docs/farm-atlas/CONTRACT.md',root),'utf8'));console.log('Generated 96 farm icons, 16 editable animal studies and combined 144-icon service catalogue.');
