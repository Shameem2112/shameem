/* ==============================
   NAVIGATION.JS — Sticky nav, scroll progress, hamburger menu
   ============================== */

class Navigation {
  constructor() {
    this.nav = document.getElementById('nav');
    this.scrollProgress = document.getElementById('scrollProgress');
    this.hamburger = document.getElementById('hamburger');
    this.navLinks = document.getElementById('navLinks');
    this.links = document.querySelectorAll('[data-nav]');
    this.sections = document.querySelectorAll('[data-section]');
    this.lastScrollY = 0;
    this.isHidden = false;
    this.isMobileOpen = false;

    // Create mobile overlay
    this.createMobileOverlay();

    this.init();
  }

  createMobileOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'nav__mobile-overlay';
    this.overlay.id = 'mobileOverlay';
    document.body.appendChild(this.overlay);

    // Clone links for mobile
    this.links.forEach(link => {
      const mobileLink = document.createElement('a');
      mobileLink.href = link.getAttribute('href');
      mobileLink.className = 'nav__mobile-link';
      mobileLink.textContent = link.textContent;
      if (link.classList.contains('nav__link--resume')) {
        mobileLink.target = '_blank';
        mobileLink.rel = 'noopener';
      }
      this.overlay.appendChild(mobileLink);
    });
  }

  init() {
    // Scroll progress
    window.addEventListener('scroll', () => {
      this.updateScrollProgress();
      this.handleNavVisibility();
      this.updateActiveLink();
    }, { passive: true });

    // Hamburger toggle
    this.hamburger.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close mobile menu on link click
    this.overlay.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav__mobile-link')) {
        this.closeMobileMenu();
      }
    });

    // Scroll to section on nav link click
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const offset = this.nav.offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
          }
        }
      });
    });

    // Close hamburger on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileOpen) {
        this.closeMobileMenu();
      }
    });

    // Update active link on load
    this.updateActiveLink();
  }

  updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    this.scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    this.scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
  }

  handleNavVisibility() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > this.nav.offsetHeight + 20) {
      if (currentScrollY > this.lastScrollY && !this.isHidden) {
        this.nav.classList.add('nav--hidden');
        this.isHidden = true;
      } else if (currentScrollY < this.lastScrollY && this.isHidden) {
        this.nav.classList.remove('nav--hidden');
        this.isHidden = false;
      }
      this.nav.classList.add('nav--scrolled');
    } else {
      this.nav.classList.remove('nav--scrolled', 'nav--hidden');
      this.isHidden = false;
    }

    this.lastScrollY = currentScrollY;
  }

  updateActiveLink() {
    const scrollPos = window.scrollY + this.nav.offsetHeight + 100;

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        const id = section.getAttribute('id');
        this.links.forEach(link => {
          link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  toggleMobileMenu() {
    if (this.isMobileOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMobileOpen = true;
    this.hamburger.classList.add('nav__hamburger--active');
    this.hamburger.setAttribute('aria-expanded', 'true');
    this.overlay.classList.add('nav__mobile-overlay--open');
    document.body.style.overflow = 'hidden';

    // Animate mobile links
    const links = this.overlay.querySelectorAll('.nav__mobile-link');
    links.forEach((link, i) => {
      link.style.transition = `opacity 0.4s ease, transform 0.4s ease`;
      link.style.opacity = '0';
      link.style.transform = 'translateY(20px)';
      setTimeout(() => {
        link.style.opacity = '1';
        link.style.transform = 'translateY(0)';
      }, 100 + i * 60);
    });
  }

  closeMobileMenu() {
    this.isMobileOpen = false;
    this.hamburger.classList.remove('nav__hamburger--active');
    this.hamburger.setAttribute('aria-expanded', 'false');
    this.overlay.classList.remove('nav__mobile-overlay--open');
    document.body.style.overflow = '';
  }
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
});
