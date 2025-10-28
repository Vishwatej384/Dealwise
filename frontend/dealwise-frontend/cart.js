document.addEventListener("DOMContentLoaded", () => {
  const items = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartDiv = document.getElementById("cartItems");
  const totalDiv = document.getElementById("cartTotal");

  function renderCart() {
    cartDiv.innerHTML = "";
    let total = 0;
    items.forEach((item, i) => {
      total += item.price;
      cartDiv.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="">
          <div>
            <p>${item.title}</p>
            <p>₹${item.price}</p>
          </div>
          <button onclick="removeItem(${i})">Remove</button>
        </div>`;
    });
    totalDiv.textContent = items.length ? `Total: ₹${total.toFixed(2)}` : "Your cart is empty.";
  }

  window.removeItem = (i) => {
    items.splice(i, 1);
    localStorage.setItem("cartItems", JSON.stringify(items));
    renderCart();
  };

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    alert("Checkout feature coming soon!");
  });

  renderCart();
});
