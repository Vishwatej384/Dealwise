// DealWise - Professional E-commerce Features
// Functional features to enhance the shopping experience

(function() {
  'use strict';

  // ============================================
  // 1. WISHLIST / FAVORITES SYSTEM
  // ============================================
  window.DealWiseWishlist = {
    KEY: 'dealwise_wishlist',
    
    getAll: function() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY) || '[]');
      } catch(e) {
        return [];
      }
    },
    
    add: function(item) {
      const wishlist = this.getAll();
      const exists = wishlist.find(w => w.id === item.id);
      
      if (!exists) {
        wishlist.push({
          id: item.id,
          title: item.title,
          price: item.price,
          img: item.img,
          addedAt: new Date().toISOString()
        });
        localStorage.setItem(this.KEY, JSON.stringify(wishlist));
        if (window.DealWiseToast) {
          window.DealWiseToast.show('Added to wishlist ❤️', 'success');
        }
        this.updateCount();
        return true;
      } else {
        if (window.DealWiseToast) {
          window.DealWiseToast.show('Already in wishlist', 'info');
        }
        return false;
      }
    },
    
    remove: function(itemId) {
      let wishlist = this.getAll();
      wishlist = wishlist.filter(w => w.id !== itemId);
      localStorage.setItem(this.KEY, JSON.stringify(wishlist));
      if (window.DealWiseToast) {
        window.DealWiseToast.show('Removed from wishlist', 'info');
      }
      this.updateCount();
    },
    
    isInWishlist: function(itemId) {
      return this.getAll().some(w => w.id === itemId);
    },
    
    updateCount: function() {
      const count = this.getAll().length;
      const badge = document.getElementById('wishlistCount');
      if (badge) {
        badge.textContent = count;
      }
    }
  };

  // ============================================
  // 2. PRICE COMPARISON & TRACKING
  // ============================================
  window.DealWisePriceTracker = {
    KEY: 'dealwise_price_history',
    
    trackPrice: function(itemId, price) {
      const history = this.getHistory(itemId);
      const numPrice = this.parsePrice(price);
      
      history.push({
        price: numPrice,
        date: new Date().toISOString()
      });
      
      // Keep only last 30 entries
      if (history.length > 30) {
        history.shift();
      }
      
      const allHistory = this.getAllHistory();
      allHistory[itemId] = history;
      localStorage.setItem(this.KEY, JSON.stringify(allHistory));
    },
    
    getHistory: function(itemId) {
      const allHistory = this.getAllHistory();
      return allHistory[itemId] || [];
    },
    
    getAllHistory: function() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY) || '{}');
      } catch(e) {
        return {};
      }
    },
    
    parsePrice: function(priceStr) {
      return parseFloat(priceStr.replace(/[₹,]/g, ''));
    },
    
    getLowestPrice: function(itemId) {
      const history = this.getHistory(itemId);
      if (history.length === 0) return null;
      return Math.min(...history.map(h => h.price));
    },
    
    getPriceChange: function(itemId) {
      const history = this.getHistory(itemId);
      if (history.length < 2) return 0;
      
      const latest = history[history.length - 1].price;
      const previous = history[history.length - 2].price;
      return ((latest - previous) / previous * 100).toFixed(1);
    }
  };

  // ============================================
  // 3. RECENTLY VIEWED PRODUCTS
  // ============================================
  window.DealWiseRecentlyViewed = {
    KEY: 'dealwise_recently_viewed',
    MAX_ITEMS: 10,
    
    add: function(item) {
      let recent = this.getAll();
      
      // Remove if already exists
      recent = recent.filter(r => r.id !== item.id);
      
      // Add to beginning
      recent.unshift({
        id: item.id,
        title: item.title,
        price: item.price,
        img: item.img,
        viewedAt: new Date().toISOString()
      });
      
      // Keep only MAX_ITEMS
      if (recent.length > this.MAX_ITEMS) {
        recent = recent.slice(0, this.MAX_ITEMS);
      }
      
      localStorage.setItem(this.KEY, JSON.stringify(recent));
    },
    
    getAll: function() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY) || '[]');
      } catch(e) {
        return [];
      }
    },
    
    clear: function() {
      localStorage.removeItem(this.KEY);
    }
  };

  // ============================================
  // 4. PRODUCT COMPARISON
  // ============================================
  window.DealWiseCompare = {
    KEY: 'dealwise_compare',
    MAX_ITEMS: 4,
    
    add: function(item) {
      let compareList = this.getAll();
      
      if (compareList.length >= this.MAX_ITEMS) {
        if (window.DealWiseToast) {
          window.DealWiseToast.show(`Maximum ${this.MAX_ITEMS} items for comparison`, 'warning');
        }
        return false;
      }
      
      const exists = compareList.find(c => c.id === item.id);
      if (!exists) {
        compareList.push({
          id: item.id,
          title: item.title,
          price: item.price,
          img: item.img,
          note: item.note
        });
        localStorage.setItem(this.KEY, JSON.stringify(compareList));
        if (window.DealWiseToast) {
          window.DealWiseToast.show('Added to comparison', 'success');
        }
        this.updateCount();
        return true;
      }
      return false;
    },
    
    remove: function(itemId) {
      let compareList = this.getAll();
      compareList = compareList.filter(c => c.id !== itemId);
      localStorage.setItem(this.KEY, JSON.stringify(compareList));
      this.updateCount();
    },
    
    getAll: function() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY) || '[]');
      } catch(e) {
        return [];
      }
    },
    
    clear: function() {
      localStorage.removeItem(this.KEY);
      this.updateCount();
    },
    
    updateCount: function() {
      const count = this.getAll().length;
      const badge = document.getElementById('compareCount');
      if (badge) {
        badge.textContent = count;
      }
    }
  };

  // ============================================
  // 5. ADVANCED SEARCH & FILTERS
  // ============================================
  window.DealWiseSearch = {
    search: function(query, items) {
      if (!query || query.trim() === '') return items;
      
      const q = query.toLowerCase().trim();
      return items.filter(item => {
        return item.title.toLowerCase().includes(q) ||
               (item.note && item.note.toLowerCase().includes(q)) ||
               (item.category && item.category.toLowerCase().includes(q));
      });
    },
    
    filterByPrice: function(items, minPrice, maxPrice) {
      return items.filter(item => {
        const price = this.parsePrice(item.price);
        return price >= minPrice && price <= maxPrice;
      });
    },
    
    filterByCategory: function(items, category) {
      if (!category || category === 'all') return items;
      return items.filter(item => item.category === category);
    },
    
    sortBy: function(items, sortType) {
      const sorted = [...items];
      
      switch(sortType) {
        case 'price-low':
          return sorted.sort((a, b) => this.parsePrice(a.price) - this.parsePrice(b.price));
        case 'price-high':
          return sorted.sort((a, b) => this.parsePrice(b.price) - this.parsePrice(a.price));
        case 'name-asc':
          return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'name-desc':
          return sorted.sort((a, b) => b.title.localeCompare(a.title));
        case 'discount':
          return sorted.sort((a, b) => {
            const discA = this.parseDiscount(a.note);
            const discB = this.parseDiscount(b.note);
            return discB - discA;
          });
        default:
          return sorted;
      }
    },
    
    parsePrice: function(priceStr) {
      return parseFloat(priceStr.replace(/[₹,]/g, ''));
    },
    
    parseDiscount: function(noteStr) {
      if (!noteStr) return 0;
      const match = noteStr.match(/(\d+)%/);
      return match ? parseInt(match[1]) : 0;
    }
  };

  // ============================================
  // 6. PRODUCT RATINGS & REVIEWS
  // ============================================
  window.DealWiseReviews = {
    KEY: 'dealwise_reviews',
    
    add: function(productId, review) {
      const reviews = this.getAll();
      if (!reviews[productId]) {
        reviews[productId] = [];
      }
      
      reviews[productId].push({
        id: Date.now(),
        rating: review.rating,
        comment: review.comment,
        userName: review.userName || 'Anonymous',
        date: new Date().toISOString()
      });
      
      localStorage.setItem(this.KEY, JSON.stringify(reviews));
      if (window.DealWiseToast) {
        window.DealWiseToast.show('Review submitted!', 'success');
      }
    },
    
    getForProduct: function(productId) {
      const reviews = this.getAll();
      return reviews[productId] || [];
    },
    
    getAll: function() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY) || '{}');
      } catch(e) {
        return {};
      }
    },
    
    getAverageRating: function(productId) {
      const reviews = this.getForProduct(productId);
      if (reviews.length === 0) return 0;
      
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      return (sum / reviews.length).toFixed(1);
    },
    
    getRatingDistribution: function(productId) {
      const reviews = this.getForProduct(productId);
      const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      
      reviews.forEach(r => {
        dist[r.rating]++;
      });
      
      return dist;
    }
  };

  // ============================================
  // 7. COUPON CODE SYSTEM
  // ============================================
  window.DealWiseCoupons = {
    KEY: 'dealwise_coupons',
    
    // Predefined coupons
    AVAILABLE_COUPONS: [
      { code: 'WELCOME10', discount: 10, type: 'percentage', minOrder: 500 },
      { code: 'SAVE20', discount: 20, type: 'percentage', minOrder: 1000 },
      { code: 'FLAT100', discount: 100, type: 'fixed', minOrder: 1500 },
      { code: 'FIRST50', discount: 50, type: 'fixed', minOrder: 0 }
    ],
    
    apply: function(code, orderTotal) {
      const coupon = this.AVAILABLE_COUPONS.find(c => c.code === code.toUpperCase());
      
      if (!coupon) {
        if (window.DealWiseToast) {
          window.DealWiseToast.show('Invalid coupon code', 'error');
        }
        return null;
      }
      
      if (orderTotal < coupon.minOrder) {
        if (window.DealWiseToast) {
          window.DealWiseToast.show(`Minimum order ₹${coupon.minOrder} required`, 'warning');
        }
        return null;
      }
      
      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = (orderTotal * coupon.discount) / 100;
      } else {
        discount = coupon.discount;
      }
      
      // Save applied coupon
      this.saveApplied(code);
      
      if (window.DealWiseToast) {
        window.DealWiseToast.show(`Coupon applied! Saved ₹${discount}`, 'success');
      }
      
      return {
        code: coupon.code,
        discount: discount,
        finalTotal: orderTotal - discount
      };
    },
    
    saveApplied: function(code) {
      const applied = this.getApplied();
      if (!applied.includes(code)) {
        applied.push(code);
        localStorage.setItem(this.KEY, JSON.stringify(applied));
      }
    },
    
    getApplied: function() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY) || '[]');
      } catch(e) {
        return [];
      }
    },
    
    getAvailable: function() {
      const applied = this.getApplied();
      return this.AVAILABLE_COUPONS.filter(c => !applied.includes(c.code));
    }
  };

  // ============================================
  // 8. ORDER TRACKING
  // ============================================
  window.DealWiseOrders = {
    KEY: 'dealwise_orders',
    
    create: function(orderData) {
      const orders = this.getAll();
      const orderId = 'ORD-' + Date.now();
      
      const order = {
        id: orderId,
        items: orderData.items,
        total: orderData.total,
        status: 'pending',
        date: new Date().toISOString(),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod
      };
      
      orders.push(order);
      localStorage.setItem(this.KEY, JSON.stringify(orders));
      
      return orderId;
    },
    
    getAll: function() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY) || '[]');
      } catch(e) {
        return [];
      }
    },
    
    getById: function(orderId) {
      return this.getAll().find(o => o.id === orderId);
    },
    
    updateStatus: function(orderId, status) {
      const orders = this.getAll();
      const order = orders.find(o => o.id === orderId);
      
      if (order) {
        order.status = status;
        order.statusUpdatedAt = new Date().toISOString();
        localStorage.setItem(this.KEY, JSON.stringify(orders));
      }
    }
  };

  // ============================================
  // 9. NOTIFICATION SYSTEM
  // ============================================
  window.DealWiseNotifications = {
    KEY: 'dealwise_notifications',
    
    add: function(notification) {
      const notifications = this.getAll();
      
      notifications.unshift({
        id: Date.now(),
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        read: false,
        date: new Date().toISOString()
      });
      
      // Keep only last 50
      if (notifications.length > 50) {
        notifications.pop();
      }
      
      localStorage.setItem(this.KEY, JSON.stringify(notifications));
      this.updateBadge();
    },
    
    getAll: function() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY) || '[]');
      } catch(e) {
        return [];
      }
    },
    
    getUnread: function() {
      return this.getAll().filter(n => !n.read);
    },
    
    markAsRead: function(notificationId) {
      const notifications = this.getAll();
      const notification = notifications.find(n => n.id === notificationId);
      
      if (notification) {
        notification.read = true;
        localStorage.setItem(this.KEY, JSON.stringify(notifications));
        this.updateBadge();
      }
    },
    
    markAllAsRead: function() {
      const notifications = this.getAll();
      notifications.forEach(n => n.read = true);
      localStorage.setItem(this.KEY, JSON.stringify(notifications));
      this.updateBadge();
    },
    
    updateBadge: function() {
      const unreadCount = this.getUnread().length;
      const badge = document.getElementById('notificationBadge');
      if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
      }
    }
  };

  // ============================================
  // 10. EXPORT USER DATA (GDPR Compliance)
  // ============================================
  window.DealWiseExport = {
    exportAllData: function() {
      const data = {
        cart: localStorage.getItem('dealwise_cart'),
        wishlist: localStorage.getItem('dealwise_wishlist'),
        orders: localStorage.getItem('dealwise_orders'),
        reviews: localStorage.getItem('dealwise_reviews'),
        recentlyViewed: localStorage.getItem('dealwise_recently_viewed'),
        user: localStorage.getItem('dealwise_user'),
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dealwise-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      if (window.DealWiseToast) {
        window.DealWiseToast.show('Data exported successfully', 'success');
      }
    },
    
    clearAllData: function() {
      if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('dealwise_'));
        keys.forEach(k => localStorage.removeItem(k));
        
        if (window.DealWiseToast) {
          window.DealWiseToast.show('All data cleared', 'info');
        }
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      }
    }
  };

  // ============================================
  // INITIALIZE
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    // Update all counts
    if (window.DealWiseWishlist) {
      window.DealWiseWishlist.updateCount();
    }
    if (window.DealWiseCompare) {
      window.DealWiseCompare.updateCount();
    }
    if (window.DealWiseNotifications) {
      window.DealWiseNotifications.updateBadge();
    }
  });

})();
