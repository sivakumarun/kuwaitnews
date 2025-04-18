// Navigation Initialization
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNav = document.querySelector('.primary-nav');
    
    // Mobile menu toggle
    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            primaryNav.classList.toggle('active');
            menuToggle.innerHTML = primaryNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Mobile dropdowns
    document.querySelectorAll('.nav-item-with-dropdown .dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parentItem = this.closest('.nav-item-with-dropdown');
                parentItem.classList.toggle('active');
                
                // Close other open dropdowns
                document.querySelectorAll('.nav-item-with-dropdown').forEach(item => {
                    if (item !== parentItem) {
                        item.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item-with-dropdown') {
            document.querySelectorAll('.nav-item-with-dropdown').forEach(item => {
                item.classList.remove('active');
            });
        }
    });
}

// Add to your existing loadCommonComponents function
async function loadCommonComponents() {
    try {
        // ... your existing code ...
        
        // Initialize navigation after loading
        initNavigation();
        
        // ... rest of your code ...
    } catch (error) {
        console.error('Error loading components:', error);
    }
}
