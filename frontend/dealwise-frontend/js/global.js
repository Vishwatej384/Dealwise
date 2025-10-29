// Global theme and utility functions for DealWise
class DealWiseTheme {
  constructor() {
    this.init();
  }

  init() {
    this.loadTheme();
    this.setupThemeToggle();
    this.updateThemeUI();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('dealwise_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.currentTheme = savedTheme;
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('dealwise_theme', this.currentTheme);
    this.updateThemeUI();
  }

  setupThemeToggle() {
    // Create theme toggle if it doesn't exist
    if (!document.getElementById('globalThemeToggle')) {
      this.createThemeToggle();
    }
    
    const toggle = document.getElementById('globalThemeToggle');
    if (toggle) {
      toggle.addEventListener('change', () => this.toggleTheme());
      toggle.checked = this.currentTheme === 'dark';
    }
  }

  createThemeToggle() {
    // Add theme toggle to navbar if it exists
    const navRight = document.querySelector('.nav-right');
    if (navRight && !document.getElementById('globalThemeToggle')) {
      const themeContainer = document.createElement('div');
      themeContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-right: 10px;
      `;
      
      themeContainer.innerHTML = `
        <span style="color: var(--muted); font-size: 12px;">🌙</span>
        <label class="switch" style="position: relative; display: inline-block; width: 40px; height: 20px;">
          <input type="checkbox" id="globalThemeToggle" ${this.currentTheme === 'dark' ? 'checked' : ''}>
          <span class="slider" style="
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #555;
            transition: .4s;
            border-radius: 20px;
          "></span>
        </label>
        <span style="color: var(--muted); font-size: 12px;">☀️</span>
      `;
      
      navRight.insertBefore(themeContainer, navRight.firstChild);
      
      // Add slider styles
      const style = document.createElement('style');
      style.textContent = `
        .switch input { opacity: 0; width: 0; height: 0; }
        .switch .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        .switch input:checked + .slider {
          background-color: var(--accent);
          box-shadow: 0 0 8px rgba(0,200,255,0.3);
        }
        .switch input:checked + .slider:before {
          transform: translateX(20px);
        }
      `;
      document.head.appendChild(style);
    }
  }

  updateThemeUI() {
    // Update any existing theme toggles
    const toggles = document.querySelectorAll('#globalThemeToggle, #themeSwitch');
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
