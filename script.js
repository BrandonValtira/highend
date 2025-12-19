// Calculate navigation line position
function updateNavLine() {
    const navContainer = document.querySelector('.nav-container');
    const navLogo = document.querySelector('.nav-logo');
    const navLinks = document.querySelector('.nav-links');
    
    if (navContainer && navLogo && navLinks) {
        const containerRect = navContainer.getBoundingClientRect();
        const logoRect = navLogo.getBoundingClientRect();
        const linksRect = navLinks.getBoundingClientRect();
        
        // Calculate left position (logo's left edge relative to container)
        const leftPos = logoRect.left - containerRect.left;
        
        // Calculate right position (nav-links' right edge relative to container)
        const rightPos = containerRect.right - linksRect.right;
        
        navContainer.style.setProperty('--line-left', `${leftPos}px`);
        navContainer.style.setProperty('--line-right', `${rightPos}px`);
    }
}


// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Update navigation line position
    updateNavLine();
    window.addEventListener('resize', updateNavLine);
    
    // Update after fonts and images load
    window.addEventListener('load', () => {
        setTimeout(updateNavLine, 100);
    });
    
    // Update after a short delay to ensure layout is complete
    setTimeout(updateNavLine, 200);
    
    // Position overlay shape at top of h1 and starting to the left of h1's end
    const positionOverlayShape = () => {
        const introHeading = document.querySelector('.intro-heading');
        const overlayShape = document.querySelector('.overlay-shape');
        if (introHeading && overlayShape) {
            const headingRect = introHeading.getBoundingClientRect();
            const topPosition = headingRect.top + window.scrollY;
            const leftPosition = headingRect.right - 200; // Start 200px to the left of h1's right edge
            overlayShape.style.setProperty('--shape-top', `${topPosition}px`);
            overlayShape.style.setProperty('--shape-left', `${leftPosition}px`);
            overlayShape.style.setProperty('--shape-right', 'auto');
        }
    };
    
    // Initial positioning
    positionOverlayShape();
    window.addEventListener('resize', positionOverlayShape);
    window.addEventListener('load', () => {
        setTimeout(positionOverlayShape, 100);
    });

    // Navigation scroll effect
    const nav = document.querySelector('.main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Smooth scroll for navigation links and update active state
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Update active state
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                const navHeight = nav.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPos = window.pageYOffset + nav.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { passive: true });

    // Observe all elements that need animation
    const elementsToObserve = document.querySelectorAll(
        '.section-label, .about-heading, .about-text, .project-card, .team-member, .contact-item'
    );

    elementsToObserve.forEach(el => {
        observer.observe(el);
    });

    // Removed duplicate services scroll content (no longer needed)

    // Main parallax shape and blue background
    const mainParallaxShape = document.querySelector('.main-parallax-shape');
    const blueBackground = document.querySelector('.blue-background');
    const aboutSection = document.querySelector('.about-section');
    const heroGreeting = document.querySelector('.hero-greeting');
    
    // Calculate headline bottom position for blue background offset
    const updateBlueBackgroundPosition = () => {
        if (heroGreeting && blueBackground) {
            const heroSection = document.querySelector('.hero-section');
            const heroContent = document.querySelector('.hero-content');
            const greetingRect = heroGreeting.getBoundingClientRect();
            const heroSectionRect = heroSection.getBoundingClientRect();
            const headlineBottom = greetingRect.bottom - heroSectionRect.top;
            blueBackground.style.setProperty('--hero-headline-bottom', `${headlineBottom}px`);
        }
    };
    
    // Initial calculation and on resize
    updateBlueBackgroundPosition();
    window.addEventListener('resize', updateBlueBackgroundPosition);
    
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Smooth scroll animation using requestAnimationFrame
    let ticking = false;
    let lastScrollY = 0;
    
    const smoothScrollUpdate = () => {
        const scrolled = window.pageYOffset;
        const scrollProgress = Math.min(scrolled / documentHeight, 1);
        const scrollRatio = scrolled / 200; // Slower: divided by 200 instead of 100
        
        // Main parallax shape movement
        if (mainParallaxShape) {
            const shapeY = scrolled * 0.3; // Parallax speed
            const shapeScale = 1 + (scrolled / 2000); // Slow scale up
            const shapeRotate = scrolled * 0.1; // Slow rotation
            mainParallaxShape.style.setProperty('--main-shape-y', `${shapeY}px`);
            mainParallaxShape.style.setProperty('--main-shape-scale', shapeScale);
            mainParallaxShape.style.setProperty('--main-shape-rotate', `${shapeRotate}deg`);
        }
        
        // Blue background movement - extends to end of about section
        if (blueBackground && aboutSection) {
            const heroHeight = document.querySelector('.hero-section').offsetHeight;
            const aboutTop = aboutSection.offsetTop;
            const aboutHeight = aboutSection.offsetHeight;
            const blueEnd = aboutTop + aboutHeight;
            
            // Calculate blue background height to extend to end of about section (reduced by 50%)
            const blueHeight = blueEnd * 0.5;
            blueBackground.style.height = `${blueHeight}px`;
            
            // Move background with parallax
            const blueY = scrolled * 0.15;
            blueBackground.style.setProperty('--blue-bg-y', `${blueY}px`);
            
            // Fade out background after about section
            const fadeStart = blueEnd - 200;
            if (scrolled > fadeStart) {
                const fadeProgress = Math.min((scrolled - fadeStart) / 200, 1);
                blueBackground.style.opacity = (1 - fadeProgress).toString();
            } else {
                blueBackground.style.opacity = '1';
            }
            
            // Animate shape - move down and to the right as user scrolls
            const blueBgShape = document.querySelector('.blue-bg-shape');
            if (blueBgShape) {
                const shapeY = scrolled * 0.4; // Move down
                const shapeX = scrolled * 0.3; // Move to the right
                blueBgShape.style.setProperty('--shape-y', `${shapeY}px`);
                blueBgShape.style.setProperty('--shape-x', `${shapeX}px`);
            }
        }
        
        // Overlay shape animation - move to the right only (exits screen to the right)
        const overlayShape = document.querySelector('.overlay-shape');
        const introHeading = document.querySelector('.intro-heading');
        if (overlayShape && introHeading) {
            const videoSection = document.querySelector('.video-section');
            if (videoSection) {
                const videoTop = videoSection.offsetTop;
                // Only animate until video section
                if (scrolled < videoTop) {
                    // Keep shape top aligned with h1 top
                    const headingRect = introHeading.getBoundingClientRect();
                    const topPosition = headingRect.top + scrolled;
                    const leftPosition = headingRect.right - 200; // Keep 200px to the left of h1's right edge
                    overlayShape.style.setProperty('--shape-top', `${topPosition}px`);
                    overlayShape.style.setProperty('--shape-left', `${leftPosition}px`);
                    overlayShape.style.setProperty('--shape-right', 'auto');
                    
                    // Move shape only to the right (no downward movement) - smooth easing
                    const shapeX = scrolled * 0.2; // Move to the right (half of 0.4)
                    overlayShape.style.setProperty('--shape-x', `${shapeX}px`);
                }
            }
        }
        
        // Removed abstract-bg scroll animations
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(smoothScrollUpdate);
            ticking = true;
        }
    }, { passive: true });

    // Stagger animations for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

});

// Fonts are loaded via link tag in HTML
