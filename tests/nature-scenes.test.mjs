import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneSvg,sceneDefinitions,stageAt} from '../src/nature-scenes.js';
test('twelve semantic scenes have unique geometry and actual phase boundaries',()=>{
 assert.equal(new Set(Object.keys(sceneDefinitions).map(sceneSvg)).size,12);
 assert.match(sceneSvg('seed'),/seed-root/); assert.match(sceneSvg('leaf'),/drifting-leaf/);
 assert.match(sceneSvg('water'),/ring-three/); assert.match(sceneSvg('path'),/trail-walker/);
 assert.equal(stageAt('seed',.1),'Root emerges');assert.equal(stageAt('seed',.5),'Shoot rises');assert.equal(stageAt('seed',.8),'Leaves unfold');
 assert.equal(stageAt('water',1),'Water stills');assert.throws(()=>sceneSvg('unknown'));
});

test('additional studies have bounded, ordered narrative phases',()=>{for(const [kind,spec] of Object.entries(sceneDefinitions)){assert.equal(spec.stages.length,4);if(!spec.phaseMs)continue;assert.equal(spec.phaseMs[0],0);for(let i=0;i<4;i++){assert(spec.phaseMs[i]<spec.duration);if(i)assert(spec.phaseMs[i]>spec.phaseMs[i-1]);assert.equal(stageAt(kind,(spec.phaseMs[i]+.1)/spec.duration),spec.stages[i]);}assert.equal(stageAt(kind,1),spec.stages[3]);}assert.equal(stageAt('dew',.6),'Drop releases');assert.equal(stageAt('mycelium',.9),'Network rests');});
