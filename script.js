// ===== Particle Animation System =====
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        // Random starting position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5;
    }

    reset() {
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.targetOpacity = Math.random() * 0.6 + 0.2;
        this.fadeSpeed = Math.random() * 0.01 + 0.003;
    }

    update(mouseX, mouseY) {
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction - particles move away from cursor
        if (mouseX !== undefined && mouseY !== undefined) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 150;

            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;

                this.x += forceDirectionX * force * 2;
                this.y += forceDirectionY * force * 2;
            }
        }

        // Fade in/out effect
        if (Math.random() < 0.01) {
            this.targetOpacity = Math.random() * 0.6 + 0.2;
        }

        if (this.opacity < this.targetOpacity) {
            this.opacity += this.fadeSpeed;
        } else {
            this.opacity -= this.fadeSpeed;
        }
        this.opacity = Math.max(0, Math.min(this.opacity, 1));

        // Wrap around screen edges
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize particle canvas
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 80;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas));
    }
}

// Mouse tracking
let mouseX, mouseY;
canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update(mouseX, mouseY);
        particle.draw(ctx);
    });

    requestAnimationFrame(animateParticles);
}

// Start animation
resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// ===== Scroll Animation Observer =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in-up class
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach(el => observer.observe(el));

    // Add stagger delay to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Parallax effect for hero on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.4}px)`;
            hero.style.opacity = 1 - (scrolled / 600);
        }
    });

    // Smooth reveal animation for content blocks
    const contentBlocks = document.querySelectorAll('.content-block');
    contentBlocks.forEach((block, index) => {
        block.style.transitionDelay = `${index * 0.15}s`;
    });
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        // Additional scroll-based animations can be added here
    });
});

