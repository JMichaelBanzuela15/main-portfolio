// js/animations.js

// Advanced animation controller
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupCounterAnimations();
    }

    // Setup intersection observer for scroll animations
    setupIntersectionObserver() {
        const options = {
            threshold: [0.1, 0.3, 0.5, 0.7],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, options);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll(`
            .fade-in-up, .fade-in-left, .fade-in-right, .fade-in,
            .slide-in-up, .slide-in-down, .zoom-in, .rotate-in,
            .skill-card, .project-card, .animate-on-scroll
        `);

        animatedElements.forEach(el => {
            observer.observe(el);
        });

        this.observers.set('main', observer);
    }

    // Trigger animation for an element
    triggerAnimation(element) {
        // Add animated class
        element.classList.add('animated');

        // Handle specific animations
        if (element.classList.contains('skill-card')) {
            this.animateSkillProgress(element);
        }

        if (element.classList.contains('stat')) {
            this.animateCounter(element);
        }

        // Stagger child animations
        this.staggerChildAnimations(element);
    }

    // Animate skill progress bars
    animateSkillProgress(skillCard) {
        const progressBar = skillCard.querySelector('.skill-progress');
        if (progressBar && !progressBar.classList.contains('animated')) {
            const targetWidth = progressBar.getAttribute('data-width') || '0';
            
            setTimeout(() => {
                progressBar.style.width = targetWidth + '%';
                progressBar.classList.add('animated');
                
                // Add shine effect
                progressBar.classList.add('progress-animate');
            }, 300);
        }
    }

    // Animate counters
    animateCounter(element) {
        const counter = element.querySelector('h3');
        if (counter && !counter.classList.contains('counted')) {
            const target = parseInt(counter.textContent);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
            }, 16);

            counter.classList.add('counted');
        }
    }

    // Stagger animations for child elements
    staggerChildAnimations(parent) {
        const children = parent.querySelectorAll('.stagger-item');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('fade-in-up');
            }, index * 100);
        });
    }

    // Setup scroll-based animations
    setupScrollAnimations() {
        let ticking = false;

        const updateAnimations = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;

            // Parallax effects
            this.updateParallax(scrollY);
            
            // Update scroll progress
            this.updateScrollProgress(scrollY);

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        });
    }

    // Update parallax elements
    updateParallax(scrollY) {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Update scroll progress indicators
    updateScrollProgress(scrollY) {
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / documentHeight) * 100;
        
        const progressBars = document.querySelectorAll('.scroll-progress');
        progressBars.forEach(bar => {
            bar.style.width = progress + '%';
        });
    }

    // Setup hover animations
    setupHoverAnimations() {
        // Magnetic buttons
        const magneticElements = document.querySelectorAll('.btn, .project-card, .skill-card');
        
        magneticElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.addMagneticEffect(element);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.removeMagneticEffect(element);
            });
        });

        // Tilt effect for cards
        const tiltElements = document.querySelectorAll('.project-card, .skill-card');
        tiltElements.forEach(element => {
            this.addTiltEffect(element);
        });
    }

    // Add magnetic effect
    addMagneticEffect(element) {
        element.addEventListener('mousemove', this.handleMagneticMove);
    }

    // Remove magnetic effect
    removeMagneticEffect(element) {
        element.removeEventListener('mousemove', this.handleMagneticMove);
        element.style.transform = '';
    }

    // Handle magnetic mouse movement
    handleMagneticMove(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.1;
        const moveY = y * 0.1;
        
        e.currentTarget.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    // Add tilt effect
    addTiltEffect(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        });
    }

    // Setup counter animations
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat h3');
        
        counters.forEach(counter => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !counter.classList.contains('counted')) {
                        this.animateCounter(counter.closest('.stat'));
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }

    // Create custom animations
    createCustomAnimation(element, keyframes, options = {}) {
        const defaultOptions = {
            duration: 1000,
            easing: 'ease',
            fill: 'forwards'
        };
        
        const animationOptions = { ...defaultOptions, ...options };
        
        if (element.animate) {
            return element.animate(keyframes, animationOptions);
        }
    }

    // Text wave animation
    createTextWave(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.animation = `wave 2s ease-in-out ${index * 0.1}s infinite`;
            element.appendChild(span);
        });
    }

    // Ripple effect
    createRippleEffect(element, event) {
        const circle = document.createElement('span');
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - element.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - element.offsetTop - radius}px`;
        circle.classList.add('ripple');
        
        circle.style.cssText += `
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            background: rgba(255, 255, 255, 0.6);
            pointer-events: none;
        `;
        
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
        
        element.appendChild(circle);
        
        setTimeout(() => {
            circle.remove();
        }, 600);
    }
}

// Initialize animation controller
const animationController = new AnimationController();

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        animationController.createRippleEffect(e.target, e);
    }
});

// Custom wave animation keyframes
const waveKeyframes = `
    @keyframes wave {
        0%, 60%, 100% {
            transform: initial;
        }
        30% {
            transform: translateY(-10px);
        }
    }
