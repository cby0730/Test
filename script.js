// ===== Configuration =====
const CONFIG = {
    // Stage 0: Scattered small hearts
    smallHeartCount: 12,
    smallHeartSize: 40, // px

    // Stage 1: Gathering animation
    gatherDuration: 1000, // 1 second

    // Stage 2: Explosion
    particleCount: 12,
    particleDuration: 1500,
    messageDuration: 2000,
    clickCooldown: 600,

    // Hints
    hints: {
        stage0: '點擊匯聚愛心 ❤️',
        stage1: '再點一次看魔法 ✨',
        stage2: '點擊重新開始 🔄'
    }
};

// ===== State Management =====
let currentStage = 0; // 0: scattered, 1: gathered, 2: exploded
let isAnimating = false;
let smallHearts = [];

// ===== DOM Elements =====
const container = document.querySelector('.container');
const heartWrapper = document.querySelector('.heart-wrapper');
const heart = document.querySelector('.heart');
const message = document.querySelector('.message');
const particlesContainer = document.querySelector('.particles-container');
const smallHeartsContainer = document.querySelector('.small-hearts-container');
const hintElement = document.querySelector('.hint');

// ===== Heart SVG Path =====
const heartPath = 'M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z';

// ===== Create Small Heart Element =====
function createSmallHeart() {
    const heartDiv = document.createElement('div');
    heartDiv.className = 'small-heart';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 32 29.6');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', `smallHeartGradient-${Date.now()}-${Math.random()}`);
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
    heartDiv.appendChild(svg);

    return heartDiv;
}

// ===== Initialize Small Hearts (Stage 0) =====
function initializeSmallHearts() {
    smallHeartsContainer.innerHTML = '';
    smallHearts = [];

    const padding = 80; // Padding from edges
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    for (let i = 0; i < CONFIG.smallHeartCount; i++) {
        const smallHeart = createSmallHeart();

        // Random position (avoid edges)
        const x = padding + Math.random() * (viewportWidth - padding * 2);
        const y = padding + Math.random() * (viewportHeight - padding * 2);

        smallHeart.style.left = `${x}px`;
        smallHeart.style.top = `${y}px`;

        // Store initial position for gathering animation
        smallHeart.dataset.initialX = x;
        smallHeart.dataset.initialY = y;

        smallHeartsContainer.appendChild(smallHeart);
        smallHearts.push(smallHeart);
    }
}

// ===== Gather Hearts to Center (Stage 0 → Stage 1) =====
function gatherHearts() {
    if (isAnimating) return;
    isAnimating = true;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    smallHearts.forEach((smallHeart, index) => {
        const rect = smallHeart.getBoundingClientRect();
        const currentX = rect.left + rect.width / 2;
        const currentY = rect.top + rect.height / 2;

        const deltaX = centerX - currentX;
        const deltaY = centerY - currentY;

        smallHeart.style.setProperty('--gather-x', `${deltaX}px`);
        smallHeart.style.setProperty('--gather-y', `${deltaY}px`);

        smallHeart.classList.add('gathering');

        // Start animation with slight delay for wave effect
        setTimeout(() => {
            smallHeart.style.animation = `gatherToCenter ${CONFIG.gatherDuration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`;
        }, index * 30);
    });

    // After gathering completes, show big heart
    setTimeout(() => {
        currentStage = 1;
        updateStage();
        isAnimating = false;
    }, CONFIG.gatherDuration + CONFIG.smallHeartCount * 30);
}

// ===== Create Particle Element (for explosion) =====
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

// ===== Animate Particles (explosion) =====
function animateParticles() {
    const heartRect = heart.getBoundingClientRect();
    const centerX = heartRect.left + heartRect.width / 2;
    const centerY = heartRect.top + heartRect.height / 2;

    for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = createParticle();
        particlesContainer.appendChild(particle);

        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;

        const angle = (Math.PI * 2 * i) / CONFIG.particleCount + (Math.random() - 0.5) * 0.5;
        const distance = 200 + Math.random() * 300;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        particle.style.animation = `particleFloat ${CONFIG.particleDuration}ms ease-out forwards`;

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

    setTimeout(() => {
        ripple.remove();
    }, 2000);
}

