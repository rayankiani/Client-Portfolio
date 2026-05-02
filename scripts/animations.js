// Advanced animations and interactions
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollReveal();
        this.initParallax();
        this.initHoverEffects();
        this.initTextAnimations();
        this.initProjectFilters();
        this.initSkillCounters();
        this.initTimelineAnimations();
        this.initMorphingShapes();
    }

    // Scroll reveal animations with intersection observer
    initScrollReveal() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.animation || 'fadeInUp';
                    const delay = element.dataset.delay || '0';
                    
                    setTimeout(() => {
                        element.classList.add(`animate-${animationType}`);
                        element.style.opacity = '1';
                    }, parseInt(delay));

                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Set up elements for animation
        const animateElements = document.querySelectorAll('[data-animate="true"]');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });

        // Auto-add animation attributes to common elements
        const autoAnimateSelectors = [
            '.hero-text',
            '.hero-image', 
            '.section-header',
            '.about-text',
            '.skill-item',
            '.timeline-item',
            '.project-card',
            '.cert-item',
            '.testimonial-item',
            '.contact-info',
            '.contact-form'
        ];

        autoAnimateSelectors.forEach((selector, index) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el, elIndex) => {
                if (!el.dataset.animate) {
                    el.dataset.animate = 'true';
                    el.dataset.animation = this.getAnimationForElement(selector);
                    el.dataset.delay = (index * 100 + elIndex * 50).toString();
                    el.style.opacity = '0';
                    observer.observe(el);
                }
            });
        });
    }

    getAnimationForElement(selector) {
        const animations = {
            '.hero-text': 'fadeInLeft',
            '.hero-image': 'fadeInRight',
            '.section-header': 'fadeInUp',
            '.about-text': 'fadeInUp',
            '.skill-item': 'slideInLeft',
            '.timeline-item': 'fadeInUp',
            '.project-card': 'scaleIn',
            '.cert-item': 'rotateIn',
            '.testimonial-item': 'fadeIn',
            '.contact-info': 'fadeInLeft',
            '.contact-form': 'fadeInRight'
        };
        
        return animations[selector] || 'fadeInUp';
    }

    // Parallax scrolling effects
    initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        const handleParallax = () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || '0.5';
                const yPos = -(scrollY * parseFloat(speed));
                element.style.transform = `translateY(${yPos}px)`;
            });
        };

        // Use requestAnimationFrame for smooth performance
        let ticking = false;
        const updateParallax = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', updateParallax, { passive: true });
    }

    // Enhanced hover effects
    initHoverEffects() {
        // Magnetic hover effect for buttons
        const magneticElements = document.querySelectorAll('.btn, .project-card, .cert-item');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px)';
            });
        });

        // Tilt effect for project cards
        const tiltElements = document.querySelectorAll('.project-card');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    // Text animations
    initTextAnimations() {
        // Split text animation
        const splitTextElements = document.querySelectorAll('.split-text');
        
        splitTextElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 0.05}s`;
                span.classList.add('char');
                element.appendChild(span);
            });
        });

        // Typewriter effect
        this.initTypewriter();
    }

    initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.dataset.text || element.textContent;
            const speed = parseInt(element.dataset.speed) || 100;
            
            element.textContent = '';
            element.style.borderRight = '2px solid currentColor';
            
            let i = 0;
            const typing = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                    // Blinking cursor effect
                    setInterval(() => {
                        element.style.borderRight = element.style.borderRight === 'none' ? 
                            '2px solid currentColor' : 'none';
                    }, 500);
                }
            }, speed);
        });
    }

    // Project filtering system
    initProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (filterBtns.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.classList.add('animate-scaleIn');
                        }, 50);
                    } else {
                        card.classList.remove('animate-scaleIn');
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Animated skill counters
    initSkillCounters() {
        const counterElements = document.querySelectorAll('.counter');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.count);
                    const duration = parseInt(counter.dataset.duration) || 2000;
                    
                    this.animateCounter(counter, target, duration);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        
        const updateCounter = () => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start < target) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }

    // Timeline animations
    initTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const isOdd = Array.from(timelineItems).indexOf(item) % 2 === 0;
                    
                    item.classList.add(isOdd ? 'animate-slideInLeft' : 'animate-slideInRight');
                    
                    // Animate timeline marker
                    const marker = item.querySelector('.timeline-marker');
                    if (marker) {
                        setTimeout(() => {
                            marker.classList.add('animate-pulse');
                        }, 500);
                    }
                    
                    timelineObserver.unobserve(item);
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // Morphing background shapes
    initMorphingShapes() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Create morphing blob
        const blob = document.createElement('div');
        blob.className = 'morphing-blob';
        blob.style.cssText = `
            position: absolute;
            top: 20%;
            right: 10%;
            width: 300px;
            height: 300px;
            background: linear-gradient(45deg, #3b82f6, #10b981);
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            opacity: 0.1;
            animation: morph 8s ease-in-out infinite;
            z-index: -1;
        `;

        // Add morphing animation
        const morphKeyframes = `
            @keyframes morph {
                0%, 100% {
                    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                    transform: rotate(0deg);
                }
                25% {
                    border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
                    transform: rotate(90deg);
                }
                50% {
                    border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
                    transform: rotate(180deg);
                }
                75% {
                    border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
                    transform: rotate(270deg);
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = morphKeyframes;
        document.head.appendChild(style);

        hero.appendChild(blob);
    }
}

// Cursor effects
class CursorEffects {
    constructor() {
        this.init();
    }

    init() {
        this.createCustomCursor();
        this.initCursorFollower();
    }

    createCustomCursor() {
        // Create custom cursor elements
        const cursor = document.createElement('div');
        const cursorFollower = document.createElement('div');
        
        cursor.className = 'custom-cursor';
        cursorFollower.className = 'cursor-follower';

        // Add styles
        const cursorStyles = `
            .custom-cursor {
                position: fixed;
                top: 0;
                left: 0;
                width: 10px;
                height: 10px;
                background: #3b82f6;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
            }
            
            .cursor-follower {
                position: fixed;
                top: 0;
                left: 0;
                width: 40px;
                height: 40px;
                border: 2px solid #3b82f6;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transition: all 0.3s ease;
                opacity: 0.5;
            }
            
            .custom-cursor.hover {
                transform: scale(2);
                background: #10b981;
            }
            
            .cursor-follower.hover {
                transform: scale(1.5);
                border-color: #10b981;
            }
            
            @media (max-width: 768px) {
                .custom-cursor,
                .cursor-follower {
                    display: none;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = cursorStyles;
        document.head.appendChild(style);

        document.body.appendChild(cursor);
        document.body.appendChild(cursorFollower);

        this.cursor = cursor;
        this.cursorFollower = cursorFollower;
    }

    initCursorFollower() {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor animation
        const animateCursor = () => {
            // Smooth cursor movement
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            followerX += (mouseX - followerX) * 0.05;
            followerY += (mouseY - followerY) * 0.05;

            this.cursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px)`;
            this.cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;

            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .cert-item');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.cursorFollower.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.cursorFollower.classList.remove('hover');
            });
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
    
    // Only initialize custom cursor on desktop
    if (window.innerWidth > 768) {
        new CursorEffects();
    }
});

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        this.monitorScrollPerformance();
        this.optimizeAnimations();
    }

    monitorScrollPerformance() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            document.body.classList.add('scrolling');
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('scrolling');
            }, 150);
        }, { passive: true });

        // Reduce animations during scroll
        const style = document.createElement('style');
        style.textContent = `
            .scrolling * {
                animation-duration: 0.01s !important;
                transition-duration: 0.01s !important;
            }
        `;
        document.head.appendChild(style);
    }

    optimizeAnimations() {
        // Reduce animations on low-end devices
        const isLowEndDevice = navigator.hardwareConcurrency < 4;
        
        if (isLowEndDevice) {
            document.body.classList.add('reduced-motion');
            
            const style = document.createElement('style');
            style.textContent = `
                .reduced-motion * {
                    animation-duration: 0.5s !important;
                    transition-duration: 0.3s !important;
                }
                
                .reduced-motion .parallax {
                    transform: none !important;
                }
                
                .reduced-motion .morphing-blob {
                    animation: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize performance monitoring
new PerformanceMonitor();