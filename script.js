// Enhanced JavaScript with Performance Optimizations and Cookie Consent

// Performance: Use strict mode
'use strict';

// Debounce function for scroll performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, wait) {
    let lastTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            func.apply(this, args);
        }
    };
}

// Cookie Consent Management System - GDPR Compliant
const CookieConsent = {
    banner: null,
    isShown: false,
    
    init() {
        this.banner = document.getElementById('cookieBanner');
        if (!this.banner) return;
        
        // Check if user has already made a choice
        if (!this.hasConsentDecision()) {
            this.showBanner();
        }
        
        this.setupEventListeners();
    },
    
    hasConsentDecision() {
        try {
            const consent = localStorage.getItem('cookieConsent');
            return consent === 'accepted' || consent === 'rejected';
        } catch (e) {
            return false;
        }
    },
    
    hasAccepted() {
        try {
            return localStorage.getItem('cookieConsent') === 'accepted';
        } catch (e) {
            return false;
        }
    },
    
    showBanner() {
        if (this.isShown || !this.banner) return;
        
        requestAnimationFrame(() => {
            this.banner.classList.add('show');
            this.isShown = true;
            
            // Trap focus in banner
            this.trapFocus();
        });
    },
    
    hideBanner() {
        if (!this.banner) return;
        
        this.banner.classList.remove('show');
        this.isShown = false;
        
        // Remove focus trap
        this.removeFocusTrap();
    },
    
    setupEventListeners() {
        const acceptBtn = document.getElementById('cookieAccept');
        const rejectBtn = document.getElementById('cookieReject');
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptCookies());
        }
        
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => this.rejectCookies());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isShown && e.key === 'Escape') {
                // Don't allow closing with escape - user must make a choice
                e.preventDefault();
            }
        });
    },
    
    acceptCookies() {
        try {
            localStorage.setItem('cookieConsent', 'accepted');
        } catch (e) {
            console.warn('Could not save cookie consent');
        }
        
        // Load analytics
        this.loadAnalytics();
        
        this.hideBanner();
        
        // Track the consent
        this.trackConsentGiven('accepted');
    },
    
    rejectCookies() {
        try {
            localStorage.setItem('cookieConsent', 'rejected');
        } catch (e) {
            console.warn('Could not save cookie consent');
        }
        
        this.hideBanner();
        
        // Track the consent (using essential tracking only)
        this.trackConsentGiven('rejected');
    },
    
    loadAnalytics() {
        // Only load if consent was given
        if (!this.hasAccepted()) return;
        
        // Load Google Analytics dynamically
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17401674061';
        document.head.appendChild(script);
        
        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17401674061', {
                anonymize_ip: true, // GDPR compliance
                cookie_flags: 'SameSite=None;Secure'
            });
            
            // Event snippet for Book appointment conversion page
            window.gtag_report_conversion = function(url) {
                var callback = function () {
                    if (typeof(url) != 'undefined') {
                        window.location = url;
                    }
                };
                gtag('event', 'conversion', {
                    'send_to': 'AW-17401674061/yl43CML9yf4aEM3y4elA',
                    'event_callback': callback
                });
                return false;
            }
            
            console.log('Google Analytics loaded with consent');
        };
    },
    
    trackConsentGiven(choice) {
        // Basic tracking without cookies (for essential analytics)
        if (navigator.sendBeacon) {
            const data = JSON.stringify({
                event: 'cookie_consent',
                choice: choice,
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            });
            
            // This would go to your own analytics endpoint
            // navigator.sendBeacon('/analytics/consent', data);
        }
    },
    
    trapFocus() {
        if (!this.banner) return;
        
        const focusableElements = this.banner.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        this.focusTrapHandler = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };
        
        document.addEventListener('keydown', this.focusTrapHandler);
        
        // Focus first button
        if (firstFocusable) {
            firstFocusable.focus();
        }
    },
    
    removeFocusTrap() {
        if (this.focusTrapHandler) {
            document.removeEventListener('keydown', this.focusTrapHandler);
            this.focusTrapHandler = null;
        }
    }
};

