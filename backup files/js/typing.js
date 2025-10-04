// js/typing.js

// Typing animation class
class TypingAnimation {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            typeSpeed: 100,
            deleteSpeed: 50,
            pauseTime: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            ...options
        };
        
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        this.init();
    }

    init() {
        if (this.element) {
            this.type();
        }
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            // Deleting characters
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
            
            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 500);
                return;
            }
        } else {
            // Typing characters
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
            
            if (this.charIndex === currentText.length) {
                if (this.options.loop) {
                    this.isPaused = true;
                    setTimeout(() => {
                        this.isPaused = false;
                        this.isDeleting = true;
                        this.type();
                    }, this.options.pauseTime);
                    return;
                }
            }
        }
        
        const speed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
        setTimeout(() => this.type(), speed);
    }

    // Public methods
    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
        this.type();
    }

    changeTexts(newTexts) {
        this.texts = newTexts;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
    }
}

// Advanced typing effects
class AdvancedTyping {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            typeSpeed: 80,
            deleteSpeed: 40,
            pauseTime: 1500,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            scrambleEffect: false,
            glitchEffect: false,
            ...options
        };
        
        this.currentTextIndex = 0;
        this.isTyping = false;
        this.init();
    }

    init() {
        this.startTyping();
    }

    async startTyping() {
        if (this.isTyping) return;
        this.isTyping = true;

        while (true) {
            const currentText = this.texts[this.currentTextIndex];
            
            // Typing effect
            await this.typeText(currentText);
            await this.pause(this.options.pauseTime);
            
            // Delete effect
            if (this.options.loop && this.texts.length > 1) {
                await this.deleteText();
                await this.pause(500);
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            } else if (!this.options.loop) {
                break;
            }
        }
        
        this.isTyping = false;
    }

    async typeText(text) {
        for (let i = 0; i <= text.length; i++) {
            if (this.options.scrambleEffect && i < text.length) {
                await this.scrambleEffect(text, i);
            } else {
                this.element.textContent = text.substring(0, i);
            }
            await this.pause(this.options.typeSpeed);
        }
    }

    async deleteText() {
        const currentText = this.element.textContent;
        
        for (let i = currentText.length; i >= 0; i--) {
            this.element.textContent = currentText.substring(0, i);
            await this.pause(this.options.deleteSpeed);
        }
    }

    async scrambleEffect(finalText, position) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        const iterations = 5;
        
        for (let i = 0; i < iterations; i++) {
            let scrambled = finalText.substring(0, position);
            
            for (let j = position; j < finalText.length; j++) {
                scrambled += chars[Math.floor(Math.random() * chars.length)];
            }
            
            this.element.textContent = scrambled;
            await this.pause(30);
        }
        
        this.element.textContent = finalText.substring(0, position + 1);
    }

    pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Add glitch effect
    async glitchEffect(duration = 200) {
        const originalText = this.element.textContent;
        const chars = '!<>-_\\/[]{}—=+*^?#';
        const startTime = Date.now();
        
        const glitch = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed < duration) {
                this.element.textContent = originalText
                    .split('')
                    .map(char => Math.random() < 0.1 ? chars[Math.floor(Math.random() * chars.length)] : char)
                    .join('');
                requestAnimationFrame(glitch);
            } else {
                this.element.textContent = originalText;
            }
        };
        
        glitch();
    }
}

// Matrix-style text effect
class MatrixText {
    constructor(element, text, options = {}) {
        this.element = element;
        this.finalText = text;
        this.options = {
            duration: 2000,
            chars: '01',
            ...options
        };
        
        this.init();
    }

    init() {
        this.animate();
    }

    animate() {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.options.duration, 1);
            
            let result = '';
            for (let i = 0; i < this.finalText.length; i++) {
                if (progress * this.finalText.length > i) {
                    result += this.finalText[i];
                } else {
                    result += this.options.chars[Math.floor(Math.random() * this.options.chars.length)];
                }
            }
            
            this.element.textContent = result;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
}

// Initialize typing animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Main hero typing animation
    const typingElement = document.getElementById('typing-text');
    const typingTexts = [
        'Full Stack Developer',
        'Web Developer',
        'UI/UX Designer',
        'Problem Solver',
        'Creative Thinker'
    ];

    if (typingElement) {
        // Start typing animation after a short delay
        setTimeout(() => {
            new AdvancedTyping(typingElement, typingTexts, {
                typeSpeed: 100,
                deleteSpeed: 50,
                pauseTime: 2000,
                scrambleEffect: true
            });
        }, 1000);
    }

    // Add typing effect to section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                const originalText = entry.target.textContent;
                entry.target.textContent = '';
                entry.target.classList.add('typed');
                
                setTimeout(() => {
                    new TypingAnimation(entry.target, [originalText], {
                        typeSpeed: 80,
                        loop: false
                    });
                }, 300);
            }
        });
    }, { threshold: 0.5 });

    sectionTitles.forEach(title => {
        titleObserver.observe(title);
    });
});

// Cursor blink animation
class CursorAnimation {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            blinkSpeed: 530,
            ...options
        };
        
        this.init();
    }

    init() {
        this.element.style.animation = `blink ${this.options.blinkSpeed}ms infinite`;
    }

    start() {
        this.element.style.animationPlayState = 'running';
    }

    stop() {
        this.element.style.animationPlayState = 'paused';
        this.element.style.opacity = '1';
    }
}

