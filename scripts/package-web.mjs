import {mkdir,copyFile,cp} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),dest=path.join(root,'dist/web');await mkdir(dest,{recursive:true});
for(const file of ['index.html','app.js','polish.js','polish.css','shell.js','shell.css','reliability.js','service-worker.js','manifest.webmanifest','web-llm.min.js','icon-120.png','icon-152.png','icon-180.png','icon-192.png','icon-512.png','DRAR CARS Logo on Speedway.png'])await copyFile(path.join(root,file),path.join(dest,file));
await cp(path.join(root,'games'),path.join(dest,'games'),{recursive:true});
await mkdir(path.join(dest,'knowledge/generated'),{recursive:true});
await copyFile(path.join(root,'knowledge/generated/library.json'),path.join(dest,'knowledge/generated/library.json'));
console.log('Prepared allowlisted web deployment files; server code and credentials excluded.');
