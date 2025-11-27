// ===== Antigravity Particle System =====
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset(true); // true for initial setup
    }

    reset(initial = false) {
        this.x = Math.random() * this.canvas.width;
        // If initial, place anywhere. If reset, place at bottom.
        this.y = initial ? Math.random() * this.canvas.height : this.canvas.height + 10;

        this.size = Math.random() * 2 + 0.5;
        // Upward movement with slight horizontal drift
        this.speedY = -1 * (Math.random() * 1.5 + 0.5);
        this.speedX = (Math.random() - 0.5) * 0.5;

        this.opacity = 0;
        this.targetOpacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = 0.01;

        // Physics properties
        this.vx = this.speedX;
        this.vy = this.speedY;
        this.friction = 0.98; // Air resistance
    }

    update(mouseX, mouseY) {
        // Apply base movement
        this.vy += (this.speedY - this.vy) * 0.02; // Return to natural speed
        this.vx += (this.speedX - this.vx) * 0.02;

        // Mouse Interaction - Repulsion Force
        if (mouseX !== undefined && mouseY !== undefined) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceRadius = 200;

            if (distance < forceRadius) {
                const force = (forceRadius - distance) / forceRadius;
                const angle = Math.atan2(dy, dx);

                const pushX = Math.cos(angle) * force * 2;
                const pushY = Math.sin(angle) * force * 2;

                this.vx += pushX;
                this.vy += pushY;
            }
        }

        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Fade in logic
        if (this.opacity < this.targetOpacity) {
            this.opacity += this.fadeSpeed;
        }

        // Reset if out of bounds (top)
        if (this.y < -50) {
            this.reset();
        }

        // Wrap horizontal
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize System
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 100; // More particles for the "void" feel

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

// Mouse Tracking
let mouseX, mouseY;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouseX = undefined;
    mouseY = undefined;
});

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update(mouseX, mouseY);
        particle.draw(ctx);
    });

    requestAnimationFrame(animate);
}

// Start
resizeCanvas();
initParticles();
animate();

window.addEventListener('resize', () => {
    resizeCanvas();
    // Optional: Re-init particles if screen size changes drastically
    // initParticles(); 
});

// Intersection Observer for Scroll Animations
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

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach(el => observer.observe(el));

    // Fetch Content from Strapi
    fetchContent();
});

// ===== CMS Integration =====
const API_URL = 'http://localhost:1337/api';

async function fetchContent() {
    try {
        // Fetch Home Page Data
        const homeResponse = await fetch(`${API_URL}/home-page`);
        if (homeResponse.ok) {
            const homeData = await homeResponse.json();
            const attr = homeData.data.attributes;

            if (attr) {
                updateText('.company-name', attr.companyName);
                updateText('.tagline-jp', attr.tagline_jp);
                updateText('.tagline-kn', attr.tagline_kn);
                updateText('.tagline-en', attr.tagline_en);

                updateText('.status-jp', attr.status_jp);
                updateText('.status-kn', attr.status_kn);
                updateText('.status-en', attr.status_en);

                updateText('.update-jp', attr.update_jp);
                updateText('.update-kn', attr.update_kn);
                updateText('.update-en', attr.update_en);
            }
        }

        // Fetch Features
        const featuresResponse = await fetch(`${API_URL}/features`);
        if (featuresResponse.ok) {
            const featuresData = await featuresResponse.json();
            const features = featuresData.data;

            if (features && features.length > 0) {
                const featuresContainer = document.querySelector('.features');
                featuresContainer.innerHTML = ''; // Clear static content

                features.forEach((feature, index) => {
                    const attr = feature.attributes;
                    const featureEl = document.createElement('div');
                    featureEl.className = 'feature-item fade-in-up';
                    featureEl.style.transitionDelay = `${index * 0.1}s`;

                    featureEl.innerHTML = `
                        <h3 class="feature-title-jp">${attr.title_jp || ''}</h3>
                        <h3 class="feature-title-kn">${attr.title_kn || ''}</h3>
                        <p class="feature-desc">${attr.title_en || ''}</p>
                    `;

                    featuresContainer.appendChild(featureEl);
                    observer.observe(featureEl);
                });
            }
        }
    } catch (error) {
        console.log('CMS not reachable, using static content.');
    }
}

function updateText(selector, text) {
    if (text) {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    }
}
