// Create a single large SVG background that covers the entire viewport
window.createFullPageSVG = function() {
    const svgBackground = document.getElementById('svgBackground');
    
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

  <!-- Hero Section Elements (0-100) -->
  <g stroke="#a2d2ff40" stroke-width="1" stroke-linecap="round" fill="none">
    <use href="#brain" transform="translate(15.5,25.3) scale(2.1)" />
    <use href="#brain" transform="translate(78.2,45.8) scale(1.8)" />
    <use href="#chat" transform="translate(35.7,15.9) scale(1.3)" />
    <use href="#chat" transform="translate(88.1,32.4) scale(1.1)" />
    <use href="#line" transform="translate(25.4,65.2) scale(2.2)" />
    <use href="#line" transform="translate(70.8,20.1) scale(1.8)" />
    <use href="#arc" transform="translate(12.3,78.9) scale(2.0)" />
    <use href="#arc" transform="translate(82.6,8.7) scale(1.5)" />
    <use href="#wave" transform="translate(45.2,88.3) scale(2.5)" />
    <use href="#wave" transform="translate(8.9,35.6) scale(1.4)" />
    <use href="#circle" transform="translate(92.4,58.7) scale(1.6)" />
    <use href="#circle" transform="translate(28.7,72.1) scale(1.2)" />
    <use href="#triangle" transform="translate(58.3,12.5) scale(1.7)" />
    <use href="#star" transform="translate(41.8,95.2) scale(2.0)" />
  </g>

  <!-- About Section Elements (100-200) -->
  <g stroke="#a2d2ff35" stroke-width="1" stroke-linecap="round" fill="none">
    <use href="#brain" transform="translate(22.1,125.7) scale(2.3)" />
    <use href="#brain" transform="translate(75.9,145.2) scale(1.9)" />
    <use href="#chat" transform="translate(48.6,135.8) scale(1.4)" />
    <use href="#chat" transform="translate(85.3,118.9) scale(1.0)" />
    <use href="#line" transform="translate(31.8,165.4) scale(2.1)" />
    <use href="#line" transform="translate(67.2,128.7) scale(1.6)" />
    <use href="#arc" transform="translate(18.5,178.1) scale(2.2)" />
    <use href="#arc" transform="translate(89.7,108.4) scale(1.7)" />
    <use href="#wave" transform="translate(52.4,188.6) scale(2.3)" />
    <use href="#wave" transform="translate(15.1,135.2) scale(1.5)" />
    <use href="#square" transform="translate(95.8,158.9) scale(1.8)" />
    <use href="#diamond" transform="translate(35.2,172.3) scale(1.3)" />
    <use href="#hexagon" transform="translate(71.6,112.8) scale(1.9)" />
    <use href="#spiral" transform="translate(28.9,195.7) scale(2.4)" />
  </g>

  <!-- Services Section Elements (200-300) -->
  <g stroke="#a2d2ff30" stroke-width="1" stroke-linecap="round" fill="none">
    <use href="#brain" transform="translate(38.4,225.1) scale(2.0)" />
    <use href="#brain" transform="translate(82.7,245.8) scale(1.7)" />
    <use href="#chat" transform="translate(55.2,235.4) scale(1.2)" />
    <use href="#chat" transform="translate(91.6,218.3) scale(1.1)" />
    <use href="#line" transform="translate(42.1,265.9) scale(2.3)" />
    <use href="#line" transform="translate(73.8,228.4) scale(1.9)" />
    <use href="#arc" transform="translate(24.7,278.2) scale(2.1)" />
    <use href="#arc" transform="translate(96.3,208.7) scale(1.6)" />
    <use href="#wave" transform="translate(58.9,288.1) scale(2.2)" />
    <use href="#wave" transform="translate(21.4,235.6) scale(1.3)" />
    <use href="#infinity" transform="translate(79.5,258.4) scale(1.8)" />
    <use href="#lightning" transform="translate(45.8,272.9) scale(2.1)" />
    <use href="#zigzag" transform="translate(12.3,295.3) scale(1.5)" />
    <use href="#curve" transform="translate(87.1,212.7) scale(1.4)" />
  </g>

  <!-- Gallery Section Elements (300-400) -->
  <g stroke="#a2d2ff25" stroke-width="1" stroke-linecap="round" fill="none">
    <use href="#brain" transform="translate(44.8,325.6) scale(2.2)" />
    <use href="#brain" transform="translate(78.1,345.3) scale(1.8)" />
    <use href="#chat" transform="translate(61.7,335.9) scale(1.3)" />
    <use href="#chat" transform="translate(88.2,318.8) scale(1.0)" />
    <use href="#line" transform="translate(48.4,365.2) scale(2.0)" />
    <use href="#line" transform="translate(80.3,328.1) scale(1.7)" />
    <use href="#arc" transform="translate(30.9,378.7) scale(2.3)" />
    <use href="#arc" transform="translate(92.6,308.2) scale(1.5)" />
    <use href="#wave" transform="translate(65.2,388.4) scale(2.4)" />
    <use href="#wave" transform="translate(27.8,335.1) scale(1.6)" />
    <use href="#star" transform="translate(85.7,358.6) scale(2.0)" />
    <use href="#hexagon" transform="translate(52.1,372.8) scale(1.9)" />
    <use href="#diamond" transform="translate(18.6,395.1) scale(1.4)" />
    <use href="#circle" transform="translate(93.4,312.5) scale(1.3)" />
  </g>

  <!-- Contact Section Elements (400-500) -->
  <g stroke="#a2d2ff20" stroke-width="1" stroke-linecap="round" fill="none">
    <use href="#brain" transform="translate(51.2,425.7) scale(2.1)" />
    <use href="#brain" transform="translate(74.5,445.2) scale(1.9)" />
    <use href="#chat" transform="translate(68.1,435.3) scale(1.4)" />
    <use href="#chat" transform="translate(84.8,418.6) scale(1.1)" />
    <use href="#line" transform="translate(54.7,465.8) scale(2.2)" />
    <use href="#line" transform="translate(86.9,428.3) scale(1.8)" />
    <use href="#arc" transform="translate(37.3,478.9) scale(2.0)" />
    <use href="#arc" transform="translate(89.1,408.4) scale(1.6)" />
    <use href="#wave" transform="translate(71.6,488.2) scale(2.3)" />
    <use href="#wave" transform="translate(34.2,435.7) scale(1.5)" />
    <use href="#infinity" transform="translate(91.8,458.1) scale(1.7)" />
    <use href="#spiral" transform="translate(58.4,472.6) scale(2.5)" />
    <use href="#lightning" transform="translate(25.1,495.4) scale(1.8)" />
    <use href="#curve" transform="translate(93.7,412.9) scale(1.2)" />
  </g>
</svg>
    `;
    
    svgBackground.innerHTML = svg;
};

// Initialize the background when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.createFullPageSVG();
});