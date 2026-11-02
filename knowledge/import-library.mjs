import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import path from 'node:path';
const folder=path.resolve(import.meta.dirname,'generated');await mkdir(folder,{recursive:true});
const file=path.join(folder,'library.json');
let entries=[];try{entries=JSON.parse(await readFile(file,'utf8')).entries;}catch{entries=JSON.parse(await readFile(new URL('pilot.json',import.meta.url),'utf8')).entries;}
const records=new Map(entries.map(x=>[x.id,x]));
const requested=process.argv.find(x=>x.startsWith('--max-records='));
const maxRecords=requested?Number(requested.split('=')[1]):1000;
if(!Number.isInteger(maxRecords)||maxRecords<1||maxRecords>100000)throw Error('max-records must be 1..100000');
const maxBytes=128*1024*1024,maxRequests=30;
let nextPage=1;try{nextPage=JSON.parse(await readFile(path.join(folder,'progress.json'),'utf8')).nextPage||1;}catch{}
let calls=0,quota=null;
async function get(endpoint,params={}){
 if(++calls>maxRequests)throw Error('Request budget reached; checkpoint preserved.');
 const url=new URL('https://api.stackexchange.com/2.3/'+endpoint);
 for(const [k,v]of Object.entries({site:'stackoverflow',filter:'withbody',pagesize:100,...params}))url.searchParams.set(k,v);
 const response=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error('HTTP '+response.status);
 const data=await response.json();quota=data.quota_remaining;
 if(data.error_id)throw Error('Source API error '+data.error_name);
 if(data.backoff)throw Error('Source requested backoff; stopping this run for '+data.backoff+' seconds.');
 if(quota!==undefined&&quota<20)throw Error('Quota reserve reached; stopping.');
 await new Promise(resolve=>setTimeout(resolve,1100));return data;
}
async function checkpoint(){
 const payload=JSON.stringify({version:1,source:'Stack Overflow',entries:[...records.values()]});
 if(Buffer.byteLength(payload)>maxBytes)throw Error('Local byte cap reached.');
 await writeFile(file+'.tmp',payload);
 await rename(file+'.tmp',file);
 await writeFile(path.join(folder,'progress.json'),JSON.stringify({nextPage}));
 await writeFile(path.join(folder,'manifest.json'),JSON.stringify({records:records.size,bytes:Buffer.byteLength(payload),requestsThisRun:calls,quotaRemaining:quota,updatedAt:new Date().toISOString(),serverWrites:0},null,2));
}
try{
 for(let page=nextPage;records.size<maxRecords;page++){
  nextPage=page;
  const questions=await get('search/advanced',{accepted:'true',sort:'votes',order:'desc',page});
  const needed=questions.items.filter(q=>q.accepted_answer_id&&!records.has('stackoverflow:'+q.question_id));
  if(!needed.length){nextPage=page+1;await checkpoint();if(!questions.has_more)break;continue;}
  const answers=await get('answers/'+needed.map(q=>q.accepted_answer_id).join(';'));
  const byID=new Map(answers.items.map(a=>[a.answer_id,a]));
  for(const q of needed){
   const a=byID.get(q.accepted_answer_id);
   if(!a||!q.content_license||!a.content_license||!q.owner?.display_name||!a.owner?.display_name)continue;
   const entry={id:'stackoverflow:'+q.question_id,title:q.title,tags:q.tags,question:{html:q.body,url:q.link,author:q.owner,license:q.content_license},answer:{html:a.body,url:'https://stackoverflow.com/a/'+a.answer_id,author:a.owner,license:a.content_license},source:'Stack Overflow',retrievedAt:new Date().toISOString()};
   if(Buffer.byteLength(JSON.stringify(entry))>90000)continue;
   records.set(entry.id,entry);if(records.size>=maxRecords)break;
  }
  nextPage=records.size>=maxRecords?page:page+1;
  await checkpoint();console.log(JSON.stringify({page,records:records.size,requests:calls,quota}));
  if(!questions.has_more)break;
 }
 await checkpoint();console.log('Local import finished; no cloud writes.');
}catch(error){await checkpoint();console.error(error.message);process.exitCode=1;}
