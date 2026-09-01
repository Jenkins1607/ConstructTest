// Portfolio Single Page - JavaScript
// Includes: Dark mode toggle, Mobile menu, Gallery filter, Lightbox, Smooth scroll

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
// GALLERY FILTER
// ============================================

function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryCategories = document.querySelectorAll('.gallery-category');
    const categoryLinks = document.querySelectorAll('.project-categories a[data-category]');
    
    if (filterButtons.length === 0) return;
    
    // Функция фильтрации
    function filterGallery(filterValue) {
        // Обновляем активные кнопки фильтров
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filterValue) {
                btn.classList.add('active');
            }
        });
        
        // Показываем/скрываем категории галереи
        galleryCategories.forEach(category => {
            if (category.dataset.category === filterValue) {
                category.style.display = 'grid';
                setTimeout(() => {
                    category.style.opacity = '1';
                }, 10);
            } else {
                category.style.display = 'none';
                category.style.opacity = '0';
            }
        });
    }
    
    // Обработчики для кнопок фильтров
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterGallery(this.dataset.filter);
        });
    });
    
    // Обработчики для ссылок в футере
    categoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.dataset.category;
            filterGallery(category);
            
            // Прокрутка к секции портфолио
            const portfolioSection = document.getElementById('portfolio');
            if (portfolioSection) {
                portfolioSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// LIGHTBOX GALLERY
// ============================================

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentImages = [];
    let currentIndex = 0;
    
    // Функция открытия лайтбокса
    function openLightbox(imgSrc, caption, images) {
        currentImages = images;
        currentIndex = images.indexOf(imgSrc);
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Функция закрытия лайтбокса
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Функция показа следующего изображения
    function showNext() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex];
        const currentItem = document.querySelector(`[data-src="${currentImages[currentIndex]}"]`);
        if (currentItem) {
            const img = currentItem.querySelector('img');
            lightboxCaption.textContent = img.alt;
        }
    }
    
    // Функция показа предыдущего изображения
    function showPrev() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex];
        const currentItem = document.querySelector(`[data-src="${currentImages[currentIndex]}"]`);
        if (currentItem) {
            const img = currentItem.querySelector('img');
            lightboxCaption.textContent = img.alt;
        }
    }
    
    // Обработчики событий
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    
    // Закрытие по клику вне изображения
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
        if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
            showNext();
        }
        if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
            showPrev();
        }
    });
    
    // Обработчики для изображений галереи
    function initGalleryItems() {
        const activeCategory = document.querySelector('.gallery-category[style="display: grid;"], .gallery-category:not([style*="display: none"])');
        if (!activeCategory) return;
        
        const galleryItems = activeCategory.querySelectorAll('.gallery-item');
        const images = Array.from(galleryItems).map(item => item.dataset.src);
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const src = this.dataset.src;
                const caption = img.alt;
                openLightbox(src, caption, images);
            });
        });
    }
    
    // Переинициализация при переключении фильтров
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(initGalleryItems, 300);
        });
    });
    
    // Инициализация при загрузке
    initGalleryItems();
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
    initGalleryFilter();
    initLightbox();
    initSmoothScroll();
    console.log('Portfolio website initialized successfully');
});
