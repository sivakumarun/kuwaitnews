// scripts.js
async function loadComponent(url, targetSelector, position) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
        const content = await response.text();
        const target = document.querySelector(targetSelector);
        if (target) {
            if (position === 'afterbegin') {
                target.insertAdjacentHTML('afterbegin', content);
            } else if (position === 'afterend') {
                target.insertAdjacentHTML('afterend', content);
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}


function initMobileMenu() {
    const menuBtns = document.querySelectorAll('.menu-btn');
    const navContent = document.querySelector('.nav-content');
    if (!menuBtns || !navContent) {
        console.warn('Mobile menu elements not found');
        return;
    }
    const toggleMenu = () => {
        const isExpanded = menuBtns[0].getAttribute('aria-expanded') === 'true';
        menuBtns.forEach(btn => {
            btn.setAttribute('aria-expanded', !isExpanded);
            btn.innerHTML = isExpanded ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
        });
        navContent.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    };
    const closeMenu = () => {
        menuBtns.forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = '<i class="fas fa-bars"></i>';
        });
        navContent.classList.remove('active');
        document.body.style.overflow = '';
    };
    menuBtns.forEach(btn => btn.addEventListener('click', toggleMenu));
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', (e) => {
        if (!navContent.contains(e.target) && !Array.from(menuBtns).includes(e.target)) {
            closeMenu();
        }
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

function setActiveNavLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPath || href === `.${currentPath}`) {
            link.classList.add('active');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCommonComponents();
});
