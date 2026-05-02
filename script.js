gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initGSAPAnimations();
    initBackgroundParticles();
    initCursorSystem();
    initProjectCards();
    initFormHandling();
    initMicroInteractions();
    
    // Refresh ScrollTrigger to ensure all positions are calculated
    ScrollTrigger.refresh();

    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
});

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = htmlElement.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (!icon) return;
    if (theme === 'dark') {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollProgress = document.querySelector('.scroll-progress');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.getElementById('menuOverlay');

    const toggleMenu = () => {
        if (!navMenu) return;
        navMenu.classList.toggle('active');
        if (menuOverlay) menuOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        
        const icon = mobileMenuBtn ? mobileMenuBtn.querySelector('i') : null;
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', toggleMenu);
    }

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / totalHeight) * 100;

        if (scrollProgress) scrollProgress.style.width = `${progress}%`;

        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrolled >= sectionTop - 250) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                toggleMenu();
            }

            const targetId = link.getAttribute('href');
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: targetId, offsetY: 70 },
                ease: "power3.inOut"
            });
        });
    });
}

function initGSAPAnimations() {
    gsap.set(".section-header, .about-text p, .stat-card, .timeline-item, .skill-card, .project-card", { 
        opacity: 0, 
        y: 40 
    });

    const tl = gsap.timeline();
    tl.from(".hero-greeting", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
      .from(".hero-title", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
      .from(".hero-description", { opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hero-actions .btn", { scale: 0.8, opacity: 0, stagger: 0.2, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4")
      .from(".hero-image", { scale: 0.9, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.6");

    document.querySelectorAll('.section-header').forEach(header => {
        gsap.to(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 90%",
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
        });
    });

    gsap.to(".about-text p, .stat-card", {
        scrollTrigger: {
            trigger: ".about-content",
            start: "top 85%",
        },
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out"
    });

    gsap.to(".timeline-item", {
        scrollTrigger: {
            trigger: ".journey-timeline",
            start: "top 85%",
        },
        y: 0,
        opacity: 1,
        stagger: 0.3,
        duration: 1,
        ease: "power3.out"
    });

    gsap.to(".hero-image", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        y: 100,
        ease: "none"
    });

    gsap.to(".skill-card", {
        scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 90%",
        },
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
    });

    gsap.to(".project-card", {
        scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 90%",
        },
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out"
    });
}

function initBackgroundParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function initCursorSystem() {
    const dot = document.querySelector('.cursor-glow');
    const outline = document.querySelector('.cursor-outer');
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    function animateOutline() {
        // Smooth lerp for trailing effect
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        outline.style.left = `${outlineX}px`;
        outline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    const targets = document.querySelectorAll('a, button, .project-card, .social-btn');
    targets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            dot.classList.add('cursor-hover');
            outline.classList.add('cursor-expanded');
        });
        target.addEventListener('mouseleave', () => {
            dot.classList.remove('cursor-hover');
            outline.classList.remove('cursor-expanded');
        });
    });
}

function initProjectCards() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            
            // Tilt calculation
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });

        // Toggle active class for mobile to show links
        card.addEventListener('click', (e) => {
            if (window.innerWidth < 768) {
                // Toggle active class on the card
                const isActive = card.classList.contains('active');
                
                // Close other cards
                document.querySelectorAll('.project-card').forEach(c => c.classList.remove('active'));
                
                if (!isActive) {
                    card.classList.add('active');
                }
            }
        });
    });
}

function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Message sent successfully! 🎉', 'success');
        contactForm.reset();
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 80px; right: 20px; padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white; border-radius: 8px; font-weight: 600; z-index: 2000;
        animation: slideInRight 0.3s ease forwards;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function initMicroInteractions() {
    // Reveal text animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = text.split('').map(char => `<span class="char">${char}</span>`).join('');
        gsap.from(".char", {
            opacity: 0,
            y: 10,
            stagger: 0.03,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.5
        });
    }
}