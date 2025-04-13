function initNavigation() {
    // Desktop hover dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        // Desktop behavior
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
        
        // Mobile behavior
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const menu = dropdown.querySelector('.dropdown-menu');
                    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                }
            });
        }
    });

    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const mobileMenu = document.querySelector('.nav-menu-toggle');
            mobileMenu.classList.toggle('active');
        });
    }
}
