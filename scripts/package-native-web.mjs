import {mkdir,copyFile,cp,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const target=path.join(root,'platforms/apple/BetterBot/BetterBot/Web.bundle');
await mkdir(target,{recursive:true});
for(const name of ['index.html','app.js','polish.js','polish.css','reliability.js','shell.js','shell.css','manifest.webmanifest','web-llm.min.js','icon-120.png','icon-152.png','icon-180.png','icon-192.png','icon-512.png','DRAR CARS Logo on Speedway.png']){
  await copyFile(path.join(root,name),path.join(target,name));
}
await cp(path.join(root,'games'),path.join(target,'games'),{recursive:true});
// Packaged webviews do not share browser OAuth sessions or support service workers.
let html=await readFile(path.join(target,'index.html'),'utf8');
html=html.replace('</body>','<script src="native-mode.js"></script></body>');
await writeFile(path.join(target,'index.html'),html);
await writeFile(path.join(target,'native-mode.js'),`document.addEventListener('DOMContentLoaded',()=>{
 if(!getAuth()) skipSignIn();
 const oldAuth=document.getElementById('bbAuthBtn');
 if(oldAuth){const link=document.createElement('a');link.href='https://betterai-3ca66.web.app';link.className=oldAuth.className;link.textContent='Sign in online';link.style.textDecoration='none';oldAuth.replaceWith(link);}
 const note=document.createElement('p');note.className='small';note.textContent='Native preview · local tools available. Use Online workspace in the app toolbar for browser sign-in and cloud features.';
 document.querySelector('.header')?.append(note);
});`);
console.log('Bundled BetterBot web assets for Apple builds.');
for(const destination of ['platforms/android/app/src/main/assets/Web','platforms/windows/Web']){
  const folder=path.join(root,destination);await mkdir(folder,{recursive:true});await cp(target,folder,{recursive:true});
}
console.log('Prepared Android and Windows web assets.');
