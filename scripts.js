// Updated loadComponent function with proper error handling
async function loadComponent(url, targetElement, position = 'beforeend') {
    try {
        // Use correct path for GitHub Pages
        const fullUrl = window.location.hostname.includes('github.io') 
            ? `/kuwaitnews${url}`
            : url;
            
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();
        document.querySelector(targetElement).insertAdjacentHTML(position, html);
        return true;
    } catch (error) {
        console.error(`Failed to load ${url}:`, error);
        return false;
    }
}

// Main loader with proper structure
async function loadCommonComponents() {
    // Create structure
    document.body.insertAdjacentHTML('afterbegin', `
        <div class="top-wrapper">
            <!-- Header will be inserted here -->
            <!-- Navigation will be inserted here -->
        </div>
    `);

    // Load components
    await Promise.all([
        loadComponent('/includes/header.html', '.top-wrapper'),
        loadComponent('/includes/navigation.html', '.top-wrapper')
    ]);

    // Initialize components
    initHeader();
    initNavigation();
}

function initHeader() {
    // Header initialization logic if needed
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
                this.nextElementSibling.style.display = 
                    this.nextElementSibling.style.display === 'block' ? 'none' : 'block';
            }
        });
    });

    // Mobile menu toggle
    document.querySelector('.menu-btn')?.addEventListener('click', () => {
        document.querySelector('.nav-menu-toggle').classList.toggle('active');
    });
}

// Start loading when DOM is ready
document.addEventListener('DOMContentLoaded', loadCommonComponents);
