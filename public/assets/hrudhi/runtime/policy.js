import {chapters,seasons,KIT_VERSION} from './definition.js';
const idPattern=/^[a-z][a-z0-9-]{0,59}$/;
export function validateGrowthPolicy(input){
 if(!input||input.schemaVersion!==1||!Number.isInteger(input.revision)||input.revision<1)throw Error('Invalid policy revision.');
 if(!['automatic-approved-only','review-before-publish'].includes(input.publishMode))throw Error('Invalid publication mode.');
 if(typeof input.allowSkip!=='boolean')throw Error('Explicit chapter-skip policy required.');
 if(!Array.isArray(input.chapters)||input.chapters.length!==chapters.length)throw Error('All five chapter rules are required.');
 const seen=new Set();const rules=input.chapters.map(rule=>{if(!chapters.some(c=>c.id===rule.id)||seen.has(rule.id))throw Error('Unknown or duplicate chapter rule.');seen.add(rule.id);if(!Array.isArray(rule.requires)||rule.requires.length>20||rule.requires.some(id=>typeof id!=='string'||!idPattern.test(id))||new Set(rule.requires).size!==rule.requires.length)throw Error('Invalid milestone requirements.');return {id:rule.id,requires:[...rule.requires]};});
 return {schemaVersion:1,revision:input.revision,publishMode:input.publishMode,allowSkip:input.allowSkip,chapters:rules};
}
// This pure policy is shared server-side. Browser previews are never publication authority.
export function resolveGrowth({policy:source,currentChapterId=null,completedMilestoneIds=[],reviews=[],installedChapterDigests={},recommendation=null,expectedRevision,actualRevision}){
 const policy=validateGrowthPolicy(source);if(!Number.isInteger(expectedRevision)||expectedRevision!==actualRevision||policy.revision!==actualRevision)return {action:'blocked',reason:'revision-conflict',activeChapterId:currentChapterId,eligibleChapterIds:[]};
 const current=chapters.findIndex(c=>c.id===currentChapterId);if(currentChapterId!==null&&current<0)throw Error('Unknown current chapter.');
 if(!Array.isArray(completedMilestoneIds)||completedMilestoneIds.length>100||completedMilestoneIds.some(id=>typeof id!=='string'||!idPattern.test(id)))throw Error('Invalid completed milestone IDs.');
 if(!Array.isArray(reviews)||reviews.length>chapters.length)throw Error('Invalid review set.');
 const reviewMap=new Map();for(const review of reviews){if(!chapters.some(c=>c.id===review.chapterId)||reviewMap.has(review.chapterId)||!['draft','approved','withdrawn'].includes(review.status))throw Error('Invalid or duplicate review.');reviewMap.set(review.chapterId,review);}
 const done=new Set(completedMilestoneIds);const qualifies=chapter=>{const review=reviewMap.get(chapter.id);return review?.status==='approved'&&review.kitVersion===KIT_VERSION&&typeof review.assetDigest==='string'&&/^[a-f0-9]{64}$/.test(review.assetDigest)&&installedChapterDigests?.[chapter.id]===review.assetDigest&&policy.chapters.find(r=>r.id===chapter.id).requires.every(id=>done.has(id));};
 const eligible=chapters.filter((chapter,index)=>{if(index<Math.max(0,current)||!qualifies(chapter))return false;if(!policy.allowSkip){if(index>current+1)return false;for(let i=0;i<index;i++)if(!qualifies(chapters[i]))return false;}return true;}).map(c=>c.id);
 const result={activeChapterId:current>=0&&qualifies(chapters[current])?currentChapterId:null,eligibleChapterIds:eligible,policyRevision:policy.revision};
 if(!eligible.length)return {...result,action:'blocked',reason:'no-reviewed-eligible-chapter'};
 if(!recommendation)return {...result,action:'awaiting-recommendation',reason:'no-ai-recommendation'};
 if(recommendation.schemaVersion!==1||recommendation.policyRevision!==policy.revision||typeof recommendation.rationale!=='string'||recommendation.rationale.length>500)return {...result,action:'blocked',reason:'invalid-recommendation'};
 if(!eligible.includes(recommendation.chapterId))return {...result,action:'blocked',reason:'recommendation-not-eligible'};
 if(recommendation.chapterId===currentChapterId)return {...result,action:'retain',reason:'current-chapter-selected'};
 if(policy.publishMode==='review-before-publish')return {...result,action:'review-required',proposedChapterId:recommendation.chapterId,reason:'publication-review'};
 return {...result,action:'publish',nextChapterId:recommendation.chapterId,assetDigest:reviewMap.get(recommendation.chapterId).assetDigest,effective:'next-visitor-session',reason:'approved-eligible-recommendation'};
}
export function chooseWardrobe({month,override=null}){if(override!==null){if(!seasons.includes(override))throw Error('Unknown wardrobe override.');return override;}if(!Number.isInteger(month)||month<1||month>12)throw Error('Invalid retreat-local month.');return month>=3&&month<=5?'warm':month>=6&&month<=10?'monsoon':'cool';}
export const examplePolicy={schemaVersion:1,revision:1,publishMode:'automatic-approved-only',allowSkip:false,chapters:chapters.map((c,i)=>({id:c.id,requires:i?[`chapter-${i+1}-milestone`]:[]}))};
