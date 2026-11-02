(() => {
  const assistantTabs = [document.querySelector('#currentTab'),document.querySelector('#legacyTab')];
  function switchAssistantTab(index) {
    assistantTabs.forEach((tab,i) => {
      tab.setAttribute('aria-selected',String(index===i)); tab.tabIndex=index===i?0:-1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden=index!==i;
    });
  }
  assistantTabs.forEach((tab,index) => {
    tab.addEventListener('click',()=>switchAssistantTab(index));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?1:1-index;
      switchAssistantTab(next); assistantTabs[next].focus();
    });
  });
  setPersona('zap', false);
  const themePicker=document.createElement('div'); themePicker.className='theme-picker';
  themePicker.setAttribute('role','group');themePicker.setAttribute('aria-label','Appearance');
  for(const [theme,label] of [['light','☀️ Glass'],['colorful','🌈 Vivid'],['dark','🌙 Midnight'],['satbot','🟣 Aurora']]){
    const button=document.createElement('button');button.type='button';button.textContent=label;
    button.addEventListener('click',()=>bbSetTheme(theme));themePicker.append(button);
  }
  document.querySelector('.header')?.append(themePicker);
  const chatPanel = document.querySelector('#log')?.closest('section');
  if (chatPanel) document.querySelector('.header')?.after(chatPanel);
  const settings = document.querySelector('#keysPanel');
  if (settings) {
    const button = document.createElement('button');
    button.className = 'btn ghost settings-disclosure';
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.textContent = 'Settings and API connections  +';
    const content = document.createElement('div');
    content.id = 'settingsContent';
    while (settings.firstChild) content.append(settings.firstChild);
    content.hidden = true;
    button.setAttribute('aria-controls', content.id);
    button.addEventListener('click', () => {
      content.hidden = !content.hidden;
      button.setAttribute('aria-expanded', String(!content.hidden));
      button.textContent = 'Settings and API connections  ' + (content.hidden ? '+' : '−');
    });
    settings.append(button, content);
    const intensity=document.querySelector('#aiIntensity')?.parentElement;
    const modes=document.querySelector('.mode-bar');
    if(intensity) content.append(intensity);
    if(modes) {
      const composer=document.querySelector('#msg')?.closest('.row');
      composer?.after(modes);
      modes.setAttribute('aria-label','Chat tools');
    }
    for (const control of document.querySelectorAll('#bbAuthBtn,button[onclick="setGeminiKey()"],#makePwaBtn,#installBtn,.bb-fast')) {
      control.style.position = 'static'; control.style.margin = '4px';
      content.append(control);
    }
  }
  const status = document.createElement('span');
  status.className = 'connection-status';
  status.setAttribute('role', 'status');
  const update = () => { status.textContent = navigator.onLine ? 'Online' : 'Offline · local tools available'; };
  addEventListener('online', update); addEventListener('offline', update); update();
  document.querySelector('.header')?.append(status);
  const connections = document.createElement('section');
  connections.className = 'panel';
  const heading = document.createElement('h2');
  heading.textContent = 'Web tools'; heading.style.fontSize = '17px';
  const description = document.createElement('p');
  description.className = 'small';
  description.textContent = 'Search in a new browser tab, or open Gmail. These shortcuts do not give BetterBot access to your email or browser tabs.';
  const form = document.createElement('form'); form.className = 'row';
  form.action = 'https://www.google.com/search'; form.method = 'get';
  form.target = '_blank'; form.rel = 'noopener noreferrer';
  const query = document.createElement('input');
  query.className = 'input'; query.name = 'q'; query.required = true;
  query.placeholder = 'Search the web'; query.setAttribute('aria-label', 'Web search query');
  query.style.cssText = 'flex:1;min-width:140px';
  const search = document.createElement('button'); search.type = 'submit';
  search.className = 'btn'; search.textContent = 'Search web';
  const gmail = document.createElement('a'); gmail.className = 'btn ghost';
  gmail.href = 'https://mail.google.com/'; gmail.target = '_blank';
  gmail.rel = 'noopener noreferrer'; gmail.textContent = 'Open Gmail';
  form.append(query, search, gmail); connections.append(heading, description, form);
  const libraryButton=document.createElement('button'); libraryButton.type='button';
  libraryButton.className='btn ghost'; libraryButton.textContent='Search coding library';
  const libraryResults=document.createElement('div'); libraryResults.setAttribute('role','status');
  libraryResults.className='small';
  libraryButton.addEventListener('click',async()=>{
    if(!query.reportValidity()) return;
    libraryButton.disabled=true; libraryResults.textContent='Searching sourced coding answers…';
    try {
      const response=await fetch('https://satbot.drarcode22.workers.dev/knowledge?q='+encodeURIComponent(query.value.trim()));
      if(!response.ok) throw Error('Knowledge lookup unavailable.');
      const data=await response.json(); libraryResults.replaceChildren();
      const summary=document.createElement('p');
      summary.textContent=data.results.length+(data.results.length===1?' match in the ':' matches in the ')+data.total+'-record pilot library.';
      libraryResults.append(summary);
      for(const entry of data.results){
        const url=new URL(entry.answer.url);
        if(url.protocol!=='https:' || url.hostname!=='stackoverflow.com') continue;
        const item=document.createElement('p'),link=document.createElement('a');
        link.href=url.href; link.target='_blank'; link.rel='noopener noreferrer';
        link.textContent=entry.title; item.append(link,document.createTextNode(' — '+(entry.answer.author.display_name||'Contributor')+' · '+entry.answer.license));
        libraryResults.append(item);
      }
    } catch(error){ libraryResults.textContent='Coding library unavailable. Try again later.'; }
    finally { libraryButton.disabled=false; }
  });
  connections.append(libraryButton,libraryResults);
  settings?.after(connections);
  // Keep the full toolbox close to chat, rather than below secondary panels.
  const toolbox=document.querySelector('#toolsPanel');
  if(toolbox && chatPanel) chatPanel.after(toolbox);
  document.querySelectorAll('input,textarea,select').forEach(el => {
    if (!el.labels?.length && !el.hasAttribute('aria-label')) {
      el.setAttribute('aria-label', el.placeholder || el.id || 'Input');
    }
  });
  // Modal escape/focus handling works with the existing open/close functions.
  const previousFocus = new WeakMap();
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', modal.querySelector('h2,h3')?.textContent || 'BetterBot dialog');
    const focusable = () => [...modal.querySelectorAll('button,input,select,textarea,a[href],[tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
    new MutationObserver(() => {
      const open = modal.classList.contains('open');
      modal.inert = !open;
      if (open && !previousFocus.has(modal)) { previousFocus.set(modal, document.activeElement); focusable()[0]?.focus(); }
      else if (!open && previousFocus.has(modal)) { previousFocus.get(modal)?.focus(); previousFocus.delete(modal); }
    }).observe(modal, { attributes:true, attributeFilter:['class'] });
    modal.inert = !modal.classList.contains('open');
    modal.addEventListener('keydown', e => {
      if (e.key === 'Escape') { modal.classList.remove('open'); e.stopPropagation(); }
      if (e.key !== 'Tab') return;
      const items = focusable(), first=items[0], last=items.at(-1);
      if (e.shiftKey && document.activeElement===first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement===last) { e.preventDefault(); first?.focus(); }
    });
  });
})();
