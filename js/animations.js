/* ==============================
   ANIMATIONS.JS — GSAP animations, ScrollTrigger, text reveals
   ============================== */

class PortfolioAnimations {
  constructor() {
    this.initialized = false;
    this.lenis = null;
    this.init();
  }

  init() {
    // Wait for GSAP to be ready
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded yet, retrying...');
      setTimeout(() => this.init(), 200);
      return;
    }

    // Register ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Wait for loader to complete, then start animations
    document.addEventListener('loaderComplete', () => {
      this.startAnimations();
    });

    // Also start if loader already completed
    if (document.querySelector('.loader--hidden') || document.getElementById('loader').style.display === 'none') {
      this.startAnimations();
    }
  }

  startAnimations() {
    if (this.initialized) return;
    this.initialized = true;

    this.initLenis();
    this.animateHero();
    this.animateSections();
    this.animateCounters();
    this.animateSkillBars();
  }

  initLenis() {
    if (typeof window.Lenis === 'undefined') return;

    this.lenis = new window.Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  /* --- HERO ANIMATIONS --- */
  animateHero() {
    // Hero reveal timeline
    const tl = gsap.timeline({ delay: 0.3 });

    // Badge
    tl.from('.hero__badge', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Title lines with SplitType
    const titleLines = document.querySelectorAll('[data-split]');
    if (titleLines.length && typeof SplitType !== 'undefined') {
      titleLines.forEach((line) => {
        const split = new SplitType(line, { types: 'chars' });
        tl.from(split.chars, {
          y: 80,
          opacity: 0,
          rotateX: -90,
          stagger: 0.03,
          duration: 0.6,
          ease: 'back.out(1.7)',
        }, '-=0.4');
      });
    } else {
      // Fallback if SplitType not available
      tl.from('.hero__title-line', {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.4');
    }

    // Subtitle
    tl.from('.hero__subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.4');

    // Description
    tl.from('.hero__description', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.3');

    // Actions
    tl.from('.hero__actions .btn', {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.3');

    // Social icons
    tl.from('.hero__social', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.2');

    // Badge pulse
    tl.from('.hero__badge::before', {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.2');

    // Scroll indicator
    tl.from('.hero__scroll-indicator', {
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.1');
  }

  /* --- SECTION REVEALS --- */
  animateSections() {
    if (typeof ScrollTrigger === 'undefined') {
      // Fallback: simple CSS animations
      document.querySelectorAll('[data-reveal]').forEach(el => {
        el.classList.add('animate-fade-up');
      });
      return;
    }

    // Reveal animation for sections
    const revealElements = document.querySelectorAll('[data-reveal]');

    revealElements.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });

    // Stagger children
    const staggerGroups = [
      { parent: '.skills__category', child: '.skills__category' },
      { parent: '.project-card', child: '.project-card' },
      { parent: '.experience__item', child: '.experience__item' },
      { parent: '.github__stat', child: '.github__stat' },
      { parent: '.achievement-card', child: '.achievement-card' },
      { parent: '.blog-card', child: '.blog-card' },
    ];

    staggerGroups.forEach(({ parent, child }) => {
      const items = document.querySelectorAll(child);
      if (items.length === 0) return;

      gsap.from(items, {
        scrollTrigger: {
          trigger: parent,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    // Timeline items
    const timelineItems = document.querySelectorAll('.experience__item');
    timelineItems.forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });
  }

  /* --- COUNTER ANIMATIONS --- */
  animateCounters() {
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-count'));

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(counter, {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            onUpdate: () => {
              const current = parseInt(counter.innerText);
              if (target > 0) {
                counter.innerText = current.toLocaleString();
              }
            },
          });
        },
        once: true,
      });
    });
  }

  /* --- SKILL BAR ANIMATIONS --- */
  animateSkillBars() {
    const bars = document.querySelectorAll('.github__lang-fill');

    bars.forEach((bar) => {
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        onEnter: () => {
          bar.classList.add('animated');
        },
        once: true,
      });
    });
  }
}

// Init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a tick for other scripts to load
  setTimeout(() => {
    new PortfolioAnimations();
  }, 100);
});
