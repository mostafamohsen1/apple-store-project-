document.addEventListener('DOMContentLoaded', () => {
  // Product information data
  const heroInfoData = {
    'iphone16pro': {
      title: 'iPhone 16 Pro',
      subtitle: 'The ultimate iPhone experience',
      image: 'images/hero_endframe__b3cjfkquc2s2_xlarge.jpg',
      features: [
        {
          title: 'Titanium Design',
          text: 'Forged from grade 5 titanium - the same used in spacecraft - iPhone 16 Pro is our lightest Pro ever. Its aerospace-grade alloy is incredibly strong yet lighter than the stainless steel in previous models, with the best weight-to-strength ratio of any material we\'ve used.'
        },
        {
          title: 'A18 Pro Chip',
          text: 'The all-new A18 Pro chip delivers incredible performance and efficiency. Experience up to 15% faster CPU performance and 20% faster GPU performance compared to A17 Pro. Enjoy console-quality gaming with hardware-accelerated ray tracing that\'s 4x faster.'
        },
        {
          title: 'Pro Camera System',
          text: 'The most advanced camera system in iPhone takes your photography even further. The 48MP Main camera captures stunning details with quad-pixel technology. The 5x Telephoto camera brings you closer to your subject with optical-quality zoom. And the Ultra Wide camera captures more of the scene.'
        }
      ],
      price: '$1099.00'
    },
    'macmini': {
      title: 'Mac mini',
      subtitle: 'More muscle. More hustle.',
      image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-mini-202410-gallery-1?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=1728265561587',
      features: [
        {
          title: 'Supercharged by M2',
          text: 'M2 brings even more speed to Mac mini. The next generation of custom Apple silicon delivers blazing-fast performance and industry-leading power efficiency. And together with faster memory and a more powerful media engine, M2 makes Mac mini more capable than ever.'
        },
        {
          title: 'Compact Connectivity',
          text: 'Mac mini turns any desk into a powerful workstation. Just connect your own display, keyboard, and mouse, and you\'re ready to create, work, or play. With a Thunderbolt 4 ports, USB-A ports, HDMI, Wi-Fi 6E, and Gigabit Ethernet, you\'ve got all the connectivity needs covered.'
        },
        {
          title: 'macOS at its most powerful',
          text: 'macOS is engineered to take full advantage of Apple silicon, delivering dramatic performance and battery life improvements. With powerful updates to the apps you use every day, along with features that help you connect, create, and collaborate like never before.'
        }
      ],
      price: '$599.00'
    },
    'applewatch': {
      title: 'Apple Watch Ultra 2',
      subtitle: 'Smarter. Brighter. Mightier.',
      image: 'https://www.apple.com/v/apple-watch-ultra-2/g/images/overview/design/design__bm70jvhnh09y_large_2x.jpg',
      features: [
        {
          title: 'Our brightest display ever',
          text: 'The bright Always-On Retina display is optimized for quick glances in any light, especially outdoors. With 2000 nits at peak brightness, it\'s 2x brighter than previous models, with amazing clarity even in direct sunlight.'
        },
        {
          title: 'Vital insights to keep you moving',
          text: 'Advanced sensors give you deep insights into your health. Track your blood oxygen, ECG, heart rate, sleep stages, and body temperature. Get notifications for high and low heart rates or irregular rhythms. And monitor your cardio fitness.'
        },
        {
          title: 'Your health data is yours alone',
          text: 'Privacy is central to how we design and build Apple Watch. Your health and fitness data is encrypted on device and in iCloud with your passcode, Touch ID, or Face ID. And you control what information is shared and with whom.'
        }
      ],
      price: '$799.00'
    },
    'ipadpro': {
      title: 'iPad Pro',
      subtitle: 'Supercharged by M4',
      image: 'https://www.apple.com/v/ipad-pro/as/images/overview/closer-look/space-black/slide_4A__c2suhzbfcl8i_large_2x.jpg',
      features: [
        {
          title: 'Breakthrough M4 chip',
          text: 'The M4 chip delivers incredible speed and power efficiency. It takes performance to a whole new level with up to 4x faster performance than M2 iPad Pro. Advanced CPU and GPU architecture enables advanced AI capabilities and transforms complex workflows.'
        },
        {
          title: 'Ultra Retina XDR Display',
          text: 'The most advanced display in any iPad featuring ultra-bright 1000 nits of full-screen brightness and 1600 nits for HDR content. Experience true-to-life colors, high contrast ratio, and ProMotion technology for fluid scrolling and responsiveness.'
        },
        {
          title: 'Pro creative tools',
          text: 'Pro capabilities for every workflow. From Apple Pencil Pro for precision design to the Magic Keyboard for a responsive typing experience. Shoot, edit, and publish ultra-high-quality video, photos, 3D models, and more, all on iPad Pro.'
        }
      ],
      price: '$999.00'
    },
  };
  
  // DOM elements
  const heroInfoModal = document.getElementById('hero-info-modal');
  const heroModalBackdrop = document.querySelector('.hero-modal-backdrop');
  const closeHeroModalBtn = document.querySelector('.close-hero-modal');
  const learnMoreLinks = document.querySelectorAll('.hero-link:first-child');
  
  // Extract current image URLs directly from the hero slides
  function updateHeroImages() {
    const slides = document.querySelectorAll('.slide');
    const products = ['iphone16pro', 'macmini', 'applewatch', 'ipadpro'];
    
    slides.forEach((slide, index) => {
      if (index < products.length) {
        // Extract background image URL from the inline style
        const bgStyle = slide.style.backgroundImage;
        if (bgStyle) {
          // Parse out the URL from the format: url('...')
          const imgUrl = bgStyle.replace(/^url\(['"](.+)['"]\)$/, '$1');
          if (imgUrl && products[index]) {
            heroInfoData[products[index]].image = imgUrl;
          }
        }
      }
    });
  }
  
  // Populate the modal with product information
  function populateHeroInfo(product) {
    // Update hero images first to ensure we have the latest
    updateHeroImages();
    
    const data = heroInfoData[product];
    if (!data) return;
    
    // Set header content
    document.getElementById('hero-info-title').textContent = data.title;
    document.getElementById('hero-info-subtitle').textContent = data.subtitle;
    
    // Set image
    const heroImage = document.getElementById('hero-info-image');
    heroImage.src = data.image;
    heroImage.alt = data.title;
    
    // Preload image to ensure it's ready when modal opens
    const preloadImg = new Image();
    preloadImg.src = data.image;
    
    // Set features
    document.getElementById('hero-info-feature1-title').textContent = data.features[0].title;
    document.getElementById('hero-info-feature1-text').textContent = data.features[0].text;
    
    document.getElementById('hero-info-feature2-title').textContent = data.features[1].title;
    document.getElementById('hero-info-feature2-text').textContent = data.features[1].text;
    
    document.getElementById('hero-info-feature3-title').textContent = data.features[2].title;
    document.getElementById('hero-info-feature3-text').textContent = data.features[2].text;
    
    // Set price and buttons
    document.getElementById('hero-info-price').textContent = data.price;
  }
  
  // Show modal with animation
  function showHeroModal(product) {
    populateHeroInfo(product);
    
    // Reset any ongoing animations
    heroInfoModal.style.animation = 'none';
    heroInfoModal.offsetHeight; // Trigger reflow
    
    // Add active class and animate in
    heroInfoModal.classList.add('active');
    heroInfoModal.style.animation = '';
    
    // Scroll to top of modal content
    const modalContent = document.querySelector('.hero-modal-content');
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
  }
  
  // Hide modal with animation
  function hideHeroModal() {
    heroInfoModal.classList.remove('active');
    
    // Restore body scrolling
    document.body.style.overflow = '';
  }
  
  // Setup event listeners
  learnMoreLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Determine which product based on slide index
      const products = ['iphone16pro', 'macmini', 'applewatch', 'ipadpro'];
      const product = products[index];
      
      showHeroModal(product);
    });
  });
  
  // Close modal when clicking close button
  closeHeroModalBtn.addEventListener('click', hideHeroModal);
  
  // Close modal when clicking backdrop
  heroModalBackdrop.addEventListener('click', hideHeroModal);
  
  // Close modal when pressing escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && heroInfoModal.classList.contains('active')) {
      hideHeroModal();
    }
  });
  
  // Setup Buy button in modal
  document.getElementById('hero-info-buy').addEventListener('click', (e) => {
    e.preventDefault();
    hideHeroModal();
    // Here you would typically direct to the product purchase page
    console.log('Redirecting to buy page');
  });
  
  // Setup Explore all features link
  document.getElementById('hero-info-explore').addEventListener('click', (e) => {
    e.preventDefault();
    // Scroll to features section
    const featuresSection = document.querySelector('.hero-info-text');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}); 