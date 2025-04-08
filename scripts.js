// scripts.js - Final Working Version
document.addEventListener('DOMContentLoaded', function() {
    // 1. Define correct paths for GitHub Pages
    const basePath = window.location.pathname.startsWith('/kuwaitnews') ? '/kuwaitnews' : '';
    
    // 2. Load Header
    fetch(`${basePath}/includes/header.html`)
        .then(response => {
            if (!response.ok) throw new Error('Header load failed');
            return response.text();
        })
        .then(html => {
            const container = document.getElementById('header-container');
            if (container) container.innerHTML = html;
            
            // 3. Load Navigation after header
            return fetch(`${basePath}/includes/navigation.html`);
        })
        .then(response => {
            if (!response.ok) throw new Error('Navigation load failed');
            return response.text();
        })
        .then(html => {
            const container = document.getElementById('nav-container');
            if (container) container.innerHTML = html;
            
            // 4. Initialize components
            setTimeout(() => {
                initMobileMenu();
                setActiveNavLink();
            }, 100);
        })
        .catch(error => {
            console.error('Component load error:', error);
            // Visible fallback
            const fallbackHTML = `
                <div style="background:#007A3D;color:white;padding:1rem;text-align:center">
                    <h1 style="margin:0">కువైట్ తెలుగు వార్తలు</h1>
                    <nav style="margin-top:1rem">
                        <a href="${basePath}/index.html" style="color:white;margin:0 10px">Home</a>
                        <a href="${basePath}/sports.html" style="color:white;margin:0 10px">Sports</a>
                    </nav>
                </div>
            `;
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) headerContainer.innerHTML = fallbackHTML;
        });
});

function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    if (!menuBtn) return;
    
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
        if (!e.target.closest('.nav-content') && e.target !== menuBtn) {
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
        link.classList.toggle('active', linkPage === currentPage);
        link.toggleAttribute('aria-current', linkPage === currentPage);
    });
}
