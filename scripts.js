// TRIADA - Modern JavaScript Interactions and Animations
// Neo-minimalist, Web3-inspired functionality

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initFormHandling();
    initSmoothScrolling();
    initParallaxEffects();
    initPerformanceOptimizations();
});

// Header functionality with scroll effects
function initHeader() {
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (!header) return;

        const currentScrollY = window.scrollY;

        // Add scrolled class for styling
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll (desktop / larger screens only)
        if (window.innerWidth > 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            // Always keep header visible on mobile to avoid cut-off
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.main-nav');
    const body = document.body;

    if (hamburger && nav) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            body.classList.toggle('menu-open');

            // Update aria-expanded
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);

            // Prevent body scroll when menu is open
            if (body.classList.contains('menu-open')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                body.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                body.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                body.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });
    }
}

// Scroll animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.card, .team-member, .achievement-card, .hero-content');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Form handling with modern UX
function initFormHandling() {
    const applicationForm = document.getElementById('application-form');

    if (applicationForm) {
        applicationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Validate form
            if (validateForm(data)) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>Submitting...';
                submitBtn.disabled = true;

                // Simulate form submission (replace with actual endpoint)
                setTimeout(() => {
                    showNotification('Application submitted successfully! We\'ll get back to you soon.', 'success');
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });

        // Real-time validation
        const inputs = applicationForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }
}

// Form validation
function validateForm(data) {
    const requiredFields = ['firstName', 'lastName', 'email', 'experience', 'motivation'];
    let isValid = true;

    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });

    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    if (field.hasAttribute('required') && !value) {
        showFieldError(fieldName, 'This field is required');
        return false;
    }

    if (fieldName === 'email' && value && !isValidEmail(value)) {
        showFieldError(fieldName, 'Please enter a valid email address');
        return false;
    }

    return true;
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.style.borderColor = 'var(--primary-red)';

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'var(--primary-red)';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
}

function clearFieldError(field) {
    field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-red)' : 'var(--black-light)'};
        color: var(--white);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: var(--z-tooltip);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax effects for hero sections
function initParallaxEffects() {
    const heroSections = document.querySelectorAll('.hero:not(.join-hero)');

    // Keep the join page hero clean and disable parallax on smaller screens
    if (window.innerWidth <= 768 || heroSections.length === 0) {
        return;
    }

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        heroSections.forEach(hero => {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Debounced scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Scroll-based animations here
        }, 10);
    });

    // Preload critical resources removed to prevent console warnings in local development
    // Resources will load normally through standard HTML tags
}

// Card hover effects
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card, .team-member, .achievement-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });


        // Call touch effect function
        addTouchEffect();

        // Count up animations for metrics
        const counterElements = document.querySelectorAll('.count-up');

        if (counterElements.length) {
            const animateCount = (element) => {
                const target = parseFloat(element.dataset.count);
                if (isNaN(target) || element.dataset.counted === 'true') return;

                const duration = parseInt(element.dataset.duration || '2000', 10);
                const decimals = parseInt(element.dataset.decimals || '0', 10);
                const startValue = parseFloat(element.dataset.start || '0');
                let startTime = null;

                const formatter = (value) => {
                    const fixed = value.toFixed(decimals);
                    return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                };

                const easeOut = (t) => 1 - Math.pow(1 - t, 3);

                const step = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const eased = easeOut(progress);
                    const value = startValue + (target - startValue) * eased;
                    element.textContent = formatter(value);

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        element.textContent = formatter(target);
                        element.dataset.counted = 'true';
                    }
                };

                requestAnimationFrame(step);
            };

            if (window.IntersectionObserver) {
                const counterObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateCount(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.4 });

                counterElements.forEach(el => counterObserver.observe(el));
            } else {
                counterElements.forEach(el => animateCount(el));
            }
        }

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

});

// Button ripple effect
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn')) {
        const button = e.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification {
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }
    
    .menu-open {
        overflow: hidden;
    }
    
    .nav.active {
        display: flex;
    }
    
    @media (max-width: 768px) {
        .nav {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.98);
            backdrop-filter: blur(20px);
            z-index: var(--z-modal);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2rem;
        }
        
        .nav.active {
            display: flex;
        }
        
        .nav-list {
            flex-direction: column;
            gap: 2rem;
        }
        
        .nav-link {
            font-size: 1.5rem;
            font-weight: 600;
        }
    }
`;
document.head.appendChild(style);

// Viewport height fix for mobile
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// Console branding
console.log(`
%cTRIADA
%cIndia's Top 1% Cybersecurity CTF Team
`,
    'color: #ff0033; font-size: 24px; font-weight: bold;',
    'color: #ffffff; font-size: 14px;'
);// Easter egg commands
window.TRIADA = {
    flag1: function () {
        console.log('%c🚩 FLAG 1 FOUND!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
        console.log('%cTRIADA{c0ns0l3_c0wboys_4r3_th3_b3st}', 'color: #ffff00; font-size: 14px; font-family: monospace; background: #000; padding: 5px;');
        return 'Congratulations! 1/3 flags captured.';
    },
    flag2: function () {
        console.log('%c🚩 FLAG 2 FOUND!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
        console.log('%cTRIADA{HTML_c0mm3nts_t3ll_s3cr3ts}', 'color: #ffff00; font-size: 14px; font-family: monospace; background: #000; padding: 5px;');
        return 'Excellent work! 2/3 flags captured.';
    },
    flag3: function () {
        console.log('%c🚩 FLAG 3 FOUND!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
        console.log('%cTRIADA{CSS_n1nj4s_h1d3_1n_st4l3s}', 'color: #ffff00; font-size: 14px; font-family: monospace; background: #000; padding: 5px;');
        return 'MASTER HACKER! All 3/3 flags captured!';
    }
};
console.log('%cTry: TRIADA.flag1(), TRIADA.flag2(), TRIADA.flag3()', 'color: #00ff00; font-family: monospace;');
