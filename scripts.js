// Kuwait News Component Loader
document.addEventListener('DOMContentLoaded', function() {
    // Set base path for GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/kuwaitnews' : '';
    
    // Create container if it doesn't exist
    if (!document.querySelector('.top-wrapper')) {
        document.body.insertAdjacentHTML('afterbegin', '<div class="top-wrapper"></div>');
    }
    
    // Load components
    loadComponent(`${basePath}/includes/header.html`, '.top-wrapper');
    loadComponent(`${basePath}/includes/navigation.html`, '.top-wrapper');
});

async function loadComponent(url, targetSelector) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        
        const html = await response.text();
        const target = document.querySelector(targetSelector);
        
        if (!target) throw new Error(`Target element not found: ${targetSelector}`);
        
        target.insertAdjacentHTML('beforeend', html);
        initializeComponents();
    } catch (error) {
        console.error('Component load error:', error);
        showError(`Failed to load: ${url.split('/').pop()}`);
    }
}

function initializeComponents() {
    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                const isExpanded = navMenu.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', isExpanded);
                menuBtn.innerHTML = isExpanded ? 
                    '<i class="fas fa-times"></i>' : 
                    '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // Set active nav link
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        color: red;
        padding: 10px;
        background: #ffeeee;
        border: 1px solid red;
        margin: 10px;
        font-family: sans-serif;
    `;
    errorDiv.textContent = message;
    document.body.prepend(errorDiv);
}
