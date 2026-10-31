// Natura weather contract v1: retreat-local observations, never visitor geolocation.
export const seasonalCopy={neutral:{title:'Return to a slower rhythm.',accent:'A little closer to nature',note:'An evergreen composition for unknown seasons or unavailable weather.'},warm:{title:'Let the light linger.',accent:'The long, golden hours',note:'Warm-season editorial direction: open space, seed-gold accents and a measured handwritten line.'},rain:{title:'Listen to the earth awaken.',accent:'After the rain',note:'Rain-season editorial direction: deep green, softened botanical textures and an expressive italic serif.'},cool:{title:'Make room for stillness.',accent:'Mornings, softly held',note:'Cool-season editorial direction: clear white space, quieter contrast and generous serif typography.'}};
const codes=new Set([0,1,2,3,45,48,51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99]);
export function validateObservation(value,now=Date.now()){
 if(!value||value.schemaVersion!==1)throw Error('Unsupported weather observation.');
 const time=Date.parse(value.observedAt);if(!Number.isFinite(time)||time>now+300000)throw Error('Invalid observation time.');
 for(const [key,min,max] of [['temperatureC',-80,60],['windKmh',0,300],['precipitationMm',0,500]])if(typeof value[key]!=='number'||!Number.isFinite(value[key])||value[key]<min||value[key]>max)throw Error('Invalid '+key+'.');
 if(!codes.has(value.weatherCode)||typeof value.isDay!=='boolean')throw Error('Invalid weather condition.');
 return {schemaVersion:1,observedAt:new Date(time).toISOString(),temperatureC:value.temperatureC,windKmh:value.windKmh,precipitationMm:value.precipitationMm,weatherCode:value.weatherCode,isDay:value.isDay};
}
export function resolveAtmosphere({observation,now=Date.now(),season='neutral',reducedMotion=false}={}){
 const selected=Object.hasOwn(seasonalCopy,season)?season:'neutral';
 let data;try{data=validateObservation(observation,now);}catch{return {season:selected,condition:'unavailable',scene:'neutral',motion:false,status:'unavailable'};}
 if(now-Date.parse(data.observedAt)>1800000)return {season:selected,condition:'unavailable',scene:'neutral',motion:false,status:'stale'};
 const code=data.weatherCode;const severe=code>=95||data.windKmh>=40;
 const frozen=[56,57,66,67,71,73,75,77,85,86].includes(code);
 const condition=severe?'unsettled':frozen?'unavailable':[45,48].includes(code)?'mist':code>=51&&code<=86?'rain':data.windKmh>=15?'breeze':code>=2?'cloud':data.isDay?'sun':'night';
 // A severe observation never triggers celebratory rain or wind effects. This is not an alerting service.
 return {season:selected,condition,scene:severe||frozen?'neutral':condition,motion:!reducedMotion&&!severe&&['sun','mist','rain','breeze','night'].includes(condition),status:'fresh',observation:data};
}
export function atmosphereSvg(scene){
 const line='<path d="M20 171 Q106 148 199 171 T340 168" fill="none" stroke="#86613B" stroke-width="1.4"/><path d="M47 167 V125 M47 141 Q19 139 27 116 Q48 116 47 141 M47 148 Q74 148 71 126 Q50 128 47 148" fill="#DDE5D7" stroke="#163E2D" stroke-width="1.2"/>';
 const sun='<g class="atmo-rays" transform-origin="270px 62px" stroke="#B0914B" stroke-width="1.5"><path d="M270 25v10 M270 89v10 M233 62h10 M297 62h10 M244 36l7 7 M289 81l7 7 M244 88l7-7 M289 43l7-7"/></g><circle cx="270" cy="62" r="18" fill="#F4E7C7" stroke="#86613B"/>';
 const rain='<path d="M161 64 Q159 36 181 35 Q192 17 213 36 Q245 30 245 60Z" fill="#DDE5D7" stroke="#163E2D"/>'+Array.from({length:12},(_,i)=>`<path class="atmo-drop" d="M${143+i*9} ${72+(i%3)*13}l-5 13" stroke="#60833D" stroke-width="1.3"/>`).join('');
 const mist=[0,1,2].map((_,i)=>`<path class="atmo-mist" d="M${86+i*19} ${73+i*22} Q170 ${54+i*22} 281 ${73+i*22}" fill="none" stroke="#A6B9A0" stroke-width="${8-i*2}" opacity=".35"/>`).join('');
 const breeze=[0,1,2].map((_,i)=>`<g class="atmo-leaf" transform-origin="${150+i*45}px ${60+i*28}px"><path d="M${140+i*45} ${70+i*28}q-4-25 23-28 q4 26-23 28Z" fill="#60833D"/><path d="M${141+i*45} ${69+i*28}l20-25" stroke="#DDE5D7" stroke-width="1"/></g>`).join('');
 const night='<path d="M269 31 A26 26 0 1 0 299 62 A24 24 0 0 1 269 31" fill="#E9E9DB" stroke="#163E2D"/>'+[0,1,2].map((_,i)=>`<circle class="atmo-star" cx="${144+i*39}" cy="${37+i%2*29}" r="1.8" fill="#86613B"/>`).join('');
 const cloud='<path d="M154 91 Q140 65 166 61 Q179 36 205 59 Q240 51 246 85Z" fill="#E6EBE2" stroke="#A6B9A0"/>';
 return `<svg class="atmosphere-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" role="img" aria-label="${scene==='neutral'?'Quiet botanical landscape':scene+' atmosphere study'}">${line}${({sun,rain,mist,breeze,night,cloud})[scene]||'<path d="M109 150 Q176 94 239 150" fill="none" stroke="#DDE5D7" stroke-width="2"/>'}</svg>`;
}
export function playAtmosphere(root,scene,{reducedMotion=false,onFinish=()=>{}}={}){
 const owned=[];if(reducedMotion){onFinish();return ()=>{};}
 const animate=(node,keyframes,opts)=>{const a=node.animate(keyframes,{duration:4800,fill:'none',easing:'linear',...opts});owned.push(a);};
 if(scene==='sun')for(const node of root.querySelectorAll('.atmo-rays'))animate(node,[{transform:'rotate(0deg)'},{transform:'rotate(20deg)'}],{});
 if(scene==='rain')for(const [i,node] of [...root.querySelectorAll('.atmo-drop')].entries())animate(node,[{transform:'translate(0px,-10px)',opacity:0},{transform:'translate(-8px,20px)',opacity:.7,offset:.4},{transform:'translate(-21px,64px)',opacity:0}],{duration:1700,delay:i*180});
 if(scene==='mist')for(const [i,node] of [...root.querySelectorAll('.atmo-mist')].entries())animate(node,[{transform:'translateX(-12px)',opacity:.12},{transform:'translateX(8px)',opacity:.38,offset:.5},{transform:'translateX(22px)',opacity:.12}],{delay:i*120});
 if(scene==='breeze')for(const [i,node] of [...root.querySelectorAll('.atmo-leaf')].entries())animate(node,[{transform:'translate(0px,0px) rotate(-8deg)'},{transform:'translate(18px,-9px) rotate(12deg)',offset:.45},{transform:'translate(0px,0px) rotate(-8deg)'}],{delay:i*180,easing:'cubic-bezier(.77,0,.175,1)'});
 if(scene==='night')for(const [i,node] of [...root.querySelectorAll('.atmo-star')].entries())animate(node,[{opacity:.4},{opacity:.8,offset:.5},{opacity:.4}],{delay:i*160});
 let cancelled=false;Promise.all(owned.map(a=>a.finished.catch(()=>{}))).then(()=>{if(!cancelled)onFinish();});
 return ()=>{cancelled=true;for(const a of owned)a.cancel();};
}
