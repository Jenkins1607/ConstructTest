// UPDATED: Added Dark Mode Theme Toggle with localStorage persistence
/**
 * Main JavaScript file for website functionality
 * Includes: Dark mode toggle, Mobile menu, Form validation, Lazy loading
 */

// ============================================
// DARK MODE THEME TOGGLE
// ============================================

const THEME_KEY = 'user-theme-preference';
const THEME_AUTO = 'theme-auto';
const THEME_DARK = 'theme-dark';
const THEME_LIGHT = 'theme-light';

/**
 * Get user's theme preference from localStorage or OS
 * @returns {string} Theme class name
 */
function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
        return stored;
    }
    return THEME_AUTO;
}

/**
 * Apply theme to document
 * @param {string} theme - Theme class name
 */
function applyTheme(theme) {
    document.body.className = theme;

    // Update all toggle buttons
    const toggleButtons = document.querySelectorAll('.theme-toggle, .theme-toggle-mobile');
    const isDark = theme === THEME_DARK ||
        (theme === THEME_AUTO && window.matchMedia('(prefers-color-scheme: dark)').matches);

    toggleButtons.forEach(button => {
        button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
}

/**
 * Toggle between light and dark themes
 */
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

/**
 * Initialize theme on page load
 */
function initTheme() {
    const theme = getPreferredTheme();
    applyTheme(theme);

    // Listen for OS theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (document.body.className === THEME_AUTO) {
                applyTheme(THEME_AUTO);
            }
        });
    }

    // Add click handlers to all theme toggle buttons
    const toggleButtons = document.querySelectorAll('.theme-toggle, .theme-toggle-mobile');
    toggleButtons.forEach(button => {
        button.addEventListener('click', toggleTheme);

        // Keyboard support
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    });
}

// Initialize theme IMMEDIATELY (before DOM ready)
initTheme();

// ============================================
// MOBILE MENU TOGGLE
// ============================================

/**
 * Initialize mobile menu functionality
 * Toggles the navigation menu on mobile devices
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            // Toggle active class on navigation
            mainNav.classList.toggle('active');

            // Animate hamburger icon
            this.classList.toggle('active');

            // Update aria-expanded for accessibility
            const isExpanded = mainNav.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking on a nav link
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
// LAZY LOADING FOR IMAGES
// ============================================

/**
 * Lazy load images for better performance
 * Uses Intersection Observer API to load images when they enter viewport
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-load');

    if ('IntersectionObserver' in window) {
        // Create intersection observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Replace src with data-src
                    if (img.dataset.src) {
                        img.src = img.dataset.src;

                        // Add loaded class when image loads
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });

                        // Stop observing this image
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            // Load images 50px before they enter viewport
            rootMargin: '50px'
        });

        // Observe all lazy load images
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
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

/**
 * Validate email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show error message for a form field
 * @param {HTMLElement} field - Input field element
 * @param {string} message - Error message to display
 */
function showError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');

    formGroup.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Clear error message for a form field
 * @param {HTMLElement} field - Input field element
 */
function clearError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
}

/**
 * Validate individual form field
 * @param {HTMLElement} field - Input field to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    // Clear previous errors
    clearError(field);

    // Check if field is empty
    if (!value) {
        showError(field, 'This field is required');
        return false;
    }

    // Validate based on field type
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                showError(field, 'Name must be at least 2 characters');
                return false;
            }
            if (value.length > 100) {
                showError(field, 'Name must not exceed 100 characters');
                return false;
            }
            break;

        case 'email':
            if (!isValidEmail(value)) {
                showError(field, 'Please enter a valid email address');
                return false;
            }
            if (value.length > 150) {
                showError(field, 'Email must not exceed 150 characters');
                return false;
            }
            break;

        case 'subject':
            if (value.length < 3) {
                showError(field, 'Subject must be at least 3 characters');
                return false;
            }
            if (value.length > 150) {
                showError(field, 'Subject must not exceed 150 characters');
                return false;
            }
            break;

        case 'message':
            if (value.length < 10) {
                showError(field, 'Message must be at least 10 characters');
                return false;
            }
            if (value.length > 2000) {
                showError(field, 'Message must not exceed 2000 characters');
                return false;
            }
            break;
    }

    return true;
}

/**
 * Generate a simple CSRF token
 * In production, this should be generated server-side
 * @returns {string} - Random token string
 */
function generateCSRFToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Show form response message
 * @param {string} message - Message to display
 * @param {string} type - Type of message ('success' or 'error')
 */
function showFormResponse(message, type) {
    const responseElement = document.getElementById('form-response');
    if (responseElement) {
        responseElement.textContent = message;
        responseElement.className = 'form-response ' + type;

        // Scroll to response message
        responseElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                responseElement.style.display = 'none';
            }, 5000);
        }
    }
}

/**
 * Initialize contact form validation and submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    // Generate and set CSRF token
    const csrfTokenField = document.getElementById('csrf_token');
    if (csrfTokenField) {
        csrfTokenField.value = generateCSRFToken();
        // Store token in sessionStorage for verification
        sessionStorage.setItem('csrf_token', csrfTokenField.value);
    }

    // Get all form fields
    const formFields = contactForm.querySelectorAll('input[required], textarea[required]');

    // Add real-time validation on blur
    formFields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });

        // Clear error on input
        field.addEventListener('input', () => {
            if (field.closest('.form-group').classList.contains('error')) {
                clearError(field);
            }
        });
    });

    // Handle form submission
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        formFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showFormResponse('Please correct the errors above', 'error');
            return;
        }

        // Prepare form data
        const formData = new FormData(contactForm);

        // Disable submit button to prevent double submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            // Send AJAX request to PHP backend
            const response = await fetch('php/contact.php', {
                method: 'POST',
                body: formData
            });

            // Parse JSON response
            const result = await response.json();

            if (result.success) {
                // Show success message
                showFormResponse(result.message, 'success');

                // Reset form
                contactForm.reset();

                // Generate new CSRF token
                if (csrfTokenField) {
                    csrfTokenField.value = generateCSRFToken();
                    sessionStorage.setItem('csrf_token', csrfTokenField.value);
                }
            } else {
                // Show error message
                showFormResponse(result.message || 'An error occurred. Please try again.', 'error');
            }
        } catch (error) {
            // Handle network or parsing errors
            console.error('Form submission error:', error);
            showFormResponse('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// ============================================
// PORTFOLIO GALLERY TAB SWITCHING (FOTORAMA)
// ============================================

/**
 * Initialize portfolio gallery tab switching for Electrical and Plumbing
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const electricalGallery = document.getElementById('electrical-gallery');
    const plumbingGallery = document.getElementById('plumbing-gallery');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value
            const filterValue = this.dataset.filter;

            // Show/hide galleries based on selection
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

/**
 * Add smooth scrolling to all anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
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
// INITIALIZE ALL FUNCTIONS ON PAGE LOAD
// ============================================

/**
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function () {
    // Initialize mobile menu
    initMobileMenu();

    // Initialize lazy loading for images
    initLazyLoading();

    // Initialize contact form (only on contact page)
    initContactForm();

    // Initialize portfolio filter (only on portfolio page)
    initPortfolioFilter();

    // Initialize smooth scroll
    initSmoothScroll();

    console.log('Website initialized successfully');
});

// ============================================
// UTILITY: DEBOUNCE FUNCTION
// ============================================

/**
 * Debounce function to limit rate of function execution
 * Useful for scroll and resize events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
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

// Example usage for window resize
window.addEventListener('resize', debounce(function () {
    // Handle resize events here if needed
    console.log('Window resized');
}, 250));