// Language Management System
const LanguageManager = {
    currentLang: 'ro',
    
    init() {
        // Check for saved language preference
        const savedLang = this.getSavedLanguage();
        const browserLang = navigator.language.toLowerCase();
        
        // Prioritize: saved preference > browser language > default (ro)
        if (savedLang && ['ro', 'en'].includes(savedLang)) {
            this.currentLang = savedLang;
        } else if (browserLang.startsWith('en')) {
            this.currentLang = 'en';
        }
        
        this.setLanguage(this.currentLang);
        this.setupLanguageButtons();
    },
    
    getSavedLanguage() {
        try {
            return localStorage.getItem('language');
        } catch (e) {
            return null;
        }
    },
    
    setLanguage(lang) {
        if (!['ro', 'en'].includes(lang)) return;
        
        this.currentLang = lang;
        
        // Batch DOM updates to prevent reflows
        requestAnimationFrame(() => {
            document.body.classList.toggle('lang-ro', lang === 'ro');
            document.documentElement.lang = lang;
            
            // Update language buttons
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
                btn.setAttribute('aria-pressed', btn.dataset.lang === lang);
            });
            
            // Update navigation links
            document.querySelectorAll('.nav-link').forEach(link => {
                const text = lang === 'ro' ? link.dataset.ro : link.dataset.en;
                if (text) link.textContent = text;
            });
        });
        
        // Save preference (this is functional, not tracking)
        try {
            localStorage.setItem('language', lang);
        } catch (e) {
            console.warn('localStorage not available');
        }
        
        // Update page meta for SEO
        this.updatePageMeta(lang);
        
        // Trigger custom event for language change
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    },
    
    setupLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setLanguage(btn.dataset.lang);
            });
        });
    },
    
    updatePageMeta(lang) {
        // Update document title based on language
        const titles = {
            ro: 'Consiliere Online România | Life Coach & Dezvoltare Personală | Răzvan Mischie',
            en: 'Online Counseling Romania | Life Coach & Personal Development | Răzvan Mischie'
        };
        document.title = titles[lang] || titles.ro;
        
        // Update meta description
        const descriptions = {
            ro: 'Consiliere online profesională pentru dezvoltare personală în România. Life coaching pentru echilibru emoțional, claritate în viață și creștere personală.',
            en: 'Professional online counseling for personal development in Romania. Life coaching for emotional balance, life clarity and personal growth.'
        };
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = descriptions[lang] || descriptions.ro;
        }
    }
};

// Mobile Menu Management
const MobileMenu = {
    isOpen: false,
    menu: null,
    toggle: null,
    
    init() {
        this.menu = document.getElementById('navMenu');
        this.toggle = document.querySelector('.mobile-menu-toggle');
        
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
            
            // Keyboard support
            this.toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMenu();
                }
            });
        }
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.nav-container')) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
                this.toggle.focus();
            }
        });
    },
    
    toggleMenu() {
        this.isOpen = !this.isOpen;
        
        // Batch DOM updates
        requestAnimationFrame(() => {
            this.menu.classList.toggle('active', this.isOpen);
            this.toggle.setAttribute('aria-expanded', this.isOpen);
            this.animateHamburger(this.isOpen);
        });
    },
    
    closeMenu() {
        this.isOpen = false;
        
        requestAnimationFrame(() => {
            this.menu.classList.remove('active');
            this.toggle.setAttribute('aria-expanded', 'false');
            this.animateHamburger(false);
        });
    },
    
    animateHamburger(isOpen) {
        const spans = this.toggle.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    }
};

