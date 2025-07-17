// Create a single large SVG background with continuously moving elements
window.createFullPageSVG = function() {
    const svgBackground = document.getElementById('svgBackground');
    
    // Helper function to get a random value between min and max
    const random = (min, max) => Math.random() * (max - min) + min;
    
    // Helper function to get a random animation duration
    const randomDuration = () => `${random(15, 35)}s`;
    
    // Helper function to get a random animation delay
    const randomDelay = () => `${random(0, 10)}s`;
    
    // Helper function to get element-specific class
    const getElementClass = (id) => {
        const classMap = {
            '#brain': 'svg-brain',
            '#chat': 'svg-chat',
            '#circle': 'svg-circle',
            '#square': 'svg-square',
            '#triangle': 'svg-triangle',
            '#star': 'svg-star',
            '#hexagon': 'svg-hexagon',
            '#diamond': 'svg-diamond',
            '#line': 'svg-line',
            '#arc': 'svg-arc',
            '#wave': 'svg-wave',
            '#spiral': 'svg-spiral',
            '#zigzag': 'svg-zigzag',
            '#curve': 'svg-curve',
            '#infinity': 'svg-infinity',
            '#lightning': 'svg-lightning'
        };
        return classMap[id] || 'svg-element';
    };
    
    // Create animated elements with bounded positions
    const createAnimatedElement = (href, baseX, baseY, scale, sectionY = 0) => {
        const elementClass = getElementClass(href);
        
        // Keep elements within viewport bounds (10-90% range)
        const x = Math.max(10, Math.min(90, baseX));
        const y = Math.max(sectionY + 10, Math.min(sectionY + 90, baseY));
        
        // Random variations for more organic feel
        const scaleVariation = random(0.8, 1.2);
        const finalScale = scale * scaleVariation;
        
        // Create unique animation timing for each element
        const duration1 = randomDuration();
        const duration2 = randomDuration();
        const duration3 = randomDuration();
        const delay = randomDelay();
        
        return `<g class="svg-element ${elementClass}" 
                   style="--duration1: ${duration1}; --duration2: ${duration2}; --duration3: ${duration3}; --delay: ${delay};">
                   <use href="${href}" 
                        transform="translate(${x},${y}) scale(${finalScale})" />
                </g>`;
    };
    
    // Generate more elements for denser, livelier background
    const generateSectionElements = (sectionY, opacity, elementCount = 30) => {
        const elements = ['#brain', '#chat', '#circle', '#square', '#triangle', '#star', 
                         '#hexagon', '#diamond', '#line', '#arc', '#wave', '#spiral', 
                         '#zigzag', '#curve', '#infinity', '#lightning'];
        
        let elementsHTML = '';
        
        for (let i = 0; i < elementCount; i++) {
            const element = elements[Math.floor(random(0, elements.length))];
            const x = random(10, 90);
            const y = random(sectionY + 10, sectionY + 90);
            const scale = random(0.5, 2.5);
            
            elementsHTML += createAnimatedElement(element, x, y, scale, sectionY);
        }
        
        return `<g stroke="#a2d2ff${opacity}" stroke-width="1" stroke-linecap="round" fill="none">
                    ${elementsHTML}
                </g>`;
    };
    
    const svg = `
<svg width="100%" height="100%" viewBox="0 0 100 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="arc" d="M0,0 A10,10 0 0 1 10,10" />
    <path id="wave" d="M0,0 Q2,2 4,0 T8,0" />
    <path id="brain" d="M1,2 C0.5,1 0.5,3 1,2 C1.5,1 1.5,3 1,2 Z" />
    <path id="chat" d="M0,0 C1,0 1,1 0,1 L0,2 L-0.5,1 L0,0 Z" />
    <path id="spiral" d="M0,0 A2,2 0 0 1 4,0 A4,4 0 0 1 0,8 A6,6 0 0 1 -8,0" />
    <path id="zigzag" d="M0,0 L2,2 L4,0 L6,2 L8,0" />
    <path id="curve" d="M0,0 C2,2 4,0 6,2 C8,0 10,2 12,0" />
    <path id="diamond" d="M0,0 L2,2 L4,0 L2,-2 Z" />
    <path id="star" d="M0,-3 L1,-1 L3,-1 L1,0 L2,2 L0,1 L-2,2 L-1,0 L-3,-1 L-1,-1 Z" />
    <path id="hexagon" d="M0,-2 L2,-1 L2,1 L0,2 L-2,1 L-2,-1 Z" />
    <path id="infinity" d="M-4,0 C-4,-2 -2,-2 0,0 C2,2 4,2 4,0 C4,-2 2,-2 0,0 C-2,2 -4,2 -4,0" />
    <path id="lightning" d="M0,0 L2,0 L1,2 L3,2 L0,5 L1,3 L-1,3 Z" />
    <circle id="circle" cx="0" cy="0" r="2" />
    <rect id="square" x="-2" y="-2" width="4" height="4" />
    <polygon id="triangle" points="0,-2 2,2 -2,2" />
    <line id="line" x1="-3" y1="0" x2="3" y2="0" />
  </defs>

  <!-- Create style tag for CSS custom properties -->
  <style>
    .svg-element {
      animation-play-state: running;
    }
    .svg-element use {
      animation: inherit;
    }
  </style>

  <!-- Hero Section Elements (0-100) -->
  ${generateSectionElements(0, '40', 35)}
  
  <!-- About Section Elements (100-200) -->
  ${generateSectionElements(100, '35', 30)}
  
  <!-- Services Section Elements (200-300) -->
  ${generateSectionElements(200, '30', 30)}
  
  <!-- Gallery Section Elements (300-400) -->
  ${generateSectionElements(300, '25', 30)}
  
  <!-- Contact Section Elements (400-500) -->
  ${generateSectionElements(400, '20', 30)}
</svg>
    `;
    
    svgBackground.innerHTML = svg;
    
    // Optional: Add subtle parallax effect on scroll (not mouse move to avoid interference)
    let ticking = false;
    function updateParallax() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const groups = svgBackground.querySelectorAll('g[stroke]');
                
                groups.forEach((group, index) => {
                    const speed = 0.5 + (index * 0.1);
                    const yPos = -(scrolled * speed * 0.1); // Reduced parallax effect
                    group.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Add scroll listener for subtle parallax
    window.addEventListener('scroll', updateParallax, { passive: true });
    
    // Ensure elements keep moving even when tab is inactive
    document.addEventListener('visibilitychange', () => {
        const elements = svgBackground.querySelectorAll('.svg-element');
        if (document.hidden) {
            elements.forEach(el => el.style.animationPlayState = 'paused');
        } else {
            elements.forEach(el => el.style.animationPlayState = 'running');
        }
    });
};

// Initialize the background when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.createFullPageSVG();
    
    // Performance optimization: Use CSS animations instead of JavaScript
    // The continuous wandering movements are handled entirely by CSS keyframes
    // This ensures smooth 60fps animations without JavaScript overhead
    
    // Optional: Add intersection observer for performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const elements = entry.target.querySelectorAll('.svg-element use');
                if (entry.isIntersecting) {
                    elements.forEach(el => el.style.animationPlayState = 'running');
                } else {
                    elements.forEach(el => el.style.animationPlayState = 'paused');
                }
            });
        });
        
        const sections = document.querySelectorAll('section');
        sections.forEach(section => observer.observe(section));
    }
});