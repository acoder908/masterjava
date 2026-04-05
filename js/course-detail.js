// Course Detail JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const courseSidebar = document.getElementById('courseSidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const moduleHeaders = document.querySelectorAll('.module-header');
    const notesTextarea = document.getElementById('notesTextarea');
    const notesSaved = document.getElementById('notesSaved');

    // Get current lesson from URL or default to lesson 1
    const currentLesson = getCurrentLesson();

    // Initialize
    initializeCourse();
    loadProgress();
    loadNotes();

    // Module Accordion
    moduleHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const module = this.parentElement;
            const lessons = module.querySelector('.module-lessons');
            const isActive = this.classList.contains('active');

            // Close all modules
            document.querySelectorAll('.module-header').forEach(h => {
                h.classList.remove('active');
            });
            document.querySelectorAll('.module-lessons').forEach(l => {
                l.classList.remove('active');
            });

            // Open clicked module if it wasn't active
            if (!isActive) {
                this.classList.add('active');
                lessons.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            courseSidebar.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeSidebar);
    }

    // Notes Auto-save
    if (notesTextarea) {
        let notesTimeout;
        notesTextarea.addEventListener('input', function () {
            clearTimeout(notesTimeout);
            notesTimeout = setTimeout(() => {
                saveNotes(this.value);
            }, 1000);
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // ESC to close sidebar
        if (e.key === 'Escape' && courseSidebar.classList.contains('active')) {
            closeSidebar();
        }

        // Ctrl/Cmd + S to save notes
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (notesTextarea) {
                saveNotes(notesTextarea.value);
                showNotesSaved();
            }
        }
    });
});

// Close Sidebar
function closeSidebar() {
    const courseSidebar = document.getElementById('courseSidebar');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    courseSidebar.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Get Current Lesson
function getCurrentLesson() {
    const path = window.location.pathname;
    const match = path.match(/lesson-(\d+)/);
    return match ? parseInt(match[1]) : 1;
}

// Initialize Course
function initializeCourse() {
    const currentLesson = getCurrentLesson();

    // Open the module containing current lesson
    const activeLesson = document.querySelector(`.lesson-item[href*="lesson-${currentLesson}"]`);
    if (activeLesson) {
        const module = activeLesson.closest('.module');
        if (module) {
            const moduleHeader = module.querySelector('.module-header');
            const moduleLessons = module.querySelector('.module-lessons');
            moduleHeader.classList.add('active');
            moduleLessons.classList.add('active');
        }
    }
}

// Load Progress
function loadProgress() {
    const savedProgress = localStorage.getItem('java-fundamentals-progress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);

        // Update completed lessons
        progress.completed.forEach(lessonNum => {
            const lessonItem = document.querySelector(`.lesson-item[href*="lesson-${lessonNum}"]`);
            if (lessonItem && !lessonItem.classList.contains('active')) {
                lessonItem.classList.add('completed');
            }
        });

        // Update progress bar
        updateProgressBar(progress.completed.length);
    }
}

// Save Progress
function saveProgress(lessonNum) {
    let progress = {
        completed: [],
        lastVisited: lessonNum,
        bookmark: null
    };

    const saved = localStorage.getItem('java-fundamentals-progress');
    if (saved) {
        progress = JSON.parse(saved);
    }

    if (!progress.completed.includes(lessonNum)) {
        progress.completed.push(lessonNum);
        progress.completed.sort((a, b) => a - b);
    }

    progress.lastVisited = lessonNum;
    localStorage.setItem('java-fundamentals-progress', JSON.stringify(progress));

    updateProgressBar(progress.completed.length);
}

// Update Progress Bar
function updateProgressBar(completedCount) {
    const totalLessons = 24;
    const percentage = Math.round((completedCount / totalLessons) * 100);

    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressStats = document.querySelector('.progress-stats');

    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressPercentage) progressPercentage.textContent = percentage + '%';
    if (progressStats) progressStats.textContent = `${completedCount} of ${totalLessons} lessons completed`;
}

// Mark as Complete
function markComplete() {
    const currentLesson = getCurrentLesson();
    const completeBtn = document.getElementById('completeBtn');

    saveProgress(currentLesson);

    // Update button
    if (completeBtn) {
        completeBtn.classList.add('completed');
        completeBtn.innerHTML = `
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
            Completed!
        `;
    }

    // Show success message
    showToast('Lesson marked as complete! 🎉');
}

// Toggle Bookmark
function toggleBookmark() {
    const currentLesson = getCurrentLesson();
    const bookmarkBtn = document.getElementById('bookmarkBtn');

    let progress = {
        completed: [],
        lastVisited: currentLesson,
        bookmark: null
    };

    const saved = localStorage.getItem('java-fundamentals-progress');
    if (saved) {
        progress = JSON.parse(saved);
    }

    if (progress.bookmark === currentLesson) {
        progress.bookmark = null;
        bookmarkBtn.classList.remove('bookmarked');
        bookmarkBtn.innerHTML = `
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
            </svg>
            Bookmark
        `;
        showToast('Bookmark removed');
    } else {
        progress.bookmark = currentLesson;
        bookmarkBtn.classList.add('bookmarked');
        bookmarkBtn.innerHTML = `
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2z"/>
            </svg>
            Bookmarked
        `;
        showToast('Lesson bookmarked! 📑');
    }

    localStorage.setItem('java-fundamentals-progress', JSON.stringify(progress));
}

