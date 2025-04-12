/**
 * Apple Store Bag/Cart Functionality
 * 
 * This script provides complete shopping bag functionality similar to the Apple Store.
 * Features include:
 * - Adding products to bag
 * - Updating quantity
 * - Removing items
 * - Calculating subtotal, tax, and total
 * - Storing bag data in localStorage
 * - Smooth animations and transitions
 */

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const bagPanel = document.getElementById('bag-panel');
  const bagBackdrop = document.getElementById('bag-backdrop');
  const cartBtn = document.getElementById('cart-btn');
  const closeBagBtn = document.getElementById('close-bag');
  const bagItems = document.getElementById('bag-items');
  const bagEmpty = document.getElementById('bag-empty');
  const bagCount = document.getElementById('bag-count');
  const cartCounter = document.getElementById('cart-counter');
  const bagSubtotal = document.getElementById('bag-subtotal');
  const bagTax = document.getElementById('bag-tax');
  const bagTotal = document.getElementById('bag-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const continueShopping = document.querySelector('.continue-shopping');
  
  // Cart data
  let cart = {};
  
  // Tax rate (for calculation)
  const TAX_RATE = 0.0725; // 7.25%
  
  // Initialize
  init();
  
  // Initialize the bag
  function init() {
    // Load cart from localStorage
    loadCart();
    
    // Add event listeners
    if (cartBtn) {
      cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openBagPanel();
      });
    }
    
    if (closeBagBtn) {
      closeBagBtn.addEventListener('click', closeBagPanel);
    }
    
    if (bagBackdrop) {
      bagBackdrop.addEventListener('click', closeBagPanel);
    }
    
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    if (continueShopping) {
      continueShopping.addEventListener('click', closeBagPanel);
    }
    
    // Additional listener for the new continue-shopping-btn ID
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener('click', closeBagPanel);
    }
    
    // Add event listeners to all "Add to Bag" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent click from bubbling to parent card
        
        const card = this.closest('.product-card');
        if (!card) return;
        
        const productId = card.getAttribute('data-id');
        if (!productId) return;
        
        // Get product information
        let productName = '', productPrice = 0, productCategory = '', productImage = '';
        
        // Extract from card elements
        const nameElement = card.querySelector('h3');
        const priceElement = card.querySelector('.price');
        const imageElement = card.querySelector('img');
        
        if (nameElement) productName = nameElement.textContent.trim();
        
        if (priceElement) {
          const priceText = priceElement.textContent.trim();
          // Remove "From " if present and extract the number
          const priceMatch = priceText.replace('From ', '').match(/\$?(\d+(?:\.\d+)?)/);
          if (priceMatch) {
            productPrice = parseFloat(priceMatch[1]);
          }
        }
        
        if (imageElement) productImage = imageElement.src;
        
        productCategory = card.getAttribute('data-category') || 'Product';
        
        // Add to cart
        addToBag(productId, {
          name: productName,
          price: productPrice,
          category: productCategory,
          image: productImage
        });
        
        // Show notification
        showNotification(`${productName} added to your bag`);
        
        // Animate the cart icon
        animateCartIcon();
      });
    });
    
    // Add event listener for detail view "Add to Bag" button
    const detailAddToCartBtn = document.getElementById('detail-add-to-cart');
    if (detailAddToCartBtn) {
      detailAddToCartBtn.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        if (!productId) return;
        
        // Get product information from detail view
        const productName = document.getElementById('product-name')?.textContent.trim() || '';
        const productImage = document.getElementById('product-main-image')?.src || '';
        
        let productPrice = 0;
        const priceElement = document.getElementById('product-price');
        if (priceElement) {
          const priceText = priceElement.textContent.trim();
          const priceMatch = priceText.replace('From ', '').match(/\$?(\d+(?:\.\d+)?)/);
          if (priceMatch) {
            productPrice = parseFloat(priceMatch[1]);
          }
        }
        
        // Add to cart
        addToBag(productId, {
          name: productName,
          price: productPrice,
          category: 'Product',
          image: productImage
        });
        
        // Show notification
        showNotification(`${productName} added to your bag`);
        
        // Animate the cart icon
        animateCartIcon();
        
        // Close product detail if function exists
        if (typeof closeProductDetail === 'function') {
          closeProductDetail();
        }
      });
    }
    
    // Add keyboard support for closing the bag panel
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && bagPanel && bagPanel.classList.contains('active')) {
        closeBagPanel();
      }
    });
    
    // Update the bag contents
    updateBagContents();
  }
  
  // Load cart from localStorage
  function loadCart() {
    const savedCart = localStorage.getItem('apple_cart');
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
        cart = {};
      }
    }
  }
  
  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem('apple_cart', JSON.stringify(cart));
  }
  
  // Show notification
  function showNotification(message, type = 'success') {
    let notification = document.getElementById('notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'notification';
      notification.className = 'apple-notification';
      document.body.appendChild(notification);
    }
    
    // Create icon based on notification type
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>';
    } else if (type === 'info') {
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>';
    }
    
    // Create structured content
    notification.innerHTML = `
      <div class="apple-notification-content">
        <div class="notification-icon ${type}">
          ${iconSvg}
        </div>
        <div class="notification-message">
          <p>${message}</p>
        </div>
      </div>
    `;
    
    notification.classList.add('show');
    
    // Clear any existing timers
    if (notification.timer) {
      clearTimeout(notification.timer);
    }
    
    // Set new timer
    notification.timer = setTimeout(function() {
      notification.classList.remove('show');
    }, 3000);
  }
  
  // Add item to bag
  function addToBag(productId, productInfoOrQuantity = 1) {
    // Check if this is the new format (direct call with id and quantity)
    if (typeof productInfoOrQuantity === 'number') {
      // This is the new format with just quantity
      const quantity = productInfoOrQuantity;
      
      // Check if product exists in our data
      if (!productData[productId]) {
        console.error('Product not found:', productId);
        return;
      }
      
      const product = productData[productId];
      const productInfo = {
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.images && product.images.length > 0 ? product.images[0] : 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-product-placeholder?wid=720&hei=720&fmt=jpeg&qlt=90&.v=1697558347411'
      };
      
      // Now process with the expanded product info
      if (cart[productId]) {
        // If product already in cart, add the quantity
        cart[productId].quantity += quantity;
        showNotification(`${productInfo.name} quantity updated in your bag`, 'info');
      } else {
        // Otherwise add new product with specified quantity
        cart[productId] = {
          ...productInfo,
          quantity: quantity
        };
        showNotification(`${productInfo.name} added to your bag`, 'success');
      }
      
      // Save cart
      saveCart();
      
      // Update UI
      updateBagContents();
      
      // Animate cart icon
      animateCartIcon();
      
      return;
    }
    
    // Original implementation for backward compatibility
    const productInfo = productInfoOrQuantity;
    if (!productId || !productInfo) return;
    
    const isNewItem = !cart[productId];
    
    if (cart[productId]) {
      // If product already in cart, increment quantity
      cart[productId].quantity++;
      showNotification(`${productInfo.name} quantity updated in your bag`, 'info');
    } else {
      // Otherwise add new product with quantity 1
      cart[productId] = {
        ...productInfo,
        quantity: 1
      };
      showNotification(`${productInfo.name} added to your bag`, 'success');
    }
    
    // Save cart
    saveCart();
    
    // Update UI
    updateBagContents();
  }
  
  // Update cart counter
  function updateCartCounter() {
    if (!cartCounter) return;
    
    const totalItems = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    
    cartCounter.textContent = totalItems;
    
    if (totalItems > 0) {
      cartCounter.classList.add('has-items');
    } else {
      cartCounter.classList.remove('has-items');
    }
    
    // Also update the bag count display
    if (bagCount) {
      bagCount.textContent = totalItems;
    }
  }
  
  // Update bag contents
  function updateBagContents() {
    if (!bagItems || !bagEmpty) return;
    
    // Update cart counter
    updateCartCounter();
    
    // Clear current bag items
    bagItems.innerHTML = '';
    
    // Check if cart is empty
    const isEmpty = Object.keys(cart).length === 0;
    
    // Show/hide empty state
    bagEmpty.style.display = isEmpty ? 'flex' : 'none';
    bagItems.style.display = isEmpty ? 'none' : 'block';
    
    if (isEmpty) {
      if (bagSubtotal) bagSubtotal.textContent = '$0.00';
      if (bagTax) bagTax.textContent = '$0.00';
      if (bagTotal) bagTotal.textContent = '$0.00';
      return;
    }
    
    // Calculate totals
    let subtotal = 0;
    
    // Add each item to the bag
    Object.entries(cart).forEach(([id, item]) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      // Create list item
      const li = document.createElement('li');
      li.className = 'bag-item';
      li.dataset.id = id;
      
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="bag-item-image">
        <div class="bag-item-details">
          <h3 class="bag-item-name">${item.name}</h3>
          <p class="bag-item-price">$${item.price.toFixed(2)}</p>
          <p class="bag-item-meta">${item.category}</p>
          <div class="bag-item-controls">
            <div class="quantity-control">
              <button class="quantity-btn decrease-quantity" data-id="${id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                  <path d="M19 13H5v-2h14v2z" fill="currentColor"/>
                </svg>
              </button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-btn increase-quantity" data-id="${id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <button class="remove-item" data-id="${id}">Remove</button>
          </div>
        </div>
      `;
      
      // Add to bag items
      bagItems.appendChild(li);
    });
    
    // Add event listeners to quantity and remove buttons
    addBagItemEventListeners();
    
    // Calculate tax and total
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    
    // Update totals display
    if (bagSubtotal) bagSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (bagTax) bagTax.textContent = `$${tax.toFixed(2)}`;
    if (bagTotal) bagTotal.textContent = `$${total.toFixed(2)}`;
  }
  
  // Add event listeners to bag item controls
  function addBagItemEventListeners() {
    // Quantity decrease buttons
    document.querySelectorAll('.decrease-quantity').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        if (!id || !cart[id]) return;
        
        if (cart[id].quantity > 1) {
          // Decrease quantity
          cart[id].quantity--;
          saveCart();
          updateBagContents();
        } else {
          // If quantity is 1, remove the item completely
          const itemName = cart[id].name;
          
          // Remove item
          delete cart[id];
          saveCart();
          
          // Show notification
          showNotification(`${itemName} removed from your bag`, 'info');
          
          updateBagContents();
        }
      });
    });
    
    // Quantity increase buttons
    document.querySelectorAll('.increase-quantity').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        if (!id || !cart[id]) return;
        
        // Increase quantity
        cart[id].quantity++;
        saveCart();
        updateBagContents();
      });
    });
    
    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        if (!id || !cart[id]) return;
        
        const itemName = cart[id].name;
        
        // Remove item
        delete cart[id];
        saveCart();
        
        // Show notification
        showNotification(`${itemName} removed from your bag`, 'info');
        
        updateBagContents();
      });
    });
  }
  
  // Position bag panel relative to cart button
  function positionBagPanel() {
    if (!bagPanel || !cartBtn) return;
    
    // Make sure panel is visible for positioning but not yet animated in
    bagPanel.style.display = 'block';
    bagPanel.style.opacity = '0';
    
    // Get position of cart button
    const btnRect = cartBtn.getBoundingClientRect();
    
    // Position panel to start from cart button position (for animation)
    const panelWidth = 500; // Updated width of the panel
    
    if (window.innerWidth > 768) {
      // For desktop: Position from the right aligned with the cart button
      const rightPosition = window.innerWidth - btnRect.right;
      bagPanel.style.right = `${rightPosition}px`;
      
      // Also set a transform origin for the animation
      bagPanel.style.transformOrigin = 'top right';
      
      // Initial scale to start from the button (smaller scale for larger panel)
      bagPanel.style.transform = 'scale(0.05)';
    } else {
      // For mobile: Center horizontally
      bagPanel.style.right = '0';
      bagPanel.style.left = '0';
      bagPanel.style.margin = '0 auto';
      
      // Initial scale (smaller scale for larger panel)
      bagPanel.style.transform = 'scale(0.05)';
      bagPanel.style.transformOrigin = 'top center';
    }
    
    // After positioning, make it visible
    bagPanel.style.opacity = '1';
  }
  
  // Open bag panel
  function openBagPanel() {
    if (!bagPanel || !bagBackdrop) return;
    
    // Position panel based on cart button location
    positionBagPanel();
    
    // Update bag contents
    updateBagContents();
    
    // Show backdrop
    bagBackdrop.classList.add('active');
    
    // Animate the panel from cart button to full size
    setTimeout(() => {
      bagPanel.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
      bagPanel.style.transform = 'scale(1)';
      bagPanel.classList.add('active');
    }, 10);
    
    // Highlight close button to make it more noticeable
    if (closeBagBtn) {
      setTimeout(() => {
        closeBagBtn.classList.add('pulse-once');
        setTimeout(() => {
          closeBagBtn.classList.remove('pulse-once');
        }, 1000);
      }, 500);
    }
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
  }
  
  // Close bag panel
  function closeBagPanel() {
    if (!bagPanel || !bagBackdrop) return;
    
    // Animate the panel back to cart button
    bagPanel.style.transform = 'scale(0.1)';
    bagPanel.style.opacity = '0';
    
    // Hide panel
    bagPanel.classList.remove('active');
    
    // Hide backdrop with slight delay
    setTimeout(() => {
      bagBackdrop.classList.remove('active');
      // Allow the panel to animate out before hiding it
      setTimeout(() => {
        bagPanel.style.display = 'none';
        bagPanel.style.transform = '';
        bagPanel.style.opacity = '';
        bagPanel.style.transition = '';
      }, 300);
    }, 10);
    
    // Restore body scrolling
    document.body.style.overflow = '';
  }
  
  // Handle checkout
  function handleCheckout() {
    if (Object.keys(cart).length === 0) {
      showNotification('Your bag is empty');
      return;
    }
    
    // In a real implementation, this would navigate to checkout page
    // For this demo, we'll just show a notification
    showNotification('Proceeding to checkout...');
    
    // Reset cart
    setTimeout(() => {
      cart = {};
      saveCart();
      updateBagContents();
      closeBagPanel();
    }, 1500);
  }
  
  // Animate the cart icon
  function animateCartIcon() {
    if (!cartBtn) return;
    
    cartBtn.classList.add('product-added');
    
    setTimeout(() => {
      cartBtn.classList.remove('product-added');
    }, 500);
  }
  
  // Expose methods to window for access from other scripts
  window.appStoreBag = {
    openBagPanel,
    closeBagPanel,
    addToBag
  };
}); 