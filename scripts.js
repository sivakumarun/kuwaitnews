// Enhanced mobile menu initialization
function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navContent = document.querySelector('.nav-content');
    
    if (!menuBtn || !navContent) {
        console.warn('Mobile menu elements not found');
        return;
    }

    // Toggle menu function
    const toggleMenu = () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        navContent.classList.toggle('active');
        menuBtn.innerHTML = isExpanded ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
        
        // Toggle body scroll when menu is open
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    };

    // Close menu when clicking outside or on a link
    const closeMenu = () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        navContent.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
    };

    // Event listeners
    menuBtn.addEventListener('click', toggleMenu);
    
    // Close when clicking on nav links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!navContent.contains(e.target) && e.target !== menuBtn) {
            closeMenu();
        }
    });

    // Responsive behavior
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

// Update your loadCommonComponents function to include error handling
async function loadCommonComponents() {
    try {
        const headerLoaded = await loadComponent('/kuwaitnews/includes/header.html', 'body', 'afterbegin');
        if (!headerLoaded) throw new Error('Header failed to load');

        const navLoaded = await loadComponent('/kuwaitnews/includes/navigation.html', '.header-bg', 'afterend');
        if (!navLoaded) throw new Error('Navigation failed to load');

        await new Promise(resolve => setTimeout(resolve, 100));

        setActiveNavLink();
        initMobileMenu();

        document.dispatchEvent(new Event('commonComponentsLoaded'));
        console.log('Common components loaded successfully');
    } catch (error) {
        console.error('Error in loadCommonComponents:', error);
    }
}

        // Initialize components after short delay
        setTimeout(() => {
            setActiveNavLink();
            initMobileMenu();
            document.dispatchEvent(new Event('commonComponentsLoaded'));
        }, 100);
        
    } catch (error) {
        console.error('Failed to load components:', error);
        // Fallback content or retry logic can go here
    }
}
