document.addEventListener('DOMContentLoaded', function () {
    // Fix for mobile viewport height issues
    function setMobileViewportHeight() {
        // First we get the viewport height and multiply it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Set the height initially
    setMobileViewportHeight();

    // Reset on resize and orientation change
    window.addEventListener('resize', setMobileViewportHeight);
    window.addEventListener('orientationchange', setMobileViewportHeight);
    // Mobile menu functionality
    const navLinks = document.querySelectorAll('nav a');
    const navToggle = document.getElementById('nav-toggle');
    const navToggleLabel = document.querySelector('.nav-toggle-label');
    const body = document.body;

    // Function to toggle mobile menu
    function toggleMobileMenu() {
        if (navToggle.checked) {
            body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        } else {
            body.style.overflow = ''; // Restore scrolling when menu is closed
        }
    }

    // Toggle menu when hamburger is clicked
    navToggleLabel.addEventListener('click', function () {
        toggleMobileMenu();
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navToggle.checked = false;
            body.style.overflow = ''; // Restore scrolling
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideNav = event.target.closest('nav');
        if (!isClickInsideNav && navToggle.checked) {
            navToggle.checked = false;
            body.style.overflow = '';
        }
    });

    // Lazy load images
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        // You can implement a third-party lazy loading library here if needed
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href !== '#') {
                e.preventDefault();

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add visible class to achievement cards when they come into view
    if (window.IntersectionObserver) {
        const achievementCards = document.querySelectorAll('.achievement-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Set card index for staggered animations
        achievementCards.forEach((card, index) => {
            card.style.setProperty('--card-index', index);
            observer.observe(card);
        });
    }

    // Add smooth scroll behavior for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add touch effect for mobile devices
    const addTouchEffect = () => {
        const cards = document.querySelectorAll('.achievement-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.classList.add('touch-active');
            }, { passive: true });

            card.addEventListener('touchend', () => {
                card.classList.remove('touch-active');
            }, { passive: true });
        });
    };

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
});
