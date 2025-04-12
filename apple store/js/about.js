document.addEventListener('DOMContentLoaded', function() {
    const shopNowButton = document.getElementById('shop-now');
    const loginForm = document.getElementById('login-form');
    const dynamicImages = document.querySelectorAll('.dynamic-image');
    const togglePasswordButton = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('login-message');

    shopNowButton.addEventListener('click', function() {
        alert('Redirecting to the shop...');
        // Here you can add logic to redirect to the shop page
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = passwordInput.value;

        if (username === "admin" && password === "password") {
            alert(`Logged in as ${username}`);
            loginMessage.textContent = '';
            // Implement further login logic here
        } else {
            loginMessage.textContent = 'Invalid username or password';
        }
    });

    togglePasswordButton.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePasswordButton.textContent = 'Hide';
        } else {
            passwordInput.type = 'password';
            togglePasswordButton.textContent = 'Show';
        }
    });

    dynamicImages.forEach(img => {
        img.addEventListener('click', function() {
            alert('Image clicked!');
            // Add dynamic behavior for images here
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const productButtons = document.querySelectorAll('.product-button');

    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('More information about this product will be available soon.');
            // Add logic to redirect to product details page if needed
        });
    });

});
document.addEventListener('DOMContentLoaded', function() {
    const productButtons = document.querySelectorAll('.product-button');
    const modal = document.getElementById('product-modal');
    const closeButton = document.querySelector('.close-button');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    const productDetails = {
        iPhone: {
            images: ['iphone1.jpg', 'iphone2.jpg', 'iphone3.jpg'],
            description: 'The iPhone is a line of smartphones designed and marketed by Apple Inc.'
        },
        iPad: {
            images: ['ipad1.jpg', 'ipad2.jpg', 'ipad3.jpg'],
            description: 'The iPad is a line of tablet computers designed, developed, and marketed by Apple Inc.'
        },
        Mac: {
            images: ['mac1.jpg', 'mac2.jpg', 'mac3.jpg'],
            description: 'The Mac is a family of personal computers designed, manufactured, and sold by Apple Inc.'
        }
    };

    let currentImageIndex = 0;

    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.previousElementSibling.textContent;
            const productInfo = productDetails[productName];

            currentImageIndex = 0;
            modalImage.src = productInfo.images[currentImageIndex];
            modalTitle.textContent = productName;
            modalDescription.textContent = productInfo.description;

            modal.style.display = 'block';
        });
    });

    prevButton.addEventListener('click', function() {
        const productName = modalTitle.textContent;
        const productInfo = productDetails[productName];
        currentImageIndex = (currentImageIndex - 1 + productInfo.images.length) % productInfo.images.length;
        modalImage.src = productInfo.images[currentImageIndex];
    });

    nextButton.addEventListener('click', function() {
        const productName = modalTitle.textContent;
        const productInfo = productDetails[productName];
        currentImageIndex = (currentImageIndex + 1) % productInfo.images.length;
        modalImage.src = productInfo.images[currentImageIndex];
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Responsive navigation menu
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Login functionality
    const togglePasswordButton = document.querySelector('.toggle-password');
    const passwordField = document.getElementById('password');
    const loginForm = document.querySelector('.login-form');
    
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
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = passwordField.value;
            const remember = document.getElementById('remember').checked;
            
            // Simple form validation
            if (!email || !password) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Advanced login validation
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            if (password.length < 8) {
                alert('Password must be at least 8 characters long');
                return;
            }
            
            // This would normally connect to a backend service
            console.log('Login attempt:', { email, password: '********', remember });
            
            // Show success message
            const loginCard = document.querySelector('.login-card');
            if (loginCard) {
                loginCard.innerHTML = `
                    <div class="login-success">
                        <span class="success-icon">✓</span>
                        <h2>Login Successful</h2>
                        <p>Welcome back, ${email.split('@')[0]}!</p>
                        <p>You are now signed in to your Apple account.</p>
                        <button class="continue-button">Continue to Account</button>
                    </div>
                `;
                
                // Add animation class
                loginCard.classList.add('login-success-animation');
                
                // Set up continue button
                const continueButton = loginCard.querySelector('.continue-button');
                if (continueButton) {
                    continueButton.addEventListener('click', function() {
                        window.location.href = 'home page.html';
                    });
                }
            }
        });
    }
    
    // Email validation function
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});

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
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
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
    
    // Add subtle animations to about page sections
    const animateOnScroll = function() {
        const sections = document.querySelectorAll('.history-section, .mission-section, .values-section');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        sections.forEach((section) => {
            observer.observe(section);
        });
    };
    
    animateOnScroll();
    
    // Email validation function
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});