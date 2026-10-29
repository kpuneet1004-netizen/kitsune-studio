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

  // First-visit welcome: brief, dismissible, and never shown again in this tab session.
  const welcome = document.querySelector('#welcome-screen');
  const welcomeEnter = document.querySelector('#welcome-enter');
  const welcomeSkip = document.querySelector('#welcome-skip');
  const dismissWelcome = () => {
    if (!welcome || welcome.hidden) return;
    welcome.classList.add('is-leaving');
    document.body.classList.remove('welcome-open');
    try { sessionStorage.setItem('kitsune-welcome-seen', '1'); } catch (_) {}
    window.setTimeout(() => { welcome.hidden = true; welcome.classList.remove('is-active', 'is-leaving'); }, 600);
  };
  if (welcome) {
    let seen = false;
    try { seen = sessionStorage.getItem('kitsune-welcome-seen') === '1'; } catch (_) {}
    if (!seen) {
      welcome.hidden = false;
      document.body.classList.add('welcome-open');
      requestAnimationFrame(() => welcome.classList.add('is-active'));
    }
    if (welcomeEnter) welcomeEnter.addEventListener('click', dismissWelcome);
    if (welcomeSkip) welcomeSkip.addEventListener('click', dismissWelcome);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !welcome.hidden) dismissWelcome(); });
  }

  // Style gallery filters and carry the chosen direction into the enquiry form.
  const styleExplorer = document.querySelector('[data-style-explorer]');
  if (styleExplorer) {
    const filterButtons = styleExplorer.querySelectorAll('[data-style-category]');
    const styleCards = styleExplorer.querySelectorAll('.style-card');
    filterButtons.forEach(button => button.addEventListener('click', () => {
      const category = button.dataset.styleCategory;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      styleCards.forEach(card => {
        const categories = (card.dataset.category || '').split(/\\s+/);
        card.hidden = category !== 'all' && !categories.includes(category);
      });
    }));
    const styleSelect = document.querySelector('#preferred-style');
    const feedback = document.querySelector('#style-feedback');
    styleExplorer.querySelectorAll('[data-choose-style]').forEach(button => button.addEventListener('click', () => {
      const style = button.dataset.chooseStyle;
      if (styleSelect) styleSelect.value = style;
      if (feedback) feedback.textContent = style + ' selected. We’ll carry this direction into your project enquiry.';
      const contact = document.querySelector('#contact');
      if (contact) contact.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      const firstField = document.querySelector('#name');
      if (firstField) window.setTimeout(() => firstField.focus({ preventScroll: true }), 450);
    }));
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
    const body = encodeURIComponent('Hi Kitsune Studio,\n\nI\'d like to discuss a website project.\n\nName: ' + data.get('name') + '\nEmail: ' + data.get('email') + '\nWebsite type: ' + data.get('project-type') + '\nApproximate budget: ' + (data.get('budget') || 'Not specified') + '\nPreferred launch: ' + (data.get('timeline') || 'Flexible / not specified') + '\nPreferred visual direction: ' + (data.get('preferred-style') || 'Not sure yet') + '\\nProject goals and context: ' + (data.get('goal') || 'Not specified yet') + '\n\nPlease let me know the next step.\n\nThanks!');
    if (note) note.textContent = 'Your email app should open with a draft ready to review. Press Send there to contact the studio.';
    window.location.href = 'mailto:hello@kitsunestudio.design?subject=' + subject + '&body=' + body;
  });
})();