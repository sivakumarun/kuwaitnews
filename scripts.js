// scripts.js - Complete Updated Version
async function loadComponent(url, targetId) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
        
        const content = await response.text();
        const target = document.getElementById(targetId);
        if (!target) throw new Error(`Target element #${targetId} not found`);
        
        target.innerHTML = content;
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navContent = document.querySelector('.nav-content');
    
    if (!menuBtn || !navContent) {
        console.warn('Mobile menu elements not found');
        return;
    }

    const toggleMenu = () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        navContent.classList.toggle('active');
        menuBtn.innerHTML = isExpanded ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    };

    menuBtn.addEventListener('click', toggleMenu);
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) toggleMenu();
        });
    });

    document.addEventListener('click', (e) => {
        if (!navContent.contains(e.target) && e.target !== menuBtn) {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            if (isExpanded) toggleMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            menuBtn.setAttribute('aria-expanded', 'false');
            navContent.classList.remove('active');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
}

function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

async function loadCommonComponents() {
    const basePath = window.location.host.includes('github.io') ? '/kuwaitnews' : '';
    
    try {
        await Promise.all([
            loadComponent(`${basePath}/includes/header.html`, 'header-container'),
            loadComponent(`${basePath}/includes/navigation.html`, 'nav-container')
        ]);
        
        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 50));
        
        setActiveNavLink();
        initMobileMenu();
        
        console.log('Components loaded successfully');
    } catch (error) {
        console.error('Error loading components:', error);
        // Fallback basic navigation
        document.getElementById('header-container').innerHTML = `
            <div class="fallback-header">
                <h1>కువైట్ తెలుగు వార్తలు</h1>
                <nav>
                    <a href="${basePath}/index.html">Home</a>
                    <a href="${basePath}/sports.html">Sports</a>
                </nav>
            </div>
        `;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCommonComponents);
} else {
    loadCommonComponents();
}
