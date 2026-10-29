/* Kitsune Studio — small, dependency-free interactions */
(() => {

  // Welcome screen: playful, optional, and keyboard-dismissible.
  const intro = document.querySelector('#studio-intro');
  const introEnter = document.querySelector('#intro-enter');
  const introSkip = document.querySelector('#intro-skip');
  const introPlay = document.querySelector('#intro-play');
  const introEmblem = document.querySelector('#intro-emblem');
  const introWhisper = document.querySelector('#intro-whisper');
  const introMessages = [
    'Psst. The fox likes a little attention.',
    'Excellent. You have officially poked the internet.',
    'Tiny spark. Big ideas. That is the whole philosophy.',
    'No templates were harmed in the making of this studio.',
    'Okay, curious human. Let’s make something good.'
  ];
  let introMessageIndex = 0;

  function leaveIntro() {
    if (!intro || intro.classList.contains('is-gone')) return;
    intro.classList.add('is-gone');
    intro.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('intro-active');
    window.setTimeout(() => {
      const main = document.querySelector('#main');
      if (main) main.focus({ preventScroll: true });
    }, 80);
  }

  if (intro) {
    document.body.classList.add('intro-active');
    if (introEnter) introEnter.addEventListener('click', leaveIntro);
    if (introSkip) introSkip.addEventListener('click', leaveIntro);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') leaveIntro();
    });
  }

  function nudgeTheSpark() {
    if (introEmblem) {
      introEmblem.classList.remove('is-spinning');
      void introEmblem.offsetWidth;
      introEmblem.classList.add('is-spinning');
      window.setTimeout(() => introEmblem.classList.remove('is-spinning'), 1300);
    }
    if (introWhisper) {
      introMessageIndex = (introMessageIndex + 1) % introMessages.length;
      introWhisper.textContent = introMessages[introMessageIndex];
    }
  }

  if (introPlay) introPlay.addEventListener('click', nudgeTheSpark);
  if (introEmblem) introEmblem.addEventListener('click', nudgeTheSpark);

  if (introEmblem && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    introEmblem.addEventListener('pointermove', event => {
      const bounds = introEmblem.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      introEmblem.style.transform = 'perspective(800px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 5).toFixed(2) + 'deg)';
    });
    introEmblem.addEventListener('pointerleave', () => {
      introEmblem.style.transform = '';
    });
  }

  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('#nav-links');

  if (menuButton && navLinks) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navLinks.classList.remove('is-open');
    };
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      navLinks.classList.toggle('is-open', !isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  let selectedStyle = '';
  const styleCards = [...document.querySelectorAll('[data-style]')];
  const styleMessage = document.querySelector('#style-message');
  const styleContinue = document.querySelector('#style-continue');
  const goalField = document.querySelector('#goal');
  const projectType = document.querySelector('#project-type');

  function updateDirection(style) {
    selectedStyle = style;
    styleCards.forEach(card => {
      const active = card.dataset.style === style;
      card.setAttribute('aria-pressed', String(active));
    });
    if (styleMessage) {
      styleMessage.textContent = style
        ? style + ' direction selected. We’ll use this as a starting point for your brief.'
        : 'Choose a direction to add it to your project enquiry.';
    }
    if (styleContinue) {
      styleContinue.textContent = style ? 'Use ' + style.toLowerCase() + ' direction ↗' : 'Use this direction ↗';
    }
    if (goalField) {
      const current = goalField.value.trim();
      const marker = 'Visual direction:';
      const markerAt = current.indexOf(marker);
      const userNotes = markerAt >= 0 ? current.slice(0, markerAt).trim() : current;
      const directionLine = style ? marker + ' ' + style : '';
      goalField.value = [userNotes, directionLine].filter(Boolean).join('\n\n');
    }
  }

  styleCards.forEach(card => card.addEventListener('click', () => {
    updateDirection(card.dataset.style || '');
  }));

  document.querySelectorAll('[data-project-type]').forEach(link => {
    link.addEventListener('click', () => {
      const value = (link.dataset.projectType || '').trim().toLowerCase();
      if (projectType && value) {
        const aliases = [
          { test: v => v.includes('landing'), option: 'Landing page' },
          { test: v => v.includes('portfolio') || v.includes('resume') || v.includes('personal'), option: 'Resume / portfolio website — ₹4,999' },
          { test: v => v.includes('business'), option: 'Business website — custom quote' },
          { test: v => v.includes('redesign'), option: 'Website redesign' }
        ];
        const alias = aliases.find(item => item.test(value));
        const match = alias
          ? [...projectType.options].find(option => option.text.trim().toLowerCase().startsWith(alias.option.toLowerCase()))
          : [...projectType.options].find(option => option.text.trim().toLowerCase().includes(value));
        if (match) projectType.value = match.value || match.text;
      }
    });
  });

  const form = document.querySelector('#project-form');
  const formNote = document.querySelector('#form-note');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const type = String(data.get('project-type') || '').trim();
      const budget = String(data.get('budget') || '').trim();
      const timeline = String(data.get('timeline') || 'Flexible / not sure').trim();
      const goal = String(data.get('goal') || '').trim();
      const subject = encodeURIComponent('Project enquiry — ' + (type || 'Kitsune Studio'));
      const body = [
        'Hi Kitsune Studio,',
        '',
        'I’d like to talk about a website project.',
        '',
        'Name: ' + name,
        'Email: ' + email,
        'Project type: ' + type,
        'Budget: ' + budget,
        'Timeline: ' + timeline,
        '',
        'Project notes:',
        goal || 'Not added yet.',
        '',
        'Sent from the Kitsune Studio website.'
      ].join('\n');
      if (formNote) formNote.textContent = 'Your email draft is opening. Please review the details and send it from your mail app.';
      window.location.href = 'mailto:hello@kitsunestudio.design?subject=' + subject + '&body=' + encodeURIComponent(body);
    });
  }
})();