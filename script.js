// ===== Configuration =====
const CONFIG = {
    particleCount: 12,
    particleDuration: 1500,
    messageDuration: 2000,
    clickCooldown: 600
};

// ===== State Management =====
let isAnimating = false;

// ===== DOM Elements =====
const heartWrapper = document.querySelector('.heart-wrapper');
const heart = document.querySelector('.heart');
const message = document.querySelector('.message');
const particlesContainer = document.querySelector('.particles-container');

// ===== Heart SVG Path (for particles) =====
const heartPath = 'M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z';

// ===== Create Particle Element =====
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 32 29.6');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', `particleGradient-${Date.now()}-${Math.random()}`);
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:#ff6b9d;stop-opacity:1');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', 'stop-color:#c23866;stop-opacity:1');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', heartPath);
    path.setAttribute('fill', `url(#${gradient.id})`);

    svg.appendChild(path);
    particle.appendChild(svg);

    return particle;
}

// ===== Animate Particles =====
function animateParticles() {
    const heartRect = heart.getBoundingClientRect();
    const centerX = heartRect.left + heartRect.width / 2;
    const centerY = heartRect.top + heartRect.height / 2;

    for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = createParticle();
        particlesContainer.appendChild(particle);

        // Position at heart center
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;

        // Calculate random direction
        const angle = (Math.PI * 2 * i) / CONFIG.particleCount + (Math.random() - 0.5) * 0.5;
        const distance = 200 + Math.random() * 300;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        // Set CSS variables for animation
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        // Animate
        particle.style.animation = `particleFloat ${CONFIG.particleDuration}ms ease-out forwards`;

        // Cleanup
        setTimeout(() => {
            particle.remove();
        }, CONFIG.particleDuration);
    }
}

// ===== Show Message =====
function showMessage() {
    message.classList.add('show');

    setTimeout(() => {
        message.classList.remove('show');
    }, CONFIG.messageDuration);
}

// ===== Create Ripple Effect =====
function createRipple() {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    document.body.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 2000); // Match animation duration
}

// ===== Handle Heart Click =====
function handleHeartClick() {
    if (isAnimating) return;

    isAnimating = true;

    // Add pulse animation class
    heartWrapper.classList.add('clicked');

    // Trigger effects
    animateParticles();
    createRipple();
    showMessage();

    // Remove animation class after animation completes
    setTimeout(() => {
        heartWrapper.classList.remove('clicked');
    }, CONFIG.clickCooldown);

    // Reset animation flag
    setTimeout(() => {
        isAnimating = false;
    }, CONFIG.clickCooldown);
}

// ===== Event Listeners =====
heartWrapper.addEventListener('click', handleHeartClick);

// Touch support for mobile
heartWrapper.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent double-tap zoom
    handleHeartClick();
}, { passive: false });

// ===== Keyboard Accessibility =====
heartWrapper.setAttribute('tabindex', '0');
heartWrapper.setAttribute('role', 'button');
heartWrapper.setAttribute('aria-label', 'Interactive heart - click to see animation');

heartWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleHeartClick();
    }
});

// ===== Console Easter Egg =====
console.log('%c❤️ Made with love', 'color: #ff6b9d; font-size: 20px; font-weight: bold;');
console.log('%cFor the one who means everything to me 💝', 'color: #c23866; font-size: 14px;');
