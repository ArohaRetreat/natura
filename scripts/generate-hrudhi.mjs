import {mkdir,writeFile,readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chapters,seasons,motions,views,expressions,visemes,KIT_VERSION} from '../src/hrudhi/definition.js';
import {renderHrudhi,renderFace,makeMotionPlan} from '../src/hrudhi/rig.js';
import {animatedSvg} from '../src/hrudhi/player.js';
const root=new URL('../public/assets/hrudhi/',import.meta.url);
const write=async(path,data)=>{const url=new URL(path,root);await mkdir(new URL('.',url),{recursive:true});await writeFile(url,data);};
const animationJobs=[];
for(const c of chapters)for(const season of seasons){const key=`${c.id}-${season}`;
 await write(`rigs/${key}.svg`,renderHrudhi({chapter:c.id,season}));
 for(const view of views)await write(`turnarounds/${key}-${view}.svg`,renderHrudhi({chapter:c.id,season,view}));
 for(const state of Object.keys(motions)){
  const options={chapter:c.id,season,state},name=`${key}-${state}`,plan=makeMotionPlan(options);
  await write(`motion/${name}.svg`,animatedSvg(renderHrudhi(options),options));
  await write(`timelines/${name}.json`,JSON.stringify(plan));
  const frames=Math.ceil(plan.duration/1000*12);for(let i=0;i<frames;i++)await write(`.frames/${name}/${String(i).padStart(2,'0')}.svg`,renderHrudhi({...options,progress:i/(frames-1)}));
  animationJobs.push({name,frames,duration:plan.duration});
 }
}
for(const c of chapters){for(const expression of expressions)await write(`expressions/${c.id}-${expression}.svg`,renderFace({chapter:c.id,expression}));for(const viseme of visemes)await write(`mouths/${c.id}-${viseme}.svg`,renderFace({chapter:c.id,viseme}));}
await write('.animation-jobs.json',JSON.stringify(animationJobs));
await write('definition.json',JSON.stringify({schemaVersion:1,kitVersion:KIT_VERSION,status:'draft',review:'Family review pending',chapters,seasons,motions,views,expressions,visemes,referenceStyle:'Painterly AI-generated concept references',rigStyle:'Simplified editable vector interpretation; not layered painterly art',capabilities:{audio:false,aiBackend:false,superAdminBackend:false,realWeather:false},approvalDigestRule:'SHA-256 of each chapter review-bundle JSON; verify all member hashes server-side before activation'},null,2));
console.log('Generated 15 rigs, 60 turnaround studies, 70 facial studies and 120 one-pass motion studies.');
