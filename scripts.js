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

// Main function to load components
async function loadCommonComponents() {
    try {
        // Clear any existing top-wrapper to prevent duplicates
        const existingWrapper = document.querySelector('.top-wrapper');
        if (existingWrapper) existingWrapper.remove();

        // Create wrapper structure
        document.body.insertAdjacentHTML('afterbegin', `
            <div class="top-wrapper"></div>
            <div class="mobile-overlay"></div>
        `);

        // Load header
        const headerLoaded = await loadComponent('/kuwaitnews/includes/header.html', '.top-wrapper');
        if (!headerLoaded) throw new Error('Header failed to load');

        // Load navigation
        const navLoaded = await loadComponent('/kuwaitnews/includes/navigation.html', '.top-wrapper');
        if (!navLoaded) throw new Error('Navigation failed to load');

        // Initialize mobile menu toggle
        const menuBtn = document.querySelector('.menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        const overlay = document.querySelector('.mobile-overlay');
        
        if (menuBtn && navMenu && overlay) {
            menuBtn.addEventListener('click', () => {
                const isActive = navMenu.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', isActive);
                menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
                overlay.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });
            
            overlay.addEventListener('click', () => {
                navMenu.classList.remove('active');
                overlay.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                menuBtn.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            });
        }

        // Initialize search bar toggle
        const searchBtn = document.querySelector('.search-btn');
        const searchBar = document.querySelector('.search-bar');
        
        if (searchBtn && searchBar) {
            searchBtn.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    searchBar.classList.toggle('active');
                    if (searchBar.classList.contains('active')) {
                        searchBar.querySelector('.search-input').focus();
                    }
                }
            });
        }

        document.dispatchEvent(new Event('commonComponentsLoaded'));
        console.log('Common components loaded successfully');
    } catch (error) {
        console.error('Error in loadCommonComponents:', error);
    }
}

// Add global styles
const style = document.createElement('style');
style.textContent = `
    .top-wrapper {
        width: 100%;
    }
    
    @media (min-width: 769px) {
        .header-container {
            justify-content: center;
        }
    }
`;
document.head.appendChild(style);

// Start the process
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, starting component load');
    loadCommonComponents();
});

// Initialize search functionality
function initSearch() {
    // Search form submission
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchInput = this.querySelector('.search-input');
            const query = searchInput.value.trim();
            
            if (!query) {
                e.preventDefault();
                searchInput.focus();
            }
            // Form will naturally submit to search.html?q=[query]
        });
    }

    // Mobile search toggle
    const searchBtn = document.querySelector('.search-btn');
    const searchBar = document.querySelector('.search-bar');
    
    if (searchBtn && searchBar) {
        searchBtn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!searchBar.classList.contains('active')) {
                    e.preventDefault();
                    searchBar.classList.add('active');
                    searchBar.querySelector('.search-input').focus();
                }
            }
        });
        
        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                searchBar.classList.contains('active') &&
                !searchBar.contains(e.target) &&
                e.target !== searchBtn) {
                searchBar.classList.remove('active');
            }
        });
    }
}

// Call this in your loadCommonComponents function
document.addEventListener('DOMContentLoaded', initSearch);


// Initialize navigation functionality
function initNavigation() {
    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.mobile-overlay');
    
    if (menuBtn && navMenu && overlay) {
        menuBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', isActive);
            menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            overlay.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
        
        overlay.addEventListener('click', () => {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
        });
    }

    // Horizontal navigation controls
    const navScrollContainer = document.querySelector('.nav-scroll-container');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navScrollContainer && navMenu) {
        const checkNavigation = () => {
            const containerWidth = navScrollContainer.offsetWidth;
            const menuWidth = navMenu.scrollWidth;
            
            if (menuWidth > containerWidth) {
                let controls = navScrollContainer.querySelector('.nav-controls');
                if (!controls) {
                    controls = document.createElement('div');
                    controls.className = 'nav-controls';
                    controls.innerHTML = `
                        <div class="nav-control nav-prev"><i class="fas fa-chevron-left"></i></div>
                        <div class="nav-control nav-next"><i class="fas fa-chevron-right"></i></div>
                    `;
                    navScrollContainer.appendChild(controls);
                    
                    const prevBtn = controls.querySelector('.nav-prev');
                    const nextBtn = controls.querySelector('.nav-next');
                    let scrollPosition = 0;
                    const scrollStep = 150;
                    
                    prevBtn.addEventListener('click', () => {
                        scrollPosition = Math.max(0, scrollPosition - scrollStep);
                        navMenu.style.transform = `translateX(-${scrollPosition}px)`;
                        updateControls();
                    });
                    
                    nextBtn.addEventListener('click', () => {
                        const maxScroll = menuWidth - containerWidth;
                        scrollPosition = Math.min(maxScroll, scrollPosition + scrollStep);
                        navMenu.style.transform = `translateX(-${scrollPosition}px)`;
                        updateControls();
                    });
                    
                    function updateControls() {
                        prevBtn.style.opacity = scrollPosition > 0 ? 1 : 0.5;
                        nextBtn.style.opacity = scrollPosition < (menuWidth - containerWidth) ? 1 : 0.5;
                    }
                    
                    updateControls();
                }
                controls.style.display = 'flex';
            } else {
                const controls = navScrollContainer.querySelector('.nav-controls');
                if (controls) {
                    controls.style.display = 'none';
                    navMenu.style.transform = 'translateX(0)';
                }
            }
        };
        
        // Check on load and resize
        checkNavigation();
        window.addEventListener('resize', checkNavigation);
    }

    // Search functionality
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchInput = this.querySelector('.search-input');
            if (!searchInput.value.trim()) {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // Mobile search toggle
    const searchBtn = document.querySelector('.search-btn');
    const searchBar = document.querySelector('.search-bar');
    
    if (searchBtn && searchBar) {
        searchBtn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!searchBar.classList.contains('active')) {
                    e.preventDefault();
                    searchBar.classList.add('active');
                    searchBar.querySelector('.search-input').focus();
                }
            }
        });
        
        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                searchBar.classList.contains('active') &&
                !searchBar.contains(e.target) &&
                e.target !== searchBtn) {
                searchBar.classList.remove('active');
            }
        });
    }
}

// Initialize when components are loaded
document.addEventListener('commonComponentsLoaded', initNavigation);
