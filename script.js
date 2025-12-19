// Parallax Scrolling Implementation
document.addEventListener('DOMContentLoaded', () => {
    // Get all parallax elements
    const parallaxElements = document.querySelectorAll('[data-speed]');
    const parallaxBackgrounds = document.querySelectorAll('.parallax-background, .parallax-image, .parallax-layer-1, .parallax-layer-2, .parallax-layer-3');

    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Parallax scroll handler
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Handle elements with data-speed attribute
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed'));
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        // Handle background parallax elements
        parallaxBackgrounds.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
            const yPos = scrolled * speed;
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    // Use requestAnimationFrame for smooth performance
    let ticking = false;
    function updateParallax() {
        handleParallax();
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Throttled scroll event listener
    window.addEventListener('scroll', () => {
        requestTick();
    }, { passive: true });

    // Initial call
    handleParallax();

    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
});

