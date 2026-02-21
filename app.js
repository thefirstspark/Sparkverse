/**
 * SPARKVERSE - Solar System Navigation
 * Consciousness technology portal
 * 
 * Configuration and main application logic
 */

// ============================================
// CONFIGURATION - Edit URLs/Labels here
// ============================================
const CONFIG = {
    planets: [
        {
            id: 'nft-vault',
            name: 'NFT VAULT',
            icon: '◈',
            url: 'https://opensea.io/', // Replace with your actual OpenSea collection URL
            external: true
        },
        {
            id: 'signal-links',
            name: 'SIGNAL LINKS',
            icon: '⟁',
            url: 'links.html',
            external: false
        },
        {
            id: 'spark-station',
            name: 'SPARK STATION',
            icon: '⬡',
            url: 'spark-station.html',
            external: false
        },
        {
            id: 'investor-gate',
            name: 'INVESTOR GATE',
            icon: '⟐',
            url: 'invest.html',
            external: false
        },
        {
            id: 'tools-market',
            name: 'TOOLS MARKET',
            icon: '⚙',
            url: 'tools.html',
            external: false
        },
        {
            id: 'free-drops',
            name: 'FREE DROPS',
            icon: '⟡',
            url: 'free.html',
            external: false
        },
        {
            id: 'newsfeed',
            name: 'NEWSFEED',
            icon: '◉',
            url: 'news.html',
            external: false
        }
    ],
    
    // Orbit animation settings
    orbit: {
        speed: 0.0003,       // Orbital rotation speed (radians per frame)
        radius: 280,          // Base orbit radius in pixels
        pauseOnHover: true    // Pause orbit when hovering over planets
    },
    
    // Starfield settings
    starfield: {
        starCount: 200,       // Number of stars
        speed: 0.2,           // Drift speed
        minSize: 0.5,         // Minimum star size
        maxSize: 2            // Maximum star size
    }
};

// ============================================
// STARFIELD ANIMATION
// ============================================
class Starfield {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.animationId = null;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        this.resize();
        this.createStars();
        if (!this.prefersReducedMotion) {
            this.animate();
        } else {
            this.drawStatic();
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createStars() {
        this.stars = [];
        const { starCount, minSize, maxSize } = CONFIG.starfield;
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: minSize + Math.random() * (maxSize - minSize),
                opacity: 0.3 + Math.random() * 0.7,
                twinkleSpeed: 0.01 + Math.random() * 0.02,
                twinklePhase: Math.random() * Math.PI * 2,
                driftX: (Math.random() - 0.5) * CONFIG.starfield.speed,
                driftY: (Math.random() - 0.5) * CONFIG.starfield.speed
            });
        }
    }
    
    drawStatic() {
        this.ctx.fillStyle = '#050508';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
        });
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(5, 5, 8, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            // Update position (gentle drift)
            star.x += star.driftX;
            star.y += star.driftY;
            
            // Wrap around edges
            if (star.x < 0) star.x = this.canvas.width;
            if (star.x > this.canvas.width) star.x = 0;
            if (star.y < 0) star.y = this.canvas.height;
            if (star.y > this.canvas.height) star.y = 0;
            
            // Twinkle effect
            star.twinklePhase += star.twinkleSpeed;
            const twinkle = 0.5 + 0.5 * Math.sin(star.twinklePhase);
            const opacity = star.opacity * (0.6 + 0.4 * twinkle);
            
            // Draw star
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            if (this.prefersReducedMotion) {
                this.drawStatic();
            }
        });
        
        // Listen for reduced motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.prefersReducedMotion = e.matches;
            if (this.prefersReducedMotion) {
                cancelAnimationFrame(this.animationId);
                this.drawStatic();
            } else {
                this.animate();
            }
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ============================================
// ORBIT ANIMATION
// ============================================
class OrbitSystem {
    constructor() {
        this.container = document.getElementById('orbit-container');
        this.planets = document.querySelectorAll('.planet-orbit');
        this.angle = 0;
        this.isPaused = false;
        this.animationId = null;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        // Set initial positions
        this.positionPlanets();
        
        // Start animation if motion is allowed
        if (!this.prefersReducedMotion) {
            this.animate();
        }
        
        this.bindEvents();
    }
    
