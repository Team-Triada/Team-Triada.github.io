document.addEventListener('DOMContentLoaded', function () {
    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('nav a');
    const navToggle = document.getElementById('nav-toggle');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navToggle.checked = false;
        });
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

                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
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
});