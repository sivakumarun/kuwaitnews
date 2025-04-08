// scripts.js - Working Version
async function loadHeaderAndNav() {
    // Determine base path for GitHub Pages
    const basePath = window.location.host.includes('github.io') ? '/kuwaitnews' : '';
    
    try {
        // 1. Load Header
        const headerResponse = await fetch(`${basePath}/includes/header.html`);
        if (!headerResponse.ok) throw new Error('Failed to load header');
        document.getElementById('header-container').innerHTML = await headerResponse.text();
        
        // 2. Load Navigation
        const navResponse = await fetch(`${basePath}/includes/navigation.html`);
        if (!navResponse.ok) throw new Error('Failed to load navigation');
        document.getElementById('nav-container').innerHTML = await navResponse.text();
        
        // 3. Initialize components after short delay
        setTimeout(() => {
            initMobileMenu();
            setActiveNavLink();
        }, 100);
        
    } catch (error) {
        console.error('Error loading components:', error);
        // Fallback content
        document.getElementById('header-container').innerHTML = `
            <div class="fallback-header">
                <h1>కువైట్ తెలుగు వార్తలు</h1>
                <nav>
                    <a href="${basePath}/index.html">Home</a> | 
                    <a href="${basePath}/sports.html">Sports</a>
                </nav>
            </div>
        `;
    }
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navContent = document.querySelector('.nav-content');
    
    if (!menuBtn || !navContent) {
        console.warn('Mobile menu elements missing');
        return;
    }

    const toggleMenu = () => {
        const isOpen = navContent.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', isOpen);
        menuBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) toggleMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-content') && e.target !== menuBtn) {
            navContent.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });

    // Reset on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navContent.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// Start loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeaderAndNav);
} else {
    loadHeaderAndNav();
}
