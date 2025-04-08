// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Create the top wrapper structure
    const topWrapper = document.createElement('div');
    topWrapper.className = 'top-wrapper';
    topWrapper.innerHTML = `
        <div class="header-container"></div>
        <div class="nav-container"></div>
    `;
    document.body.insertBefore(topWrapper, document.body.firstChild);

    // Load components with error handling
    Promise.all([
        loadComponent('/kuwaitnews/includes/header.html', '.header-container'),
        loadComponent('/kuwaitnews/includes/navigation.html', '.nav-container')
    ]).then(() => {
        initMobileMenu();
        addGlobalStyles();
    }).catch(error => {
        console.error('Failed to load components:', error);
    });
});

function loadComponent(url, targetSelector) {
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(html => {
            const target = document.querySelector(targetSelector);
            if (!target) throw new Error(`Target element ${targetSelector} not found`);
            target.innerHTML = html;
        });
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', isActive);
            menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            document.body.classList.toggle('nav-open', isActive);
        });
    }
}

function addGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Global styles */
        .top-wrapper {
            width: 100%;
            background: linear-gradient(135deg, #CE1126, #007A3D);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .header-container, .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
            .top-wrapper {
                padding: 0.5rem;
            }
            
            .header-container {
                display: flex;
                justify-content: center;
                padding: 0.5rem 0;
            }
            
            .logo-container {
                justify-content: center;
            }
            
            .site-title {
                font-size: 1.2rem;
            }
            
            .site-tagline {
                display: none;
            }
            
            .nav-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 0;
                background: transparent;
            }
            
            .menu-btn {
                color: white;
                font-size: 1.5rem;
                background: none;
                border: none;
            }
            
            .search-bar {
                margin-right: 0.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}
