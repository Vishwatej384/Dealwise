document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("dealwise_user"));
  const status = document.getElementById("status");

  if (!user || !user.token) {
    location.href = "login.html";
    return;
  }

  // Load user data from localStorage first (faster)
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const phoneField = document.getElementById("phone");
  const bioField = document.getElementById("bio");
  const countrySelect = document.getElementById("country");

  if (nameField) nameField.value = user.name || "";
  if (emailField) emailField.value = user.email || "";
  if (phoneField) phoneField.value = user.phone || "";
  if (bioField) bioField.value = user.bio || "";
  if (countrySelect) countrySelect.value = user.country || "India";

  // Try to fetch updated profile details from backend (optional)
  try {
    const res = await fetch("http://localhost:8080/api/profile", {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (nameField) nameField.value = data.name || user.name || "";
      if (emailField) emailField.value = data.email || user.email || "";
      if (phoneField) phoneField.value = data.phone || user.phone || "";
      if (bioField) bioField.value = data.bio || user.bio || "";
      if (countrySelect) countrySelect.value = data.country || user.country || "India";
    }
  } catch {
    // Backend not available, use localStorage data
    console.log("Using localStorage data for profile");
  }

  // Update profile
  document.getElementById("profileForm").addEventListener("submit", async e => {
    e.preventDefault();
    
    const payload = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      bio: document.getElementById("bio").value,
      country: document.getElementById("country").value,
      password: document.getElementById("password").value
    };

    // Update localStorage immediately
    const updatedUser = { ...user, ...payload };
    localStorage.setItem("dealwise_user", JSON.stringify(updatedUser));

    // Try to update backend (optional)
    try {
      const res = await fetch("http://localhost:8080/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showSuccessMessage("Profile updated successfully!");
        } else {
          showSuccessMessage("Profile saved locally!");
        }
      } else {
        showSuccessMessage("Profile saved locally!");
      }
    } catch {
      showSuccessMessage("Profile saved locally!");
    }
  });

  function showSuccessMessage(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.textContent = message;
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(90deg, #00c8ff, #66f0ff);
      color: #001;
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 10px 30px rgba(0,200,255,0.3);
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    setTimeout(() => {
      successDiv.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => successDiv.remove(), 300);
    }, 2000);
  }
});
