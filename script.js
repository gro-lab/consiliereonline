// Language switching
function setLanguage(lang) {
    document.body.classList.toggle('lang-ro', lang === 'ro');

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        const text = lang === 'ro' ? link.dataset.ro : link.dataset.en;
        if (text) link.textContent = text;
    });

    localStorage.setItem('language', lang);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const isExpanded = navMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
}

// Modal
const eventImages = ['./ev1.jpeg', './ev2.jpeg', './ev3.jpeg'];
const eventCaptions = [
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

function openModal(index) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('modalCaption');
    const lang = document.body.classList.contains('lang-ro') ? 'ro' : 'en';

    modal.style.display = 'block';
    modal.classList.add('show');
    modal.setAttribute('tabindex', '-1');
    modal.focus();

    modalImg.src = eventImages[index];
    modalImg.alt = `Imagine eveniment ${index + 1}`;
    caption.textContent = eventCaptions[index][lang];

    document.body.style.overflow = 'hidden';

    // trap focus inside modal
    modal.addEventListener('keydown', trapFocus);
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    modal.removeAttribute('tabindex');
    modal.removeEventListener('keydown', trapFocus);

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function trapFocus(e) {
    if (e.key === 'Tab') {
        e.preventDefault(); // trap focus inside modal
    }
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

// Carousel
let currentSlide = 0;
let autoPlayInterval;

function moveCarousel(dir) {
    const track = document.getElementById('carouselTrack');
    const slides = track.querySelectorAll('.carousel-slide');
    currentSlide = (currentSlide + dir + slides.length) % slides.length;
    track.style.transform = `translateX(${-currentSlide * 100}%)`;
    updateDots();
    stopAutoPlay();
    startAutoPlay();
}

function updateDots() {
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
        dot.setAttribute('aria-current', i === currentSlide ? 'true' : 'false');
    });
}

function goToSlide(i) {
    currentSlide = i;
    document.getElementById('carouselTrack').style.transform = `translateX(${-i * 100}%)`;
    updateDots();
    stopAutoPlay();
    startAutoPlay();
}

function createDots() {
    const dots = document.getElementById('carouselDots');
    const total = document.querySelectorAll('.carousel-slide').length;
    dots.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
        dot.onclick = () => goToSlide(i);
        dots.appendChild(dot);
    }
}

// Touch support
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) moveCarousel(diff > 0 ? 1 : -1);
}

function autoPlay() {
    moveCarousel(1);
}

function startAutoPlay() {
    stopAutoPlay();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        autoPlayInterval = setInterval(autoPlay, 5000);
    }
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
}

// Scroll nav + fade-ins
function handleScroll() {
    const scrollY = window.scrollY + 100;
    document.querySelectorAll('section').forEach(section => {
        const id = section.id;
        if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });

    document.querySelectorAll('.section-paragraph, .faq-item').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
            el.classList.add('fade-in');
        }
    });
}

// Smooth scroll
function smoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        document.getElementById('navMenu').classList.remove('active');
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.toLowerCase();
    setLanguage(savedLang || (browserLang.startsWith('ro') ? 'ro' : 'ro')); // default to ro

    document.querySelectorAll('.lang-btn').forEach(btn =>
        btn.addEventListener('click', e => {
            e.preventDefault();
            setLanguage(btn.dataset.lang);
        })
    );

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', smoothScroll);
        link.addEventListener('click', () => document.getElementById('navMenu').classList.remove('active'));
    });

    // Carousel
    if (document.getElementById('carouselTrack')) {
        createDots();
        document.getElementById('carouselTrack').addEventListener('touchstart', handleTouchStart, { passive: true });
        document.getElementById('carouselTrack').addEventListener('touchend', handleTouchEnd, { passive: true });
        startAutoPlay();

        const container = document.querySelector('.carousel-container');
        container?.addEventListener('mouseenter', stopAutoPlay);
        container?.addEventListener('mouseleave', startAutoPlay);

        document.addEventListener('keydown', e => {
            if (e.target.closest('.carousel-container')) {
                if (e.key === 'ArrowLeft') moveCarousel(-1);
                else if (e.key === 'ArrowRight') moveCarousel(1);
            }
        });
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(handleScroll, 50);
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
        document.hidden ? stopAutoPlay() : startAutoPlay();
    });

    window.addEventListener('beforeprint', stopAutoPlay);

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            console.warn('Image failed to load:', this.src);
            this.alt = 'Imagine indisponibilă';
        });
    });
});
