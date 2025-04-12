/*
 * Apple Store Website
 * 
 * This file contains all JavaScript functionality for the Apple Store website,
 * including product data, cart management, search, and UI interactions.
 *
 * Image Usage Note:
 * -----------------
 * All product images have been updated to use local files in the following structure:
 * - images/products/iphone/ - iPhone images
 * - images/products/mac/ - Mac images
 * - images/products/ipad/ - iPad images
 * - images/products/watch/ - Apple Watch images
 * - images/products/airpods/ - AirPods images
 * - images/products/accessories/ - Accessories images
 * - images/hero/ - Hero slider images
 * - images/store_banners/ - Store promotional banners
 *
 * When adding new products or updating existing ones, please save appropriate 
 * images to these directories and update the image paths accordingly.
 */

/**
 * Apple Store Image Organization
 * ------------------------------
 * For best practices when using product images from Apple's website:
 * 
 * 1. Directory Structure:
 *    - images/products/iphone/ - For all iPhone models and variants
 *    - images/products/mac/ - For MacBook, iMac, Mac mini, etc.
 *    - images/products/ipad/ - For iPad, iPad Pro, accessories
 *    - images/products/watch/ - For Apple Watch models and bands
 *    - images/products/airpods/ - For AirPods and related audio products
 *    - images/products/accessories/ - For chargers, cases, and other accessories
 *    - images/store_banners/ - For promotional banners
 *    - images/hero/ - For main hero slides
 * 
 * 2. File Naming:
 *    - Use consistent naming: product_name_variant.jpg
 *    - Example: iphone16_pro_black.jpg, macbook_air_m3.jpg
 * 
 * 3. Image Optimization:
 *    - Optimize images for web (compress when possible)
 *    - Use proper dimensions for each context
 *    - Consider using WebP format for better compression
 * 
 * 4. Legal Considerations:
 *    - When using Apple's product images in this educational/demo context, 
 *      ensure images are used only for this specific project
 *    - For commercial projects, Apple's product images should only be used 
 *      with proper authorization from Apple
 */

/**
 * Apple Store Image Color Selection
 * ---------------------------------
 * This function adds functionality to change product images when color options are clicked.
 * Uses Apple's official product images to show different color variants.
 */
function initColorOptions() {
  const colorOptions = document.querySelectorAll('.color-option');
  
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove selected class from all siblings
      const siblings = this.parentElement.querySelectorAll('.color-option');
      siblings.forEach(sib => sib.classList.remove('selected'));
      
      // Add selected class to clicked option
      this.classList.add('selected');
      
      // Update product image if data-image attribute exists
      const productCard = this.closest('.product-card');
      const productImage = productCard.querySelector('img');
      const imageUrl = this.getAttribute('data-image');
      
      if (imageUrl && productImage) {
        productImage.src = imageUrl;
        
        // Update alt text with color if available
        const colorName = this.getAttribute('data-color');
        const productName = productCard.querySelector('h3').textContent;
        if (colorName) {
          productImage.alt = `${productName} ${colorName.replace('-', ' ')}`;
        }
      }
    });
  });
}

