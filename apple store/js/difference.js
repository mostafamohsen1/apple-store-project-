document.addEventListener('DOMContentLoaded', () => {
  initOrbs();
  observeSection();
  setupItemInteractions();
});

// Create and animate floating orbs
function initOrbs() {
  const orbsContainer = document.querySelector('.animated-orbs');
  if (!orbsContainer) return;

  // Make sure orbs elements exist
  const orbElements = orbsContainer.querySelectorAll('.orb');
  if (orbElements.length === 0) {
    // Create orbs if they don't exist in the HTML
    const orb1 = document.createElement('div');
    orb1.className = 'orb orb-1';
    
    const orb2 = document.createElement('div');
    orb2.className = 'orb orb-2';
    
    const orb3 = document.createElement('div');
    orb3.className = 'orb orb-3';
    
    orbsContainer.appendChild(orb1);
    orbsContainer.appendChild(orb2);
    orbsContainer.appendChild(orb3);
  }
}

// Add intersection observer to trigger animations when section is visible
function observeSection() {
  const section = document.querySelector('.apple-store-difference');
  if (!section) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        section.style.opacity = '1';
        
        // Stagger the animations of difference items
        const items = section.querySelectorAll('.difference-item');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 200 + (index * 100));
        });
        
        // Only observe once
        observer.unobserve(section);
      }
    });
  }, {
    threshold: 0.2
  });
  
  observer.observe(section);
}

// Setup interactive elements
function setupItemInteractions() {
  const items = document.querySelectorAll('.difference-item');
  
  items.forEach(item => {
    // Add hover effect
    item.addEventListener('mouseenter', () => {
      const icon = item.querySelector('.difference-icon');
      if (icon) {
        icon.style.transform = 'scale(1.1)';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      const icon = item.querySelector('.difference-icon');
      if (icon) {
        icon.style.transform = 'scale(1)';
      }
    });
    
    // Add click effect for mobile
    item.addEventListener('click', () => {
      const link = item.querySelector('.difference-link');
      if (link && window.innerWidth <= 734) {
        link.style.opacity = '1';
        link.style.transform = 'translateY(0)';
        
        // Reset after delay
        setTimeout(() => {
          link.style.opacity = '';
          link.style.transform = '';
        }, 3000);
      }
    });
  });
  
  // Add button interaction
  const button = document.querySelector('.difference-btn');
  if (button) {
    button.addEventListener('click', () => {
      // Add pulse effect
      button.classList.add('pulse-animation');
      
      // Remove after animation completes
      setTimeout(() => {
        button.classList.remove('pulse-animation');
      }, 600);
      
      // Here you would normally navigate or perform an action
      // For demo purposes we'll just log
      console.log('Exploring Apple Store services');
    });
  }
}

// Add subtle parallax effect to orbs on mouse move
document.addEventListener('mousemove', (e) => {
  const section = document.querySelector('.apple-store-difference');
  if (!section) return;
  
  // Check if mouse is over our section
  const rect = section.getBoundingClientRect();
  if (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    const orbs = document.querySelectorAll('.orb');
    
    // Calculate mouse position relative to the center of the section
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate percentage from center (-1 to 1)
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);
    
    // Apply subtle movement to each orb with different intensity
    orbs.forEach((orb, index) => {
      const intensity = [3, 5, 4][index] || 4;
      const offsetX = percentX * intensity;
      const offsetY = percentY * intensity;
      
      orb.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  }
}); 