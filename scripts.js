// Function to load HTML components
async function loadComponent(url, targetElement, position = 'beforeend') {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);
        const html = await response.text();
        const target = document.querySelector(targetElement);
        if (!target) throw new Error(`Target element '${targetElement}' not found`);
        target.insertAdjacentHTML(position, html);
        return true;
    } catch (error) {
        console.error('Error loading component:', error.message);
        return false;
    }
}

// Initialize navigation functionality
function initNavigation() {
    // Toggle vertical menu
    const menuBtn = document.querySelector('.menu-btn');
    const verticalMenu = document.querySelector('.nav-menu-vertical');
    
    if (menuBtn && verticalMenu) {
        menuBtn.addEventListener('click', function() {
            const isActive = verticalMenu.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', isActive);
            menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Initialize dropdown toggle for both menus
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.closest('.dropdown');
            if (dropdown) {
                // Close other open dropdowns in the same menu
                const parentMenu = dropdown.closest('ul');
                parentMenu.querySelectorAll('.dropdown').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('open');
                    }
                });
                // Toggle current dropdown
                dropdown.classList.toggle('open');
                
                // Rotate caret icon
                const icon = this.querySelector('i.fas');
                if (icon) {
                    icon.style.transform = dropdown.classList.contains('open') ? 'rotate(90deg)' : '';
                }
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }
    });
}

// Add navigation styles
function addNavigationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .nav-container {
            background: #333333;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            width: 100%;
            position: relative;
            z-index: 1000;
        }
        
        nav {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0.5rem 1rem;
            display: flex;
            flex-wrap: wrap;
        }
        
        .menu-wrapper {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            background: #333333;
            padding: 0.5rem 0;
            position: relative;
            width: 100%;
        }
        
        .menu-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #ffffff;
            padding: 0.5rem;
            margin-right: 1rem;
            display: none;
        }
        
        .nav-menu-horizontal,
        .nav-menu-vertical {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .nav-menu-horizontal {
            display: flex;
            gap: 6px;
            overflow-x: auto;
            flex-grow: 1;
        }
        
        .nav-menu-vertical {
            display: none;
            flex-direction: column;
            background: #333333;
            width: 100%;
            padding: 0.5rem 0;
        }
        
        .nav-menu-vertical.active {
            display: flex;
        }
        
        .nav-link {
            font-family: 'Noto Sans Telugu', 'Open Sans', sans-serif;
            font-size: 0.9rem;
            font-weight: 500;
            color: #ffffff;
            text-decoration: none;
            padding: 0.6rem 1rem;
            display: block;
            border-radius: 4px;
            white-space: nowrap;
        }
        
        .nav-link:hover,
        .nav-link.active {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .dropdown {
            position: relative;
        }
        
        .dropdown-toggle {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
        }
        
        /* Horizontal dropdown */
        .nav-menu-horizontal .dropdown-menu {
            display: none;
            position: absolute;
            background: #4a4a4a;
            border-radius: 4px;
            list-style: none;
            padding: 0.5rem 0;
            z-index: 1001;
            min-width: 180px;
            top: 100%;
            left: 0;
        }
        
        /* Vertical dropdown */
        .nav-menu-vertical .dropdown-menu {
            display: none;
            background: #3a3a3a;
            list-style: none;
            padding: 0;
            margin-left: 1rem;
        }
        
        .dropdown.open .dropdown-menu {
            display: block;
        }
        
        .dropdown-menu .nav-link {
            padding: 0.5rem 1rem;
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
            .nav-menu-horizontal {
                display: none;
            }
            
            .menu-btn {
                display: block;
            }
            
            .nav-menu-vertical {
                display: none;
            }
            
            .nav-menu-vertical.active {
                display: flex;
            }
            
            .dropdown-toggle i.fas {
                transition: transform 0.3s ease;
            }
        }
        
        @media (min-width: 769px) {
            .menu-btn {
                display: none;
            }
            
            .nav-menu-horizontal {
                display: flex;
            }
            
            .nav-menu-vertical {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Main function to load components
async function loadCommonComponents() {
    try {
        // Clear any existing top-wrapper to prevent duplicates
        const existingWrapper = document.querySelector('.top-wrapper');
        if (existingWrapper) existingWrapper.remove();

        // Create wrapper structure
        document.body.insertAdjacentHTML('afterbegin', `<div class="top-wrapper"></div>`);

        // Load header
        const headerLoaded = await loadComponent('/kuwaitnews/includes/header.html', '.top-wrapper');
        if (!headerLoaded) throw new Error('Header failed to load');

        // Load navigation
        const navLoaded = await loadComponent('/kuwaitnews/includes/navigation.html', '.top-wrapper');
        if (!navLoaded) throw new Error('Navigation failed to load');

        // Add navigation styles
        addNavigationStyles();

        // Initialize navigation functionality
        initNavigation();

        document.dispatchEvent(new Event('commonComponentsLoaded'));
    } catch (error) {
        console.error('Error in loadCommonComponents:', error);
    }
}

// Start the process
document.addEventListener('DOMContentLoaded', () => {
    loadCommonComponents();
});

function initNavigation() {
    const menuBtn = document.querySelector('.menu-btn');
    const verticalMenu = document.querySelector('.nav-menu-vertical');
    
    // Toggle vertical menu
    menuBtn?.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        verticalMenu?.classList.toggle('active');
        menuBtn.innerHTML = isExpanded ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
    });

    // Handle dropdowns
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.closest('.dropdown');
            const parentMenu = this.closest('ul');
            
            // Close other dropdowns in same menu
            parentMenu.querySelectorAll('.dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('open');
            });
            
            dropdown.classList.toggle('open');
            this.querySelector('i')?.classList.toggle('fa-rotate-90');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(d => {
                d.classList.remove('open');
            });
        }
    });
}
