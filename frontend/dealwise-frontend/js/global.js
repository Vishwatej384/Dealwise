// Global theme and utility functions for DealWise
class DealWiseTheme {
  constructor() {
    this.currentTheme = 'dark';
    this.init();
  }

  init() {
    this.loadTheme();
    this.applyTheme();
    this.setupThemeToggle();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('dealwise_theme') || 'dark';
    this.currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  applyTheme() {
    // Apply theme to body
    const body = document.body;
    if (this.currentTheme === 'light') {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    } else {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('dealwise_theme', this.currentTheme);
    this.applyTheme();
    this.updateThemeUI();
  }

  setupThemeToggle() {
    // Look for existing theme toggle
    const toggle = document.getElementById('themeSwitch');
    if (toggle) {
      toggle.addEventListener('change', () => this.toggleTheme());
      toggle.checked = this.currentTheme === 'dark';
    }
  }

  updateThemeUI() {
    // Update any existing theme toggles
    const toggles = document.querySelectorAll('#themeSwitch');
    toggles.forEach(toggle => {
      toggle.checked = this.currentTheme === 'dark';
    });
  }
}

// Global cart management
class DealWiseCart {
  constructor() {
    this.cartKey = 'dealwise_cart';
    this.init();
  }

  init() {
    this.updateCartCount();
  }

  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
    } catch (e) {
      return [];
    }
  }

  setCart(cart) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateCartCount();
  }

  addToCart(item) {
    const cart = this.getCart();
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    this.setCart(cart);
    this.showAddToCartAnimation();
    return cart;
  }

  updateCartCount() {
    const cart = this.getCart();
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    const cartCountElements = document.querySelectorAll('#cartCount, .cart-count');
    cartCountElements.forEach(el => {
      el.textContent = count;
    });
  }

  showAddToCartAnimation() {
    // Create floating animation
    const animation = document.createElement('div');
    animation.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(90deg, #00c8ff, #66f0ff);
      color: #001;
      padding: 12px 20px;
      border-radius: 25px;
      font-weight: 700;
      font-size: 16px;
      z-index: 10000;
      pointer-events: none;
      animation: cartAnimation 1.5s ease-out forwards;
    `;
    animation.textContent = '✅ Added to Cart!';
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cartAnimation {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8) translateY(-30px); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(animation);
    setTimeout(() => {
      animation.remove();
      style.remove();
    }, 1500);
  }
}

// Global utilities
class DealWiseUtils {
  static showToast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'linear-gradient(90deg, #00c8ff, #66f0ff)' : '#ff4757';
    const textColor = type === 'success' ? '#001' : 'white';
    
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: ${textColor};
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10000;
      animation: toastSlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      max-width: 300px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    `;
    toast.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes toastSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes toastSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      setTimeout(() => {
        toast.remove();
        style.remove();
      }, 300);
    }, duration);
  }

  static navigateTo(url) {
    document.documentElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    document.documentElement.style.opacity = '0.8';
    document.documentElement.style.transform = 'scale(0.98)';
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  }
}

// Initialize global components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dealwiseTheme = new DealWiseTheme();
  window.dealwiseCart = new DealWiseCart();
  
  // Add page transition class
  document.documentElement.classList.add('page-transition');
});

// Export for use in other scripts
window.DealWiseUtils = DealWiseUtils;