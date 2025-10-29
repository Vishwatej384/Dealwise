// Shared functions for DealWise - handles theme toggle and image fallbacks

// Initialize theme toggle in navbar
function initializeThemeToggle() {
  const navRight = document.querySelector('.nav-right');
  if (!navRight || document.getElementById('themeToggle')) return;
  
  const themeContainer = document.createElement('div');
  themeContainer.style.cssText = 'display: flex; align-items: center; gap: 6px; margin-right: 12px;';
  themeContainer.innerHTML = `
    <span style="font-size: 16px;">🌙</span>
    <label style="position: relative; display: inline-block; width: 44px; height: 24px;">
      <input type="checkbox" id="themeToggle" style="opacity: 0; width: 0; height: 0;">
      <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #555; transition: .4s; border-radius: 24px;"></span>
    </label>
    <span style="font-size: 16px;">☀️</span>
  `;
  
  // Add slider styles
  const style = document.createElement('style');
  style.textContent = `
    #themeToggle + span:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    #themeToggle:checked + span {
      background-color: #00c8ff;
    }
    #themeToggle:checked + span:before {
      transform: translateX(20px);
    }
  `;
  document.head.appendChild(style);
  
  navRight.insertBefore(themeContainer, navRight.firstChild);
  
  // Setup toggle event
  const toggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('dealwise_theme') || 'dark';
  toggle.checked = savedTheme === 'dark';
  
  toggle.addEventListener('change', () => {
    const newTheme = toggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dealwise_theme', newTheme);
    applyTheme(newTheme);
  });
}

// Apply theme globally
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.style.setProperty('--bg', '#f8f9fa');
    root.style.setProperty('--card', '#ffffff');
    root.style.setProperty('--text', '#111111');
    root.style.setProperty('--muted', '#666666');
    document.body.style.background = 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)';
    document.body.style.color = '#111';
  } else {
    root.style.setProperty('--bg', '#0d1117');
    root.style.setProperty('--card', '#0f1720');
    root.style.setProperty('--text', '#e6eef6');
    root.style.setProperty('--muted', '#98a0aa');
    document.body.style.background = 'linear-gradient(180deg, #06080b 0%, #0d1117 100%)';
    document.body.style.color = '#e6eef6';
  }
}

// Replace broken images with colored divs
function replaceBrokenImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.onerror = function() {
      const title = img.alt || '';
      let emoji = '🛍️';
      let color = 'linear-gradient(135deg, #1a1a2e, #16213e)';
      
      if (title.includes('headphone')) {
        emoji = '🎧';
        color = 'linear-gradient(135deg, #0040d4, #0066ff)';
      } else if (title.includes('watch') || title.includes('smartwatch')) {
        emoji = '⌚';
        color = 'linear-gradient(135deg, #604080, #8040a0)';
      } else if (title.includes('keyboard') || title.includes('gaming')) {
        emoji = '⌨️';
        color = 'linear-gradient(135deg, #804040, #a06060)';
      }
      
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `width: 100%; height: 150px; background: ${color}; display: flex; align-items: center; justify-content: center; font-size: 60px; border-radius: 8px;`;
      placeholder.textContent = emoji;
      
      if (this.parentNode) {
        this.parentNode.insertBefore(placeholder, this);
        this.style.display = 'none';
      }
    };
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initializeThemeToggle();
  replaceBrokenImages();
  
  // Apply saved theme
  const savedTheme = localStorage.getItem('dealwise_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  applyTheme(savedTheme);
});