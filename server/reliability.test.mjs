import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../reliability.js',import.meta.url),'utf8');
function setup(send){
  const button={disabled:false,textContent:'Send'};
  const context={buildSystem:()=>'',send,callSatBot:async()=>({text:'ok'}),navigator:{onLine:true},satbotUser:null,document:{querySelector:()=>button,getElementById:()=>({setAttribute(){}})}};
  vm.createContext(context);vm.runInContext(source,context);return {context,button};
}
test('duplicate send is ignored until the first request settles',async()=>{
  let finish,calls=0;
  const {context,button}=setup(()=>{calls++;return new Promise(resolve=>finish=resolve);});
  const first=context.send();await context.send();assert.equal(calls,1);assert.equal(button.disabled,true);
  finish();await first;assert.equal(button.disabled,false);assert.equal(button.textContent,'Send');
});
test('failed requests release the send control',async()=>{
  const {context,button}=setup(async()=>{throw Error('Unavailable');});
  await assert.rejects(context.send());assert.equal(button.disabled,false);
});
test('offline and unsigned users get actionable SatBot errors',async()=>{
  const {context}=setup(async()=>{});
  await assert.rejects(context.callSatBot({}),/Sign in/);
  context.navigator.onLine=false;await assert.rejects(context.callSatBot({}),/offline/);
});
