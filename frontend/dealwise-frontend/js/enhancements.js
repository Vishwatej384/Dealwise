// Modern Professional Enhancements for DealWise
// This file adds modern features without changing existing functionality

(function() {
  'use strict';

  // ============================================
  // 1. SMOOTH SCROLL BEHAVIOR
  // ============================================
  document.documentElement.style.scrollBehavior = 'smooth';

  // ============================================
  // 2. INTERSECTION OBSERVER FOR ANIMATIONS
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.deal-card, .cat-card, .feature-card, section');
    elementsToAnimate.forEach(el => observer.observe(el));
  });

  // ============================================
  // 3. IMAGE LAZY LOADING WITH BLUR EFFECT
  // ============================================
  function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // ============================================
  // 4. ENHANCED TOAST NOTIFICATION SYSTEM
  // ============================================
  window.DealWiseToast = {
    show: function(message, type = 'info', duration = 3000) {
      const toast = document.createElement('div');
      toast.className = `dealwise-toast dealwise-toast-${type}`;
      
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      
      toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
      `;
      
      document.body.appendChild(toast);
      
      // Trigger animation
      setTimeout(() => toast.classList.add('show'), 10);
      
      // Remove after duration
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  };

  // ============================================
  // 5. LOADING SKELETON SCREENS
  // ============================================
  window.DealWiseSkeleton = {
    createDealCard: function() {
      return `
        <div class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-text skeleton-title"></div>
          <div class="skeleton-text skeleton-subtitle"></div>
          <div class="skeleton-actions">
            <div class="skeleton-button"></div>
            <div class="skeleton-button"></div>
          </div>
        </div>
      `;
    },
    
    showLoading: function(container, count = 6) {
      if (!container) return;
      container.innerHTML = '';
      for (let i = 0; i < count; i++) {
        container.innerHTML += this.createDealCard();
      }
    }
  };

  // ============================================
  // 6. BACK TO TOP BUTTON
  // ============================================
  function createBackToTop() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    });

    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 7. ENHANCED SEARCH WITH DEBOUNCE
  // ============================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  window.DealWiseSearch = {
    init: function(inputSelector, callback) {
      const input = document.querySelector(inputSelector);
      if (!input) return;

      const debouncedSearch = debounce((value) => {
        callback(value);
      }, 300);

      input.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
      });
    }
  };

  // ============================================
  // 8. NETWORK STATUS INDICATOR
  // ============================================
  function setupNetworkIndicator() {
    window.addEventListener('online', () => {
      DealWiseToast.show('Connection restored', 'success', 2000);
    });

    window.addEventListener('offline', () => {
      DealWiseToast.show('No internet connection', 'warning', 3000);
    });
  }

  // ============================================
  // 9. FORM VALIDATION ENHANCEMENT
  // ============================================
  window.DealWiseValidation = {
    email: function(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    
    phone: function(phone) {
      const re = /^[6-9]\d{9}$/;
      return re.test(phone);
    },
    
    password: function(password) {
      return password.length >= 6;
    },
    
    showError: function(input, message) {
      const error = document.createElement('div');
      error.className = 'validation-error';
      error.textContent = message;
      
      // Remove existing error
      const existing = input.parentElement.querySelector('.validation-error');
      if (existing) existing.remove();
      
      input.parentElement.appendChild(error);
      input.classList.add('invalid');
      
      setTimeout(() => {
        error.remove();
        input.classList.remove('invalid');
      }, 3000);
    }
  };

  // ============================================
  // 10. PERFORMANCE MONITORING
  // ============================================
  window.DealWisePerf = {
    measure: function(name, fn) {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      console.log(`[DealWise Perf] ${name}: ${(end - start).toFixed(2)}ms`);
      return result;
    }
  };

  // ============================================
  // INITIALIZE ON DOM READY
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    setupLazyLoading();
    createBackToTop();
    setupNetworkIndicator();
    
    // Add CSS for enhancements
    injectStyles();
  }

  // ============================================
  // INJECT ENHANCEMENT STYLES
  // ============================================
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Smooth animations */
      .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Toast notifications */
      .dealwise-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #0f1720, #1a2332);
        color: #e6eef6;
        padding: 16px 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        z-index: 10000;
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
      }

      .dealwise-toast.show {
        transform: translateX(0);
      }

      .dealwise-toast-success {
        border-left: 4px solid #00c8ff;
      }

      .dealwise-toast-error {
        border-left: 4px solid #ff4757;
      }

      .dealwise-toast-warning {
        border-left: 4px solid #ffc107;
      }

      .dealwise-toast-info {
        border-left: 4px solid #00c8ff;
      }

      .toast-icon {
        font-size: 20px;
        font-weight: bold;
      }

      .toast-message {
        font-weight: 500;
        font-size: 14px;
      }

      /* Skeleton loading */
      .skeleton-card {
        background: var(--card, #0f1720);
        border-radius: 12px;
        padding: 12px;
        border: 1px solid rgba(255,255,255,0.03);
      }

      .skeleton-image {
        width: 100%;
        height: 170px;
        background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 8px;
        margin-bottom: 12px;
      }

      .skeleton-text {
        height: 16px;
        background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 4px;
        margin-bottom: 8px;
      }

      .skeleton-title {
        width: 70%;
        height: 20px;
      }

      .skeleton-subtitle {
        width: 50%;
      }

      .skeleton-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .skeleton-button {
        flex: 1;
        height: 36px;
        background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 8px;
      }

      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Back to top button */
      .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #00c8ff, #66f0ff);
        color: #001;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        box-shadow: 0 8px 25px rgba(0,200,255,0.3);
        z-index: 9999;
      }

      .back-to-top.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .back-to-top:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 35px rgba(0,200,255,0.4);
      }

      /* Image lazy loading */
      img {
        transition: opacity 0.3s ease;
      }

      img:not(.loaded) {
        opacity: 0.3;
        filter: blur(5px);
      }

      img.loaded {
        opacity: 1;
        filter: blur(0);
      }

      /* Form validation */
      .validation-error {
        color: #ff4757;
        font-size: 12px;
        margin-top: 4px;
        animation: shake 0.3s ease;
      }

      input.invalid {
        border-color: #ff4757 !important;
        animation: shake 0.3s ease;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      /* Smooth page transitions */
      body {
        animation: pageLoad 0.4s ease;
      }

      @keyframes pageLoad {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Enhanced hover effects */
      .deal-card, .cat-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .deal-card:hover, .cat-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 50px rgba(0,200,255,0.15);
      }

      /* Loading state for buttons */
      button.loading {
        position: relative;
        color: transparent;
        pointer-events: none;
      }

      button.loading::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        margin-left: -8px;
        margin-top: -8px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

})();
