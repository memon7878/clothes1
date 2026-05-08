/* ==========================================
   21andsaints — Main JS
   ========================================== */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ---- MOBILE MENU ----
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const spans = menuToggle.querySelectorAll('span');
        if (mobileMenu.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
        } else {
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuToggle.querySelectorAll('span').forEach(s => {
                s.style.transform = '';
                s.style.opacity = '';
            });
        });
    });
}

// ---- CUSTOM CURSOR ----
function initCursor() {
    if (window.innerWidth < 769) return;
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        ring.style.left = mouseX + 'px';
        ring.style.top = mouseY + 'px';
    });

    document.querySelectorAll('a, button, .card, .product-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.width = '54px';
            ring.style.height = '54px';
            ring.style.opacity = '0.6';
        });
        el.addEventListener('mouseleave', () => {
            ring.style.width = '36px';
            ring.style.height = '36px';
            ring.style.opacity = '1';
        });
    });
}

initCursor();

// ---- GSAP HERO ANIMATIONS ----
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-sub', {
        y: 30, opacity: 0, duration: 0.9, delay: 0.2, ease: 'power3.out'
    });

    gsap.from('.hero-title', {
        y: 80, opacity: 0, duration: 1.2, delay: 0.4, ease: 'power3.out'
    });

    gsap.from('.hero-desc', {
        y: 30, opacity: 0, duration: 0.9, delay: 0.9, ease: 'power3.out'
    });

    gsap.from('.hero-btn', {
        opacity: 0, y: 20, duration: 0.9, delay: 1.2, ease: 'power3.out'
    });

    gsap.from('.hero-scroll-hint', {
        opacity: 0, duration: 1, delay: 1.8
    });

    // Cards
    gsap.from('.card', {
        opacity: 0, y: 60, duration: 0.9, stagger: 0.18,
        scrollTrigger: { trigger: '.collection-preview', start: 'top 75%' }
    });

    // Section headers
    document.querySelectorAll('.section-header').forEach(el => {
        gsap.from(el, {
            opacity: 0, y: 40, duration: 0.8,
            scrollTrigger: { trigger: el, start: 'top 80%' }
        });
    });

    // Product cards
    gsap.from('.product-card', {
        opacity: 0, y: 50, duration: 0.8, stagger: 0.1,
        scrollTrigger: { trigger: '.product-grid', start: 'top 80%' }
    });

    // About sections
    gsap.from('.about-text', {
        opacity: 0, x: -50, duration: 1,
        scrollTrigger: { trigger: '.about-intro', start: 'top 70%' }
    });

    gsap.from('.about-img', {
        opacity: 0, x: 50, duration: 1,
        scrollTrigger: { trigger: '.about-intro', start: 'top 70%' }
    });

    gsap.from('.value-item', {
        opacity: 0, y: 40, duration: 0.8, stagger: 0.15,
        scrollTrigger: { trigger: '.about-values', start: 'top 80%' }
    });

    gsap.from('.team-card', {
        opacity: 0, y: 50, duration: 0.9, stagger: 0.18,
        scrollTrigger: { trigger: '.team-grid', start: 'top 80%' }
    });

    // Lookbook items
    gsap.from('.lb-item', {
        opacity: 0, scale: 0.95, duration: 0.8, stagger: 0.1,
        scrollTrigger: { trigger: '.lookbook-masonry', start: 'top 80%' }
    });

    // Banner text
    gsap.from('.banner-text', {
        opacity: 0, x: -40, duration: 1,
        scrollTrigger: { trigger: '.feature-banner', start: 'top 70%' }
    });

    // Lookbook teaser
    gsap.from('.lb-big', {
        opacity: 0, x: -40, duration: 1,
        scrollTrigger: { trigger: '.lookbook-teaser', start: 'top 75%' }
    });

    gsap.from('.lb-stack', {
        opacity: 0, x: 40, duration: 1,
        scrollTrigger: { trigger: '.lookbook-teaser', start: 'top 75%' }
    });

    // Product page
    gsap.from('.product-gallery', {
        opacity: 0, x: -40, duration: 1, delay: 0.2
    });

    gsap.from('.product-details', {
        opacity: 0, x: 40, duration: 1, delay: 0.4
    });

    // Contact
    gsap.from('.contact-info', {
        opacity: 0, x: -40, duration: 1, delay: 0.2
    });

    gsap.from('.contact-form-wrap', {
        opacity: 0, x: 40, duration: 1, delay: 0.4
    });
}

// ---- SCROLL REVEAL (fallback without GSAP) ----
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in, .stagger-children, .slide-left, .slide-right, .scale-in')
    .forEach(el => observer.observe(el));
