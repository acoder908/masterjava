// ========================================
// DOM Ready Wrapper (Important)
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // Filter Functionality
    // ========================================

    const filterButtons = document.querySelectorAll('.filter-btn');
    const tutorialCards = document.querySelectorAll('.tutorial-card');

    if (filterButtons.length && tutorialCards.length) {

        filterButtons.forEach(btn => {

            btn.addEventListener('click', function () {

                // Remove active class
                filterButtons.forEach(b =>
                    b.classList.remove('active')
                );

                // Add active class
                this.classList.add('active');

                const filter =
                    this.getAttribute('data-filter');

                tutorialCards.forEach(card => {

                    const level =
                        card.getAttribute('data-level');

                    if (
                        filter === 'all' ||
                        level === filter
                    ) {
                        card.classList.remove('hidden');
                        card.style.animation =
                            'fadeInUp 0.5s ease';
                    } else {
                        card.classList.add('hidden');
                    }

                });

            });

        });

    }

    // ========================================
    // Search Functionality
    // ========================================

    const searchTutorialInput =
        document.getElementById('searchTutorials');

    const searchIcon =
        document.querySelector('.search-icon');

    function searchTutorials() {

        if (!searchTutorialInput) return;

        const searchTerm =
            searchTutorialInput.value
                .toLowerCase()
                .trim();

        tutorialCards.forEach(card => {

            const title =
                card.querySelector('h3')
                    .textContent
                    .toLowerCase();

            const description =
                card.querySelector('p')
                    .textContent
                    .toLowerCase();

            if (
                title.includes(searchTerm) ||
                description.includes(searchTerm)
            ) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }

        });

        // Reset filters
        if (searchTerm && filterButtons.length) {
            filterButtons.forEach(btn =>
                btn.classList.remove('active')
            );
        }

    }

    if (searchTutorialInput) {

        searchTutorialInput.addEventListener(
            'input',
            searchTutorials
        );

        searchTutorialInput.addEventListener(
            'keypress',
            (e) => {
                if (e.key === 'Enter') {
                    searchTutorials();
                }
            }
        );

    }

    if (searchIcon) {
        searchIcon.addEventListener(
            'click',
            searchTutorials
        );
    }

    // ========================================
    // Start Course Buttons
    // ========================================

    const startButtons =
        document.querySelectorAll('.btn-start');

    if (startButtons.length) {

        startButtons.forEach(btn => {

            btn.addEventListener('click', function () {

                const card =
                    this.closest('.tutorial-card');

                if (!card) return;

                const courseName =
                    card.querySelector('h3')
                        .textContent;

                alert(
                    `Starting course: ${courseName}\n\nCourse content coming soon!`
                );

            });

        });

    }

    // ========================================
    // Learning Path Buttons
    // ========================================

    const pathButtons =
        document.querySelectorAll('.btn-path');

    if (pathButtons.length) {

        pathButtons.forEach(btn => {

            btn.addEventListener('click', function () {

                const pathCard =
                    this.closest('.path-card');

                if (!pathCard) return;

                const pathName =
                    pathCard.querySelector('h3')
                        .textContent;

                if (
                    pathName.includes('Beginner') &&
                    filterButtons[1]
                ) {
                    filterButtons[1].click();
                }

                else if (
                    pathName.includes('Intermediate') &&
                    filterButtons[2]
                ) {
                    filterButtons[2].click();
                }

                else if (
                    pathName.includes('Advanced') &&
                    filterButtons[3]
                ) {
                    filterButtons[3].click();
                }

                const section =
                    document.querySelector(
                        '.tutorials-section'
                    );

                if (section) {

                    section.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                }

            });

        });

    }

    // ========================================
    // Card Hover Animation
    // ========================================

    if (tutorialCards.length) {

        tutorialCards.forEach(card => {

            card.addEventListener(
                'mouseenter',
                function () {
                    this.style.transform =
                        'translateY(-8px) scale(1.02)';
                }
            );

            card.addEventListener(
                'mouseleave',
                function () {
                    this.style.transform =
                        'translateY(0) scale(1)';
                }
            );

        });

    }

    // ========================================
    // Scroll Animation
    // ========================================

    if (tutorialCards.length) {

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const cardObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry, index) => {

                            if (entry.isIntersecting) {

                                setTimeout(() => {

                                    entry.target.style.opacity = '1';
                                    entry.target.style.transform =
                                        'translateY(0)';

                                }, index * 100);

                                cardObserver.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                observerOptions
            );

        tutorialCards.forEach(card => {

            card.style.opacity = '0';

            card.style.transform =
                'translateY(30px)';

            card.style.transition =
                'opacity 0.6s ease, transform 0.6s ease';

            cardObserver.observe(card);

        });

    }

    // ========================================
    // Keyboard Navigation
    // ========================================

    document.addEventListener(
        'keydown',
        (e) => {

            if (!searchTutorialInput) return;

            if (
                e.key === '/' &&
                document.activeElement !==
                    searchTutorialInput
            ) {
                e.preventDefault();
                searchTutorialInput.focus();
            }

            if (
                e.key === 'Escape' &&
                document.activeElement ===
                    searchTutorialInput
            ) {
                searchTutorialInput.value = '';
                searchTutorials();
                searchTutorialInput.blur();
            }

        }
    );

    console.log(
        "Tutorials page initialized successfully"
    );

});


// ========================================
// Progress Bar Animation (Window Load)
// ========================================

window.addEventListener(
    'load',
    () => {

        const progressBars =
            document.querySelectorAll(
                '.progress-fill'
            );

        progressBars.forEach(bar => {

            const progress =
                bar.getAttribute(
                    'data-progress'
                );

            setTimeout(() => {

                bar.style.width =
                    progress + '%';

            }, 300);

        });

    }
);


// ========================================
// Progress Tracking (localStorage)
// ========================================

function loadProgress() {

    const tutorialCards =
        document.querySelectorAll(
            '.tutorial-card'
        );

    tutorialCards.forEach(
        (card, index) => {

            const courseId =
                `course_${index}`;

            const savedProgress =
                localStorage.getItem(
                    courseId
                );

            if (savedProgress) {

                const progressBar =
                    card.querySelector(
                        '.progress-fill'
                    );

                const progressText =
                    card.querySelector(
                        '.progress-text'
                    );

                const progress =
                    parseInt(savedProgress);

                progressBar.setAttribute(
                    'data-progress',
                    progress
                );

                progressBar.style.width =
                    progress + '%';

                if (progress === 0) {

                    progressText.textContent =
                        'Not Started';

                }

                else if (progress === 100) {

                    progressText.textContent =
                        '✓ Completed';

                    progressText.style.color =
                        '#00ff88';

                }

                else {

                    progressText.textContent =
                        progress + '% Complete';

                }

            }

        }
    );

}

loadProgress();