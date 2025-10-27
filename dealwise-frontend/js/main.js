// Handle modal functionality
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const closes = document.querySelectorAll(".close");

loginBtn.onclick = () => loginModal.style.display = "flex";
signupBtn.onclick = () => signupModal.style.display = "flex";
closes.forEach(c => c.onclick = () => {
  loginModal.style.display = "none";
  signupModal.style.display = "none";
});
window.onclick = e => {
  if (e.target === loginModal) loginModal.style.display = "none";
  if (e.target === signupModal) signupModal.style.display = "none";
};

// Dynamic page loading
function loadPage(page) {
  const content = document.getElementById("content-area");
  let html = "";

  switch (page) {
    case "categories":
      html = `
      <section class="categories fade-in">
        <h2>🛒 Explore Categories</h2>
        <div class="category-list">
          <button onclick="showItems('Electronics')">Electronics</button>
          <button onclick="showItems('Fashion')">Fashion</button>
          <button onclick="showItems('Home')">Home & Kitchen</button>
          <button onclick="showItems('Fitness')">Fitness</button>
        </div>
        <div id="items-area" class="items-grid"></div>
      </section>`;
      break;

    case "topdeals":
      html = `
      <section class="top-deals fade-in">
        <h2>🔥 Top Deals Right Now</h2>
        <div class="deals-grid">
          <div class="deal-card hover-pop">
            <img src="images/smartwatch.jpg" alt="Smartwatch">
            <h3>Smartwatch Series 6</h3>
            <p>Now at ₹8,999 (25% off)</p>
          </div>
          <div class="deal-card hover-pop">
            <img src="images/keyboard.jpg" alt="Keyboard">
            <h3>RGB Mechanical Keyboard</h3>
            <p>Now at ₹1,799 (40% off)</p>
          </div>
          <div class="deal-card hover-pop">
            <img src="images/headphones.jpg" alt="Headphones">
            <h3>Noise Cancelling Headphones</h3>
            <p>Now at ₹2,499 (30% off)</p>
          </div>
        </div>
      </section>`;
      break;

    case "about":
      html = `
      <section class="about fade-in">
        <h2>About DealWise</h2>
        <p>DealWise helps you discover verified discounts, track price drops, and compare deals across platforms in real-time. We aim to make online shopping smarter and safer for everyone.</p>
        <ul>
          <li>✅ Verified Deals & Reviews</li>
          <li>💸 Price Tracking Alerts</li>
          <li>📈 Smart Recommendation Engine</li>
        </ul>
      </section>`;
      break;

    case "contact":
      html = `
      <section class="contact fade-in">
        <h2>Contact Us</h2>
        <p>Have suggestions or feedback? Reach out to us!</p>
        <form>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit" class="btn primary">Send Message</button>
        </form>
      </section>`;
      break;

    default:
      html = document.querySelector(".hero").outerHTML;
  }

  content.innerHTML = html;
}

// Show category items
function showItems(category) {
  const items = {
    "Electronics": ["Smartwatch", "Bluetooth Speaker", "Gaming Mouse"],
    "Fashion": ["Sneakers", "Hoodies", "Sunglasses"],
    "Home": ["Air Purifier", "Smart Lamp", "Blender"],
    "Fitness": ["Yoga Mat", "Smart Scale", "Resistance Bands"]
  };

  const itemsArea = document.getElementById("items-area");
  itemsArea.innerHTML = items[category]
    .map(item => `<div class="item-card hover-pop">${item}</div>`)
    .join("");
}
