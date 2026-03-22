/**
 * Global Component Loader (glo.js) - FIXED PATHS
 * Loads header and footer for ALL pages
 */

(function() {
    'use strict';

    console.log('🔄 glo.js loading...');

    /**
     * Get correct component path based on current page location
     */
    function getComponentPath(filename) {
        const currentPath = window.location.pathname;
        
        console.log('📍 Current path:', currentPath);
        
        // If in root (index.html) or main directory
        if (currentPath === '/' || 
            currentPath.endsWith('/index.html') || 
            currentPath.includes('/a-coder-website/') && !currentPath.includes('/pages/')) {
            console.log('📂 Root directory detected');
            return `pages/${filename}`;
        }
        
        // If in subdirectory (pages/lesson-5.html, pages/tutorials.html, etc.)
        if (currentPath.includes('/pages/')) {
            console.log('📂 Pages directory detected');
            return filename;
        }
        
        // Default fallback
        console.log('📂 Using default path');
        return `pages/${filename}`;
    }

    /**
     * Load HTML component
     */
    async function loadComponent(elementId, componentPath) {
        const element = document.getElementById(elementId);
        
        if (!element) {
            console.warn(`❌ Element #${elementId} not found`);
            return false;
        }

        console.log(`🔄 Loading ${componentPath}...`);

        try {
            const response = await fetch(componentPath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${componentPath}`);
            }
            
            const html = await response.text();
            element.innerHTML = html;
            
            console.log(`✅ Loaded: ${componentPath}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error loading ${componentPath}:`, error);
            
            // Try alternative path
            const altPath = componentPath.includes('pages/') 
                ? componentPath.replace('pages/', '') 
                : `pages/${componentPath}`;
            
            console.log(`🔄 Trying alternative path: ${altPath}`);
            
            try {
                const altResponse = await fetch(altPath);
                if (altResponse.ok) {
                    const html = await altResponse.text();
                    element.innerHTML = html;
                    console.log(`✅ Loaded (alternative): ${altPath}`);
                    return true;
                }
            } catch (altError) {
                console.error(`❌ Alternative path also failed`);
            }
            
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
        
        // Debug: Check if elements exist
        console.log('Checking elements:', {
            toggle: !!mobileToggle,
            overlay: !!mobileOverlay,
            nav: !!mobileNav,
            close: !!mobileClose
        });
        
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
        
        // Get correct paths
        const headerPath = getComponentPath('header.html');
        const footerPath = getComponentPath('footer.html');
        
        console.log('Paths:', { header: headerPath, footer: footerPath });
        
        // Load header
        const headerLoaded = await loadComponent('header', headerPath);
        
        // Load footer
        await loadComponent('footer', footerPath);
        
        // Initialize mobile menu after header loads
        if (headerLoaded) {
            console.log('⏳ Waiting for DOM update...');
            setTimeout(function() {
                initMobileMenu();
            }, 150);
        } else {
            console.error('❌ Header failed to load - mobile menu not initialized');
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

function loadHTML(id, file) {
    fetch(file)
      .then(response => response.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;
      });
  }
  
  loadHTML("header", "../pages/header.html");
  loadHTML("footer", "../pages/footer.html");