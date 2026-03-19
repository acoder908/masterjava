// ========================================
// Theme System
// ========================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme or default to dark (JavaCraft style)
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ========================================
// Cookie Consent
// ========================================
const cookieConsent = document.getElementById('cookieConsent');
const acceptCookies = document.getElementById('acceptCookies');

if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
        cookieConsent.classList.add('show');
    }, 1000);
}

acceptCookies.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieConsent.classList.remove('show');
});

// ========================================
// Mobile Menu
// ========================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// ========================================
// Search Functionality
// ========================================
const searchBtn = document.querySelector('.search-btn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.querySelector('.search-close');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Sample search data (သင့် actual content နဲ့ replace လုပ်ပါ)
const searchData = [
    { title: 'Java Best Practices', category: 'Tutorial', url: '#' },
    { title: 'Understanding OOP', category: 'Guide', url: '#' },
    { title: 'Data Structures in Java', category: 'Advanced', url: '#' },
    { title: 'Getting Started with Java', category: 'Beginner', url: '#' },
    { title: 'Java Collections Framework', category: 'Intermediate', url: '#' },
];

searchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    searchInput.focus();
});

searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
});

// Search input handler
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }

    const results = searchData.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        searchResults.innerHTML = '<p style="padding: 1rem; color: #64748b;">No results found</p>';
        return;
    }

    searchResults.innerHTML = results.map(item => `
        <a href="${item.url}" style="display: block; padding: 1rem; border-bottom: 1px solid #e2e8f0; color: #1e293b; transition: background 0.2s;">
            <strong>${item.title}</strong>
            <br>
            <small style="color: #64748b;">${item.category}</small>
        </a>
    `).join('');
});

// Close search on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
});

// ========================================
// Smooth Scroll for Navigation
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// ========================================
// Active Navigation Link
// ========================================
const sections = document.querySelectorAll('section[id]');
const navLinksArray = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========================================
// Code Playground
// ========================================
const codeEditor = document.getElementById('codeEditor');
const codeOutput = document.getElementById('codeOutput');
const btnRun = document.querySelector('.btn-run');
const btnClear = document.querySelector('.btn-clear');

btnRun.addEventListener('click', () => {
    const code = codeEditor.value;

    // Simple simulation (စစ်မှန်တဲ့ Java compiler မဟုတ်ပါ)
    codeOutput.innerHTML = '<p style="color: #4ade80;">✓ Code executed successfully!</p>';

    // ရိုးရှင်းတဲ့ output simulation
    if (code.includes('System.out.println')) {
        const match = code.match(/System\.out\.println\("(.+?)"\)/);
        if (match) {
            codeOutput.innerHTML += `<p style="margin-top: 1rem; font-family: 'JetBrains Mono', monospace;">${match[1]}</p>`;
        }
    } else {
        codeOutput.innerHTML += '<p style="margin-top: 1rem; color: #94a3b8;">No output</p>';
    }
});

btnClear.addEventListener('click', () => {
    codeOutput.innerHTML = '<p class="output-placeholder">Press "Run Code" to see the output...</p>';
});

// ========================================
// Newsletter Form
// ========================================
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;

    // သင့် backend API နဲ့ connect လုပ်ပါ
    alert(`✓ Thank you for subscribing! We'll send updates to ${email}`);
    e.target.reset();
});

// ========================================
// Bookmark & Share Functionality
// ========================================
document.querySelectorAll('.btn-bookmark').forEach(btn => {
    btn.addEventListener('click', function () {
        const isBookmarked = this.textContent === '🔖';
        this.textContent = isBookmarked ? '✅' : '🔖';

        // localStorage မှာ save လုပ်နိုင်ပါတယ်
        if (!isBookmarked) {
            alert('Article bookmarked!');
        }
    });
});

document.querySelectorAll('.btn-share').forEach(btn => {
    btn.addEventListener('click', async function () {
        const title = this.closest('.blog-card').querySelector('h3').textContent;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: 'Check out this article from A Coder',
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    });
});

// ========================================
// Scroll to Top Button
// ========================================
const scrollToTop = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTop.classList.add('show');
    } else {
        scrollToTop.classList.remove('show');
    }
});

scrollToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// Reading Progress Bar
// ========================================
const readingProgress = document.getElementById('readingProgress');

window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
    readingProgress.style.width = progress + '%';
});

// ========================================
// Lazy Loading Images
// ========================================
const images = document.querySelectorAll('img[loading="lazy"]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ========================================
// Category Card Animations on Scroll
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.category-card, .blog-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(card);
});

// ========================================
// Navbar Background on Scroll
// ========================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// ========================================
// Category Cards Click
// ========================================
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function () {
        const category = this.querySelector('h3').textContent;
        // Navigate to tutorials page with filter
        window.location.href = 'pages/tutorials.html';
    });
});

// ========================================
// Performance: Debounce Function
// ========================================
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

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    // Scroll-based animations ကို ဒီမှာ ထည့်နိုင်ပါတယ်
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ========================================
// Initialize Google AdSense (when you get approved)
// ========================================
// AdSense approved ရင် uncomment လုပ်ပါ
/*
(adsbygoogle = window.adsbygoogle || []).push({});
*/

console.log('A Coder - Website initialized successfully! 🚀');