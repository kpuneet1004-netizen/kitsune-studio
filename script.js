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
    const body = encodeURIComponent('Hi Kitsune Studio,\n\nI\'d like to discuss a project.\n\nName: ' + data.get('name') + '\nWork email: ' + data.get('email') + '\nProject type: ' + data.get('project-type') + '\nWhat I\'d like to improve: ' + (data.get('goal') || 'Not specified yet') + '\n\nThanks!');
    if (note) note.textContent = 'Your email draft is ready. Review it and press Send in your email app.';
    window.location.href = 'mailto:hello@kitsunestudio.design?subject=' + subject + '&body=' + body;
  });
})();