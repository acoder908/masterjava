// ========================================
// Table of Contents - Active Link Highlighting
// ========================================
const tocLinks = document.querySelectorAll('.toc-link');
const sections = document.querySelectorAll('.article-content section[id]');

function highlightTOC() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightTOC);

// Smooth scroll for TOC links
tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const offset = 100;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Copy Code Button
// ========================================
document.querySelectorAll('.copy-code-btn').forEach(button => {
    button.addEventListener('click', function () {
        const codeBlock = this.closest('.code-block');
        const code = codeBlock.querySelector('code').textContent;

        navigator.clipboard.writeText(code).then(() => {
            const originalText = this.textContent;
            this.textContent = '✓ Copied!';
            this.style.background = '#4ade80';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy code');
        });
    });
});

// ========================================
// Share Functionality
// ========================================
const pageUrl = window.location.href;
const pageTitle = document.querySelector('.article-title').textContent;

// Sidebar share buttons
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const platform = this.classList.contains('facebook') ? 'facebook' :
            this.classList.contains('twitter') ? 'twitter' :
                this.classList.contains('linkedin') ? 'linkedin' : 'copy';

        shareArticle(platform);
    });
});

// Footer share button
document.querySelector('.share-btn-footer')?.addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: pageTitle,
            url: pageUrl
        }).catch(err => console.log('Share cancelled'));
    } else {
        shareArticle('copy');
    }
});

function shareArticle(platform) {
    let shareUrl = '';

    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;

        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;

        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;

        case 'copy':
            navigator.clipboard.writeText(pageUrl).then(() => {
                alert('✓ Link copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
            break;
    }
}

// ========================================
// Bookmark Functionality
// ========================================
const bookmarkBtn = document.querySelector('.bookmark-btn');
let isBookmarked = localStorage.getItem('bookmark_' + pageUrl) === 'true';

if (isBookmarked) {
    bookmarkBtn.innerHTML = '<span>✅</span> Bookmarked';
}

bookmarkBtn.addEventListener('click', function () {
    isBookmarked = !isBookmarked;

    if (isBookmarked) {
        this.innerHTML = '<span>✅</span> Bookmarked';
        localStorage.setItem('bookmark_' + pageUrl, 'true');

        // သင့် backend မှာ save လုပ်နိုင်ပါတယ်
        console.log('Article bookmarked');
    } else {
        this.innerHTML = '<span>🔖</span> Bookmark';
        localStorage.removeItem('bookmark_' + pageUrl);
        console.log('Bookmark removed');
    }
});

// ========================================
// Print Functionality
// ========================================
document.querySelector('.print-btn')?.addEventListener('click', () => {
    window.print();
});

// ========================================
// Comment Form
// ========================================
document.querySelector('.comment-form form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: e.target.querySelector('input[type="text"]').value,
        email: e.target.querySelector('input[type="email"]').value,
        comment: e.target.querySelector('textarea').value
    };

    // သင့် backend API နဲ့ connect လုပ်ပါ
    console.log('Comment submitted:', formData);
    alert('✓ Thank you for your comment! It will be reviewed shortly.');
    e.target.reset();
});

// Comment reply buttons
document.querySelectorAll('.comment-reply').forEach(btn => {
    btn.addEventListener('click', function () {
        const commentForm = document.querySelector('.comment-form');
        commentForm.scrollIntoView({ behavior: 'smooth' });
        commentForm.querySelector('textarea').focus();
    });
});

// Load more comments
document.querySelector('.load-more-comments')?.addEventListener('click', function () {
    // သင့် backend မှ comments များ load လုပ်ပါ
    alert('Loading more comments...');
    // AJAX request ဒါမှမဟုတ် fetch API သုံးနိုင်ပါတယ်
});

// ========================================
// Related Articles Click
// ========================================
document.querySelectorAll('.related-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Navigating to related article...');
        // window.location.href = link.getAttribute('href');
    });
});

// ========================================
// Reading Time Calculation (Auto-generated)
// ========================================
function calculateReadingTime() {
    const article = document.querySelector('.article-content');
    const text = article.textContent;
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    const readingTimeElement = document.querySelector('.reading-time');
    if (readingTimeElement) {
        readingTimeElement.textContent = `⏱️ ${readingTime} min read`;
    }
}

// Calculate on page load
calculateReadingTime();

// ========================================
// View Count (Increment)
// ========================================
function incrementViewCount() {
    // localStorage မှာ view count သိမ်းပါ (သင့် backend မှာ သိမ်းရင် ပိုကောင်းပါတယ်)
    const viewCountKey = 'views_' + pageUrl;
    let views = parseInt(localStorage.getItem(viewCountKey) || '1234');
    views++;
    localStorage.setItem(viewCountKey, views);

    const viewCountElement = document.querySelector('.view-count');
    if (viewCountElement) {
        viewCountElement.textContent = `👁️ ${views.toLocaleString()} views`;
    }
}

// Increment view count on page load
incrementViewCount();

// ========================================
// Code Syntax Highlighting Enhancement
// ========================================
document.querySelectorAll('.code-block code').forEach(block => {
    // အခု အခြေခံ color coding ပဲ ရှိပါတယ်
    // Prism.js သို့ Highlight.js library ထည့်ရင် ပိုကောင်းပါတယ်
});

// ========================================
// Lazy Load Images (if any added later)
// ========================================
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ========================================
// Analytics Event Tracking (Google Analytics)
// ========================================
function trackEvent(category, action, label) {
    // Google Analytics ရှိရင် track လုပ်ပါ
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track article read (scroll to 75%)
let hasTrackedRead = false;
window.addEventListener('scroll', () => {
    if (hasTrackedRead) return;

    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercent >= 75) {
        trackEvent('Article', 'Read', pageTitle);
        hasTrackedRead = true;
    }
});

// Track code copy
document.querySelectorAll('.copy-code-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('Article', 'Code Copy', pageTitle);
    });
});

// Track share
document.querySelectorAll('.share-btn, .share-btn-footer').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('Article', 'Share', pageTitle);
    });
});

console.log('Article page initialized successfully! 📝');