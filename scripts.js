// scripts.js - Updated version
async function loadComponent(url, targetElement, position = 'beforeend') {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        const html = await response.text();
        const target = document.querySelector(targetElement);
        if (!target) throw new Error(`Target element not found`);
        target.insertAdjacentHTML(position, html);
        return true;
    } catch (error) {
        console.error('Error loading component:', error);
        return false;
    }
}

async function loadCommonComponents() {
    // Create wrapper element at the very top of body
    document.body.insertAdjacentHTML('afterbegin', `
        <div class="top-wrapper">
            <div class="header-container"></div>
            <div class="nav-container"></div>
        </div>
    `);

    // Load header into header-container
    await loadComponent('/kuwaitnews/includes/header.html', '.header-container');

    // Load navigation into nav-container
    await loadComponent('/kuwaitnews/includes/navigation.html', '.nav-container');

    // Initialize mobile menu
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', isActive);
            menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            document.body.classList.toggle('nav-open');
        });
    }

    // Add global styles
    const style = document.createElement('style');
    style.textContent = `
        .top-wrapper {
            width: 100%;
            background: linear-gradient(135deg, #CE1126, #007A3D);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header-container, .nav-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        @media (max-width: 768px) {
            .top-wrapper {
                padding: 0.5rem;
            }
            .header-container {
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
            }
            .menu-btn {
                color: white;
                font-size: 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Start loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCommonComponents);
} else {
    loadCommonComponents();
}
