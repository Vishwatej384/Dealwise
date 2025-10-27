// simple client-side demo auth & profile display (for frontend testing)
// NOTE: this is demo-only, replace with real backend auth later.

// read current user from localStorage
function getCurrentUser(){ try { return JSON.parse(localStorage.getItem('dealwise_user')); } catch(e){ return null; } }

function showProfileCircle(){
  const u = getCurrentUser();
  const el = document.querySelector('.profile-circle');
  if(!el) return;
  if(u && u.username){
    el.textContent = u.username[0].toUpperCase();
    el.title = u.username;
  } else {
    el.textContent = 'G';
    el.title = 'Guest';
  }
}

// demo cart badge update
function updateCartBadge(){
  const cart = JSON.parse(localStorage.getItem('dealwise_cart') || '[]');
  const badgeEls = document.querySelectorAll('.cart-badge');
  badgeEls.forEach(b => b.textContent = cart.length || '');
}

// form handlers for signup & login (demo-only)
function attachAuthHandlers(){
  const signupForm = document.getElementById('signup-form');
  if(signupForm){
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const username = signupForm.username.value.trim();
      const email = signupForm.email.value.trim();
      const password = signupForm.password.value;
      if(!username || !email || !password){ alert('Please fill all fields'); return; }
      const user = { username, email };
      localStorage.setItem('dealwise_user', JSON.stringify(user));
      // redirect to home
      window.location.href = 'index.html';
    });
  }

  const loginForm = document.getElementById('login-form');
  if(loginForm){
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;
      if(!email || !password){ alert('Please enter credentials'); return; }
      // In demo: just create a username from email if not present
      const user = { username: email.split('@')[0], email };
      localStorage.setItem('dealwise_user', JSON.stringify(user));
      window.location.href = 'index.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  showProfileCircle();
  updateCartBadge();
  attachAuthHandlers();

  // logout support via element with id logout-btn
  const logout = document.getElementById('logout-btn');
  if(logout) logout.addEventListener('click', ()=>{
    localStorage.removeItem('dealwise_user');
    window.location.href = 'login.html';
  });
});
console.log("DealWise Loaded");
