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
    
    // Get current language
    const isRomanian = document.body.classList.contains('lang-ro');
    captionText.textContent = isRomanian ? eventCaptions[imageIndex].ro : eventCaptions[imageIndex].en;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
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