// Word reveal animation
class WordReveal {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            duration: 1000,
            delay: 100,
            ...options
        };
        
        this.init();
    }

    init() {
        const words = this.element.textContent.split(' ');
        this.element.innerHTML = '';
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.display = 'inline-block';
            span.style.transition = 'all 0.6s ease';
            this.element.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, index * this.options.delay);
        });
    }
}

// Character reveal animation
class CharReveal {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            duration: 50,
            ...options
        };
        
        this.init();
    }

    init() {
        const text = this.element.textContent;
        this.element.innerHTML = '';
        
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            span.style.transition = 'opacity 0.3s ease';
            this.element.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
            }, index * this.options.duration);
        });
    }
}

// Terminal typing effect
class TerminalTyping {
    constructor(element, commands, options = {}) {
        this.element = element;
        this.commands = commands;
        this.options = {
            typeSpeed: 80,
            deleteSpeed: 40,
            pauseTime: 1500,
            prompt: '$ ',
            ...options
        };
        
        this.commandIndex = 0;
        this.init();
    }

    init() {
        this.element.style.fontFamily = 'monospace';
        this.element.style.background = '#1a1a1a';
        this.element.style.color = '#00ff00';
        this.element.style.padding = '1rem';
        this.element.style.borderRadius = '5px';
        this.typeCommand();
    }

    async typeCommand() {
        const command = this.commands[this.commandIndex];
        this.element.textContent = this.options.prompt;
        
        // Type command
        for (let i = 0; i <= command.length; i++) {
            this.element.textContent = this.options.prompt + command.substring(0, i);
            await this.pause(this.options.typeSpeed);
        }
        
        await this.pause(this.options.pauseTime);
        
        // Delete command
        for (let i = command.length; i >= 0; i--) {
            this.element.textContent = this.options.prompt + command.substring(0, i);
            await this.pause(this.options.deleteSpeed);
        }
        
        this.commandIndex = (this.commandIndex + 1) % this.commands.length;
        setTimeout(() => this.typeCommand(), 500);
    }

    pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize typing effects for specific elements
function initializeCustomTypingEffects() {
    // Hero subtitle typing
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && !heroSubtitle.classList.contains('typing-initialized')) {
        heroSubtitle.classList.add('typing-initialized');
        
        // Add some delay before starting
        setTimeout(() => {
            const typingTexts = [
                'Full Stack Developer',
                'Frontend Specialist', 
                'UI/UX Designer',
                'Problem Solver',
                'Code Enthusiast'
            ];
            
            new AdvancedTyping(document.getElementById('typing-text'), typingTexts, {
                typeSpeed: 120,
                deleteSpeed: 60,
                pauseTime: 2500,
                scrambleEffect: true
            });
        }, 1500);
    }

    // Add typing effect to project descriptions on hover
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const description = card.querySelector('p');
        const originalText = description.textContent;
        
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('hovered')) {
                card.classList.add('hovered');
                description.textContent = '';
                new TypingAnimation(description, [originalText], {
                    typeSpeed: 30,
                    loop: false
                });
            }
        });
    });
}

// Typewriter effect with sound simulation
class TypewriterWithSound {
    constructor(element, text, options = {}) {
        this.element = element;
        this.text = text;
        this.options = {
            typeSpeed: 100,
            variableSpeed: true,
            soundEffect: true,
            ...options
        };
        
        this.init();
    }

    init() {
        this.element.textContent = '';
        this.typeWithVariableSpeed();
    }

    async typeWithVariableSpeed() {
        for (let i = 0; i <= this.text.length; i++) {
            this.element.textContent = this.text.substring(0, i);
            
            // Simulate keypress sound effect
            if (this.options.soundEffect && i < this.text.length) {
                this.playKeypressSound();
            }
            
            // Variable typing speed for more natural feel
            let speed = this.options.typeSpeed;
            if (this.options.variableSpeed) {
                const char = this.text[i];
                if (char === ' ') speed = speed * 0.5;
                if (char === '.' || char === '!' || char === '?') speed = speed * 2;
                if (char === ',') speed = speed * 1.5;
                
                // Add random variation
                speed += (Math.random() - 0.5) * 40;
            }
            
            await this.pause(Math.max(20, speed));
        }
    }

    playKeypressSound() {
        // Create a subtle click sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Fallback for browsers that don't support Web Audio API
            console.log('Audio not supported');
        }
    }

    pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Sliding text animation
class SlidingText {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            duration: 3000,
            direction: 'up',
            ...options
        };
        
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.element.style.overflow = 'hidden';
        this.element.style.height = '1.5em';
        this.slide();
    }

    slide() {
        const wrapper = document.createElement('div');
        wrapper.style.transition = `transform 0.5s ease`;
        
        this.texts.forEach(text => {
            const textElement = document.createElement('div');
            textElement.textContent = text;
            textElement.style.height = '1.5em';
            wrapper.appendChild(textElement);
        });
        
        this.element.innerHTML = '';
        this.element.appendChild(wrapper);
        
        setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            const offset = this.currentIndex * -1.5;
            wrapper.style.transform = `translateY(${offset}em)`;
        }, this.options.duration);
    }
}

// Initialize all typing effects
document.addEventListener('DOMContentLoaded', function() {
    // Wait for page to settle before starting animations
    setTimeout(() => {
        initializeCustomTypingEffects();
    }, 500);
});

// Export classes for global use
window.TypingAnimation = TypingAnimation;
window.AdvancedTyping = AdvancedTyping;
window.TypewriterWithSound = TypewriterWithSound;
window.SlidingText = SlidingText;
window.MatrixText = MatrixText;
window.WordReveal = WordReveal;
window.CharReveal = CharReveal;