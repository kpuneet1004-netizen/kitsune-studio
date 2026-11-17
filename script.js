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
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); }
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

  // Service links preselect the matching native enquiry option.
  const projectTypeValues = [
    { match: /resume|portfolio/, value: 'portfolio-resume' },
    { match: /landing/, value: 'landing-page' },
    { match: /business/, value: 'business-website' }
  ];
  document.querySelectorAll('[data-project-type]').forEach(link => {
    link.addEventListener('click', () => {
      const label = (link.dataset.projectType || '').trim().toLowerCase();
      const match = projectTypeValues.find(item => item.match.test(label));
      if (!projectType || !match) return;
      projectType.value = match.value;
      projectType.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // Currency selector updates published starting prices without adding enquiry fields.
  const currencyButtons = [...document.querySelectorAll('[data-currency]')];
  const servicePrices = [...document.querySelectorAll('[data-price-inr][data-price-usd]')];
  const setCurrency = currency => {
    currencyButtons.forEach(button => {
      const active = button.dataset.currency === currency;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    servicePrices.forEach(price => {
      price.textContent = currency === 'USD' ? price.dataset.priceUsd : price.dataset.priceInr;
    });
    const pricingNote = document.querySelector('#pricing-note');
    if (pricingNote) pricingNote.textContent = currency === 'USD'
      ? 'Resume Site: $119. Landing Page: $299. Portfolio and Business Sites are custom quoted. Domain, paid services, copywriting, and maintenance are separate unless included in the agreed scope.'
      : 'Resume Site: ₹11,999. Landing Page: ₹29,999. Portfolio and Business Sites are custom quoted. Domain, paid services, copywriting, and maintenance are separate unless included in the agreed scope.';
  };
  currencyButtons.forEach(button => button.addEventListener('click', () => setCurrency(button.dataset.currency)));
  setCurrency('INR');

  const form = document.querySelector('#project-form');
  const formNote = document.querySelector('#form-note');
  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const submitButton = form.querySelector('[type="submit"]');
      const originalButton = submitButton?.innerHTML;
      if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Sending enquiry…'; }
      if (formNote) formNote.textContent = 'Sending your enquiry to Kitsune Studio…';
      try {
        const response = await fetch('https://formsubmit.co/ajax/kpuneet1004@gmail.com', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });
        const result = await response.json();
        const accepted = result.success === true || String(result.success).toLowerCase() === 'true';
        if (!response.ok || !accepted) throw new Error(result.message || 'The enquiry could not be sent.');
        form.reset();
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