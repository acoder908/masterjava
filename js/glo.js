/**
 * Global Component Loader (glo.js)
 * Loads header and footer, then initializes mobile menu
 */

(function() {
    'use strict';

    console.log('🔄 glo.js loading...');

    /**
     * Load HTML component
     */
    async function loadComponent(elementId, componentPath) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`❌ Element #${elementId} not found`);
            return;
        }

        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            element.innerHTML = html;
            console.log(`✅ Loaded: ${componentPath}`);
            return true;
        } catch (error) {
            console.error(`❌ Error loading ${componentPath}:`, error);
            return false;
        }
    }

    /**
     * Initialize mobile menu functionality
     */
    function initMobileMenu() {
        console.log('🔧 Initializing mobile menu...');
        
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileOverlay = document.getElementById('mobileMenuOverlay');
        const mobileNav = document.getElementById('mobileNavLinks');
        const mobileClose = document.getElementById('mobileMenuClose');
        
        if (!mobileToggle) {
            console.error('❌ mobileMenuToggle not found!');
            return;
        }
        if (!mobileOverlay) {
            console.error('❌ mobileMenuOverlay not found!');
            return;
        }
        if (!mobileNav) {
            console.error('❌ mobileNavLinks not found!');
            return;
        }
        
        console.log('✅ All mobile menu elements found!');
        
        // Open mobile menu
        mobileToggle.addEventListener('click', function() {
            console.log('🍔 Hamburger clicked!');
            this.classList.add('active');
            mobileOverlay.classList.add('active');
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close mobile menu
        function closeMobileMenu() {
            console.log('❌ Closing menu...');
            mobileToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close button
        if (mobileClose) {
            mobileClose.addEventListener('click', closeMobileMenu);
        }
        
        // Click overlay to close
        mobileOverlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(function(link) {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
        
        // Close on resize to desktop
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768) {
                    closeMobileMenu();
                }
            }, 250);
        });
        
        console.log('✅ Mobile menu initialized successfully!');
    }

    /**
     * Load all components
     */
    async function loadComponents() {
        console.log('📦 Loading components...');
        
        // Load header
        const headerLoaded = await loadComponent('header', 'pages/header.html');
        
        // Load footer
        const footerLoaded = await loadComponent('footer', 'pages/footer.html');
        
        // After header loads, initialize mobile menu
        if (headerLoaded) {
            // Wait a bit for DOM to update
            setTimeout(function() {
                initMobileMenu();
            }, 100);
        }
        
        console.log('✅ All components loaded!');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
        loadComponents();
    }

})();