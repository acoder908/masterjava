// ========================================
// Filter Functionality
// ========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const tutorialCards = document.querySelectorAll('.tutorial-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));

        // Add active class to clicked button
        this.classList.add('active');

        // Get filter value
        const filter = this.getAttribute('data-filter');

        // Filter cards
        tutorialCards.forEach(card => {
            const level = card.getAttribute('data-level');

            if (filter === 'all' || level === filter) {
                card.classList.remove('hidden');
                // Animate in
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ========================================
// Search Functionality
// ========================================
const searchInput = document.getElementById('searchTutorials');
const searchIcon = document.querySelector('.search-icon');

function searchTutorials() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    tutorialCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    // Reset filter buttons
    if (searchTerm) {
        filterButtons.forEach(btn => btn.classList.remove('active'));
    }
}

searchInput.addEventListener('input', searchTutorials);
searchIcon.addEventListener('click', searchTutorials);

// Enter key to search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchTutorials();
    }
});

// ========================================
// Progress Bar Animation on Load
// ========================================
function animateProgress() {
    const progressBars = document.querySelectorAll('.progress-fill');

    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, 300);
    });
}

// Animate on page load
window.addEventListener('load', animateProgress);

// ========================================
// Start Course Buttons
// ========================================
const startButtons = document.querySelectorAll('.btn-start');

startButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        const card = this.closest('.tutorial-card');
        const courseName = card.querySelector('h3').textContent;

        // သင့် course page သို့ navigate လုပ်ပါ
        alert(`Starting course: ${courseName}\n\nCourse content coming soon!`);

        // Real implementation:
        // window.location.href = 'course-detail.html?course=' + courseId;
    });
});

// ========================================
// Learning Path Buttons
// ========================================
const pathButtons = document.querySelectorAll('.btn-path');

pathButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        const pathCard = this.closest('.path-card');
        const pathName = pathCard.querySelector('h3').textContent;

        // Filter tutorials based on path
        if (pathName.includes('Beginner')) {
            filterButtons[1].click(); // Click Beginner filter
        } else if (pathName.includes('Intermediate')) {
            filterButtons[2].click(); // Click Intermediate filter
        } else if (pathName.includes('Advanced')) {
            filterButtons[3].click(); // Click Advanced filter
        }

        // Scroll to tutorials
        document.querySelector('.tutorials-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// ========================================
// Card Hover Animation Enhancement
// ========================================
tutorialCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ========================================
// Scroll Animation for Cards
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            cardObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply animation to cards
tutorialCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
});

// ========================================
// Stats Counter Animation
// ========================================
function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 30);
}

// Animate stats when visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statBoxes = document.querySelectorAll('.stat-box h3');
            const targets = [100, 15, 50, 4.8];
            const suffixes = ['+', '+', 'K+', '★'];

            statBoxes.forEach((stat, index) => {
                animateCounter(stat, targets[index], suffixes[index]);
            });

            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.tutorials-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ========================================
// Keyboard Navigation
// ========================================
document.addEventListener('keydown', (e) => {
    // Press '/' to focus search
    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
    }

    // Press 'Escape' to clear search
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchTutorials();
        searchInput.blur();
    }
});

// ========================================
// Progress Tracking (localStorage)
// ========================================
function loadProgress() {
    tutorialCards.forEach((card, index) => {
        const courseId = `course_${index}`;
        const savedProgress = localStorage.getItem(courseId);

        if (savedProgress) {
            const progressBar = card.querySelector('.progress-fill');
            const progressText = card.querySelector('.progress-text');
            const progress = parseInt(savedProgress);

            progressBar.setAttribute('data-progress', progress);
            progressBar.style.width = progress + '%';

            if (progress === 0) {
                progressText.textContent = 'Not Started';
            } else if (progress === 100) {
                progressText.textContent = '✓ Completed';
                progressText.style.color = '#00ff88';
            } else {
                progressText.textContent = progress + '% Complete';
            }
        }
    });
}

// Load saved progress on page load
loadProgress();

// ========================================
// Tutorial Card Click Tracking
// ========================================
tutorialCards.forEach(card => {
    card.addEventListener('click', function (e) {
        // Don't trigger if clicking button
        if (e.target.tagName === 'BUTTON') return;

        const courseName = this.querySelector('h3').textContent;
        console.log('Clicked course:', courseName);

        // Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'course_click', {
                'event_category': 'Tutorials',
                'event_label': courseName
            });
        }
    });
});

console.log('Tutorials page initialized! 📚');