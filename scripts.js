// Configuration
const config = {
    basePath: window.location.host.includes('github.io') ? '/kuwaitnews' : '',
    components: {
        header: {
            url: './includes/header.html',
            target: '#header-container'
        },
        navigation: {
            url: './includes/navigation.html',
            target: '#nav-container'
        }
    }
};

// Enhanced component loader
async function loadComponent(component) {
    try {
        const response = await fetch(`${config.basePath}${component.url}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const html = await response.text();
        const target = document.querySelector(component.target);
        if (!target) throw new Error(`Target element not found: ${component.target}`);
        
        target.innerHTML = html;
        return true;
    } catch (error) {
        console.error(`Failed to load ${component.url}:`, error);
        return false;
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navContent = document.querySelector('.nav-content');
    
    if (!menuBtn || !navContent) return;

    const toggleMenu = (show) => {
        const isExpanded = show ?? (menuBtn.getAttribute('aria-expanded') !== 'true');
        menuBtn.setAttribute('aria-expanded', isExpanded);
        navContent.classList.toggle('active', isExpanded);
        menuBtn.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', () => toggleMenu());
    
    // Close menu on navigation or click outside
    document.addEventListener('click', (e) => {
        if (e.target.closest('.nav-menu a')) toggleMenu(false);
        if (!e.target.closest('.nav-content') && e.target !== menuBtn) toggleMenu(false);
    });

    // Responsive behavior
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) toggleMenu(false);
    });
}

// Highlight active navigation link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Main initialization
async function initApp() {
    try {
        // Load components in parallel
        await Promise.all([
            loadComponent(config.components.header),
            loadComponent(config.components.navigation)
        ]);
        
        // Initialize features
        setActiveNavLink();
        initMobileMenu();
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);
