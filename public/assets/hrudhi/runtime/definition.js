export const KIT_VERSION='0.2.2';
export const chapters=[
 {id:'explorer',label:'Little Explorer',minAge:5,maxAge:7,anchorAge:5,headY:135,head:58,shoulder:214,hip:338,upperLeg:78,lowerLeg:57,upperArm:61,forearm:53,width:48,hair:'bob',costume:'pinafore'},
 {id:'naturalist',label:'Growing Naturalist',minAge:8,maxAge:10,anchorAge:8,headY:122,head:54,shoulder:198,hip:327,upperLeg:85,lowerLeg:61,upperArm:68,forearm:59,width:47,hair:'half-tied',costume:'overalls'},
 {id:'storyteller',label:'Young Storyteller',minAge:11,maxAge:13,anchorAge:11,headY:110,head:49,shoulder:181,hip:315,upperLeg:91,lowerLeg:67,upperArm:76,forearm:65,width:45,hair:'braid',costume:'kurta'},
 {id:'pathfinder',label:'Thoughtful Pathfinder',minAge:14,maxAge:16,anchorAge:14,headY:100,head:45,shoulder:169,hip:305,upperLeg:96,lowerLeg:72,upperArm:83,forearm:72,width:44,hair:'braid',costume:'kurta'},
 {id:'steward',label:'Young Steward',minAge:17,maxAge:17,anchorAge:17,headY:94,head:43,shoulder:162,hip:300,upperLeg:99,lowerLeg:74,upperArm:86,forearm:75,width:44,hair:'long-braid',costume:'kurta'}
];
export const seasons=['warm','monsoon','cool'];
export const expressions=['gentle','smile','curious','thoughtful','listening','delighted'];
export const views=['front','three-quarter','profile','back'];
export const visemes=['rest','A','E','O','U','M','F','L'];
export const motions={
 resting:{label:'Resting & breathing',duration:3200,purpose:'A quiet, explicitly played idle study.'},
 walking:{label:'Walking',duration:2800,purpose:'Two in-place gait cycles with opposing arms, knee flexion and weight transfer.'},
 talking:{label:'Talking (silent)',duration:3600,purpose:'Illustrative mouth shapes and small conversational hand gestures; not audio lip-sync.'},
 sitting:{label:'Sitting',duration:3600,purpose:'A seated pose with relaxed hands and a small head/listening response.'},
 storytelling:{label:'Storytelling',duration:5200,purpose:'A seated sketchbook pose, one page turn, mouth shapes and a describing hand.'},
 waving:{label:'Welcoming wave',duration:3200,purpose:'A raised forearm and two gentle wrist waves and a held finish.'},
 pointing:{label:'Guiding & pointing',duration:3200,purpose:'A deliberate open-handed directional cue; no flashing or screen takeover.'},
 gardening:{label:'Gardening',duration:4800,purpose:'A careful bend, watering-can tilt, poured water and recovery.'}
};
export function chapterForAge(age){if(!Number.isInteger(age)||age<5||age>17)throw Error('The reviewed scope is ages 5–17.');return chapters.find(c=>age>=c.minAge&&age<=c.maxAge);}
export function requireChapter(id){const chapter=chapters.find(c=>c.id===id);if(!chapter)throw Error('Unknown Hrudhi chapter.');return chapter;}
export const palette={skin:'#B97047',skinLight:'#D99465',skinShade:'#9E5639',hair:'#352B27',hairLight:'#64503F',iris:'#56341E',forest:'#294F38',leaf:'#819B62',cream:'#F5EBD8',bronze:'#9E7040',line:'#6B4932'};
