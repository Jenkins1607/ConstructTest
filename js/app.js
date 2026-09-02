/**
 * Main JavaScript file for website functionality
 * Includes: Dark mode toggle, Mobile menu, Form validation, Lazy loading, Portfolio filter
 */

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
        button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
}

function toggleTheme() {
    const currentTheme = document.body.className || THEME_AUTO;
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
}

function initTheme() {
    const theme = getPreferredTheme();
    applyTheme(theme);

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
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
// MOBILE MENU TOGGLE
// ============================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
            this.setAttribute('aria-expanded', mainNav.classList.contains('active'));
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-load');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.addEventListener('load', () => img.classList.add('loaded'));
                        observer.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '50px' });
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            }
        });
    }
}

// ============================================
// CONTACT FORM VALIDATION & SUBMISSION
// ============================================

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    formGroup.classList.add('error');
    if (errorElement) errorElement.textContent = message;
}

function clearError(field) {
    field.closest('.form-group').classList.remove('error');
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    clearError(field);

    if (!value) {
        showError(field, 'This field is required');
        return false;
    }

    switch (fieldName) {
        case 'name':
            if (value.length < 2 || value.length > 100) {
                showError(field, 'Name must be 2-100 characters');
                return false;
            }
            break;
        case 'email':
            if (!isValidEmail(value) || value.length > 150) {
                showError(field, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'subject':
            if (value.length < 3 || value.length > 150) {
                showError(field, 'Subject must be 3-150 characters');
                return false;
            }
            break;
        case 'message':
            if (value.length < 10 || value.length > 2000) {
                showError(field, 'Message must be 10-2000 characters');
                return false;
            }
            break;
    }
    return true;
}

function generateCSRFToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function showFormResponse(message, type) {
    const responseElement = document.getElementById('form-response');
    if (responseElement) {
        responseElement.textContent = message;
        responseElement.className = 'form-response ' + type;
        responseElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        if (type === 'success') {
            setTimeout(() => { responseElement.style.display = 'none'; }, 5000);
        }
    }
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const csrfTokenField = document.getElementById('csrf_token');
    if (csrfTokenField) {
        csrfTokenField.value = generateCSRFToken();
        sessionStorage.setItem('csrf_token', csrfTokenField.value);
    }

    const formFields = contactForm.querySelectorAll('input[required], textarea[required]');
    formFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.closest('.form-group').classList.contains('error')) clearError(field);
        });
    });

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        let isValid = true;
        formFields.forEach(field => { if (!validateField(field)) isValid = false; });

        if (!isValid) {
            showFormResponse('Please correct the errors above', 'error');
            return;
        }

        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            const response = await fetch('php/contact.php', { method: 'POST', body: formData });
            const result = await response.json();

            if (result.success) {
                showFormResponse(result.message, 'success');
                contactForm.reset();
                if (csrfTokenField) {
                    csrfTokenField.value = generateCSRFToken();
                    sessionStorage.setItem('csrf_token', csrfTokenField.value);
                }
            } else {
                showFormResponse(result.message || 'An error occurred. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFormResponse('Network error. Please check your connection and try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

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
            const filterValue = this.dataset.filter;

            if (filterValue === 'electrical') {
                if (electricalGallery) electricalGallery.classList.add('active');
                if (plumbingGallery) plumbingGallery.classList.remove('active');
            } else if (filterValue === 'plumbing') {
                if (electricalGallery) electricalGallery.classList.remove('active');
                if (plumbingGallery) plumbingGallery.classList.add('active');
            }
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
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// INITIALIZE ALL FUNCTIONS ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initLazyLoading();
    initContactForm();
    initPortfolioFilter();
    initSmoothScroll();
    console.log('Website initialized successfully');
});

// ============================================
// UTILITY: DEBOUNCE FUNCTION
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('resize', debounce(function () {
    console.log('Window resized');
}, 250));