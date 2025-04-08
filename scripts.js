// scripts.js - Final Working Version
document.addEventListener('DOMContentLoaded', function() {
    // 1. Set correct base path
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/kuwaitnews' : '';
    
    // 2. Load components sequentially with error handling
    loadComponent(`${basePath}/includes/header.html`, 'header-container')
        .then(() => loadComponent(`${basePath}/includes/navigation.html`, 'nav-container'))
        .then(() => {
            // Initialize components after both load
            initMobileMenu();
            setActiveNavLink();
        })
        .catch(error => {
            console.error('Loading failed:', error);
            showFallbackHeader(basePath);
        });
});

async function loadComponent(url, containerId) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const container = document.getElementById(containerId);
        if (!container) throw new Error(`Container #${containerId} not found`);
        
        container.innerHTML = await response.text();
        console.log(`Loaded ${url} successfully`);
        return true;
    } catch (error) {
        console.error(`Failed to load ${url}:`, error);
        throw error; // Re-throw for Promise chain
    }
}

function showFallbackHeader(basePath) {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = `
            <div style="background:#007A3D;color:white;padding:1rem;text-align:center">
                <h1 style="margin:0">కువైట్ తెలుగు వార్తలు</h1>
                <nav style="margin-top:1rem">
                    <a href="${basePath}/index.html" style="color:white;margin:0 10px">Home</a>
                    <a href="${basePath}/sports.html" style="color:white;margin:0 10px">Sports</a>
                </nav>
            </div>
        `;
    }
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    if (!menuBtn) {
        console.log('Menu button not found - skipping mobile menu init');
        return;
    }

    const navContent = document.querySelector('.nav-content');
    menuBtn.addEventListener('click', function() {
        const isOpen = !navContent.classList.contains('active');
        navContent.classList.toggle('active', isOpen);
        menuBtn.setAttribute('aria-expanded', isOpen);
        menuBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-content') && e.target !== menuBtn && navContent.classList.contains('active')) {
            navContent.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
}

function setActiveNavLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const linkPath = link.getAttribute('href');
        const isActive = currentPath.endsWith(linkPath) || 
                        (linkPath === '/kuwaitnews/index.html' && currentPath.endsWith('/kuwaitnews/'));
        
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}
