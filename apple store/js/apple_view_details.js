/**
 * Apple-style Product Detail Popup
 * 
 * Creates an immersive product detail experience similar to Apple.com
 */
document.addEventListener('DOMContentLoaded', function() {
  // Wait a short time for any other scripts to finish
  setTimeout(function() {
    // Find all products on the page
    const products = document.querySelectorAll('.product-card');
    console.log('Apple View Details: Found ' + products.length + ' products');
    
    // Add view details button to each product
    products.forEach(function(product) {
      addViewDetailsButton(product);
    });
    
    // Set up modal for product details
    setupProductModal();
  }, 500); // Short delay to ensure DOM is fully processed

  function addViewDetailsButton(product) {
    try {
      // Get product ID or generate one if needed
      let productId = product.getAttribute('data-id');
      if (!productId) {
        productId = 'product-' + Math.floor(Math.random() * 10000);
        product.setAttribute('data-id', productId);
      }
      
      // Create button container
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'view-details-btn-container';
      buttonContainer.style.cssText = 'text-align: center; margin-top: 10px; margin-bottom: 10px;';
      
      // Create view details button
      const detailsButton = document.createElement('button');
      detailsButton.className = 'view-details-btn';
      detailsButton.innerHTML = 'View Details';
      detailsButton.setAttribute('data-product-id', productId);
      detailsButton.style.cssText = 'background-color: #0071e3; color: white; border: none; border-radius: 20px; padding: 8px 16px; font-size: 14px; cursor: pointer; width: 100%; transition: background-color 0.2s;';
      
      // Add hover effect
      detailsButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#0077ed';
      });
      
      detailsButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#0071e3';
      });
      
      // Add click handler
      detailsButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Show product details for this product
        showProductDetails(product);
      });
      
      // Add button to container
      buttonContainer.appendChild(detailsButton);
      
      // Find the best place to add the button
      const productInfo = product.querySelector('.product-info');
      if (productInfo) {
        // Try to insert before the Add to Cart button if it exists
        const addToCartContainer = productInfo.querySelector('.add-to-cart-container');
        if (addToCartContainer) {
          productInfo.insertBefore(buttonContainer, addToCartContainer);
        } else {
          // Otherwise just append to the end
          productInfo.appendChild(buttonContainer);
        }
      } else {
        // Fallback - append to the end of the product card
        product.appendChild(buttonContainer);
      }
    } catch (error) {
      console.error('Error adding view details button:', error);
    }
  }
  
  function setupProductModal() {
    // Create a modal container if it doesn't exist
    let modal = document.getElementById('apple-product-modal');
    if (modal) {
      // Modal already exists, remove it to recreate (in case of updates)
      modal.remove();
    }
    
    // Create the modal with Apple styling
    modal = document.createElement('div');
    modal.id = 'apple-product-modal';
    modal.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 85%;
      background-color: #000000;
      z-index: 9999;
      display: none;
      overflow: hidden;
      transform: translateY(100%);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      box-shadow: 0 -5px 30px rgba(0, 0, 0, 0.7);
      -webkit-font-smoothing: antialiased;
    `;
    
    // Create modal structure
    modal.innerHTML = `
      <div class="apple-modal-content" style="height: 100%; width: 100%; overflow-y: auto; overflow-x: hidden; position: relative; padding-top: 8px;">
        <div class="apple-modal-handle" style="width: 36px; height: 5px; background-color: #6e6e73; border-radius: 2.5px; margin: 6px auto 8px; opacity: 0.5;"></div>
        
        <div class="apple-modal-close" style="position: absolute; top: 20px; right: 20px; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(210, 210, 215, 0.15); z-index: 9999; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(20px);">
          <svg width="12" height="12" viewBox="0 0 14 14" style="fill: #fff;">
            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"/>
          </svg>
        </div>
        
        <div id="apple-modal-body" style="padding-bottom: 50px;"></div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Create backdrop overlay
    const backdrop = document.createElement('div');
    backdrop.id = 'apple-modal-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      z-index: 9998;
      opacity: 0;
      transition: opacity 0.4s ease;
      display: none;
    `;
    document.body.appendChild(backdrop);
    
    // Set up event listeners
    const closeButton = modal.querySelector('.apple-modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        closeProductModal();
      });
    }
    
    // Close when clicking on backdrop
    backdrop.addEventListener('click', function() {
      closeProductModal();
    });
    
    // Close when clicking escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        closeProductModal();
      }
    });
    
    // Add swipe down to close on mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    modal.addEventListener('touchstart', function(e) {
      touchStartY = e.changedTouches[0].screenY;
    }, {passive: true});
    
    modal.addEventListener('touchend', function(e) {
      touchEndY = e.changedTouches[0].screenY;
      if (touchEndY - touchStartY > 100) {
        closeProductModal();
      }
    }, {passive: true});
    
    // Create CSS for Apple Typography
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&display=swap');
      
      #apple-product-modal * {
        font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
        box-sizing: border-box;
      }
      
      .apple-modal-content::-webkit-scrollbar {
        width: 8px;
      }
      
      .apple-modal-content::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .apple-modal-content::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
      }
      
      .apple-color-option {
        transition: transform 0.2s ease;
      }
      
      .apple-color-option:hover {
        transform: scale(1.05);
      }
      
      .apple-color-option.selected {
        transform: scale(1.1);
      }
      
      .apple-section-title {
        font-size: 28px;
        font-weight: 600;
        margin-top: 30px;
        margin-bottom: 16px;
        color: #ffffff;
      }
      
      .apple-image-gallery {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        gap: 8px;
        padding: 15px 0;
        margin: 0 -20px;
        padding-left: 20px;
      }
      
      .apple-image-gallery::-webkit-scrollbar {
        display: none;
      }
      
      .apple-gallery-item {
        scroll-snap-align: start;
        flex-shrink: 0;
        margin-right: 8px;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        transition: transform 0.3s ease;
      }
      
      .apple-gallery-item:hover {
        transform: translateY(-5px);
      }
      
      .apple-cta-button {
        background-color: #0071e3;
        color: white;
        border: none;
        border-radius: 980px;
        padding: 12px 24px;
        font-size: 17px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        width: 100%;
        max-width: 320px;
        text-align: center;
        margin: 0 auto;
        display: block;
      }
      
      .apple-cta-button:hover {
        background-color: #0077ed;
      }
      
      .apple-spec-row {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding: 15px 0;
      }
      
      .apple-spec-label {
        font-weight: 400;
        color: #86868b;
      }
      
      .apple-spec-value {
        font-weight: 500;
        text-align: right;
        color: #ffffff;
      }
      
      @media (max-width: 768px) {
        #apple-product-modal {
          height: 90%;
        }
        
        .apple-product-grid {
          grid-template-columns: 1fr;
        }
        
        .apple-gallery-main {
          max-height: 250px;
        }
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  function closeProductModal() {
    const modal = document.getElementById('apple-product-modal');
    const backdrop = document.getElementById('apple-modal-backdrop');
    if (!modal) return;
    
    modal.style.transform = 'translateY(100%)';
    backdrop.style.opacity = '0';
    
    setTimeout(() => {
      modal.style.display = 'none';
      backdrop.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 500);
  }
  
  function showProductDetails(product) {
    try {
      // Get the modal
      const modal = document.getElementById('apple-product-modal');
      const backdrop = document.getElementById('apple-modal-backdrop');
      const modalBody = document.getElementById('apple-modal-body');
      
      if (!modal || !modalBody) {
        console.error('Modal elements not found');
        return;
      }
      
      // Get product information
      const productInfo = extractProductInfo(product);
      
      // Use color images for the gallery instead of different angles
      const productImages = productInfo.colors.map(color => ({
        image: color.image,
        color: color.name
      }));
      
      // Generate specs based on product name
      const productSpecs = generateProductSpecs(productInfo.name, productInfo.category);
      
      // Prepare HTML content for the modal
      let modalHTML = `
        <div style="width: 100%; background-color: #000; color: #fff; padding: 0 20px;">
          <!-- Hero Section - More compact -->
          <div style="display: flex; align-items: flex-start; padding-top: 20px;">
            <div style="flex: 1; display: flex; justify-content: center; align-items: center; padding-right: 20px;">
              <img src="${productInfo.image}" alt="${productInfo.name}" id="main-product-image" style="max-height: 220px; max-width: 100%; object-fit: contain; transition: all 0.3s ease;" />
            </div>
            <div style="flex: 1; padding-left: 20px;">
              <h1 style="font-size: 32px; font-weight: 600; margin-bottom: 8px; color: #fff; line-height: 1.1;">${productInfo.name}</h1>
              <p style="font-size: 16px; color: #86868b; margin-bottom: 12px; line-height: 1.4;">${productInfo.description}</p>
              <div style="font-size: 24px; font-weight: 600; color: #fff; margin-bottom: 20px;">From ${productInfo.price}</div>
              
              <!-- Color Options - Inline with description -->
              <div style="margin-bottom: 25px;">
                <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 12px; color: #fff;">Choose your finish</h3>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      `;
      
      // Add color options
      productInfo.colors.forEach((color, index) => {
        const isSelected = index === 0;
        
        modalHTML += `
          <div class="apple-color-option ${isSelected ? 'selected' : ''}" 
               data-color="${color.name}" 
               data-image="${color.image}"
               style="display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${color.color}; border: 2px solid ${isSelected ? '#0071e3' : 'rgba(255,255,255,0.3)'}"></div>
            <span style="font-size: 11px; color: #fff;">${color.name}</span>
          </div>
        `;
      });
      
      modalHTML += `
                </div>
              </div>
              
              <!-- Add to Bag - Top Section -->
              <button id="apple-add-to-bag" class="apple-cta-button" style="margin: 0 0 20px 0; max-width: 100%;">Add to Bag</button>
            </div>
          </div>
          
          <!-- Image Gallery -->
          <div style="margin-bottom: 30px;">
            <h2 class="apple-section-title">Gallery</h2>
            <div class="apple-image-gallery">
      `;
      
      // Add gallery images - showing product in different colors
      productImages.forEach((item) => {
        modalHTML += `
          <div class="apple-gallery-item" data-full-image="${item.image}" data-color="${item.color}">
            <img src="${item.image}" alt="${productInfo.name} in ${item.color}" style="width: 150px; height: 150px; object-fit: contain; background-color: #111;" />
            <div style="text-align: center; padding: 5px 0; font-size: 12px; color: #86868b;">${item.color}</div>
          </div>
        `;
      });
      
      modalHTML += `
            </div>
          </div>
          
          <!-- Specifications -->
          <div style="margin-bottom: 40px;">
            <h2 class="apple-section-title">Tech Specs</h2>
            <div style="background-color: rgba(255,255,255,0.05); border-radius: 18px; padding: 20px; margin-bottom: 30px;">
      `;
      
      // Add tech specs
      for (const [label, value] of Object.entries(productSpecs)) {
        modalHTML += `
          <div class="apple-spec-row">
            <div class="apple-spec-label">${label}</div>
            <div class="apple-spec-value">${value}</div>
          </div>
        `;
      }
      
      modalHTML += `
            </div>
          </div>
        </div>
      `;
      
      // Set the content
      modalBody.innerHTML = modalHTML;
      
      // Set up event listeners for color options
      const colorOptions = modalBody.querySelectorAll('.apple-color-option');
      colorOptions.forEach(option => {
        option.addEventListener('click', function() {
          // Update selected state
          colorOptions.forEach(opt => opt.classList.remove('selected'));
          this.classList.add('selected');
          
          // Update border of color swatch
          colorOptions.forEach(opt => {
            const swatch = opt.querySelector('div');
            if (swatch) {
              swatch.style.border = opt === this ? '2px solid #0071e3' : '2px solid rgba(255,255,255,0.3)';
            }
          });
          
          // Update main image
          const mainImage = document.getElementById('main-product-image');
          const newImage = this.getAttribute('data-image');
          if (mainImage && newImage) {
            mainImage.style.opacity = '0.5';
            mainImage.style.transform = 'scale(0.95)';
            setTimeout(() => {
              mainImage.src = newImage;
              mainImage.style.opacity = '1';
              mainImage.style.transform = 'scale(1)';
            }, 200);
          }
        });
      });
      
      // Set up event listeners for gallery images
      const galleryItems = modalBody.querySelectorAll('.apple-gallery-item');
      galleryItems.forEach(item => {
        item.addEventListener('click', function() {
          const mainImage = document.getElementById('main-product-image');
          const fullImage = this.getAttribute('data-full-image');
          const colorName = this.getAttribute('data-color');
          
          if (mainImage && fullImage) {
            // Update main image with animation
            mainImage.style.opacity = '0.5';
            mainImage.style.transform = 'scale(0.95)';
            setTimeout(() => {
              mainImage.src = fullImage;
              mainImage.style.opacity = '1';
              mainImage.style.transform = 'scale(1)';
            }, 200);
            
            // Update selected color option if this gallery image represents a color
            if (colorName) {
              const colorOptions = modalBody.querySelectorAll('.apple-color-option');
              colorOptions.forEach(option => {
                const optionColorName = option.getAttribute('data-color');
                if (optionColorName === colorName) {
                  // Trigger click on the matching color option
                  option.click();
                }
              });
            }
            
            // Scroll to top
            modalBody.parentElement.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
        });
      });
      
      // Set up event listener for Add to Bag button
      const addToBagBtn = modalBody.querySelector('#apple-add-to-bag');
      if (addToBagBtn) {
        addToBagBtn.addEventListener('click', function() {
          // Find the original add to cart button
          const addToCartBtn = product.querySelector('.add-to-cart');
          if (addToCartBtn) {
            // Close modal with animation
            closeProductModal();
            
            // Click the original add to cart button
            setTimeout(() => {
              addToCartBtn.click();
            }, 400);
          } else {
            // Fallback
            alert(`${productInfo.name} has been added to your bag!`);
            closeProductModal();
          }
        });
      }
      
      // Open the modal with animation
      backdrop.style.display = 'block';
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      
      // Trigger reflow before animation
      void modal.offsetWidth;
      
      // Start animation
      backdrop.style.opacity = '1';
      modal.style.transform = 'translateY(0)';
      
    } catch (error) {
      console.error('Error showing product details:', error);
    }
  }
  
  function extractProductInfo(product) {
    // Extract product ID
    const productId = product.getAttribute('data-id') || '';
    
    // Extract product name
    const productName = product.querySelector('h3') ? 
                        product.querySelector('h3').textContent.trim() : 'Apple Product';
    
    // Extract product image
    let productImage = '';
    const imgElement = product.querySelector('img');
    if (imgElement && imgElement.src) {
      productImage = imgElement.src;
    }
    
    // Extract product description
    let productDescription = '';
    const descElement = product.querySelector('.product-desc') || product.querySelector('.description');
    if (descElement) {
      productDescription = descElement.textContent.trim();
    } else {
      // Create a default description if one isn't found
      productDescription = `Experience innovation with the ${productName}. Designed with premium materials and cutting-edge technology to enhance your digital life.`;
    }
    
    // Extract product price
    let productPrice = '';
    const priceElement = product.querySelector('.price');
    if (priceElement) {
      productPrice = priceElement.textContent.trim();
    } else {
      productPrice = '$999';
    }
    
    // Determine product category based on name
    let productCategory = '';
    if (/iphone/i.test(productName)) {
      productCategory = 'iphone';
    } else if (/ipad/i.test(productName)) {
      productCategory = 'ipad';
    } else if (/mac/i.test(productName) || /book/i.test(productName)) {
      productCategory = 'mac';
    } else if (/watch/i.test(productName)) {
      productCategory = 'watch';
    } else if (/pod/i.test(productName)) {
      productCategory = 'airpods';
    } else {
      productCategory = 'accessory';
    }
    
    // Extract color options
    let colors = [];
    const colorOptions = product.querySelectorAll('.color-option');
    
    if (colorOptions && colorOptions.length > 0) {
      colors = Array.from(colorOptions).map(option => {
        return {
          color: option.style.backgroundColor,
          image: option.getAttribute('data-image') || productImage,
          name: option.getAttribute('data-color') || getColorName(option.style.backgroundColor)
        };
      });
    } else {
      // Default color options
      if (productCategory === 'iphone') {
        colors = [
          { color: '#2E2D2B', name: 'Space Black', image: productImage },
          { color: '#F1F2ED', name: 'Silver', image: productImage },
          { color: '#FAE0D8', name: 'Rose Gold', image: productImage },
          { color: '#333F48', name: 'Midnight Blue', image: productImage }
        ];
      } else if (productCategory === 'ipad') {
        colors = [
          { color: '#2E2D2B', name: 'Space Gray', image: productImage },
          { color: '#F1F2ED', name: 'Silver', image: productImage }
        ];
      } else if (productCategory === 'mac') {
        colors = [
          { color: '#2E2D2B', name: 'Space Gray', image: productImage },
          { color: '#F1F2ED', name: 'Silver', image: productImage }
        ];
      } else if (productCategory === 'watch') {
        colors = [
          { color: '#2E2D2B', name: 'Graphite', image: productImage },
          { color: '#F1F2ED', name: 'Silver', image: productImage },
          { color: '#F9D4C8', name: 'Gold', image: productImage }
        ];
      } else {
        colors = [
          { color: '#2E2D2B', name: 'Black', image: productImage },
          { color: '#F1F2ED', name: 'White', image: productImage }
        ];
      }
    }
    
    return {
      id: productId,
      name: productName,
      image: productImage,
      description: productDescription,
      price: productPrice,
      category: productCategory,
      colors: colors
    };
  }
  
  function getColorName(colorCode) {
    // Map basic colors to user-friendly names
    const colorMap = {
      // Basic colors
      'rgb(0, 0, 0)': 'Black',
      'rgb(255, 255, 255)': 'White',
      'rgb(128, 128, 128)': 'Gray',
      'rgb(192, 192, 192)': 'Silver',
      'rgb(0, 0, 255)': 'Blue',
      'rgb(255, 0, 0)': 'Red',
      'rgb(0, 255, 0)': 'Green',
      'rgb(255, 255, 0)': 'Yellow',
      'rgb(255, 165, 0)': 'Orange',
      'rgb(128, 0, 128)': 'Purple',
      'rgb(255, 192, 203)': 'Pink',
      'rgb(165, 42, 42)': 'Brown',
      'rgb(0, 128, 128)': 'Teal',
      'rgb(255, 215, 0)': 'Gold',
      
      // Apple colors
      'rgb(46, 45, 43)': 'Space Black',
      'rgb(241, 242, 237)': 'Silver',
      'rgb(250, 228, 215)': 'Rose Gold',
      'rgb(28, 28, 30)': 'Midnight',
      'rgb(250, 212, 154)': 'Starlight',
      'rgb(174, 176, 178)': 'Titanium'
    };
    
    return colorMap[colorCode] || 'Color';
  }
  
  function generateProductSpecs(productName, category) {
    // Generate plausible specs based on product category
    let specs = {};
    
    if (category === 'iphone') {
      specs = {
        'Display': 'Super Retina XDR display',
        'Size': '6.1" or 6.7" (diagonal)',
        'Resolution': '2532 x 1170 pixels at 460 ppi',
        'Chip': 'A16 Bionic chip',
        'Camera': '48MP Main | 12MP Ultra Wide | 12MP Telephoto',
        'Front Camera': '12MP TrueDepth camera',
        'Video': '4K video recording at 24 fps, 25 fps, 30 fps, or 60 fps',
        'Battery': 'Up to 29 hours video playback',
        'Water Resistance': 'IP68 (6 meters for up to 30 minutes)',
        'Capacity': '128GB, 256GB, 512GB, 1TB'
      };
    } else if (category === 'ipad') {
      specs = {
        'Display': 'Liquid Retina display',
        'Size': '10.9" or 12.9" (diagonal)',
        'Resolution': '2360 x 1640 resolution at 264 ppi',
        'Chip': 'M2 chip',
        'Camera': '12MP Wide camera',
        'Front Camera': '12MP Ultra Wide front camera',
        'Video': '4K video recording at 30 fps or 60 fps',
        'Battery': 'Up to 10 hours of web browsing',
        'Connectivity': 'Wi-Fi 6E and 5G cellular models available',
        'Capacity': '128GB, 256GB, 512GB, 1TB, 2TB'
      };
    } else if (category === 'mac') {
      specs = {
        'Display': 'Liquid Retina XDR display',
        'Size': '14" or 16" (diagonal)',
        'Resolution': '3024 x 1964 resolution at 254 ppi',
        'Chip': 'M3 Pro or M3 Max chip',
        'Memory': 'Up to 128GB unified memory',
        'Storage': 'Up to 8TB SSD storage',
        'Battery': 'Up to: 22 hours video playback',
        'Camera': '1080p FaceTime HD camera',
        'Audio': 'High-fidelity six-speaker system with force-cancelling woofers',
        'Ports': 'Three Thunderbolt 4 ports, HDMI port, SDXC card slot, headphone jack, MagSafe 3 port'
      };
    } else if (category === 'watch') {
      specs = {
        'Display': 'Always-On Retina LTPO OLED display',
        'Size': '41mm or 45mm case size',
        'Resolution': 'Nearly 20% more screen area than Series 6',
        'Processor': 'S9 SiP with 64-bit dual-core processor',
        'Sensors': 'Electrical heart sensor, third-generation optical heart sensor, Blood Oxygen sensor',
        'Durability': 'Crack-resistant crystal, IP6X dust resistance, Swimproof',
        'Battery': 'Up to 18 hours of normal use',
        'Connectivity': 'LTE and UMTS, Wi-Fi, Bluetooth 5.3',
        'Features': 'ECG app, Blood Oxygen app, High and low heart rate notifications',
        'Materials': 'Aluminum, Stainless Steel, or Titanium case'
      };
    } else if (category === 'airpods') {
      specs = {
        'Audio Technology': 'Active Noise Cancellation, Transparency mode, Adaptive EQ',
        'Microphones': 'Multiple beam-forming microphones, Inward-facing microphone',
        'Sensors': 'Optical sensor, Motion-detecting accelerometer, Speech-detecting accelerometer',
        'Chip': 'H1 chip',
        'Battery': 'Up to 6 hours of listening time with a single charge',
        'Charging': 'MagSafe Charging Case with up to 30 hours total listening time',
        'Connectivity': 'Bluetooth 5.0',
        'Water Resistance': 'IPX4 sweat and water resistant',
        'Controls': 'Force sensor for easy control',
        'Compatibility': 'iOS, iPadOS, macOS, Apple Watch'
      };
    } else {
      // Generic specs for accessories
      specs = {
        'Material': 'High-quality materials designed for durability',
        'Compatibility': 'Works with iPhone, iPad, and Mac',
        'Connectivity': 'Bluetooth 5.0 or Lightning connector',
        'Battery': 'Rechargeable lithium-ion battery',
        'Charging': 'Lightning or USB-C charging',
        'Dimensions': 'Compact and lightweight design',
        'Features': 'Seamless integration with Apple devices',
        'Warranty': '1-year limited warranty'
      };
    }
    
    return specs;
  }
});
