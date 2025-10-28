document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("dealwise_user"));
  const status = document.getElementById("status");

  if (!user || !user.token) {
    location.href = "login.html";
    return;
  }

  // Fetch profile details
  try {
    const res = await fetch("http://localhost:8080/api/profile", {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    const data = await res.json();
    document.getElementById("name").value = data.name || "";
    document.getElementById("email").value = data.email || "";
  } catch {
    status.textContent = "Failed to load profile info.";
    status.style.color = "tomato";
  }

  // Update profile
  document.getElementById("profileForm").addEventListener("submit", async e => {
    e.preventDefault();
    status.textContent = "Saving changes...";

    const payload = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      country: document.getElementById("country").value,
      gender: document.getElementById("gender").value
    };

    try {
      const res = await fetch("http://localhost:8080/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        status.style.color = "#00c8ff";
        status.textContent = "Profile updated successfully!";
        localStorage.setItem("dealwise_user", JSON.stringify({ ...user, name: payload.name, email: payload.email }));
      } else {
        status.style.color = "tomato";
        status.textContent = "Update failed.";
      }
    } catch {
      status.style.color = "tomato";
      status.textContent = "Error connecting to server.";
    }
  });
});
