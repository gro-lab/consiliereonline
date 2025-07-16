// Language switching
function setLanguage(lang) {
    document.body.className = lang === 'ro' ? 'lang-ro' : '';
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase() === lang);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        const text = lang === 'ro' ? link.dataset.ro : link.dataset.en;
        if (text) link.textContent = text;
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

// Carousel functionality
let currentSlide = 0;

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
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    const carouselTrack = document.getElementById('carouselTrack');
    const offset = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${offset}%)`;
    updateDots();
}

function createDots() {
    const dotsContainer = document.getElementById('carouselDots');
    const carouselTrack = document.getElementById('carouselTrack');
    const totalSlides = carouselTrack.querySelectorAll('.carousel-slide').length;

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }
}

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
    if (touchEndX < touchStartX - 50) {
        moveCarousel(1);
    }
    if (touchEndX > touchStartX + 50) {
        moveCarousel(-1);
    }
}

let autoPlayInterval;

function autoPlay() {
    moveCarousel(1);
}

function startAutoPlay() {
    autoPlayInterval = setInterval(autoPlay, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

function handleScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('.section-paragraph').forEach(p => {
        const rect = p.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && !p.classList.contains('fade-in')) {
            p.classList.add('fade-in');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Language toggle functionality
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            localStorage.setItem('language', lang);
        });
    });

    // Check for saved language preference
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        setLanguage(savedLang);
    } else if (navigator.language.startsWith('ro')) {
        setLanguage('ro');
    }

    // Only initialize carousel if it exists
    const carouselTrack = document.getElementById('carouselTrack');
    if (carouselTrack) {
        createDots();
        carouselTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
        carouselTrack.addEventListener('touchend', handleTouchEnd, { passive: true });
        startAutoPlay();

        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);

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

    window.addEventListener('scroll', handleScroll);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('navMenu').classList.remove('active');
        });
    });

    handleScroll();
});