// Global authentication manager for DealWise
// This file handles authentication state across all pages

class DealWiseAuth {
  constructor() {
    this.user = null;
    this.token = null;
  }

  init() {
    this.loadUser();
    this.updateNavbar();
  }

  loadUser() {
    try {
      const userData = localStorage.getItem('dealwise_user');
      const token = localStorage.getItem('token');
      
      if (userData && token) {
        this.user = JSON.parse(userData);
        this.token = token;
      }
    } catch (e) {
      console.error('Failed to load user data:', e);
    }
  }

  isLoggedIn() {
    return !!this.user && !!this.token;
  }

  updateNavbar() {
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return;

    if (this.isLoggedIn()) {
      // User is logged in - show profile
      this.renderLoggedInNav(navRight);
    } else {
      // User is not logged in - show login/signup buttons
      this.renderLoggedOutNav(navRight);
    }
  }

  renderLoggedInNav(navRight) {
    // Check if we already have the profile UI to avoid duplicate
    if (navRight.querySelector('.user-profile')) {
      return;
    }

    // Get user initials
    const initials = this.getInitials(this.user.name);
    
    navRight.innerHTML = `
      <div class="search-wrap">
        <input id="searchInput" placeholder="Search deals..." style="width: 260px; padding: 10px 12px; border-radius: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.04); color: #e6eef6; outline: none;" />
      </div>
      
      <button id="cartButton" class="icon-btn" style="background: transparent; border: 1px solid rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 10px; cursor: pointer; color: var(--muted, #98a0aa);">
        🛍️ <span id="cartCount" class="cart-count" style="display: inline-block; min-width: 20px; padding: 0 7px; border-radius: 999px; background: linear-gradient(90deg, var(--accent, #00c8ff), #66f0ff); color: #001; font-weight: 700; margin-left: 8px; font-size: 13px;">0</span>
      </button>

      <div class="user-profile" style="display: flex; align-items: center; gap: 12px;">
        <a href="profile.html" style="color: var(--accent, #00c8ff); font-weight: 600; text-decoration: none; font-size: 14px;">My Profile</a>
        <div class="user-avatar" style="
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, var(--accent, #00c8ff), #66f0ff);
          color: #001; display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 14px; cursor: pointer; box-shadow: 0 0 10px rgba(0,200,255,0.3);
        ">
          ${initials}
        </div>
        <button id="logoutBtn" style="
          background: #ff4757; border: none; color: white; padding: 8px 14px;
          border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;
        ">Logout</button>
      </div>
    `;

    // Setup event listeners
    this.setupEventListeners();
    
    // Update cart count
    if (window.dealwiseCart) {
      window.dealwiseCart.updateCartCount();
    }
  }

  renderLoggedOutNav(navRight) {
    // Check if we already have the login buttons to avoid duplicate
    if (navRight.querySelector('#loginBtn')) {
      return;
    }

    navRight.innerHTML = `
      <div class="search-wrap">
        <input id="searchInput" placeholder="Search deals..." style="width: 260px; padding: 10px 12px; border-radius: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.04); color: #e6eef6; outline: none;" />
      </div>
      <button id="cartButton" class="icon-btn" style="background: transparent; border: 1=device-solid rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 10px; cursor: pointer; color: var(--muted, #98a0aa);">
        🛍️ <span id="cartCount" class="cart-count" style="display: inline-block; min-width: 20px; padding: 0 7px; border-radius: 999px; background: linear-gradient(90deg, var(--accent, #00c8ff), #66f0ff); color: #001; font-weight: 700; margin-left: 8px; font-size: 13px;">0</span>
      </button>
      <button id="loginBtn" class="icon-btn" style="background: transparent; border: 1px solid rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 10px; cursor: pointer; color: var(--muted, #98a0aa); font-weight: 600;">Login</button>
      <button id="signupBtn" class="btn-accent" style="background: linear-gradient(90deg, var(--accent, #00c8ff), #66f0ff); color: #001; padding: 10px 14px; border-radius: 10px; border: none; cursor: pointer; font-weight: 700; box-shadow: 0 10px 30px rgba(0,200,255,0.08);">Sign Up</button>
    `;

    // Setup event listeners
    this.setupEventListeners();
    
    // Update cart count
    if (window.dealwiseCart) {
      window.dealwiseCart.updateCartCount();
    }
  }

  setupEventListeners() {
    // Cart button
    const cartBtn = document.getElementById('cartButton');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        window.location.href = 'cart.html';
      });
    }

    // Login/Signup buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
      });
    }
    
    if (signupBtn) {
      signupBtn.addEventListener('click', () => {
        window.location.href = 'signup.html';
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }
  }

  logout() {
    localStorage.removeItem('dealwise_user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }

  getInitials(name) {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

// Initialize auth manager
document.addEventListener('DOMContentLoaded', () => {
  window.dealwiseAuth = new DealWiseAuth();
  window.dealwiseAuth.init();
});
