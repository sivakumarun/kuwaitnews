// Function to load HTML components
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

// Main function to load and initialize components
async function loadCommonComponents() {
    try {
        // Clear any existing wrappers to prevent duplicates
        const existingWrapper = document.querySelector('.top-wrapper');
        if (existingWrapper) existingWrapper.remove();

        // Create the main wrapper structure
        document.body.insertAdjacentHTML('afterbegin', `
            <div class="top-wrapper">
                <div class="mobile-overlay"></div>
            </div>
        `);

        // Load header and navigation components
        await Promise.all([
            loadComponent('/kuwaitnews/includes/header.html', '.top-wrapper'),
            loadComponent('/kuwaitnews/includes/navigation.html', '.top-wrapper')
        ]);

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

        // Initialize search functionality
        const searchForm = document.querySelector('.search-form');
        const searchBtn = document.querySelector('.search-btn');
        const searchBar = document.querySelector('.search-bar');
        
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                const searchInput = this.querySelector('.search-input');
                if (!searchInput.value.trim()) {
                    e.preventDefault();
                    searchInput.focus();
                }
            });
        }
        
        if (searchBtn && searchBar) {
            searchBtn.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    searchBar.classList.toggle('active');
                    if (searchBar.classList.contains('active')) {
                        searchBar.querySelector('.search-input').focus();
                    }
                }
            });
        }

        // Initialize horizontal navigation scrolling if needed
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
                    }
                    controls.style.display = 'flex';
                } else {
                    const controls = navScrollContainer.querySelector('.nav-controls');
                    if (controls) controls.style.display = 'none';
                    navMenu.style.transform = 'translateX(0)';
                }
            };
            
            checkNavigation();
            window.addEventListener('resize', checkNavigation);
        }

        document.dispatchEvent(new Event('commonComponentsLoaded'));
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Global styles for the components
const style = document.createElement('style');
style.textContent = `
    .top-wrapper {
        width: 100%;
        background: linear-gradient(135deg, #CE1126, #007A3D);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    /* Desktop Styles */
    @media (min-width: 769px) {
        .header-container {
            justify-content: center;
        }
        
        .menu-btn {
            display: none !important;
        }
        
        .nav-menu {
            display: flex !important;
        }
        
        .nav-container {
            background: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
    }
    
    /* Mobile Styles */
    @media (max-width: 768px) {
        .top-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            min-height: 70px;
        }
        
        .menu-btn {
            order: -1;
            margin-right: 0.5rem;
        }
        
        .header-container {
            flex-grow: 1;
            justify-content: center;
        }
        
        .nav-container {
            order: 1;
            background: transparent;
            box-shadow: none;
        }
        
        .mobile-overlay {
            display: block;
        }
    }
    
    /* Navigation Controls */
    .nav-controls {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        display: none;
        align-items: center;
        background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 30%);
        padding-left: 30px;
        z-index: 2;
    }
    
    .nav-control {
        background: white;
        border: 1px solid #eee;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-left: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    body.nav-open {
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Start initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', loadCommonComponents);