    positionPlanets() {
        const count = this.planets.length;
        const angleStep = (Math.PI * 2) / count;
        
        this.planets.forEach((planet, index) => {
            const planetAngle = this.angle + (index * angleStep);
            const x = Math.cos(planetAngle) * CONFIG.orbit.radius;
            const y = Math.sin(planetAngle) * CONFIG.orbit.radius;
            
            planet.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        });
    }
    
    animate() {
        if (!this.isPaused) {
            this.angle += CONFIG.orbit.speed;
            this.positionPlanets();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        // Pause on hover
        if (CONFIG.orbit.pauseOnHover) {
            this.planets.forEach(planet => {
                planet.addEventListener('mouseenter', () => this.isPaused = true);
                planet.addEventListener('mouseleave', () => this.isPaused = false);
            });
            
            // Also pause when hovering over center planet
            const centerPlanet = document.getElementById('center-planet');
            if (centerPlanet) {
                centerPlanet.addEventListener('mouseenter', () => this.isPaused = true);
                centerPlanet.addEventListener('mouseleave', () => this.isPaused = false);
            }
        }
        
        // Listen for reduced motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.prefersReducedMotion = e.matches;
            if (this.prefersReducedMotion) {
                cancelAnimationFrame(this.animationId);
            } else {
                this.animate();
            }
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ============================================
// NAVIGATION MODAL
// ============================================
class NavigationModal {
    constructor() {
        this.modal = document.getElementById('nav-modal');
        this.trigger = document.getElementById('center-planet');
        this.closeBtn = this.modal?.querySelector('.modal-close');
        this.focusableElements = null;
        this.firstFocusable = null;
        this.lastFocusable = null;
        this.previousFocus = null;
        
        if (this.modal && this.trigger) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.updateFocusableElements();
    }
    
    updateFocusableElements() {
        this.focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        this.firstFocusable = this.focusableElements[0];
        this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
    }
    
    open() {
        this.previousFocus = document.activeElement;
        this.modal.hidden = false;
        
        // Force reflow for animation
        this.modal.offsetHeight;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first element after animation
        setTimeout(() => {
            this.firstFocusable?.focus();
        }, 100);
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Wait for animation then hide
        setTimeout(() => {
            this.modal.hidden = true;
            this.previousFocus?.focus();
        }, 400);
    }
    
    handleKeydown(e) {
        if (e.key === 'Escape') {
            this.close();
            return;
        }
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === this.firstFocusable) {
                    e.preventDefault();
                    this.lastFocusable?.focus();
                }
            } else {
                if (document.activeElement === this.lastFocusable) {
                    e.preventDefault();
                    this.firstFocusable?.focus();
                }
            }
        }
    }
    
    bindEvents() {
        // Open modal
        this.trigger.addEventListener('click', () => this.open());
        this.trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.open();
            }
        });
        
        // Close modal
        this.closeBtn?.addEventListener('click', () => this.close());
        
        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Keyboard navigation
        this.modal.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
}

// ============================================
// PARALLAX EFFECT (subtle)
// ============================================
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.orbit-ring');
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!this.prefersReducedMotion) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    handleMouseMove(e) {
        const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
        
        this.elements.forEach((el, index) => {
            const depth = (index + 1) * 0.5;
            const moveX = x * depth * 10;
            const moveY = y * depth * 10;
            
            el.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize starfield
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas) {
        new Starfield(starfieldCanvas);
    }
    
    // Initialize orbit system (only on main page)
    const orbitContainer = document.getElementById('orbit-container');
    if (orbitContainer) {
        new OrbitSystem();
    }
    
    // Initialize modal
    new NavigationModal();
    
    // Initialize parallax
    new ParallaxEffect();
    
    // Add loaded class for any entrance animations
    document.body.classList.add('loaded');
});

// ============================================
// UTILITY: Check if element is in viewport
// ============================================
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log(`
✦ SPARKVERSE ✦
Reality is programmable.
You are the coder.

Welcome to The First Spark.
https://thefirstspark.shop
`);
