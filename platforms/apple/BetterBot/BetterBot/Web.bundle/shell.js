(() => {
  const container=document.querySelector('.container');
  const header=container.querySelector('.header');
  const chatSection=document.querySelector('#log').closest('section');
  const settings=document.querySelector('#keysPanel');
  const toolbox=document.querySelector('#toolsPanel');
  const shell=document.createElement('div');shell.className='app-shell';
  const sidebar=document.createElement('aside');sidebar.className='app-sidebar';
  const brand=document.createElement('strong');brand.textContent='BetterBot';brand.className='sidebar-brand';
  const nav=document.createElement('nav');nav.setAttribute('aria-label','Workspace');
  const main=document.createElement('main');main.className='app-main';
  container.before(shell);shell.append(sidebar,main);main.append(container);sidebar.append(brand,nav);
  const pages={};const navButtons={};
  for(const [id,label,icon] of [['chat','Chat','◌'],['projects','Projects','▣'],['tools','Tools','✧'],['settings','Settings','⚙']]){
    const page=document.createElement('section');page.id='page-'+id;page.className='workspace-page';page.hidden=id!=='chat';
    page.setAttribute('aria-label',label);page.tabIndex=-1;pages[id]=page;container.append(page);
    const button=document.createElement('button');button.type='button';button.textContent=icon+'  '+label;
    button.setAttribute('aria-controls',page.id);button.addEventListener('click',()=>showPage(id));nav.append(button);navButtons[id]=button;
  }
  for(const child of [...container.children]){
    if(child===header || child.classList.contains('workspace-page')) continue;
    if(child===chatSection || child===toolbox) pages.chat.append(child);
    else if(child===settings) pages.settings.append(child);
    else pages.tools.append(child);
  }
  const disclosure=settings.querySelector('.settings-disclosure');disclosure?.remove();
  document.getElementById('settingsContent').hidden=false;
  const settingsTitle=document.createElement('h1');settingsTitle.textContent='Settings';pages.settings.prepend(settingsTitle);
  const toolsTitle=document.createElement('h1');toolsTitle.textContent='Tools';pages.tools.prepend(toolsTitle);
  const auth=document.getElementById('bbAuthBtn');auth.className='btn sidebar-signin';auth.style.cssText='';sidebar.append(auth);
  const newButton=document.createElement('button');newButton.className='btn ghost sidebar-new';newButton.textContent='+ New chat';
  newButton.addEventListener('click',()=>{saveActive();activeId=null;projectBadge.textContent='';newChat();showPage('chat');document.getElementById('msg').focus();});sidebar.insertBefore(newButton,nav);
  const pageLabel=document.createElement('span');pageLabel.className='workspace-title';pageLabel.textContent='Chat';header.prepend(pageLabel);
  const picker=document.querySelector('.theme-picker');picker.replaceChildren();
  for(const [id,label] of [['dark','Black'],['satbot','Aurora']]){
    const button=document.createElement('button');button.textContent=label;button.type='button';
    button.addEventListener('click',()=>bbSetTheme(id));picker.append(button);
  }
  document.getElementById('blueBtn').hidden=true;
  let savedTheme;try{savedTheme=localStorage.getItem('bb_theme');}catch{}
  bbSetTheme(savedTheme==='satbot'?'satbot':'dark');
  document.addEventListener('DOMContentLoaded',()=>bbSetTheme(savedTheme==='satbot'?'satbot':'dark'),{once:true});
  function showPage(id){
    Object.entries(pages).forEach(([key,page])=>{page.hidden=key!==id;navButtons[key].setAttribute('aria-current',key===id?'page':'false');});
    pageLabel.textContent={chat:'Chat',projects:'Projects',tools:'Tools',settings:'Settings'}[id];
    pages[id].focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
  }
  showPage('chat');
  const quiz=document.getElementById('quizModal');
  if(quiz){
    document.body.append(quiz);quiz.setAttribute('role','dialog');quiz.setAttribute('aria-modal','true');quiz.setAttribute('aria-label','Practice quiz');
    let restoreFocus;
    new MutationObserver(()=>{
      const open=quiz.classList.contains('on');shell.inert=open;
      if(open){restoreFocus=document.activeElement;quiz.querySelector('button')?.focus();}
      else if(restoreFocus?.isConnected)restoreFocus.focus();
    }).observe(quiz,{attributes:true,attributeFilter:['class']});
    quiz.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();closeQuiz();}
      if(event.key==='Tab'){
        const buttons=[...quiz.querySelectorAll('button:not(:disabled)')];const first=buttons[0],last=buttons.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    });
  }


  const STORE='bb_projects_v1';let projects=[],activeId=null;
  try{const parsed=JSON.parse(localStorage.getItem(STORE)||'[]');if(Array.isArray(parsed)) projects=parsed.filter(p=>p&&typeof p.id==='string'&&typeof p.name==='string'&&Array.isArray(p.chat));}catch{}
  const title=document.createElement('h1');title.textContent='Projects';
  const help=document.createElement('p');help.className='small';help.textContent='Organize separate conversations. Projects are saved on this device.';
  const form=document.createElement('form');form.className='row panel';
  const input=document.createElement('input');input.className='input';input.placeholder='Project name';input.maxLength=80;input.required=true;input.setAttribute('aria-label','Project name');
  const create=document.createElement('button');create.className='btn';create.textContent='Create project';create.type='submit';form.append(input,create);
  const list=document.createElement('div');list.className='project-list';
  const status=document.createElement('p');status.className='small';status.setAttribute('role','status');
  pages.projects.append(title,help,form,status,list);
  const projectBadge=document.createElement('span');projectBadge.className='small';header.append(projectBadge);
  function persist(){try{localStorage.setItem(STORE,JSON.stringify(projects));status.textContent='';return true;}catch{status.textContent='Device storage is full or unavailable. This change could not be saved.';return false;}}
  function saveActive(){const project=projects.find(p=>p.id===activeId);if(project){project.chat=JSON.parse(JSON.stringify(chat));persist();}}
  function openProject(project){saveActive();activeId=project.id;chat=JSON.parse(JSON.stringify(project.chat));currentSessionId=null;render();projectBadge.textContent='Project: '+project.name;showPage('chat');}
  function renderProjects(){
    list.replaceChildren();
    if(!projects.length){const empty=document.createElement('p');empty.className='panel';empty.textContent='Create a project for a topic, idea, or task.';list.append(empty);}
    projects.forEach(project=>{
      const card=document.createElement('article');card.className='panel project-card';
      const name=document.createElement('h2');name.textContent=project.name;
      const count=document.createElement('p');count.className='small';count.textContent=project.chat.filter(m=>m.role==='user').length+' messages';
      const open=document.createElement('button');open.className='btn';open.textContent='Open project';open.addEventListener('click',()=>openProject(project));
      card.append(name,count,open);list.append(card);
    });
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();const name=input.value.trim();if(!name)return;
    const project={id:crypto.randomUUID(),name,chat:[{role:'bot',text:'What would you like to work on in '+name+'?'}]};
    projects.unshift(project);if(!persist()){projects.shift();return;}input.value='';renderProjects();openProject(project);
  });
  let saveTimer;const previousRender=render;
  render=function(){previousRender();clearTimeout(saveTimer);saveTimer=setTimeout(()=>{saveActive();renderProjects();},300);};
  addEventListener('pagehide',saveActive);renderProjects();
})();
