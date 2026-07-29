/* ==============================
   MAIN.JS — Main orchestrator
   Particle background, typed text, contribution graph, contact form
   ============================== */

class Main {
  constructor() {
    this.init();
  }

  init() {
    this.initParticleCanvas();
    this.initTypedText();
    this.initContributionGraph();
    this.initContactForm();
    this.initBackToTop();
    this.initButtonRipple();
  }

  /* --- Particle Canvas Background --- */
  initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let animationId = null;
    let isVisible = true;

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 80);

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 70, 229, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      // Mouse interaction
      particles.forEach(p => {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x += dx * 0.01;
          p.y += dy * 0.01;
        }
      });

      animationId = requestAnimationFrame(draw);
    }

    // Visibility observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationId) {
          animationId = requestAnimationFrame(draw);
        } else if (!isVisible && animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    });
    observer.observe(canvas.parentElement);

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    resize();
    createParticles();
    animationId = requestAnimationFrame(draw);

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }

  /* --- Typed Text Effect --- */
  initTypedText() {
    const textElement = document.querySelector('[data-typed]');
    if (!textElement) return;

    const words = [
      'Full Stack Developer',
      'Web Developer',
      'Problem Solver',
      'Tech Enthusiast',
      'Lifelong Learner',
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
      const currentWord = words[wordIndex];

      if (isPaused) {
        setTimeout(type, 2000);
        isPaused = false;
        return;
      }

      if (isDeleting) {
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isPaused = true;
        isDeleting = true;
        setTimeout(type, 2500);
        return;
      }

      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
        return;
      }

      const speed = isDeleting ? 40 : 80;
      setTimeout(type, speed);
    }

    // Start typing after loader
    document.addEventListener('loaderComplete', () => {
      setTimeout(type, 1800);
    });
  }

  /* --- Contribution Graph --- */
  initContributionGraph() {
    const graph = document.getElementById('contributionGraph');
    if (!graph) return;

    // Generate 52 weeks x 7 days of contribution data
    const days = 52 * 7;
    for (let i = 0; i < days; i++) {
      const cell = document.createElement('div');
      cell.className = 'github__graph-cell';

      // Random contribution level (0-4)
      const rand = Math.random();
      let level = 0;
      if (rand > 0.6) level = 1;
      if (rand > 0.8) level = 2;
      if (rand > 0.92) level = 3;
      if (rand > 0.97) level = 4;

      cell.setAttribute('data-level', level);
      cell.title = `${level} contributions`;

      // Tooltip on hover
      cell.addEventListener('mouseenter', () => {
        cell.style.position = 'relative';
        // Simple tooltip approach
      });

      graph.appendChild(cell);
    }
  }

  /* --- Contact Form --- */
  initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = form.querySelectorAll('.contact__field');
      let isValid = true;

      fields.forEach(field => {
        const input = field.querySelector('.contact__input');
        const errorEl = field.querySelector('.contact__error');

        // Reset
        field.classList.remove('contact__field--error');

        if (!input.value.trim()) {
          field.classList.add('contact__field--error');
          if (errorEl) errorEl.textContent = 'This field is required';
          isValid = false;
        } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
          field.classList.add('contact__field--error');
          if (errorEl) errorEl.textContent = 'Please enter a valid email';
          isValid = false;
        }
      });

      if (!isValid) return;

      // Success state
      const submitBtn = form.querySelector('.contact__submit');
      const originalText = submitBtn.querySelector('.btn__text').textContent;
      submitBtn.querySelector('.btn__text').textContent = 'Message Sent!';
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.opacity = '0.7';

      // Reset form
      form.reset();

      setTimeout(() => {
        submitBtn.querySelector('.btn__text').textContent = originalText;
        submitBtn.style.pointerEvents = '';
        submitBtn.style.opacity = '';
      }, 3000);
    });

    // Real-time validation
    form.querySelectorAll('.contact__input').forEach(input => {
      input.addEventListener('blur', () => {
        const field = input.closest('.contact__field');
        const errorEl = field.querySelector('.contact__error');

        field.classList.remove('contact__field--error');

        if (!input.value.trim()) {
          field.classList.add('contact__field--error');
          if (errorEl) errorEl.textContent = 'This field is required';
        } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
          field.classList.add('contact__field--error');
          if (errorEl) errorEl.textContent = 'Please enter a valid email';
        }
      });
    });
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* --- Back to Top --- */
  initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Show/hide button
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      } else {
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
      }
    }, { passive: true });
  }

  /* --- Button Ripple Effect --- */
  initButtonRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const ripple = this.querySelector('.btn__ripple');
        if (!ripple) return;

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.animation = 'none';
        ripple.offsetHeight; // Trigger reflow
        ripple.style.animation = 'rippleEffect 0.6s ease-out';

        // Remove animation after it completes
        setTimeout(() => {
          ripple.style.animation = 'none';
        }, 600);
      });
    });
  }
}

// Init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for other scripts
  setTimeout(() => {
    new Main();
  }, 200);
});