// Load Notes
function loadNotes() {
    const currentLesson = getCurrentLesson();
    const notesTextarea = document.getElementById('notesTextarea');
    const notesCount = document.querySelector('.notes-count');

    const saved = localStorage.getItem(`lesson-${currentLesson}-notes`);
    if (saved && notesTextarea) {
        notesTextarea.value = saved;
        updateNotesCount(saved);
    }
}

// Save Notes
function saveNotes(content) {
    const currentLesson = getCurrentLesson();
    localStorage.setItem(`lesson-${currentLesson}-notes`, content);
    updateNotesCount(content);
    showNotesSaved();
}

// Update Notes Count
function updateNotesCount(content) {
    const notesCount = document.querySelector('.notes-count');
    if (notesCount) {
        const lines = content.trim().split('\n').filter(line => line.trim() !== '');
        const count = lines.length;
        notesCount.textContent = count === 1 ? '1 note' : `${count} notes`;
    }
}

// Show Notes Saved Indicator
function showNotesSaved() {
    const notesSaved = document.getElementById('notesSaved');
    if (notesSaved) {
        notesSaved.classList.add('show');
        setTimeout(() => {
            notesSaved.classList.remove('show');
        }, 2000);
    }
}

// Check Quiz
function checkQuiz() {
    const selected = document.querySelector('input[name="q1"]:checked');
    const result = document.getElementById('quizResult');

    if (!selected) {
        showToast('Please select an answer');
        return;
    }

    if (selected.value === 'b') {
        result.className = 'quiz-result correct';
        result.innerHTML = `
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style="display: inline; margin-right: 8px;">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
            Correct! WORA stands for "Write Once, Run Anywhere" - one of Java's key features.
        `;
    } else {
        result.className = 'quiz-result incorrect';
        result.innerHTML = `
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style="display: inline; margin-right: 8px;">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
            Not quite. The correct answer is "Write Once, Run Anywhere" - this means Java code can run on any platform with JVM.
        `;
    }
}

// Copy Code
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;

    navigator.clipboard.writeText(code).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
            Copied!
        `;

        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy code');
    });
}

// Show Toast Notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll to top when navigating
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Save scroll position
window.addEventListener('beforeunload', () => {
    const scrollPos = window.scrollY;
    sessionStorage.setItem('scrollPosition', scrollPos);
});

// Restore scroll position
window.addEventListener('load', () => {
    const scrollPos = sessionStorage.getItem('scrollPosition');
    if (scrollPos) {
        window.scrollTo(0, parseInt(scrollPos));
        sessionStorage.removeItem('scrollPosition');
    }
});


/* ========================================
   SIDEBAR MOBILE JAVASCRIPT
   Add to course-detail.js or create separate file
   ======================================== */

(function () {
    'use strict';

    console.log('📚 Sidebar mobile initializing...');

    /**
     * Initialize sidebar mobile functionality
     */
    function initSidebarMobile() {
        const sidebar = document.getElementById('courseSidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const sidebarClose = document.querySelector('.sidebar-close');

        if (!sidebar) {
            console.warn('⚠️ Sidebar not found');
            return;
        }

        console.log('✅ Sidebar found');

        // Create toggle button if doesn't exist
        if (!sidebarToggle) {
            createSidebarToggle();
        }

        // Create overlay if doesn't exist
        if (!sidebarOverlay) {
            createSidebarOverlay();
        }

        // Get elements after creation
        const toggle = document.getElementById('sidebarToggle');
        const overlay = document.getElementById('sidebarOverlay');
        const close = document.querySelector('.sidebar-close');

        // Open sidebar
        if (toggle) {
            toggle.addEventListener('click', function () {
                console.log('📖 Opening sidebar...');
                openSidebar();
            });
        }

        // Close sidebar
        if (close) {
            close.addEventListener('click', function () {
                console.log('❌ Closing sidebar...');
                closeSidebar();
            });
        }

        // Click overlay to close
        if (overlay) {
            overlay.addEventListener('click', function () {
                closeSidebar();
            });
        }

        // Close on ESC key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeSidebar();
            }
        });

        // Close on window resize to desktop
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                if (window.innerWidth > 1024) {
                    closeSidebar();
                }
            }, 250);
        });

        console.log('✅ Sidebar mobile initialized!');
    }

    /**
     * Create sidebar toggle button
     */
    function createSidebarToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'sidebarToggle';
        toggle.className = 'sidebar-toggle';
        toggle.setAttribute('aria-label', 'Toggle sidebar');
        toggle.innerHTML = '📚';
        document.body.appendChild(toggle);
        console.log('✅ Sidebar toggle button created');
    }

    /**
     * Create sidebar overlay
     */
    function createSidebarOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'sidebarOverlay';
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        console.log('✅ Sidebar overlay created');
    }

    /**
     * Open sidebar
     */
    function openSidebar() {
        const sidebar = document.getElementById('courseSidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (sidebar) sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.classList.add('sidebar-open');
    }

    /**
     * Close sidebar
     */
    function closeSidebar() {
        const sidebar = document.getElementById('courseSidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }

    /**
     * Module toggle functionality
     */
    function initModuleToggle() {
        const modules = document.querySelectorAll('.module-header');

        modules.forEach(function (header) {
            header.addEventListener('click', function () {
                const module = this.closest('.module');
                module.classList.toggle('active');
            });
        });

        console.log(`✅ ${modules.length} module toggles initialized`);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initSidebarMobile();
            initModuleToggle();
        });
    } else {
        initSidebarMobile();
        initModuleToggle();
    }

})();