// Product data mapping (must match the product card data-id values)
const productData = {
    '1': { 
      name: 'iPhone 16', 
      price: 999.00, 
      category: 'iphone', 
      description: 'The ultimate iPhone experience with A17 Pro. Features a stunning Super Retina XDR display, advanced camera system, and all-day battery life.',
      colors: ['#555555', '#f5f5f7', '#0071e3', '#86868b'],
      images: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone16-digitalmat-gallery-1-202409_GEO_US?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=1723669127697',
        'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=5120&hei=2880&fmt=webp&qlt=70&.v=UXp1U3VDY3IyR1hNdHZwdFdOLzg1V0tFK1lhSCtYSGRqMUdhR284NTN4OUFsUUpuUVQ3cUdJUXc0NW5mTVpFdE9MekhWSGZtV1pvV240QzNuTk80VXhseHVZcEw1SmhqcElaQkJMTm9FMzlKVGsyNDdnTWJxWHVYZ20wTDc3dFA',
        'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=5120&hei=2880&fmt=webp&qlt=70&.v=UXp1U3VDY3IyR1hNdHZwdFdOLzg1V0tFK1lhSCtYSGRqMUdhR284NTN4L28rSU1jVGx4VGxCNEFSdVNXdG1RdzJrQmVLSXFrTCsvY1VvVmRlZkVnMzJKTG1lVWJJT2RXQWE0Mm9rU1V0V0E5L1ZBdzY3RU1aTVdUR3lMZHFNVzE0RzhwM3RLeUk1S0YzTkJVVmF2Ly9R'
      ]
    },
    '2': { 
      name: 'MacBook Air',  
      price: 1199.00, 
      category: 'mac', 
      description: 'Supercharged by M2 chip. The world\'s thinnest laptop with extraordinary battery life and blazing-fast performance.',
      colors: ['#555555', '#f5f5f7', '#86868b'],
      images: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-midnight-config-202503?wid=840&hei=498&fmt=jpeg&qlt=90&.v=1739918914821',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-silver-config-202503?wid=840&hei=498&fmt=jpeg&qlt=90&.v=1739918914494',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-skyblue-config-202503?wid=840&hei=498&fmt=jpeg&qlt=90&.v=1739918914916'
      ]
    },
    '3': { 
      name: 'Apple Pencil', 
      price: 129.00, 
      category: 'ipad', 
      description: 'Designed for iPad Pro & iPad Air. Pixel-perfect precision with virtually no lag, tilt and pressure sensitivity, and wireless pairing and charging.',
      colors: ['#ffffff'],
      images: [
        'https://www.apple.com/v/apple-pencil/ah/images/overview/apple_pencil_pro_hero__fmgp63tyyiy2_large.jpg',
        'https://www.apple.com/v/apple-pencil/ah/images/overview/apple_pencil_hover__evi1dtgx5may_large.jpg'
      ]
    },
    '4': { 
      name: 'MacBook Pro', 
      price: 1299.00, 
      category: 'mac', 
      description: 'Pro performance for intensive tasks. Supercharged by M2 Pro or M2 Max. The most powerful MacBook Pro ever.',
      colors: ['#555555', '#86868b'],
      images: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202410?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1728916305295',
        'https://www.apple.com/v/macbook-pro-14-and-16/e/images/overview/connectivity/connectivity_thunderbolt__glcst1of80ma_large.jpg',
        'https://www.apple.com/v/macbook-pro-14-and-16/e/images/overview/keyboard/keyboard_hw_top__mzvw2dlu9bqu_large.jpg'
      ]
    },
    '5': { 
      name: 'Apple Watch Ultra 2', 
      price: 799.00, 
      category: 'watch', 
      description: 'Largest, most advanced display yet. Features a crack-resistant front crystal, always-on Retina display, and ECG app.',
      colors: ['#555555', '#f5f5f7', '#0071e3', '#c93c20'],
      images: [
        'https://www.apple.com/v/apple-watch-ultra-2/g/images/overview/design/design__bm70jvhnh09y_large_2x.jpg',
        'https://www.apple.com/v/apple-watch-ultra-2/g/images/overview/apps/trails__bzgoo9gkwjci_large_2x.jpg',
        'https://www.apple.com/v/apple-watch-ultra-2/g/images/overview/display/display_always_on__dsimmugyvyeu_large_2x.jpg'
      ]
    },
    '6': { 
      name: 'AirPods Pro', 
      price: 249.00, 
      category: 'airpods', 
      description: 'Active Noise Cancellation & Transparency mode. Spatial audio with dynamic head tracking places sound all around you.',
      colors: ['#ffffff'],
      images: [
        'https://www.apple.com/v/airpods-pro/h/images/overview/hero__d73jta2qitua_large.jpg',
        'https://www.apple.com/v/airpods-pro/h/images/overview/conversation_awareness__dv4qv6hpgjqe_large.jpg'
      ]
    },
    '7': { 
      name: 'iPad Pro', 
      price: 1299.00, 
      category: 'ipad', 
      description: 'Ultimate iPad experience with M2 chip. Features the Liquid Retina XDR display, pro cameras, and all-day battery life.',
      colors: ['#555555', '#f5f5f7'],
      images: [
        'https://www.apple.com/v/ipad-pro/as/images/overview/closer-look/space-black/slide_4A__c2suhzbfcl8i_large_2x.jpg',
        'https://www.apple.com/v/ipad-pro/as/images/overview/design/space-black/design_complete__cd7z51j1bwgi_large_2x.jpg',
        'https://www.apple.com/v/ipad-pro/as/images/overview/closer-look/space-black/slide_4B__ffsfupvccb6e_large_2x.jpg'
      ]
    },
    '8': { 
      name: 'MagSafe Charger', 
      price: 39.00, 
      category: 'accessories', 
      description: 'Wireless charging for iPhone. Attaches magnetically and provides faster wireless charging up to 15W.',
      colors: ['#ffffff'],
      images: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXH3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1661269793559',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXH3_AV1?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1661269778178'
      ]
    },
    '9': { 
      name: 'AirTag', 
      price: 29.00, 
      category: 'accessories', 
      description: 'Keep track of your items. Precision finding with Ultra Wideband technology. Simple one-tap setup.',
      colors: ['#f5f5f7'],
      images: [
        'https://www.apple.com/v/airtag/d/images/overview/overview_hero__i9kva8rs3rey_large.jpg',
        'https://www.apple.com/v/airtag/d/images/overview/find_one__fgrmd5ul0uia_large.jpg'
      ]
    },
    '10': { 
      name: 'iPhone 16 Pro', 
      price: 1099.00, 
      category: 'iphone', 
      description: 'Pro camera. Pro display. Pro performance. Features titanium design, A17 Pro chip, and a customizable Action button.',
      colors: ['#555555', '#f5f5f7', '#4f3829', '#3d162e'],
      images: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone16pro-digitalmat-gallery-1-202409_GEO_US?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=1723843057490',
        'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=5120&hei=2880&fmt=webp&qlt=70&.v=eUdsd0dIb3VUOXdtWkY0VFUwVE8vbEdkZHNlSjBQRklnaFB2d3I5MW94NVJrY0tZVVQzOFFrQ2FwbFZZamEzeEpOZTBYalh5Vk90cEc1K2wwRzFGejRMeXJHUnUva2huMjl4akFHOXNwVjA0YXFmK3VWSWZuRE9oVEFyUFR0T2hWSm5HQVhUeDlTTVJFSzVnTlpqdUV3',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-performance-202409_GEO_US?wid=4121&hei=3278&fmt=jpeg&qlt=90&.v=1723928042172'
      ]
    },
    '11': { 
      name: 'iPhone 15', 
      price: 799.00, 
      category: 'iphone', 
      description: 'A total powerhouse with Dynamic Island. Features A16 Bionic chip, a dual-camera system, and stunning Super Retina XDR display.',
      colors: ['#272727', '#c7ebef', '#e9d1c3', '#cdd5dc'],
      images: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone15-digitalmat-gallery-1-202309_GEO_US?wid=728&hei=666&fmt=png-alpha&.v=1693346853617',
        'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=5120&hei=2880&fmt=webp&qlt=70&.v=cHJOTXEwTU92OEtKVDV2cVB1R2FTSjlERndlRTljaUdZeHJGM3dlLzR2OGlYQ0tYMHd1OS9ZREtnNzFSR1owOHF2TWlpSzUzejRCZGt2SjJUNGl1VEtsS0dZaHBma3VTb3UwU2F6dkc4TGZPaDVjV2NEQVBZbTZldUQyWkpKRHk',
        'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=5120&hei=2880&fmt=webp&qlt=70&.v=cHJOTXEwTU92OEtKVDV2cVB1R2FTSjlERndlRTljaUdZeHJGM3dlLzR2OUtONFJuV1pCdWVXaWp6ZXpQQi9FWXF2TWlpSzUzejRCZGt2SjJUNGl1VEtsS0dZaHBma3VTb3UwU2F6dkc4TGV4VWh5Y2UwMXBvc0pMNmE5MmxpdHg'
      ]
    },
    '12': { 
      name: 'iPhone 16e', 
      price: 429.00, 
      category: 'iphone', 
      description: 'Serious power. Serious value. Features A15 Bionic chip, 4.7" Retina HD display, and advanced camera system.',
      colors: ['#1f1f1f', '#ffffff', '#d82e2e'],
      images: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone16e-digitalmat-gallery-1-202502_GEO_US?wid=728&hei=666&fmt=p-jpg&qlt=95&.v=1738706423809',
        'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16e-finish-select-202502-black?wid=5120&hei=2880&fmt=webp&qlt=70&.v=bGxrMXRYSllVRTZGbi82ZklwWis2L1E4VHZqM2p1UHFJc1owKzJEcWVyUTBHUk0xampKNG9lbGhBOGJDblFiazg5ZFJsR0hrQnFVeEVSbnU0TWlpU0dSMjFQbWROWjJPYy9mb3VMRjFSOU01WlFMRld4TzIreHYyNVVpNmV3VGM',
        'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16e-finish-select-202502-white?wid=5120&hei=2880&fmt=webp&qlt=70&.v=bGxrMXRYSllVRTZGbi82ZklwWis2L1E4VHZqM2p1UHFJc1owKzJEcWVyUThVUkp0MjdUS1RYNitOS3F5TDJoSTg5ZFJsR0hrQnFVeEVSbnU0TWlpU0dSMjFQbWROWjJPYy9mb3VMRjFSOU1HNlNKOWI4NHM4TnBKUkRhNkdlc2U'
      ]
    },
    '13': { 
      name: 'iMac', 
      price: 1299.00, 
      category: 'mac', 
      description: 'Packed with power and personality. Features stunning 24-inch 4.5K Retina display, M1 chip, and 1080p FaceTime HD camera.',
      colors: ['#46bdc6', '#e76846', '#facf37', '#7d59a3'],
      images: [
        'https://www.apple.com/v/imac-24/k/images/overview/color_front/imac24_yellow_front__f0qlrfa7ox66_large.jpg',
        'https://www.apple.com/v/imac-24/k/images/overview/color_side/imac24_yellow_side__ddp4sroiwviu_large.jpg',
        'https://www.apple.com/v/imac-24/k/images/overview/facetime/facetime_camera_hw__er00x65fciom_large.jpg'
      ]
    },
    '14': { 
      name: 'Mac mini', 
      price: 599.00, 
      category: 'mac', 
      description: 'Massive power. Mini size. Features M1 chip, up to 16GB unified memory, and ultrafast SSD storage.',
      colors: ['#7e7e7e'],
      images: [
        'https://www.apple.com/v/mac-mini/s/images/overview/hero/hero_endframe__8yk8ziwm0s6q_large.jpg',
        'https://www.apple.com/v/mac-mini/s/images/overview/connectivity/connectivity_ports__ffgve2tmvpqq_large.jpg'
      ]
    },
    '15': { 
      name: 'Mac Studio', 
      price: 1999.00, 
      category: 'mac', 
      description: 'Empower station for pros. Features M1 Max or M1 Ultra chip, up to 128GB unified memory, and industry-leading performance.',
      colors: ['#7e7e7e'],
      images: [
        'https://www.apple.com/v/mac-studio/g/images/overview/hero/hero__blrq0uhp1ym6_large.jpg',
        'https://www.apple.com/v/mac-studio/g/images/overview/io/io_ports__cpw49l2abraa_large.jpg'
      ]
    },
    '16': { 
      name: 'iPad Air', 
      price: 599.00, 
      category: 'ipad', 
      description: 'Serious performance in vibrant colors. Features M1 chip, 10.9-inch Liquid Retina display, and compatible with Apple Pencil.',
      colors: ['#70bfff', '#f371d0', '#b1b2b7', '#505154'],
      images: [
        'https://www.apple.com/v/ipad-air/r/images/overview/hero/hero__n9a98qv4p0qq_large.jpg',
        'https://www.apple.com/v/ipad-air/r/images/overview/magic_keyboard/accessories_magic_keyboard__drzic3rncqea_large.jpg',
        'https://www.apple.com/v/ipad-air/r/images/overview/display/display_liquid_retina__s46xxqqtimqy_large.jpg'
      ]
    },
    '17': { 
      name: 'iPad', 
      price: 449.00, 
      category: 'ipad', 
      description: 'Colorfully capable. Features A13 Bionic chip, 10.2-inch Retina display, and all-day battery life.',
      colors: ['#f8d6d1', '#dbe7f0', '#f5e9d8', '#7e7e7e'],
      images: [
        'https://www.apple.com/v/ipad-10.9/c/images/overview/hero/hero__fpvdpev885e6_large.jpg',
        'https://www.apple.com/v/ipad-10.9/c/images/overview/design/design_colors_front__eot9595m6kya_large.jpg'
      ]
    },
    '18': { 
      name: 'iPad mini', 
      price: 499.00, 
      category: 'ipad', 
      description: 'Mega power. Mini sized. Features A15 Bionic chip, 8.3-inch Liquid Retina display, and Apple Pencil support.',
      colors: ['#b1b2b7', '#505154', '#f8d6d1', '#dbe7f0'],
      images: [
        'https://www.apple.com/v/ipad-mini/r/images/overview/hero/hero__gd1e9x3z6oeq_large.jpg',
        'https://www.apple.com/v/ipad-mini/r/images/overview/design/design_colors_space_gray__fhoejzmzdmau_large.jpg'
      ]
    },
    '19': { 
      name: 'Magic Keyboard', 
      price: 299.00, 
      category: 'ipad', 
      description: 'Transforms iPad Pro into a laptop alternative. Features a responsive typing experience, trackpad, and floating cantilever design.',
      colors: ['#505154', '#f5f5f7'],
      images: [
        'https://www.apple.com/v/ipad-keyboards/d/images/overview/magic_keyboard/magic_keyboard_side__erf10qo3ocmu_large.jpg',
        'https://www.apple.com/v/ipad-keyboards/d/images/overview/magic_keyboard/magic_keyboard_floating__egzlxinxatu6_large.jpg'
      ]
    },
    '20': { 
      name: 'Apple Watch SE', 
      price: 249.00, 
      category: 'watch', 
      description: 'Essential features at a better value. Features health and safety capabilities, fitness tracking, and sleep monitoring.',
      colors: ['#b1b2b7', '#505154', '#f5e9d8'],
      images: [
        'https://www.apple.com/v/apple-watch-se/j/images/overview/fitness/fitness_hw__1kpg9dd7hreq_large.jpg',
        'https://www.apple.com/v/apple-watch-se/j/images/overview/se-collections/se_collections_silicone__bqlcl5mbdm6u_large.jpg'
      ]
    },
    '21': { 
      name: 'Apple Watch Bands', 
      price: 49.00, 
      category: 'watch', 
      description: 'New styles and colors. Express your personal style with a variety of materials and designs.',
      colors: ['#213f5e', '#d3302e', '#435143', '#f5e9d8'],
      images: [
        'https://www.apple.com/v/apple-watch-bands/p/images/overview/sport_loop/sport_loop_front__drbawm2ypk6m_large.jpg',
        'https://www.apple.com/v/apple-watch-bands/p/images/overview/sport_band/sport_band_front__e4xr73t5r5yu_large.jpg'
      ]
    },
    '22': { 
      name: 'AirPods (3rd generation)', 
      price: 179.00, 
      category: 'airpods', 
      description: 'Spatial Audio with dynamic head tracking. Features sweat and water resistance, force sensor controls, and MagSafe charging case.',
      colors: ['#ffffff'],
      images: [
        'https://www.apple.com/v/airpods/t/images/overview/airpods_3rd_gen__dhy5bknhvtqq_large.jpg',
        'https://www.apple.com/v/airpods/t/images/overview/case_open__fsrv5bhemxei_large.jpg'
      ]
    },
    '23': { 
      name: 'AirPods (2nd generation)', 
      price: 129.00, 
      category: 'airpods', 
      description: 'Effortless wireless headphones. Features automatic switching between devices, "Hey Siri" functionality, and charging case.',
      colors: ['#ffffff'],
      images: [
        'https://www.apple.com/v/airpods/t/images/overview/airpods_2nd_gen__fy53yexbk46u_large.jpg',
        'https://www.apple.com/v/airpods/t/images/overview/charging_case__cs8s8nzzha6e_large.jpg'
      ]
    },
    '24': { 
      name: 'AirPods Max', 
      price: 549.00, 
      category: 'airpods', 
      description: 'High-fidelity audio and premium over-ear design. Features Adaptive EQ, Active Noise Cancellation, and Spatial Audio.',
      colors: ['#b1b2b7', '#505154', '#ffbb45', '#d3302e', '#a4c9cf'],
      images: [
        'https://www.apple.com/v/airpods-max/e/images/overview/hero__gnfk5g59t0qe_large.jpg',
        'https://www.apple.com/v/airpods-max/e/images/overview/design_comfort__fqk7pjcrm5uu_large.jpg',
        'https://www.apple.com/v/airpods-max/e/images/overview/colors_silver__gaxqvxvzvoyi_large.jpg'
      ]
    },
    '25': { 
      name: 'MagSafe Battery Pack', 
      price: 99.00, 
      category: 'accessories', 
      description: 'Portable wireless charging for iPhone. Attaches magnetically to your iPhone, providing additional battery life on the go.',
      colors: ['#f5f5f7'],
      images: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MJWY3?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1625613219000',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MJWY3_AV1?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1625613220000'
      ]
    },
    '26': { 
      name: 'AirTag Loop', 
      price: 29.00, 
      category: 'accessories', 
      description: 'Secure AirTag to your belongings. Made from durable polyurethane, available in various colors to match your style.',
      colors: ['#b1b2b7', '#213f5e', '#d3302e', '#f5e9d8'],
      images: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MX4A2?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1603324721000',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MX4A2_AV1?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1603753581000'
      ]
    },
    '27': { 
      name: 'AirPods Case', 
      price: 29.00, 
      category: 'accessories', 
      description: 'Protect your AirPods in style. Designed to perfectly fit your AirPods case, available in various colors.',
      colors: ['#505154', '#f5f5f7', '#ffbb45', '#d3302e'],
      images: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MPPC3?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1661199094481',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MPPC3_AV3?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1660691072814'
      ]
    },
    '28': { 
      name: 'HomePod mini', 
      price: 99.00, 
      category: 'accessories', 
      description: 'Room-filling sound in a compact speaker. Features 360-degree audio, smart home capabilities, and Siri integration.',
      colors: ['#505154', '#f5f5f7', '#ffbb45', '#d3302e', '#a4c9cf'],
      images: [
        'https://www.apple.com/v/homepod-mini/k/images/overview/hero_static__e33inpb3r2u6_large.jpg',
        'https://www.apple.com/v/homepod-mini/k/images/overview/colors_blue__gj9azvr9veeu_large.jpg'
      ]
    }
  };
  
  // Global variables
  let slides, prevButton, nextButton, indicators;
  let currentSlide = 0;
  let slideshowInterval;
  let cart = {};
  
  // DOM elements
  const burgerMenu = document.getElementById('burger-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const signinBtn = document.getElementById('signin-btn');
  const signinModal = document.getElementById('signin-modal');
  const closeModalBtn = document.querySelector('#signin-modal .close-button');
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize slider
    initSlider();
    
    // Initialize search
    initSearch();
    
    // Initialize color options
    initColorOptions();
    
    // Mobile navigation toggle
    if (burgerMenu) {
      burgerMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
      });
    }
    
    // Set up thumbnail gallery
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        // Remove active class from all thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Update main image
        const imgSrc = this.querySelector('img').src;
        document.getElementById('product-main-image').src = imgSrc;
      });
    });
    
    // Close product detail modal when clicking close button
    const closeProductModalBtn = document.querySelector('.close-product-modal');
    if (closeProductModalBtn) {
      closeProductModalBtn.addEventListener('click', closeProductDetail);
    }
  });
  
  // Show notification when item is added to bag
  function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  // Hero Slider functionality
  function initSlider() {
    const slider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const swipeIndicator = document.querySelector('.swipe-indicator');
    
    let currentSlide = 0;
    let slideInterval;
    let touchStartY;
    let touchEndY;

    // Initialize slider
    function initializeSlider() {
      if (slides.length === 0) return;
      
      // Start the slideshow
      startSlideshow();
      
      // Add event listeners for indicators
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          currentSlide = index;
          showSlide(currentSlide);
        });
      });
      
      // Add touch events for mobile
      slider.addEventListener('touchstart', handleTouchStart, false);
      slider.addEventListener('touchmove', handleTouchMove, false);
      slider.addEventListener('touchend', handleTouchEnd, false);
      
      // Add navigation button handlers
      const prevButton = document.querySelector('.hero-nav-button.hero-prev');
      const nextButton = document.querySelector('.hero-nav-button.hero-next');
      
      if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
          stopSlideshow(); // Pause autoplay when user interacts
          prevSlide();
          // Restart slideshow after a delay
          setTimeout(() => {
            startSlideshow();
          }, 10000);
        });
        
        nextButton.addEventListener('click', () => {
          stopSlideshow(); // Pause autoplay when user interacts
          nextSlide();
          // Restart slideshow after a delay
          setTimeout(() => {
            startSlideshow();
          }, 10000);
        });
      }
      
      // Add slide content class observer to navigation buttons
      function updateNavButtonsForDarkContent() {
        const activeSlide = document.querySelector('.slide.active');
        const slideContent = activeSlide ? activeSlide.querySelector('.slide-content') : null;
        
        if (slideContent && slideContent.classList.contains('dark-content')) {
          // Apply dark content styling for nav buttons
          prevButton.classList.add('dark-content');
          nextButton.classList.add('dark-content');
          } else {
          // Remove dark content styling
          prevButton.classList.remove('dark-content');
          nextButton.classList.remove('dark-content');
        }
      }
      
      // Add scroll event to hide swipe indicator after scrolling down
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          swipeIndicator.style.opacity = '0';
          } else {
          swipeIndicator.style.opacity = '0.7';
        }
      });
      
      // Swipe indicator click to scroll down
      swipeIndicator.addEventListener('click', () => {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      });

      // Add event listeners for hero links
      const learnMoreLinks = document.querySelectorAll('.hero-link:first-child');
      const buyLinks = document.querySelectorAll('.hero-link:last-child');

      learnMoreLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          openHeroInfoModal(index);
        });
      });

      buyLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          navigateToProduct(index);
        });
      });
    }
    
    // Open hero product info modal
    function openHeroInfoModal(slideIndex) {
      const productInfo = getHeroProductInfo(slideIndex);
      
      // Create modal if it doesn't exist
      let heroInfoModal = document.getElementById('hero-info-modal');
      if (!heroInfoModal) {
        heroInfoModal = document.createElement('div');
        heroInfoModal.id = 'hero-info-modal';
        heroInfoModal.className = 'hero-info-modal';
        
        const modalContent = `
          <div class="hero-modal-content">
            <button class="close-hero-modal" aria-label="Close modal">×</button>
            <div class="hero-modal-body">
              <div class="hero-modal-image">
                <img src="" alt="Product Image">
              </div>
              <div class="hero-modal-info">
                <h2 class="hero-modal-title"></h2>
                <div class="hero-modal-description"></div>
                <div class="hero-modal-features"></div>
                <a href="#" class="hero-modal-buy-btn">Buy Now</a>
              </div>
            </div>
          </div>
        `;
        
        heroInfoModal.innerHTML = modalContent;
        document.body.appendChild(heroInfoModal);
        
        // Add event listener for close button
        const closeBtn = heroInfoModal.querySelector('.close-hero-modal');
        closeBtn.addEventListener('click', () => {
          heroInfoModal.classList.remove('active');
        });
        
        // Add event listener for buy button
        const buyBtn = heroInfoModal.querySelector('.hero-modal-buy-btn');
        buyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          heroInfoModal.classList.remove('active');
          navigateToProduct(currentSlide);
        });
        
        // Close modal when clicking outside
        heroInfoModal.addEventListener('click', (e) => {
          if (e.target === heroInfoModal) {
            heroInfoModal.classList.remove('active');
          }
        });
      }
      
      // Populate modal with product info
      const modalImage = heroInfoModal.querySelector('.hero-modal-image img');
      const modalTitle = heroInfoModal.querySelector('.hero-modal-title');
      const modalDescription = heroInfoModal.querySelector('.hero-modal-description');
      const modalFeatures = heroInfoModal.querySelector('.hero-modal-features');
      
      modalImage.src = productInfo.image;
      modalImage.alt = productInfo.title;
      modalTitle.textContent = productInfo.title;
      modalDescription.innerHTML = productInfo.description;
      
      // Create feature list
      let featuresHTML = '<ul class="feature-list">';
      productInfo.features.forEach(feature => {
        featuresHTML += `<li><span class="feature-icon">•</span> ${feature}</li>`;
      });
      featuresHTML += '</ul>';
      modalFeatures.innerHTML = featuresHTML;
      
      // Show modal
      heroInfoModal.classList.add('active');
    }
    
    // Get product info for hero slides
    function getHeroProductInfo(slideIndex) {
      const productInfoData = [
        {
          title: "iPhone 16 Pro",
          image: "images/iPhone-16-Pro-Max-Wallpapers.jpg",
          description: "<p>The iPhone 16 Pro redefines what a smartphone can do. With the powerful A18 Pro chip, advanced camera system, and the brightest display ever on an iPhone, it delivers the ultimate experience.</p>",
          features: [
            "A18 Pro chip with next-generation Neural Engine",
            "Pro camera system with 48MP main camera",
            "Action button for quick access to your favorite features",
            "All-day battery life and MagSafe charging",
            "Available in multiple finishes including Natural Titanium"
          ],
          target: "#iphones"
        },
        {
          title: "Mac mini",
          image: "images/maxresdefault.jpg",
          description: "<p>The new Mac mini packs a powerful punch in a compact design. Featuring the M3 chip, it delivers incredible performance for everything from everyday tasks to demanding workflows.</p>",
          features: [
            "Apple M3 chip with 8-core CPU and 10-core GPU",
            "Up to 24GB unified memory",
            "Ultra-fast SSD storage options up to 2TB",
            "Extensive connectivity with Thunderbolt ports",
            "macOS with powerful productivity and creative apps"
          ],
          target: "#macs"
        },
        {
          title: "Apple Watch Series 10",
          image: "images/apple_watch_apple_main.jpg",
          description: "<p>Apple Watch Series 10 is the most advanced health companion. With features like Blood Oxygen monitoring, ECG, and the new advanced sleep tracking, it helps you stay connected to your health like never before.</p>",
          features: [
            "Always-On Retina display that's bright and responsive",
            "Advanced health sensors for ECG, Blood Oxygen, and more",
            "Enhanced workout tracking with automatic detection",
            "Water resistant design for swimming and water activities",
            "Available in aluminum and stainless steel cases"
          ],
          target: "#watches"
        },
        {
          title: "iPad Pro",
          image: "https://www.apple.com/v/ipad-pro/am/images/overview/hero/hero__fexv34i6aoq2_large.jpg",
          description: "<p>The iPad Pro with M4 chip brings breakthrough performance to the most versatile iPad ever. With its Ultra Retina XDR display and pro cameras, it empowers creators, professionals, and students to push boundaries.</p>",
          features: [
            "Revolutionary M4 chip for desktop-class performance",
            "Ultra Retina XDR display with ProMotion technology",
            "Compatible with Apple Pencil Pro and Magic Keyboard",
            "Pro camera system with LiDAR Scanner",
            "All-day battery life for work and play anywhere"
          ],
          target: "#ipads"
        },
        {
          title: "AirPods Pro",
          image: "https://www.apple.com/v/airpods-pro/h/images/overview/hero__d73jta2qitua_large.jpg",
          description: "<p>AirPods Pro deliver an unparalleled wireless headphone experience with adaptive audio, personalized spatial audio, and up to 2x more active noise cancellation than the previous generation.</p>",
          features: [
            "Adaptive Audio that automatically tailors noise control",
            "Personalized Spatial Audio with dynamic head tracking",
            "Conversation Awareness that lowers volume when you speak",
            "Enhanced Find My with Precision Finding",
            "Up to 6 hours of listening time with Active Noise Cancellation"
          ],
          target: "#airpods"
        }
      ];
      
      return productInfoData[slideIndex];
    }
    
    // Navigate to product section
    function navigateToProduct(slideIndex) {
      const productInfo = getHeroProductInfo(slideIndex);
      const targetSection = document.querySelector(productInfo.target);
      
      if (targetSection) {
        // Scroll to the product section
        window.scrollTo({
          top: targetSection.offsetTop - 80, // Offset for the fixed header
          behavior: 'smooth'
        });
        
        // Highlight the section briefly
        targetSection.classList.add('highlight-section');
        setTimeout(() => {
          targetSection.classList.remove('highlight-section');
        }, 2000);
      }
    }
    
    // Touch event handlers
    function handleTouchStart(e) {
      touchStartY = e.changedTouches[0].clientY;
    }
    
    function handleTouchMove(e) {
      e.preventDefault(); // Prevent default scrolling
      touchEndY = e.changedTouches[0].clientY;
    }
    
    function handleTouchEnd() {
      const touchDiff = touchStartY - touchEndY;
      
      // Vertical swipe detection
      if (Math.abs(touchDiff) > 50) {
        if (touchDiff > 0) {
          // Swipe up - go to next slide
          nextSlide();
    } else {
          // Swipe down - go to previous slide or scroll page
          if (currentSlide === 0) {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          } else {
            prevSlide();
          }
        }
      }
      
      // Reset touch values
      touchStartY = null;
      touchEndY = null;
    }

    // Start automatic slideshow
    function startSlideshow() {
      slideInterval = setInterval(() => {
        nextSlide();
      }, 6000);
    }

    // Stop slideshow
    function stopSlideshow() {
      clearInterval(slideInterval);
    }

    // Show specific slide
    function showSlide(index) {
      // Reset slideshow interval
      stopSlideshow();
      startSlideshow();
      
      // Update slides
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      
      // Update indicators
      indicators.forEach((indicator, i) => {
        if (i === index) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
      
      // Apply dynamic styling based on slide content
      const currentSlideContent = slides[index].querySelector('.slide-content');
      if (currentSlideContent.classList.contains('dark-content')) {
        swipeIndicator.style.color = '#1d1d1f';
        indicators.forEach(ind => {
          ind.style.backgroundColor = ind.classList.contains('active') ? '#1d1d1f' : 'rgba(29, 29, 31, 0.5)';
        });
        
        // Update navigation buttons if they exist
        const prevButton = document.querySelector('.hero-nav-button.hero-prev');
        const nextButton = document.querySelector('.hero-nav-button.hero-next');
        if (prevButton && nextButton) {
          prevButton.classList.add('dark-content');
          nextButton.classList.add('dark-content');
        }
      } else {
        swipeIndicator.style.color = '#fff';
        indicators.forEach(ind => {
          ind.style.backgroundColor = ind.classList.contains('active') ? '#fff' : 'rgba(255, 255, 255, 0.5)';
        });
        
        // Update navigation buttons if they exist
        const prevButton = document.querySelector('.hero-nav-button.hero-prev');
        const nextButton = document.querySelector('.hero-nav-button.hero-next');
        if (prevButton && nextButton) {
          prevButton.classList.remove('dark-content');
          nextButton.classList.remove('dark-content');
        }
      }
    }

    // Next slide
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }

    // Previous slide
    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    }
    
    // Initialize the slider
    initializeSlider();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    });
    
    // Pause slideshow on hover
    slider.addEventListener('mouseenter', stopSlideshow);
    slider.addEventListener('mouseleave', startSlideshow);
    
    return {
      nextSlide,
      prevSlide,
      showSlide
    };
  }

  // Initialize the search popup functionality
  function initSearch() {
    const searchToggle = document.getElementById('search-toggle');
    const searchPopup = document.getElementById('search-popup');
    const closeBtn = document.querySelector('.search-popup-close');
    const searchInput = document.querySelector('.search-popup-input');
    
    // Create backdrop for blur effect if it doesn't exist
    let backdrop = document.querySelector('.search-popup-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'search-popup-backdrop';
      document.body.appendChild(backdrop);
    }

    // Open the search popup when the search icon is clicked
    if (searchToggle) {
      searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        if (searchPopup) {
          // Position the popup relative to the search icon
          const iconRect = searchToggle.getBoundingClientRect();
          const headerHeight = document.querySelector('.site-header').offsetHeight;
          
          // Set the position relative to the search icon
          searchPopup.style.top = headerHeight + 'px';
          searchPopup.style.right = (window.innerWidth - iconRect.right + 20) + 'px';
          
          // First show backdrop with blur effect
          backdrop.classList.add('active');
          
          // Then show search popup with slight delay for nice sequence
          setTimeout(() => {
            searchPopup.classList.add('active');
            
            // Focus on the search input after animation completes
            setTimeout(() => {
              if (searchInput) {
                searchInput.focus();
              }
            }, 300);
            
            // Show popular products when first opening search
            updateRecommendedProducts(getPopularProducts(4));
          }, 100);
          
          // Prevent scrolling on the body
          document.body.style.overflow = 'hidden';
        }
      });
    }

    // Close the search popup when the close button is clicked
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        closeSearchPopup();
      });
    }

    // Close the search popup when clicking outside
    backdrop.addEventListener('click', function(e) {
      if (e.target === backdrop) {
        closeSearchPopup();
      }
    });

    // Close the search popup when the ESC key is pressed
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && searchPopup && searchPopup.classList.contains('active')) {
        closeSearchPopup();
      }
    });

    // Function to close search popup with animation
    function closeSearchPopup() {
      if (searchPopup) {
        searchPopup.classList.remove('active');
        
        // Remove backdrop with a slight delay to allow popup animation to complete
        setTimeout(() => {
          backdrop.classList.remove('active');
          // Re-enable scrolling
          document.body.style.overflow = '';
        }, 300);
      }
    }

    // Handle search input functionality
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        // Search implementation would go here
        console.log('Searching for:', this.value);
        
        // If search input is not empty, show some suggested products
        const searchTerm = this.value.trim();
        const suggestedProducts = searchTerm ? performSearch(searchTerm) : getPopularProducts(4);
        updateRecommendedProducts(suggestedProducts);
      });
      
      // Handle Enter key press in search input
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          const searchTerm = this.value.trim();
          if (searchTerm.length > 0) {
            // Execute search and show results
            const searchResults = performSearch(searchTerm);
            updateRecommendedProducts(searchResults);
            
            // If no results found, show a message
            if (searchResults.length === 0) {
              showNotification(`No results found for "${searchTerm}"`);
            }
          }
        }
      });
    }
  }
  
  // Enhanced search function that returns products matching the query
  function performSearch(query) {
    if (!query || query.trim() === '') {
      return [];
    }

    query = query.trim().toLowerCase();
    const results = [];
    
    // Check each product for matches
    for (const id in productData) {
      const product = productData[id];
      let relevance = 0;
      
      // Product name match
      if (product.name.toLowerCase().includes(query)) {
        // Exact match adds more relevance
        if (product.name.toLowerCase() === query) {
          relevance += 100;
        } else {
          relevance += 50;
        }
        
        // Word match (e.g. "iPhone" will match "iPhone 14")
        const productNameWords = product.name.toLowerCase().split(' ');
        const queryWords = query.split(' ');
        for (const qWord of queryWords) {
          if (qWord.length > 2 && productNameWords.includes(qWord)) {
            relevance += 20;
          }
        }
      }
      
      // Category match
      if (product.category.toLowerCase().includes(query)) {
        relevance += 40;
      }
      
      // Description match
      if (product.description && product.description.toLowerCase().includes(query)) {
        relevance += 30;
        
        // Count occurrences in description
        const occurrences = (product.description.toLowerCase().match(new RegExp(query, 'g')) || []).length;
        relevance += occurrences * 5;
      }
      
      // Price match - for queries like "$999" or "999"
      const priceRegex = /\$?(\d+)/;
      const priceMatch = query.match(priceRegex);
      if (priceMatch && priceMatch[1]) {
        const queryPrice = parseInt(priceMatch[1]);
        // Check if price is close to product price
        const priceDiff = Math.abs(product.price - queryPrice);
        if (priceDiff < 100) {
          relevance += 40 - (priceDiff / 3); // More relevant as price gets closer
        }
      }
      
      // If product has any relevance, add it to results
      if (relevance > 0) {
        results.push({
          product: product,
          id: id,
          relevance: relevance
        });
      }
    }
    
    // Sort by relevance (highest first)
    results.sort((a, b) => b.relevance - a.relevance);
    
    // Return all results
    return results;
  }

  // Update recommended products in the search popup
  function updateRecommendedProducts(products) {
    const recommendedContainer = document.querySelector('.recommended-products');
    const recommendedTitle = document.querySelector('.recommended-title');
    
    if (!recommendedContainer || !recommendedTitle) return;
    
    // Update title based on whether it's search results or recommendations
    if (products.length > 0 && products[0].relevance) {
      recommendedTitle.textContent = 'Search Results';
    } else {
      recommendedTitle.textContent = 'Recommended';
    }
    
    // Clear current recommended products
    recommendedContainer.innerHTML = '';
    
    // If no products to show
    if (products.length === 0) {
      recommendedContainer.innerHTML = '<div class="no-results">No matching products found</div>';
      return;
    }
    
    // For progressive loading, we'll use Intersection Observer
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // If the element is visible
          if (entry.isIntersecting) {
            const img = entry.target;
            // Set the src to the data-src value
            if (img.dataset.src) {
              img.src = img.dataset.src;
              // Remove the data-src attribute to prevent reloading
              img.removeAttribute('data-src');
              // Add fade-in animation
              img.classList.add('fade-in');
            }
            // Unobserve this element to free up resources
            observer.unobserve(img);
          }
        });
      }, {
        // Threshold of 0.1 means as soon as 10% of the element is visible
        threshold: 0.1
      });
    }
    
    // Add new products
    products.forEach((item, index) => {
      const product = item.product || item;
      const id = item.id || '';
      
      const productElement = document.createElement('a');
      productElement.href = '#';
      productElement.className = 'recommended-product';
      productElement.setAttribute('data-id', id);
      
      // Get high-quality image - prioritize high-quality product images
      let imageSrc;
      let colorVariant = null;
      
      // First try to use the high-quality images from product data
      if (productData[id] && productData[id].images && productData[id].images.length > 0) {
        // Use the first image from the updated product images array
        imageSrc = productData[id].images[0];
        
        // If the product has colors, get the first color for the image alt text
        if (productData[id].colors && productData[id].colors.length > 0) {
          const colorCode = productData[id].colors[0];
          const colorMap = {
            '#555555': 'Space Black',
            '#f5f5f7': 'Silver',
            '#0071e3': 'Blue',
            '#86868b': 'Gray',
            '#4f3829': 'Natural Titanium',
            '#3d162e': 'Deep Purple',
            '#c93c20': 'Orange',
            '#facf37': 'Yellow', 
            '#d82e2e': 'Red',
            '#34c759': 'Green',
            '#ff9f0a': 'Gold'
          };
          colorVariant = colorMap[colorCode] || 'Default';
        }
      }
      // Fallback to product images if available
      else if (product.images && product.images.length > 0) {
        imageSrc = product.images[0];
      }
      // Otherwise use a placeholder
      else {
        imageSrc = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-product-placeholder?wid=720&hei=720&fmt=jpeg&qlt=90&.v=1697558347411';
      }
      
      // Create HTML for the product element - using data-src for lazy loading
      const productContent = `
        <div class="recommended-product-img">
          <img class="lazy-load" src="${index < 2 ? imageSrc : ''}" ${index >= 2 ? 'data-src="' + imageSrc + '"' : ''} 
               alt="${product.name}${colorVariant ? ` - ${colorVariant}` : ''}" 
               loading="lazy">
        </div>
        <div class="recommended-product-name">${product.name}</div>
        <div class="recommended-product-price">From $${product.price.toFixed(2)}</div>
      `;
      
      productElement.innerHTML = productContent;
      
      // Add click event to open product detail
      productElement.addEventListener('click', function(e) {
        // Prevent default behavior but don't open product details
        e.preventDefault();
        
        // Show loading state by adding a subtle pulse animation
        const productImg = this.querySelector('img');
        if (productImg) {
          productImg.style.transition = 'transform 0.3s ease';
          productImg.style.transform = 'scale(0.95)';
          setTimeout(() => {
            productImg.style.transform = 'scale(1)';
          }, 300);
        }
        
        // No longer opening product detail popup
        const productId = this.getAttribute('data-id');
      if (productId) {
          // Show notification instead
          const productName = this.querySelector('.recommended-product-name').textContent;
          showNotification(`${productName} selected`, 'info');
          
          // Scroll to the product section if available
          const productSection = document.querySelector(`#${productData[productId]?.category || 'products'}`);
          if (productSection) {
            productSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
      
      recommendedContainer.appendChild(productElement);
      
      // If we have an observer and this image should be lazy loaded, observe it
      if (observer && index >= 2) {
        const img = productElement.querySelector('img.lazy-load');
        if (img) {
          observer.observe(img);
        }
      }
    });
    
    // If IntersectionObserver is not supported, load all images
    if (!('IntersectionObserver' in window)) {
      const lazyImages = document.querySelectorAll('img.lazy-load');
      lazyImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
    }
  }

  // Get popular or suggested products for empty search
  function getPopularProducts(count = 4) {
    // Update with the current popular product IDs that have high-quality images
    const popularProductIds = ['1', '10', '5', '6', '2', '7', '4', '11'];
    const results = [];
    
    // Get data for popular products
    for (let i = 0; i < Math.min(count, popularProductIds.length); i++) {
      const id = popularProductIds[i];
      if (productData[id]) {
        results.push({
          product: productData[id],
          id: id
        });
      }
    }
    
    return results;
  }
  
  // Initialize product detail popups
  document.addEventListener('DOMContentLoaded', function() {
    // Get all product cards - no longer opening product detail popups on click
    const productCards = document.querySelectorAll('.product-card');
    
    // Keep only the Add to Cart functionality, product cards no longer show details on click
    
    // Close product detail modal when clicking the close button
    const closeProductModal = document.querySelector('.close-product-modal');
    if (closeProductModal) {
      closeProductModal.addEventListener('click', closeProductDetail);
    }
    
    // Close product detail modal when clicking outside the content
    const productModal = document.getElementById('product-detail-modal');
    if (productModal) {
      productModal.addEventListener('click', function(e) {
        if (e.target === this) {
          closeProductDetail();
        }
      });
    }
    
    // Close product detail modal when ESC key is pressed
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && productModal && productModal.classList.contains('active')) {
        closeProductDetail();
      }
    });
    
    // Preload recommended product images for faster search experience
    preloadRecommendedImages();
  });
  
  // Preload high-quality images for search recommendations
  function preloadRecommendedImages() {
    // Get the popular product IDs that are shown in search
    const popularProductIds = ['1', '10', '5', '6', '2', '7', '4', '11'];
    
    // Create a hidden div to store preloaded images
    const preloadContainer = document.createElement('div');
    preloadContainer.style.display = 'none';
    preloadContainer.id = 'preloaded-images';
    document.body.appendChild(preloadContainer);
    
    // Preload all high-quality images from popular products
    popularProductIds.forEach(id => {
      if (productData[id] && productData[id].images && productData[id].images.length > 0) {
        const img = new Image();
        img.src = productData[id].images[0];
        preloadContainer.appendChild(img);
      }
    });
    
    // Also preload the placeholder image
    const placeholderImg = new Image();
    placeholderImg.src = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-product-placeholder?wid=720&hei=720&fmt=jpeg&qlt=90&.v=1697558347411';
    preloadContainer.appendChild(placeholderImg);
  }
  
  // Function to open product detail modal
  function openProductDetail(productId) {
    const product = productData[productId];
    if (!product) return;
    
    const modal = document.getElementById('product-detail-modal');
    const productNameElement = document.getElementById('product-name');
    const productPriceElement = document.getElementById('product-price');
    const productDescriptionElement = document.getElementById('product-description');
    const productImage = document.getElementById('product-main-image');
    const colorOptionsContainer = document.querySelector('.product-modal-content .color-options');
    
    if (!modal || !productNameElement || !productPriceElement || !productDescriptionElement || !productImage) return;
    
    // Store current product ID in the modal for reference
    modal.setAttribute('data-current-product', productId);
    
    // Set product details
    productNameElement.textContent = product.name;
    productPriceElement.textContent = `$${product.price.toFixed(2)}`;
    productDescriptionElement.textContent = product.description;
    
    // Create a mapping of color codes to names for better display
    const colorMap = {
      '#555555': 'Space Black',
      '#f5f5f7': 'Silver',
      '#0071e3': 'Blue',
      '#86868b': 'Gray',
      '#4f3829': 'Natural Titanium',
      '#3d162e': 'Deep Purple',
      '#c93c20': 'Orange',
      '#facf37': 'Yellow', 
      '#d82e2e': 'Red',
      '#34c759': 'Green',
      '#ff9f0a': 'Gold'
    };
    
    // Create a complete set of images for each color
    // This emulates Apple's product view where each color has its own images
    const colorImageSets = {};
    
    // If the product has colors, set up the color-specific images
    if (product.colors && product.colors.length > 0) {
      product.colors.forEach((color, index) => {
        // For each color, create an array of images (main + angles)
        // In a real implementation, you'd have specific images for each color
        const baseImageIndex = index * 3; // Assume each color has up to 3 images
        const colorImages = [];
        
        // If we have enough images, use them; otherwise, use available images or placeholders
    if (product.images && product.images.length > 0) {
          // Try to get specific images for this color, or use the main image as fallback
          const mainImage = product.images[index] || product.images[0];
          colorImages.push(mainImage);
          
          // Add additional angle images if available
          if (product.images.length > baseImageIndex + 1) {
            colorImages.push(product.images[baseImageIndex + 1]);
          }
          
          if (product.images.length > baseImageIndex + 2) {
            colorImages.push(product.images[baseImageIndex + 2]);
          }
        } else {
          // Use placeholder if no images are available
          colorImages.push('https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-product-placeholder?wid=720&hei=720&fmt=jpeg&qlt=90&.v=1697558347411');
        }
        
        // Store this color's image set
        colorImageSets[color] = colorImages;
      });
    }
    
    // Set primary product image (default to first color's main image)
    const firstColor = product.colors && product.colors.length > 0 ? product.colors[0] : null;
    if (firstColor && colorImageSets[firstColor] && colorImageSets[firstColor].length > 0) {
      productImage.src = colorImageSets[firstColor][0];
      productImage.alt = `${product.name} - ${colorMap[firstColor] || 'Default'}`;
      
      // Add smooth transition effect for image changes
      productImage.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
    } else if (product.images && product.images.length > 0) {
      productImage.src = product.images[0];
      productImage.alt = product.name;
    } else {
      productImage.src = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-product-placeholder?wid=720&hei=720&fmt=jpeg&qlt=90&.v=1697558347411';
      productImage.alt = product.name;
    }
    
    // Set up thumbnail gallery based on the first color
    updateThumbnailsForColor(firstColor, colorImageSets, product, productImage);
    
    // Set up color options
    if (colorOptionsContainer && product.colors) {
      // Clear existing color options
      colorOptionsContainer.innerHTML = '';
      
      // Create color options based on product data
      product.colors.forEach((color, index) => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = color;
        
        // Store color for reference
        colorOption.setAttribute('data-color', color);
        
        // Get color name
        const colorName = colorMap[color.toLowerCase()] || `Color ${index + 1}`;
        colorOption.setAttribute('data-color-name', colorName);
        colorOption.setAttribute('aria-label', colorName);
        colorOption.title = colorName;
        
        // Set first color as selected
        if (index === 0) {
          colorOption.classList.add('selected');
          // Update product name to include the color
          productNameElement.textContent = `${product.name} - ${colorName}`;
        }
        
        // Add click event to switch images and highlight selected color
        colorOption.addEventListener('click', () => {
          // Remove selected class from all color options
          const allColorOptions = colorOptionsContainer.querySelectorAll('.color-option');
          allColorOptions.forEach(option => option.classList.remove('selected'));
          
          // Add selected class to clicked color option with a ripple effect
          colorOption.classList.add('selected');
          
          // Create ripple effect on click
          const ripple = document.createElement('span');
          ripple.className = 'color-ripple';
          ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-effect 0.6s linear;
            pointer-events: none;
          `;
          
          // Create style for ripple if it doesn't exist
          if (!document.getElementById('color-ripple-style')) {
            const style = document.createElement('style');
            style.id = 'color-ripple-style';
            style.textContent = `
              @keyframes ripple-effect {
                0% { transform: scale(0); opacity: 1; }
                80% { transform: scale(1.5); opacity: 0.7; }
                100% { transform: scale(2); opacity: 0; }
              }
              .color-option {
                overflow: hidden;
                position: relative;
              }
              .color-ripple {
                top: 50%;
                left: 50%;
                width: 100%;
                height: 100%;
                transform: translate(-50%, -50%) scale(0);
              }
            `;
            document.head.appendChild(style);
          }
          
          colorOption.appendChild(ripple);
          setTimeout(() => {
            ripple.remove();
          }, 600);
          
          // Get the color name
          const colorName = colorOption.getAttribute('data-color-name');
          
          // Update product name to show selected color (Apple-style)
          productNameElement.textContent = `${product.name} - ${colorName}`;
          
          // Apply subtle zoom out and fade effect when changing images
          productImage.style.opacity = '0.5';
          productImage.style.transform = 'scale(0.98)';
          
          // Update main product image to show this color with smooth transition
          setTimeout(() => {
            const colorImages = colorImageSets[color];
            if (colorImages && colorImages.length > 0) {
              // Create a temporary image to preload
              const tempImg = new Image();
              tempImg.onload = function() {
                // Once loaded, update the visible image
                productImage.src = colorImages[0];
                productImage.alt = `${product.name} - ${colorName}`;
                
                // Fade back in with subtle zoom effect
                productImage.style.opacity = '1';
                productImage.style.transform = 'scale(1)';
              };
              tempImg.src = colorImages[0];
        } else {
              // Fallback if no images found
              productImage.style.opacity = '1';
              productImage.style.transform = 'scale(1)';
            }
            
            // Update thumbnails for this color
            updateThumbnailsForColor(color, colorImageSets, product, productImage);
          }, 200);
          
          // Show notification when color is changed
          showNotification(`Selected ${colorName}`, 'info');
          
          // Announce color change for accessibility
          const announcement = document.createElement('div');
          announcement.setAttribute('aria-live', 'polite');
          announcement.className = 'sr-only';
          announcement.textContent = `Color changed to ${colorName}`;
          document.body.appendChild(announcement);
          setTimeout(() => announcement.remove(), 1000);
        });
        
        colorOptionsContainer.appendChild(colorOption);
      });
    }
    
    // Set up the Add to Bag button
    const addToCartBtn = modal.querySelector('.add-to-cart');
    if (addToCartBtn) {
      // Clear previous event listeners
      const newAddToCartBtn = addToCartBtn.cloneNode(true);
      addToCartBtn.parentNode.replaceChild(newAddToCartBtn, addToCartBtn);
      
      // Add new event listener with the current product ID
      newAddToCartBtn.addEventListener('click', function() {
        // Get selected color name if available
        const selectedColor = colorOptionsContainer.querySelector('.color-option.selected');
        const colorName = selectedColor ? selectedColor.getAttribute('data-color-name') : '';
        
        // Determine which storage option is selected (if any)
        let storageOption = '';
        const selectedStorage = modal.querySelector('.storage-option input[type="radio"]:checked');
        if (selectedStorage) {
          const storageLabel = selectedStorage.nextElementSibling;
          storageOption = storageLabel.querySelector('.storage-size').textContent;
        }
        
        // Build product configuration message
        let configMessage = '';
        if (colorName) {
          configMessage += colorName;
        }
        if (storageOption) {
          configMessage += (configMessage ? ', ' : '') + storageOption;
        }
        
        // Add item to bag
        addToBag(
          productId,
          product.name,
          product.price,
          selectedColor ? selectedColor.getAttribute('data-color') : null,
          colorName,
          storageOption,
          productImage.src
        );
        
        // Show success notification with product and configuration
        showNotification(`Added to bag: ${product.name}${configMessage ? ` (${configMessage})` : ''}`, 'success');
        
        // Close the modal
        closeProductDetail();
      });
    }
    
    // Customize the View Details button
    const viewDetailsBtn = modal.querySelector('.view-details');
    if (viewDetailsBtn) {
        // Remove any existing event listeners
        const newBtn = viewDetailsBtn.cloneNode(true);
        viewDetailsBtn.parentNode.replaceChild(newBtn, viewDetailsBtn);
        
        // Add event listener for opening detailed view
        newBtn.addEventListener('click', function() {
            // Hide the current modal
            closeProductDetail();
            
            // Show notification
            showNotification(`Viewing ${product.name} details`, 'info');
            
            // We no longer need to call loadProductDetails
            // The detailed view is only in the hero section now
        });
    }
    
    // Show the modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    
    // Add event listeners to close the modal
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscKeyPress);
  }

  // Function to update product image with smooth transition when color is selected
  function updateThumbnailsForColor(color, colorImageSets, product, productImage) {
    const thumbnails = document.querySelectorAll('.thumbnail');
    if (!thumbnails.length) return;
    
    // Get the images for this color
    const colorImages = color && colorImageSets[color] ? colorImageSets[color] : 
                       (product.images && product.images.length > 0 ? [product.images[0]] : []);
    
    // Hide all thumbnails first
    thumbnails.forEach(thumb => {
      thumb.style.display = 'none';
      thumb.classList.remove('active');
    });
    
    // Create a container for all images to enable smooth transitions between them
    let galleryContainer = document.querySelector('.gallery-container');
    if (!galleryContainer) {
      galleryContainer = document.createElement('div');
      galleryContainer.className = 'gallery-container';
      productImage.parentNode.appendChild(galleryContainer);
      
      // Create a style for the gallery container if it doesn't exist
      if (!document.getElementById('gallery-container-style')) {
        const style = document.createElement('style');
        style.id = 'gallery-container-style';
        style.textContent = `
          .gallery-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            perspective: 1000px;
          }
          .gallery-image {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: opacity 0.6s cubic-bezier(0.33, 1, 0.68, 1), 
                       transform 0.6s cubic-bezier(0.33, 1, 0.68, 1);
            opacity: 0;
            transform: scale(0.95) translateX(50px);
            pointer-events: none;
            will-change: transform, opacity;
          }
          .gallery-image.active {
            opacity: 1;
            transform: scale(1) translateX(0);
            z-index: 2;
          }
          .gallery-image.prev {
            opacity: 0;
            transform: scale(0.95) translateX(-50px);
            z-index: 1;
          }
          .gallery-image.next {
            opacity: 0;
            transform: scale(0.95) translateX(50px);
            z-index: 1;
          }
          .color-transition-indicator {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 10;
          }
          .indicator-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
          }
          .indicator-dot.active {
            background-color: #0071e3;
            transform: scale(1.2);
          }
          .swipe-hint {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease;
            z-index: 3;
          }
          .swipe-hint.show {
            opacity: 1;
            animation: swipeHint 1.5s ease-in-out;
          }
          @keyframes swipeHint {
            0% { opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes slideInRight {
            from { transform: translateX(100%) scale(0.95); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes slideOutLeft {
            from { transform: translateX(0) scale(1); opacity: 1; }
            to { transform: translateX(-100%) scale(0.95); opacity: 0; }
          }
          .sliding-in {
            animation: slideInRight 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards;
          }
          .sliding-out {
            animation: slideOutLeft 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards;
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    // Save current active image for transition
    const currentActiveImage = galleryContainer.querySelector('.gallery-image.active');
    const direction = currentActiveImage ? 'right' : 'none';
    
    // Clear existing gallery images, but keep the active one for transition
    const oldImages = galleryContainer.querySelectorAll('.gallery-image:not(.active)');
    oldImages.forEach(img => img.remove());
    
    if (currentActiveImage) {
      currentActiveImage.classList.remove('active');
      currentActiveImage.classList.add('prev');
      
      // Animate out the current image
      setTimeout(() => {
        currentActiveImage.remove();
      }, 600); // Match transition duration
    }
    
    // Create transition indicator
    let transitionIndicator = galleryContainer.querySelector('.color-transition-indicator');
    if (!transitionIndicator && colorImages.length > 1) {
      transitionIndicator = document.createElement('div');
      transitionIndicator.className = 'color-transition-indicator';
      galleryContainer.appendChild(transitionIndicator);
      
      // Create indicator dots
      colorImages.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot';
        if (i === 0) dot.classList.add('active');
        transitionIndicator.appendChild(dot);
      });
    }
    
    // Add new gallery images for this color with sequential loading
    colorImages.forEach((image, index) => {
      const galleryImage = document.createElement('img');
      galleryImage.className = 'gallery-image';
      if (direction === 'right') {
        galleryImage.classList.add('next');
      }
      galleryImage.src = image;
      galleryImage.alt = `${product.name} - View ${index + 1}`;
      galleryImage.loading = 'eager'; // Prioritize loading
      galleryImage.dataset.index = index;
      
      // Add to the gallery container
      galleryContainer.appendChild(galleryImage);
      
      // Set the first image as active with a slight delay for animation
      if (index === 0) {
        setTimeout(() => {
          galleryImage.classList.remove('next');
          galleryImage.classList.add('active');
          
          // Update indicator dots if they exist
          if (transitionIndicator) {
            const dots = transitionIndicator.querySelectorAll('.indicator-dot');
            dots.forEach((dot, i) => {
              dot.classList.toggle('active', i === 0);
            });
          }
          
          // Show swipe hint if there are multiple images
          if (colorImages.length > 1 && !localStorage.getItem('swipeHintShown')) {
            setTimeout(() => {
              const swipeHint = document.createElement('div');
              swipeHint.className = 'swipe-hint show';
              galleryContainer.appendChild(swipeHint);
              
              setTimeout(() => {
                swipeHint.remove();
                localStorage.setItem('swipeHintShown', 'true');
              }, 2000);
            }, 1000);
          }
        }, 50);
      }
    });
    
    // Make original product image transparent to show our gallery
    productImage.style.opacity = '0';
    
    // Update thumbnails with available images and add enhanced interactivity
    for (let i = 0; i < Math.min(thumbnails.length, colorImages.length); i++) {
      const thumbnail = thumbnails[i];
      const thumbnailImg = thumbnail.querySelector('img');
      
      if (thumbnailImg) {
        thumbnailImg.src = colorImages[i];
        thumbnailImg.alt = `${product.name} - View ${i + 1}`;
        thumbnail.style.display = 'block';
        thumbnail.dataset.index = i;
        
        // Remove old event listeners by cloning and replacing
        const newThumbnail = thumbnail.cloneNode(true);
        thumbnail.parentNode.replaceChild(newThumbnail, thumbnail);
        
        // Add click event to thumbnails with enhanced visual feedback
        newThumbnail.addEventListener('click', () => {
          // Update gallery view
          const galleryImages = galleryContainer.querySelectorAll('.gallery-image');
          const currentActive = galleryContainer.querySelector('.gallery-image.active');
          const currentIndex = currentActive ? parseInt(currentActive.dataset.index) : -1;
          const targetIndex = i;
          
          // Determine direction for animation
          const direction = targetIndex > currentIndex ? 'right' : 'left';
          
          // Remove active from all images
          galleryImages.forEach(img => {
            img.classList.remove('active', 'prev', 'next');
            if (img === currentActive) {
              img.classList.add(direction === 'right' ? 'prev' : 'next');
            }
          });
          
          // Find and activate the correct gallery image
          const targetImage = galleryImages[i];
          if (targetImage) {
            // Position for entrance animation
            targetImage.classList.add(direction === 'right' ? 'next' : 'prev');
            
            // Trigger reflow
            targetImage.offsetHeight;
            
            // Remove positioning class and add active
            targetImage.classList.remove(direction === 'right' ? 'next' : 'prev');
            targetImage.classList.add('active');
            
            // Update indicator dots if they exist
            if (transitionIndicator) {
              const dots = transitionIndicator.querySelectorAll('.indicator-dot');
              dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === i);
              });
            }
          }
          
          // Update active thumbnail with animated highlight
          thumbnails.forEach(t => t.classList.remove('active'));
          newThumbnail.classList.add('active');
          newThumbnail.style.animation = 'pulse 0.5s ease';
          setTimeout(() => {
            newThumbnail.style.animation = '';
          }, 500);
        });
        
        // Set first thumbnail as active
        if (i === 0) {
          newThumbnail.classList.add('active');
        }
      }
    }
    
    // Add touch swipe support for color image gallery
    setupGallerySwipeSupport(galleryContainer, colorImages.length, transitionIndicator);
  }

  // Add touch swipe support for product color images
  function setupGallerySwipeSupport(galleryContainer, imageCount, indicator) {
    if (!galleryContainer || imageCount <= 1) return;
    
    // Remove any existing event listeners
    galleryContainer.removeEventListener('touchstart', galleryContainer.handleTouchStart);
    galleryContainer.removeEventListener('touchmove', galleryContainer.handleTouchMove);
    galleryContainer.removeEventListener('touchend', galleryContainer.handleTouchEnd);
    galleryContainer.removeEventListener('mousedown', galleryContainer.handleMouseDown);
    galleryContainer.removeEventListener('mousemove', galleryContainer.handleMouseMove);
    galleryContainer.removeEventListener('mouseup', galleryContainer.handleMouseUp);
    galleryContainer.removeEventListener('mouseleave', galleryContainer.handleMouseLeave);
    
    let startX, currentX, isDragging = false;
    const threshold = 50; // Minimum distance to trigger swipe
    let initialOffset = 0;
    const maxDragDistance = galleryContainer.offsetWidth * 0.3; // 30% of container width
    
    // Add pointer events for both touch and mouse
    galleryContainer.style.pointerEvents = 'auto';
    
    // Touch events
    galleryContainer.handleTouchStart = function(e) {
      startX = e.touches[0].clientX;
      currentX = startX;
      isDragging = true;
      initialOffset = 0;
      
      // Get current image
      const activeImage = galleryContainer.querySelector('.gallery-image.active');
      if (activeImage) {
        activeImage.style.transition = 'none';
      }
    };
    
    galleryContainer.handleTouchMove = function(e) {
      if (!isDragging) return;
      
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      
      // Get current image
      const activeImage = galleryContainer.querySelector('.gallery-image.active');
      if (activeImage) {
        // Calculate drag distance with resistance at edges
        let dragDistance = diffX;
        const activeIndex = parseInt(activeImage.dataset.index || 0);
        
        // Add resistance at edges
        if ((activeIndex === 0 && diffX > 0) || 
            (activeIndex === imageCount - 1 && diffX < 0)) {
          dragDistance = diffX / 3; // Add resistance
        }
        
        // Limit drag distance
        dragDistance = Math.min(Math.max(dragDistance, -maxDragDistance), maxDragDistance);
        
        // Apply transform
        activeImage.style.transform = `translateX(${dragDistance}px) scale(${1 - Math.abs(dragDistance) / (maxDragDistance * 5)})`;
        initialOffset = dragDistance;
      }
    };
    
    galleryContainer.handleTouchEnd = function() {
      if (!isDragging) return;
      isDragging = false;
      
      const activeImage = galleryContainer.querySelector('.gallery-image.active');
      if (activeImage) {
        // Restore transition
        activeImage.style.transition = 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)';
        
        // Reset transform if not enough to trigger swipe
        if (Math.abs(initialOffset) < threshold) {
          activeImage.style.transform = '';
          return;
        }
        
        // Get current index
        const activeIndex = parseInt(activeImage.dataset.index || 0);
        
        // Determine direction
        const direction = initialOffset > 0 ? 'right' : 'left';
        
        // Calculate target index
        let targetIndex;
        if (direction === 'right' && activeIndex > 0) {
          targetIndex = activeIndex - 1;
        } else if (direction === 'left' && activeIndex < imageCount - 1) {
          targetIndex = activeIndex + 1;
        } else {
          // Can't move in this direction, reset
          activeImage.style.transform = '';
          return;
        }
        
        // Switch to target image
        switchToImage(galleryContainer, targetIndex, direction);
        
        // Update indicator if present
        if (indicator) {
          const dots = indicator.querySelectorAll('.indicator-dot');
          dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === targetIndex);
          });
        }
        
        // Update thumbnail selection
        updateThumbnailSelection(targetIndex);
      }
    };
    
    // Mouse events for desktop
    galleryContainer.handleMouseDown = function(e) {
      startX = e.clientX;
      currentX = startX;
      isDragging = true;
      initialOffset = 0;
      
      // Get current image
      const activeImage = galleryContainer.querySelector('.gallery-image.active');
      if (activeImage) {
        activeImage.style.transition = 'none';
      }
      
      // Prevent default to avoid text selection
      e.preventDefault();
    };
    
    galleryContainer.handleMouseMove = function(e) {
      if (!isDragging) return;
      
      currentX = e.clientX;
      const diffX = currentX - startX;
      
      // Get current image
      const activeImage = galleryContainer.querySelector('.gallery-image.active');
      if (activeImage) {
        // Calculate drag distance with resistance at edges
        let dragDistance = diffX;
        const activeIndex = parseInt(activeImage.dataset.index || 0);
        
        // Add resistance at edges
        if ((activeIndex === 0 && diffX > 0) || 
            (activeIndex === imageCount - 1 && diffX < 0)) {
          dragDistance = diffX / 3; // Add resistance
        }
        
        // Limit drag distance
        dragDistance = Math.min(Math.max(dragDistance, -maxDragDistance), maxDragDistance);
        
        // Apply transform
        activeImage.style.transform = `translateX(${dragDistance}px) scale(${1 - Math.abs(dragDistance) / (maxDragDistance * 5)})`;
        initialOffset = dragDistance;
      }
    };
    
    galleryContainer.handleMouseUp = function() {
      if (!isDragging) return;
      
      galleryContainer.handleTouchEnd(); // Reuse same logic
    };
    
    galleryContainer.handleMouseLeave = function() {
      if (isDragging) {
        galleryContainer.handleTouchEnd(); // Reuse same logic
      }
    };
    
    // Add event listeners
    galleryContainer.addEventListener('touchstart', galleryContainer.handleTouchStart, { passive: true });
    galleryContainer.addEventListener('touchmove', galleryContainer.handleTouchMove, { passive: true });
    galleryContainer.addEventListener('touchend', galleryContainer.handleTouchEnd);
    
    // Add mouse event listeners for desktop
    galleryContainer.addEventListener('mousedown', galleryContainer.handleMouseDown);
    galleryContainer.addEventListener('mousemove', galleryContainer.handleMouseMove);
    galleryContainer.addEventListener('mouseup', galleryContainer.handleMouseUp);
    galleryContainer.addEventListener('mouseleave', galleryContainer.handleMouseLeave);
    
    // Helper function to switch images
    function switchToImage(container, index, direction) {
      const images = container.querySelectorAll('.gallery-image');
      const currentActive = container.querySelector('.gallery-image.active');
      
      if (!currentActive) return;
      
      // Set current to sliding out
      currentActive.classList.remove('active');
      if (direction === 'left') {
        currentActive.classList.add('prev');
      } else {
        currentActive.classList.add('next');
      }
      
      // Find and activate target image
      images.forEach(img => {
        const imgIndex = parseInt(img.dataset.index || 0);
        if (imgIndex === index) {
          // Position for entrance animation
          img.classList.remove('active', 'prev', 'next');
          img.classList.add(direction === 'left' ? 'next' : 'prev');
          
          // Trigger reflow
          img.offsetHeight;
          
          // Start animation
          img.classList.remove('next', 'prev');
          img.classList.add('active');
        }
      });
    }
    
    function updateThumbnailSelection(index) {
      const thumbnails = document.querySelectorAll('.thumbnail');
      thumbnails.forEach(t => t.classList.remove('active'));
      
      // Find thumbnail by index and activate
      thumbnails.forEach(thumb => {
        if (parseInt(thumb.dataset.index || 0) === index) {
          thumb.classList.add('active');
        }
      });
    }
  }

  // Helper functions for modal closing
  function handleOutsideClick(e) {
    const modal = document.getElementById('product-detail-modal');
    if (modal && e.target === modal) {
      closeProductDetail();
    }
  }

  function handleEscKeyPress(e) {
    if (e.key === 'Escape') {
      closeProductDetail();
    }
  }
  
  // Function to close product detail modal
  function closeProductDetail() {
    const modal = document.getElementById('product-detail-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    
    // Re-enable body scrolling
    document.body.style.overflow = '';
    
    // Remove event listeners
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleEscKeyPress);
  }
  
  // Function to customize modal based on product category
  function customizeModalForCategory(category) {
    const storageOptions = document.querySelector('.storage-options');
    
    // Show/hide storage options based on category
    if (['iphone', 'ipad'].includes(category)) {
      storageOptions.style.display = 'flex';
      
      // Update storage options text
      const storageSizes = document.querySelectorAll('.storage-size');
      const storagePrices = document.querySelectorAll('.storage-price');
      
      if (category === 'iphone') {
        storageSizes[0].textContent = '128GB';
        storageSizes[1].textContent = '256GB';
        storageSizes[2].textContent = '512GB';
        
        storagePrices[0].textContent = '+$0';
        storagePrices[1].textContent = '+$100';
        storagePrices[2].textContent = '+$300';
      } else if (category === 'ipad') {
        storageSizes[0].textContent = '64GB';
        storageSizes[1].textContent = '256GB';
        storageSizes[2].textContent = '1TB';
        
        storagePrices[0].textContent = '+$0';
        storagePrices[1].textContent = '+$150';
        storagePrices[2].textContent = '+$500';
      }
    } else {
      storageOptions.style.display = 'none';
    }
  }
  
  // Initialize sign-in modal tabs
  function initSignInModal() {
    const signinModal = document.getElementById('signin-modal');
    if (!signinModal) return;

    const tabBtns = signinModal.querySelectorAll('.tab-btn');
    const tabContents = signinModal.querySelectorAll('.tab-content');
    const closeBtn = signinModal.querySelector('.close-button');
    const passwordToggles = signinModal.querySelectorAll('.toggle-password');
    const signinBtn = document.getElementById('signin-btn');
    const formGroups = signinModal.querySelectorAll('.form-group');
    const appleLogoEl = signinModal.querySelector('.apple-logo');
    const socialBtns = signinModal.querySelectorAll('.social-btn');
    
    // Apply initial animations when modal is opened
    function animateModalOpen() {
      // Reset animations
      tabContents.forEach(content => {
        content.style.opacity = '0';
        content.style.transform = 'translateY(10px)';
      });
      
      // Show the first tab and animate its elements
      const activeTab = signinModal.querySelector('.tab-content.active');
      if (activeTab) {
        setTimeout(() => {
          activeTab.style.opacity = '1';
          activeTab.style.transform = 'translateY(0)';
          
          // Animate form groups with a staggered delay
          const activeFormGroups = activeTab.querySelectorAll('.form-group');
          activeFormGroups.forEach((group, index) => {
            setTimeout(() => {
              group.style.opacity = '1';
              group.style.transform = 'translateY(0)';
            }, 75 * (index + 1));
          });
        }, 100);
      }
      
      // Add entrance animation for Apple logo
      if (appleLogoEl) {
        appleLogoEl.style.opacity = '0';
        appleLogoEl.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
          appleLogoEl.style.opacity = '1';
          appleLogoEl.style.transform = 'scale(1)';
          appleLogoEl.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 200);
      }
      
      // Animate social buttons with a bounce effect
      socialBtns.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          btn.style.opacity = '1';
          btn.style.transform = 'translateY(0)';
          btn.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 600 + (index * 100));
      });
    }
    
    // Tab switching functionality with enhanced animations
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Add animation for tab button
        btn.classList.add('pulse-animation');
        setTimeout(() => btn.classList.remove('pulse-animation'), 300);
        
        // Update active tab button
        tabBtns.forEach(tb => tb.classList.remove('active'));
        btn.classList.add('active');
        
        // Animate out current tab
        const currentActiveTab = signinModal.querySelector('.tab-content.active');
        if (currentActiveTab) {
          currentActiveTab.style.opacity = '0';
          currentActiveTab.style.transform = 'translateY(-10px)';
        }
        
        // Show the corresponding tab content with animation
        setTimeout(() => {
          tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-content`) {
              content.classList.add('active');
              
              // Reset transforms before animating in
              content.style.transform = 'translateY(10px)';
              content.style.opacity = '0';
              
              setTimeout(() => {
                // Fade in the tab
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
                
                // Animate form groups with a staggered delay
                const formGroups = content.querySelectorAll('.form-group');
                formGroups.forEach((group, index) => {
                  group.style.opacity = '0';
                  group.style.transform = 'translateY(10px)';
                  
                  setTimeout(() => {
                    group.style.opacity = '1';
                    group.style.transform = 'translateY(0)';
                  }, 75 * (index + 1));
                });
              }, 50);
            }
          });
        }, 200);
      });
    });

    // Password toggle functionality with animation
    passwordToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const passwordField = toggle.parentElement.querySelector('.password-field');
        const eyeOpen = toggle.querySelector('.eye-open');
        const eyeClosed = toggle.querySelector('.eye-closed');
        
        // Add click animation
        toggle.classList.add('pulse-animation');
        setTimeout(() => toggle.classList.remove('pulse-animation'), 300);
        
        if (passwordField.type === 'password') {
          passwordField.type = 'text';
          eyeOpen.style.display = 'none';
          eyeClosed.style.display = 'block';
        } else {
          passwordField.type = 'password';
          eyeOpen.style.display = 'block';
          eyeClosed.style.display = 'none';
        }
      });
    });
    
    // Close modal functionality
    closeBtn.addEventListener('click', () => {
      // Fade out animation
      signinModal.style.opacity = '0';
      
      const signinContent = signinModal.querySelector('.signin-content');
      if (signinContent) {
        signinContent.style.transform = 'scale(0.95) translateY(10px)';
        signinContent.style.opacity = '0';
        signinContent.style.transition = 'all 0.3s ease';
      }
      
      setTimeout(() => {
        signinModal.classList.remove('active');
        signinModal.style.display = 'none';
      }, 300);
    });
    
    // Open modal when sign-in button is clicked with animation
    if (signinBtn) {
      signinBtn.addEventListener('click', (e) => {
    e.preventDefault();
        
        // Reset any existing animations
        const signinContent = signinModal.querySelector('.signin-content');
        if (signinContent) {
          signinContent.style.transform = 'scale(0.95) translateY(10px)';
          signinContent.style.opacity = '0';
        }
        
        signinModal.style.display = 'flex';
        signinModal.style.opacity = '0';
        
        // Trigger entrance animations
        requestAnimationFrame(() => {
          signinModal.style.opacity = '1';
          signinModal.classList.add('active');
          
          if (signinContent) {
            setTimeout(() => {
              signinContent.style.transform = 'scale(1) translateY(0)';
              signinContent.style.opacity = '1';
              signinContent.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
              
              // Animate the form elements
              animateModalOpen();
            }, 50);
          }
        });
      });
    }

    // Add animation to form inputs on focus
    const formInputs = signinModal.querySelectorAll('.form-control');
    formInputs.forEach(input => {
      input.addEventListener('focus', () => {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
          formGroup.classList.add('focused');
        }
      });
      
      input.addEventListener('blur', () => {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
          formGroup.classList.remove('focused');
        }
      });
    });

    // Handle form submission with animation
    const signinForm = signinModal.querySelector('.signin-form');
    const signupForm = signinModal.querySelector('.signup-form');
    
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Animate the submit button
      const submitBtn = signinForm.querySelector('.signin-button');
      if (submitBtn) {
        submitBtn.classList.add('processing');
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;
      }
      
      // Simulate processing with a delay
      setTimeout(() => {
        // In a real app, you'd validate and submit the form
        showNotification('Sign in successful!');
        
        // Animate modal closing
        const signinContent = signinModal.querySelector('.signin-content');
        if (signinContent) {
          signinContent.style.transform = 'scale(1.05)';
          signinContent.style.opacity = '0';
          signinContent.style.transition = 'all 0.3s ease';
        }
        
        signinModal.style.opacity = '0';
        setTimeout(() => {
          signinModal.classList.remove('active');
          signinModal.style.display = 'none';
          
          // Reset button state for next time
          if (submitBtn) {
            submitBtn.classList.remove('processing');
            submitBtn.textContent = 'Sign In';
            submitBtn.disabled = false;
          }
        }, 300);
      }, 1000);
    });
    
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Animate the submit button
      const submitBtn = signupForm.querySelector('.signin-button');
      if (submitBtn) {
        submitBtn.classList.add('processing');
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;
      }
      
      // Simulate processing with a delay
      setTimeout(() => {
        // In a real app, you'd validate and submit the form
        showNotification('Account created successfully!');
        
        // Animate modal closing
        const signinContent = signinModal.querySelector('.signin-content');
        if (signinContent) {
          signinContent.style.transform = 'scale(1.05)';
          signinContent.style.opacity = '0';
          signinContent.style.transition = 'all 0.3s ease';
        }
        
        signinModal.style.opacity = '0';
        setTimeout(() => {
          signinModal.classList.remove('active');
          signinModal.style.display = 'none';
          
          // Reset button state for next time
          if (submitBtn) {
            submitBtn.classList.remove('processing');
            submitBtn.textContent = 'Create Account';
            submitBtn.disabled = false;
          }
        }, 300);
      }, 1000);
    });

    // Social sign-in buttons with animation
    socialBtns.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        const svg = btn.querySelector('svg');
        if (svg) {
          svg.style.transform = 'scale(1.1)';
          svg.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }
      });
      
      btn.addEventListener('mouseleave', () => {
        const svg = btn.querySelector('svg');
        if (svg) {
          svg.style.transform = 'scale(1)';
        }
      });
      
      btn.addEventListener('click', () => {
        const provider = btn.classList.contains('google-btn') ? 'Google' : 'Facebook';
        
        // Animate the button when clicked
        btn.classList.add('clicked');
        
        setTimeout(() => {
          btn.classList.remove('clicked');
          showNotification(`Signing in with ${provider}...`);
          // In a real app, you'd handle OAuth flow
        }, 300);
      });
    });

    // Populate day and year dropdowns for date of birth
    const daySelect = signinModal.querySelector('select[name="dob-day"]');
    const yearSelect = signinModal.querySelector('select[name="dob-year"]');
    
    // Populate days 1-31
    if (daySelect) {
      daySelect.innerHTML = '<option value="" disabled selected>Day</option>';
      for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
      }
    }
    
    // Populate years (current year - 100) to (current year - 13)
    if (yearSelect) {
      const currentYear = new Date().getFullYear();
      yearSelect.innerHTML = '<option value="" disabled selected>Year</option>';
      for (let i = currentYear - 13; i >= currentYear - 100; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
      }
    }
    
    // Add animations for the select dropdowns
    const selectElements = signinModal.querySelectorAll('select');
    selectElements.forEach(select => {
      select.addEventListener('focus', () => {
        select.parentElement.classList.add('focused');
      });
      
      select.addEventListener('blur', () => {
        select.parentElement.classList.remove('focused');
      });
    });
  }
  
  // Handle purchase button clicks
  document.addEventListener('DOMContentLoaded', function() {
    // Purchase buttons
    document.body.addEventListener('click', function(event) {
      const purchaseBtn = event.target.closest('.purchase-btn');
      if (purchaseBtn) {
        event.preventDefault();
        
        // Get product name
        let productName = '';
        const nameElement = document.getElementById('product-name');
        if (nameElement) {
          productName = nameElement.textContent.trim();
        }
        
        // Show purchase message
        alert(`Thank you for your interest in ${productName || 'this product'}. This is a demo site.`);
      }
      
      // View Details buttons no longer do anything
    });
  });
  
  // Initialize color options
  initColorOptions();
  
  // Sign-in Modal
  const signinContent = signinModal.querySelector('.signin-content');
  const signinForm = signinModal.querySelector('.signin-form');
  const passwordField = document.getElementById('password');
  const togglePassword = document.querySelector('.toggle-password');
  
  // Show the sign-in modal
  if (signinBtn && signinModal) {
    signinBtn.addEventListener('click', function(e) {
      e.preventDefault();
      signinModal.style.display = 'flex';
      setTimeout(() => {
        signinContent.classList.add('show');
      }, 10);
      
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    });
    
    // Close the sign-in modal when clicking the close button
    closeModalBtn.addEventListener('click', function() {
      closeSigninModal();
    });
    
    // Close the sign-in modal when clicking outside the content
    signinModal.addEventListener('click', function(e) {
      if (e.target === signinModal) {
        closeSigninModal();
      }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && signinModal.style.display === 'flex') {
        closeSigninModal();
      }
    });
    
    // Handle form submission
    signinForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show success notification
      showNotification('Successfully signed in');
      
      // Close the modal
      closeSigninModal();
    });
    
    // Toggle password visibility
    if (togglePassword && passwordField) {
      togglePassword.addEventListener('click', function() {
        const passwordField = togglePassword.parentElement.querySelector('.password-field');
        const eyeOpen = togglePassword.querySelector('.eye-open');
        const eyeClosed = togglePassword.querySelector('.eye-closed');
        
        // Add click animation
        togglePassword.classList.add('pulse-animation');
        setTimeout(() => togglePassword.classList.remove('pulse-animation'), 300);
        
        if (passwordField.type === 'password') {
          passwordField.type = 'text';
          eyeOpen.style.display = 'none';
          eyeClosed.style.display = 'block';
        } else {
          passwordField.type = 'password';
          eyeOpen.style.display = 'block';
          eyeClosed.style.display = 'none';
        }
      });
    }
    
    // Function to close the sign-in modal
    function closeSigninModal() {
      signinContent.classList.remove('show');
      setTimeout(() => {
        signinModal.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
    }
  }

  // Initialize the sign-in modal
  initSignInModal();
  
  // Improved notification function that handles different types of notifications
  function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.toast-notification-container');
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.className = 'toast-notification-container';
      document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `toast-notification ${type}`;
    
    // Add appropriate icon based on notification type
    let iconSvg = '';
    switch (type) {
      case 'success':
        iconSvg = '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
        break;
      case 'info':
        iconSvg = '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
        break;
      case 'error':
        iconSvg = '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        break;
    }
    
    // Set notification content with Apple-style clean design
    notification.innerHTML = `
      <div class="notification-icon ${type}">${iconSvg}</div>
      <div class="notification-message"><p>${message}</p></div>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.add('active');
    }, 10);
    
    // Remove after animation completes
    setTimeout(() => {
      notification.classList.remove('active');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  