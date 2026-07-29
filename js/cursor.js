/* ==============================
   CURSOR.JS — Custom cursor with magnetic effects
   ============================== */

class CustomCursor {
  constructor() {
    this.cursor = document.getElementById('cursor');
    this.dot = this.cursor.querySelector('.cursor__dot');
    this.ring = this.cursor.querySelector('.cursor__ring');
    this.label = this.cursor.querySelector('.cursor__label');
    this.pos = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.ringPos = { x: 0, y: 0 };
    this.isHovering = false;
    this.isVisible = true;
    this.velocity = { x: 0, y: 0 };

    this.init();
  }

  init() {
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;

      if (!this.isVisible) {
        this.pos.x = e.clientX;
        this.pos.y = e.clientY;
        this.ringPos.x = e.clientX;
        this.ringPos.y = e.clientY;
      }
      this.isVisible = true;
    });

    document.addEventListener('mouseleave', () => {
      this.isVisible = false;
      this.cursor.classList.add('cursor--hidden');
    });

    document.addEventListener('mouseenter', () => {
      this.isVisible = true;
      this.cursor.classList.remove('cursor--hidden');
    });

    // Hover effects for interactive elements
    this.setupHoverEffects();

    // Magnetic effects
    this.setupMagneticEffects();

    // RAF loop
    this.animate();
  }

  setupHoverEffects() {
    const hoverTargets = document.querySelectorAll(
      'a, button, .btn, .nav__link, .project-card, .skills__category, .achievement-card, .blog-card, .about__stat, .github__stat'
    );

    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.add('cursor--hover');
      });

      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('cursor--hover');
      });
    });

    // Link specific label
    document.querySelectorAll('a').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (el.classList.contains('hero__social') || el.classList.contains('contact__social') || el.classList.contains('footer__social')) {
          return;
        }
        this.cursor.classList.add('cursor--label');
        this.label.textContent = el.classList.contains('project-card__btn') ? 'Open' : el.textContent.trim().substring(0, 15);
      });
      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('cursor--label');
      });
    });
  }

  setupMagneticEffects() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;

        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  animate() {
    // Smooth following for dot
    this.pos.x += (this.target.x - this.pos.x) * 0.15;
    this.pos.y += (this.target.y - this.pos.y) * 0.15;

    // Slower follow for ring (with delay)
    this.ringPos.x += (this.target.x - this.ringPos.x) * 0.08;
    this.ringPos.y += (this.target.y - this.ringPos.y) * 0.08;

    this.dot.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;
    this.ring.style.transform = `translate(${this.ringPos.x}px, ${this.ringPos.y}px)`;

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize cursor on DOM ready
function initCursor() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    document.body.classList.remove('touch-device');
    new CustomCursor();
  } else {
    document.body.classList.add('touch-device');
    document.body.style.cursor = 'auto';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCursor);
} else {
  initCursor();
}
