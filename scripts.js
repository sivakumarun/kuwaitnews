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

        // Initialize menu toggle for vertical list
        const menuBtn = document.querySelector('.menu-btn');
        const navMenuToggle = document.querySelector('.nav-menu-toggle');
        if (menuBtn && navMenuToggle) {
            // Click handler for toggle
            menuBtn.addEventListener('click', () => {
                const isActive = navMenuToggle.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', isActive);
                menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            });

            // Hover handler for desktop
            if (window.innerWidth >= 769) {
                menuBtn.addEventListener('mouseenter', () => {
                    navMenuToggle.classList.add('active');
                    menuBtn.setAttribute('aria-expanded', 'true');
                    menuBtn.innerHTML = '<i class="fas fa-times"></i>';
                });

                menuBtn.addEventListener('mouseleave', () => {
                    // Only close if not clicked open
                    if (!navMenuToggle.classList.contains('active')) {
                        navMenuToggle.classList.remove('active');
                        menuBtn.setAttribute('aria-expanded', 'false');
                        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });

                navMenuToggle.addEventListener('mouseleave', () => {
                    // Only close if not clicked open
                    if (!menuBtn.matches(':hover')) {
                        navMenuToggle.classList.remove('active');
                        menuBtn.setAttribute('aria-expanded', 'false');
                        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                        // Close any open dropdowns
                        document.querySelectorAll('.nav-menu-toggle .dropdown').forEach(dropdown => {
                            dropdown.classList.remove('open');
                        });
                    }
                });
            }
        }

        // Initialize dropdown toggle for both menus
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const dropdown = toggle.closest('.dropdown');
                const isHorizontal = toggle.closest('.nav-menu-horizontal');
                if (isHorizontal && window.innerWidth <= 768) {
                    // In mobile horizontal menu, allow default navigation
                    return;
                }
                e.preventDefault();
                if (dropdown) {
                    // Close other open dropdowns
                    document.querySelectorAll('.dropdown').forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('open');
                        }
                    });
                    // Toggle the current dropdown
                    dropdown.classList.toggle('open');
                }
            });
        });

        // Close horizontal menu dropdown on mouse leave (desktop only)
        if (window.innerWidth >= 769) {
            const horizontalDropdowns = document.querySelectorAll('.nav-menu-horizontal .dropdown');
            horizontalDropdowns.forEach(dropdown => {
                dropdown.addEventListener('mouseleave', () => {
                    dropdown.classList.remove('open');
                });
            });
        }
    } catch (error) {
        console.error('Error in loadCommonComponents:', error);
    }
}

// Add global styles
const style = document.createElement('style');
style.textContent = `
    .top-wrapper {
        width: 100%;
        position: relative;
        z-index: 1000;
    }
`;
document.head.appendChild(style);

// Start the process
document.addEventListener('DOMContentLoaded', () => {
    loadCommonComponents();
});