// ===== Explode Hearts (Stage 1 → Stage 2) =====
function explodeHearts() {
    if (isAnimating) return;
    isAnimating = true;

    heartWrapper.classList.add('clicked');

    animateParticles();
    createRipple();
    showMessage();

    setTimeout(() => {
        heartWrapper.classList.remove('clicked');
    }, CONFIG.clickCooldown);

    setTimeout(() => {
        currentStage = 2;
        updateStage();
        isAnimating = false;
    }, CONFIG.clickCooldown);
}

// ===== Reset to Stage 0 =====
function resetToScattered() {
    if (isAnimating) return;
    isAnimating = true;

    // Fade out big heart
    heartWrapper.style.transition = 'opacity 0.4s, transform 0.4s';
    heartWrapper.style.opacity = '0';
    heartWrapper.style.transform = 'scale(0.5)';

    setTimeout(() => {
        currentStage = 0;
        updateStage();
        initializeSmallHearts();

        // Reset big heart style
        heartWrapper.style.opacity = '';
        heartWrapper.style.transform = '';

        isAnimating = false;
    }, 400);
}

// ===== Update Stage (UI and hints) =====
function updateStage() {
    // Update container class
    container.className = 'container';
    container.classList.add(`stage-${currentStage}`);

    // Update hint text
    let hintText = '';
    switch (currentStage) {
        case 0:
            hintText = CONFIG.hints.stage0;
            break;
        case 1:
            hintText = CONFIG.hints.stage1;
            break;
        case 2:
            hintText = CONFIG.hints.stage2;
            break;
    }

    // Fade out, change text, fade in
    hintElement.classList.remove('show');
    setTimeout(() => {
        hintElement.textContent = hintText;
        hintElement.classList.add('show');
    }, 200);
}

// ===== Main Click Handler =====
function handleClick(e) {
    // Prevent clicks during animation
    if (isAnimating) return;

    switch (currentStage) {
        case 0:
            // Stage 0: Gather small hearts
            gatherHearts();
            break;
        case 1:
            // Stage 1: Explode big heart
            explodeHearts();
            break;
        case 2:
            // Stage 2: Reset to scattered
            resetToScattered();
            break;
    }
}

// ===== Event Listeners =====
// Click on small hearts (stage 0)
smallHeartsContainer.addEventListener('click', (e) => {
    if (currentStage === 0) {
        handleClick(e);
    }
});

// Click on big heart (stage 1 and 2)
heartWrapper.addEventListener('click', (e) => {
    if (currentStage === 1 || currentStage === 2) {
        handleClick(e);
    }
});

// Touch support for mobile
smallHeartsContainer.addEventListener('touchstart', (e) => {
    if (currentStage === 0) {
        e.preventDefault();
        handleClick(e);
    }
}, { passive: false });

heartWrapper.addEventListener('touchstart', (e) => {
    if (currentStage === 1 || currentStage === 2) {
        e.preventDefault();
        handleClick(e);
    }
}, { passive: false });

// ===== Keyboard Accessibility =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
    }
});

// ===== Initialize =====
function init() {
    // Set initial stage
    currentStage = 0;
    updateStage();

    // Create small hearts
    initializeSmallHearts();

    // Show hint after a brief delay
    setTimeout(() => {
        hintElement.classList.add('show');
    }, 500);
}

// Start the experience
init();

// ===== Console Easter Egg =====
console.log('%c❤️ Made with love - V3 Edition', 'color: #ff6b9d; font-size: 20px; font-weight: bold;');
console.log('%cThree stages of love: Scattered → Gathered → Eternal 💝', 'color: #c23866; font-size: 14px;');
