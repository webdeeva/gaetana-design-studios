/**
 * GAETANA DESIGN STUDIOS - LUXURY WEBSITE JAVASCRIPT
 * Smooth animations, scroll effects, and premium interactions
 */

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Smooth scroll utility
const smoothScroll = (target, duration = 1000) => {
    const targetElement = $(target);
    if (!targetElement) return;

    const targetPosition = targetElement.offsetTop - 80; // Account for fixed nav
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    const easeInOutQuart = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    };

    requestAnimationFrame(animation);
};

// Navigation functionality
class Navigation {
    constructor() {
        this.nav = $('#nav');
        this.navToggle = $('#nav-toggle');
        this.navMenu = $('#nav-menu');
        this.navLinks = $$('.nav-link');
        this.lastScrollTop = 0;

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateActiveLink();
    }

    bindEvents() {
        // Mobile menu toggle
        this.navToggle?.addEventListener('click', () => this.toggleMobileMenu());

        // Smooth scroll for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Scroll effects
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    toggleMobileMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    handleNavClick(e) {
        const href = e.target.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            smoothScroll(href);
            this.closeMobileMenu();
        }

        // Update active link
        this.navLinks.forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add/remove scrolled class
        if (scrollTop > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        this.updateActiveLink();

        this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    updateActiveLink() {
        const sections = $$('section[id]');
        const scrollPos = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    handleOutsideClick(e) {
        if (!this.nav.contains(e.target) && this.navMenu.classList.contains('active')) {
            this.closeMobileMenu();
        }
    }

    closeMobileMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Hero section animations
class HeroAnimations {
    constructor() {
        this.heroPanels = $$('.hero-panel');
        this.heroContent = $('.hero-content');
        this.init();
    }

    init() {
        // Trigger hero animations after page load
        window.addEventListener('load', () => {
            setTimeout(() => this.animateHero(), 500);
        });

        // Parallax effect for hero panels
        window.addEventListener('scroll', debounce(() => this.handleParallax(), 16));

        // Add hover effect to panels
        this.heroPanels.forEach(panel => {
            panel.addEventListener('mouseenter', (e) => this.handlePanelHover(e, true));
            panel.addEventListener('mouseleave', (e) => this.handlePanelHover(e, false));
        });
    }

    animateHero() {
        // Panels are animated via CSS, just ensure hero content animates
        if (this.heroContent) {
            setTimeout(() => {
                this.heroContent.style.opacity = '1';
                this.heroContent.style.transform = 'translateY(0)';
            }, 800);
        }
    }

    handleParallax() {
        const scrolled = window.pageYOffset;

        this.heroPanels.forEach((panel, index) => {
            const panelBg = panel.querySelector('.panel-bg');
            if (panelBg) {
                // Create subtle parallax effect with different speeds for each row
                const row = Math.floor(index / 4);
                const speed = 0.2 + (row * 0.1);
                panelBg.style.transform = `translateY(${scrolled * speed}px) ${panelBg.style.transform?.includes('scaleX(-1)') ? 'scaleX(-1)' : ''}`;
            }
        });
    }

    handlePanelHover(e, isEntering) {
        const panel = e.currentTarget;
        const panelBg = panel.querySelector('.panel-bg');
        
        if (panelBg && isEntering) {
            // Subtle zoom on hover
            const currentTransform = panelBg.style.transform || '';
            panelBg.style.transform = currentTransform.includes('scaleX(-1)') 
                ? 'scale(1.05) scaleX(-1)' 
                : 'scale(1.05)';
        } else if (panelBg) {
            // Reset on leave
            const scrolled = window.pageYOffset;
            const index = Array.from(this.heroPanels).indexOf(panel);
            const row = Math.floor(index / 4);
            const speed = 0.2 + (row * 0.1);
            panelBg.style.transform = `translateY(${scrolled * speed}px) ${panelBg.style.transform?.includes('scaleX(-1)') ? 'scaleX(-1)' : ''}`;
        }
    }
}

// Scroll animations (AOS alternative)
class ScrollAnimations {
    constructor() {
        this.animatedElements = $$('[data-aos]');
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAnimations();
    }

    bindEvents() {
        window.addEventListener('scroll', debounce(() => this.checkAnimations(), 50));
        window.addEventListener('resize', debounce(() => this.checkAnimations(), 100));
    }

    checkAnimations() {
        this.animatedElements.forEach(element => {
            if (this.isElementInViewport(element)) {
                this.animateElement(element);
            }
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top <= windowHeight * 0.8 &&
            rect.bottom >= 0
        );
    }

    animateElement(element) {
        if (!element.classList.contains('aos-animate')) {
            const delay = element.getAttribute('data-aos-delay') || 0;
            
            setTimeout(() => {
                element.classList.add('aos-animate');
            }, parseInt(delay));
        }
    }
}

// Testimonials slider
class TestimonialsSlider {
    constructor() {
        this.slider = $('.testimonials-slider');
        this.items = $$('.testimonial-item');
        this.dots = $$('.dot');
        this.currentSlide = 0;
        this.autoPlayInterval = null;

        if (this.slider) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.startAutoPlay();
    }

    bindEvents() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause autoplay on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    goToSlide(index) {
        // Remove active classes
        this.items.forEach(item => item.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Add active classes
        this.items[index].classList.add('active');
        this.dots[index].classList.add('active');

        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.items.length;
        this.goToSlide(nextIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Form handling
class FormHandler {
    constructor() {
        this.form = $('.form');
        this.inputs = $$('.form-input, .form-select, .form-textarea');

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.setupInputAnimations();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.handleInputFocus(e));
            input.addEventListener('blur', (e) => this.handleInputBlur(e));
        });
    }

    setupInputAnimations() {
        this.inputs.forEach(input => {
            const parent = input.parentElement;
            
            // Create floating label effect
            if (input.placeholder && !parent.querySelector('.floating-label')) {
                const label = document.createElement('label');
                label.className = 'floating-label';
                label.textContent = input.placeholder;
                parent.appendChild(label);
                input.placeholder = '';
            }
        });
    }

    handleInputFocus(e) {
        const parent = e.target.parentElement;
        const label = parent.querySelector('.floating-label');
        
        if (label) {
            label.style.transform = 'translateY(-25px) scale(0.8)';
            label.style.color = 'var(--gold)';
        }
    }

    handleInputBlur(e) {
        const parent = e.target.parentElement;
        const label = parent.querySelector('.floating-label');
        
        if (label && !e.target.value) {
            label.style.transform = 'translateY(0) scale(1)';
            label.style.color = 'var(--gray-medium)';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('.btn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateFormSubmission();
            
            // Show success message
            this.showMessage('Thank you! We\'ll get back to you soon.', 'success');
            this.form.reset();
            
        } catch (error) {
            this.showMessage('Something went wrong. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    simulateFormSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = message;
        
        this.form.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

// Portfolio hover effects
class PortfolioEffects {
    constructor() {
        this.portfolioItems = $$('.portfolio-item');
        this.init();
    }

    init() {
        this.portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => this.handleMouseEnter(e));
            item.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        });
    }

    handleMouseEnter(e) {
        const item = e.currentTarget;
        const image = item.querySelector('.portfolio-image');
        
        // Add subtle animation
        if (image) {
            image.style.transform = 'scale(1.05) rotate(0.5deg)';
        }
    }

    handleMouseLeave(e) {
        const item = e.currentTarget;
        const image = item.querySelector('.portfolio-image');
        
        if (image) {
            image.style.transform = 'scale(1) rotate(0deg)';
        }
    }
}

// Performance optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.prefetchResources();
    }

    optimizeImages() {
        const images = $$('img');
        
        images.forEach(img => {
            // Add loading="lazy" for images below the fold
            if (!img.hasAttribute('loading')) {
                const rect = img.getBoundingClientRect();
                if (rect.top > window.innerHeight) {
                    img.setAttribute('loading', 'lazy');
                }
            }
        });
    }

    prefetchResources() {
        // Prefetch critical resources on user interaction
        const prefetchLinks = [
            'about.html'
        ];

        document.addEventListener('mouseover', () => {
            prefetchLinks.forEach(href => {
                if (!document.querySelector(`link[href="${href}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = href;
                    document.head.appendChild(link);
                }
            });
        }, { once: true });
    }
}

// Service animations
class ServiceAnimations {
    constructor() {
        this.serviceItems = $$('.service-item');
        this.init();
    }

    init() {
        this.serviceItems.forEach((item) => {
            item.addEventListener('mouseenter', () => this.animateServiceItem(item, true));
            item.addEventListener('mouseleave', () => this.animateServiceItem(item, false));
        });
    }

    animateServiceItem(item, isHover) {
        const icon = item.querySelector('.service-icon .icon');
        const iconBg = item.querySelector('.icon-bg');
        
        if (isHover) {
            if (icon) icon.style.transform = 'scale(1.1) rotate(5deg)';
            if (iconBg) iconBg.style.transform = 'scale(1.2)';
        } else {
            if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
            if (iconBg) iconBg.style.transform = 'scale(1)';
        }
    }
}

// Page transitions
class PageTransitions {
    constructor() {
        this.init();
    }

    init() {
        // Smooth page entrance animation
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });

        // Handle page exit animations for internal links
        $$('a[href*=".html"]').forEach(link => {
            link.addEventListener('click', (e) => this.handlePageTransition(e));
        });
    }

    handlePageTransition(e) {
        const href = e.target.getAttribute('href');
        
        if (href && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            
            document.body.style.opacity = '0';
            document.body.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    }
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new Navigation();
    new HeroAnimations();
    new ScrollAnimations();
    
    // Interactive components
    new TestimonialsSlider();
    new FormHandler();
    new PortfolioEffects();
    new ServiceAnimations();
    new GalleryModal();
    
    // Performance and UX
    new PerformanceOptimizer();
    new PageTransitions();
    
    // Add loaded class for CSS animations
    setTimeout(() => {
        document.body.classList.add('js-loaded');
    }, 100);
});

// Handle resize events
window.addEventListener('resize', debounce(() => {
    // Recalculate animations on resize
    const scrollAnimations = new ScrollAnimations();
    scrollAnimations.checkAnimations();
}, 250));

// Smooth scrolling for all internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        smoothScroll(target);
    }
});

// Gallery Modal Functionality
class GalleryModal {
    constructor() {
        this.modal = document.getElementById('modalGallery');
        this.galleryGrid = document.getElementById('galleryGrid');
        this.viewGalleryBtn = document.getElementById('viewGalleryBtn');
        this.closeBtn = document.querySelector('.close-modal');
        this.portfolioImages = [
            '2337981388151613118.jpeg',
            '266706937842883201.jpeg',
            '2811215451941797595.jpeg',
            '2899694803114838815.jpeg',
            '3107022993047447997.jpeg',
            '325573408684039423.jpeg',
            '3278730508646200448.jpeg',
            '4181673808618620394.jpeg',
            '4954269397816185614.jpeg',
            '5030609287847244234.jpeg',
            '561865407044652418.jpeg',
            '6288900141446811822.jpeg',
            '8385148339880567051.png',
            '8541652109047992981.jpeg',
            '8650548881317519188.jpeg',
            '8949876354079694741.jpeg',
            '9068023991299725090.jpeg'
        ];
        this.init();
    }

    init() {
        this.loadGalleryImages();
        this.bindEvents();
    }

    loadGalleryImages() {
        if (!this.galleryGrid) {
            console.error('Gallery grid not found');
            return;
        }
        
        // Use the correct path for images served from the web server
        const pathPrefix = './public/portfolio/';
        
        const galleryHTML = this.portfolioImages.map((image, index) => {
            return `
                <div class="gallery-item">
                    <img src="${pathPrefix}${image}" 
                         alt="Portfolio ${index + 1}" 
                         loading="lazy"
                         onerror="console.error('Failed to load image:', this.src); this.style.display='none';">
                </div>
            `;
        }).join('');
        
        this.galleryGrid.innerHTML = galleryHTML;
        console.log('Gallery loaded with', this.portfolioImages.length, 'images');
        
        // Debug: Test with first image to verify path works
        console.log('Testing first image path:', pathPrefix + this.portfolioImages[0]);
    }

    bindEvents() {
        // Open modal
        if (this.viewGalleryBtn) {
            this.viewGalleryBtn.addEventListener('click', () => this.openModal());
        }

        // Close modal
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Close on outside click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        if (this.modal) {
            this.loadGalleryImages(); // Reload images when opening
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Add custom cursor effect for luxury feel (optional)
class LuxuryCursor {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.init();
    }

    init() {
        // Only on desktop
        if (window.innerWidth > 1024) {
            this.createCursor();
            this.bindEvents();
        }
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'luxury-cursor';
        
        this.cursorFollower = document.createElement('div');
        this.cursorFollower.className = 'luxury-cursor-follower';
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                this.cursorFollower.style.left = e.clientX + 'px';
                this.cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });

        // Hover effects
        $$('a, button, .btn').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.cursorFollower.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.cursorFollower.classList.remove('hover');
            });
        });
    }
}

// Initialize luxury cursor
if (window.innerWidth > 1024) {
    document.addEventListener('DOMContentLoaded', () => {
        new LuxuryCursor();
    });
}