// Language switching
function setLanguage(lang) {
    // Update body class
    if (lang === 'ro') {
        document.body.classList.add('lang-ro');
    } else {
        document.body.classList.remove('lang-ro');
    }
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update navigation links text
    document.querySelectorAll('.nav-link').forEach(link => {
        const text = lang === 'ro' ? link.dataset.ro : link.dataset.en;
        if (text) link.textContent = text;
    });
    
    // Save language preference
    localStorage.setItem('language', lang);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
    
    // Toggle aria-expanded for accessibility
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const isExpanded = navMenu.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
}

// Modal functionality
const eventImages = [
    './ev1.jpeg',
    './ev2.jpeg', 
    './ev3.jpeg'
];

const eventCaptions = [
    {
        en: 'Recognition Workshop - June 25, 7:00 PM - 10:00 PM - 35 RON',
        ro: 'Atelier de Re-cunoaștere - 25 Iunie, 19:00 - 22:00 - 35 RON'
    },
    {
        en: 'Recognition Workshop: Specific Interests - July 26, 6:00 PM - 8:00 PM - 35 RON',
        ro: 'Atelier de Re-cunoaștere: Interese Specifice - 26 Iulie, 18:00 - 20:00 - 35 RON'
    },
    {
        en: 'Recognition Workshop: Communication and Its Nuances - July 10, 6:30 PM - 9:30 PM - 35 RON',
        ro: 'Atelier de Re-cunoaștere: Comunicarea și Nuanțele Ei - 10 Iulie, 18:30 - 21:30 - 35 RON'
    }
];

function openModal(imageIndex) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);
    
    modalImg.src = eventImages[imageIndex];
    modalImg.alt = `Imagine eveniment ${imageIndex + 1}`;
    
    // Get current language
    const isRomanian = document.body.classList.contains('lang-ro');
    captionText.textContent = isRomanian ? eventCaptions[imageIndex].ro : eventCaptions[imageIndex].en;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Set focus to modal for accessibility
    modal.focus();
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Carousel functionality
let currentSlide = 0;
let autoPlayInterval;

function moveCarousel(direction) {
    const carouselTrack = document.getElementById('carouselTrack');
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    currentSlide += direction;

    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }

    const offset = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${offset}%)`;
    updateDots();
    
    // Reset autoplay when user interacts
    stopAutoPlay();
    startAutoPlay();
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
        dot.setAttribute('aria-current', index === currentSlide ? 'true' : 'false');
    });
}

function goToSlide(slideIndex) {
    const carouselTrack = document.getElementById('carouselTrack');
    currentSlide = slideIndex;
    const offset = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${offset}%)`;
    updateDots();
    
    // Reset autoplay
    stopAutoPlay();
    startAutoPlay();
}

function createDots() {
    const dotsContainer = document.getElementById('carouselDots');
    const carouselTrack = document.getElementById('carouselTrack');
    const totalSlides = carouselTrack.querySelectorAll('.carousel-slide').length;

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Mergi la slide ${i + 1}`);
        dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }
}

// Touch support for carousel
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            moveCarousel(1);
        } else {
            // Swipe right - previous slide
            moveCarousel(-1);
        }
    }
}

// Autoplay functionality
function autoPlay() {
    moveCarousel(1);
}

function startAutoPlay() {
    // Clear any existing interval
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
    autoPlayInterval = setInterval(autoPlay, 5000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// Scroll handling for navigation highlighting and animations
function handleScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;

    // Update active navigation link
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Fade in paragraphs on scroll
    document.querySelectorAll('.section-paragraph, .faq-item').forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
            element.classList.add('fade-in');
        }
    });
}

// Smooth scroll for navigation links
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        document.getElementById('navMenu').classList.remove('active');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set initial language
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.toLowerCase();
    
    // Default to Romanian
    if (savedLang) {
        setLanguage(savedLang);
    } else if (browserLang.startsWith('ro')) {
        setLanguage('ro');
    } else {
        setLanguage('ro'); // Default to Romanian for SEO
    }
    
    // Language toggle event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Mobile menu close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('navMenu').classList.remove('active');
        });
    });
    
    // Initialize carousel if it exists
    const carouselTrack = document.getElementById('carouselTrack');
    if (carouselTrack) {
        createDots();
        
        // Touch events
        carouselTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
        carouselTrack.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Autoplay
        startAutoPlay();
        
        // Pause on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoPlay);
            carouselContainer.addEventListener('mouseleave', startAutoPlay);
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.carousel-container')) {
                if (e.key === 'ArrowLeft') {
                    moveCarousel(-1);
                } else if (e.key === 'ArrowRight') {
                    moveCarousel(1);
                }
            }
        });
    }
    
    // Scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial scroll check
    handleScroll();
    
    // Performance optimization: Throttle scroll events
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(handleScroll, 10);
    }, { passive: true });
    
    // Accessibility: Reduce motion if preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        // Disable autoplay and animations
        stopAutoPlay();
        document.documentElement.style.setProperty('--transition', 'none');
    }
    
    // Handle visibility change (pause animations when tab is not visible)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
    
    // Print styles
    window.addEventListener('beforeprint', () => {
        stopAutoPlay();
    });
    
    // Error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.error('Image failed to load:', this.src);
            this.alt = 'Imagine indisponibilă';
        });
    });
});