// Enhanced Carousel with Touch Support and Performance Optimizations
class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.track = null;
        this.slides = [];
        this.dots = [];
        this.isTransitioning = false;
        
        // Cache for performance
        this.slideWidth = 0;
        this.trackWidth = 0;
        
        // Event configuration
        this.eventImages = ['./ev1.jpg', './ev2.jpg', './ev3.jpg'];
        this.eventCaptions = [
            {
                ro: 'Atelier de Re-cunoaștere - 25 Iunie, 19:00 - 22:00 - 35 RON',
                en: 'Recognition Workshop - June 25, 7:00 PM - 10:00 PM - 35 RON'
            },
            {
                ro: 'Atelier: Interese Specifice - 26 Iulie, 18:00 - 20:00 - 35 RON',
                en: 'Workshop: Specific Interests - July 26, 6:00 PM - 8:00 PM - 35 RON'
            },
            {
                ro: 'Comunicarea și Nuanțele Ei - 10 Iulie, 18:30 - 21:30 - 35 RON',
                en: 'Communication & Its Nuances - July 10, 6:30 PM - 9:30 PM - 35 RON'
            }
        ];
    }
    
    init() {
        this.track = document.getElementById('carouselTrack');
        if (!this.track) return;
        
        this.slides = Array.from(this.track.querySelectorAll('.carousel-slide'));
        this.cacheElementDimensions();
        this.createDots();
        this.setupEventListeners();
        this.preloadImages();
        
        // Start autoplay if motion is allowed
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.startAutoPlay();
        }
    }
    
    cacheElementDimensions() {
        // Cache dimensions to avoid repeated reflows
        if (this.slides.length > 0) {
            const firstSlide = this.slides[0];
            this.slideWidth = firstSlide.offsetWidth;
            this.trackWidth = this.slideWidth * this.slides.length;
        }
    }
    
    setupEventListeners() {
        // Touch events
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Mouse events for desktop swipe
        let mouseDown = false;
        this.track.addEventListener('mousedown', (e) => {
            mouseDown = true;
            this.touchStartX = e.clientX;
        });
        
        this.track.addEventListener('mouseup', (e) => {
            if (mouseDown) {
                this.touchEndX = e.clientX;
                this.handleSwipe();
            }
            mouseDown = false;
        });
        
        this.track.addEventListener('mouseleave', () => {
            mouseDown = false;
        });
        
        // Navigation buttons
        const prevBtn = document.querySelector('.carousel-nav.prev');
        const nextBtn = document.querySelector('.carousel-nav.next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.move(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.move(1));
        
        // Keyboard navigation
        const container = document.querySelector('.carousel-container');
        if (container) {
            container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.move(-1);
                else if (e.key === 'ArrowRight') this.move(1);
            });
            
            // Pause on hover
            container.addEventListener('mouseenter', () => this.stopAutoPlay());
            container.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Pause when page is not visible
        document.addEventListener('visibilitychange', () => {
            document.hidden ? this.stopAutoPlay() : this.startAutoPlay();
        });
    }
    
    preloadImages() {
        // Preload next image for smoother transitions
        this.eventImages.forEach((src, index) => {
            if (index > 0) { // Skip first image as it's already loaded
                const img = new Image();
                img.src = src;
            }
        });
    }
    
    createDots() {
        const dotsContainer = document.getElementById('carouselDots');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        this.dots = [];
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Mergi la slide ${index + 1}`);
            dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            this.move(diff > 0 ? 1 : -1);
        }
    }
    
    move(direction) {
        if (this.isTransitioning) return;
        
        this.currentSlide = (this.currentSlide + direction + this.slides.length) % this.slides.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.currentSlide = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    updateCarousel() {
        this.isTransitioning = true;
        
        // Use requestAnimationFrame for smooth animations
        requestAnimationFrame(() => {
            // Update track position
            this.track.style.transform = `translateX(${-this.currentSlide * 100}%)`;
            
            // Update dots
            this.dots.forEach((dot, index) => {
                const isActive = index === this.currentSlide;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        });
        
        // Reset transition flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
        
        // Announce to screen readers
        this.announceSlide();
    }
    
    announceSlide() {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Slide ${this.currentSlide + 1} din ${this.slides.length}`;
        announcement.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.move(1);
        }, 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Modal Management
const Modal = {
    modal: null,
    modalImg: null,
    modalCaption: null,
    isOpen: false,
    
    init() {
        this.modal = document.getElementById('imageModal');
        this.modalImg = document.getElementById('modalImage');
        this.modalCaption = document.getElementById('modalCaption');
        
        if (!this.modal) return;
        
        // Close on click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('modal-close')) {
                this.close();
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },
    
    open(index) {
        if (!this.modal || !carousel) return;
        
        const lang = LanguageManager.currentLang;
        
        // Batch DOM updates
        requestAnimationFrame(() => {
            this.modal.style.display = 'block';
            
            // Force reflow only once
            this.modal.offsetHeight;
            
            this.modal.classList.add('show');
            this.modalImg.src = carousel.eventImages[index];
            this.modalImg.alt = `Imagine eveniment ${index + 1}`;
            this.modalCaption.textContent = carousel.eventCaptions[index][lang];
            
            document.body.style.overflow = 'hidden';
            this.isOpen = true;
            
            // Focus management
            this.modal.setAttribute('tabindex', '-1');
            this.modal.focus();
            
            // Trap focus
            this.trapFocus();
        });
    },
    
    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('show');
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
            this.isOpen = false;
            
            // Return focus to trigger element
            const triggerElement = document.querySelector('.carousel-slide.active');
            if (triggerElement) triggerElement.focus();
        }, 300);
    },
    
    trapFocus() {
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };
        
        this.modal.addEventListener('keydown', handleTabKey);
    }
};

