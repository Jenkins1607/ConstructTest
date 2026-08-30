// Portfolio Single Page - JavaScript
// Includes: Dark mode toggle, Mobile menu, Portfolio filter, Smooth scroll

// ============================================
// DARK MODE THEME TOGGLE
// ============================================

const THEME_KEY = 'user-theme-preference';
const THEME_AUTO = 'theme-auto';
const THEME_DARK = 'theme-dark';
const THEME_LIGHT = 'theme-light';

function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
        return stored;
    }
    return THEME_AUTO;
}

function applyTheme(theme) {
    document.body.className = theme;
    const toggleButtons = document.querySelectorAll('.theme-toggle, .theme-toggle-mobile');
    const isDark = theme === THEME_DARK ||
        (theme === THEME_AUTO && window.matchMedia('(prefers-color-scheme: dark)').matches);
    toggleButtons.forEach(button => {
        button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
}

function toggleTheme() {
    const currentTheme = document.body.className || THEME_AUTO;
    let newTheme;
    if (currentTheme === THEME_DARK) {
        newTheme = THEME_LIGHT;
    } else {
        newTheme = THEME_DARK;
    }
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
}

function initTheme() {
    const theme = getPreferredTheme();
    applyTheme(theme);
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (document.body.className === THEME_AUTO) {
                applyTheme(THEME_AUTO);
            }
        });
    }
    const toggleButtons = document.querySelectorAll('.theme-toggle, .theme-toggle-mobile');
    toggleButtons.forEach(button => {
        button.addEventListener('click', toggleTheme);
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    });
}

initTheme();

// ============================================
// MOBILE MENU TOGGLE
// ============================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
            const isExpanded = mainNav.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ============================================
// PORTFOLIO FILTER
// ============================================

function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    if (filterButtons.length === 0) return;
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filterValue = this.dataset.filter;
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.dataset.category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initPortfolioFilter();
    initSmoothScroll();
    console.log('Portfolio website initialized successfully');
});
