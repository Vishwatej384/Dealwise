// ===== GLOBAL THEME HANDLER =====
document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("dealwise_theme") || "dark";
  html.dataset.theme = savedTheme;

  const themeSwitch = document.getElementById("themeSwitch");
  if (themeSwitch) {
    themeSwitch.checked = savedTheme === "dark";
    themeSwitch.addEventListener("change", () => {
      const newTheme = themeSwitch.checked ? "dark" : "light";
      html.dataset.theme = newTheme;
      localStorage.setItem("dealwise_theme", newTheme);
    });
  }
});

// ------------------ NAVIGATION ------------------
const navLinks = document.querySelectorAll(".nav-link");
const contentArea = document.getElementById("content-area");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    const page = link.dataset.page;
    loadPage(page);
  });
});

// ------------------ MODAL LOGIC ------------------
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const closeBtns = document.querySelectorAll(".close");

if (loginBtn) loginBtn.onclick = () => loginModal.style.display = "block";
if (signupBtn) signupBtn.onclick = () => signupModal.style.display = "block";
closeBtns.forEach(btn => btn.onclick = () => {
  if (loginModal) loginModal.style.display = "none";
  if (signupModal) signupModal.style.display = "none";
});
window.onclick = (e) => {
  if (e.target === loginModal) loginModal.style.display = "none";
  if (e.target === signupModal) signupModal.style.display = "none";
};

// ------------------ DYNAMIC CONTENT ------------------
function loadPage(page) {
  switch (page) {
    case "home":
      contentArea.innerHTML = `
        <h1>Discover Best Deals. Save Smarter.</h1>
        <p>Verified deals and authentic reviews — your go-to platform for affordable, trustworthy shopping.</p>
        <img src="images/headphones.jpg" width="300" style="border-radius:15px;margin-top:20px;">
      `;
      break;

    case "categories":
      contentArea.innerHTML = `
        <h2>Browse Categories</h2>
        <div class="category-grid">
          <button onclick="showCategory('Electronics')">Electronics</button>
          <button onclick="showCategory('Fashion')">Fashion</button>
          <button onclick="showCategory('Home')">Home</button>
          <button onclick="showCategory('Gaming')">Gaming</button>
        </div>
        <div id="categoryItems"></div>
      `;
      break;

    case "topdeals":
      contentArea.innerHTML = `
        <h2>🔥 Top Deals</h2>
        <div class="deals-grid">
          <div class="deal"><img src="images/headphones.jpg"><h3>Wireless Headphones</h3><p>₹2,499 (30% off)</p></div>
          <div class="deal"><img src="images/smartwatch.jpg"><h3>Smartwatch Series 6</h3><p>₹8,999 (25% off)</p></div>
          <div class="deal"><img src="images/keyboard.jpg"><h3>RGB Gaming Keyboard</h3><p>₹1,799 (40% off)</p></div>
        </div>
      `;
      break;

    case "about":
      contentArea.innerHTML = `
        <h2>About DealWise</h2>
        <p>We help users discover verified deals across categories — combining real reviews and smart price analysis to save you money.</p>
        <img src="images/about.jpg" width="400" style="border-radius:15px;margin-top:20px;">
      `;
      break;

    case "contact":
      contentArea.innerHTML = `
        <h2>Contact Us</h2>
        <p>Have a query or partnership idea? Reach out below.</p>
        <form>
          <input type="text" placeholder="Your Name"><br>
          <input type="email" placeholder="Your Email"><br>
          <textarea placeholder="Message" rows="4"></textarea><br>
          <button type="submit">Send Message</button>
        </form>
      `;
      break;
  }
}

// Default load
if (contentArea) loadPage("home");

// ------------------ CATEGORY LOGIC ------------------
function showCategory(name) {
  const categoryItems = document.getElementById("categoryItems");
  const items = {
    Electronics: ["Wireless Earbuds", "Laptop Stand", "Bluetooth Speaker"],
    Fashion: ["Sneakers", "Watches", "Backpacks"],
    Home: ["Coffee Maker", "Air Purifier", "Lamp"],
    Gaming: ["Mouse", "Headset", "Controller"]
  };
  const list = items[name].map(i => `<li>${i}</li>`).join("");
  categoryItems.innerHTML = `<h3>${name} Deals</h3><ul>${list}</ul>`;
}

// ------------------ PROFILE PAGE LOGIC ------------------
document.addEventListener("DOMContentLoaded", () => {
  const upload = document.getElementById("upload");
  const preview = document.getElementById("preview");
  const placeholder = document.getElementById("profilePlaceholder");
  const themeSwitch = document.getElementById("themeSwitch");
  const html = document.documentElement;

  // --- Theme persistence ---
  const savedTheme = localStorage.getItem("dealwise_theme") || "dark";
  html.dataset.theme = savedTheme;
  if (themeSwitch) themeSwitch.checked = savedTheme === "dark";
  if (themeSwitch) {
    themeSwitch.addEventListener("change", () => {
      const mode = themeSwitch.checked ? "dark" : "light";
      html.dataset.theme = mode;
      localStorage.setItem("dealwise_theme", mode);
    });
  }

  // --- Profile picture preview ---
  if (upload) {
    upload.addEventListener("change", e => {
      const file = e.target.files[0];
      if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
        if (placeholder) placeholder.style.display = "none";
      }
    });
  }

  // --- Load user data from localStorage ---
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const phoneField = document.getElementById("phone");
  const bioField = document.getElementById("bio");
  const countrySelect = document.getElementById("country");

  const user = JSON.parse(localStorage.getItem("dealwise_user"));
  if (user) {
    if (nameField) nameField.value = user.name || "";
    if (emailField) emailField.value = user.email || "";
    if (phoneField) phoneField.value = user.phone || "";
    if (bioField) bioField.value = user.bio || "";
    if (countrySelect) countrySelect.value = user.country || "India";
  }

  // --- Save updated details ---
  const form = document.getElementById("profileForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const updatedUser = {
        ...user,
        name: nameField?.value || "",
        email: emailField?.value || "",
        phone: phoneField?.value || "",
        bio: bioField?.value || "",
        country: countrySelect?.value || "India",
      };
      localStorage.setItem("dealwise_user", JSON.stringify(updatedUser));
      alert("✅ Profile updated successfully!");
      window.location.href = "index.html"; // redirect to homepage
    });
  }
});
