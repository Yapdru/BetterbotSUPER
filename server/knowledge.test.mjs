import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './satbot-worker.mjs';
const entries = [{title:'Python dictionary merge',tags:['python','dictionary']},{title:'JavaScript array',tags:['javascript']}];
const env = {CACHE:{get:async key=>{assert.equal(key,'knowledge:pilot:v1');return {entries};}}};
test('public lookup returns matching source records without invoking AI',async()=>{
  const r=await worker.fetch(new Request('https://example.test/knowledge?q=python%20merge'),env);
  assert.equal(r.status,200);const body=await r.json();assert.equal(body.total,2);assert.equal(body.results.length,1);
});
test('unmatched questions return no results rather than an invented answer',async()=>{
  const r=await worker.fetch(new Request('https://example.test/knowledge?q=unknown'),env);
  assert.deepEqual((await r.json()).results,[]);
});
test('untrusted browser origin is rejected before any KV read',async()=>{
  const r=await worker.fetch(new Request('https://example.test/knowledge',{headers:{Origin:'https://evil.example'}}),{});
  assert.equal(r.status,403);
});
test('storage errors fail gracefully',async()=>{
  const r=await worker.fetch(new Request('https://example.test/knowledge'),{CACHE:{get:async()=>{throw Error();}}});assert.equal(r.status,503);
});
test('indexed lookup binds sanitized FTS terms and preserves stored attribution',async()=>{
 let bound='';const entry={title:'dictionary merge',answer:{license:'CC BY-SA 4.0'}};
 const db={prepare(sql){return {first:async()=>({records:1000}),bind(value){bound=value;return this;},all:async()=>({results:[{payload:JSON.stringify(entry)}]})};}};
 const r=await worker.fetch(new Request('https://example.test/knowledge?q=python%20OR%20%22merge%22'),{KNOWLEDGE_DB:db});
 const body=await r.json();assert.equal(body.total,1000);assert.equal(bound,'"python" AND "or" AND "merge"');assert.deepEqual(body.results,[entry]);
});
