document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (burgerMenu) {
        burgerMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            burgerMenu.classList.toggle('active');
        });
    }
    
    // Sign In Modal functionality
    const signinButton = document.getElementById('signin-button');
    const signinModal = document.getElementById('signin-modal');
    const closeButton = document.querySelector('.close-button');
    const signinForm = document.querySelector('.signin-form');
    const togglePasswordButton = document.querySelector('.toggle-password');
    const passwordField = document.getElementById('password');
    
    // Open modal when clicking Sign In button
    if (signinButton && signinModal) {
        signinButton.addEventListener('click', function(e) {
            e.preventDefault();
            signinModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    }
    
    // Close modal when clicking X button
    if (closeButton && signinModal) {
        closeButton.addEventListener('click', function() {
            signinModal.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    }
    
    // Close modal when clicking outside of it
    if (signinModal) {
        signinModal.addEventListener('click', function(e) {
            if (e.target === signinModal) {
                signinModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Toggle password visibility
    if (togglePasswordButton && passwordField) {
        togglePasswordButton.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Change the eye icon based on password visibility
            const eyeIcon = this.querySelector('.show-icon');
            if (type === 'password') {
                eyeIcon.textContent = '👁️';
            } else {
                eyeIcon.textContent = '👁️‍🗨️';
            }
        });
    }
    
    // Handle form submission
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const appleId = document.getElementById('apple-id').value;
            const password = passwordField.value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Simple form validation
            if (!appleId || !password) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Here you would typically send this data to a server for authentication
            console.log('Sign-in attempt:', { appleId, password: '********', rememberMe });
            
            // For demo purposes, show success message and close modal
            alert('Sign-in successful!');
            signinModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Clear form
            this.reset();
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
                
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    burgerMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterContainer = document.querySelector('.newsletter-container');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Success state
                newsletterContainer.innerHTML = `
                    <div class="newsletter-success success-animation">
                        <h2>Thank you for subscribing!</h2>
                        <p>You'll be the first to hear about new products, exclusive offers, and upcoming events.</p>
                    </div>
                `;
                
                // You would typically send the form data to a server here
            } else {
                // Show error
                emailInput.classList.add('error');
                setTimeout(() => {
                    emailInput.classList.remove('error');
                }, 500);
            }
        });
    }
    
    // Featured items interaction
    const featuredItems = document.querySelectorAll('.featured-item');
    
    featuredItems.forEach(item => {
        const featuredImage = item.querySelector('img');
        const featuredContent = item.querySelector('.featured-content');
        const isSpecial = item.classList.contains('special');
        const isHighlight = item.classList.contains('highlight');
        
        // Hover effects for featured items
        item.addEventListener('mouseenter', function() {
            // Different hover behaviors based on item type
            if (featuredImage) {
                if (isSpecial) {
                    featuredImage.style.transform = 'scale(1.05) translateY(-5px)';
                    featuredImage.style.transition = 'transform 1s cubic-bezier(0.42, 0, 0.58, 1)';
                } else if (isHighlight) {
                    featuredImage.style.transform = 'scale(1.02) translateY(-3px)';
                    featuredImage.style.filter = 'brightness(1.05)';
                    featuredImage.style.transition = 'transform 0.8s cubic-bezier(0.42, 0, 0.58, 1), filter 0.8s cubic-bezier(0.42, 0, 0.58, 1)';
                } else {
                    featuredImage.style.transform = 'scale(1.03)';
                    featuredImage.style.transition = 'transform 0.7s cubic-bezier(0.42, 0, 0.58, 1)';
                }
            }
            
            // Animate content as well
            if (featuredContent) {
                featuredContent.style.transform = 'translateY(-5px)';
                featuredContent.style.transition = 'transform 0.7s cubic-bezier(0.42, 0, 0.58, 1)';
                
                // Animate links with a slight delay
                const links = featuredContent.querySelectorAll('a');
                links.forEach((link, index) => {
                    link.style.transition = 'opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1), transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)';
                    link.style.transitionDelay = `${index * 0.05}s`;
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                });
            }
        });
        
        // Reset on mouse leave
        item.addEventListener('mouseleave', function() {
            if (featuredImage) {
                featuredImage.style.transform = '';
                featuredImage.style.filter = '';
                featuredImage.style.transition = 'transform 0.5s cubic-bezier(0.42, 0, 0.58, 1), filter 0.5s cubic-bezier(0.42, 0, 0.58, 1)';
            }
            
            if (featuredContent) {
                featuredContent.style.transform = '';
                featuredContent.style.transition = 'transform 0.5s cubic-bezier(0.42, 0, 0.58, 1)';
                
                // Reset links
                const links = featuredContent.querySelectorAll('a');
                links.forEach(link => {
                    link.style.transition = 'opacity 0.2s cubic-bezier(0.42, 0, 0.58, 1), transform 0.2s cubic-bezier(0.42, 0, 0.58, 1)';
                    link.style.transitionDelay = '0s';
                    link.style.opacity = '';
                    link.style.transform = '';
                });
            }
        });
        
        // Click effect for special items
        if (isSpecial) {
            item.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                
                // Position ripple at click point
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                item.appendChild(ripple);
                
                // Clean up
                setTimeout(() => {
                    ripple.remove();
                    
                    // Could navigate to a details page
                    // window.location.href = '/vision-pro';
                }, 800);
            });
        }
    });
    
    // Service items hover animation
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        const icon = item.querySelector('.service-icon');
        
        item.addEventListener('mouseenter', function() {
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
    
    // Scroll animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // Stop observing once the animation has triggered
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all featured items
    featuredItems.forEach((item, index) => {
        // Add staggered animation delay
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    
    if (heroSection && heroContent) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition < 800) { // Only apply effect near the top
                heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
                heroContent.style.opacity = 1 - (scrollPosition / 700);
            }
        });
    }
    
    // Email validation function
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});
