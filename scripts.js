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

async function loadCommonComponents() {
    try {
        const existingWrapper = document.querySelector('.top-wrapper');
        if (existingWrapper) existingWrapper.remove();

        document.body.insertAdjacentHTML('afterbegin', `<div class="top-wrapper"></div>`);

        const headerLoaded = await loadComponent('/kuwaitnews/includes/header.html', '.top-wrapper');
        if (!headerLoaded) throw new Error('Header failed to load');

        const navLoaded = await loadComponent('/kuwaitnews/includes/navigation.html', '.top-wrapper');
        if (!navLoaded) throw new Error('Navigation failed to load');

        const menuBtn = document.querySelector('.menu-btn');
        const navMenuToggle = document.querySelector('.nav-menu-toggle');
        if (menuBtn && navMenuToggle) {
            menuBtn.addEventListener('click', () => {
                const isActive = navMenuToggle.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', isActive);
                menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
                if (isActive) {
                    document.querySelectorAll('.nav-menu-horizontal .dropdown').forEach(dropdown => {
                        dropdown.classList.remove('open');
                    });
                }
            });

            if (window.innerWidth >= 769) {
                menuBtn.addEventListener('mouseenter', () => {
                    navMenuToggle.classList.add('active');
                    menuBtn.setAttribute('aria-expanded', 'true');
                    menuBtn.innerHTML = '<i class="fas fa-times"></i>';
                    document.querySelectorAll('.nav-menu-horizontal .dropdown').forEach(dropdown => {
                        dropdown.classList.remove('open');
                    });
                });

                menuBtn.addEventListener('mouseleave', () => {
                    if (!navMenuToggle.classList.contains('active')) {
                        navMenuToggle.classList.remove('active');
                        menuBtn.setAttribute('aria-expanded', 'false');
                        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });

                navMenuToggle.addEventListener('mouseleave', () => {
                    if (!menuBtn.matches(':hover')) {
                        navMenuToggle.classList.remove('active');
                        menuBtn.setAttribute('aria-expanded', 'false');
                        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                        document.querySelectorAll('.nav-menu-toggle .dropdown').forEach(dropdown => {
                            dropdown.classList.remove('open');
                        });
                    }
                });
            }
        }

        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const dropdown = toggle.closest('.dropdown');
                e.preventDefault();
                if (dropdown) {
                    document.querySelectorAll('.dropdown').forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('open');
                        }
                    });
                    dropdown.classList.toggle('open');
                    if (dropdown.closest('.nav-menu-horizontal') && dropdown.classList.contains('open')) {
                        navMenuToggle.classList.remove('active');
                        menuBtn.setAttribute('aria-expanded', 'false');
                        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            });
        });

        if (window.innerWidth >= 769) {
            const horizontalDropdowns = document.querySelectorAll('.nav-menu-horizontal .dropdown');
            horizontalDropdowns.forEach(dropdown => {
                dropdown.addEventListener('mouseleave', () => {
                    dropdown.classList.remove('open');
                });
            });
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown') && !e.target.closest('.menu-btn')) {
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });
    } catch (error) {
        console.error('Error in loadCommonComponents:', error);
    }
}

const style = document.createElement('style');
style.textContent = `
    .top-wrapper {
        width: 100%;
        position: relative;
        z-index: 1000;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    loadCommonComponents();
});
