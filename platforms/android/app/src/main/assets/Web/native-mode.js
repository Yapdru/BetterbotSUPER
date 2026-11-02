document.addEventListener('DOMContentLoaded',()=>{
 if(!getAuth()) skipSignIn();
 const oldAuth=document.getElementById('bbAuthBtn');
 if(oldAuth){const link=document.createElement('a');link.href='https://betterai-3ca66.web.app';link.className=oldAuth.className;link.textContent='Sign in online';link.style.textDecoration='none';oldAuth.replaceWith(link);}
 const note=document.createElement('p');note.className='small';note.textContent='Native preview · local tools available. Use Online workspace in the app toolbar for browser sign-in and cloud features.';
 document.querySelector('.header')?.append(note);
});