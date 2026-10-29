/* Kitsune Studio — small, dependency-free interactions */
(() => {
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
      const value = link.dataset.projectType;
      if (projectType && value) {
        const match = [...projectType.options].find(option => option.text.trim().toLowerCase() === value.trim().toLowerCase());
        if (match) projectType.value = match.value || match.text;
        else {
          const fallback = [...projectType.options].find(option => option.text.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(option.text.toLowerCase()));
          if (fallback) projectType.value = fallback.value || fallback.text;
        }
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