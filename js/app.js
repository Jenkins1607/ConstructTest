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
    // Body class may already be set by the inline no-flash script in
    // <head>; this just brings the toggle buttons' ARIA state in sync
    // and wires up the click/keyboard handlers.
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
// PORTFOLIO GALLERY FILTERING (accessible tabs)
// ============================================

function initPortfolioFilter() {
    const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
    const panels = {
        electrical: document.getElementById('electrical-gallery'),
        plumbing: document.getElementById('plumbing-gallery'),
    };
    const liveRegion = document.getElementById('filterAnnouncer');

    if (filterButtons.length === 0) return;

    function activate(button, options) {
        const shouldFocus = options && options.focus;

        filterButtons.forEach(btn => {
            const isActive = btn === button;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            btn.tabIndex = isActive ? 0 : -1;
        });

        Object.keys(panels).forEach(key => {
            const panel = panels[key];
            if (!panel) return;
            panel.classList.toggle('active', key === button.dataset.filter);
        });

        if (liveRegion) {
            liveRegion.textContent = 'Показана категория: ' + button.textContent.trim();
        }

        if (shouldFocus) button.focus();
    }

    filterButtons.forEach((button, index) => {
        button.addEventListener('click', () => activate(button));

        button.addEventListener('keydown', (e) => {
            let newIndex = null;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                newIndex = (index + 1) % filterButtons.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                newIndex = (index - 1 + filterButtons.length) % filterButtons.length;
            } else if (e.key === 'Home') {
                newIndex = 0;
            } else if (e.key === 'End') {
                newIndex = filterButtons.length - 1;
            }

            if (newIndex !== null) {
                e.preventDefault();
                activate(filterButtons[newIndex], { focus: true });
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