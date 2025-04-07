// Function to load HTML components (header/nav)
async function loadComponent(url, targetElement, position = 'beforeend') {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.statusText}`);
        }
        const html = await response.text();
        const target = document.querySelector(targetElement);
        if (!target) {
            throw new Error(`Target element '${targetElement}' not found`);
        }
        target.insertAdjacentHTML(position, html);
        return true;
    } catch (error) {
        console.error('Error loading component:', error.message);
        return false;
    }
}

// Function to highlight current page in navigation
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    if (navLinks.length === 0) return;
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop(); // Adjust for absolute paths
        if (linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// Function to initialize mobile menu toggle
function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if (!menuBtn || !navMenu) return;
    menuBtn.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', isActive);
        menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}

// Main function to load components
async function loadCommonComponents() {
    try {
        // Load header at the start of body
        await loadComponent('/kuwaitnews/includes/header.html', 'body', 'afterbegin');
        
        // Load navigation after header
        await loadComponent('/kuwaitnews/includes/navigation.html', '.header-bg', 'afterend');
        
        // Initialize navigation features
        setActiveNavLink();
        initMobileMenu();
        document.dispatchEvent(new Event('commonComponentsLoaded'));
    } catch (error) {
        console.error('Error in loadCommonComponents:', error);
    }
}

// Start the process
document.addEventListener('DOMContentLoaded', loadCommonComponents);
