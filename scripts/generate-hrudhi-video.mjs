import {mkdir,writeFile} from 'node:fs/promises';
import {renderHrudhi} from '../src/hrudhi/rig.js';import {motions} from '../src/hrudhi/definition.js';import {characterVideos} from '../src/hrudhi/library.js';
const root=new URL('../public/assets/hrudhi/.video-frames/',import.meta.url),fps=24;
const xml=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const inside=s=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
for(const video of characterVideos){const out=new URL(video.id+'/',root);await mkdir(out,{recursive:true});for(let frame=0;frame<video.duration*fps;frame++){
 const time=frame/fps,t=time/video.duration;let state=video.state,progress=Math.min(1,time/(motions[state].duration/1000)),x=120;
 if(video.id==='pathfinder-walk'){state=time<5.6?'walking':'resting';progress=state==='walking'?(time%2.8)/2.8:(time-5.6)/1.4;x=70+Math.min(1,time/5.6)*360;}

 const character=inside(renderHrudhi({chapter:video.chapter,season:video.season,state,progress,uid:'film-'+video.id}));
 const trees=Array.from({length:5},(_,i)=>{const tx=650+i*130,ty=380+(i%2)*35,scale=.7+(i%3)*.1;return `<g transform="translate(${tx} ${ty}) scale(${scale})"><ellipse cx="0" cy="214" rx="53" ry="5" fill="#E4EAD8"/><path d="M0 210V35M0 115L-55 55M0 95L50 38" stroke="#B7B997" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-85 60Q-127-8-62-38Q-40-104 20-70Q93-93 104-19Q153 30 94 76Q64 116 0 82Q-62 113-85 60Z" fill="${i%2?'#EBEFDF':'#E1E8D3'}" stroke="#D4DFC3"/><path d="M0 35V210" stroke="#B7B997" stroke-width="8"/></g>`;}).join('');
 const shadow=`<ellipse cx="${x+160}" cy="642" rx="105" ry="7" fill="#E7EBD9"/>`;
 const textX=video.id==='pathfinder-walk'?820:560;const titleLines=video.title==='A story under the trees'?['A story under','the trees']:video.title==='Along the orchard path'?['Along the','orchard path']:video.title==='Care for a seedling'?['Care for','a seedling']:[video.title];
 const caption=video.id==='naturalist-garden'?'Care begins with one small thing.':video.id==='storyteller-book'?'A page, a pause, a new observation.':video.id==='pathfinder-walk'?'Follow the quiet paths between the trees.':video.id==='steward-canopy'?'Look up. There is a whole world above us.':'Come a little closer to nature.';
 const film=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><rect width="1280" height="720" fill="#FFFFFF"/><path d="M0 660Q320 607 620 651Q969 699 1280 620V720H0Z" fill="#F4F6EE"/>${trees}${shadow}<g transform="translate(${x} 152)">${character}</g><text x="${textX}" y="147" font-family="Arial" font-size="14" letter-spacing="3" fill="#6C7F56">HRUDHI / AROHA RETREAT</text>${titleLines.map((line,i)=>`<text x="${textX}" y="${221+i*61}" font-family="Georgia" font-size="48" fill="#294F38">${xml(line)}</text>`).join('')}<text x="${textX}" y="${titleLines.length>1?335:285}" font-family="Arial" font-size="19" fill="#53614E">${xml(caption)}</text><text x="60" y="697" font-family="Arial" font-size="12" fill="#66755E">DRAFT CHARACTER STUDY / FAMILY REVIEW PENDING / SILENT VECTOR FILM</text></svg>`;
 await writeFile(new URL(`${String(frame).padStart(4,'0')}.svg`,out),film);
 // Alpha counterpart is the isolated action, not the full film scene.
 await writeFile(new URL(`${String(frame).padStart(4,'0')}-alpha.svg`,out),renderHrudhi({chapter:video.chapter,season:video.season,state:video.state,progress:Math.min(1,time/(motions[video.state].duration/1000)),uid:'alpha-'+video.id}));
 }
}
await writeFile(new URL('../.video-jobs.json',root),JSON.stringify({fps,videos:characterVideos},null,2));console.log('Prepared five 24 fps character films and isolated alpha-video sources.');
