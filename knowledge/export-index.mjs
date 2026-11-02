import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const folder=path.join(import.meta.dirname,'generated');
const library=JSON.parse(await readFile(path.join(folder,'library.json'),'utf8'));
const quote=value=>"'"+String(value).replaceAll("'","''")+"'";
let sql=await readFile(new URL('schema.sql',import.meta.url),'utf8'),exported=0,skipped=0;
for(const entry of library.entries){
 const body=(entry.question.html+' '+entry.answer.html).replace(/<[^>]*>/g,' ').slice(0,16000);
 const values=[entry.id,entry.title,(entry.tags||[]).join(' '),body,JSON.stringify(entry)].map(quote);
 const line='INSERT INTO questions(id,title,tags,body,payload) VALUES('+values.join(',')+') ON CONFLICT(id) DO UPDATE SET title=excluded.title,tags=excluded.tags,body=excluded.body,payload=excluded.payload;\n';
 if(Buffer.byteLength(line)>95000){skipped++;continue;}sql+=line;exported++;
}
sql+='INSERT INTO knowledge_stats(id,records) VALUES(1,(SELECT COUNT(*) FROM questions)) ON CONFLICT(id) DO UPDATE SET records=excluded.records;\n';
await writeFile(path.join(folder,'import.sql'),sql);
console.log(JSON.stringify({exported,skipped,bytes:Buffer.byteLength(sql),cloudWrites:0}));
