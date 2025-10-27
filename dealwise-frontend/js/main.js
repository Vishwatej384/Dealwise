// ---------- Data (sample deals with Unsplash images) ----------
const SAMPLE_DEALS = [
  { id: 'd1', title: 'Wireless Headphones', price: '₹2,499', note: '30% off', img: 'https://images.unsplash.com/photo-1585386959984-a4155223f8a2?auto=format&fit=crop&w=1000&q=80' },
  { id: 'd2', title: 'Smartwatch Series 6', price: '₹8,999', note: '25% off', img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1000&q=80' },
  { id: 'd3', title: 'RGB Gaming Keyboard', price: '₹1,799', note: '40% off', img: 'https://images.unsplash.com/photo-1606813902829-65e5484d7331?auto=format&fit=crop&w=1000&q=80' },
  { id: 'd4', title: 'Bluetooth Speaker', price: '₹1,299', note: '35% off', img: 'https://images.unsplash.com/photo-1518444024107-77f3c4b8b4b6?auto=format&fit=crop&w=1000&q=80' },
  { id: 'd5', title: 'Wireless Mouse', price: '₹899', note: '20% off', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80' },
  { id: 'd6', title: '4K Smart TV', price: '₹49,999', note: '15% off', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80' }
];

// ---------- Helpers ----------
const el = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);

// ---------- Fill Top Deals Grid ----------
function renderTopDeals() {
  const grid = qs('#dealsGrid');
  grid.innerHTML = SAMPLE_DEALS.map(d => `
    <div class="deal-card" data-id="${d.id}">
      <img src="${d.img}" alt="${d.title}">
      <h3>${d.title}</h3>
      <p class="muted">${d.note}</p>
      <div class="deal-actions">
        <div class="price">${d.price}</div>
        <button class="add-btn" onclick="addToCart('${d.id}')">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// ---------- Cart (demo using localStorage) ----------
function getCart(){ try { return JSON.parse(localStorage.getItem('dealwise_cart')||'[]') } catch(e){ return [] } }
function setCart(c){ localStorage.setItem('dealwise_cart', JSON.stringify(c)); updateCartCount(); }
function addToCart(id){
  const deal = SAMPLE_DEALS.find(x => x.id === id);
  if(!deal) return alert('Item not found');
  const cart = getCart();
  cart.push({ id: deal.id, title: deal.title, price: deal.price });
  setCart(cart);
  alert(`${deal.title} added to cart (demo)`);
}
function updateCartCount(){
  const count = getCart().length;
  const el = qs('.cart-count');
  if(el) el.textContent = count;
}

// ---------- Category view ----------
const CATEGORY_ITEMS = {
  electronics: ['Wireless Headphones','Smartwatch Series 6','Bluetooth Speaker','4K Smart TV'],
  fashion: ['Sneakers','Jackets','Watches'],
  home: ['Blender','Air Purifier','Lamp'],
  fitness: ['Yoga Mat','Dumbbells','Smart Scale'],
  gaming: ['Gaming Keyboard','Gaming Mouse','Headset'],
  beauty: ['Skincare Set','Fragrance']
};

function showCategory(key){
  // hide / show
  const catSection = el('category-items');
  const container = qs('#category-items') || el('category-items');
  // create if not present
  const section = el('category-items');
  // set title
  const title = qs('#category-items-title');
  if(title) title.textContent = key.charAt(0).toUpperCase()+key.slice(1) + " Deals";
  // fill items
  const grid = qs('#categoryItemsGrid');
  if(grid){
    grid.innerHTML = (CATEGORY_ITEMS[key] || []).map(name => {
      const dummy = SAMPLE_DEALS[Math.floor(Math.random()*SAMPLE_DEALS.length)];
      return `
        <div class="deal-card">
          <img src="${dummy.img}" alt="${name}">
          <h3>${name}</h3>
          <p class="muted">Popular in this category</p>
          <div class="deal-actions">
            <div class="price">${dummy.price}</div>
            <button class="add-btn" onclick="addToCart('${dummy.id}')">Add to Cart</button>
          </div>
        </div>
      `;
    }).join('');
    qs('#category-items').style.display='block';
    window.scrollTo({ top: qs('#category-items').offsetTop-50, behavior:'smooth' });
  }
}

function hideCategoryItems(){
  qs('#category-items').style.display='none';
}

// ---------- Scroll to ID helper ----------
function scrollToId(id){
  const target = document.getElementById(id);
  if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
}

// ---------- Modal open/close ----------
function setupModals(){
  const loginBtn = el('loginBtn'), signupBtn = el('signupBtn');
  const loginModal = el('loginModal'), signupModal = el('signupModal');
  const openSignup = el('openSignup');

  loginBtn && loginBtn.addEventListener('click', ()=> { loginModal.setAttribute('aria-hidden','false'); });
  signupBtn && signupBtn.addEventListener('click', ()=> { signupModal.setAttribute('aria-hidden','false'); });
  openSignup && openSignup.addEventListener('click', (e)=> { e.preventDefault(); loginModal.setAttribute('aria-hidden','true'); signupModal.setAttribute('aria-hidden','false'); });

  qsa('.modal-close').forEach(b => b.addEventListener('click', ()=>{
    qsa('.modal').forEach(m => m.setAttribute('aria-hidden','true'));
  }));
  window.addEventListener('click', (ev)=>{
    qsa('.modal').forEach(m => {
      if(ev.target === m) m.setAttribute('aria-hidden','true');
    });
  });

  // signup/login demo actions
  el('doSignup') && el('doSignup').addEventListener('click', ()=> {
    alert('Signed up (demo). You can implement backend auth later.');
    el('signupModal').setAttribute('aria-hidden','true');
  });
  el('doLogin') && el('doLogin').addEventListener('click', ()=> {
    alert('Logged in (demo).');
    el('loginModal').setAttribute('aria-hidden','true');
  });
}

// ---------- Intersection Observer for reveal ----------
function setupReveal(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting) ent.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  qsa('.reveal').forEach(el=> obs.observe(el));
}

// ---------- Navigation link active state on scroll ----------
function setupNavActiveOnScroll(){
  const links = qsa('.nav-link');
  const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

  window.addEventListener('scroll', ()=>{
    const scrollY = window.scrollY + 120;
    for(let i=sections.length-1;i>=0;i--){
      const s = sections[i];
      if(s && s.offsetTop <= scrollY){
        qsa('.nav-link').forEach(a=>a.classList.remove('active'));
        const selector = `.nav-link[href="#${s.id}"]`;
        const link = document.querySelector(selector);
        if(link) link.classList.add('active');
        break;
      }
    }
  });
}

// ---------- Contact form demo ----------
function setupContact(){
  const form = el('contactForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Message sent (demo). Thank you — we will reply soon.');
    form.reset();
  });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', ()=>{
  renderTopDeals();
  updateCartCount();
  setupModals();
  setupReveal();
  setupNavActiveOnScroll();
  setupContact();
});
