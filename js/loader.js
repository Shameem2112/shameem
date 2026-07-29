/* ==============================
   LOADER.JS — Premium loading screen
   ============================== */

class Loader {
  constructor() {
    this.loader = document.getElementById('loader');
    this.progressBar = document.getElementById('loaderProgress');
    this.percentText = document.getElementById('loaderPercent');
    this.progress = 0;
    this.isComplete = false;

    this.init();
  }

  init() {
    // Simulate loading progress
    this.simulateProgress();

    // Ensure loader hides after max 3s regardless
    this.timeout = setTimeout(() => {
      this.complete();
    }, 3000);
  }

  simulateProgress() {
    const interval = setInterval(() => {
      if (this.isComplete) {
        clearInterval(interval);
        return;
      }

      // Slow down as we approach 100%
      const remaining = 100 - this.progress;
      const increment = Math.max(0.5, remaining * (0.05 + Math.random() * 0.1));

      this.progress = Math.min(this.progress + increment, 95); // Cap at 95% until fully loaded
      this.updateProgress();
    }, 80);
  }

  updateProgress() {
    this.progressBar.style.width = `${this.progress}%`;
    this.percentText.textContent = `${Math.round(this.progress)}%`;
  }

  complete() {
    if (this.isComplete) return;
    this.isComplete = true;

    clearTimeout(this.timeout);

    // Fill to 100%
    this.progress = 100;
    this.updateProgress();

    // Hide loader
    setTimeout(() => {
      this.loader.classList.add('loader--hidden');

      // Trigger page entrance animations
      document.dispatchEvent(new CustomEvent('loaderComplete'));

      // Remove from DOM after transition
      setTimeout(() => {
        this.loader.style.display = 'none';
      }, 600);
    }, 300);
  }
}

// Init loader
document.addEventListener('DOMContentLoaded', () => {
  window.pageLoader = new Loader();

  // Ensure loader completes when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.pageLoader.complete();
    }, 500);
  });
});
