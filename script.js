/* Kitsune Studio — small, dependency-free interactions */
(() => {

  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      resume: 'Resume Site',
      portfolio: 'Portfolio Site',
      landing: 'Landing Page',
      business: 'Business Site'
    },
    overseas: {
      resume: 'Resume Site',
      portfolio: 'Portfolio Site',
      landing: 'Landing Page',
      business: 'Business Site'
    }
  };
  const budgetOptions = {
    india: ['Choose a range', 'Under ₹10,000', '₹10,000–₹25,000', '₹25,000–₹50,000', '₹50,000+', 'Not sure yet'],
    overseas: ['Choose a range', 'Under $100', '$100–$300', '$300–$750', '$750+', 'Not sure yet']
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
    const pricingNote = document.querySelector('#pricing-note');
    if (pricingNote) {
      pricingNote.textContent = currency === 'USD'
        ? 'Resume Site: $119. Landing Page: $299. Portfolio and Business Sites are custom quoted. Domain, paid services, copywriting, and maintenance are separate unless included in the agreed scope.'
        : 'Resume Site: ₹11,999. Landing Page: ₹29,999. Portfolio and Business Sites are custom quoted. Domain, paid services, copywriting, and maintenance are separate unless included in the agreed scope.';
    }
    const currentOptions = projectOptions[region];
    Object.entries(currentOptions).forEach(([value, label]) => {
      const option = [...(projectType?.options || [])].find(item => item.value === value);
      if (option) option.textContent = label;
    });
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
    }
  };
  currencyButtons.forEach(button => button.addEventListener('click', () => setCurrency(button.dataset.currency)));
  clientRegion?.addEventListener('change', () => setCurrency(clientRegion.value === 'overseas' ? 'USD' : 'INR'));
  setCurrency(clientRegion?.value === 'overseas' ? 'USD' : 'INR');

  // Use an in-page listbox so native option popups cannot escape the mobile viewport.
  const customSelects = new Map();
  function enhanceSelect(select) {
    if (!select || customSelects.has(select)) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';
    wrapper.dataset.forSelect = select.id;
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.classList.add('custom-select-native');
    select.setAttribute('aria-hidden', 'true');
    select.tabIndex = -1;
    select.required = false;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', select.id + '-listbox');
    trigger.setAttribute('aria-label', select.labels?.[0]?.textContent || 'Choose an option');
    wrapper.appendChild(trigger);

    const listbox = document.createElement('div');
    listbox.className = 'custom-select-listbox';
    listbox.id = select.id + '-listbox';
    listbox.setAttribute('role', 'listbox');
    listbox.hidden = true;
    wrapper.appendChild(listbox);

    let activeIndex = Math.max(0, select.selectedIndex);
    const currentOption = () => select.options[select.selectedIndex];
    const refresh = () => {
      trigger.textContent = currentOption()?.textContent || 'Choose an option';
      trigger.dataset.placeholder = String(!select.value);
      trigger.setAttribute('aria-valuetext', trigger.textContent);
      [...listbox.children].forEach((item, index) => {
        item.setAttribute('aria-selected', String(index === select.selectedIndex));
        item.classList.toggle('is-selected', index === select.selectedIndex);
      });
    };
    const close = (focusTrigger = false) => {
      wrapper.classList.remove('is-open', 'opens-up');
      listbox.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (focusTrigger) trigger.focus();
    };
    const open = () => {
      document.querySelectorAll('.custom-select.is-open').forEach(openWrapper => {
        if (openWrapper !== wrapper) openWrapper.querySelector('.custom-select-trigger')?.click();
      });
      listbox.replaceChildren();
      [...select.options].forEach((option, index) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'custom-select-option';
        item.setAttribute('role', 'option');
        item.textContent = option.textContent;
        item.disabled = option.disabled;
        item.setAttribute('aria-selected', String(index === select.selectedIndex));
        item.addEventListener('click', () => {
          select.selectedIndex = index;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          refresh();
          close(true);
        });
        listbox.appendChild(item);
      });
      wrapper.classList.add('is-open');
      listbox.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      const rect = trigger.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom - 12;
      const above = rect.top - 12;
      const openUp = below < Math.min(200, above) && above > below;
      wrapper.classList.toggle('opens-up', openUp);
      listbox.style.maxHeight = Math.max(100, Math.min(240, window.innerHeight * 0.4, (openUp ? above : below) - 8)) + 'px';
      activeIndex = Math.max(0, select.selectedIndex);
      listbox.querySelectorAll('[role="option"]')[activeIndex]?.scrollIntoView({ block: 'nearest' });
    };
    trigger.addEventListener('click', () => listbox.hidden ? open() : close());
    trigger.addEventListener('keydown', event => {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        if (listbox.hidden) open();
        else {
          const options = [...listbox.querySelectorAll('[role="option"]:not(:disabled)')];
          if (event.key === 'ArrowDown') activeIndex = Math.min(options.length - 1, activeIndex + 1);
          if (event.key === 'ArrowUp') activeIndex = Math.max(0, activeIndex - 1);
          if (event.key === 'Enter' || event.key === ' ') options[activeIndex]?.click();
          else options[activeIndex]?.scrollIntoView({ block: 'nearest' });
        }
      } else if (event.key === 'Escape') close(true);
    });
    select.addEventListener('change', () => { refresh(); });
    document.addEventListener('click', event => {
      if (!wrapper.contains(event.target)) close();
    });
    customSelects.set(select, { trigger, listbox, refresh, open, close });
    refresh();
  }

  enhanceSelect(clientRegion);
  enhanceSelect(projectType);
  enhanceSelect(document.querySelector('#budget'));
  
  // Keep native select elements intact for keyboard, screen-reader, and browser validation support.

  // Show the budget question only for business websites and redesigns.
  const projectTypeSelect = document.querySelector('#project-type');
  const budgetSelect = document.querySelector('#budget');
  const budgetField = document.querySelector('#budget-field');
  const syncBudgetVisibility = () => {
    if (!projectTypeSelect || !budgetField || !budgetSelect) return;
    const selectedType = projectTypeSelect.value;
    const needsBudget = selectedType === 'business' || selectedType === 'redesign';
    budgetField.hidden = !needsBudget;
    budgetSelect.required = needsBudget;
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
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (projectType && !projectType.value) {
        const custom = customSelects.get(projectType);
        custom?.open();
        custom?.trigger.focus();
        return;
      }
      if (budgetSelect?.required && !budgetSelect.value) {
        const custom = customSelects.get(budgetSelect);
        custom?.open();
        custom?.trigger.focus();
        return;
      }
      if (!form.reportValidity()) return;

      const submitButton = form.querySelector('[type="submit"]');
      const originalButton = submitButton?.innerHTML;
      if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Sending enquiry…'; }
      if (formNote) formNote.textContent = 'Sending your enquiry to Kitsune Studio…';

      try {
        const response = await fetch('https://formsubmit.co/ajax/kpuneet1004@gmail.com', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        const result = await response.json();
        if (!response.ok || result.success !== 'true') {
          throw new Error(result.message || 'The enquiry could not be sent.');
        }
        form.reset();
        syncBudgetVisibility();
        if (formNote) formNote.textContent = 'Thank you — your enquiry has been sent. We’ll get back to you soon.';
        if (submitButton) submitButton.textContent = 'Enquiry sent ✓';
      } catch (error) {
        if (formNote) formNote.textContent = 'We couldn’t send that just now. Please email kpuneet1004@gmail.com directly.';
        if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = originalButton || 'Try again ↗'; }
      }
    });
  }

  // Progressive reveal: sections and cards animate into view as you explore.
  const motionTargets = [
    ...document.querySelectorAll('.section-label, .section-heading, .about-grid, .about-stats, .work-card, .work-note, .concept-note, .belief-list article, .style-card, .style-selection, .direction-card, .directions-note, .service-card, .process-grid article, .contact-grid, .footer-main')
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


  // Fine-pointer spotlight: a quiet, responsive highlight on selected-work cards.
  // It is disabled on touch devices and never changes layout or scroll behaviour.
  if (!motionReduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.work-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const bounds = card.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        card.style.setProperty('--spot-x', x.toFixed(1) + '%');
        card.style.setProperty('--spot-y', y.toFixed(1) + '%');
        card.classList.add('has-pointer');
      });
      card.addEventListener('pointerleave', () => card.classList.remove('has-pointer'));
    });
  }


  // Ambient motion: tiny drifting sparks in the welcome and a live page-progress line.
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