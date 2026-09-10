// ============================================
// DARK MODE THEME TOGGLE
// ============================================

const THEME_KEY = 'user-theme-preference';
const THEME_AUTO = 'theme-auto';
const THEME_DARK = 'theme-dark';
const THEME_LIGHT = 'theme-light';

function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return THEME_AUTO;
}

function applyTheme(theme) {
    document.body.className = theme;
    const toggleButtons = document.querySelectorAll('.theme-toggle, .theme-toggle-mobile');
    const isDark = theme === THEME_DARK || (theme === THEME_AUTO && window.matchMedia('(prefers-color-scheme: dark)').matches);

    toggleButtons.forEach(button => {
        button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        button.setAttribute('aria-label', isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему');
    });
}

function toggleTheme() {
    const currentTheme = document.body.className || THEME_AUTO;
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
}

function initTheme() {
    applyTheme(getPreferredTheme());

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (document.body.className === THEME_AUTO) applyTheme(THEME_AUTO);
        });
    }

    document.querySelectorAll('.theme-toggle, .theme-toggle-mobile').forEach(button => {
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
// PORTFOLIO GALLERY FILTERING
// ============================================

function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const electricalGallery = document.getElementById('electrical-gallery');
    const plumbingGallery = document.getElementById('plumbing-gallery');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            if (this.dataset.filter === 'electrical') {
                electricalGallery?.classList.add('active');
                plumbingGallery?.classList.remove('active');
            } else {
                plumbingGallery?.classList.add('active');
                electricalGallery?.classList.remove('active');
            }
        });
    });
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initPortfolioFilter();
});