document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = 'dealwise_cart';
  const items = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const cartDiv = document.getElementById("cartItems");
  const totalDiv = document.getElementById("cartTotal");

  function renderCart() {
    cartDiv.innerHTML = "";
    let total = 0;
    
    if (items.length === 0) {
      cartDiv.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--muted);">
          <div style="font-size: 48px; margin-bottom: 16px;">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some items to get started!</p>
          <button onclick="window.location.href='index.html'" style="margin-top: 16px; background: var(--accent); color: #001; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
            Continue Shopping
          </button>
        </div>
      `;
      totalDiv.textContent = "";
      return;
    }

    items.forEach((item, i) => {
      // Extract numeric price for calculation
      const priceMatch = item.price.match(/₹([\d,]+)/);
      const numericPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
      const quantity = item.qty || 1;
      const itemTotal = numericPrice * quantity;
      total += itemTotal;
      
      cartDiv.innerHTML += `
        <div class="cart-item">
          <img src="${item.img || 'assets/placeholder.svg'}" alt="${item.title}" onerror="this.src='assets/placeholder.svg'">
          <div style="flex: 1; margin-left: 12px;">
            <p style="font-weight: 600; margin: 0 0 4px;">${item.title}</p>
            <p style="color: var(--accent); font-weight: 600; margin: 0 0 4px;">${item.price}</p>
            <p style="color: var(--muted); font-size: 13px; margin: 0;">Quantity: ${quantity}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button onclick="updateQuantity(${i}, -1)" style="background: var(--muted); color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-weight: 600;">-</button>
            <span style="min-width: 20px; text-align: center;">${quantity}</span>
            <button onclick="updateQuantity(${i}, 1)" style="background: var(--accent); color: #001; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-weight: 600;">+</button>
            <button onclick="removeItem(${i})" style="background: #ff4757; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; margin-left: 8px;">Remove</button>
          </div>
        </div>`;
    });
    
    totalDiv.innerHTML = `
      <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 600;">
          <span>Total:</span>
          <span style="color: var(--accent);">₹${total.toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  window.removeItem = (i) => {
    items.splice(i, 1);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    renderCart();
    updateCartCount();
  };

  window.updateQuantity = (i, change) => {
    if (items[i]) {
      items[i].qty = Math.max(1, (items[i].qty || 1) + change);
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      renderCart();
      updateCartCount();
    }
  };

  function updateCartCount() {
    const count = items.reduce((sum, item) => sum + (item.qty || 1), 0);
    // Update cart count in other pages if they exist
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
      cartCountEl.textContent = count;
    }
  }

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    // Show checkout success message
    const checkoutDiv = document.createElement('div');
    checkoutDiv.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                  background: var(--card); padding: 30px; border-radius: 12px; 
                  box-shadow: 0 20px 50px rgba(0,0,0,0.6); z-index: 9999; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
        <h3 style="color: var(--accent); margin-bottom: 12px;">Order Placed!</h3>
        <p style="color: var(--muted); margin-bottom: 20px;">Thank you for your purchase. Your order will be processed soon.</p>
        <button onclick="this.parentElement.parentElement.remove(); clearCart();" 
                style="background: var(--accent); color: #001; border: none; padding: 10px 20px; 
                       border-radius: 8px; cursor: pointer; font-weight: 600;">
          Continue Shopping
        </button>
      </div>
    `;
    document.body.appendChild(checkoutDiv);
  });

  function clearCart() {
    localStorage.removeItem(CART_KEY);
    window.location.href = 'index.html';
  }

  renderCart();
});
