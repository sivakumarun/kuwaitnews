// Function to load HTML components (header/nav)
async function loadComponent(url, targetElement, position = 'beforeend') {
    try {
        console.log(`Attempting to load ${url}`);
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
        console.log(`Successfully loaded ${url}`);
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
    if (navLinks.length === 0) {
        console.warn('No navigation links found');
        return;
    }
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
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
    if (!menuBtn || !navMenu) {
        console.warn('Mobile menu elements not found:', { menuBtn, navMenu });
        return;
    }
    menuBtn.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', isActive);
        menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        console.log('Menu toggled:', isActive);
    });
}

// Main function to load components with retry mechanism
async function loadCommonComponents() {
    try {
        // Load header at the start of body
        const headerLoaded = await loadComponent('/kuwaitnews/includes/header.html', 'body', 'afterbegin');
        if (!headerLoaded) throw new Error('Header failed to load');

        // Load navigation after header
        const navLoaded = await loadComponent('/kuwaitnews/includes/navigation.html', '.header-bg', 'afterend');
        if (!navLoaded) throw new Error('Navigation failed to load');

        // Wait briefly for DOM to update
        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize navigation features
        setActiveNavLink();
        initMobileMenu();

        document.dispatchEvent(new Event('commonComponentsLoaded'));
        console.log('Common components loaded successfully');
    } catch (error) {
        console.error('Error in loadCommonComponents:', error);
    }
}

// Start the process
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, starting component load');
    loadCommonComponents();
});
