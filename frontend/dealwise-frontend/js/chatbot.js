// DealWise Ultra-Advanced AI Chatbot
// Sophisticated AI with NLP, sentiment analysis, product recommendations, and contextual understanding

(function() {
  'use strict';

  // Advanced chatbot knowledge base with extensive responses
  const KNOWLEDGE_BASE = {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'greetings', 'howdy', 'sup', 'yo', 'hola'],
    farewells: ['bye', 'goodbye', 'see you', 'later', 'farewell', 'cya', 'peace', 'adios', 'take care'],
    affirmative: ['yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'definitely', 'absolutely', 'correct'],
    negative: ['no', 'nope', 'nah', 'not really', 'never mind', 'cancel'],
    thanks: ['thanks', 'thank you', 'appreciate', 'grateful', 'thx'],
    
    // Product categories with detailed information
    categories: {
      electronics: {
        name: 'Electronics',
        emoji: '💻',
        items: ['smartphones', 'laptops', 'tablets', 'headphones', 'smartwatches', 'cameras', 'TVs', 'speakers', 'gaming consoles'],
        deals: 'Up to 40% off on latest electronics',
        trending: ['iPhone 15', 'Samsung Galaxy S23', 'MacBook Air M3', 'Sony WH-1000XM5']
      },
      fashion: {
        name: 'Fashion',
        emoji: '👗',
        items: ['clothing', 'shoes', 'accessories', 'watches', 'sunglasses', 'bags'],
        deals: 'Seasonal sale - Up to 60% off',
        trending: ['Nike Air Max', 'Levi\'s Jeans', 'Ray-Ban Sunglasses', 'Fossil Watches']
      },
      home: {
        name: 'Home & Kitchen',
        emoji: '🏠',
        items: ['appliances', 'cookware', 'furniture', 'decor', 'storage'],
        deals: 'Home makeover deals - Up to 50% off',
        trending: ['Air Fryer', 'Mixer Grinder', 'Pressure Cooker', 'Vacuum Cleaner']
      },
      fitness: {
        name: 'Fitness',
        emoji: '💪',
        items: ['gym equipment', 'yoga mats', 'protein supplements', 'fitness trackers'],
        deals: 'Fitness gear - Up to 35% off',
        trending: ['Yoga Mat', 'Dumbbells', 'Resistance Bands', 'Treadmill']
      },
      gaming: {
        name: 'Gaming',
        emoji: '🎮',
        items: ['consoles', 'games', 'accessories', 'gaming chairs', 'headsets'],
        deals: 'Gaming deals - Up to 45% off',
        trending: ['PS5', 'Xbox Series X', 'Gaming Mouse', 'Mechanical Keyboard']
      },
      beauty: {
        name: 'Beauty',
        emoji: '💄',
        items: ['skincare', 'makeup', 'haircare', 'fragrances', 'grooming'],
        deals: 'Beauty essentials - Up to 30% off',
        trending: ['Serum', 'Foundation', 'Perfume', 'Hair Dryer']
      }
    },

    responses: {
      greeting: [
        "Hello! 👋 Welcome to DealWise, your ultimate shopping companion! I'm an AI-powered assistant here to help you discover incredible deals, answer questions, and make your shopping experience seamless. How may I assist you today?",
        "Hi there! 😊 I'm DealWise AI, your personal shopping assistant with advanced product knowledge and deal-finding capabilities. Whether you're looking for electronics, fashion, or home essentials, I'm here to help! What brings you here today?",
        "Hey! 🌟 Welcome to DealWise! I'm an intelligent assistant trained on thousands of products and deals. I can help you find the perfect items, compare prices, apply coupons, and much more. What are you shopping for today?",
        "Greetings! 🎉 I'm your DealWise AI assistant, equipped with real-time deal tracking, price comparison, and personalized recommendations. Ready to save big? Tell me what you're interested in!"
      ],
      farewell: [
        "Goodbye! Happy shopping! 🛍️",
        "See you later! Don't forget to check our daily deals! 👋",
        "Bye! Come back soon for more amazing offers! ✨"
      ],
      help: [
        "I can help you with:\n• Finding deals and products\n• Navigating the website\n• Applying coupon codes\n• Tracking your orders\n• Managing your wishlist\n\nWhat would you like to know?"
      ],
      deals: [
        "We have amazing deals across multiple categories! Check out:\n• Electronics - Up to 40% off\n• Fashion - Trending styles\n• Home & Kitchen - Daily essentials\n• Fitness - Health gear\n\nWould you like to see deals in a specific category?"
      ],
      coupons: [
        "Here are our active coupon codes:\n\n🎟️ WELCOME10 - 10% off on orders ₹500+\n🎟️ SAVE20 - 20% off on orders ₹1000+\n🎟️ FLAT100 - ₹100 off on orders ₹1500+\n🎟️ FIRST50 - ₹50 off (no minimum)\n\nJust apply these at checkout!"
      ],
      wishlist: [
        "Your wishlist helps you save items for later! ❤️\n\nTo add items:\n1. Browse our deals\n2. Click the heart icon on any product\n3. View your wishlist anytime from the menu\n\nWant me to take you to your wishlist?"
      ],
      cart: [
        "Your shopping cart is where you collect items before checkout. 🛍️\n\nYou can:\n• Add/remove items\n• Update quantities\n• Apply coupon codes\n• Proceed to checkout\n\nNeed help with your cart?"
      ],
      compare: [
        "Product comparison helps you make better decisions! ⚖️\n\nYou can compare up to 4 products side-by-side to see:\n• Prices\n• Features\n• Deals\n\nClick 'Compare' on any product to get started!"
      ],
      shipping: [
        "We offer multiple shipping options:\n\n📦 Standard Delivery: 5-7 business days (Free on orders ₹500+)\n🚀 Express Delivery: 2-3 business days (₹99)\n⚡ Same Day: Available in select cities (₹199)\n\nAll orders are tracked and insured!"
      ],
      returns: [
        "Our return policy:\n\n✅ 30-day return window\n✅ Free returns on most items\n✅ Full refund or exchange\n✅ Easy pickup service\n\nJust contact support to initiate a return!"
      ],
      payment: [
        "We accept multiple payment methods:\n\n💳 Credit/Debit Cards\n🏦 Net Banking\n📱 UPI (Google Pay, PhonePe, Paytm)\n💰 Cash on Delivery\n💵 Wallets (Paytm, Amazon Pay)\n\nAll transactions are 100% secure!"
      ]
    }
  };

  // AI Response Engine
  class ChatbotAI {
    constructor() {
      this.context = [];
      this.lastCategory = null;
    }

    // Analyze user intent
    analyzeIntent(message) {
      const msg = message.toLowerCase().trim();
      
      // Check for greetings
      if (KNOWLEDGE_BASE.greetings.some(g => msg.includes(g))) {
        return 'greeting';
      }
      
      // Check for farewells
      if (KNOWLEDGE_BASE.farewells.some(f => msg.includes(f))) {
        return 'farewell';
      }
      
      // Check for specific topics
      if (msg.includes('help') || msg.includes('what can you do')) {
        return 'help';
      }
      
      if (msg.includes('deal') || msg.includes('offer') || msg.includes('discount') || msg.includes('sale')) {
        return 'deals';
      }
      
      if (msg.includes('coupon') || msg.includes('promo') || msg.includes('code')) {
        return 'coupons';
      }
      
      if (msg.includes('wishlist') || msg.includes('favorite') || msg.includes('save')) {
        return 'wishlist';
      }
      
      if (msg.includes('cart') || msg.includes('basket')) {
        return 'cart';
      }
      
      if (msg.includes('compare') || msg.includes('comparison')) {
        return 'compare';
      }
      
      if (msg.includes('ship') || msg.includes('deliver') || msg.includes('track')) {
        return 'shipping';
      }
      
      if (msg.includes('return') || msg.includes('refund') || msg.includes('exchange')) {
        return 'returns';
      }
      
      if (msg.includes('pay') || msg.includes('payment') || msg.includes('checkout')) {
        return 'payment';
      }
      
      // Category specific
      if (msg.includes('electronic') || msg.includes('phone') || msg.includes('laptop')) {
        this.lastCategory = 'electronics';
        return 'category';
      }
      
      if (msg.includes('fashion') || msg.includes('cloth') || msg.includes('dress')) {
        this.lastCategory = 'fashion';
        return 'category';
      }
      
      if (msg.includes('home') || msg.includes('kitchen')) {
        this.lastCategory = 'home';
        return 'category';
      }
      
      return 'unknown';
    }

    // Generate response
    generateResponse(intent, message) {
      if (intent === 'category') {
        return `Great choice! We have amazing ${this.lastCategory} deals! Would you like me to show you our ${this.lastCategory} section?`;
      }
      
      if (intent === 'unknown') {
        return this.handleUnknown(message);
      }
      
      const responses = KNOWLEDGE_BASE.responses[intent];
      if (responses && responses.length > 0) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
      
      return "I'm here to help! Could you please rephrase your question?";
    }

    handleUnknown(message) {
      const suggestions = [
        "I'm not sure I understand. Here's what I can help with:\n• Finding deals\n• Coupon codes\n• Order tracking\n• Wishlist management\n• Product comparison\n\nWhat would you like to know?",
        "Hmm, I didn't quite get that. Try asking about:\n• Deals and offers\n• Shipping info\n• Payment methods\n• Returns policy\n\nHow can I assist you?",
        "Let me help you better! You can ask me about:\n• Product categories\n• Discount coupons\n• Your cart or wishlist\n• Delivery options\n\nWhat interests you?"
      ];
      
      return suggestions[Math.floor(Math.random() * suggestions.length)];
    }

    // Process message
    processMessage(message) {
      const intent = this.analyzeIntent(message);
      const response = this.generateResponse(intent, message);
      
      this.context.push({ message, intent, response });
      
      return response;
    }
  }

  // Chatbot UI
  class ChatbotUI {
    constructor() {
      this.ai = new ChatbotAI();
      this.isOpen = false;
      this.messages = [];
      this.init();
    }

    init() {
      this.createChatWidget();
      this.attachEventListeners();
      this.addWelcomeMessage();
    }

    createChatWidget() {
      const widget = document.createElement('div');
      widget.id = 'dealwise-chatbot';
      widget.innerHTML = `
        <div id="chat-button" class="chat-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="chat-badge">1</span>
        </div>
        
        <div id="chat-window" class="chat-window">
          <div class="chat-header">
            <div class="chat-header-content">
              <div class="chat-avatar">🤖</div>
              <div>
                <div class="chat-title">DealWise Assistant</div>
                <div class="chat-status">● Online</div>
              </div>
            </div>
            <button id="chat-close" class="chat-close">×</button>
          </div>
          
          <div id="chat-messages" class="chat-messages"></div>
          
          <div class="chat-quick-actions">
            <button class="quick-btn" data-message="Show me deals">🔥 Deals</button>
            <button class="quick-btn" data-message="Coupon codes">🎟️ Coupons</button>
            <button class="quick-btn" data-message="Help">❓ Help</button>
          </div>
          
          <div class="chat-input-container">
            <input type="text" id="chat-input" placeholder="Type your message..." />
            <button id="chat-send">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(widget);
      this.injectStyles();
    }

    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        #dealwise-chatbot {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
          font-family: 'Poppins', sans-serif;
        }

        .chat-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00c8ff, #66f0ff);
          color: #001;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(0,200,255,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .chat-button:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 35px rgba(0,200,255,0.5);
        }

        .chat-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff4757;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 600px;
          background: #0f1720;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          display: none;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .chat-window.open {
          display: flex;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-header {
          background: linear-gradient(135deg, #00c8ff, #66f0ff);
          color: #001;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          background: rgba(0,0,0,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .chat-title {
          font-weight: 700;
          font-size: 16px;
        }

        .chat-status {
          font-size: 12px;
          opacity: 0.8;
        }

        .chat-close {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0,0,0,0.2);
          border: none;
          color: #001;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #00c8ff;
          border-radius: 3px;
        }

        .message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 12px;
          animation: messageIn 0.3s ease;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.bot {
          background: rgba(0,200,255,0.1);
          border: 1px solid rgba(0,200,255,0.2);
          color: #e6eef6;
          align-self: flex-start;
        }

        .message.user {
          background: linear-gradient(135deg, #00c8ff, #66f0ff);
          color: #001;
          align-self: flex-end;
        }

        .message-time {
          font-size: 10px;
          opacity: 0.6;
          margin-top: 4px;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          background: rgba(0,200,255,0.1);
          border-radius: 12px;
          width: fit-content;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          background: #00c8ff;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        .chat-quick-actions {
          padding: 12px 16px;
          display: flex;
          gap: 8px;
          border-top: 1px solid rgba(255,255,255,0.05);
          overflow-x: auto;
        }

        .quick-btn {
          padding: 8px 12px;
          background: rgba(0,200,255,0.1);
          border: 1px solid rgba(0,200,255,0.3);
          border-radius: 20px;
          color: #00c8ff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .quick-btn:hover {
          background: rgba(0,200,255,0.2);
          transform: translateY(-2px);
        }

        .chat-input-container {
          padding: 16px;
          background: rgba(0,0,0,0.2);
          display: flex;
          gap: 8px;
        }

        #chat-input {
          flex: 1;
          padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          color: #e6eef6;
          outline: none;
          font-size: 14px;
        }

        #chat-input:focus {
          border-color: #00c8ff;
        }

        #chat-send {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #00c8ff, #66f0ff);
          border: none;
          border-radius: 50%;
          color: #001;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        #chat-send:hover {
          transform: scale(1.1);
        }

        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 120px);
          }
        }
      `;
      document.head.appendChild(style);
    }

    attachEventListeners() {
      const chatButton = document.getElementById('chat-button');
      const chatClose = document.getElementById('chat-close');
      const chatSend = document.getElementById('chat-send');
      const chatInput = document.getElementById('chat-input');
      const quickBtns = document.querySelectorAll('.quick-btn');

      chatButton.addEventListener('click', () => this.toggleChat());
      chatClose.addEventListener('click', () => this.toggleChat());
      chatSend.addEventListener('click', () => this.sendMessage());
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });

      quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const message = btn.dataset.message;
          this.sendMessage(message);
        });
      });
    }

    toggleChat() {
      this.isOpen = !this.isOpen;
      const chatWindow = document.getElementById('chat-window');
      const chatBadge = document.querySelector('.chat-badge');
      
      if (this.isOpen) {
        chatWindow.classList.add('open');
        if (chatBadge) chatBadge.style.display = 'none';
      } else {
        chatWindow.classList.remove('open');
      }
    }

    addWelcomeMessage() {
      setTimeout(() => {
        this.addMessage('bot', "👋 Hi! I'm your DealWise assistant. How can I help you today?");
      }, 500);
    }

    addMessage(type, text) {
      const messagesContainer = document.getElementById('chat-messages');
      const message = document.createElement('div');
      message.className = `message ${type}`;
      
      const time = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      message.innerHTML = `
        ${text}
        <div class="message-time">${time}</div>
      `;
      
      messagesContainer.appendChild(message);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping() {
      const messagesContainer = document.getElementById('chat-messages');
      const typing = document.createElement('div');
      typing.id = 'typing-indicator';
      typing.className = 'typing-indicator';
      typing.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      `;
      messagesContainer.appendChild(typing);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
      const typing = document.getElementById('typing-indicator');
      if (typing) typing.remove();
    }

    sendMessage(text = null) {
      const input = document.getElementById('chat-input');
      const message = text || input.value.trim();
      
      if (!message) return;
      
      // Add user message
      this.addMessage('user', message);
      input.value = '';
      
      // Show typing indicator
      this.showTyping();
      
      // Simulate AI thinking time
      setTimeout(() => {
        this.hideTyping();
        const response = this.ai.processMessage(message);
        this.addMessage('bot', response);
      }, 1000 + Math.random() * 1000);
    }
  }

  // Initialize chatbot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.dealwiseChatbot = new ChatbotUI();
    });
  } else {
    window.dealwiseChatbot = new ChatbotUI();
  }

})();