// Optimized Smooth Scroll with Navigation Update
const Navigation = {
    sections: [],
    navLinks: [],
    sectionData: [],
    
    init() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // Cache section data to prevent reflows during scroll
        this.cacheSectionData();
        
        // Smooth scroll
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScroll(e));
        });
        
        // Throttled scroll spy to prevent performance issues
        window.addEventListener('scroll', throttle(() => this.updateActiveSection(), 100), { passive: true });
        
        // Recalculate on resize
        window.addEventListener('resize', debounce(() => this.cacheSectionData(), 250));
        
        // Initial check
        this.updateActiveSection();
    },
    
    cacheSectionData() {
        // Batch read all section positions to avoid reflows
        this.sectionData = Array.from(this.sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop,
            bottom: section.offsetTop + section.offsetHeight
        }));
    },
    
    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offset = 80; // Account for fixed header
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            MobileMenu.closeMenu();
            
            // Update URL without triggering scroll
            history.pushState(null, null, `#${targetId}`);
        }
    },
    
    updateActiveSection() {
        const scrollPosition = window.scrollY + 100;
        
        // Use cached data to avoid reflows
        for (const sectionData of this.sectionData) {
            if (scrollPosition >= sectionData.top && scrollPosition < sectionData.bottom) {
                // Batch DOM updates
                requestAnimationFrame(() => {
                    this.navLinks.forEach(link => {
                        const isActive = link.getAttribute('href') === `#${sectionData.id}`;
                        link.classList.toggle('active', isActive);
                        link.setAttribute('aria-current', isActive ? 'page' : 'false');
                    });
                });
                break;
            }
        }
    }
};

// Intersection Observer for fade-in animations
const AnimationObserver = {
    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe elements
        const elements = document.querySelectorAll('.section-paragraph, .faq-item, .service-card, .stat-item');
        elements.forEach(el => observer.observe(el));
    }
};

// Form Handler
const FormHandler = {
    init() {
        const form = document.querySelector('.contact-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(form);
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    },
    
    handleSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!this.validateForm(form)) return;
        
        // Show loading state
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Se trimite...';
        button.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Success message
            this.showMessage('Mulțumim! Vă vom contacta în curând.', 'success');
            form.reset();
            
            // Reset button
            button.textContent = originalText;
            button.disabled = false;
            
            // Track conversion only if analytics is loaded
            if (typeof gtag !== 'undefined' && CookieConsent.hasAccepted()) {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': 'Consultation Request'
                });
            }
        }, 1500);
    },
    
    validateForm(form) {
        const inputs = form.querySelectorAll('[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Remove previous error
        field.classList.remove('error');
        
        // Required field
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Acest câmp este obligatoriu');
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Introduceți o adresă de email validă');
            isValid = false;
        }
        
        // Phone validation (Romanian format)
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            this.showFieldError(field, 'Introduceți un număr de telefon valid');
            isValid = false;
        }
        
        return isValid;
    },
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    isValidPhone(phone) {
        // Romanian phone number format
        return /^(\+4|)?(07[0-8]{1}[0-9]{7}|02[0-9]{8}|03[0-9]{8})$/.test(phone.replace(/\s/g, ''));
    },
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Create or update error message
        let errorEl = field.nextElementSibling;
        if (!errorEl || !errorEl.classList.contains('field-error')) {
            errorEl = document.createElement('span');
            errorEl.className = 'field-error';
            field.parentNode.insertBefore(errorEl, field.nextSibling);
        }
        errorEl.textContent = message;
    },
    
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        messageEl.setAttribute('role', 'alert');
        
        const form = document.querySelector('.contact-form');
        if (form) {
            form.parentNode.insertBefore(messageEl, form);
            
            // Remove after 5 seconds
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 5000);
        }
    }
};

// Performance Monitor
const PerformanceMonitor = {
    init() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry);
                    }
                }
            });
            
            try {
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // longtask not supported
            }
        }
    }
};

// Global carousel instance
let carousel;

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cookie consent first
    CookieConsent.init();
    
    // Initialize other modules
    LanguageManager.init();
    MobileMenu.init();
    Navigation.init();
    Modal.init();
    AnimationObserver.init();
    FormHandler.init();
    PerformanceMonitor.init();
    
    // Initialize carousel
    carousel = new Carousel();
    carousel.init();
    
    // Load analytics if consent was already given
    if (CookieConsent.hasAccepted()) {
        CookieConsent.loadAnalytics();
    }
    
    // Make functions globally available for onclick handlers
    window.openModal = (index) => Modal.open(index);
    window.closeModal = () => Modal.close();
    window.moveCarousel = (dir) => carousel.move(dir);
    window.setLanguage = (lang) => LanguageManager.setLanguage(lang);
    window.toggleMobileMenu = () => MobileMenu.toggleMenu();
});

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(function(registration) {
            console.log('ServiceWorker registration successful with scope:', registration.scope);
        })
        .catch(function(error) {
            console.log('ServiceWorker registration failed!', error);
        });
    });
}