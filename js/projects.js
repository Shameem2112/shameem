/* ==============================
   PROJECTS.JS — Project card interactions & filtering
   ============================== */

class ProjectManager {
  constructor() {
    this.projects = document.querySelectorAll('[data-project]');
    this.activeButton = null;

    this.init();
  }

  init() {
    if (this.projects.length === 0) return;

    // Initialize Vanilla Tilt
    this.initTilt();

    // Add click handler for expandable details
    this.initExpand();
  }

  initTilt() {
    if (typeof VanillaTilt === 'undefined') return;

    this.projects.forEach(card => {
      VanillaTilt.init(card, {
        max: 3,
        speed: 400,
        glare: true,
        'max-glare': 0.15,
        scale: 1.01,
        gyroscope: false,
      });
    });
  }

  initExpand() {
    this.projects.forEach((card, index) => {
      const btn = card.querySelector('.project-card__btn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleExpand(card);
        });
      }
    });
  }

  toggleExpand(card) {
    const body = card.querySelector('.project-card__body');
    const features = card.querySelector('.project-card__features');

    if (card.classList.contains('project-card--expanded')) {
      card.classList.remove('project-card--expanded');
      features.style.maxHeight = '0';
    } else {
      card.classList.add('project-card--expanded');
      features.style.maxHeight = features.scrollHeight + 'px';
    }
  }
}

// Note: Filtering is handled by the main page if needed
document.addEventListener('DOMContentLoaded', () => {
  new ProjectManager();
});
