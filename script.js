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

  const introVideo = document.querySelector('#intro-video');

  if (intro) {
    document.body.classList.add('intro-active');

    // Skip always takes the visitor straight to the homepage.
    if (introSkip) introSkip.addEventListener('click', leaveIntro);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') leaveIntro();
    });

    if (introVideo) {
      // Normal path: let the entire video play, then reveal the homepage.
      introVideo.addEventListener('ended', leaveIntro, { once: true });

      // If the remote asset fails, don't trap the visitor on the intro screen.
      introVideo.addEventListener('error', () => {
        intro.classList.add('intro-video-fallback');
        leaveIntro();
      }, { once: true });

      const playback = introVideo.play();
      if (playback && typeof playback.catch === 'function') {
        playback.catch(() => {
          intro.classList.add('intro-video-fallback');
          leaveIntro();
        });
      }

      // Safety net for a video stream that hangs and never fires "ended".
      window.setTimeout(() => {
        if (!intro.classList.contains('is-gone')) leaveIntro();
      }, 20000);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        introVideo.pause();
        leaveIntro();
      }
    }
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
          { test: v => v.includes('resume'), option: 'resume' },
          { test: v => v.includes('portfolio'), option: 'portfolio' },
          { test: v => v.includes('landing'), option: 'landing' },
          { test: v => v.includes('business'), option: 'business' },
          { test: v => v.includes('redesign'), option: 'redesign' }
        ];
        const alias = aliases.find(item => item.test(value));
        const match = alias
          ? [...projectType.options].find(option => option.value === alias.option)
          : [...projectType.options].find(option => option.text.trim().toLowerCase().includes(value));
        if (match) {
          projectType.value = match.value || match.text;
          projectType.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });
  });

  // Currency selector keeps service prices and enquiry options in sync.
  const clientRegion = document.querySelector('#client-region');
  const currencyButtons = [...document.querySelectorAll('[data-currency]')];
  const servicePrices = [...document.querySelectorAll('[data-price-inr][data-price-usd]')];
  const projectOptions = {
    india: {
      resume: 'Resume Site — ₹11,999',
      portfolio: 'Portfolio Site — custom quote',
      landing: 'Landing Page — ₹29,999',
      business: 'Business Site — custom quote'
    },
    overseas: {
      resume: 'Resume Site — $119',
      portfolio: 'Portfolio Site — custom quote',
      landing: 'Landing Page — $299',
      business: 'Business Site — custom quote'
    }
  };
  const budgetOptions = {
    india: ['Choose a range', 'Under ₹10,000', '₹10,000–₹25,000', '₹25,000–₹50,000', '₹50,000+', 'Not sure yet'],
    overseas: ['Choose a range', 'Under $100', '$100–$300', '$300–$750', '$750+', 'Not sure yet']
  };
  const updateCustomSelect = select => {
    const wrapper = select?.closest('.select-control');
    if (!wrapper) return;
    const list = wrapper.querySelector('.select-options');
    [...select.options].forEach((option, index) => {
      if (list?.children[index]) list.children[index].textContent = option.text;
    });
    const trigger = wrapper.querySelector('.select-trigger');
    if (trigger) trigger.textContent = select.options[select.selectedIndex]?.text || 'Choose an option';
  };
  const setCurrency = currency => {
    const region = currency === 'USD' ? 'overseas' : 'india';
    if (clientRegion && clientRegion.value !== region) {
      clientRegion.value = region;
      clientRegion.dispatchEvent(new Event('change', { bubbles: true }));
    }
    currencyButtons.forEach(button => {
      const active = button.dataset.currency === currency;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    servicePrices.forEach(price => { price.textContent = currency === 'USD' ? price.dataset.priceUsd : price.dataset.priceInr; });
    const currentOptions = projectOptions[region];
    Object.entries(currentOptions).forEach(([value, label]) => {
      const option = [...(projectType?.options || [])].find(item => item.value === value);
      if (option) option.textContent = label;
    });
    if (projectType) updateCustomSelect(projectType);
    const budget = document.querySelector('#budget');
    if (budget) {
      const currentValue = budget.value;
      budgetOptions[region].forEach((label, index) => {
        if (budget.options[index]) {
          budget.options[index].textContent = label;
          budget.options[index].value = index === 0 ? '' : label;
        }
      });
      if (currentValue && [...budget.options].some(option => option.value === currentValue)) budget.value = currentValue;
      updateCustomSelect(budget);
    }
  };
  currencyButtons.forEach(button => button.addEventListener('click', () => setCurrency(button.dataset.currency)));
  clientRegion?.addEventListener('change', () => setCurrency(clientRegion.value === 'overseas' ? 'USD' : 'INR'));
  setCurrency(clientRegion?.value === 'overseas' ? 'USD' : 'INR');

  // Custom select menus keep the option panel inside the form column on every screen size.
  document.querySelectorAll('.field select').forEach(select => {
    const wrapper = document.createElement('div');
    wrapper.className = 'select-control';
    wrapper.dataset.required = select.required ? 'true' : 'false';
    select.required = false;
    select.classList.add('select-native-source');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.textContent = select.options[select.selectedIndex]?.text || 'Choose an option';
    wrapper.appendChild(trigger);

    const list = document.createElement('div');
    list.className = 'select-options';
    list.setAttribute('role', 'listbox');
    list.hidden = true;
    wrapper.appendChild(list);

    const update = () => {
      trigger.textContent = select.options[select.selectedIndex]?.text || 'Choose an option';
      wrapper.classList.toggle('has-value', Boolean(select.value));
      [...list.children].forEach((item, index) => {
        item.setAttribute('aria-selected', String(select.options[index].value === select.value));
      });
    };

    [...select.options].forEach((option, index) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'select-option';
      item.setAttribute('role', 'option');
      item.textContent = option.text;
      item.setAttribute('aria-selected', String(option.selected));
      item.addEventListener('click', () => {
        select.selectedIndex = index;
        wrapper.removeAttribute('aria-invalid');
        select.dispatchEvent(new Event('change', { bubbles: true }));
        update();
        list.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
        wrapper.classList.remove('is-open');
      });
      list.appendChild(item);
    });

    const close = () => {
      list.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      wrapper.classList.remove('is-open');
    };
    trigger.addEventListener('click', () => {
      const opening = list.hidden;
      document.querySelectorAll('.select-control.is-open').forEach(open => {
        open.classList.remove('is-open');
        open.querySelector('.select-options').hidden = true;
        open.querySelector('.select-trigger').setAttribute('aria-expanded', 'false');
      });
      if (opening) {
        list.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        wrapper.classList.add('is-open');
      } else close();
    });
    trigger.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        list.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        wrapper.classList.add('is-open');
        list.querySelector('.select-option')?.focus();
      }
    });
    list.addEventListener('keydown', event => {
      const items = [...list.querySelectorAll('.select-option')];
      const current = items.indexOf(document.activeElement);
      if (event.key === 'Escape') { event.preventDefault(); close(); trigger.focus(); }
      if (event.key === 'ArrowDown') { event.preventDefault(); items[Math.min(current + 1, items.length - 1)]?.focus(); }
      if (event.key === 'ArrowUp') { event.preventDefault(); if (current <= 0) trigger.focus(); else items[current - 1]?.focus(); }
      if (event.key === 'Tab') close();
    });
    select.addEventListener('change', update);
    update();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.select-control')) {
      document.querySelectorAll('.select-control.is-open').forEach(open => {
        open.classList.remove('is-open');
        open.querySelector('.select-options').hidden = true;
        open.querySelector('.select-trigger').setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Show the budget question only for business websites and redesigns.
  const projectTypeSelect = document.querySelector('#project-type');
  const budgetSelect = document.querySelector('#budget');
  const budgetField = document.querySelector('#budget-field');
  const budgetTimelineRow = document.querySelector('#budget-timeline-row');
  const syncBudgetVisibility = () => {
    if (!projectTypeSelect || !budgetField || !budgetTimelineRow || !budgetSelect) return;
    const selectedType = projectTypeSelect.value;
    const needsBudget = selectedType === 'business' || selectedType === 'redesign';
    budgetField.hidden = !needsBudget;
    budgetTimelineRow.classList.toggle('has-budget', needsBudget);
    budgetSelect.required = needsBudget;
    const budgetControl = budgetField.querySelector('.select-control');
    if (budgetControl) {
      budgetControl.dataset.required = needsBudget ? 'true' : 'false';
      budgetControl.removeAttribute('aria-invalid');
    }
    if (!needsBudget) {
      budgetSelect.selectedIndex = 0;
      budgetSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };
  projectTypeSelect?.addEventListener('change', syncBudgetVisibility);
  syncBudgetVisibility();

  const form = document.querySelector('#project-form');
  const formNote = document.querySelector('#form-note');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const missingSelect = [...form.querySelectorAll('.select-control[data-required="true"]')].find(control => !control.querySelector('select').value);
      form.querySelectorAll('.select-control').forEach(control => control.removeAttribute('aria-invalid'));
      if (missingSelect) {
        missingSelect.setAttribute('aria-invalid', 'true');
        missingSelect.querySelector('.select-trigger').focus();
        if (formNote) formNote.textContent = 'Please choose an option for each required dropdown before preparing your enquiry.';
        return;
      }
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const type = String(projectType?.options[projectType.selectedIndex]?.text || data.get('project-type') || '').trim();
      const region = String(data.get('client-region') || 'india') === 'overseas' ? 'Outside India · USD ($)' : 'India · INR (₹)';
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
        'Client region / currency: ' + region,
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

  // Progressive reveal: sections and cards animate into view as you explore.
  const motionTargets = [
    ...document.querySelectorAll('.section-label, .section-heading, .about-grid, .about-stats, .work-card, .work-note, .concept-note, .belief-list article, .style-card, .style-selection, .service-card, .process-grid article, .contact-grid, .footer-main')
  ];
  const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (motionAllowed && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');
    motionTargets.forEach((element, index) => {
      element.classList.add('reveal-on-scroll');
      const siblingIndex = element.parentElement ? [...element.parentElement.children].filter(child => child.matches('.work-card,.style-card,.service-card,.process-grid article,.belief-list article')).indexOf(element) : -1;
      if (siblingIndex >= 0) element.dataset.revealDelay = String(Math.min(siblingIndex, 3));
    });
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    motionTargets.forEach(element => revealObserver.observe(element));
  }


  // Ambient motion: tiny drifting sparks in the welcome and a live page-progress line.
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const introParticles = document.querySelector('#studio-intro');
  if (introParticles && !motionReduced && !introParticles.querySelector('.intro-particles')) {
    const layer = document.createElement('div');
    layer.className = 'intro-particles';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 26; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'intro-particle';
      const hue = i % 3 === 0 ? '#ff6500' : (i % 3 === 1 ? '#9b35ff' : '#f6f3ef');
      particle.style.setProperty('--x', (4 + Math.random() * 92).toFixed(2) + '%');
      particle.style.setProperty('--y', (18 + Math.random() * 82).toFixed(2) + '%');
      particle.style.setProperty('--size', (2 + Math.random() * 3.5).toFixed(1) + 'px');
      particle.style.setProperty('--duration', (5 + Math.random() * 8).toFixed(2) + 's');
      particle.style.setProperty('--delay', (-Math.random() * 12).toFixed(2) + 's');
      particle.style.setProperty('--drift', ((Math.random() - .5) * 100).toFixed(1) + 'px');
      particle.style.setProperty('--particle-color', hue);
      particle.style.setProperty('--particle-opacity', (.25 + Math.random() * .55).toFixed(2));
      layer.appendChild(particle);
    }
    introParticles.prepend(layer);
  }

  const header = document.querySelector('.site-header');
  let progressTicking = false;
  const updateScrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    if (header) header.style.setProperty('--scroll-progress', String(Math.max(0, Math.min(1, progress))));
    progressTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!progressTicking) {
      window.requestAnimationFrame(updateScrollProgress);
      progressTicking = true;
    }
  }, { passive: true });
  updateScrollProgress();

  // Subtle pointer depth on the hero artwork, with a clean reset on exit.
  const heroArt = document.querySelector('.hero-art');
  if (heroArt && !motionReduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    heroArt.addEventListener('pointermove', event => {
      const bounds = heroArt.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      heroArt.style.transform = 'perspective(1000px) rotateX(' + (-y * 2.5).toFixed(2) + 'deg) rotateY(' + (x * 3.5).toFixed(2) + 'deg)';
    });
    heroArt.addEventListener('pointerleave', () => { heroArt.style.transform = ''; });
  }

})();