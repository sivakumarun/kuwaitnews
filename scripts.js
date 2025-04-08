// Guaranteed Working scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // 1. Define paths - works for both local and GitHub Pages
    const basePath = window.location.pathname.includes('/kuwaitnews') ? '/kuwaitnews' : '';
    const headerPath = `${basePath}/includes/header.html`;
    const navPath = `${basePath}/includes/navigation.html`;
    
    // 2. Load Header
    fetch(headerPath)
        .then(response => {
            if (!response.ok) throw new Error('Header failed to load');
            return response.text();
        })
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            console.log('Header loaded successfully');
            
            // 3. Load Navigation after header
            return fetch(navPath);
        })
        .then(response => {
            if (!response.ok) throw new Error('Navigation failed to load');
            return response.text();
        })
        .then(html => {
            document.getElementById('nav-container').innerHTML = html;
            console.log('Navigation loaded successfully');
            
            // 4. Initialize components
            initMobileMenu();
            setActiveNavLink();
        })
        .catch(error => {
            console.error('Error:', error);
            // Visible fallback
            document.getElementById('header-container').innerHTML = `
                <div style="background:#007A3D;color:white;padding:1rem">
                    <h1>కువైట్ తెలుగు వార్తలు</h1>
                    <nav style="display:flex;gap:1rem">
                        <a href="${basePath}/index.html" style="color:white">Home</a>
                        <a href="${basePath}/sports.html" style="color:white">Sports</a>
                    </nav>
                </div>
            `;
        });
});

function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    if (!menuBtn) {
        console.log('Mobile menu button not found - skipping initialization');
        return;
    }
    
    const navContent = document.querySelector('.nav-content');
    menuBtn.addEventListener('click', function() {
        navContent.classList.toggle('active');
        const isOpen = navContent.classList.contains('active');
        menuBtn.setAttribute('aria-expanded', isOpen);
        menuBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
}

function setActiveNavLink() {
    const links = document.querySelectorAll('.nav-menu a');
    if (links.length === 0) {
        console.log('No navigation links found');
        return;
    }
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}
