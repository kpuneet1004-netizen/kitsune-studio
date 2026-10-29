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
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  const revealTargets = document.querySelectorAll('.section-top, .project, .offer-detail, .process-grid article, .manifesto-inner, .contact-card');
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
    const body = encodeURIComponent('Hi Kitsune Studio,\n\nI\'d like to discuss a website project.\n\nName: ' + data.get('name') + '\nEmail: ' + data.get('email') + '\nWebsite type: ' + data.get('project-type') + '\nApproximate budget: ' + (data.get('budget') || 'Not specified') + '\nPreferred launch: ' + (data.get('timeline') || 'Flexible / not specified') + '\nProject goals and context: ' + (data.get('goal') || 'Not specified yet') + '\n\nPlease let me know the next step.\n\nThanks!');
    if (note) note.textContent = 'Your email app should open with a draft ready to review. Press Send there to contact the studio.';
    window.location.href = 'mailto:hello@kitsunestudio.design?subject=' + subject + '&body=' + body;
  });
})();