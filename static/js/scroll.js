/* ==========================================
   21andsaints — Smooth Scroll & Parallax
   ========================================== */

// Parallax on hero background
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const offset = window.scrollY;
    hero.style.backgroundPositionY = `calc(50% + ${offset * 0.3}px)`;
});

// Feature banner parallax
window.addEventListener('scroll', () => {
    const banner = document.querySelector('.feature-banner');
    if (!banner) return;
    const rect = banner.getBoundingClientRect();
    const offset = (window.scrollY - banner.offsetTop) * 0.2;
    banner.style.backgroundPositionY = `calc(50% + ${offset}px)`;
});
