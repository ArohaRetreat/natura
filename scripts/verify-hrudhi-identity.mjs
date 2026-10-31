import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
const originalLockSha='9d931919283ad3165f735e27ae0530ac65fe0a47ef202b5fcbe51548b7fe1525';
const originalRevision='3f4884e522e98ce9dd731918b4deb71416a509b5';
export function validateIdentityDigests(lock,{references,rigSource}){
 if(lock.id!=='hrudhi-original-v1'||lock.sourceRevision!==originalRevision)throw Error('Hrudhi identity source was substituted');
 if(Object.keys(lock.referenceSha256).length!==30)throw Error('All original identity masters must be pinned');
 for(const [path,hash] of Object.entries(lock.referenceSha256))if(references[path]!==hash)throw Error('Hrudhi face master changed: '+path);
 if(rigSource!==lock.rigSourceSha256)throw Error('Original Hrudhi facial-rig source changed');
 return true;
}
export async function verifyOriginalIdentity(){const root=new URL('../',import.meta.url),base=new URL('public/assets/hrudhi/',root),lockBytes=await readFile(new URL('identity-lock.json',base)),lock=JSON.parse(lockBytes),sha=b=>createHash('sha256').update(b).digest('hex'),references={};if(sha(lockBytes)!==originalLockSha)throw Error('Approved original identity lock was changed');for(const file of Object.keys(lock.referenceSha256))references[file]=sha(await readFile(new URL('references/'+file,base)));validateIdentityDigests(lock,{references,rigSource:sha(await readFile(new URL('src/hrudhi/rig.js',root)))});console.log('Original Hrudhi identity verified: 30 exact reference masters and original facial rig.');return lock;}
if(process.argv[1]===new URL(import.meta.url).pathname)await verifyOriginalIdentity();
