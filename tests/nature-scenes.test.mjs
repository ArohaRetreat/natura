import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneSvg,sceneDefinitions,stageAt} from '../src/nature-scenes.js';
test('four semantic scenes have unique geometry and actual phase boundaries',()=>{
 assert.equal(new Set(Object.keys(sceneDefinitions).map(sceneSvg)).size,4);
 assert.match(sceneSvg('seed'),/seed-root/); assert.match(sceneSvg('leaf'),/drifting-leaf/);
 assert.match(sceneSvg('water'),/ring-three/); assert.match(sceneSvg('path'),/trail-walker/);
 assert.equal(stageAt('seed',.1),'Root emerges');assert.equal(stageAt('seed',.5),'Shoot rises');assert.equal(stageAt('seed',.8),'Leaves unfold');
 assert.equal(stageAt('water',1),'Water stills');assert.throws(()=>sceneSvg('unknown'));
});