`;

// Add wave animation CSS
const waveStyle = document.createElement('style');
waveStyle.textContent = waveKeyframes;
document.head.appendChild(waveStyle);

// Mouse trail effect
class MouseTrail {
    constructor() {
        this.dots = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        // Create trail dots
        for (let i = 0; i < 20; i++) {
            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(102, 126, 234, 0.8);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.1s ease;
                opacity: ${1 - i * 0.05};
            `;
            document.body.appendChild(dot);
            this.dots.push(dot);
        }

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Animate trail
        this.animate();
    }

    animate() {
        let x = this.mouse.x;
        let y = this.mouse.y;

        this.dots.forEach((dot, index) => {
            const nextDot = this.dots[index + 1] || this.dots[0];
            
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';

            x += (nextDot.offsetLeft - x) * 0.3;
            y += (nextDot.offsetTop - y) * 0.3;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize mouse trail (optional - can be enabled/disabled)
// const mouseTrail = new MouseTrail();

// Loading screen animation
class LoadingScreen {
    constructor() {
        this.createLoadingScreen();
    }

    createLoadingScreen() {
        const loader = document.createElement('div');
        loader.id = 'loading-screen';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 1;
            transition: opacity 0.5s ease;
        `;

        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;

        const spinKeyframes = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        const style = document.createElement('style');
        style.textContent = spinKeyframes;
        document.head.appendChild(style);

        loader.appendChild(spinner);
        document.body.appendChild(loader);

        // Hide loading screen when page is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 1000);
        });
    }
}

// Initialize loading screen
const loadingScreen = new LoadingScreen();

// Scroll reveal animation
class ScrollReveal {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.elements = document.querySelectorAll('.scroll-reveal');
        this.bindEvents();
        this.checkElements();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.checkElements());
        window.addEventListener('resize', () => this.checkElements());
    }

    checkElements() {
        this.elements.forEach(element => {
            if (this.isElementInViewport(element)) {
                this.revealElement(element);
            }
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    revealElement(element) {
        element.classList.add('revealed');
    }
}

// Particle system for hero section
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < 100; i++) {
            const particle = {
                x: Math.random() * this.container.offsetWidth,
                y: Math.random() * this.container.offsetHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            };
            this.particles.push(particle);
        }
    }

    animate() {
        // Clear canvas or update DOM particles
        this.updateParticles();
        requestAnimationFrame(() => this.animate());
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x <= 0 || particle.x >= this.container.offsetWidth) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.container.offsetHeight) {
                particle.vy *= -1;
            }

            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.container.offsetWidth, particle.x));
            particle.y = Math.max(0, Math.min(this.container.offsetHeight, particle.y));
        });
    }
}

// Text animation effects
class TextAnimations {
    static typeWriter(element, text, speed = 50) {
        element.innerHTML = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    static scrambleText(element, finalText, duration = 2000) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            let result = '';
            for (let i = 0; i < finalText.length; i++) {
                if (progress * finalText.length > i) {
                    result += finalText[i];
                } else {
                    result += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            
            element.textContent = result;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    static glitchText(element, duration = 100) {
        const originalText = element.textContent;
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        
        let glitchTimer = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map(char => Math.random() < 0.1 ? chars[Math.floor(Math.random() * chars.length)] : char)
                .join('');
        }, 50);
        
        setTimeout(() => {
            clearInterval(glitchTimer);
            element.textContent = originalText;
        }, duration);
    }
}

// Initialize scroll reveal
const scrollReveal = new ScrollReveal();

// Smooth scroll polyfill for older browsers
function smoothScrollPolyfill() {
    if (!('scrollBehavior' in document.documentElement.style)) {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const targetTop = target.offsetTop - 80;
                    const startPosition = window.pageYOffset;
                    const distance = targetTop - startPosition;
                    const duration = 1000;
                    let start = null;

                    function step(timestamp) {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const percentage = Math.min(progress / duration, 1);
                        
                        window.scrollTo(0, startPosition + distance * easeInOutCubic(percentage));
                        
                        if (progress < duration) {
                            window.requestAnimationFrame(step);
                        }
                    }
                    
                    window.requestAnimationFrame(step);
                }
            });
        });
    }
}

// Easing function
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Initialize smooth scroll polyfill
smoothScrollPolyfill();

// Export for use in other files
window.AnimationController = AnimationController;
window.TextAnimations = TextAnimations;