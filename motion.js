/* Kitsune Studio — lightweight ambient motion layer */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.hero-art');
  if (!hero || reduceMotion) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'ks-starfield';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);

  const context = canvas.getContext('2d', { alpha: true });
  if (!context) { canvas.remove(); return; }

  let width = 0;
  let height = 0;
  let frame = 0;
  let active = true;
  let visible = true;
  let pointerX = 0;
  let pointerY = 0;
  let particles = [];
  const count = window.matchMedia('(max-width: 680px)').matches ? 26 : 48;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

  const makeParticles = () => Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: .45 + Math.random() * 1.25,
    alpha: .16 + Math.random() * .48,
    phase: Math.random() * Math.PI * 2,
    speed: .25 + Math.random() * .55,
    drift: (Math.random() - .5) * .16,
    warm: index % 5 === 0
  }));

  const resize = () => {
    const bounds = hero.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    particles = makeParticles();
    draw(0);
  };

  const draw = time => {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    particles.forEach(particle => {
      const pulse = .55 + Math.sin(time * .0007 * particle.speed + particle.phase) * .35;
      const x = particle.x + pointerX * particle.drift;
      const y = particle.y + pointerY * particle.drift;
      context.beginPath();
      context.arc(x, y, particle.radius * (particle.warm ? 1.15 : 1), 0, Math.PI * 2);
      context.fillStyle = particle.warm
        ? 'rgba(255,101,0,' + (particle.alpha * pulse) + ')'
        : 'rgba(230,224,242,' + (particle.alpha * pulse) + ')';
      context.fill();
    });
  };

  const animate = time => {
    if (!active || !visible || document.hidden) { frame = 0; return; }
    draw(time);
    frame = window.requestAnimationFrame(animate);
  };
  const start = () => {
    if (!frame && active && visible && !document.hidden) frame = window.requestAnimationFrame(animate);
  };
  const stop = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  };

  hero.addEventListener('pointermove', event => {
    const bounds = hero.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left - bounds.width / 2) / bounds.width;
    pointerY = (event.clientY - bounds.top - bounds.height / 2) / bounds.height;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; }, { passive: true });

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);
  else window.addEventListener('resize', resize, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  resize();
  start();
})();


/* V2: process timeline state follows visibility; no scroll interception. */
(() => {
  const timeline = document.querySelector('.ks-process-timeline');
  if (!timeline) return;
  const steps = [...timeline.querySelectorAll('article')];
  if (!('IntersectionObserver' in window)) {
    timeline.classList.add('is-in-view');
    steps.forEach(step => step.classList.add('is-active'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      timeline.classList.add('is-in-view');
      const index = steps.indexOf(entry.target);
      entry.target.classList.add('is-active');
      steps.slice(0, index).forEach(step => step.classList.add('is-active'));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  steps.forEach(step => observer.observe(step));
})();
