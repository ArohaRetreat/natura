export {atmosphereSvg,playAtmosphere} from './weather-landscape.js';
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
 return {season:selected,condition,scene:severe||frozen?'neutral':condition,motion:!reducedMotion&&!severe&&['sun','mist','rain','breeze','night','cloud'].includes(condition),status:'fresh',observation:data};
}
