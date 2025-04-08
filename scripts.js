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

// Main function to load components with retry mechanism
async function loadCommonComponents() {
    try {
        // Wrap header and navigation in a single flex container
        document.body.insertAdjacentHTML('afterbegin', '<div class="top-wrapper"></div>');
        const wrapper = document.querySelector('.top-wrapper');

        // Load header
        const headerLoaded = await loadComponent('/kuwaitnews/includes/header.html', '.top-wrapper', 'beforeend');
        if (!headerLoaded) throw new Error('Header failed to load');

        // Load navigation
        const navLoaded = await loadComponent('/kuwaitnews/includes/navigation.html', '.top-wrapper', 'beforeend');
        if (!navLoaded) throw new Error('Navigation failed to load');

        // Wait briefly for DOM to update
        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize mobile menu toggle
        const menuBtn = document.querySelector('.menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', () => {
                const isActive = navMenu.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', isActive);
                menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
                document.body.classList.toggle('nav-open');
            });
        } else {
            console.warn('Mobile menu elements not found');
        }

        document.dispatchEvent(new Event('commonComponentsLoaded'));
        console.log('Common components loaded successfully');
    } catch (error) {
        console.error('Error in loadCommonComponents:', error);
    }
}

// Add styling for both views
const style = document.createElement('style');
style.textContent = `
    .top-wrapper {
        width: 100%;
        position: relative;
        background: linear-gradient(135deg, #CE1126, #007A3D); /* Default for desktop */
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header-bg {
        background: transparent; /* No gradient here */
        width: 100%;
    }
    @media (max-width: 768px) {
        .top-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #CE1126, #007A3D); /* Ensure gradient in mobile */
        }
        .header-container {
            flex-grow: 1;
            justify-content: center;
            align-items: center;
            gap: 1rem;
        }
        .site-title {
            font-size: 1.2rem;
        }
        .site-tagline {
            display: none;
        }
        .menu-btn {
            margin-right: 1rem;
        }
    }
`;
document.head.appendChild(style);

// Start the process
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, starting component load');
    loadCommonComponents();
});
