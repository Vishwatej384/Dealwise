document.addEventListener("DOMContentLoaded", () => {
  // Use global cart system
  const cart = window.dealwiseCart.getCart();
  const cartDiv = document.getElementById("cartItems");
  const totalDiv = document.getElementById("cartTotal");

  function renderCart() {
    cartDiv.innerHTML = "";
    let total = 0;
    
    if (cart.length === 0) {
      cartDiv.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--muted);">
          <div style="font-size: 48px; margin-bottom: 16px;">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some items to get started!</p>
          <button onclick="DealWiseUtils.navigateTo('index.html')" style="margin-top: 16px; background: var(--accent); color: #001; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
            Continue Shopping
          </button>
        </div>
      `;
      totalDiv.textContent = "";
      return;
    }

    cart.forEach((item, i) => {
      // Extract numeric price for calculation
      const priceMatch = item.price.match(/₹([\d,]+)/);
      const numericPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
      const quantity = item.quantity || 1;
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
    cart.splice(i, 1);
    window.dealwiseCart.setCart(cart);
    renderCart();
  };

  window.updateQuantity = (i, change) => {
    if (cart[i]) {
      cart[i].quantity = Math.max(1, (cart[i].quantity || 1) + change);
      window.dealwiseCart.setCart(cart);
      renderCart();
    }
  };

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
      DealWiseUtils.showToast("Your cart is empty!", "error");
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
    window.dealwiseCart.setCart([]);
    DealWiseUtils.navigateTo('index.html');
  }

  renderCart();
});
