/* Phase 1 optional welcome and hybrid navigation interactions */
(() => {
  const gate=document.querySelector('#studio-intro');
  const enter=document.querySelector('#intro-enter');
  const skip=document.querySelector('#intro-skip');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let seen=false;
  try{seen=sessionStorage.getItem('ks-welcome-seen-v1')==='1'}catch(error){}
  const close=()=>{
    if(!gate||gate.hidden||gate.classList.contains('is-leaving'))return;
    gate.classList.add('is-leaving');gate.setAttribute('aria-hidden','true');document.body.classList.remove('intro-active');
    try{sessionStorage.setItem('ks-welcome-seen-v1','1')}catch(error){}
    window.setTimeout(()=>{gate.hidden=true;document.querySelector('#main')?.focus({preventScroll:true})},reduce?0:680);
  };
  if(gate){
    if(seen||reduce){gate.hidden=true;gate.setAttribute('aria-hidden','true')}
    else{gate.hidden=false;gate.removeAttribute('aria-hidden');document.body.classList.add('intro-active');enter?.focus({preventScroll:true})}
    enter?.addEventListener('click',close);skip?.addEventListener('click',close);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!gate.hidden)close()});
  }
  const anchors=[...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections=anchors.map(anchor=>document.querySelector(anchor.getAttribute('href'))).filter(Boolean);
  if('IntersectionObserver'in window&&sections.length){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      anchors.forEach(anchor=>{if(anchor.getAttribute('href')==='#'+entry.target.id)anchor.setAttribute('aria-current','location');else anchor.removeAttribute('aria-current')});
    }),{rootMargin:'-28% 0px -62% 0px'});
    sections.forEach(section=>observer.observe(section));
  }
})();
