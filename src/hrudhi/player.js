import {makeMotionPlan,transformValue,poseAt} from './rig.js';
/** Owned, one-pass animations. No audio, AI or network calls. */
export function createHrudhiPlayer(svg,options={}){
 const plan=makeMotionPlan(options),animations=[];let disposed=false,speed=1;
 const reduced=options.reducedMotion??globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
 for(const [part,frames] of Object.entries(plan.channels)){
  const el=svg.querySelector(`[data-part="${part}"]`);if(!el)continue;
  const opacity=frames.some(f=>f.opacity!==undefined);
  const animation=el.animate(frames.map(f=>({offset:f.offset,...(opacity?{opacity:f.opacity}:{transform:transformValue(f)})})),{duration:plan.duration,fill:'both',easing:'linear'});
  animation.pause();animation.currentTime=0;animations.push(animation);
 }
 for(const el of svg.querySelectorAll('[data-viseme]')){
  if(!plan.speech.length)continue;
  const a=el.animate(plan.speech.map(f=>({offset:f.offset,opacity:f.shape===el.dataset.viseme?1:0,easing:'steps(1,end)'})),{duration:plan.duration,fill:'both'});a.pause();a.currentTime=0;animations.push(a);
 }
 const seek=t=>{if(disposed)return;const time=Math.max(0,Math.min(1,t))*plan.duration;for(const a of animations)a.currentTime=time;};
 if(reduced)seek(1);
 return {duration:plan.duration,reducedMotion:reduced,play(){if(disposed||reduced)return;for(const a of animations){if((a.currentTime||0)>=plan.duration)a.currentTime=0;a.play();}},pause(){for(const a of animations)a.pause();},seek,setSpeed(value){if(![.5,1,1.5].includes(value))throw Error('Unsupported playback speed');speed=value;for(const a of animations)a.updatePlaybackRate(value);},get progress(){return (animations[0]?.currentTime||0)/plan.duration;},get playing(){return animations.some(a=>a.playState==='running');},dispose(){disposed=true;for(const a of animations)a.cancel();animations.length=0;},get speed(){return speed;}};
}
/** Exported SVGs play once when opened, and freeze for reduced motion. */
export function animatedSvg(svg,options={}){
 const plan=makeMotionPlan(options),uid=svg.match(/data-hrudhi-rig="([^"]+)"/)[1];let css='';
 for(const [part,frames] of Object.entries(plan.channels)){
  const opacity=frames.some(f=>f.opacity!==undefined),name=`${uid}-${part}`;
  css+=`@keyframes ${name}{${frames.map(f=>`${f.offset*100}%{${opacity?'opacity:'+f.opacity:'transform:'+transformValue(f)}}`).join('')}}[data-hrudhi-rig="${uid}"] [data-part="${part}"]{animation:${name} ${plan.duration}ms linear 1 both}`;
 }
 for(const shape of new Set(plan.speech.map(f=>f.shape))){const name=`${uid}-mouth-${shape}`;css+=`@keyframes ${name}{${plan.speech.map(f=>`${f.offset*100}%{opacity:${f.shape===shape?1:0}}`).join('')}}[data-hrudhi-rig="${uid}"] [data-viseme="${shape}"]{animation:${name} ${plan.duration}ms steps(1,end) 1 both}`;}
 const end=poseAt(plan,1);css+='@media(prefers-reduced-motion:reduce){';
 for(const [part,v] of Object.entries(end)){if(part==='mouth')continue;css+=`[data-hrudhi-rig="${uid}"] [data-part="${part}"]{animation:none!important;${v.opacity!==undefined?'opacity:'+v.opacity:'transform:'+transformValue(v)}}`;}
 css+=`[data-hrudhi-rig="${uid}"] [data-viseme]{animation:none!important;opacity:0}[data-hrudhi-rig="${uid}"] [data-viseme="rest"]{opacity:1}}`;
 return svg.replace('</defs>',`<style>${css}</style></defs>`);
}
