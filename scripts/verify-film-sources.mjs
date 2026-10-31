import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {verifyOriginalIdentity} from './verify-hrudhi-identity.mjs';
export function validateFilmSources(manifest,lock,references){
 if(manifest.identity!==lock.id||manifest.sourceRevision!==lock.sourceRevision||manifest.films.length!==5)throw Error('Invalid original-art film provenance');
 const ids=new Set();
 for(const film of manifest.films){
  if(ids.has(film.id)||!/^[a-z]+-[a-z]+$/.test(film.id))throw Error('Invalid film ID');ids.add(film.id);
  const expected=`references/${film.chapter}-${film.season}.png`;
  if(film.reference!==expected||film.referenceSha256!==lock.referenceSha256[expected.slice(11)]||references[expected]!==film.referenceSha256||film.representation!=='unchanged-original-illustration'||film.characterMotion!=='none')throw Error('Film character must use its exact original artwork: '+film.id);
 }
 return true;
}
export async function verifyFilmSources(){const lock=await verifyOriginalIdentity(),base=new URL('../public/assets/hrudhi/',import.meta.url),manifest=JSON.parse(await readFile(new URL('videos/source-manifest.json',base))),references={};for(const film of manifest.films){if(!/^references\/[a-z]+-(warm|monsoon|cool)\.png$/.test(film.reference))throw Error('Invalid film reference path');references[film.reference]=createHash('sha256').update(await readFile(new URL(film.reference,base))).digest('hex');}validateFilmSources(manifest,lock,references);return true;}
