// Global configuration
const config = {
    basePath: window.location.hostname.includes('github.io') ? '/kuwaitnews' : ''
};

// Component loader
async function loadComponent(componentName, targetSelector) {
    try {
        const response = await fetch(`${config.basePath}/includes/${componentName}.html`);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();
        document.querySelector(targetSelector).insertAdjacentHTML('beforeend', html);
        return true;
    } catch (error) {
        console.error(`Failed to load ${componentName}:`, error);
        return false;
    }
}

// Initialize components
async function initPage() {
    // Create structure
    document.body.insertAdjacentHTML('afterbegin', `
        <div class="top-wrapper">
            <!-- Header will load here -->
            <!-- Navigation will load here -->
        </div>
        <div class="content-bg">
            <div class="container">
                <!-- Main content -->
            </div>
        </div>
    `);

    // Load components
    await Promise.all([
        loadComponent('header', '.top-wrapper'),
        loadComponent('navigation', '.top-wrapper')
    ]);

    // Initialize functionality
    initHeader();
    initNavigation();
}

function initHeader() {
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.search-input')?.focus();
        });
    }
}

function initNavigation() {
    // Desktop hover dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                dropdown.querySelector('.dropdown-menu').style.display = 'block';
            }
        });
        
        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                dropdown.querySelector('.dropdown-menu').style.display = 'none';
            }
        });
    });

    // Mobile click dropdowns
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const menu = this.nextElementSibling;
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });

    // Mobile menu toggle
    document.querySelector('.menu-btn')?.addEventListener('click', () => {
        document.querySelector('.nav-menu-toggle').classList.toggle('active');
    });
}

// Start initialization
document.addEventListener('DOMContentLoaded', initPage);
