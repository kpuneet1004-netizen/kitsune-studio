(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#nav-links');
  if (toggle && nav) {
    const closeMenu = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); toggle.focus(); } });
    document.addEventListener('click', e => { if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu(); });
  }

  // The resume concept doubles as a shortcut into the relevant enquiry path.
  const resumeConcept = document.querySelector('.case-resume');
  if (resumeConcept) resumeConcept.addEventListener('click', () => {
    const projectType = document.querySelector('#project-type');
    if (projectType) projectType.value = 'Resume / personal website';
  });

  // Section 4: controls update one complete website preview.
  const styleExplorer = document.querySelector('[data-style-explorer]');
  if (styleExplorer) {
    const preview = styleExplorer.querySelector('[data-live-site]');
    const feedback = styleExplorer.querySelector('#style-feedback');
    const styleSelect = document.querySelector('#preferred-style');
    const defaults = {site:'business',vibe:'minimal',layout:'balanced',palette:'warm',type:'clean',imagery:'photography',motion:'subtle'};
    const state = {...defaults};
    const copy = {
      business:{logo:'FORM & FIELD',kicker:'INDEPENDENT CREATIVE STUDIO',headline:'Good ideas<br>deserve <em>good design.</em>',intro:'We bring strategy, design and thoughtful details together to help ambitious businesses move forward.',title:'Clarity is a<br>competitive edge.',body:'Good design is not decoration. It makes the important things easier to understand, creates trust, and gives every next step a reason to exist.',services:'Good work starts<br>with a <em>clear plan.</em>'},
      portfolio:{logo:'ALEX MORI',kicker:'INDEPENDENT DESIGNER & CREATIVE',headline:'Ideas made<br><em>visible.</em>',intro:'A selected collection of thoughtful digital experiences, visual experiments and work made with purpose.',title:'A point of view<br>makes the work.',body:'Every project begins with a question. I combine clear thinking, a strong visual voice and careful craft to turn that question into something distinct.',services:'A considered process.<br><em>Distinctive work.</em>'},
      resume:{logo:'YOUR NAME',kicker:'DESIGNER · BUILDER · PROBLEM SOLVER',headline:'A little about me.<br><em>A lot about what’s next.</em>',intro:'I connect ideas, people and practical problem-solving to make useful things happen. Here is what I do and how I think.',title:'Good work comes<br>from good questions.',body:'My approach blends curiosity with clear communication and thoughtful execution. I like complex challenges, collaborative teams and outcomes that make a difference.',services:'What I bring<br>to the <em>table.</em>'}
    };
    const images = {
      photography:['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=82','https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1100&q=82','https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=82'],
      graphic:['https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=82','https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1100&q=82','https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=82'],
      architecture:['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=82','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=82','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=82']
    };
    const classPrefixes=['vibe-','layout-','palette-','type-','imagery-','motion-'];
    const applyState=()=>{
      if(!preview)return;
      classPrefixes.forEach(prefix=>[...preview.classList].filter(name=>name.startsWith(prefix)).forEach(name=>preview.classList.remove(name)));
      preview.classList.add('vibe-'+state.vibe,'layout-'+state.layout,'palette-'+state.palette,'type-'+state.type,'imagery-'+state.imagery,'motion-'+state.motion);
      const selected=copy[state.site];
      preview.querySelectorAll('.demo-logo').forEach(el=>{el.innerHTML=selected.logo+'<span>®</span>';});
      const values=[['[data-demo-kicker]',selected.kicker],['[data-demo-headline]',selected.headline],['[data-demo-intro]',selected.intro],['[data-demo-section-title]',selected.title],['[data-demo-section-copy]',selected.body],['.demo-services h3',selected.services]];
      values.forEach(([selector,value])=>{const el=preview.querySelector(selector);if(el){if(selector.includes('headline')||selector.includes('title')||selector.includes('services'))el.innerHTML=value;else el.textContent=value;}});
      preview.querySelectorAll('img').forEach((img,index)=>{img.src=images[state.imagery][index%4];});
      if(feedback)feedback.textContent=({business:'Business website',portfolio:'Portfolio website',resume:'Personal / Resume website'}[state.site]+' · '+state.vibe+' vibe · '+state.layout+' layout. Scroll inside the frame to explore the full page.');
      if(styleSelect){const name={minimal:'Minimal',editorial:'Editorial',bold:'Bold',luxury:'Luxury'}[state.vibe];if([...styleSelect.options].some(option=>option.value===name||option.text===name))styleSelect.value=name;}
    };
    styleExplorer.querySelectorAll('[data-option-group]').forEach(group=>group.addEventListener('click',event=>{
      const button=event.target.closest('button[data-value]');
      if(!button||!group.contains(button))return;
      state[group.dataset.optionGroup]=button.dataset.value;
      group.querySelectorAll('button[data-value]').forEach(option=>{const active=option===button;option.classList.toggle('is-selected',active);option.setAttribute('aria-pressed',String(active));});
      applyState();
    }));
    const reset=styleExplorer.querySelector('[data-config-reset]');
    if(reset)reset.addEventListener('click',()=>{
      Object.assign(state,defaults);
      styleExplorer.querySelectorAll('[data-option-group]').forEach(group=>group.querySelectorAll('button[data-value]').forEach(button=>{const active=button.dataset.value===defaults[group.dataset.optionGroup];button.classList.toggle('is-selected',active);button.setAttribute('aria-pressed',String(active));}));
      const viewport=styleExplorer.querySelector('.live-preview-viewport');
      if(viewport)viewport.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
      applyState();
    });
    applyState();
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  const revealTargets = document.querySelectorAll('.section-top, .project, .offer-detail, .process-grid article, .manifesto-inner, .contact-card, .style-card, .trust-card, .about-copy');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealTargets.forEach(el => observer.observe(el));
  }
  const form = document.querySelector('#project-form');
  const note = document.querySelector('#form-note');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent('Kitsune Studio project inquiry — ' + data.get('project-type'));
    const body = encodeURIComponent('Hi Kitsune Studio,\n\nI\'d like to discuss a website project.\n\nName: ' + data.get('name') + '\nEmail: ' + data.get('email') + '\nWebsite type: ' + data.get('project-type') + '\nApproximate budget: ' + (data.get('budget') || 'Not specified') + '\nPreferred launch: ' + (data.get('timeline') || 'Flexible / not specified') + '\nPreferred visual direction: ' + (data.get('preferred-style') || 'Not sure yet') + '\nProject goals and context: ' + (data.get('goal') || 'Not specified yet') + '\n\nPlease let me know the next step.\n\nThanks!');
    if (note) note.textContent = 'Your email app should open with a draft ready to review. Press Send there to contact the studio.';
    window.location.href = 'mailto:hello@kitsunestudio.design?subject=' + subject + '&body=' + body;
  });
})();