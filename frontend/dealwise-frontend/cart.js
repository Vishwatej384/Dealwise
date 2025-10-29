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
          <button onclick="window.location.href='index.html'" style="margin-top: 16px; background: var(--accent); color: #001; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
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
          <img src="${item.img || 'assets/placeholder.svg'}" alt="${item.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <div style="display:none; width:80px; height:80px; background:linear-gradient(135deg,#0040d4,#0066ff); display:flex; align-items:center; justify-content:center; font-size:40px; border-radius:12px;">🛍️</div>
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
      alert("Your cart is empty!");
      return;
    }
    
    // Show payment options
    showPaymentOptions();
  });
  
  function showPaymentOptions() {
    const paymentDiv = document.createElement('div');
    paymentDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;';
    
    paymentDiv.innerHTML = `
      <div style="background: var(--card); padding: 40px; border-radius: 16px; max-width: 500px; width: 90%; position: relative;">
        <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" 
                style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: var(--text); font-size: 24px; cursor: pointer;">×</button>
        
        <h2 style="color: var(--accent); margin-bottom: 24px; text-align: center;">Select Payment Method</h2>
        
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          <button onclick="selectPayment('card')" 
                  style="display: flex; align-items: center; gap: 12px; background: var(--card); border: 2px solid rgba(255,255,255,0.1); padding: 16px; border-radius: 12px; cursor: pointer; color: var(--text); transition: all 0.3s;">
            <span style="font-size: 24px;">💳</span>
            <span style="flex: 1; text-align: left; font-weight: 600;">Credit/Debit Card</span>
          </button>
          
          <button onclick="selectPayment('upi')" 
                  style="display: flex; align-items: center; gap: 12px; background: var(--card); border: 2px solid rgba(255,255,255,0.1); padding: 16px; border-radius: 12px; cursor: pointer; color: var(--text); transition: all 0.3s;">
            <span style="font-size: 24px;">📱</span>
            <span style="flex: 1; text-align: left; font-weight: 600;">UPI Payment</span>
          </button>
          
          <button onclick="selectPayment('cod')" 
                  style="display: flex; align-items: center; gap: 12px; background: var(--card); border: 2px solid rgba(255,255,255,0.1); padding: 16px; border-radius: 12px; cursor: pointer; color: var(--text); transition: all 0.3s;">
            <span style="font-size: 24px;">💵</span>
            <span style="flex: 1; text-align: left; font-weight: 600;">Cash on Delivery</span>
          </button>
        </div>
        
        <button id="payNowBtn" onclick="processPayment()" 
                style="width: 100%; background: var(--accent); color: #001; border: none; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 16px; cursor: pointer; opacity: 0.5;" disabled>
          Pay Now
        </button>
      </div>
    `;
    
    document.body.appendChild(paymentDiv);
    
    window.selectPayment = (method) => {
      window.selectedPaymentMethod = method;
      document.querySelectorAll('[onclick^="selectPayment"]').forEach(b => {
        b.style.borderColor = 'rgba(255,255,255,0.1)';
        b.style.background = 'var(--card)';
      });
      event.target.closest('button').style.borderColor = 'var(--accent)';
      event.target.closest('button').style.background = 'rgba(0,200,255,0.1)';
      document.getElementById('payNowBtn').style.opacity = '1';
      document.getElementById('payNowBtn').disabled = false;
    };
  }
  
  window.processPayment = () => {
    if (!window.selectedPaymentMethod) return;
    
    const cart = window.dealwiseCart.getCart();
    let total = 0;
    cart.forEach(item => {
      const priceMatch = item.price.match(/₹([\d,]+)/);
      const numericPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
      total += numericPrice * (item.quantity ||  الأم1);
    });
    
    // Show order confirmation
    document.querySelectorAll('[style*="position: fixed"]').forEach(el => el.remove());
    
    const now = new Date();
    const deliveryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const orderDiv = document.createElement('div');
    orderDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;';
    
    orderDiv.innerHTML = `
      <div style="background: var(--card); padding: 40px; border-radius: 16px; max-width: 500px; width: 90%; text-align: center;">
        <div style="font-size: 64px; margin-bottom: 16px;">✅</div>
        <h2 style="color: var(--accent); margin-bottom: 12px;">Order Placed Successfully!</h2>
        <p style="color: var(--muted); margin-bottom: 20px;">Thank you for your purchase</p>
        
        <div style="background: rgba(0,200,255,0.1); padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p style="color: var(--text); margin: 8px 0;"><strong>Order Date:</strong> ${now.toLocaleDateString()}</p>
          <p style="color: var(--text); margin: 8px 0;"><strong>Expected Delivery:</strong> ${deliveryDate.toLocaleDateString()}</p>
          <p style="color: var(--accent); font-size: 24px; font-weight: 700; margin-top: 16px;">Total: ₹${total.toLocaleString()}</p>
        </div>
        
        <button onclick="this.closest('div[style*=\"position: fixed\"]').remove(); window.dealwiseCart.setCart([]); window.location.href='index.html';" 
                style="width: 100%; background: var(--accent); color: #001; border: none; padding: 14px; border-radius: 12px; font-weight: 700 paternal; font-size: 16px; cursor: pointer;">
          Continue Shopping
        </button>
      </div>
    `;
    
    document.body.appendChild(orderDiv);
  };

  renderCart();
});
